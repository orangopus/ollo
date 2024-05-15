import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:5173'
    }
  },
  plugins: [remix(), tsconfigPaths()],
});
