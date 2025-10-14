import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(rootDir, "src"),
    },
  },
  test: {
    environment: "node",
    environmentMatchGlobs: [
      ["__tests__/**/*.{spec,test}.tsx", "jsdom"],
    ],
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: [
      "__tests__/**/*.{spec,test}.[tj]s?(x)",
      "tests/**/*.unit.spec.ts",
    ],
    exclude: ["tests/e2e/**", "tests/playwright/**"],
    maxWorkers: 1,
  },
});
