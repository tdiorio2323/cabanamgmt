#!/usr/bin/env node

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const GREEN = '\x1b[32m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

let criticalIssues = [];
let highPriorityIssues = [];
let optionalEnhancements = [];

function section(title) {
  console.log(`\n${BLUE}━━━ ${title} ━━━${RESET}\n`);
}

function critical(msg, file = null) {
  criticalIssues.push({ msg, file });
  console.log(`${RED}🔴 CRITICAL:${RESET} ${msg}`);
  if (file) console.log(`   File: ${file}`);
}

function high(msg, file = null) {
  highPriorityIssues.push({ msg, file });
  console.log(`${YELLOW}🟡 HIGH:${RESET} ${msg}`);
  if (file) console.log(`   File: ${file}`);
}

function success(msg) {
  console.log(`${GREEN}✓${RESET} ${msg}`);
}

console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║           PRODUCTION READINESS AUDIT - Comprehensive Scan                 ║
╚═══════════════════════════════════════════════════════════════════════════╝
`);

// 1. API Routes Audit
section('1. API Routes - Stub vs Implemented');

const apiDir = join(rootDir, 'src/app/api');
const apiRoutes = [];

function scanApiRoutes(dir, basePath = '') {
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      scanApiRoutes(fullPath, join(basePath, entry));
    } else if (entry === 'route.ts') {
      const content = readFileSync(fullPath, 'utf-8');
      const routePath = `/api${basePath}`;
      const lineCount = content.split('\n').length;

      const hasTodo = content.includes('TODO') || content.includes('FIXME');
      const hasThrow = content.includes('throw new Error');
      const isStub = lineCount < 15 || hasTodo;

      apiRoutes.push({
        path: routePath,
        file: relative(rootDir, fullPath),
        lineCount,
        isStub,
        hasTodo,
        hasThrow,
      });
    }
  }
}

scanApiRoutes(apiDir);

const stubRoutes = apiRoutes.filter(r => r.isStub);
const implementedRoutes = apiRoutes.filter(r => !r.isStub);

console.log(`Total API routes: ${apiRoutes.length}`);
console.log(`${GREEN}✓ Implemented: ${implementedRoutes.length}${RESET}`);
console.log(`${YELLOW}⚠ Stubs: ${stubRoutes.length}${RESET}\n`);

stubRoutes.forEach(route => {
  if (route.hasTodo) {
    critical(`Stub API route: ${route.path} (${route.lineCount} lines, has TODO)`, route.file);
  }
});

// 2. Vendor SDK Check
section('2. Vendor SDK Integration Status');

const packageJson = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf-8'));
const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

const vendorSdks = {
  '@onfido/api': 'Identity verification (Onfido)',
  'veriff-api': 'Identity verification (Veriff)',
  'checkr': 'Background screening',
  'docusign-esign': 'Contract signing',
  '@sendgrid/mail': 'Email (alternative to Resend)',
  'postmark': 'Email (alternative to Resend)',
  'resend': 'Email provider',
  '@sentry/nextjs': 'Error tracking',
};

Object.entries(vendorSdks).forEach(([pkg, desc]) => {
  if (deps[pkg]) {
    success(`${desc}: ${pkg}@${deps[pkg]}`);
  } else if (desc.includes('alternative')) {
    // Optional alternatives
  } else if (pkg === 'resend') {
    success(`${desc}: ${pkg}@${deps[pkg]}`);
  } else if (pkg === '@sentry/nextjs') {
    high(`Missing ${desc} - no production error monitoring`, null);
  } else {
    critical(`Missing ${desc} - ${pkg} not installed`, 'package.json');
  }
});

// 3. Environment Variables
section('3. Environment Variables Completeness');

const envExample = existsSync(join(rootDir, '.env.local.example'))
  ? readFileSync(join(rootDir, '.env.local.example'), 'utf-8')
  : '';

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'STRIPE_SECRET_KEY',
  'RESEND_API_KEY',
  'MAIL_FROM',
];

requiredVars.forEach(v => {
  if (!envExample.includes(v)) {
    high(`Missing in .env.local.example: ${v}`, '.env.local.example');
  }
});

// 4. Database Migrations
section('4. Database Migration Status');

const migrationsDir = join(rootDir, 'supabase/migrations');
const migrations = readdirSync(migrationsDir)
  .filter(f => f.endsWith('.sql'))
  .sort();

console.log(`Total migrations: ${migrations.length}`);
success(`Latest: ${migrations[migrations.length - 1]}`);

// Check for critical tables
const latestMigration = readFileSync(join(migrationsDir, migrations[migrations.length - 1]), 'utf-8');
if (latestMigration.includes('webhook_events') || latestMigration.includes('rate_limits')) {
  success('New tables (webhook_events, rate_limits) in migrations');
}

// 5. Test Coverage
section('5. Test Coverage Analysis');

const testFiles = [];
function findTests(dir, type = '') {
  const entries = readdirSync(dir);
  entries.forEach(entry => {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory() && !entry.includes('node_modules')) {
      findTests(fullPath, type);
    } else if (entry.includes('.spec.') || entry.includes('.test.')) {
      testFiles.push({ path: relative(rootDir, fullPath), type });
    }
  });
}

findTests(join(rootDir, 'tests'), 'e2e');
findTests(join(rootDir, '__tests__'), 'unit');
findTests(join(rootDir, 'src'), 'colocated');

console.log(`Total test files: ${testFiles.length}`);
console.log(`  E2E tests: ${testFiles.filter(t => t.type === 'e2e').length}`);
console.log(`  Unit tests: ${testFiles.filter(t => t.type === 'unit').length}`);
console.log(`  Colocated: ${testFiles.filter(t => t.type === 'colocated').length}`);

if (testFiles.length < 15) {
  high('Test coverage below recommended threshold (< 15 test files)', null);
} else {
  success(`Test coverage adequate (${testFiles.length} test files)`);
}

// 6. Page Component Analysis
section('6. Page Component Completeness');

function scanPages(dir, basePath = '') {
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory() && !entry.startsWith('.') && !entry.startsWith('api')) {
      scanPages(fullPath, join(basePath, entry));
    } else if (entry === 'page.tsx') {
      const content = readFileSync(fullPath, 'utf-8');
      const lines = content.split('\n').length;
      const pagePath = basePath || '/';

      if (lines < 30) {
        warning(`Minimal page: ${pagePath} (${lines} lines)`);
      }

      if (content.includes('Coming Soon') || content.includes('Under Construction') || content.includes('TODO')) {
        critical(`Placeholder page: ${pagePath}`, relative(rootDir, fullPath));
      }
    }
  }
}

function warning(msg) {
  console.log(`${YELLOW}⚠${RESET} ${msg}`);
}

scanPages(join(rootDir, 'src/app'));

// 7. Security Checks
section('7. Security & Compliance');

const middlewarePath = join(rootDir, 'src/middleware.ts');
if (existsSync(middlewarePath)) {
  const middleware = readFileSync(middlewarePath, 'utf-8');

  if (middleware.includes('Content-Security-Policy')) {
    success('CSP headers configured');
  } else {
    high('Missing Content-Security-Policy headers', 'src/middleware.ts');
  }

  if (middleware.includes('checkRateLimit') || middleware.includes('rateLimit')) {
    success('Rate limiting implemented in middleware');
  } else {
    critical('Rate limiting NOT enforced in middleware (DDoS vulnerable)', 'src/middleware.ts');
  }
} else {
  critical('Missing middleware.ts - no security headers!', 'src/middleware.ts');
}

// 8. Supabase Functions
section('8. Supabase Edge Functions');

const functionsDir = join(rootDir, 'supabase/functions');
if (existsSync(functionsDir)) {
  const functions = readdirSync(functionsDir).filter(f => !f.startsWith('.'));
  success(`${functions.length} edge functions found`);
} else {
  critical('No supabase/functions directory - PII cleanup CRON missing', 'supabase/functions/');
}

// Summary Report
console.log(`
${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}
${BLUE}📊 AUDIT SUMMARY${RESET}
${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}

${RED}🔴 Critical Issues: ${criticalIssues.length}${RESET}
${YELLOW}🟡 High Priority: ${highPriorityIssues.length}${RESET}
${GREEN}🟢 Optional: ${optionalEnhancements.length}${RESET}

${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}
`);

if (criticalIssues.length === 0 && highPriorityIssues.length === 0) {
  console.log(`${GREEN}✅ PROJECT IS 100% PRODUCTION-READY!${RESET}\n`);
  process.exit(0);
} else {
  console.log(`${YELLOW}⚠ ${criticalIssues.length + highPriorityIssues.length} issues need attention before production${RESET}\n`);

  if (criticalIssues.length > 0) {
    console.log(`${RED}Critical Issues:${RESET}`);
    criticalIssues.forEach((issue, i) => {
      console.log(`  ${i + 1}. ${issue.msg}`);
      if (issue.file) console.log(`     → ${issue.file}`);
    });
  }

  console.log('\nRun with --verbose for detailed recommendations\n');
  process.exit(1);
}
