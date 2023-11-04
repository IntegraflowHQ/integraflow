import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({ tsDecorators: true })],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
      assets: `${path.resolve(__dirname, "./src/assets/")}`,
      ui: `${path.resolve(__dirname, "./src/ui/")}`
    }
  }
});
