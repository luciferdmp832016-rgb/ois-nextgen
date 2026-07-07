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

section() {
  printf '\n== %s ==\n' "$1"
}

record_failure() {
  printf 'FAIL: %s\n' "$1" >&2
  failures=$((failures + 1))
}

check_service() {
  local service_name="$1"
  local label="$2"

  if public_staging_report_service "$service_name" "$label"; then
    printf 'SERVICE_READY %s\n' "$PUBLIC_STAGING_DETAIL"
  else
    record_failure "$PUBLIC_STAGING_DETAIL"
  fi
}

check_cloudflared_service() {
  local service_name="$1"
  local label="$2"

  if public_staging_report_cloudflared_service "$service_name" "$label"; then
    printf 'SERVICE_READY %s\n' "$PUBLIC_STAGING_DETAIL"
  else
    record_failure "$PUBLIC_STAGING_DETAIL"
  fi
}

check_health() {
  local label="$1"
  local url="$2"

  if check_core_api_health_once "$label" "$url"; then
    printf 'HEALTH_READY %s\n' "$CHECK_DETAIL"
  else
    record_failure "$CHECK_DETAIL"
  fi
}

check_overview() {
  local label="$1"
  local url="$2"

  if check_platform_overview_once "$label" "$url"; then
    printf 'PLATFORM_OVERVIEW_READY %s\n' "$CHECK_DETAIL"
  else
    record_failure "$CHECK_DETAIL"
  fi
}

check_root_shell() {
  local label="$1"
  local url="$2"
  local product_code="$3"
  local app_name="$4"

  if public_staging_check_root_shell_once "$label" "$url" "$product_code" "$app_name"; then
    printf 'UI_READY %s\n' "$PUBLIC_STAGING_DETAIL"
  else
    record_failure "$PUBLIC_STAGING_DETAIL"
  fi
}

check_route() {
  local label="$1"
  local url="$2"
  shift 2

  if public_staging_check_route_once "$label" "$url" "$@"; then
    printf 'ROUTE_READY %s\n' "$PUBLIC_STAGING_DETAIL"
  else
    record_failure "$PUBLIC_STAGING_DETAIL"
  fi
}

section "Safety"
printf '%s\n' "Read-only public staging runtime status."
public_staging_print_safety

section "Repository"
public_staging_require_repo
cd "$REPO_DIR"
printf 'repo=%s\n' "$REPO_DIR"
printf 'branch=%s\n' "$(git branch --show-current)"
printf 'commit=%s\n' "$(git rev-parse HEAD)"
printf '%s\n' "working_tree_status:"
git status --short

section "Systemd"
check_service "$CORE_API_SERVICE" "CORE_API"
check_service "$OIS_CONSOLE_SERVICE" "OIS_CONSOLE"
check_service "$PITS_SHELL_SERVICE" "PITS_SHELL"
check_cloudflared_service "$CLOUDFLARED_SERVICE" "CLOUDFLARED"

section "UI Route Manifests"
if ! bash "$SCRIPT_DIR/verify-ui-route-manifests.sh"; then
  record_failure "UI production route manifest verification failed"
fi

section "Local Runtime Endpoints"
check_health "local" "$CORE_API_LOCAL_BASE/health"
check_root_shell "OIS_CONSOLE_LOCAL" "$OIS_CONSOLE_LOCAL_URL" "OIS_CONSOLE" "OIS Console"
check_route "OIS_CONSOLE_LOCAL_DASHBOARD" "$OIS_CONSOLE_LOCAL_URL/dashboard" "Platform Overview" "DEMO DATA - NOT PRODUCTION"
check_route "OIS_CONSOLE_LOCAL_PRODUCTS" "$OIS_CONSOLE_LOCAL_URL/products" "Products &amp; Modules" "Product &amp; Module Overview" "OIS_CONSOLE"
check_route "OIS_CONSOLE_LOCAL_WORKSPACES" "$OIS_CONSOLE_LOCAL_URL/workspaces" "Organizations, Workspaces &amp; Projects" "Workspace Overview" "OIS_CONSOLE"
check_route "OIS_CONSOLE_LOCAL_RUNTIME" "$OIS_CONSOLE_LOCAL_URL/runtime" "Runtime Status" "Core API source:" "OIS_CONSOLE"
check_root_shell "PITS_SHELL_LOCAL" "$PITS_SHELL_LOCAL_URL" "PITS_SHELL" "PITS Shell"
check_route "PITS_SHELL_LOCAL_PROJECTS" "$PITS_SHELL_LOCAL_URL/projects" "Project Selector" "DEMO DATA - NOT PRODUCTION"
check_route "PITS_SHELL_LOCAL_RUNTIME" "$PITS_SHELL_LOCAL_URL/runtime" "Runtime Status" "Core API source:" "PITS_SHELL"

section "Public Core API Endpoints"
check_health "public" "$CORE_API_URL/health"
check_overview "public" "$CORE_API_URL/platform/overview"

section "Public Cloudflare Tunnel Product Endpoints"
check_root_shell "OIS_CONSOLE_PUBLIC_ROOT" "$OIS_CONSOLE_PUBLIC_URL" "OIS_CONSOLE" "OIS Console"
check_route "OIS_CONSOLE_PUBLIC_DASHBOARD" "$OIS_CONSOLE_PUBLIC_URL/dashboard" "Platform Overview" "DEMO DATA - NOT PRODUCTION"
check_route "OIS_CONSOLE_PUBLIC_PRODUCTS" "$OIS_CONSOLE_PUBLIC_URL/products" "Products &amp; Modules" "Product &amp; Module Overview" "OIS_CONSOLE"
check_route "OIS_CONSOLE_PUBLIC_WORKSPACES" "$OIS_CONSOLE_PUBLIC_URL/workspaces" "Organizations, Workspaces &amp; Projects" "Workspace Overview" "OIS_CONSOLE"
check_route "OIS_CONSOLE_PUBLIC_RUNTIME" "$OIS_CONSOLE_PUBLIC_URL/runtime" "Runtime Status" "Core API source:" "OIS_CONSOLE"
check_root_shell "PITS_SHELL_PUBLIC_ROOT" "$PITS_SHELL_PUBLIC_URL" "PITS_SHELL" "PITS Shell"
check_route "PITS_SHELL_PUBLIC_PROJECTS" "$PITS_SHELL_PUBLIC_URL/projects" "Project Selector" "DEMO DATA - NOT PRODUCTION"
check_route "PITS_SHELL_PUBLIC_RUNTIME" "$PITS_SHELL_PUBLIC_URL/runtime" "Runtime Status" "Core API source:" "PITS_SHELL"

if [ "$failures" -gt 0 ]; then
  printf '\nPUBLIC_STAGING_RUNTIME_STATUS_FAILED failures=%s\n' "$failures" >&2
  exit 1
fi

printf '\nPUBLIC_STAGING_RUNTIME_STATUS_PASSED Core API, UI systemd services, cloudflared and public endpoints are healthy.\n'
