import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/pdanetwork": {
        target: "https://dev.artux.net",
        changeOrigin: true,
      },
      "/api": {
        target: "https://dev.artux.net",
        changeOrigin: true,
      },
    },
  },
});
