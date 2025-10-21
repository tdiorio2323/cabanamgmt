import { defineConfig } from "vitest/config";
import path from "node:path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["vitest.setup.ts"],
    include: ["tests/**/*.unit.spec.ts", "__tests__/**/*.spec.{ts,tsx}"],
    exclude: [
      "tests/e2e/**",
      "tests/playwright/**",
      "node_modules/**",
      ".next/**",
      "coverage/**",
    ],
  },
});
