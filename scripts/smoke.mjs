/** Simple smoke tester for Cabana (front-end + auth gates)
 * Usage: node scripts/smoke.mjs [baseURL]
 * baseURL defaults to NEXT_PUBLIC_BASE_URL or http://localhost:3000
 */
const base = (process.argv[2] || process.env.NEXT_PUBLIC_SUPABASE_URL_BASE || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');
const routes = [
  { path: '/', expect: 'public' },
  { path: '/login', expect: 'public' },
  { path: '/debug/session', expect: 'public' }, // shows null or session JSON
  { path: '/dashboard', expect: 'protected' },
  { path: '/dashboard/invite', expect: 'protected' },
  { path: '/dashboard/users', expect: 'protected' },
  { path: '/admin/codes', expect: 'protected' },
];
const ok = (s) => `✅ ${s}`;
const warn = (s) => `⚠️  ${s}`;
const err = (s) => `❌ ${s}`;
const pad = (s, n = 28) => (s + ' '.repeat(Math.max(0, n - s.length)));

async function hit(url) {
  try {
    const res = await fetch(url, { redirect: 'manual' }); // so we can see 302s
    const status = res.status;
    const loc = res.headers.get('location') || '';
    return { status, location: loc };
  } catch (e) {
    return { status: 0, error: e.message || String(e) };
  }
}

(async () => {
  console.log(`\n🔍 Cabana Smoke Test\nBase: ${base}\n`);
  let passes = 0, fails = 0;
  for (const r of routes) {
    const url = base + r.path;
    const { status, location, error } = await hit(url);
    let label = pad(r.path);

    if (error) {
      console.log(err(`${label} network error: ${error}`));
      fails++; continue;
    }

    // Public = accept 200
    if (r.expect === 'public') {
      if (status === 200) { console.log(ok(`${label} 200 OK`)); passes++; }
      else if (status === 302 || status === 301) {
        console.log(warn(`${label} ${status} → ${location || '(no location)'}`)); passes++; // not fatal
      } else {
        console.log(err(`${label} ${status}`)); fails++;
      }
      continue;
    }

    // Protected = either 200 (authed in dev) OR 302 redirect to /login
    if (r.expect === 'protected') {
      if (status === 200) { console.log(ok(`${label} 200 OK (authed)`)); passes++; }
      else if ((status === 302 || status === 301) && (location.includes('/login') || location.startsWith('/auth'))) {
        console.log(ok(`${label} ${status} → login (gate works)`)); passes++;
      } else {
        console.log(err(`${label} ${status} (unexpected${location ? ` → ${location}` : ''})`)); fails++;
      }
      continue;
    }
  }

  console.log(`\nSummary: ${passes} passed, ${fails} failed\n`);
  process.exit(fails ? 1 : 0);
})();
