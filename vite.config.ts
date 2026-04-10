import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import babel from "vite-plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), babel({
    babelConfig: {
      plugins: ['babel-plugin-react-compiler'],
    }
  }), tailwindcss()],
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
