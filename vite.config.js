import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { execSync } from "node:child_process";

const frontendCommit = process.env.RENDER_GIT_COMMIT
  || process.env.VITE_FRONTEND_COMMIT
  || execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
const buildTimestamp = new Date().toISOString();

const buildVersionPlugin = () => ({
  name: "dubi-build-version",
  generateBundle() {
    this.emitFile({
      type: "asset",
      fileName: "version.json",
      source: JSON.stringify({ frontend_commit: frontendCommit, build_timestamp: buildTimestamp }, null, 2),
    });
  },
});

export default defineConfig({
  plugins: [react(), buildVersionPlugin()],
  define: {
    __DUBI_FRONTEND_COMMIT__: JSON.stringify(frontendCommit),
    __DUBI_BUILD_TIMESTAMP__: JSON.stringify(buildTimestamp),
  },
  build: {
    sourcemap: false,
    target: "es2020",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "vendor-react";
          }
          if (id.includes("node_modules/@capacitor")) {
            return "vendor-capacitor";
          }
        }
      }
    }
  }
});
