import { defineConfig } from "vite";
import path from "path";
import fs from "node:fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [{
    name: "preserve-static-game-screens",
    closeBundle() {
      // Most games intentionally use classic scripts and standalone HTML.
      // Preserve them alongside Vite's processed entry pages, without rewriting game engines.
      const output = path.join(__dirname, "dist");
      const excluded = new Set(["node_modules", "dist", "scripts"]);
      const copyScreens = (directory: string) => {
        for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
          if (item.name.startsWith(".") || excluded.has(item.name)) continue;
          const source = path.join(directory, item.name);
          if (item.isDirectory()) { copyScreens(source); continue; }
          if (!/\.(html|js|css|svg|png|mp3)$/.test(item.name)) continue;
          const destination = path.join(output, path.relative(__dirname, source));
          if (fs.existsSync(destination)) continue;
          fs.mkdirSync(path.dirname(destination), { recursive: true });
          fs.copyFileSync(source, destination);
        }
      };
      copyScreens(__dirname);
    },
  }],
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
