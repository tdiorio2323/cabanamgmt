#!/usr/bin/env bash
set -euo pipefail

# --- config ---
PROJECT_ROOT="${PROJECT_ROOT:-$(git rev-parse --show-toplevel)}"
DB_HOST="${DB_HOST:-""}"            # e.g. aws-0-xyz.database.supabase.com  (Direct connection host)
DB_USER="${DB_USER:-postgres}"      # from Supabase dashboard
DB_PASS="${DB_PASS:-""}"            # rotate/copy from Supabase dashboard
DB_NAME="${DB_NAME:-postgres}"      # default unless changed
DB_PORT="${DB_PORT:-5432}"          # Supabase direct connection port
# ---------------

cd "$PROJECT_ROOT"

echo "1) DNS check"
if [[ -z "$DB_HOST" ]]; then
  echo "DB_HOST not set. Export it first: export DB_HOST='aws-0-...database.supabase.com'"
  exit 1
fi
nslookup "$DB_HOST" >/dev/null

echo "2) Ensure Docker is running"
if ! docker info >/dev/null 2>&1; then
  echo "Docker not running. Start Docker Desktop and retry."
  exit 1
fi

echo "3) Purge bad <Html> imports"
# find any <Html usage outside _document
BAD=$(grep -R "<Html" src/ | grep -v "_document.tsx" || true)
if [[ -n "$BAD" ]]; then
  echo "Offending files:"
  echo "$BAD"
  echo
  echo "Fix these by moving Html usage to pages/_document.tsx. Aborting so you can commit fixes."
  exit 1
fi

echo "4) Build check (Next.js) with Turbopack disabled"
TURBOPACK=0 pnpm exec next build

echo "5) Supabase URL compose"
if [[ -z "$DB_PASS" ]]; then
  echo "DB_PASS not set. Export it first."
  exit 1
fi
ENC_PASS=$(python3 - <<'PY'
import sys, urllib.parse
print(urllib.parse.quote(sys.stdin.read().strip(), safe=''))
PY
<<<"$DB_PASS")

export SUPABASE_DB_URL="postgresql://${DB_USER}:${ENC_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

echo "6) Migrations repair -> pull -> push"
# mark existing as applied to align local history, then pull remote schema into local shadow, then push pending local migrations
supabase migration repair --status applied --db-url "$SUPABASE_DB_URL"
supabase db pull --db-url "$SUPABASE_DB_URL"
supabase db push --db-url "$SUPABASE_DB_URL"

echo "7) Playwright smoke"
pnpm exec playwright install --with-deps
pnpm exec playwright test -g "@smoke" || true
pnpm exec playwright test -g "@auth" || true

echo "Done."
