/**
 * Dionlyonee Playground - Game Router
 * Facilitates switching between games, multi-screen views, and external devices.
 */
(function () {
  const GameRouter = {
    getRoute(game, view = 'host', room = '') {
      const activeRoom = room || (window.RoomManager ? window.RoomManager.getRoom() : 'DION1');
      return `/${game}/${view}/?room=${activeRoom}`;
    },

    navigateTo(game, view = 'host') {
      window.location.href = this.getRoute(game, view);
    },

    openInNewTab(game, view = 'live') {
      window.open(this.getRoute(game, view), '_blank');
    },

    openDualView(game = 'wheel') {
      const room = window.RoomManager ? window.RoomManager.getRoom() : 'DION1';
      window.open(`/dual-view.html?game=${game}&room=${room}`, '_blank');
    }
  };

  window.GameRouter = GameRouter;
})();
