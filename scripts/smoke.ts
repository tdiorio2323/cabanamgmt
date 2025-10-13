#!/usr/bin/env tsx
/**
 * Comprehensive smoke test for Cabana Management
 * Tests routes and API endpoints for basic functionality
 * Usage: BASE_URL=http://localhost:3000 tsx scripts/smoke.ts
 */

interface TestResult {
  path: string;
  status: number;
  latency: number;
  check: 'PASS' | 'FAIL' | 'WARN';
  message: string;
}

const BASE_URL = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const results: TestResult[] = [];

// Dashboard routes to test
const ROUTES = [
  { path: '/', expectStatus: 200, description: 'Homepage' },
  { path: '/login', expectStatus: 200, description: 'Login page' },
  { path: '/dashboard', expectStatus: [200, 302], description: 'Dashboard (protected)' },
  { path: '/dashboard/users', expectStatus: [200, 302], description: 'Users page' },
  { path: '/dashboard/bookings', expectStatus: [200, 302], description: 'Bookings page' },
  { path: '/dashboard/vetting', expectStatus: [200, 302], description: 'Vetting page' },
  { path: '/dashboard/media', expectStatus: [200, 302], description: 'Media page' },
  { path: '/dashboard/contracts', expectStatus: [200, 302], description: 'Contracts page' },
  { path: '/dashboard/payments', expectStatus: [200, 302], description: 'Payments page' },
  { path: '/dashboard/invite', expectStatus: [200, 302], description: 'Invite codes page' },
];

// API endpoints to test
const APIS = [
  { path: '/api/health', expectStatus: 200, expectJson: true, description: 'Health check' },
  { path: '/api/db/health', expectStatus: 200, expectJson: true, description: 'Database health' },
  { path: '/api/vip/list', expectStatus: [200, 401], expectJson: true, description: 'VIP codes list (protected)' },
  { path: '/api/invites/list', expectStatus: [200, 401], expectJson: true, description: 'Invites list (protected)' },
];

async function testRoute(route: typeof ROUTES[0]): Promise<TestResult> {
  const url = `${BASE_URL}${route.path}`;
  const start = Date.now();

  try {
    const response = await fetch(url, { redirect: 'manual' });
    const latency = Date.now() - start;
    const status = response.status;

    const expectedStatuses = Array.isArray(route.expectStatus) ? route.expectStatus : [route.expectStatus];
    const check = expectedStatuses.includes(status) ? 'PASS' : 'FAIL';

    let message = `${status}`;
    if (status === 302) {
      const location = response.headers.get('location');
      message += ` → ${location}`;
    }

    return {
      path: route.path,
      status,
      latency,
      check,
      message
    };
  } catch (error) {
    const latency = Date.now() - start;
    return {
      path: route.path,
      status: 0,
      latency,
      check: 'FAIL',
      message: `Network error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

async function testAPI(api: typeof APIS[0]): Promise<TestResult> {
  const url = `${BASE_URL}${api.path}`;
  const start = Date.now();

  try {
    const response = await fetch(url);
    const latency = Date.now() - start;
    const status = response.status;

    const expectedStatuses = Array.isArray(api.expectStatus) ? api.expectStatus : [api.expectStatus];
    let check: 'PASS' | 'FAIL' | 'WARN' = expectedStatuses.includes(status) ? 'PASS' : 'FAIL';
    let message = `${status}`;

    if (api.expectJson) {
      try {
        const data = await response.json();
        if (status === 200) {
          // Validate minimal shape
          if (typeof data === 'object' && data !== null) {
            message += ' (valid JSON)';
          } else {
            check = 'WARN';
            message += ' (unexpected JSON structure)';
          }
        } else {
          message += ` (${data.error || data.message || 'protected'})`;
        }
      } catch {
        check = 'WARN';
        message += ' (invalid JSON)';
      }
    }

    return {
      path: api.path,
      status,
      latency,
      check,
      message
    };
  } catch (error) {
    const latency = Date.now() - start;
    return {
      path: api.path,
      status: 0,
      latency,
      check: 'FAIL',
      message: `Network error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

function printTable(results: TestResult[]) {
  console.log('\n┌─────────────────────────────────────┬────────┬──────────┬───────┬─────────────────────────────┐');
  console.log('│ Path                                │ Status │ Latency  │ Check │ Message                     │');
  console.log('├─────────────────────────────────────┼────────┼──────────┼───────┼─────────────────────────────┤');

  for (const result of results) {
    const path = result.path.padEnd(35);
    const status = result.status.toString().padEnd(6);
    const latency = `${result.latency}ms`.padEnd(8);
    const check = result.check === 'PASS' ? '✅' : result.check === 'WARN' ? '⚠️ ' : '❌';
    const message = result.message.substring(0, 27).padEnd(27);

    console.log(`│ ${path} │ ${status} │ ${latency} │ ${check}   │ ${message} │`);
  }

  console.log('└─────────────────────────────────────┴────────┴──────────┴───────┴─────────────────────────────┘');
}

async function main() {
  console.log(`\n🔍 Cabana Functional Smoke Test`);
  console.log(`📍 Base URL: ${BASE_URL}\n`);

  console.log('Testing Routes...');
  for (const route of ROUTES) {
    const result = await testRoute(route);
    results.push(result);
  }

  console.log('\nTesting APIs...');
  for (const api of APIS) {
    const result = await testAPI(api);
    results.push(result);
  }

  printTable(results);

  const passed = results.filter(r => r.check === 'PASS').length;
  const warned = results.filter(r => r.check === 'WARN').length;
  const failed = results.filter(r => r.check === 'FAIL').length;
  const avgLatency = Math.round(results.reduce((sum, r) => sum + r.latency, 0) / results.length);

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ⚠️  Warnings: ${warned}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   ⏱️  Average latency: ${avgLatency}ms\n`);

  // Export results for report generation
  const reportData = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    results,
    summary: {
      passed,
      warned,
      failed,
      avgLatency
    }
  };

  // Save to temp file for report generation
  const fs = await import('fs/promises');
  await fs.mkdir('reports', { recursive: true });
  await fs.writeFile('reports/smoke-results.json', JSON.stringify(reportData, null, 2));

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(console.error);
