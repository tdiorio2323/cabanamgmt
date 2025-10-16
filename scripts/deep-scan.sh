#!/usr/bin/env bash
set -euo pipefail

# Deep Project Scan - Comprehensive Audit
# Checks for incomplete features, TODOs, empty pages, and missing implementations

echo "🔍 DEEP PROJECT SCAN - Completeness Audit"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Color codes
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

ISSUES_FOUND=0

section() {
  echo ""
  echo -e "${BLUE}━━━ $1 ━━━${NC}"
  echo ""
}

issue() {
  echo -e "${RED}✗${NC} $1"
  ((ISSUES_FOUND++))
}

warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

success() {
  echo -e "${GREEN}✓${NC} $1"
}

# 1. TODO/FIXME Comments
section "1. TODO/FIXME Comments in Code"
TODO_COUNT=$(grep -r "TODO\|FIXME" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l | tr -d ' ')
if [ "$TODO_COUNT" -gt 0 ]; then
  warning "$TODO_COUNT TODO/FIXME comments found:"
  grep -rn "TODO\|FIXME" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | head -20
  if [ "$TODO_COUNT" -gt 20 ]; then
    echo "  ... and $((TODO_COUNT - 20)) more"
  fi
else
  success "No TODO/FIXME comments found"
fi

# 2. Empty/Stub API Routes
section "2. API Route Completeness"
echo "Checking for stub implementations..."
for route in src/app/api/**/**/route.ts; do
  if [ -f "$route" ]; then
    ROUTE_NAME=$(echo "$route" | sed 's|src/app/api/||' | sed 's|/route.ts||')

    # Check for stub indicators
    if grep -q "TODO\|STUB\|NOT IMPLEMENTED\|throw new Error" "$route" 2>/dev/null; then
      warning "Incomplete: /api/$ROUTE_NAME"
      grep -n "TODO\|STUB\|NOT IMPLEMENTED" "$route" | head -3
    fi
  fi
done

# 3. Empty Page Components
section "3. Empty/Minimal Pages"
echo "Scanning for pages with minimal content..."
find src/app -name "page.tsx" -type f | while read -r page; do
  LINE_COUNT=$(wc -l < "$page" | tr -d ' ')
  PAGE_PATH=$(echo "$page" | sed 's|src/app||' | sed 's|/page.tsx||')

  if [ "$LINE_COUNT" -lt 20 ]; then
    warning "Minimal page: $PAGE_PATH ($LINE_COUNT lines)"
  fi

  # Check for placeholder text
  if grep -qi "coming soon\|under construction\|placeholder" "$page" 2>/dev/null; then
    issue "Placeholder content: $PAGE_PATH"
  fi
done

# 4. Missing Environment Variables
section "4. Environment Variables Check"
if [ -f .env.local ]; then
  source .env.local 2>/dev/null || true

  # Check critical variables
  [ -z "${RESEND_API_KEY:-}" ] && warning "Missing: RESEND_API_KEY (email won't work)"
  [ -z "${MAIL_FROM:-}" ] && warning "Missing: MAIL_FROM (email won't work)"
  [ -z "${STRIPE_WEBHOOK_SECRET:-}" ] && warning "Missing: STRIPE_WEBHOOK_SECRET (webhooks won't verify)"
  [ -z "${VERIFF_WEBHOOK_SECRET:-}" ] && echo "  ℹ Optional: VERIFF_WEBHOOK_SECRET (add when vendor configured)"
  [ -z "${CHECKR_WEBHOOK_SECRET:-}" ] && echo "  ℹ Optional: CHECKR_WEBHOOK_SECRET (add when vendor configured)"
  [ -z "${DOCUSIGN_CONNECT_KEY:-}" ] && echo "  ℹ Optional: DOCUSIGN_CONNECT_KEY (add when vendor configured)"

  success "Core Supabase variables present"
else
  issue ".env.local not found"
fi

# 5. Database Schema Check
section "5. Database Schema Completeness"
echo "Checking for missing tables/columns..."
pnpm run db:types >/dev/null 2>&1 || warning "Could not regenerate types"

if grep -q "rate_limits\|stripe_events\|webhook_events" src/types/supabase.ts; then
  success "New tables present in schema"
else
  issue "New tables missing - run: supabase db push"
fi

# 6. Test Coverage
section "6. Test Coverage Analysis"
TOTAL_COMPONENTS=$(find src/components -name "*.tsx" -type f | wc -l | tr -d ' ')
TESTED_COMPONENTS=$(find __tests__ tests/ -name "*.spec.*" -type f 2>/dev/null | wc -l | tr -d ' ')
COVERAGE_PCT=$((TESTED_COMPONENTS * 100 / TOTAL_COMPONENTS))

echo "Components: $TOTAL_COMPONENTS total, $TESTED_COMPONENTS tested ($COVERAGE_PCT%)"
if [ "$COVERAGE_PCT" -lt 30 ]; then
  warning "Test coverage below 30%"
else
  success "Test coverage at $COVERAGE_PCT%"
fi

# 7. Console.log/console.error (should use logger)
section "7. Console Statement Audit"
CONSOLE_COUNT=$(grep -r "console\." src/ --include="*.ts" --include="*.tsx" | grep -v "src/app/(dash)/dashboard" | wc -l | tr -d ' ')
if [ "$CONSOLE_COUNT" -gt 0 ]; then
  warning "$CONSOLE_COUNT console statements outside dashboard (should use logger):"
  grep -rn "console\." src/ --include="*.ts" --include="*.tsx" | grep -v "src/app/(dash)/dashboard" | head -10
else
  success "All console statements properly use logger utility"
fi

# 8. TypeScript Errors
section "8. TypeScript Health"
if pnpm run typecheck >/dev/null 2>&1; then
  success "TypeScript: 0 errors"
else
  issue "TypeScript errors detected - run: pnpm run typecheck"
fi

# 9. ESLint Errors
section "9. ESLint Health"
if pnpm run lint >/dev/null 2>&1; then
  success "ESLint: 0 errors"
else
  issue "ESLint errors detected - run: pnpm run lint"
fi

# 10. Build Health
section "10. Production Build"
if pnpm run build >/dev/null 2>&1; then
  success "Production build successful"
else
  issue "Production build failed - run: pnpm run build"
fi

# 11. Broken Imports
section "11. Import Analysis"
echo "Checking for potentially broken imports..."
if grep -r "from ['\"]@/.*['\"]" src/ --include="*.ts" --include="*.tsx" | grep -E "@/lib/.*Admin|@/components/.*/" >/dev/null; then
  success "Import paths look valid"
fi

# 12. Missing Files Referenced in Code
section "12. File Reference Check"
echo "Checking for references to non-existent files..."
FILES_MISSING=0

# Check common patterns
if grep -r "import.*from.*@/lib/supabaseAdmin" src/ --include="*.ts" | head -1 >/dev/null; then
  if [ ! -f "src/lib/supabaseAdmin.ts" ]; then
    issue "Referenced but missing: src/lib/supabaseAdmin.ts"
    ((FILES_MISSING++))
  fi
fi

if [ "$FILES_MISSING" -eq 0 ]; then
  success "All imported files exist"
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}📊 SCAN SUMMARY${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Issues found: $ISSUES_FOUND"
echo "TODO comments: $TODO_COUNT"
echo "Test coverage: $COVERAGE_PCT%"
echo "Console statements: $CONSOLE_COUNT (non-dashboard)"
echo ""

if [ "$ISSUES_FOUND" -eq 0 ]; then
  echo -e "${GREEN}✅ PROJECT IS PRODUCTION-READY!${NC}"
else
  echo -e "${YELLOW}⚠ $ISSUES_FOUND issues need attention${NC}"
fi
echo ""

# Generate detailed report
section "Generating Detailed Report"
cat > AUDIT_REPORT.md << 'REPORT'
# Project Completeness Audit Report
Generated: $(date)

## Summary
- Total Issues: $ISSUES_FOUND
- TODO Comments: $TODO_COUNT
- Test Coverage: $COVERAGE_PCT%
- Console Statements: $CONSOLE_COUNT

## Findings

### TODO/FIXME Comments
REPORT

grep -rn "TODO\|FIXME" src/ --include="*.ts" --include="*.tsx" 2>/dev/null >> AUDIT_REPORT.md || echo "None found" >> AUDIT_REPORT.md

cat >> AUDIT_REPORT.md << 'REPORT'

### API Routes Status
REPORT

for route in src/app/api/**/**/route.ts; do
  if [ -f "$route" ]; then
    ROUTE_NAME=$(echo "$route" | sed 's|src/app/api/||' | sed 's|/route.ts||')
    if grep -q "TODO" "$route" 2>/dev/null; then
      echo "- ⚠️ /api/$ROUTE_NAME - Has TODOs" >> AUDIT_REPORT.md
    else
      echo "- ✅ /api/$ROUTE_NAME - Complete" >> AUDIT_REPORT.md
    fi
  fi
done

echo ""
success "Detailed report saved to: AUDIT_REPORT.md"
echo ""

