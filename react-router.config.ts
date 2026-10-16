import type { Config } from "@react-router/dev/config";

// Prerender the one route to static HTML at build time, no Node server at
// request time: ssr: false plus a prerender list is React Router v7's
// static-site-generation mode. basename matches vite's BASE_PATH so a
// preview build under a subfolder resolves its own links correctly.
const basename = process.env.BASE_PATH || "/";

export default {
  ssr: false,
  basename,
  async prerender() {
    return ["/"];
  },
} satisfies Config;
