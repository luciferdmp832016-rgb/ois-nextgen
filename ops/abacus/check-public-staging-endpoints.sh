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
  check_route "PUBLIC_STAGING_REGISTRY_HEALTH" "$CORE_API_URL/platform/registry/health" '"source":"default-db"' '"mode":"read-only"' '"summary"' '"entities"' '"Reachable"'
  check_route "PUBLIC_STAGING_REGISTRY_READINESS" "$CORE_API_URL/platform/registry/readiness" '"source":"default-db"' '"mode":"read-only"' '"summary"' '"entities"' '"READY"'

  if public_staging_discover_registry_ids "$CORE_API_URL"; then
    printf 'PUBLIC_STAGING_REGISTRY_IDS_READY %s\n' "$PUBLIC_STAGING_DETAIL"
    check_route "PUBLIC_STAGING_PRODUCT_DETAIL" "$CORE_API_URL/platform/products/$REGISTRY_PRODUCT_ID" '"source":"default-db"' '"mode":"read-only"' '"product"' '"relationships"'
    check_route "PUBLIC_STAGING_PRODUCT_CODE_DETAIL" "$CORE_API_URL/platform/products/code/$REGISTRY_PRODUCT_CODE" '"source":"default-db"' '"mode":"read-only"' '"product"' '"relationships"'
    check_route "PUBLIC_STAGING_WORKSPACE_DETAIL" "$CORE_API_URL/platform/workspaces/$REGISTRY_WORKSPACE_ID" '"source":"default-db"' '"mode":"read-only"' '"workspace"' '"relationships"'
    check_route "PUBLIC_STAGING_PROJECT_DETAIL" "$CORE_API_URL/platform/projects/$REGISTRY_PROJECT_ID" '"source":"default-db"' '"mode":"read-only"' '"project"' '"relationships"'
    check_route "PUBLIC_STAGING_MODULE_DETAIL" "$CORE_API_URL/platform/modules/$REGISTRY_MODULE_ID" '"source":"default-db"' '"mode":"read-only"' '"module"' '"relationships"'
    check_route "PUBLIC_STAGING_INSTALLATION_DETAIL" "$CORE_API_URL/platform/installations/$REGISTRY_INSTALLATION_ID" '"source":"default-db"' '"mode":"read-only"' '"installation"' '"relationships"'
    check_controlled_404 "PUBLIC_STAGING_PRODUCT_DETAIL_404" "$CORE_API_URL/platform/products/stage-1c-missing-product" '"code":"NOT_FOUND"' '"entity":"product"'
  else
    record_failure "$PUBLIC_STAGING_DETAIL"
  fi
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

check_absent_markers() {
  local label="$1"
  local url="$2"
  shift 2
  local body=""
  local code=""
  local marker

  if ! public_staging_http_get_body body code "$url"; then
    record_failure "$label request failed ($PUBLIC_STAGING_DETAIL)"
    return
  fi

  if [ "$code" != "200" ]; then
    record_failure "$label expected HTTP 200 got HTTP $code"
    return
  fi

  for marker in "$@"; do
    if [[ "$body" == *"$marker"* ]]; then
      record_failure "$label contains forbidden marker: $marker"
      return
    fi
  done

  printf 'PUBLIC_STAGING_LINK_BOUNDARY_READY %s forbidden_markers=absent\n' "$label"
}

check_controlled_404() {
  local label="$1"
  local url="$2"
  shift 2
  local body=""
  local code=""
  local marker

  if ! public_staging_http_get_body body code "$url"; then
    record_failure "$label request failed ($PUBLIC_STAGING_DETAIL)"
    return
  fi

  if [ "$code" != "404" ]; then
    record_failure "$label expected HTTP 404 got HTTP $code"
    return
  fi

  for marker in "$@"; do
    if [[ "$body" != *"$marker"* ]]; then
      record_failure "$label missing marker: $marker"
      return
    fi
  done

  printf 'PUBLIC_STAGING_ROUTE_404_READY %s HTTP 404 markers=verified\n' "$label"
}

printf '%s\n' "Checking OIS NextGen public staging endpoints."
public_staging_print_safety
printf '%s\n' "This script does not probe legacy endpoints, write endpoints or /auth/demo-login."

check_core
check_absent_markers "PUBLIC_STAGING_REGISTRY_HEALTH_LINK_BOUNDARY" "$CORE_API_URL/platform/registry/health" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
check_absent_markers "PUBLIC_STAGING_REGISTRY_READINESS_LINK_BOUNDARY" "$CORE_API_URL/platform/registry/readiness" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
check_root_shell "OIS_CONSOLE_PUBLIC_ROOT" "$OIS_CONSOLE_PUBLIC_URL" "OIS_CONSOLE" "OIS Console"
check_route "OIS_CONSOLE_PUBLIC_SHELL_STANDARD" "$OIS_CONSOLE_PUBLIC_URL" "Modern Shell Layout" "Shell Navigation Toggle" "Fixed Navigation Shell" "Responsive Product Shell"
check_route "OIS_CONSOLE_PUBLIC_OWNER_DESIGN_SYSTEM" "$OIS_CONSOLE_PUBLIC_URL" "Owner-first Design System" "Visual Hierarchy Standard" "Owner-friendly Status Badges"
check_route "OIS_CONSOLE_PUBLIC_ROOT_COCKPIT" "$OIS_CONSOLE_PUBLIC_URL" "Owner Registry Cockpit / Registry Runtime Summary" "Ready to operate" "Forbidden link guard" "OIS_CONSOLE"
check_route "OIS_CONSOLE_PUBLIC_DASHBOARD" "$OIS_CONSOLE_PUBLIC_URL/dashboard" "Platform Overview" "Owner Registry Cockpit / Registry Runtime Summary" "Registry Governance / Readiness" "Registry Runtime Health" "Missing runtime URL" "Forbidden link guard" "DEMO DATA - NOT PRODUCTION"
check_route "OIS_CONSOLE_PUBLIC_PRODUCTS" "$OIS_CONSOLE_PUBLIC_URL/products" "Products &amp; Modules" "Product &amp; Module Overview" "Owner Registry Cockpit / Registry Runtime Summary" "Registry Governance / Readiness" "Registry Runtime Health" "Runtime health:" "Readiness:" "Linked to PITS" "PITS_RUNTIME_SHELL" "OIS_CONSOLE"
check_route "OIS_CONSOLE_PUBLIC_WORKSPACES" "$OIS_CONSOLE_PUBLIC_URL/workspaces" "Organizations, Workspaces &amp; Projects" "Workspace Overview" "Owner Registry Cockpit / Registry Runtime Summary" "Registry Governance / Readiness" "Registry Runtime Health" "Runtime health:" "Readiness:" "PMC Org Demo" "OIS_CONSOLE"
check_route "OIS_CONSOLE_PUBLIC_RUNTIME" "$OIS_CONSOLE_PUBLIC_URL/runtime" "Runtime Status" "Owner Registry Cockpit / Registry Runtime Summary" "Registry Governance / Readiness" "Registry Runtime Health" "Core API source:" "OIS_CONSOLE"
check_root_shell "PITS_SHELL_PUBLIC_ROOT" "$PITS_SHELL_PUBLIC_URL" "PITS_SHELL" "PITS Shell"
check_route "PITS_SHELL_PUBLIC_SHELL_STANDARD" "$PITS_SHELL_PUBLIC_URL" "Modern Shell Layout" "Shell Navigation Toggle" "Fixed Navigation Shell" "Responsive Product Shell"
check_route "PITS_SHELL_PUBLIC_OWNER_DESIGN_SYSTEM" "$PITS_SHELL_PUBLIC_URL" "Owner-first Design System" "Visual Hierarchy Standard" "Owner-friendly Status Badges"
check_route "PITS_SHELL_PUBLIC_ROOT_COCKPIT" "$PITS_SHELL_PUBLIC_URL" "PITS Registry Cockpit / Project Runtime Summary" "Project readiness" "Forbidden link guard" "PITS_SHELL"
check_route "PITS_SHELL_PUBLIC_PROJECTS" "$PITS_SHELL_PUBLIC_URL/projects" "Project Selector" "PITS Registry Cockpit / Project Runtime Summary" "Project readiness" "Runtime health:" "Registry Governance / Readiness" "Registry Runtime Health" "EMERALD_PRECINCT_DEMO" "DEMO DATA - NOT PRODUCTION"
check_route "PITS_SHELL_PUBLIC_RUNTIME" "$PITS_SHELL_PUBLIC_URL/runtime" "Runtime Status" "PITS Registry Cockpit / Project Runtime Summary" "Project readiness" "Registry Governance / Readiness" "Registry Runtime Health" "Core API source:" "PITS_SHELL"
check_absent_markers "OIS_CONSOLE_PUBLIC_DASHBOARD_LINK_BOUNDARY" "$OIS_CONSOLE_PUBLIC_URL/dashboard" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
check_absent_markers "PITS_SHELL_PUBLIC_PROJECTS_LINK_BOUNDARY" "$PITS_SHELL_PUBLIC_URL/projects" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"

if [ -n "$REGISTRY_PRODUCT_ID" ] && [ -n "$REGISTRY_WORKSPACE_ID" ] && [ -n "$REGISTRY_PROJECT_ID" ] && [ -n "$REGISTRY_MODULE_ID" ] && [ -n "$REGISTRY_INSTALLATION_ID" ]; then
  check_route "OIS_CONSOLE_PUBLIC_PRODUCT_DETAIL" "$OIS_CONSOLE_PUBLIC_URL/products/$REGISTRY_PRODUCT_ID" "Product Detail Source" "Owner-facing UAT summary" "Product Governance / Readiness" "What is missing?" "No issue detected" "Product Runtime Health" "PITS_RUNTIME_SHELL" "$PITS_SHELL_PUBLIC_URL/projects/$REGISTRY_PROJECT_ID"
  check_route "OIS_CONSOLE_PUBLIC_WORKSPACE_DETAIL" "$OIS_CONSOLE_PUBLIC_URL/workspaces/$REGISTRY_WORKSPACE_ID" "Workspace Detail Source" "Owner-facing UAT summary" "Workspace Governance / Readiness" "What is missing?" "No issue detected" "Workspace Runtime Health" "$PITS_SHELL_PUBLIC_URL/projects/$REGISTRY_PROJECT_ID"
  check_route "OIS_CONSOLE_PUBLIC_MODULE_DETAIL" "$OIS_CONSOLE_PUBLIC_URL/modules/$REGISTRY_MODULE_ID" "Module Detail Source" "Owner-facing UAT summary" "Module Governance / Readiness" "What is missing?" "No issue detected" "Module Runtime Health" "$REGISTRY_INSTALLATION_ID"
  check_route "OIS_CONSOLE_PUBLIC_INSTALLATION_DETAIL" "$OIS_CONSOLE_PUBLIC_URL/installations/$REGISTRY_INSTALLATION_ID" "Installation Detail Source" "Owner-facing UAT summary" "Installation Governance / Readiness" "What is missing?" "No issue detected" "Installation Runtime Health" "$OIS_CONSOLE_PUBLIC_URL/products/$REGISTRY_PRODUCT_ID"
  check_route "PITS_SHELL_PUBLIC_PROJECT_DETAIL" "$PITS_SHELL_PUBLIC_URL/projects/$REGISTRY_PROJECT_ID" "Project Detail Source" "Owner-facing project UAT summary" "Project readiness" "Project Governance / Readiness" "What is missing?" "No issue detected" "Project Runtime Health" "$OIS_CONSOLE_PUBLIC_URL/products/$REGISTRY_PRODUCT_ID" "$OIS_CONSOLE_PUBLIC_URL/workspaces/$REGISTRY_WORKSPACE_ID"
  check_absent_markers "OIS_CONSOLE_PUBLIC_PRODUCT_DETAIL_LINK_BOUNDARY" "$OIS_CONSOLE_PUBLIC_URL/products/$REGISTRY_PRODUCT_ID" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
  check_absent_markers "OIS_CONSOLE_PUBLIC_WORKSPACE_DETAIL_LINK_BOUNDARY" "$OIS_CONSOLE_PUBLIC_URL/workspaces/$REGISTRY_WORKSPACE_ID" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
  check_absent_markers "OIS_CONSOLE_PUBLIC_MODULE_DETAIL_LINK_BOUNDARY" "$OIS_CONSOLE_PUBLIC_URL/modules/$REGISTRY_MODULE_ID" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
  check_absent_markers "OIS_CONSOLE_PUBLIC_INSTALLATION_DETAIL_LINK_BOUNDARY" "$OIS_CONSOLE_PUBLIC_URL/installations/$REGISTRY_INSTALLATION_ID" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
  check_absent_markers "PITS_SHELL_PUBLIC_PROJECT_DETAIL_LINK_BOUNDARY" "$PITS_SHELL_PUBLIC_URL/projects/$REGISTRY_PROJECT_ID" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
else
  record_failure "registry ids were not available for public detail route checks"
fi

if [ "$failures" -gt 0 ]; then
  printf '\nPUBLIC_STAGING_ENDPOINT_CHECK_FAILED failures=%s\n' "$failures" >&2
  exit 1
fi

printf '\nPUBLIC_STAGING_ENDPOINT_CHECK_PASSED Cloudflare Tunnel OIS/PITS endpoints and Core API checks passed.\n'
