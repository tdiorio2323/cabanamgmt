import { defineWorkspace } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(fileURLToPath(import.meta.url))

export default defineWorkspace([
  {
    test: {
      name: 'unit',
      environment: 'node',
      include: ['tests/**/*.unit.spec.ts'],
      globals: true,
      setupFiles: ['./vitest.setup.ts'],
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(rootDir, 'src'),
      },
    },
  },
  {
    test: {
      name: 'components',
      environment: 'jsdom',
      include: ['__tests__/**/*.{spec,test}.[tj]s?(x)'],
      globals: true,
      setupFiles: ['./vitest.setup.ts'],
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(rootDir, 'src'),
      },
    },
  },
])

