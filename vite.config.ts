import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        jeopardyHost: path.resolve(__dirname, "jeopardy-host.html"),
        jeopardyLive: path.resolve(__dirname, "jeopardy-live.html"),
        jeopardyCohost: path.resolve(__dirname, "jeopardy-cohost.html"),
        mostLikelyHost: path.resolve(__dirname, "most-likely-host.html"),
        mostLikelyLive: path.resolve(__dirname, "most-likely-live.html"),
        dualView: path.resolve(__dirname, "dual-view.html"),
      },
    },
  },
});
