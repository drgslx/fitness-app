import { defineConfig } from "vite";
export default defineConfig({
  server: { proxy: { "/api": "http://localhost:8000", "/uploads": "http://localhost:8000" } }
});
