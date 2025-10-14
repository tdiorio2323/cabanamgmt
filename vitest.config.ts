import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(rootDir, 'src'),
    },
  },
  test: {
    environment: 'node',
    environmentMatchGlobs: [["__tests__/**/*.spec.tsx", "jsdom"]],
    setupFiles: ['vitest.setup.ts'],
    include: [
      '__tests__/**/*.{spec,test}.[tj]s?(x)',
      'tests/**/*.{spec,test}.[tj]s?(x)',
    ],
    exclude: ['tests/playwright/**', 'tests/e2e/**', 'tests/auth.spec.ts', 'tests/smoke.generated.spec.ts', 'tests/logout.spec.ts'],
  },
});
