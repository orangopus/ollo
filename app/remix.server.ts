// app/remix.server.ts

import { createRequestHandler } from '@remix-run/node';
import { handler as heartWatchHandler } from "./routes/$profile.heartwatch"

export const remixRequestHandler = createRequestHandler({
  getLoadContext() {
    // Optionally return a context object that will be passed to all loader functions
    return {};
  },
  async getSession(request) {
    // Optionally return session data for authenticated users
    return {};
  },
  async action(request, response) {
    // Optionally handle actions (e.g., form submissions)
    return {};
  },
  async loader(request) {
    // Handle incoming requests
    if (request.url === '/api/heartwatch') {
      return await heartWatchHandler(request);
    }
  },
});
