import express from "express";
import http from "http";
import path from "path";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";

interface RoomData {
  id: string;
  gameType: "jeopardy" | "most-likely" | "wheel" | "general" | string;
  state: Record<string, unknown>;
  lastSpin?: {
    startAngle: number;
    targetAngle: number;
    duration: number;
    startTime: number;
    timestamp: number;
  };
  lastBuzzer?: {
    player: string;
    timestamp: number;
  };
  lastSound?: {
    sound: string;
    meta?: Record<string, unknown>;
    timestamp: number;
  };
  lastAction?: {
    action: string;
    payload?: Record<string, unknown>;
    timestamp: number;
  };
  lastUpdate: number;
}

export interface LeaderboardRecord {
  id: string; // key: `${game}_${username.toLowerCase()}`
  username: string;
  avatar: string;
  game: string;
  wins: number;
  highScore: number;
  totalScore: number;
  gamesPlayed: number;
  lastUpdated: number;
  verifiedWin?: boolean;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  username: string;
  avatar: string;
  text: string;
  type: "chat" | "win" | "score" | "system" | "cheer";
  game?: string;
  score?: number;
  timestamp: number;
  badge?: string;
}

const rooms = new Map<string, RoomData>();
const roomClients = new Map<string, Set<WebSocket>>();
const allClients = new Set<WebSocket>();
const leaderboardRecords = new Map<string, LeaderboardRecord>();
const chatHistory: ChatMessage[] = [];

// Seed default champions
const INITIAL_CHAMPIONS: LeaderboardRecord[] = [
  { id: 'wheel_dionlyonee', username: 'Dionlyonee', avatar: '👑', game: 'wheel', wins: 14, highScore: 54200, totalScore: 142500, gamesPlayed: 18, lastUpdated: Date.now() - 3600000 },
  { id: 'wheel_spinqueen', username: 'SpinQueen', avatar: '🎡', game: 'wheel', wins: 9, highScore: 38500, totalScore: 89000, gamesPlayed: 12, lastUpdated: Date.now() - 7200000 },
  { id: 'wheel_puzzlemaster', username: 'PuzzleMaster', avatar: '🧩', game: 'wheel', wins: 6, highScore: 27000, totalScore: 61500, gamesPlayed: 9, lastUpdated: Date.now() - 14400000 },
  { id: 'trivia_brainiacdion', username: 'BrainiacDion', avatar: '🧠', game: 'trivia', wins: 16, highScore: 4800, totalScore: 19200, gamesPlayed: 20, lastUpdated: Date.now() - 5400000 },
  { id: 'trivia_quickdraw', username: 'QuickDraw', avatar: '🎯', game: 'trivia', wins: 10, highScore: 3900, totalScore: 14100, gamesPlayed: 13, lastUpdated: Date.now() - 10800000 },
  { id: 'jeopardy_triviaking', username: 'TriviaKing', avatar: '🏆', game: 'jeopardy', wins: 11, highScore: 28400, totalScore: 94000, gamesPlayed: 15, lastUpdated: Date.now() - 9000000 },
  { id: 'jeopardy_buzzerbeast', username: 'BuzzerBeast', avatar: '⚡', game: 'jeopardy', wins: 7, highScore: 19600, totalScore: 52000, gamesPlayed: 11, lastUpdated: Date.now() - 18000000 },
  { id: 'word-reveal_cluehunter', username: 'ClueHunter', avatar: '🟩', game: 'word-reveal', wins: 8, highScore: 3200, totalScore: 11500, gamesPlayed: 10, lastUpdated: Date.now() - 21600000 },
  { id: 'speak-out_rapidtongue', username: 'RapidTongue', avatar: '🎤', game: 'speak-out', wins: 12, highScore: 5100, totalScore: 16800, gamesPlayed: 14, lastUpdated: Date.now() - 28800000 },
  { id: 'guess-lyrics_melodysoul', username: 'MelodySoul', avatar: '🎵', game: 'guess-lyrics', wins: 9, highScore: 4200, totalScore: 12600, gamesPlayed: 11, lastUpdated: Date.now() - 36000000 },
  { id: 'hangman_noslimedunk', username: 'NoSlimeDunk', avatar: '🔤', game: 'hangman', wins: 7, highScore: 2800, totalScore: 9400, gamesPlayed: 9, lastUpdated: Date.now() - 43200000 },
];
INITIAL_CHAMPIONS.forEach(c => leaderboardRecords.set(c.id, c));

chatHistory.push(
  { id: 'msg_init_1', roomId: 'DION1', username: 'SYSTEM', avatar: '👑', text: 'Welcome to Dionlyonee Live Game Show Arena! Syncing real-time scores & chat.', type: 'system', timestamp: Date.now() - 300000 },
  { id: 'msg_init_2', roomId: 'DION1', username: 'TikTokFan_22', avatar: '🔥', text: 'Hyped for the next live showdown!', type: 'chat', timestamp: Date.now() - 120000 },
  { id: 'msg_init_3', roomId: 'DION1', username: 'SpinQueen', avatar: '🎡', text: 'Just logged $38,500 on Wheel of Fortune! 🏆', type: 'win', game: 'wheel', score: 38500, timestamp: Date.now() - 60000 }
);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API: Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString(), totalRooms: rooms.size });
  });

  // API: Verify Host Passcode (unlocked per user request)
  app.post("/api/verify-host", (_req, res) => {
    res.json({ success: true, authorized: true, message: "Authorized as Host (Unlocked)" });
  });

  // API: Create or initialize a room
  app.post("/api/rooms/create", (req, res) => {
    const roomId = (req.body.roomId || "DION1").toUpperCase();
    const gameType = req.body.gameType || "wheel";

    let room = rooms.get(roomId);
    if (!room) {
      room = {
        id: roomId,
        gameType: gameType as any,
        state: {},
        lastUpdate: Date.now(),
      };
      rooms.set(roomId, room);
    } else {
      room.gameType = gameType as any;
      room.lastUpdate = Date.now();
    }

    res.json({ success: true, roomId, gameType: room.gameType, room });
  });

  // API: Get Room State (supports HTTP polling for mobile browsers)
  app.get("/api/rooms/:roomId", (req, res) => {
    const roomId = (req.params.roomId || "DION1").toUpperCase();
    const room = rooms.get(roomId);
    const connectedCount = roomClients.get(roomId)?.size || 0;
    if (room) {
      res.json({ success: true, room, connectedCount });
    } else {
      res.json({ success: true, room: null, connectedCount });
    }
  });

  // API: Update Room State
  app.post("/api/rooms/:roomId/state", (req, res) => {
    const roomId = (req.params.roomId || "DION1").toUpperCase();
    const { state, gameType, sound } = req.body;

    const existing = rooms.get(roomId);
    const updatedRoom: RoomData = {
      id: roomId,
      gameType: gameType || existing?.gameType || "wheel",
      state: state || existing?.state || {},
      lastSpin: existing?.lastSpin,
      lastBuzzer: existing?.lastBuzzer,
      lastSound: sound ? { sound: String(sound), timestamp: Date.now() } : existing?.lastSound,
      lastUpdate: Date.now(),
    };

    rooms.set(roomId, updatedRoom);

    // Broadcast to connected WebSocket clients in this room
    broadcastToRoom(roomId, {
      type: "ROOM_STATE",
      roomId,
      gameType: updatedRoom.gameType,
      state: updatedRoom.state,
      sound: sound || null,
      timestamp: updatedRoom.lastUpdate,
    });

    res.json({ success: true, timestamp: updatedRoom.lastUpdate });
  });

  // API: Post Sound Event Broadcast
  app.post("/api/rooms/:roomId/sound", (req, res) => {
    const roomId = (req.params.roomId || "DION1").toUpperCase();
    const { sound, meta } = req.body;

    if (!sound) {
      return res.status(400).json({ error: "Sound name is required" });
    }

    const existing = rooms.get(roomId) || {
      id: roomId,
      gameType: "wheel" as const,
      state: {},
      lastUpdate: Date.now(),
    };

    const soundData = {
      sound: String(sound),
      meta: meta || {},
      timestamp: Date.now(),
    };

    existing.lastSound = soundData;
    existing.lastUpdate = Date.now();
    rooms.set(roomId, existing);

    broadcastToRoom(roomId, {
      type: "PLAY_SOUND",
      roomId,
      sound: soundData.sound,
      meta: soundData.meta,
      timestamp: soundData.timestamp,
    });

    res.json({ success: true, sound: soundData });
  });

  // API: Post Wheel Spin Event
  app.post("/api/rooms/:roomId/spin", (req, res) => {
    const roomId = (req.params.roomId || "DION1").toUpperCase();
    const { startAngle, targetAngle, duration } = req.body;

    const existing = rooms.get(roomId) || {
      id: roomId,
      gameType: "wheel" as const,
      state: {},
      lastUpdate: Date.now(),
    };

    const spinData = {
      startAngle: Number(startAngle) || 0,
      targetAngle: Number(targetAngle) || 0,
      duration: Number(duration) || 4000,
      startTime: Date.now(),
      timestamp: Date.now(),
    };

    existing.lastSpin = spinData;
    existing.lastUpdate = Date.now();
    rooms.set(roomId, existing);

    broadcastToRoom(roomId, {
      type: "WHEEL_SPIN",
      roomId,
      ...spinData,
    });

    res.json({ success: true, spin: spinData });
  });

  // API: Post Buzzer Event
  app.post("/api/rooms/:roomId/buzz", (req, res) => {
    const roomId = (req.params.roomId || "DION1").toUpperCase();
    const { player } = req.body;

    const existing = rooms.get(roomId) || {
      id: roomId,
      gameType: "wheel" as const,
      state: {},
      lastUpdate: Date.now(),
    };

    const buzzData = {
      player: player || "Co-Host",
      timestamp: Date.now(),
    };

    existing.lastBuzzer = buzzData;
    rooms.set(roomId, existing);

    broadcastToRoom(roomId, {
      type: "COHOST_BUZZ",
      roomId,
      ...buzzData,
    });

    res.json({ success: true, buzzer: buzzData });
  });

  // API: Post Host Phone Controller Action Event
  app.post("/api/rooms/:roomId/action", (req, res) => {
    const roomId = (req.params.roomId || "DION1").toUpperCase();
    const { action, payload } = req.body;

    if (!action) {
      return res.status(400).json({ error: "Action name is required" });
    }

    const existing = rooms.get(roomId) || {
      id: roomId,
      gameType: "wheel",
      state: {},
      lastUpdate: Date.now(),
    };

    const actionData = {
      action: String(action),
      payload: payload || {},
      timestamp: Date.now(),
    };

    existing.lastAction = actionData;
    existing.lastUpdate = Date.now();
    rooms.set(roomId, existing);

    broadcastToRoom(roomId, {
      type: "HOST_ACTION",
      roomId,
      ...actionData,
    });

    res.json({ success: true, action: actionData });
  });

  // Clean URL route aliases
  const routes = [
    { path: "/remote", file: "remote.html" },
    { path: "/remote.html", file: "remote.html" },
    { path: "/controller", file: "remote.html" },
    { path: "/cohost-join", file: "cohost-join.html" },
    { path: "/cohost-join.html", file: "cohost-join.html" },
    { path: "/cohost", file: "cohost-join.html" },
    { path: "/cohost.html", file: "cohost-join.html" },

    { path: "/wheel-host", file: "wheel-host.html" },
    { path: "/wheel-live", file: "wheel-live.html" },
    { path: "/wheel-cohost", file: "wheel-cohost.html" },
    { path: "/wheel/host", file: "wheel/host/index.html" },
    { path: "/wheel/live", file: "wheel/live/index.html" },
    { path: "/wheel/cohost", file: "wheel/cohost/index.html" },
    { path: "/wheel/waiting", file: "wheel/waiting/index.html" },
    { path: "/wheel", file: "wheel/index.html" },

    { path: "/trivia/host", file: "trivia/host/index.html" },
    { path: "/trivia/live", file: "trivia/live/index.html" },
    { path: "/trivia/cohost", file: "trivia/cohost/index.html" },
    { path: "/trivia/waiting", file: "trivia/waiting/index.html" },
    { path: "/trivia", file: "trivia/index.html" },

    { path: "/jeopardy-host", file: "jeopardy-host.html" },
    { path: "/jeopardy-live", file: "jeopardy-live.html" },
    { path: "/jeopardy-cohost", file: "jeopardy-cohost.html" },
    { path: "/jeopardy/host", file: "jeopardy/host/index.html" },
    { path: "/jeopardy/live", file: "jeopardy/live/index.html" },
    { path: "/jeopardy/cohost", file: "jeopardy/cohost/index.html" },
    { path: "/jeopardy/waiting", file: "jeopardy/waiting/index.html" },
    { path: "/jeopardy", file: "jeopardy/index.html" },

    { path: "/word-reveal/host", file: "word-reveal/host/index.html" },
    { path: "/word-reveal/live", file: "word-reveal/live/index.html" },
    { path: "/word-reveal/cohost", file: "word-reveal/cohost/index.html" },
    { path: "/word-reveal/waiting", file: "word-reveal/waiting/index.html" },
    { path: "/word-reveal", file: "word-reveal/index.html" },

    { path: "/speak-out/host", file: "speak-out/host/index.html" },
    { path: "/speak-out/live", file: "speak-out/live/index.html" },
    { path: "/speak-out/cohost", file: "speak-out/cohost/index.html" },
    { path: "/speak-out/waiting", file: "speak-out/waiting/index.html" },
    { path: "/speak-out", file: "speak-out/index.html" },

    { path: "/most-likely-host", file: "most-likely-host.html" },
    { path: "/most-likely-live", file: "most-likely-live.html" },
    { path: "/dual-view", file: "dual-view.html" },
    { path: "/split-screen", file: "dual-view.html" },
    { path: "/leaderboard", file: "leaderboard.html" },
    { path: "/hub", file: "index.html" },
  ];

  app.get(["/dionlyonee-pon-di-app.png", "*/dionlyonee-pon-di-app.png"], (_req, res) => {
    res.sendFile(path.join(process.cwd(), "dionlyonee-pon-di-app.png"));
  });

  app.get(["/dionlyonee-pon-di-app.svg", "*/dionlyonee-pon-di-app.svg"], (_req, res) => {
    res.sendFile(path.join(process.cwd(), "dionlyonee-pon-di-app.svg"));
  });

  // =========================================
  // API: REAL-TIME LEADERBOARD & CHAT ENDPOINTS
  // =========================================

  // Get Leaderboard (supports per-game filtering and sorting)
  app.get("/api/leaderboard", (req, res) => {
    const game = req.query.game ? String(req.query.game).toLowerCase() : "all";
    const sortBy = String(req.query.sortBy || "wins");
    let records = Array.from(leaderboardRecords.values());

    if (game !== "all") {
      records = records.filter((r) => r.game.toLowerCase() === game);
    }

    records.sort((a, b) => {
      if (sortBy === "highScore") {
        return b.highScore - a.highScore || b.wins - a.wins;
      } else if (sortBy === "totalScore") {
        return b.totalScore - a.totalScore || b.wins - a.wins;
      } else {
        return b.wins - a.wins || b.highScore - a.highScore;
      }
    });

    const totalWins = records.reduce((acc, r) => acc + (r.wins || 0), 0);
    const highestScore = records.reduce((max, r) => Math.max(max, r.highScore || 0), 0);

    res.json({
      success: true,
      game,
      count: records.length,
      stats: { totalWins, highestScore, topPlayer: records[0]?.username || null },
      records,
    });
  });

  // Record a Win or Score for any player & game
  app.post("/api/leaderboard/record", (req, res) => {
    const { username, avatar, game, score, isWin, verifiedWin } = req.body;
    const cleanUser = String(username || "Contestant").replace(/^@/, "").trim();
    const cleanGame = String(game || "wheel").toLowerCase();
    const numScore = Number(score) || 0;
    const key = `${cleanGame}_${cleanUser.toLowerCase()}`;

    let record = leaderboardRecords.get(key);
    if (!record) {
      record = {
        id: key,
        username: cleanUser,
        avatar: avatar || "⭐",
        game: cleanGame,
        wins: isWin ? 1 : 0,
        highScore: numScore,
        totalScore: numScore,
        gamesPlayed: 1,
        lastUpdated: Date.now(),
        verifiedWin: Boolean(verifiedWin || isWin),
      };
    } else {
      if (isWin) record.wins += 1;
      record.highScore = Math.max(record.highScore, numScore);
      record.totalScore += numScore;
      record.gamesPlayed += 1;
      record.lastUpdated = Date.now();
      if (isWin) record.verifiedWin = true;
      if (avatar) record.avatar = avatar;
    }

    leaderboardRecords.set(key, record);

    // Auto-create celebratory chat message
    const chatMsg: ChatMessage = {
      id: "msg_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      roomId: "DION1",
      username: "ARENA SYSTEM",
      avatar: isWin ? "🏆" : "⚡",
      text: isWin
        ? `🏆 VICTORY! @${cleanUser} conquered ${cleanGame.toUpperCase()} with ${numScore.toLocaleString()}! 👑`
        : `⚡ SCORE! @${cleanUser} achieved ${numScore.toLocaleString()} in ${cleanGame.toUpperCase()}!`,
      type: isWin ? "win" : "score",
      game: cleanGame,
      score: numScore,
      timestamp: Date.now(),
      badge: isWin ? "CHAMPION" : "SCORE",
    };

    chatHistory.push(chatMsg);
    if (chatHistory.length > 150) chatHistory.shift();

    // Broadcast in real-time to all connected WebSocket clients
    broadcastToAll({
      type: "LEADERBOARD_UPDATE",
      record,
      timestamp: Date.now(),
    });

    broadcastToAll({
      type: "CHAT_MESSAGE",
      message: chatMsg,
      timestamp: Date.now(),
    });

    res.json({ success: true, record, chatMessage: chatMsg });
  });

  // Reset or re-seed leaderboard (Host admin action)
  app.post("/api/leaderboard/reset", (req, res) => {
    const game = req.body.game ? String(req.body.game).toLowerCase() : null;
    if (game && game !== "all") {
      Array.from(leaderboardRecords.keys()).forEach((key) => {
        if (key.startsWith(`${game}_`)) {
          leaderboardRecords.delete(key);
        }
      });
    } else {
      leaderboardRecords.clear();
      INITIAL_CHAMPIONS.forEach((c) => leaderboardRecords.set(c.id, { ...c }));
    }

    broadcastToAll({
      type: "LEADERBOARD_RESET",
      game,
      records: Array.from(leaderboardRecords.values()),
      timestamp: Date.now(),
    });

    res.json({ success: true, count: leaderboardRecords.size });
  });

  // Get Lobby & Stream Chat
  app.get("/api/chat", (req, res) => {
    const roomId = req.query.roomId ? String(req.query.roomId).toUpperCase() : null;
    let list = chatHistory;
    if (roomId) {
      list = chatHistory.filter((m) => !m.roomId || m.roomId === roomId || m.roomId === "DION1");
    }
    res.json({ success: true, count: list.length, messages: list.slice(-80) });
  });

  // Post Chat Message
  app.post("/api/chat/message", (req, res) => {
    const { username, avatar, text, roomId, type, game, score, badge } = req.body;
    if (!text || !String(text).trim()) {
      return res.status(400).json({ error: "Message text is required" });
    }

    const msg: ChatMessage = {
      id: "msg_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      roomId: String(roomId || "DION1").toUpperCase(),
      username: String(username || "Contestant").replace(/^@/, "").trim(),
      avatar: avatar || "👤",
      text: String(text).trim(),
      type: type || "chat",
      game,
      score: score ? Number(score) : undefined,
      timestamp: Date.now(),
      badge: badge || (String(username).toLowerCase().includes("host") ? "HOST" : "PLAYER"),
    };

    chatHistory.push(msg);
    if (chatHistory.length > 150) chatHistory.shift();

    broadcastToAll({
      type: "CHAT_MESSAGE",
      message: msg,
      timestamp: Date.now(),
    });

    res.json({ success: true, message: msg });
  });

  routes.forEach((r) => {
    app.get(r.path, (_req, res) => {
      const filePath = path.join(
        process.cwd(),
        process.env.NODE_ENV === "production" ? "dist" : "",
        r.file
      );
      res.sendFile(filePath);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = http.createServer(app);

  // WebSocket Server setup
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws: WebSocket) => {
    let currentRoomId = "";
    allClients.add(ws);

    ws.on("message", (rawMessage: string) => {
      try {
        const message = JSON.parse(rawMessage.toString());

        if (message.type === "JOIN_ROOM") {
          const roomId = (message.roomId || "DION1").toUpperCase();
          currentRoomId = roomId;

          if (!roomClients.has(roomId)) {
            roomClients.set(roomId, new Set());
          }
          roomClients.get(roomId)!.add(ws);

          // Send back current room state if exists
          const existingRoom = rooms.get(roomId);
          if (existingRoom) {
            ws.send(
              JSON.stringify({
                type: "ROOM_STATE",
                roomId,
                gameType: existingRoom.gameType,
                state: existingRoom.state,
                timestamp: existingRoom.lastUpdate,
              })
            );
          }
        } else if (message.type === "GET_LEADERBOARD") {
          ws.send(
            JSON.stringify({
              type: "LEADERBOARD_SYNC",
              records: Array.from(leaderboardRecords.values()),
              timestamp: Date.now(),
            })
          );
        } else if (message.type === "LEADERBOARD_UPDATE" || message.type === "RECORD_WIN" || message.type === "RECORD_SCORE") {
          const rec = message.record || message;
          if (rec && rec.id) {
            leaderboardRecords.set(rec.id, rec);
            broadcastToAll({
              type: "LEADERBOARD_UPDATE",
              record: rec,
              timestamp: Date.now(),
            }, ws);
          }
        } else if (message.type === "CHAT_MESSAGE") {
          const msg = message.message || message;
          if (msg && msg.text) {
            chatHistory.push(msg);
            if (chatHistory.length > 150) chatHistory.shift();
            broadcastToAll({
              type: "CHAT_MESSAGE",
              message: msg,
              timestamp: Date.now(),
            }, ws);
          }
        } else if (message.type === "UPDATE_STATE") {
          const roomId = (message.roomId || currentRoomId || "DION1").toUpperCase();
          const updatedRoom: RoomData = {
            id: roomId,
            gameType: message.gameType || "jeopardy",
            state: message.state || {},
            lastUpdate: Date.now(),
          };

          rooms.set(roomId, updatedRoom);

          broadcastToRoom(
            roomId,
            {
              type: "ROOM_STATE",
              roomId,
              gameType: updatedRoom.gameType,
              state: updatedRoom.state,
              sound: message.sound || null,
              timestamp: updatedRoom.lastUpdate,
            },
            ws // don't echo back to sender if desired, or broadcast to all
          );
        } else if (message.type === "WHEEL_SPIN") {
          const roomId = (message.roomId || currentRoomId || "DION1").toUpperCase();
          let existing = rooms.get(roomId);
          if (!existing) {
            existing = {
              id: roomId,
              gameType: "wheel",
              state: {},
              lastUpdate: Date.now(),
            };
            rooms.set(roomId, existing);
          }
          existing.lastSpin = {
            startAngle: Number(message.startAngle) || 0,
            targetAngle: Number(message.targetAngle) || 0,
            duration: Number(message.duration) || 4000,
            startTime: Number(message.startTime) || Date.now(),
            timestamp: Date.now(),
          };
          existing.lastUpdate = Date.now();
          broadcastToRoom(roomId, message, ws);
        } else if (message.type === "PLAY_SOUND" || message.type === "SOUND") {
          const roomId = (message.roomId || currentRoomId || "DION1").toUpperCase();
          const soundName = String(message.sound || message.name || "");
          if (soundName) {
            let existing = rooms.get(roomId);
            if (!existing) {
              existing = {
                id: roomId,
                gameType: "wheel",
                state: {},
                lastUpdate: Date.now(),
              };
              rooms.set(roomId, existing);
            }
            existing.lastSound = {
              sound: soundName,
              meta: message.meta || {},
              timestamp: Date.now(),
            };
            existing.lastUpdate = Date.now();

            broadcastToRoom(
              roomId,
              {
                type: "PLAY_SOUND",
                roomId,
                sound: soundName,
                meta: message.meta || {},
                timestamp: Date.now(),
              },
              ws
            );
          }
        } else if (message.type === "HOST_ACTION") {
          const roomId = (message.roomId || currentRoomId || "DION1").toUpperCase();
          let existing = rooms.get(roomId);
          if (!existing) {
            existing = {
              id: roomId,
              gameType: "wheel",
              state: {},
              lastUpdate: Date.now(),
            };
            rooms.set(roomId, existing);
          }
          existing.lastAction = {
            action: String(message.action),
            payload: message.payload || {},
            timestamp: Date.now(),
          };
          existing.lastUpdate = Date.now();
          broadcastToRoom(roomId, message, ws);
        } else if (message.type === "PING") {
          ws.send(JSON.stringify({ type: "PONG", timestamp: Date.now() }));
        } else {
          // Broadcast other events (SEND_SOUND, COHOST_BUZZ, etc.)
          const roomId = (message.roomId || currentRoomId || "DION1").toUpperCase();
          broadcastToRoom(roomId, message, ws);
        }
      } catch (err) {
        console.warn("WebSocket message error:", err);
      }
    });

    ws.on("close", () => {
      allClients.delete(ws);
      if (currentRoomId && roomClients.has(currentRoomId)) {
        roomClients.get(currentRoomId)!.delete(ws);
        if (roomClients.get(currentRoomId)!.size === 0) {
          roomClients.delete(currentRoomId);
        }
      }
    });
  });

  function broadcastToAll(data: Record<string, unknown>, senderWs?: WebSocket) {
    const payload = JSON.stringify(data);
    allClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && client !== senderWs) {
        try {
          client.send(payload);
        } catch (e) {
          console.warn("WS broadcastAll error:", e);
        }
      }
    });
  }

  function broadcastToRoom(roomId: string, data: Record<string, unknown>, senderWs?: WebSocket) {
    const clients = roomClients.get(roomId);
    if (!clients) return;

    const payload = JSON.stringify(data);
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && client !== senderWs) {
        try {
          client.send(payload);
        } catch (e) {
          console.warn("WS send error:", e);
        }
      }
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

