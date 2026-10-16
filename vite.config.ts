import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// BASE_PATH lets a preview build serve correctly from a subfolder (e.g. a
// hand-off site path) without changing the production base, which stays "/".
const base = process.env.BASE_PATH || "/";

export default defineConfig({
  base,
  plugins: [reactRouter(), tsconfigPaths()],
});
