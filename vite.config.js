import { defineConfig } from "vite";

export default defineConfig({
  base: '/audio-freq-visualizer/',
  server: {
    cors: {
      methods: ["GET"],
    },
    allowedHosts: ["localhost", ".github.io"],
    hmr: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
