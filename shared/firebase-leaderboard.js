/**
 * Dionlyonee Playground - Chat-Based Real-Time Leaderboard Component
 * Synchronizes user wins, scores, and live chat across all connected clients via Firebase,
 * WebSocket, BroadcastChannel, and localStorage. Organized per game and all-games cross view.
 */
(function () {
  const GAME_META = {
    'all': { title: 'All Games', icon: '🌐', badge: 'HALL OF FAME', color: '#facc15' },
    'wheel': { title: 'Wheel of Fortune', icon: '🎡', badge: 'MAIN EVENT', color: '#f59e0b', scorePrefix: '$' },
    'trivia': { title: 'Trivia Showdown', icon: '🧠', badge: 'BUZZER ARENA', color: '#38bdf8', scoreSuffix: ' PTS' },
    'jeopardy': { title: 'Dion Jeopardy', icon: '🏆', badge: 'QUIZ SHOW', color: '#10b981', scorePrefix: '$' },
    'word-reveal': { title: 'Word Reveal', icon: '🟩', badge: 'MYSTERY TILES', color: '#4ade80', scoreSuffix: ' PTS' },
    'speak-out': { title: 'Speak Out Challenge', icon: '🎤', badge: 'TONGUE TWISTER', color: '#ec4899', scoreSuffix: ' PTS' },
    'guess-lyrics': { title: 'Guess the Lyrics', icon: '🎵', badge: 'MUSIC ARENA', color: '#a855f7', scoreSuffix: ' PTS' },
    'hangman': { title: 'Hangman Show', icon: '🔤', badge: 'SLIME DUNK', color: '#06b6d4', scoreSuffix: ' PTS' }
  };

  const AVATAR_IMAGES = {
    'https://github.com/user-attachments/assets/16c53dd4-a057-4ba5-9109-68e7f988ac80': 'Fantasy avatar 1',
    'https://github.com/user-attachments/assets/c7c3206d-c954-48ff-b320-c1363be87948': 'Fantasy avatar 2',
    'https://github.com/user-attachments/assets/8a62b1c2-59d1-480f-b299-c5c25782871c': 'Fantasy avatar 3',
    'https://github.com/user-attachments/assets/d636792c-6625-4208-8ddc-009ece0991da': 'Fantasy avatar 4'
  };
  const AVATARS = ['👑', '🦁', '🐯', '💎', '⚡', '🎯', '🌟', '🔥', '🚀', '🌹', '🦊', '🦅', '🏆', ...Object.keys(AVATAR_IMAGES)];
  const renderAvatar = (avatar) => {
    const label = AVATAR_IMAGES[avatar];
    return label
      ? `<img class="dl-avatar-image" src="${avatar}" alt="" aria-label="${label}" />`
      : String(avatar || '⭐').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  };

  // Default seed champions per game so the board is vibrant immediately
  const DEFAULT_SEEDS = [
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
    { id: 'hangman_noslimedunk', username: 'NoSlimeDunk', avatar: '🔤', game: 'hangman', wins: 7, highScore: 2800, totalScore: 9400, gamesPlayed: 9, lastUpdated: Date.now() - 43200000 }
  ];

  const DEFAULT_CHAT = [
    { id: 'c1', roomId: 'DION1', username: 'SYSTEM', avatar: '👑', text: 'Welcome to Dionlyonee Live Arena! Chat, cheer, and track wins in real-time.', type: 'system', timestamp: Date.now() - 600000 },
    { id: 'c2', roomId: 'DION1', username: 'TikTokFan_22', avatar: '🔥', text: 'Ready for the next game show showdown! Let\'s go!', type: 'chat', timestamp: Date.now() - 400000 },
    { id: 'c3', roomId: 'DION1', username: 'Dionlyonee', avatar: '👑', text: 'Wheel of Fortune spin incoming! Tap up the live!', type: 'chat', timestamp: Date.now() - 200000 },
    { id: 'c4', roomId: 'DION1', username: 'SpinQueen', avatar: '🎡', text: 'Just logged $38,500 on Wheel of Fortune! 🏆', type: 'win', game: 'wheel', score: 38500, timestamp: Date.now() - 90000 }
  ];

  class FirebaseLeaderboard {
    constructor() {
      this.records = new Map();
      this.chatMessages = [];
      this.activeGame = 'all';
      this.searchQuery = '';
      this.sortBy = 'wins'; // 'wins' | 'highScore' | 'totalScore' | 'recent'
      this.activeMobileTab = 'leaderboard'; // 'leaderboard' | 'chat'
      
      this.roomId = (window.RoomManager ? window.RoomManager.getRoom() : 'DION1').toUpperCase();
      this.currentUser = this.resolveStoredUser();
      
      this.firebaseApp = null;
      this.firebaseDb = null;
      this.isFirebaseConnected = false;
      this.ws = null;
      this.channel = null;
      this.listeners = [];
      this.chatListeners = [];

      this.initStorage();
      this.initBroadcastChannel();
      this.initWebSocket();
      this.initFirebase();
      this.fetchHttpLeaderboard();
      this.fetchHttpChat();

      // Listen for room changes
      window.addEventListener('roomchange', (e) => {
        if (e.detail && e.detail.roomId) {
          this.roomId = e.detail.roomId.toUpperCase();
          this.render();
        }
      });
    }

    resolveStoredUser() {
      try {
        const stored = localStorage.getItem('dionlyonee_chat_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.username) return parsed;
        }
      } catch (e) {}

      const randomAvatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
      const randomNum = Math.floor(10 + Math.random() * 90);
      const defaultUser = { username: `Contestant_${randomNum}`, avatar: randomAvatar };
      try {
        localStorage.setItem('dionlyonee_chat_user', JSON.stringify(defaultUser));
      } catch (e) {}
      return defaultUser;
    }

    saveCurrentUser(username, avatar) {
      this.currentUser.username = (username || this.currentUser.username).replace(/^@/, '').trim() || 'Contestant';
      if (avatar) this.currentUser.avatar = avatar;
      try {
        localStorage.setItem('dionlyonee_chat_user', JSON.stringify(this.currentUser));
      } catch (e) {}
    }

    initStorage() {
      try {
        const storedRecords = localStorage.getItem('dionlyonee_leaderboard_data');
        if (storedRecords) {
          const parsed = JSON.parse(storedRecords);
          if (Array.isArray(parsed) && parsed.length > 0) {
            parsed.forEach(r => this.records.set(r.id, r));
          }
        }
      } catch (e) {}

      // Seed if empty
      if (this.records.size === 0) {
        DEFAULT_SEEDS.forEach(r => this.records.set(r.id, { ...r }));
        this.persistLocalStorage();
      }

      try {
        const storedChat = localStorage.getItem('dionlyonee_chat_history');
        if (storedChat) {
          const parsed = JSON.parse(storedChat);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.chatMessages = parsed;
          }
        }
      } catch (e) {}

      if (this.chatMessages.length === 0) {
        this.chatMessages = [...DEFAULT_CHAT];
      }
    }

    persistLocalStorage() {
      try {
        const arr = Array.from(this.records.values());
        localStorage.setItem('dionlyonee_leaderboard_data', JSON.stringify(arr));
        localStorage.setItem('dionlyonee_chat_history', JSON.stringify(this.chatMessages.slice(-80)));
      } catch (e) {}
    }

    initBroadcastChannel() {
      if (typeof BroadcastChannel !== 'undefined') {
        try {
          this.channel = new BroadcastChannel('dionlyonee_leaderboard_sync');
          this.channel.onmessage = (e) => {
            this.handleIncomingSync(e.data);
          };
        } catch (e) {}
      }
    }

    initWebSocket() {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws`;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          this.ws.send(JSON.stringify({
            type: 'JOIN_ROOM',
            roomId: this.roomId,
            role: 'lobby-leaderboard'
          }));
        };

        this.ws.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data);
            this.handleIncomingSync(data);
          } catch (err) {}
        };

        this.ws.onclose = () => {
          setTimeout(() => this.initWebSocket(), 4000);
        };
      } catch (e) {}
    }

    initFirebase() {
      // Connect to Firebase Realtime Database if SDK is loaded
      const cfg = window.FirebaseConfig;
      if (!cfg || typeof window.firebase === 'undefined') {
        return;
      }

      try {
        if (!firebase.apps || firebase.apps.length === 0) {
          this.firebaseApp = firebase.initializeApp(cfg);
        } else {
          this.firebaseApp = firebase.app();
        }

        this.firebaseDb = firebase.database();
        this.isFirebaseConnected = true;

        // Sync leaderboards collection
        const lbRef = this.firebaseDb.ref('leaderboards');
        lbRef.on('value', (snapshot) => {
          const val = snapshot.val();
          if (val && typeof val === 'object') {
            Object.values(val).forEach(record => {
              if (record && record.id) {
                this.records.set(record.id, record);
              }
            });
            this.persistLocalStorage();
            this.notifyListeners();
          }
        });

        // Sync chat messages
        const chatRef = this.firebaseDb.ref(`lobby_chat/${this.roomId}`).limitToLast(50);
        chatRef.on('child_added', (snapshot) => {
          const msg = snapshot.val();
          if (msg && !this.chatMessages.some(m => m.id === msg.id)) {
            this.chatMessages.push(msg);
            this.notifyChatListeners(msg);
          }
        });

        this.updateSyncBadge(true, 'FIREBASE RTDB ACTIVE');
      } catch (err) {
        this.isFirebaseConnected = false;
        this.updateSyncBadge(true, 'WEBSOCKET & ROOM SYNC');
      }
    }

    async fetchHttpLeaderboard() {
      try {
        const res = await fetch('/api/leaderboard');
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.records && Array.isArray(data.records)) {
          data.records.forEach(r => this.records.set(r.id, r));
          this.persistLocalStorage();
          this.notifyListeners();
        }
      } catch (e) {}
    }

    async fetchHttpChat() {
      try {
        const res = await fetch(`/api/chat?roomId=${encodeURIComponent(this.roomId)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.messages && Array.isArray(data.messages)) {
          data.messages.forEach(msg => {
            if (!this.chatMessages.some(m => m.id === msg.id)) {
              this.chatMessages.push(msg);
            }
          });
          this.chatMessages.sort((a, b) => a.timestamp - b.timestamp);
          this.notifyChatListeners();
        }
      } catch (e) {}
    }

    handleIncomingSync(data) {
      if (!data) return;

      if (data.type === 'LEADERBOARD_UPDATE' || data.type === 'RECORD_WIN' || data.type === 'RECORD_SCORE') {
        const record = data.record || data;
        if (record && record.id) {
          this.records.set(record.id, record);
          this.persistLocalStorage();
          this.notifyListeners();
        }
      } else if (data.type === 'CHAT_MESSAGE') {
        const msg = data.message || data;
        if (msg && msg.id && !this.chatMessages.some(m => m.id === msg.id)) {
          this.chatMessages.push(msg);
          this.notifyChatListeners(msg);
        }
      }
    }

    broadcastLeaderboardRecord(record) {
      const payload = {
        type: 'LEADERBOARD_UPDATE',
        record,
        timestamp: Date.now()
      };

      if (this.channel) {
        try { this.channel.postMessage(payload); } catch (e) {}
      }
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        try { this.ws.send(JSON.stringify(payload)); } catch (e) {}
      }
      if (this.firebaseDb) {
        try {
          this.firebaseDb.ref(`leaderboards/${record.id}`).set(record);
        } catch (e) {}
      }

      // HTTP API save
      fetch('/api/leaderboard/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      }).catch(() => {});
    }

    broadcastChatMessage(msg) {
      const payload = {
        type: 'CHAT_MESSAGE',
        message: msg,
        roomId: this.roomId,
        timestamp: Date.now()
      };

      if (this.channel) {
        try { this.channel.postMessage(payload); } catch (e) {}
      }
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        try { this.ws.send(JSON.stringify(payload)); } catch (e) {}
      }
      if (this.firebaseDb) {
        try {
          this.firebaseDb.ref(`lobby_chat/${this.roomId}/${msg.id}`).set(msg);
        } catch (e) {}
      }

      fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg)
      }).catch(() => {});
    }

    // RECORD A WIN OR SCORE
    recordWin(game, rawUsername, score = 0, avatar = null) {
      return this.recordResult({
        game,
        username: rawUsername,
        score: Number(score) || 0,
        isWin: true,
        avatar
      });
    }

    recordScore(game, rawUsername, score = 0, avatar = null) {
      return this.recordResult({
        game,
        username: rawUsername,
        score: Number(score) || 0,
        isWin: false,
        avatar
      });
    }

    recordResult({ game, username, score, isWin, avatar }) {
      const cleanGame = (game || 'wheel').toLowerCase();
      const cleanUser = (username || this.currentUser.username).replace(/^@/, '').trim();
      const userAvatar = avatar || this.currentUser.avatar || '⭐';
      const key = `${cleanGame}_${cleanUser.toLowerCase()}`;

      let record = this.records.get(key);
      if (!record) {
        record = {
          id: key,
          username: cleanUser,
          avatar: userAvatar,
          game: cleanGame,
          wins: isWin ? 1 : 0,
          highScore: score,
          totalScore: score,
          gamesPlayed: 1,
          lastUpdated: Date.now(),
          verifiedWin: isWin
        };
      } else {
        if (isWin) record.wins += 1;
        record.highScore = Math.max(record.highScore || 0, score);
        record.totalScore = (record.totalScore || 0) + score;
        record.gamesPlayed = (record.gamesPlayed || 0) + 1;
        record.lastUpdated = Date.now();
        if (isWin) record.verifiedWin = true;
        if (userAvatar) record.avatar = userAvatar;
      }

      this.records.set(key, record);
      this.persistLocalStorage();
      this.broadcastLeaderboardRecord(record);
      this.notifyListeners();

      // Post celebratory chat message
      const gameTitle = (GAME_META[cleanGame] && GAME_META[cleanGame].title) || cleanGame.toUpperCase();
      const scoreFormatted = this.formatScore(score, cleanGame);
      
      const chatText = isWin
        ? `🏆 VICTORY! @${cleanUser} won ${gameTitle} with ${scoreFormatted}! 👑`
        : `⚡ SCORE! @${cleanUser} achieved ${scoreFormatted} in ${gameTitle}!`;

      const msg = {
        id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        roomId: this.roomId,
        username: 'ARENA SYSTEM',
        avatar: isWin ? '🏆' : '⚡',
        text: chatText,
        type: isWin ? 'win' : 'score',
        game: cleanGame,
        score,
        timestamp: Date.now(),
        badge: isWin ? 'CHAMPION' : 'SCORE'
      };

      this.chatMessages.push(msg);
      this.persistLocalStorage();
      this.broadcastChatMessage(msg);
      this.notifyChatListeners(msg);

      // Trigger celebratory audio chime
      if (window.SoundManager && typeof window.SoundManager.playWinSound === 'function') {
        window.SoundManager.playWinSound();
      }

      return record;
    }

    sendChatMessage(text) {
      if (!text || !text.trim()) return;
      const raw = text.trim();

      // Check for slash commands
      if (raw.startsWith('/')) {
        const parts = raw.split(/\s+/);
        const cmd = parts[0].toLowerCase();

        if (cmd === '/win' || cmd === '/victory') {
          // /win [game] [score] [optional player]
          const game = parts[1] || this.activeGame !== 'all' ? this.activeGame : 'wheel';
          const score = parseInt((parts[2] || '1000').replace(/[^0-9]/g, ''), 10) || 1000;
          const player = parts[3] ? parts.slice(3).join(' ') : this.currentUser.username;
          this.recordWin(game, player, score);
          return;
        } else if (cmd === '/score') {
          // /score [game] [score] [optional player]
          const game = parts[1] || this.activeGame !== 'all' ? this.activeGame : 'trivia';
          const score = parseInt((parts[2] || '500').replace(/[^0-9]/g, ''), 10) || 500;
          const player = parts[3] ? parts.slice(3).join(' ') : this.currentUser.username;
          this.recordScore(game, player, score);
          return;
        } else if (cmd === '/cheer' || cmd === '/gift') {
          const target = parts.slice(1).join(' ') || 'the Host';
          const cheerMsg = {
            id: 'msg_' + Date.now(),
            roomId: this.roomId,
            username: this.currentUser.username,
            avatar: this.currentUser.avatar,
            text: `💖 sent a massive cheer to @${target}! Keep the energy high! 🔥`,
            type: 'cheer',
            timestamp: Date.now(),
            badge: 'CHEER'
          };
          this.chatMessages.push(cheerMsg);
          this.persistLocalStorage();
          this.broadcastChatMessage(cheerMsg);
          this.notifyChatListeners(cheerMsg);
          return;
        } else if (cmd === '/help') {
          const helpMsg = {
            id: 'msg_' + Date.now(),
            roomId: this.roomId,
            username: 'BOT',
            avatar: '💡',
            text: 'Commands: /win [game] [score], /score [game] [score], /cheer [player], /help. Tap reaction chips to cheer instantly!',
            type: 'system',
            timestamp: Date.now()
          };
          this.chatMessages.push(helpMsg);
          this.notifyChatListeners(helpMsg);
          return;
        }
      }

      // Normal chat message
      const msg = {
        id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        roomId: this.roomId,
        username: this.currentUser.username,
        avatar: this.currentUser.avatar,
        text: raw,
        type: 'chat',
        timestamp: Date.now(),
        badge: this.currentUser.username.toLowerCase().includes('host') ? 'HOST' : 'PLAYER'
      };

      this.chatMessages.push(msg);
      this.persistLocalStorage();
      this.broadcastChatMessage(msg);
      this.notifyChatListeners(msg);
    }

    formatScore(val, game) {
      const meta = GAME_META[game] || {};
      const num = Number(val || 0);
      if (meta.scorePrefix) {
        return meta.scorePrefix + num.toLocaleString();
      }
      if (meta.scoreSuffix) {
        return num.toLocaleString() + meta.scoreSuffix;
      }
      return num.toLocaleString();
    }

    getFilteredRecords() {
      let list = Array.from(this.records.values());

      if (this.activeGame !== 'all') {
        list = list.filter(r => r.game === this.activeGame);
      } else {
        // In 'all', aggregate by username to show overall champions!
        const userMap = new Map();
        list.forEach(r => {
          const userKey = r.username.toLowerCase();
          if (!userMap.has(userKey)) {
            userMap.set(userKey, {
              id: 'all_' + userKey,
              username: r.username,
              avatar: r.avatar,
              game: 'all',
              wins: r.wins,
              highScore: r.highScore,
              totalScore: r.totalScore,
              gamesPlayed: r.gamesPlayed,
              lastUpdated: r.lastUpdated
            });
          } else {
            const existing = userMap.get(userKey);
            existing.wins += r.wins;
            existing.highScore = Math.max(existing.highScore, r.highScore);
            existing.totalScore += r.totalScore;
            existing.gamesPlayed += r.gamesPlayed;
            existing.lastUpdated = Math.max(existing.lastUpdated, r.lastUpdated);
          }
        });
        list = Array.from(userMap.values());
      }

      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        list = list.filter(r => r.username.toLowerCase().includes(q));
      }

      // Sorting
      list.sort((a, b) => {
        if (this.sortBy === 'wins') {
          return (b.wins - a.wins) || (b.highScore - a.highScore);
        } else if (this.sortBy === 'highScore') {
          return (b.highScore - a.highScore) || (b.wins - a.wins);
        } else if (this.sortBy === 'totalScore') {
          return (b.totalScore - a.totalScore) || (b.wins - a.wins);
        } else {
          return (b.lastUpdated || 0) - (a.lastUpdated || 0);
        }
      });

      return list;
    }

    getStats() {
      const records = this.getFilteredRecords();
      let totalWins = 0;
      let highestScore = 0;
      let topUser = 'None';

      records.forEach((r, idx) => {
        totalWins += (r.wins || 0);
        if (r.highScore > highestScore) {
          highestScore = r.highScore;
        }
        if (idx === 0) {
          topUser = r.username;
        }
      });

      return {
        totalWins,
        highestScore: this.formatScore(highestScore, this.activeGame),
        topUser,
        count: records.length
      };
    }

    // UI SUBSCRIPTIONS
    onUpdate(cb) {
      if (typeof cb === 'function') this.listeners.push(cb);
    }
    notifyListeners() {
      this.listeners.forEach(cb => {
        try { cb(); } catch (e) {}
      });
      this.renderRankings();
      this.renderStats();
    }
    onChat(cb) {
      if (typeof cb === 'function') this.chatListeners.push(cb);
    }
    notifyChatListeners(newMsg) {
      this.chatListeners.forEach(cb => {
        try { cb(newMsg); } catch (e) {}
      });
      this.renderChatList();
    }

    // =========================================
    // UI RENDERING
    // =========================================
    mount(containerId) {
      const container = document.getElementById(containerId);
      if (!container) return;

      container.innerHTML = `
        <section class="dion-leaderboard-section" id="dionLeaderboardRoot">
          <!-- HEADER -->
          <div class="dl-section-header">
            <div class="dl-title-group">
              <div class="dl-title-icon">🏆</div>
              <div class="dl-title-text">
                <h2>LIVE ARENA LEADERBOARD & CHAT</h2>
                <p>Real-time game show win tracking, multi-client scores, and live stream chat sync.</p>
              </div>
            </div>

            <div class="dl-header-controls">
              <div class="dl-sync-status-badge" id="dlSyncStatusBadge">
                <span class="dl-sync-dot"></span>
                <span id="dlSyncText">SYNC ACTIVE</span>
              </div>
              <button type="button" class="dl-btn-action primary" id="dlBtnOpenRecordModal">
                <span>➕</span> RECORD WIN / SCORE
              </button>
            </div>
          </div>

          <!-- MOBILE NAVIGATION TABS (visible on small screens) -->
          <div class="dl-mobile-nav">
            <button type="button" class="dl-mobile-tab-btn" id="dlMobileTabChat">
              <span>💬</span> Live Stream Chat
            </button>
            <button type="button" class="dl-mobile-tab-btn active" id="dlMobileTabLeaderboard">
              <span>🏆</span> Game Leaderboard
            </button>
          </div>

          <!-- MAIN DUAL PANE -->
          <div class="dl-main-grid">
            <!-- LEFT PANE: LIVE CHAT -->
            <div class="dl-chat-pane" id="dlChatPane">
              <div class="dl-chat-header">
                <div class="dl-chat-header-title">
                  <span>💬</span> LIVE ARENA CHAT
                </div>
                <div class="dl-chat-room-badge" id="dlChatRoomBadge">
                  ROOM: ${this.roomId}
                </div>
              </div>

              <!-- CHAT MESSAGES STREAM -->
              <div class="dl-chat-messages" id="dlChatMessages">
                <!-- Messages inserted dynamically -->
              </div>

              <!-- QUICK REACTION CHIPS -->
              <div class="dl-chat-quick-reactions">
                <div class="dl-react-chip" data-react="🌹 Sent a Rose to the Stream!">🌹 Rose</div>
                <div class="dl-react-chip" data-react="💖 Heart the live!">💖 Heart</div>
                <div class="dl-react-chip" data-react="🔥 Keep it up, let's win!">🔥 Fire</div>
                <div class="dl-react-chip" data-react="👏 Good Game! Great round!">👏 GG</div>
                <div class="dl-react-chip" data-react="🏆 CHAMPION ALERT!">🏆 Champion</div>
                <div class="dl-react-chip" data-react="/help">💡 Help</div>
              </div>

              <!-- CHAT INPUT & USER ROW -->
              <div class="dl-chat-input-container">
                <div class="dl-chat-user-row">
                  <button type="button" class="dl-avatar-selector-btn" id="dlAvatarBtn" title="Change Avatar">
                    ${renderAvatar(this.currentUser.avatar)}
                  </button>
                  <input type="text" class="dl-username-input" id="dlUsernameInput" value="${this.currentUser.username}" placeholder="Username" maxlength="18" />
                  <span class="dl-chat-cmd-hint">Type /win or /cheer</span>
                </div>
                <div class="dl-avatar-picker" id="dlAvatarPicker" role="group" aria-label="Choose an avatar" hidden>
                  ${AVATARS.map(avatar => `
                    <button type="button" class="dl-avatar-option ${avatar === this.currentUser.avatar ? 'selected' : ''}" data-avatar="${avatar}" aria-label="${AVATAR_IMAGES[avatar] || avatar}" aria-pressed="${avatar === this.currentUser.avatar}">
                      ${renderAvatar(avatar)}
                    </button>
                  `).join('')}
                </div>
                <div class="dl-chat-send-row">
                  <input type="text" class="dl-chat-text-input" id="dlChatInput" placeholder="Message stream or /win [game] [score]..." />
                  <button type="button" class="dl-chat-send-btn" id="dlChatSendBtn">
                    SEND
                  </button>
                </div>
              </div>
            </div>

            <!-- RIGHT PANE: REAL-TIME LEADERBOARD -->
            <div class="dl-leaderboard-pane" id="dlLeaderboardPane">
              <!-- PER-GAME FILTER TABS -->
              <div class="dl-game-tabs" id="dlGameTabs">
                ${Object.entries(GAME_META).map(([key, meta]) => `
                  <button type="button" class="dl-game-tab-btn ${this.activeGame === key ? 'active' : ''}" data-game="${key}">
                    <span>${meta.icon}</span> ${meta.title}
                  </button>
                `).join('')}
              </div>

              <!-- STATS SUMMARY BAR -->
              <div class="dl-stats-bar" id="dlStatsBar">
                <div class="dl-stat-box">
                  <span class="dl-stat-label">🏆 Total Wins</span>
                  <span class="dl-stat-val gold" id="dlStatWins">0</span>
                </div>
                <div class="dl-stat-box">
                  <span class="dl-stat-label">💰 High Score</span>
                  <span class="dl-stat-val green" id="dlStatHigh">$0</span>
                </div>
                <div class="dl-stat-box">
                  <span class="dl-stat-label">👑 Top Leader</span>
                  <span class="dl-stat-val" id="dlStatLeader">--</span>
                </div>
                <div class="dl-stat-box">
                  <span class="dl-stat-label">👥 Ranked Players</span>
                  <span class="dl-stat-val" id="dlStatPlayers">0</span>
                </div>
              </div>

              <!-- SEARCH & SORT TOOLBAR -->
              <div class="dl-toolbar">
                <div class="dl-search-box">
                  <span class="dl-search-icon">🔍</span>
                  <input type="text" class="dl-search-input" id="dlSearchInput" placeholder="Search contestant..." value="${this.searchQuery}" />
                </div>
                <div class="dl-sort-group">
                  <span class="dl-sort-label">Sort by:</span>
                  <select class="dl-sort-select" id="dlSortSelect">
                    <option value="wins" ${this.sortBy === 'wins' ? 'selected' : ''}>Most Wins 🏆</option>
                    <option value="highScore" ${this.sortBy === 'highScore' ? 'selected' : ''}>Highest Score 💰</option>
                    <option value="totalScore" ${this.sortBy === 'totalScore' ? 'selected' : ''}>Total Score 📈</option>
                    <option value="recent" ${this.sortBy === 'recent' ? 'selected' : ''}>Most Recent ⏱️</option>
                  </select>
                </div>
              </div>

              <!-- RANKINGS TABLE -->
              <div class="dl-rankings-wrapper">
                <table class="dl-table">
                  <thead>
                    <tr>
                      <th style="width: 50px;">Rank</th>
                      <th>Contestant</th>
                      <th style="width: 100px;">Game</th>
                      <th style="width: 100px; text-align: center;">Wins</th>
                      <th style="width: 130px; text-align: right;">High Score</th>
                      <th style="width: 110px; text-align: right;">Total Pts</th>
                    </tr>
                  </thead>
                  <tbody id="dlRankingsBody">
                    <!-- Populated dynamically -->
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <!-- RECORD WIN / SCORE MODAL -->
        <div class="dl-modal-backdrop" id="dlRecordModal">
          <div class="dl-modal-card">
            <div class="dl-modal-header">
              <h3 class="dl-modal-title">🏆 RECORD WIN OR SCORE</h3>
              <button type="button" class="dl-modal-close-btn" id="dlBtnCloseModal">✕</button>
            </div>

            <div class="dl-form-group">
              <label class="dl-form-label">Select Game Show</label>
              <select class="dl-form-select" id="dlFormGame">
                <option value="wheel">🎡 Wheel of Fortune</option>
                <option value="trivia">🧠 Trivia Showdown</option>
                <option value="jeopardy">🏆 Dion Jeopardy</option>
                <option value="word-reveal">🟩 Word Reveal Mystery</option>
                <option value="speak-out">🎤 Speak Out / Tongue Twister</option>
                <option value="guess-lyrics">🎵 Guess the Lyrics</option>
                <option value="hangman">🔤 Hangman Show</option>
              </select>
            </div>

            <div class="dl-form-group">
              <label class="dl-form-label">Contestant Name</label>
              <input type="text" class="dl-form-input" id="dlFormUser" placeholder="e.g. Dionlyonee, @Sarah" value="${this.currentUser.username}" />
            </div>

            <div class="dl-form-group">
              <label class="dl-form-label">Score / Cash Amount</label>
              <input type="number" class="dl-form-input" id="dlFormScore" placeholder="e.g. 25000" value="2500" step="50" min="0" />
            </div>

            <div class="dl-form-checkbox-row" id="dlFormWinRow">
              <input type="checkbox" id="dlFormIsWin" class="dl-form-checkbox" checked />
              <label for="dlFormIsWin" class="dl-form-checkbox-label">Record as Official 1st Place Game Win 🏆</label>
            </div>

            <div style="display: flex; gap: 10px; margin-top: 6px;">
              <button type="button" class="dl-btn-action" style="flex: 1;" id="dlBtnCancelRecord">CANCEL</button>
              <button type="button" class="dl-btn-action primary" style="flex: 1;" id="dlBtnSubmitRecord">SUBMIT WIN & SYNC</button>
            </div>
          </div>
        </div>
      `;

      this.bindEvents();
      this.render();
    }

    bindEvents() {
      // Game Tab Buttons
      const tabBtns = document.querySelectorAll('.dl-game-tab-btn');
      tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const game = e.currentTarget.getAttribute('data-game');
          this.activeGame = game;
          tabBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-game') === game));
          this.renderRankings();
          this.renderStats();
        });
      });

      // Search & Sort
      const searchInput = document.getElementById('dlSearchInput');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.searchQuery = e.target.value;
          this.renderRankings();
          this.renderStats();
        });
      }

      const sortSelect = document.getElementById('dlSortSelect');
      if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
          this.sortBy = e.target.value;
          this.renderRankings();
        });
      }

      // Chat input
      const chatInput = document.getElementById('dlChatInput');
      const chatSendBtn = document.getElementById('dlChatSendBtn');
      const handleSend = () => {
        if (!chatInput) return;
        const text = chatInput.value;
        if (text && text.trim()) {
          this.sendChatMessage(text);
          chatInput.value = '';
          chatInput.focus();
        }
      };

      if (chatSendBtn) chatSendBtn.addEventListener('click', handleSend);
      if (chatInput) {
        chatInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') handleSend();
        });
      }

      // Quick Reaction Chips
      const chips = document.querySelectorAll('.dl-react-chip');
      chips.forEach(chip => {
        chip.addEventListener('click', () => {
          const reactText = chip.getAttribute('data-react');
          if (reactText) {
            this.sendChatMessage(reactText);
          }
        });
      });

      // User name & Avatar edit
      const usernameInput = document.getElementById('dlUsernameInput');
      if (usernameInput) {
        usernameInput.addEventListener('change', (e) => {
          this.saveCurrentUser(e.target.value, this.currentUser.avatar);
        });
      }

      const avatarBtn = document.getElementById('dlAvatarBtn');
      const avatarPicker = document.getElementById('dlAvatarPicker');
      if (avatarBtn && avatarPicker) {
        avatarBtn.addEventListener('click', () => {
          avatarPicker.hidden = !avatarPicker.hidden;
          avatarBtn.setAttribute('aria-expanded', String(!avatarPicker.hidden));
        });
        avatarPicker.addEventListener('click', (event) => {
          const option = event.target.closest('[data-avatar]');
          if (!option) return;
          this.saveCurrentUser(this.currentUser.username, option.dataset.avatar);
          avatarBtn.innerHTML = renderAvatar(this.currentUser.avatar);
          avatarPicker.querySelectorAll('[data-avatar]').forEach(button => {
            const selected = button.dataset.avatar === this.currentUser.avatar;
            button.classList.toggle('selected', selected);
            button.setAttribute('aria-pressed', String(selected));
          });
          avatarPicker.hidden = true;
          avatarBtn.setAttribute('aria-expanded', 'false');
        });
      }

      // Mobile Tabs
      const mChatBtn = document.getElementById('dlMobileTabChat');
      const mLeadBtn = document.getElementById('dlMobileTabLeaderboard');
      const chatPane = document.getElementById('dlChatPane');
      const leadPane = document.getElementById('dlLeaderboardPane');

      if (mChatBtn && mLeadBtn && chatPane && leadPane) {
        mChatBtn.addEventListener('click', () => {
          mChatBtn.classList.add('active');
          mLeadBtn.classList.remove('active');
          chatPane.classList.add('mobile-active');
          leadPane.classList.add('mobile-hidden');
        });

        mLeadBtn.addEventListener('click', () => {
          mLeadBtn.classList.add('active');
          mChatBtn.classList.remove('active');
          chatPane.classList.remove('mobile-active');
          leadPane.classList.remove('mobile-hidden');
        });
      }

      // Record Modal
      const modal = document.getElementById('dlRecordModal');
      const openBtn = document.getElementById('dlBtnOpenRecordModal');
      const closeBtn = document.getElementById('dlBtnCloseModal');
      const cancelBtn = document.getElementById('dlBtnCancelRecord');
      const submitBtn = document.getElementById('dlBtnSubmitRecord');

      const openModal = () => {
        if (modal) {
          modal.classList.add('active');
          const formGame = document.getElementById('dlFormGame');
          if (formGame && this.activeGame !== 'all') {
            formGame.value = this.activeGame;
          }
          const formUser = document.getElementById('dlFormUser');
          if (formUser) formUser.value = this.currentUser.username;
        }
      };

      const closeModal = () => {
        if (modal) modal.classList.remove('active');
      };

      if (openBtn) openBtn.addEventListener('click', openModal);
      if (closeBtn) closeBtn.addEventListener('click', closeModal);
      if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

      if (submitBtn) {
        submitBtn.addEventListener('click', () => {
          const formGame = document.getElementById('dlFormGame');
          const formUser = document.getElementById('dlFormUser');
          const formScore = document.getElementById('dlFormScore');
          const formIsWin = document.getElementById('dlFormIsWin');

          const game = formGame ? formGame.value : 'wheel';
          const user = (formUser ? formUser.value : '').trim() || 'Contestant';
          const score = parseInt(formScore ? formScore.value : '0', 10) || 0;
          const isWin = formIsWin ? formIsWin.checked : true;

          this.recordResult({
            game,
            username: user,
            score,
            isWin,
            avatar: this.currentUser.avatar
          });

          closeModal();
        });
      }
    }

    render() {
      this.renderRankings();
      this.renderStats();
      this.renderChatList();
      const badge = document.getElementById('dlChatRoomBadge');
      if (badge) badge.textContent = `ROOM: ${this.roomId}`;
    }

    renderStats() {
      const stats = this.getStats();
      const statWins = document.getElementById('dlStatWins');
      const statHigh = document.getElementById('dlStatHigh');
      const statLeader = document.getElementById('dlStatLeader');
      const statPlayers = document.getElementById('dlStatPlayers');

      if (statWins) statWins.textContent = stats.totalWins.toLocaleString();
      if (statHigh) statHigh.textContent = stats.highestScore;
      if (statLeader) statLeader.textContent = stats.topUser;
      if (statPlayers) statPlayers.textContent = stats.count.toString();
    }

    renderRankings() {
      const tbody = document.getElementById('dlRankingsBody');
      if (!tbody) return;

      const records = this.getFilteredRecords();

      if (records.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6">
              <div class="dl-empty-state">
                <span class="dl-empty-state-icon">🏆</span>
                <b>No records found for this category yet</b>
                <span style="font-size: 11px;">Be the first contestant to log a win or score!</span>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = records.map((r, idx) => {
        const rank = idx + 1;
        const rankBadgeClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : 'rank-other';
        const rankIcon = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;
        const meta = GAME_META[r.game] || { title: r.game, icon: '🎮' };
        const scoreFormatted = this.formatScore(r.highScore, r.game);
        const totalFormatted = this.formatScore(r.totalScore, r.game);

        return `
          <tr>
            <td>
              <span class="dl-rank-badge ${rankBadgeClass}">${rankIcon}</span>
            </td>
            <td>
              <div class="dl-player-cell">
                <span class="dl-player-avatar">${renderAvatar(r.avatar)}</span>
                <div class="dl-player-info">
                  <span class="dl-player-name">
                    ${r.username}
                    ${rank === 1 ? '<span class="dl-crown-icon" title="Arena Champion">👑</span>' : ''}
                  </span>
                  <span class="dl-player-meta">${r.gamesPlayed || 1} matches played</span>
                </div>
              </div>
            </td>
            <td>
              <span class="dl-game-badge-tag">
                <span>${meta.icon}</span> ${meta.title}
              </span>
            </td>
            <td style="text-align: center;">
              <span class="dl-wins-pill">
                <span>🏆</span> ${r.wins}
              </span>
            </td>
            <td style="text-align: right;">
              <span class="dl-score-pill">${scoreFormatted}</span>
            </td>
            <td style="text-align: right;">
              <span class="dl-total-score">${totalFormatted}</span>
            </td>
          </tr>
        `;
      }).join('');
    }

    renderChatList() {
      const container = document.getElementById('dlChatMessages');
      if (!container) return;

      container.innerHTML = this.chatMessages.map(msg => {
        const isWin = msg.type === 'win';
        const isScore = msg.type === 'score';
        const isSystem = msg.type === 'system';
        const isCheer = msg.type === 'cheer';
        const typeClass = isWin ? 'is-win' : isScore ? 'is-score' : isSystem ? 'is-system' : isCheer ? 'is-cheer' : '';
        const timeStr = this.formatTime(msg.timestamp);

        return `
          <div class="dl-chat-msg ${typeClass}">
            <div class="dl-msg-avatar">${renderAvatar(msg.avatar || '👤')}</div>
            <div class="dl-msg-content">
              <div class="dl-msg-meta">
                <span class="dl-msg-username">${msg.username}</span>
                ${msg.badge ? `<span class="dl-msg-badge">${msg.badge}</span>` : ''}
                <span class="dl-msg-time">${timeStr}</span>
              </div>
              <div class="dl-msg-body">${msg.text}</div>
            </div>
          </div>
        `;
      }).join('');

      // Auto-scroll to bottom
      container.scrollTop = container.scrollHeight;
    }

    formatTime(ts) {
      if (!ts) return '';
      const date = new Date(ts);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    updateSyncBadge(connected, text) {
      const badge = document.getElementById('dlSyncStatusBadge');
      const textElem = document.getElementById('dlSyncText');
      if (textElem && text) textElem.textContent = text;
      if (badge) {
        badge.style.borderColor = connected ? '#34d399' : '#f59e0b';
        badge.style.color = connected ? '#34d399' : '#f59e0b';
      }
    }
  }

  // Global singleton
  window.FirebaseLeaderboard = new FirebaseLeaderboard();
  window.DionLeaderboard = window.FirebaseLeaderboard;
})();
