import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tanstackStart(), nitro(), viteReact(), tsConfigPaths(), tailwindcss()],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react-dom/") || id.includes("node_modules/react/")) {
            return "react-vendor";
          }
          if (id.includes("node_modules/@tanstack/react-router") || id.includes("node_modules/@tanstack/router-core")) {
            return "tanstack-router";
          }
          if (id.includes("node_modules/embla-carousel")) {
            return "embla";
          }
        },
      },
    },
  },
});
