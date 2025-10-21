✅ Release Checklist: all items must be verified before shipping.

Legend: ✅ = done, ⬜️ = todo

## Code Health

- [⬜️] Lint clean  
  _Why it matters_: Guarantees coding standards and catches obvious bugs.  
  **Run**  
  ```bash
  pnpm dlx eslint .
  ```  
  **Pass criteria**  
  - Command exits 0  
  - No warnings/errors in stdout

- [⬜️] Typecheck clean  
  _Why it matters_: Ensures TypeScript contracts are satisfied.  
  **Run**  
  ```bash
  pnpm dlx tsc --noEmit
  ```  
  **Pass criteria**  
  - Exit code 0  
  - No “error TS” strings in output

- [⬜️] Dead imports and TODO/FIXME sweep  
  _Why it matters_: Prevents stale code and untracked tech debt.  
  **Run**  
  ```bash
  pnpm dlx eslint . --rule 'no-restricted-syntax:["error","TaggedTemplateExpression"]' && rg "TODO|FIXME" -n src app supabase
  ```  
  **Pass criteria**  
  - eslint command exits 0  
  - rg prints no matches (or all matches triaged in backlog)

- [⬜️] Path aliases consistent in tsconfig + vitest  
  _Why it matters_: Avoids module resolution drift between runtime and tests.  
  **Run**  
  ```bash
  jq '.compilerOptions.paths["@/*"]' tsconfig.json && grep -n "alias" vitest.config.ts
  ```  
  **Pass criteria**  
  - tsconfig `@/*` path equals `["./src/*"]`  
  - vitest config contains matching alias block

## Testing

- [⬜️] Unit tests 100% passing with coverage ≥70% lines  
  _Why it matters_: Validates core logic and regression safety.  
  **Run**  
  ```bash
  pnpm dlx vitest run --coverage
  cat coverage/coverage-summary.json | jq '.total.lines.pct >= 70'
  ```  
  **Pass criteria**  
  - Vitest exits 0  
  - coverage JSON returns `true` for threshold  
  - Coverage artifact stored under `coverage/`

- [⬜️] E2E smoke (skip if creds unavailable)  
  _Why it matters_: Confirms primary flows in real browser context.  
  **Run**  
  ```bash
  BASE_URL=http://localhost:3000 pnpm test:e2e
  ```  
  **Pass criteria**  
  - Exit code 0 or documented skip with reason  
  - Key routes (/dashboard, /dashboard/invites/*) exercised

- [⬜️] Component tests status  
  _Why it matters_: Ensures no orphaned/untested components.  
  **Run**  
  ```bash
  if ls __tests__ 2>/dev/null; then pnpm dlx vitest run __tests__; else echo "no component tests"; fi
  ```  
  **Pass criteria**  
  - Either tests pass (exit 0) or folder absent/removed

## Security & Secrets

- [⬜️] Env audit complete  
  _Why it matters_: Prevents runtime failures due to missing secrets.  
  **Run**  
  ```bash
  cat .env.example
  pnpm dlx dotenvx run -f .env.example -- printenv | grep -E 'SUPABASE|STRIPE|RESEND'
  ```  
  **Pass criteria**  
  - .env.example lists all required vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, Stripe, Resend, etc.)  
  - Command prints placeholder values only

- [⬜️] Repo secrets scan clean  
  _Why it matters_: Avoids leaking credentials.  
  **Run**  
  ```bash
  git grep -nE "(SECRET|PASSWORD|API_KEY|-----BEGIN)" || true
  ```  
  **Pass criteria**  
  - No real secrets in output (only placeholder strings)

- [⬜️] Dependency audit  
  _Why it matters_: Surfaces known vulnerabilities pre-release.  
  **Run**  
  ```bash
  pnpm audit --prod
  ```  
  **Pass criteria**  
  - Exit code 0 OR documented allowlist with mitigation

- [⬜️] Security headers enforced  
  _Why it matters_: Mitigates XSS + clickjacking risk.  
  **Run**  
  ```bash
  curl -Is https://www.cabanagrp.com | grep -E "Content-Security-Policy|Strict-Transport-Security|X-Frame-Options"
  ```  
  **Pass criteria**  
  - Response includes CSP, HSTS, X-Frame-Options headers from middleware

## Build & Deploy

- [⬜️] Reproducible production build  
  _Why it matters_: Guarantees artifacts compile locally before deploy.  
  **Run**  
  ```bash
  pnpm build
  ```  
  **Pass criteria**  
  - Exit code 0  
  - Next.js build summary shows no errors

- [⬜️] Vercel production deploy  
  _Why it matters_: Confirms shipping bits match repo state.  
  **Run**  
  ```bash
  vercel --prod
  ```  
  **Pass criteria**  
  - Command exits 0  
  - Inspect URL reports status “Ready”

- [⬜️] Domain + key routes return 200  
  _Why it matters_: Validates live endpoints after deploy.  
  **Run**  
  ```bash
  for p in / /health /dashboard /dashboard/invites /dashboard/invites/new /dashboard/invites/resend /dashboard/invites/revoke; do
    echo "== $p" && curl -Is https://www.cabanagrp.com$p | head -n1 | grep "200";
  done
  ```  
  **Pass criteria**  
  - Every route prints `HTTP/2 200`

- [⬜️] Redirects verified  
  _Why it matters_: Legacy invite URLs must map to new dashboard paths.  
  **Run**  
  ```bash
  curl -Is https://www.cabanagrp.com/invites/new | grep -i location
  curl -Is https://www.cabanagrp.com/invites/resend | grep -i location
  curl -Is https://www.cabanagrp.com/invites/revoke | grep -i location
  ```  
  **Pass criteria**  
  - Each response header `Location: /dashboard/invites/...`

- [⬜️] Cache/static assets check  
  _Why it matters_: Ensures large assets optimized & caching configured.  
  **Run**  
  ```bash
  curl -Is https://www.cabanagrp.com/td-studios-black-marble.jpg | grep -E "200|Cache-Control"
  ```  
  **Pass criteria**  
  - Asset returns 200  
  - Cache-Control header present (or document fallback)

## Observability

- [⬜️] Healthcheck returning 200  
  _Why it matters_: Uptime monitors rely on it.  
  **Run**  
  ```bash
  curl -Is https://www.cabanagrp.com/health | head -n1 | grep "200"
  ```  
  **Pass criteria**  
  - HTTP/2 200 response

- [⬜️] Error logging verified  
  _Why it matters_: Capture runtime issues for diagnosis.  
  **Run**  
  ```bash
  rg "logger.error" src || rg "console.error" src
  ```  
  **Pass criteria**  
  - Logging utility present (e.g., src/lib/logger.ts)  
  - Usage in API handlers or middleware

- [⬜️] Basic uptime probe configured  
  _Why it matters_: Ongoing monitoring beyond manual curls.  
  **Run**  
  ```bash
  grep -n "monitor" README.md || echo "Document external uptime monitor"
  ```  
  **Pass criteria**  
  - README or runbook references uptime tooling OR action item logged

- [⬜️] Error tracking provider wired (or explicitly N/A)  
  _Why it matters_: Detect unhandled exceptions in prod.  
  **Run**  
  ```bash
  rg "Sentry" src || echo "Document N/A in release notes"
  ```  
  **Pass criteria**  
  - Sentry/monitoring client initialized OR doc states “N/A”

## Product QA

- [⬜️] Core dashboard flows load  
  _Why it matters_: Confirms UI navigates without crashes.  
  **Run**  
  ```bash
  npx playwright test tests/smoke.generated.spec.ts --grep "dashboard" || echo "Manual QA: capture screenshot + notes"
  ```  
  **Pass criteria**  
  - Automated run passes OR manual validation recorded with evidence

- [⬜️] No client console errors on first load  
  _Why it matters_: Silent client errors degrade UX.  
  **Run**  
  ```bash
  npx playwright test tests/smoke.generated.spec.ts --grep "console" || echo "Manual: check devtools console"
  ```  
  **Pass criteria**  
  - No “console.error” logged during test/manual session

- [⬜️] Lighthouse desktop ≥80 across core categories  
  _Why it matters_: Baseline performance & accessibility.  
  **Run**  
  ```bash
  npx @lhci/cli autorun --collect.url=https://www.cabanagrp.com --upload.target=filesystem --upload.outputDir=.lighthouse
  ```  
  **Pass criteria**  
  - Report scores for Performance, Accessibility, Best Practices ≥ 80  
  - Artifact saved under `.lighthouse/`

## Docs & Ops

- [⬜️] README quickstart current  
  _Why it matters_: Onboards contributors without drift.  
  **Run**  
  ```bash
  rg "pnpm" README.md && rg "vercel --prod" README.md
  ```  
  **Pass criteria**  
  - README lists pnpm workflow & deploy command  
  - Any outdated npm references updated

- [⬜️] .env.example complete  
  _Why it matters_: Prevents missing runtime variables.  
  **Run**  
  ```bash
  cat .env.example | grep -E "NEXT_PUBLIC_SUPABASE_URL|SUPABASE_SERVICE_ROLE_KEY|STRIPE_SECRET_KEY|RESEND_API_KEY"
  ```  
  **Pass criteria**  
  - All required variables present with comments/placeholders

- [⬜️] Release notes template ready  
  _Why it matters_: Streamlines changelog communication.  
  **Run**  
  ```bash
  test -f docs/RELEASE_TEMPLATE.md || echo "Create release template doc"
  ```  
  **Pass criteria**  
  - Template exists (or create with headings: Summary, Changes, Testing)

- [⬜️] Runbooks documented (deploy/rollback/hotfix)  
  _Why it matters_: Enables rapid incident response.  
  **Run**  
  ```bash
  rg "Rollback" docs || echo "Add rollback section to DEPLOYMENT_GUIDE.md"
  ```  
  **Pass criteria**  
  - Docs include deploy + rollback + hotfix instructions

- [⬜️] Supabase backup procedure captured  
  _Why it matters_: Ensures data recovery path.  
  **Run**  
  ```bash
  rg "supabase db dump" docs supabase || echo "Document: supabase db dump --project-ref <ref>"
  ```  
  **Pass criteria**  
  - Command documented to export database snapshot

## Release & Handoff

- [⬜️] Version bump and git tag  
  _Why it matters_: Tracks release lineage.  
  **Run**  
  ```bash
  pnpm version patch
  git push
  git tag -a vX.Y.Z -m "Release vX.Y.Z"
  git push --tags
  ```  
  **Pass criteria**  
  - package.json version bumped  
  - New annotated tag pushed

- [⬜️] GitHub Release published  
  _Why it matters_: Provides changelog + artifact reference.  
  **Run**  
  ```bash
  gh release create vX.Y.Z --generate-notes
  ```  
  **Pass criteria**  
  - Release visible on GitHub with autogenerated notes

- [⬜️] FINAL_CHECKLIST archived  
  _Why it matters_: Keeps historical compliance.  
  **Run**  
  ```bash
  test -f FINAL_CHECKLIST.md && git add FINAL_CHECKLIST.md && git commit -m "docs: add release checklist" && git push
  ```  
  **Pass criteria**  
  - FINAL_CHECKLIST.md committed at repo root

## Sign-off

- Date: __________  
- Commit SHA: __________  
- Tag: __________  
- Deployer: __________
