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
product_uat_endpoint_markers=(
  '"source":"default-db"'
  '"mode":"read-only"'
  '"uatMode":"read-only-product-user-journey-map"'
  '"Product User Journey UAT"'
  '"Testable now"'
  '"Control-plane only"'
  '"Functional gap map"'
  '"Next product journey"'
  '"NOT_ALLOWED_IN_STAGE_1K"'
)
product_uat_ui_markers=(
  "Product User Journey UAT"
  "Testable now"
  "Control-plane only"
  "Functional gap map"
  "Next product journey"
  "Owner UAT status"
  "Next user-level test path"
  "What can be tested now?"
  "What is not implemented yet?"
  "Recommended next product functions"
)
product_flow_ui_markers=(
  "Product Flow Preview"
  "UX Draft / Product Flow Preview"
  "Product page vs Admin console"
  "Owner approval checklist"
  "No write endpoints added"
  "Localization Foundation"
  "Language Settings"
  "English"
  "Tiếng Việt"
  "Primary user"
  "Main action"
  "Current stage status"
  "Screen mock"
)
pits_workboard_endpoint_markers=(
  '"source":"default-db"'
  '"mode":"read-only"'
  '"workboardMode":"read-only-functional-slice"'
  '"PITS Project Workboard"'
  '"Work items"'
  '"Open"'
  '"In progress"'
  '"Blocked"'
  '"Done"'
  '"NOT_ALLOWED_IN_STAGE_2A"'
)
pits_workboard_ui_markers=(
  "PITS Project Workboard"
  "Read-only functional slice"
  "Work items"
  "Open"
  "In progress"
  "Blocked"
  "Done"
  "Confirm site access package"
  "Resolve fire door access risk"
  "Requires Stage 2B/2C write boundary"
)
pits_work_item_detail_endpoint_markers=(
  '"source":"default-db"'
  '"mode":"read-only"'
  '"workItemDetailMode":"read-only-dry-run-preview"'
  '"Work Item Detail"'
  '"Dry-run Action Preview"'
  '"Preview only"'
  '"No data will be changed"'
  '"Requires audit trail"'
  '"Requires confirmation"'
  '"Requires rollback plan"'
  '"NOT_ALLOWED_IN_STAGE_2B"'
)
pits_dry_run_endpoint_markers=(
  '"source":"default-db"'
  '"mode":"read-only"'
  '"dryRunMode":"DRY_RUN_ONLY"'
  '"Dry-run Action Preview"'
  '"allowedInCurrentStage":false'
  '"noDataChanged":true'
  '"Requires audit trail"'
  '"Requires confirmation"'
  '"Requires rollback plan"'
)
pits_work_item_detail_ui_markers=(
  "Work Item Detail"
  "Dry-run Action Preview"
  "Preview only"
  "No data will be changed"
  "Requires audit trail"
  "Requires confirmation"
  "Requires rollback plan"
  "Change status preview"
  "Assign owner preview"
  "Add note preview"
  "Set priority preview"
  "Resolve blocker preview"
)

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
  check_route "PUBLIC_STAGING_OWNER_REVIEW" "$CORE_API_URL/platform/owner-review" '"source":"default-db"' '"mode":"read-only"' '"reviewMode":"read-only-owner-review"' '"Owner Review Queue"' '"Safe Action Boundary"' '"Read-only preview"' '"Future admin action requires audit"' '"NOT_ALLOWED_IN_STAGE_1I"'
  check_route "PUBLIC_STAGING_ADMIN_BOUNDARY" "$CORE_API_URL/platform/admin-boundary" '"source":"default-db"' '"mode":"read-only"' '"boundaryMode":"read-only-admin-permission-model"' '"Admin Boundary"' '"Audit Required"' '"Permission Model"' '"Preview only"' '"Blocked in current stage"' '"BLOCKED_IN_CURRENT_STAGE"'
  check_route "PUBLIC_STAGING_PRODUCT_UAT" "$CORE_API_URL/platform/product-uat" "${product_uat_endpoint_markers[@]}"

  if public_staging_discover_registry_ids "$CORE_API_URL"; then
    printf 'PUBLIC_STAGING_REGISTRY_IDS_READY %s\n' "$PUBLIC_STAGING_DETAIL"
    check_route "PUBLIC_STAGING_PRODUCT_DETAIL" "$CORE_API_URL/platform/products/$REGISTRY_PRODUCT_ID" '"source":"default-db"' '"mode":"read-only"' '"product"' '"relationships"'
    check_route "PUBLIC_STAGING_PRODUCT_CODE_DETAIL" "$CORE_API_URL/platform/products/code/$REGISTRY_PRODUCT_CODE" '"source":"default-db"' '"mode":"read-only"' '"product"' '"relationships"'
    check_route "PUBLIC_STAGING_WORKSPACE_DETAIL" "$CORE_API_URL/platform/workspaces/$REGISTRY_WORKSPACE_ID" '"source":"default-db"' '"mode":"read-only"' '"workspace"' '"relationships"'
    check_route "PUBLIC_STAGING_PROJECT_DETAIL" "$CORE_API_URL/platform/projects/$REGISTRY_PROJECT_ID" '"source":"default-db"' '"mode":"read-only"' '"project"' '"relationships"'
    check_route "PUBLIC_STAGING_PITS_PROJECT_WORKBOARD" "$CORE_API_URL/platform/pits/projects/$REGISTRY_PROJECT_ID/workboard" "${pits_workboard_endpoint_markers[@]}"
    local registry_project_base_id="${REGISTRY_PROJECT_ID#prj_}"
    local registry_work_item_id="pits-${registry_project_base_id}-open-site-access"
    check_route "PUBLIC_STAGING_PITS_WORK_ITEM_DETAIL" "$CORE_API_URL/platform/pits/projects/$REGISTRY_PROJECT_ID/work-items/$registry_work_item_id" "${pits_work_item_detail_endpoint_markers[@]}"
    check_route "PUBLIC_STAGING_PITS_DRY_RUN_ACTION_PREVIEW" "$CORE_API_URL/platform/pits/projects/$REGISTRY_PROJECT_ID/work-items/$registry_work_item_id/action-preview" "${pits_dry_run_endpoint_markers[@]}"
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
check_absent_markers "PUBLIC_STAGING_OWNER_REVIEW_LINK_BOUNDARY" "$CORE_API_URL/platform/owner-review" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
check_absent_markers "PUBLIC_STAGING_ADMIN_BOUNDARY_LINK_BOUNDARY" "$CORE_API_URL/platform/admin-boundary" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
check_absent_markers "PUBLIC_STAGING_PRODUCT_UAT_LINK_BOUNDARY" "$CORE_API_URL/platform/product-uat" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
check_root_shell "OIS_CONSOLE_PUBLIC_ROOT" "$OIS_CONSOLE_PUBLIC_URL" "OIS_CONSOLE" "OIS Console"
check_route "OIS_CONSOLE_PUBLIC_SHELL_STANDARD" "$OIS_CONSOLE_PUBLIC_URL" "Modern Shell Layout" "Shell Navigation Toggle" "Fixed Navigation Shell" "Responsive Product Shell"
check_route "OIS_CONSOLE_PUBLIC_OWNER_DESIGN_SYSTEM" "$OIS_CONSOLE_PUBLIC_URL" "Owner-first Design System" "Visual Hierarchy Standard" "Owner-friendly Status Badges"
check_route "OIS_CONSOLE_PUBLIC_ROOT_COCKPIT" "$OIS_CONSOLE_PUBLIC_URL" "Owner Registry Cockpit / Registry Runtime Summary" "Ready to operate" "Forbidden link guard" "OIS_CONSOLE"
check_route "OIS_CONSOLE_PUBLIC_PRODUCT_UAT_ROOT" "$OIS_CONSOLE_PUBLIC_URL" "Product User Journey UAT Baseline" "${product_uat_ui_markers[@]}"
check_route "OIS_CONSOLE_PUBLIC_PRODUCT_FLOW" "$OIS_CONSOLE_PUBLIC_URL/product-flow" "${product_flow_ui_markers[@]}" "OIS Product UX Preview" "OIS Product UX Blueprint" "Executive Dashboard" "Workspace Intelligence Dashboard" "Meeting/Document Knowledge Feed" "Knowledge Detail" "Ask OIS / Copilot" "Runtime/Admin" "No LLM call"
check_route "OIS_CONSOLE_PUBLIC_LOCALIZATION" "$OIS_CONSOLE_PUBLIC_URL/localization" "Localization Catalog" "Read-only Localization Catalog" "Available locales" "Translation namespaces" "Missing keys" "Fallback keys" "packages/shared-ui/src/localization.ts" "Browser editing is not enabled yet" "OIS_CONSOLE"
check_route "OIS_CONSOLE_PUBLIC_DASHBOARD" "$OIS_CONSOLE_PUBLIC_URL/dashboard" "Platform Overview" "Owner Registry Cockpit / Registry Runtime Summary" "Owner Review Queue" "Safe Action Boundary" "Read-only preview" "Future admin action requires audit" "Action is read-only preview only" "Admin Boundary" "Audit Required" "Permission Model" "Preview only" "Blocked in current stage" "Future admin action" "Preview only - not executable yet" "Suggested next actions" "Registry Governance / Readiness" "Registry Runtime Health" "Missing runtime URL" "Forbidden link guard" "DEMO DATA - NOT PRODUCTION"
check_route "OIS_CONSOLE_PUBLIC_PRODUCT_UAT_DASHBOARD" "$OIS_CONSOLE_PUBLIC_URL/dashboard" "Product User Journey / UAT Baseline" "${product_uat_ui_markers[@]}"
check_route "OIS_CONSOLE_PUBLIC_PRODUCTS" "$OIS_CONSOLE_PUBLIC_URL/products" "Products &amp; Modules" "Product &amp; Module Overview" "Owner Registry Cockpit / Registry Runtime Summary" "Registry Governance / Readiness" "Registry Runtime Health" "Runtime health:" "Readiness:" "Linked to PITS" "PITS_RUNTIME_SHELL" "OIS_CONSOLE"
check_route "OIS_CONSOLE_PUBLIC_WORKSPACES" "$OIS_CONSOLE_PUBLIC_URL/workspaces" "Organizations, Workspaces &amp; Projects" "Workspace Overview" "Owner Registry Cockpit / Registry Runtime Summary" "Registry Governance / Readiness" "Registry Runtime Health" "Runtime health:" "Readiness:" "PMC Org Demo" "OIS_CONSOLE"
check_route "OIS_CONSOLE_PUBLIC_RUNTIME" "$OIS_CONSOLE_PUBLIC_URL/runtime" "Runtime Status" "Owner Registry Cockpit / Registry Runtime Summary" "Safe Action Boundary" "Read-only preview" "Future admin action requires audit" "Audit / Permission / Admin Boundary" "Audit Required" "Permission Model" "Preview only" "Blocked in current stage" "Registry Governance / Readiness" "Registry Runtime Health" "Core API source:" "OIS_CONSOLE"
check_route "OIS_CONSOLE_PUBLIC_PRODUCT_UAT_RUNTIME" "$OIS_CONSOLE_PUBLIC_URL/runtime" "Product Capability / UAT Status" "${product_uat_ui_markers[@]}"
check_root_shell "PITS_SHELL_PUBLIC_ROOT" "$PITS_SHELL_PUBLIC_URL" "PITS_SHELL" "PITS Shell"
check_route "PITS_SHELL_PUBLIC_SHELL_STANDARD" "$PITS_SHELL_PUBLIC_URL" "Modern Shell Layout" "Shell Navigation Toggle" "Fixed Navigation Shell" "Responsive Product Shell"
check_route "PITS_SHELL_PUBLIC_OWNER_DESIGN_SYSTEM" "$PITS_SHELL_PUBLIC_URL" "Owner-first Design System" "Visual Hierarchy Standard" "Owner-friendly Status Badges"
check_route "PITS_SHELL_PUBLIC_ROOT_COCKPIT" "$PITS_SHELL_PUBLIC_URL" "PITS Registry Cockpit / Project Runtime Summary" "Project readiness" "Forbidden link guard" "PITS_SHELL"
check_route "PITS_SHELL_PUBLIC_PRODUCT_UAT_ROOT" "$PITS_SHELL_PUBLIC_URL" "Product User Journey UAT Baseline" "${product_uat_ui_markers[@]}" "project registry/readiness shell" "true project workflow app"
check_route "PITS_SHELL_PUBLIC_PRODUCT_FLOW" "$PITS_SHELL_PUBLIC_URL/product-flow" "${product_flow_ui_markers[@]}" "PITS Product UX Preview" "PITS Product UX Blueprint" "PITS Home" "Projects List" "Project Detail" "Project Workboard" "Work Item Detail" "Dry-run Action Preview" "Runtime/Admin" "No data will be changed"
check_route "PITS_SHELL_PUBLIC_LOCALIZATION" "$PITS_SHELL_PUBLIC_URL/localization" "Localization Catalog" "Read-only Localization Catalog" "Available locales" "Translation namespaces" "Missing keys" "Fallback keys" "packages/shared-ui/src/localization.ts" "Browser editing is not enabled yet" "PITS_SHELL"
check_route "PITS_SHELL_PUBLIC_PROJECTS" "$PITS_SHELL_PUBLIC_URL/projects" "Project Selector" "PITS Registry Cockpit / Project Runtime Summary" "Owner Review Queue" "Safe Action Boundary" "Read-only preview" "Future admin action requires audit" "Action is read-only preview only" "Admin Boundary" "Audit Required" "Permission Model" "Preview only" "Blocked in current stage" "Future admin action" "Preview only - not executable yet" "Suggested next actions" "Project readiness" "Runtime health:" "Registry Governance / Readiness" "Registry Runtime Health" "PITS is no longer only a registry/readiness shell" "Open PITS Project Workboard" "Open Work Item Detail" "EMERALD_PRECINCT_DEMO" "DEMO DATA - NOT PRODUCTION"
check_route "PITS_SHELL_PUBLIC_PRODUCT_UAT_PROJECTS" "$PITS_SHELL_PUBLIC_URL/projects" "Product User Journey / UAT Baseline" "${product_uat_ui_markers[@]}" "project registry shell" "true workflow app"
check_route "PITS_SHELL_PUBLIC_RUNTIME" "$PITS_SHELL_PUBLIC_URL/runtime" "Runtime Status" "PITS Registry Cockpit / Project Runtime Summary" "Safe Action Boundary" "Read-only preview" "Future admin action requires audit" "Audit / Permission / Admin Boundary" "Audit Required" "Permission Model" "Preview only" "Blocked in current stage" "Project readiness" "Registry Governance / Readiness" "Registry Runtime Health" "Core API source:" "PITS_SHELL" "PITS Project Workboard" "Read-only functional slice" "Work Item Detail" "Dry-run Action Preview" "No data will be changed" "Requires Stage 2B/2C write boundary"
check_route "PITS_SHELL_PUBLIC_PRODUCT_UAT_RUNTIME" "$PITS_SHELL_PUBLIC_URL/runtime" "Product Capability / UAT Status" "${product_uat_ui_markers[@]}"
check_absent_markers "OIS_CONSOLE_PUBLIC_DASHBOARD_LINK_BOUNDARY" "$OIS_CONSOLE_PUBLIC_URL/dashboard" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
check_absent_markers "OIS_CONSOLE_PUBLIC_PRODUCT_FLOW_LINK_BOUNDARY" "$OIS_CONSOLE_PUBLIC_URL/product-flow" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
check_absent_markers "OIS_CONSOLE_PUBLIC_LOCALIZATION_LINK_BOUNDARY" "$OIS_CONSOLE_PUBLIC_URL/localization" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
check_absent_markers "PITS_SHELL_PUBLIC_PROJECTS_LINK_BOUNDARY" "$PITS_SHELL_PUBLIC_URL/projects" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
check_absent_markers "PITS_SHELL_PUBLIC_PRODUCT_FLOW_LINK_BOUNDARY" "$PITS_SHELL_PUBLIC_URL/product-flow" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
check_absent_markers "PITS_SHELL_PUBLIC_LOCALIZATION_LINK_BOUNDARY" "$PITS_SHELL_PUBLIC_URL/localization" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"

if [ -n "$REGISTRY_PRODUCT_ID" ] && [ -n "$REGISTRY_WORKSPACE_ID" ] && [ -n "$REGISTRY_PROJECT_ID" ] && [ -n "$REGISTRY_MODULE_ID" ] && [ -n "$REGISTRY_INSTALLATION_ID" ]; then
  registry_project_base_id="${REGISTRY_PROJECT_ID#prj_}"
  registry_work_item_id="pits-${registry_project_base_id}-open-site-access"
  check_route "OIS_CONSOLE_PUBLIC_PRODUCT_DETAIL" "$OIS_CONSOLE_PUBLIC_URL/products/$REGISTRY_PRODUCT_ID" "Product Detail Source" "Owner-facing UAT summary" "Owner Review Queue" "Safe Action Boundary" "Action is read-only preview only" "Admin Boundary" "Audit Required" "Permission Model" "Preview only - not executable yet" "Blocked in current stage" "Product Governance / Readiness" "What is missing?" "No issue detected" "Product Runtime Health" "PITS_RUNTIME_SHELL" "$PITS_SHELL_PUBLIC_URL/projects/$REGISTRY_PROJECT_ID"
  check_route "OIS_CONSOLE_PUBLIC_PRODUCT_UAT_PRODUCT_DETAIL" "$OIS_CONSOLE_PUBLIC_URL/products/$REGISTRY_PRODUCT_ID" "${product_uat_ui_markers[@]}"
  check_route "OIS_CONSOLE_PUBLIC_WORKSPACE_DETAIL" "$OIS_CONSOLE_PUBLIC_URL/workspaces/$REGISTRY_WORKSPACE_ID" "Workspace Detail Source" "Owner-facing UAT summary" "Owner Review Queue" "Safe Action Boundary" "Action is read-only preview only" "Admin Boundary" "Audit Required" "Permission Model" "Preview only - not executable yet" "Blocked in current stage" "Workspace Governance / Readiness" "What is missing?" "No issue detected" "Workspace Runtime Health" "$PITS_SHELL_PUBLIC_URL/projects/$REGISTRY_PROJECT_ID"
  check_route "OIS_CONSOLE_PUBLIC_PRODUCT_UAT_WORKSPACE_DETAIL" "$OIS_CONSOLE_PUBLIC_URL/workspaces/$REGISTRY_WORKSPACE_ID" "${product_uat_ui_markers[@]}" "end-user workspace"
  check_route "OIS_CONSOLE_PUBLIC_MODULE_DETAIL" "$OIS_CONSOLE_PUBLIC_URL/modules/$REGISTRY_MODULE_ID" "Module Detail Source" "Owner-facing UAT summary" "Module Governance / Readiness" "What is missing?" "No issue detected" "Module Runtime Health" "$REGISTRY_INSTALLATION_ID"
  check_route "OIS_CONSOLE_PUBLIC_INSTALLATION_DETAIL" "$OIS_CONSOLE_PUBLIC_URL/installations/$REGISTRY_INSTALLATION_ID" "Installation Detail Source" "Owner-facing UAT summary" "Owner Review Queue" "Safe Action Boundary" "Action is read-only preview only" "Admin Boundary" "Audit Required" "Permission Model" "Preview only - not executable yet" "Blocked in current stage" "Installation Governance / Readiness" "What is missing?" "No issue detected" "Installation Runtime Health" "$OIS_CONSOLE_PUBLIC_URL/products/$REGISTRY_PRODUCT_ID"
  check_route "OIS_CONSOLE_PUBLIC_PRODUCT_UAT_INSTALLATION_DETAIL" "$OIS_CONSOLE_PUBLIC_URL/installations/$REGISTRY_INSTALLATION_ID" "${product_uat_ui_markers[@]}" "Future project status update" "No status write can be tested"
  check_route "PITS_SHELL_PUBLIC_PROJECT_DETAIL" "$PITS_SHELL_PUBLIC_URL/projects/$REGISTRY_PROJECT_ID" "Project Detail Source" "Owner-facing project UAT summary" "Owner Review Queue" "Safe Action Boundary" "Action is read-only preview only" "Admin Boundary" "Audit Required" "Permission Model" "Preview only - not executable yet" "Blocked in current stage" "Project readiness" "Project Governance / Readiness" "What is missing?" "No issue detected" "Project Runtime Health" "${pits_workboard_ui_markers[@]}" "$OIS_CONSOLE_PUBLIC_URL/products/$REGISTRY_PRODUCT_ID" "$OIS_CONSOLE_PUBLIC_URL/workspaces/$REGISTRY_WORKSPACE_ID"
  check_route "PITS_SHELL_PUBLIC_PRODUCT_UAT_PROJECT_DETAIL" "$PITS_SHELL_PUBLIC_URL/projects/$REGISTRY_PROJECT_ID" "Project Product UAT Baseline" "${product_uat_ui_markers[@]}" "project detail/readiness shell" "Future issue and task workflow"
  check_route "PITS_SHELL_PUBLIC_PROJECT_WORKBOARD" "$PITS_SHELL_PUBLIC_URL/projects/$REGISTRY_PROJECT_ID/workboard" "${pits_workboard_ui_markers[@]}" "Project operator" "Safety lead" "Next action" "Preview only" "Not executable yet" "Open Work Item Detail"
  check_route "PITS_SHELL_PUBLIC_WORK_ITEM_DETAIL" "$PITS_SHELL_PUBLIC_URL/projects/$REGISTRY_PROJECT_ID/work-items/$registry_work_item_id" "${pits_work_item_detail_ui_markers[@]}" "Confirm site access package" "Project operator" "Next action" "Available dry-run actions"
  check_absent_markers "OIS_CONSOLE_PUBLIC_PRODUCT_DETAIL_LINK_BOUNDARY" "$OIS_CONSOLE_PUBLIC_URL/products/$REGISTRY_PRODUCT_ID" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
  check_absent_markers "OIS_CONSOLE_PUBLIC_WORKSPACE_DETAIL_LINK_BOUNDARY" "$OIS_CONSOLE_PUBLIC_URL/workspaces/$REGISTRY_WORKSPACE_ID" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
  check_absent_markers "OIS_CONSOLE_PUBLIC_MODULE_DETAIL_LINK_BOUNDARY" "$OIS_CONSOLE_PUBLIC_URL/modules/$REGISTRY_MODULE_ID" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
  check_absent_markers "OIS_CONSOLE_PUBLIC_INSTALLATION_DETAIL_LINK_BOUNDARY" "$OIS_CONSOLE_PUBLIC_URL/installations/$REGISTRY_INSTALLATION_ID" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
  check_absent_markers "PITS_SHELL_PUBLIC_PROJECT_DETAIL_LINK_BOUNDARY" "$PITS_SHELL_PUBLIC_URL/projects/$REGISTRY_PROJECT_ID" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
  check_absent_markers "PITS_SHELL_PUBLIC_PROJECT_WORKBOARD_LINK_BOUNDARY" "$PITS_SHELL_PUBLIC_URL/projects/$REGISTRY_PROJECT_ID/workboard" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
  check_absent_markers "PITS_SHELL_PUBLIC_WORK_ITEM_DETAIL_LINK_BOUNDARY" "$PITS_SHELL_PUBLIC_URL/projects/$REGISTRY_PROJECT_ID/work-items/$registry_work_item_id" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
else
  record_failure "registry ids were not available for public detail route checks"
fi

if [ "$failures" -gt 0 ]; then
  printf '\nPUBLIC_STAGING_ENDPOINT_CHECK_FAILED failures=%s\n' "$failures" >&2
  exit 1
fi

printf '\nPUBLIC_STAGING_ENDPOINT_CHECK_PASSED Cloudflare Tunnel OIS/PITS endpoints and Core API checks passed.\n'
