#!/usr/bin/env bash
set -euo pipefail

# Post-Deployment Smoke Test Script
# Tests critical endpoints after deployment

BASE_URL="${1:-https://app.cabana.com}"
ADMIN_TOKEN="${2:-}"

echo "🧪 Running Post-Deploy Smoke Tests..."
echo "   Base URL: $BASE_URL"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

test_endpoint() {
  local endpoint=$1
  local expected=$2
  local description=$3
  local auth_required=${4:-false}

  echo -n "Testing $description... "

  local curl_cmd="curl -fsSL"
  if [ "$auth_required" = "true" ] && [ -n "$ADMIN_TOKEN" ]; then
    curl_cmd="$curl_cmd -b \"sb-access-token=$ADMIN_TOKEN\""
  fi

  local response
  if response=$(eval "$curl_cmd \"$BASE_URL$endpoint\"" 2>&1); then
    if echo "$response" | jq -e "$expected" >/dev/null 2>&1; then
      echo -e "${GREEN}✓ PASS${NC}"
      return 0
    else
      echo -e "${RED}✗ FAIL${NC} (unexpected response)"
      echo "  Response: $response"
      return 1
    fi
  else
    echo -e "${RED}✗ FAIL${NC} (request failed)"
    echo "  Error: $response"
    return 1
  fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Health Checks"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_endpoint "/api/health" ".ok == true" "Application health" false
test_endpoint "/api/db/health" ".ok == true" "Database health" false

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Protected Endpoints (requires auth)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -z "$ADMIN_TOKEN" ]; then
  echo -e "${RED}⚠ Skipping auth tests (no ADMIN_TOKEN provided)${NC}"
  echo "  Usage: $0 <BASE_URL> <ADMIN_TOKEN>"
else
  test_endpoint "/api/invites/list" ".invites | length >= 0" "Invites list" true
  test_endpoint "/api/vip/list" ".codes | length >= 0" "VIP codes list" true
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Smoke tests complete"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

