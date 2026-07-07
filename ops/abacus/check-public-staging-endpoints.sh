#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="${REPO_DIR:-/home/ubuntu/ois-nextgen}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=ops/abacus/lib-core-api-checks.sh
. "$SCRIPT_DIR/lib-core-api-checks.sh"
# shellcheck source=ops/abacus/lib-ui-demo-shells.sh
. "$SCRIPT_DIR/lib-ui-demo-shells.sh"
# shellcheck source=ops/abacus/lib-public-staging-runtime.sh
. "$SCRIPT_DIR/lib-public-staging-runtime.sh"

failures=0

record_failure() {
  printf 'FAIL: %s\n' "$1" >&2
  failures=$((failures + 1))
}

check_core() {
  if check_core_api_health_once "public" "$CORE_API_URL/health"; then
    printf 'PUBLIC_STAGING_CORE_READY %s\n' "$CHECK_DETAIL"
  else
    record_failure "$CHECK_DETAIL"
  fi

  if check_platform_overview_once "public" "$CORE_API_URL/platform/overview"; then
    printf 'PUBLIC_STAGING_OVERVIEW_READY %s\n' "$CHECK_DETAIL"
  else
    record_failure "$CHECK_DETAIL"
  fi

  check_route "PUBLIC_STAGING_REGISTRY_PRODUCTS" "$CORE_API_URL/platform/products" '"source":"default-db"' '"mode":"read-only"' '"products"'
  check_route "PUBLIC_STAGING_REGISTRY_WORKSPACES" "$CORE_API_URL/platform/workspaces" '"source":"default-db"' '"mode":"read-only"' '"workspaces"'
  check_route "PUBLIC_STAGING_REGISTRY_PROJECTS" "$CORE_API_URL/platform/projects" '"source":"default-db"' '"mode":"read-only"' '"projects"'
  check_route "PUBLIC_STAGING_REGISTRY_MODULES" "$CORE_API_URL/platform/modules" '"source":"default-db"' '"mode":"read-only"' '"modules"'
  check_route "PUBLIC_STAGING_REGISTRY_INSTALLATIONS" "$CORE_API_URL/platform/installations" '"source":"default-db"' '"mode":"read-only"' '"installations"'
  check_route "PUBLIC_STAGING_REGISTRY_AGGREGATE" "$CORE_API_URL/platform/registry" '"source":"default-db"' '"mode":"read-only"' '"products"' '"projects"'
}

check_root_shell() {
  local label="$1"
  local url="$2"
  local product_code="$3"
  local app_name="$4"

  if public_staging_check_root_shell_once "$label" "$url" "$product_code" "$app_name"; then
    printf 'PUBLIC_STAGING_UI_READY %s\n' "$PUBLIC_STAGING_DETAIL"
  else
    record_failure "$PUBLIC_STAGING_DETAIL"
  fi
}

check_route() {
  local label="$1"
  local url="$2"
  shift 2

  if public_staging_check_route_once "$label" "$url" "$@"; then
    printf 'PUBLIC_STAGING_ROUTE_READY %s\n' "$PUBLIC_STAGING_DETAIL"
  else
    record_failure "$PUBLIC_STAGING_DETAIL"
  fi
}

printf '%s\n' "Checking OIS NextGen public staging endpoints."
public_staging_print_safety
printf '%s\n' "This script does not probe legacy endpoints, write endpoints or /auth/demo-login."

check_core
check_root_shell "OIS_CONSOLE_PUBLIC_ROOT" "$OIS_CONSOLE_PUBLIC_URL" "OIS_CONSOLE" "OIS Console"
check_route "OIS_CONSOLE_PUBLIC_DASHBOARD" "$OIS_CONSOLE_PUBLIC_URL/dashboard" "Platform Overview" "DEMO DATA - NOT PRODUCTION"
check_route "OIS_CONSOLE_PUBLIC_PRODUCTS" "$OIS_CONSOLE_PUBLIC_URL/products" "Products &amp; Modules" "Product &amp; Module Overview" "PITS_RUNTIME_SHELL" "OIS_CONSOLE"
check_route "OIS_CONSOLE_PUBLIC_WORKSPACES" "$OIS_CONSOLE_PUBLIC_URL/workspaces" "Organizations, Workspaces &amp; Projects" "Workspace Overview" "PMC Org Demo" "OIS_CONSOLE"
check_route "OIS_CONSOLE_PUBLIC_RUNTIME" "$OIS_CONSOLE_PUBLIC_URL/runtime" "Runtime Status" "Core API source:" "OIS_CONSOLE"
check_root_shell "PITS_SHELL_PUBLIC_ROOT" "$PITS_SHELL_PUBLIC_URL" "PITS_SHELL" "PITS Shell"
check_route "PITS_SHELL_PUBLIC_PROJECTS" "$PITS_SHELL_PUBLIC_URL/projects" "Project Selector" "EMERALD_PRECINCT_DEMO" "DEMO DATA - NOT PRODUCTION"
check_route "PITS_SHELL_PUBLIC_RUNTIME" "$PITS_SHELL_PUBLIC_URL/runtime" "Runtime Status" "Core API source:" "PITS_SHELL"

if [ "$failures" -gt 0 ]; then
  printf '\nPUBLIC_STAGING_ENDPOINT_CHECK_FAILED failures=%s\n' "$failures" >&2
  exit 1
fi

printf '\nPUBLIC_STAGING_ENDPOINT_CHECK_PASSED Cloudflare Tunnel OIS/PITS endpoints and Core API checks passed.\n'
