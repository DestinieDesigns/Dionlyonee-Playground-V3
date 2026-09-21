/**
 * Dionlyonee Playground - Room Manager
 * Handles room ID generation, persistence, and URL query params.
 */
(function () {
  class RoomManager {
    constructor() {
      this.currentRoom = this.resolveInitialRoom();
    }

    resolveInitialRoom() {
      try {
        const params = new URLSearchParams(window.location.search);
        const qRoom = params.get('room');
        if (qRoom && qRoom.trim()) {
          const clean = qRoom.trim().toUpperCase();
          sessionStorage.setItem('dionlyonee_active_room', clean);
          return clean;
        }

        const cached = sessionStorage.getItem('dionlyonee_active_room');
        if (cached && cached.trim()) return cached.trim().toUpperCase();

        return this.generateRandomRoom();
      } catch (e) {
        return 'DION1';
      }
    }

    generateRandomRoom() {
      const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
      let suffix = '';
      for (let i = 0; i < 4; i++) {
        suffix += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      const code = 'DION' + suffix;
      try {
        sessionStorage.setItem('dionlyonee_active_room', code);
      } catch (e) {}
      return code;
    }

    setRoom(code) {
      if (!code) return;
      const clean = code.trim().toUpperCase();
      this.currentRoom = clean;
      try {
        sessionStorage.setItem('dionlyonee_active_room', clean);
        const url = new URL(window.location.href);
        url.searchParams.set('room', clean);
        window.history.replaceState({}, '', url.toString());
        window.dispatchEvent(new CustomEvent('roomchange', { detail: { roomId: clean } }));
      } catch (e) {}
    }

    getRoom() {
      return this.currentRoom || 'DION1';
    }

    getRoomId() {
      return this.getRoom();
    }

    setRoomId(code) {
      this.setRoom(code);
    }

    getJoinUrl(gameType = 'wheel', role = 'cohost') {
      const origin = window.location.origin;
      const roomId = this.getRoom();
      if (role === 'cohost') {
        return `${origin}/${gameType}/cohost/?room=${roomId}`;
      }
      return `${origin}/connections/join.html?room=${roomId}&game=${gameType}`;
    }

    getControllerUrl(gameType = 'wheel') {
      const origin = window.location.origin;
      const roomId = this.getRoom();
      let rootPath = window.location.pathname;
      if (rootPath.includes('/host') || rootPath.includes('/live') || rootPath.includes('/cohost') || rootPath.includes('/waiting') || rootPath.includes('/shared')) {
        rootPath = rootPath.replace(/\/(wheel|trivia|jeopardy|word-reveal|speak-out|games|shared)\/(host|live|cohost|waiting).*$/, '/');
      } else {
        rootPath = rootPath.substring(0, rootPath.lastIndexOf('/') + 1);
      }
      if (!rootPath.endsWith('/')) rootPath += '/';
      return `${origin}${rootPath}controller.html?room=${encodeURIComponent(roomId)}&game=${encodeURIComponent(gameType)}`;
    }

    getPhoneControllerUrl(gameType = 'wheel') {
      return this.getControllerUrl(gameType);
    }

    getHostUrl(gameType = 'wheel') {
      const origin = window.location.origin;
      const roomId = this.getRoom();
      const routes = {
        'wheel': '/wheel/host/index.html',
        'trivia': '/trivia/host/index.html',
        'jeopardy': '/jeopardy/jeopardy-host.html',
        'word-reveal': '/word-reveal/host/index.html',
        'speak-out': '/speak-out/host/index.html',
        'guess-lyrics': '/guess-lyrics/host.html'
      };
      const path = routes[gameType] || `/${gameType}/host/index.html`;
      return `${origin}${path}?room=${encodeURIComponent(roomId)}`;
    }

    getLiveUrl(gameType = 'wheel') {
      const origin = window.location.origin;
      const roomId = this.getRoom();
      const routes = {
        'wheel': '/wheel/live/index.html',
        'trivia': '/trivia/live/index.html',
        'jeopardy': '/jeopardy/jeopardy-live.html',
        'word-reveal': '/word-reveal/live/index.html',
        'speak-out': '/speak-out/live/index.html',
        'guess-lyrics': '/guess-lyrics/live.html'
      };
      const path = routes[gameType] || `/${gameType}/live/index.html`;
      return `${origin}${path}?room=${encodeURIComponent(roomId)}`;
    }

    getCohostJoinUrl(gameType = 'wheel') {
      const origin = window.location.origin;
      const roomId = this.getRoom();
      let rootPath = window.location.pathname;
      if (rootPath.includes('/host') || rootPath.includes('/live') || rootPath.includes('/cohost') || rootPath.includes('/waiting') || rootPath.includes('/shared')) {
        rootPath = rootPath.replace(/\/(wheel|trivia|jeopardy|word-reveal|speak-out|games|shared)\/(host|live|cohost|waiting).*$/, '/');
      } else {
        rootPath = rootPath.substring(0, rootPath.lastIndexOf('/') + 1);
      }
      if (!rootPath.endsWith('/')) rootPath += '/';
      return `${origin}${rootPath}cohost-join.html?room=${encodeURIComponent(roomId)}`;
    }
  }

  window.RoomManager = new RoomManager();
})();
