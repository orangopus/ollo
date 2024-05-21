import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { createProxyMiddleware } from 'http-proxy-middleware';

installGlobals();

export default defineConfig({
  server: {
    proxy: {
      '/api/heartwatch': {
        target: 'http://localhost:5173',
        changeOrigin: true,
      }
    }
  },
  plugins: [remix(), tsconfigPaths()],
});
