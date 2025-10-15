#!/usr/bin/env bash
set -euo pipefail

# Production Deployment Orchestration Script
# Runs all pre-deploy checks and guides deployment process

echo "🚀 Cabana Management - Production Deployment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

step_counter=1

print_step() {
  echo -e "${BLUE}[$step_counter/8]${NC} $1"
  ((step_counter++))
}

# Step 1: Verify local build
print_step "Verifying local build..."
if pnpm run ci:verify >/dev/null 2>&1; then
  echo -e "  ${GREEN}✓${NC} Local build passing"
else
  echo -e "  ${RED}✗${NC} Local build failed"
  echo "  Run: pnpm run ci:verify"
  exit 1
fi

# Step 2: Check git status
print_step "Checking git status..."
if [ -z "$(git status --porcelain)" ]; then
  echo -e "  ${GREEN}✓${NC} Working directory clean"
else
  echo -e "  ${YELLOW}⚠${NC} Uncommitted changes detected"
  git status --short
  read -p "  Continue anyway? [y/N] " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# Step 3: Verify migrations
print_step "Verifying migrations..."
MIGRATION_COUNT=$(supabase migration list 2>&1 | grep -c "20251015" || echo "0")
if [ "$MIGRATION_COUNT" -eq 3 ]; then
  echo -e "  ${GREEN}✓${NC} All 3 new migrations applied to remote"
else
  echo -e "  ${RED}✗${NC} Migrations not fully applied"
  echo "  Run: supabase db push"
  exit 1
fi

# Step 4: Generate updated types
print_step "Regenerating database types..."
pnpm run db:types >/dev/null 2>&1
echo -e "  ${GREEN}✓${NC} Types regenerated from remote schema"

# Step 5: Environment variables checklist
print_step "Environment variables checklist..."
echo ""
echo "  📋 Required variables for Vercel production:"
echo ""
echo "  Email Provider:"
echo "    - RESEND_API_KEY"
echo "    - MAIL_FROM"
echo ""
echo "  Webhook Secrets (optional, add when vendors configured):"
echo "    - VERIFF_WEBHOOK_SECRET or ONFIDO_WEBHOOK_SECRET"
echo "    - CHECKR_WEBHOOK_SECRET or CERTN_WEBHOOK_SECRET"
echo "    - DOCUSIGN_CONNECT_KEY"
echo ""
read -p "  Have you added these to Vercel? [y/N] " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo ""
  echo "  Run: ./scripts/sync-vercel-env.sh for detailed instructions"
  exit 1
fi
echo -e "  ${GREEN}✓${NC} Environment variables confirmed"

# Step 6: Push to main
print_step "Git push status..."
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo -e "  ${YELLOW}⚠${NC} Not on main branch (currently on: $CURRENT_BRANCH)"
  read -p "  Switch to main and push? [y/N] " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    git checkout main
    git pull origin main
  else
    exit 1
  fi
fi

UNPUSHED=$(git log origin/main..HEAD --oneline | wc -l | tr -d ' ')
if [ "$UNPUSHED" -eq 0 ]; then
  echo -e "  ${GREEN}✓${NC} All commits pushed to origin/main"
else
  echo -e "  ${YELLOW}⚠${NC} $UNPUSHED unpushed commits"
  read -p "  Push now? [y/N] " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push origin main
    echo -e "  ${GREEN}✓${NC} Pushed to origin/main"
  fi
fi

# Step 7: Vercel deployment
print_step "Vercel deployment..."
echo ""
echo -e "  ${BLUE}ℹ${NC} Vercel auto-deploys on push to main"
echo "  Monitor: https://vercel.com/your-org/cabanamgmt/deployments"
echo ""
echo "  Or deploy manually:"
echo "    vercel --prod"
echo ""
read -p "  Press Enter when deployment is live..."

# Step 8: Post-deploy smoke test
print_step "Post-deployment smoke test..."
echo ""
PROD_URL="${VERCEL_URL:-https://app.cabana.com}"
read -p "  Production URL [$PROD_URL]: " INPUT_URL
PROD_URL="${INPUT_URL:-$PROD_URL}"

echo ""
echo "  Running smoke tests against: $PROD_URL"
echo ""

if ./scripts/smoke-after-deploy.sh "$PROD_URL" 2>&1 | grep -q "PASS"; then
  echo -e "${GREEN}✓${NC} Smoke tests passed"
else
  echo -e "${RED}✗${NC} Smoke tests failed - check logs"
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 DEPLOYMENT COMPLETE!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Post-Deploy Tasks:"
echo "  1. Configure webhook endpoints in vendor dashboards"
echo "  2. Test email delivery (create an invite)"
echo "  3. Set up monitoring alerts (Sentry, Stripe)"
echo "  4. Schedule PII purge CRON job"
echo "  5. Mobile responsive testing"
echo ""
echo "📖 See BUILD_UNBLOCK_SUMMARY.md for full checklist"
echo ""

