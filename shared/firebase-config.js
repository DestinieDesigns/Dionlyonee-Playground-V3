/**
 * Dionlyonee Playground - Firebase / Room Sync Configuration
 */
(function () {
  const FirebaseConfig = {
    apiKey: "AIzaSyDionlyoneePlaygroundPublicDemoKey",
    authDomain: "dionlyonee-playground.firebaseapp.com",
    projectId: "dionlyonee-playground",
    storageBucket: "dionlyonee-playground.appspot.com",
    messagingSenderId: "706573125919",
    appId: "1:706573125919:web:dionlyonee001",
    // Fallback sync options
    syncMode: "hybrid", // "websocket" | "broadcast_channel" | "http" | "firebase"
    defaultRoom: "DION1",
    wsPath: "/ws",
    httpApiPrefix: "/api/rooms"
  };

  window.FirebaseConfig = FirebaseConfig;
})();
