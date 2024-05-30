import { sentryVitePlugin } from "@sentry/vite-plugin";
import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { createProxyMiddleware } from 'http-proxy-middleware';

installGlobals();

export default defineConfig({
  server: {
    proxy: {
      '/api/heartwatch': {
        target: 'http://localhost:5172',
        changeOrigin: true,
      }
    }
  },
  define: {
    'process.env': loadEnv(process.env.NODE_ENV, process.cwd(), '')
  },
  plugins: [remix(), tsconfigPaths(), sentryVitePlugin({
    org: "orangopus",
    project: "javascript-remix"
  })],

  build: {
    sourcemap: true
  }
});
