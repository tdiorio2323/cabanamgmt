export default {
  // Entry points - Next.js App Router patterns
  entry: [
    'src/app/**/page.{ts,tsx}',
    'src/app/**/layout.{ts,tsx}',
    'src/app/**/route.{ts,tsx}',
    'src/app/**/loading.{ts,tsx}',
    'src/app/**/error.{ts,tsx}',
    'src/app/**/not-found.{ts,tsx}',
    'src/middleware.ts',
    'next.config.ts',
    'tailwind.config.ts',
    'vitest.config.ts',
    'playwright.config.ts',
  ],

  // Project files to analyze
  project: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
    '!**/*.d.ts'
  ],

  // Ignore patterns
  ignore: [
    'src/**/__tests__/**',
    'src/**/?(*.)+(spec|test).*',
    'tests/**', // All test files (unit, e2e, integration)
    'src/**/__mocks__/**',
    'src/**/*.stories.{ts,tsx}',
    'next-env.d.ts',
    'src/types/supabase.ts', // Auto-generated, don't report unused types
    '*.config.{js,ts,mjs}',
    'setup-*.{js,mjs}',
    'create-admin-user.mjs',
    'check-admin-access.mjs',
    'test-dashboard.mjs',
    'vitest.setup.ts',
  ],

  // Ignore dependencies that are used in ways Knip can't detect
  ignoreDependencies: [
    '@tailwindcss/postcss', // Used in postcss.config.mjs
    'tailwindcss', // Used in postcss.config.mjs
    'tsx', // Used in package.json scripts
    'chokidar-cli', // Used in package.json scripts for db:watch
    'husky', // Git hooks
    'lint-staged', // Pre-commit hooks
    '@next/bundle-analyzer', // Conditional import in next.config.ts
    'dotenv', // Used in scripts
    'supabase', // CLI tool
  ],

  // Ignore exports that might appear unused but are consumed by Next.js conventions
  ignoreExportsUsedInFile: true,

  // Next.js plugin
  next: {
    entry: [
      'src/app/**/page.{ts,tsx}',
      'src/app/**/layout.{ts,tsx}',
      'src/app/**/route.{ts,tsx}',
      'src/middleware.ts'
    ]
  }
};
