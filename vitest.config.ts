import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    include: ['tests/**/*.unit.spec.ts'],
    exclude: [
      'tests/e2e/**',
      'tests/playwright/**',
      '__tests__/**'
    ],
    environment: 'node'
  },
});
