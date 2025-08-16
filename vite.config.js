import { defineConfig } from "vite";

export default defineConfig({
  server: {
    cors: {
      methods: ["GET"],
    },
    allowedHosts: ["localhost", ".github.io"],
    hmr: true,
  },
});
