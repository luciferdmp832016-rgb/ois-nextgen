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
learning_center_endpoint_markers=(
  '"source":"default-db"'
  '"mode":"read-only"'
  '"products"'
  '"overview"'
  '"learningStream"'
  '"pendingReview"'
  '"learningPolicies"'
  '"executiveIntentQueue"'
  '"accessGuard"'
)
learning_center_ui_markers=(
  "OIS Learning Center"
  "SuperAdmin Access Guard"
  "Learning Overview"
  "Learning Stream"
  "Learning Policies"
  "Executive Intent Queue"
  "Knowledge Fabric Integration"
  "Target Knowledge Layer"
  "No auto-promotion"
)
knowledge_endpoint_markers=(
  '"source":"default-db"'
  '"mode":"read-only"'
  '"Stage 2G"'
  '"autoPromotionEnabled":false'
  '"KL_0_LEGAL_REGULATORY_CORE"'
  '"KL_3_PRODUCT_KNOWLEDGE_PACK"'
)
knowledge_taxonomy_markers=(
  "${knowledge_endpoint_markers[@]}"
  '"knowledgeLayerTaxonomy"'
  '"availableLayers"'
  '"taxonomyVersion":"stage-2g.v1"'
)
knowledge_mapping_status_markers=(
  "${knowledge_taxonomy_markers[@]}"
  '"mappingStatusTaxonomy"'
  '"availableStatuses"'
  '"DRAFT_MAPPING"'
  '"READY_FOR_REVIEW"'
  '"APPROVED_FOR_FUTURE_PROMOTION"'
  '"REJECTED"'
  '"BLOCKED"'
)
knowledge_ui_markers=(
  "OIS Knowledge Fabric"
  "Universal Knowledge Read Contract"
  "Knowledge Layers Overview"
  "Canonical Knowledge Items"
  "Evidence Links"
  "Learning Candidate to Knowledge Layer Mappings"
  "KEIHB Bundles"
  "Product Consumption Map"
  "Architecture Map / Mindmap"
  "No auto-promotion in Stage 2G"
)
oima_endpoint_markers=(
  '"productKey":"OIMA"'
  '"displayName":"OIMA'
  '"productType":"MEETING_INTELLIGENCE_PRODUCT"'
  '"implementationStatus":"PRODUCT_BOUNDARY_READY"'
  '"TRANSCRIPT_ONLY"'
  '"AUDIO_ONLY"'
  '"TRANSCRIPT_AND_AUDIO"'
  '"LISTENER_CAPTURED"'
  '"NO_LIVE_SPEAKING_AGENT"'
  '"NO_VOICE_CLONE"'
  '"NO_IMPERSONATION"'
  '"NO_AUTONOMOUS_DECISION"'
  '"TRANSCRIPT_FIRST_AUDIO_OPTIONAL"'
)
oima_ui_markers=(
  "OIMA"
  "Organizational Intelligence Meeting Agent"
  "Powered by OIS Product"
  "Product Boundary"
  "Source Mode Contract"
  "Safety Boundary"
  "OIS Core Reuse Map"
  "OIMA Roadmap"
  "Placeholder Product Surfaces"
  "TRANSCRIPT_ONLY"
  "MEETING_INTELLIGENCE_PRODUCT"
  "PRODUCT_BOUNDARY_READY"
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
pits_action_request_endpoint_markers=(
  '"source":"default-db"'
  '"mode":"read-only"'
  '"actionRequestMode":"read-only-action-request-boundary"'
  '"PITS Action Request"'
  '"Action request only"'
  '"No direct mutation"'
  '"Pending review"'
  '"Requires audit trail"'
  '"Requires confirmation"'
  '"Requires rollback plan"'
  '"noDirectMutation":true'
  '"NOT_ALLOWED_IN_STAGE_2E"'
)
pits_action_request_preview_endpoint_markers=(
  '"source":"default-db"'
  '"mode":"read-only"'
  '"actionRequestPreviewMode":"read-only-action-request-preview"'
  '"PITS Action Request"'
  '"Action request only"'
  '"No direct mutation"'
  '"Pending review"'
  '"Requires audit trail"'
  '"Requires confirmation"'
  '"Requires rollback plan"'
  '"sourceItemUnchanged"'
  '"noDirectMutation":true'
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
  "PITS Action Request"
  "Action request only"
  "No direct mutation"
  "Pending review"
  "Requires audit trail"
  "Requires confirmation"
  "Requires rollback plan"
)

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

  printf 'LINK_BOUNDARY_READY %s forbidden_markers=absent\n' "$label"
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

  printf 'ROUTE_404_READY %s HTTP 404 markers=verified\n' "$label"
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
check_route "LOCAL_REGISTRY_HEALTH" "$CORE_API_LOCAL_BASE/platform/registry/health" '"source":"default-db"' '"mode":"read-only"' '"summary"' '"entities"' '"Reachable"'
check_route "LOCAL_REGISTRY_READINESS" "$CORE_API_LOCAL_BASE/platform/registry/readiness" '"source":"default-db"' '"mode":"read-only"' '"summary"' '"entities"' '"READY"'
check_route "LOCAL_OWNER_REVIEW" "$CORE_API_LOCAL_BASE/platform/owner-review" '"source":"default-db"' '"mode":"read-only"' '"reviewMode":"read-only-owner-review"' '"Owner Review Queue"' '"Safe Action Boundary"' '"Read-only preview"' '"Future admin action requires audit"' '"NOT_ALLOWED_IN_STAGE_1I"'
check_route "LOCAL_ADMIN_BOUNDARY" "$CORE_API_LOCAL_BASE/platform/admin-boundary" '"source":"default-db"' '"mode":"read-only"' '"boundaryMode":"read-only-admin-permission-model"' '"Admin Boundary"' '"Audit Required"' '"Permission Model"' '"Preview only"' '"Blocked in current stage"' '"BLOCKED_IN_CURRENT_STAGE"'
check_route "LOCAL_PRODUCT_UAT" "$CORE_API_LOCAL_BASE/platform/product-uat" "${product_uat_endpoint_markers[@]}"
check_route "LOCAL_ECOSYSTEM_PRODUCTS" "$CORE_API_LOCAL_BASE/platform/ecosystem-products" '"source":"default-db"' '"mode":"read-only"' '"OIMA"' '"MEETING_INTELLIGENCE_PRODUCT"'
check_route "LOCAL_LEARNING_CENTER" "$CORE_API_LOCAL_BASE/platform/learning/center" "${learning_center_endpoint_markers[@]}"
check_route "LOCAL_OIMA_PRODUCT_CODE" "$CORE_API_LOCAL_BASE/platform/products/code/OIMA" "${oima_endpoint_markers[@]}" '"relationships"' '"OIS Canonical Knowledge Fabric"'
check_route "LOCAL_OIMA_OVERVIEW" "$CORE_API_LOCAL_BASE/platform/oima/overview" "${oima_endpoint_markers[@]}" '"OIS Canonical Knowledge Fabric"' '"Universal Knowledge API"'
check_route "LOCAL_OIMA_SOURCE_MODES" "$CORE_API_LOCAL_BASE/platform/oima/source-modes" "${oima_endpoint_markers[@]}" '"primarySourceMode":"TRANSCRIPT_ONLY"' '"audioDoesNotBlockAnalysis":true'
check_route "LOCAL_OIMA_ROADMAP" "$CORE_API_LOCAL_BASE/platform/oima/roadmap" "${oima_endpoint_markers[@]}" '"roadmap"' '"Stage 2H"' '"OIMA-0"' '"OIMA-9"'
check_route "LOCAL_OIMA_BOUNDARY" "$CORE_API_LOCAL_BASE/platform/oima/boundary" "${oima_endpoint_markers[@]}" '"noCanonicalKnowledgeWrite":true' '"autoPromotionEnabled":false'
check_route "LOCAL_KNOWLEDGE_LAYERS" "$CORE_API_LOCAL_BASE/platform/knowledge/layers" "${knowledge_endpoint_markers[@]}" '"layers"' '"productConsumptionMap"'
check_route "LOCAL_KNOWLEDGE_ITEMS" "$CORE_API_LOCAL_BASE/platform/knowledge/items" "${knowledge_endpoint_markers[@]}" '"items"' '"summary"'
check_route "LOCAL_KNOWLEDGE_EVIDENCE" "$CORE_API_LOCAL_BASE/platform/knowledge/evidence" '"source":"default-db"' '"mode":"read-only"' '"evidenceLinks"' '"totalLinks"'
check_route "LOCAL_KNOWLEDGE_CONTEXT" "$CORE_API_LOCAL_BASE/platform/knowledge/context" "${knowledge_taxonomy_markers[@]}" '"deterministic-knowledge-context"' '"noCanonicalWrite":true'
check_route "LOCAL_KNOWLEDGE_LAYER_MAPPINGS" "$CORE_API_LOCAL_BASE/platform/learning/layer-mappings" "${knowledge_mapping_status_markers[@]}" '"mappings"'
check_route "LOCAL_KEIHB_BUNDLES" "$CORE_API_LOCAL_BASE/platform/knowledge/keihb/bundles" "${knowledge_taxonomy_markers[@]}" '"KEIHB"' '"projectionBoundary"'
check_route "LOCAL_ARCHITECTURE_MINDMAP" "$CORE_API_LOCAL_BASE/platform/architecture/mindmap" "${knowledge_endpoint_markers[@]}" '"OIS Ecosystem Architecture Map"' '"apiContracts"'
check_absent_markers "LOCAL_REGISTRY_READINESS_LINK_BOUNDARY" "$CORE_API_LOCAL_BASE/platform/registry/readiness" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
check_absent_markers "LOCAL_OWNER_REVIEW_LINK_BOUNDARY" "$CORE_API_LOCAL_BASE/platform/owner-review" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
check_absent_markers "LOCAL_ADMIN_BOUNDARY_LINK_BOUNDARY" "$CORE_API_LOCAL_BASE/platform/admin-boundary" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
check_absent_markers "LOCAL_PRODUCT_UAT_LINK_BOUNDARY" "$CORE_API_LOCAL_BASE/platform/product-uat" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
check_root_shell "OIS_CONSOLE_LOCAL" "$OIS_CONSOLE_LOCAL_URL" "OIS_CONSOLE" "OIS Console"
check_route "OIS_CONSOLE_LOCAL_SHELL_STANDARD" "$OIS_CONSOLE_LOCAL_URL" "Modern Shell Layout" "Shell Navigation Toggle" "Fixed Navigation Shell" "Responsive Product Shell"
check_route "OIS_CONSOLE_LOCAL_OWNER_DESIGN_SYSTEM" "$OIS_CONSOLE_LOCAL_URL" "Owner-first Design System" "Visual Hierarchy Standard" "Owner-friendly Status Badges"
check_route "OIS_CONSOLE_LOCAL_ROOT_COCKPIT" "$OIS_CONSOLE_LOCAL_URL" "Owner Registry Cockpit / Registry Runtime Summary" "Ready to operate" "Forbidden link guard" "OIS_CONSOLE"
check_route "OIS_CONSOLE_LOCAL_PRODUCT_UAT_ROOT" "$OIS_CONSOLE_LOCAL_URL" "Product User Journey UAT Baseline" "${product_uat_ui_markers[@]}"
check_route "OIS_CONSOLE_LOCAL_PRODUCT_FLOW" "$OIS_CONSOLE_LOCAL_URL/product-flow" "${product_flow_ui_markers[@]}" "OIS Product UX Preview" "OIS Product UX Blueprint" "Executive Dashboard" "Workspace Intelligence Dashboard" "Meeting/Document Knowledge Feed" "Knowledge Detail" "Ask OIS / Copilot" "Runtime/Admin" "No LLM call"
check_absent_markers "OIS_CONSOLE_LOCAL_PRODUCT_FLOW_LINK_BOUNDARY" "$OIS_CONSOLE_LOCAL_URL/product-flow" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
check_route "OIS_CONSOLE_LOCAL_LOCALIZATION" "$OIS_CONSOLE_LOCAL_URL/localization" "Localization Catalog" "Read-only Localization Catalog" "Available locales" "Translation namespaces" "Missing keys" "Fallback keys" "packages/shared-ui/src/localization.ts" "Browser editing is not enabled yet" "OIS_CONSOLE"
check_absent_markers "OIS_CONSOLE_LOCAL_LOCALIZATION_LINK_BOUNDARY" "$OIS_CONSOLE_LOCAL_URL/localization" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
check_absent_markers "OIS_CONSOLE_LOCAL_LEARNING_CENTER_LINK_BOUNDARY" "$OIS_CONSOLE_LOCAL_URL/learning-center" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
check_absent_markers "OIS_CONSOLE_LOCAL_KNOWLEDGE_FABRIC_LINK_BOUNDARY" "$OIS_CONSOLE_LOCAL_URL/knowledge-fabric" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
check_absent_markers "OIS_CONSOLE_LOCAL_OIMA_LINK_BOUNDARY" "$OIS_CONSOLE_LOCAL_URL/oima" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
check_route "OIS_CONSOLE_LOCAL_DASHBOARD" "$OIS_CONSOLE_LOCAL_URL/dashboard" "Platform Overview" "Owner Registry Cockpit / Registry Runtime Summary" "Owner Review Queue" "Safe Action Boundary" "Read-only preview" "Future admin action requires audit" "Action is read-only preview only" "Admin Boundary" "Audit Required" "Permission Model" "Preview only" "Blocked in current stage" "Future admin action" "Preview only - not executable yet" "Suggested next actions" "Registry Governance / Readiness" "Registry Runtime Health" "Missing runtime URL" "Forbidden link guard" "DEMO DATA - NOT PRODUCTION"
check_route "OIS_CONSOLE_LOCAL_PRODUCT_UAT_DASHBOARD" "$OIS_CONSOLE_LOCAL_URL/dashboard" "Product User Journey / UAT Baseline" "${product_uat_ui_markers[@]}"
check_route "OIS_CONSOLE_LOCAL_PRODUCTS" "$OIS_CONSOLE_LOCAL_URL/products" "Products &amp; Modules" "Product &amp; Module Overview" "Owner Registry Cockpit / Registry Runtime Summary" "Registry Governance / Readiness" "Registry Runtime Health" "Runtime health:" "Readiness:" "Linked to PITS" "PITS_RUNTIME_SHELL" "OIS_CONSOLE"
check_route "OIS_CONSOLE_LOCAL_WORKSPACES" "$OIS_CONSOLE_LOCAL_URL/workspaces" "Organizations, Workspaces &amp; Projects" "Workspace Overview" "Owner Registry Cockpit / Registry Runtime Summary" "Registry Governance / Readiness" "Registry Runtime Health" "Runtime health:" "Readiness:" "PMC Org Demo" "OIS_CONSOLE"
check_route "OIS_CONSOLE_LOCAL_LEARNING_CENTER" "$OIS_CONSOLE_LOCAL_URL/learning-center" "${learning_center_ui_markers[@]}" "OIS_CONSOLE"
check_route "OIS_CONSOLE_LOCAL_KNOWLEDGE_FABRIC" "$OIS_CONSOLE_LOCAL_URL/knowledge-fabric" "${knowledge_ui_markers[@]}" "OIS_CONSOLE"
check_route "OIS_CONSOLE_LOCAL_OIMA" "$OIS_CONSOLE_LOCAL_URL/oima" "${oima_ui_markers[@]}" "OIS_CONSOLE" "OIMA-0" "OIMA-9"
check_route "OIS_CONSOLE_LOCAL_RUNTIME" "$OIS_CONSOLE_LOCAL_URL/runtime" "Runtime Status" "Owner Registry Cockpit / Registry Runtime Summary" "Safe Action Boundary" "Read-only preview" "Future admin action requires audit" "Audit / Permission / Admin Boundary" "Audit Required" "Permission Model" "Preview only" "Blocked in current stage" "Registry Governance / Readiness" "Registry Runtime Health" "Core API source:" "OIS_CONSOLE"
check_route "OIS_CONSOLE_LOCAL_PRODUCT_UAT_RUNTIME" "$OIS_CONSOLE_LOCAL_URL/runtime" "Product Capability / UAT Status" "${product_uat_ui_markers[@]}"
check_root_shell "PITS_SHELL_LOCAL" "$PITS_SHELL_LOCAL_URL" "PITS_SHELL" "PITS Shell"
check_route "PITS_SHELL_LOCAL_SHELL_STANDARD" "$PITS_SHELL_LOCAL_URL" "Modern Shell Layout" "Shell Navigation Toggle" "Fixed Navigation Shell" "Responsive Product Shell"
check_route "PITS_SHELL_LOCAL_OWNER_DESIGN_SYSTEM" "$PITS_SHELL_LOCAL_URL" "Owner-first Design System" "Visual Hierarchy Standard" "Owner-friendly Status Badges"
check_route "PITS_SHELL_LOCAL_ROOT_COCKPIT" "$PITS_SHELL_LOCAL_URL" "PITS Registry Cockpit / Project Runtime Summary" "Project readiness" "Forbidden link guard" "PITS_SHELL"
check_route "PITS_SHELL_LOCAL_PRODUCT_UAT_ROOT" "$PITS_SHELL_LOCAL_URL" "Product User Journey UAT Baseline" "${product_uat_ui_markers[@]}" "project registry/readiness shell" "true project workflow app"
check_route "PITS_SHELL_LOCAL_PRODUCT_FLOW" "$PITS_SHELL_LOCAL_URL/product-flow" "${product_flow_ui_markers[@]}" "PITS Product UX Preview" "PITS Product UX Blueprint" "PITS Home" "Projects List" "Project Detail" "Project Workboard" "Work Item Detail" "Dry-run Action Preview" "Runtime/Admin" "No data will be changed"
check_absent_markers "PITS_SHELL_LOCAL_PRODUCT_FLOW_LINK_BOUNDARY" "$PITS_SHELL_LOCAL_URL/product-flow" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
check_route "PITS_SHELL_LOCAL_LOCALIZATION" "$PITS_SHELL_LOCAL_URL/localization" "Localization Catalog" "Read-only Localization Catalog" "Available locales" "Translation namespaces" "Missing keys" "Fallback keys" "packages/shared-ui/src/localization.ts" "Browser editing is not enabled yet" "PITS_SHELL"
check_absent_markers "PITS_SHELL_LOCAL_LOCALIZATION_LINK_BOUNDARY" "$PITS_SHELL_LOCAL_URL/localization" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
check_route "PITS_SHELL_LOCAL_PROJECTS" "$PITS_SHELL_LOCAL_URL/projects" "Project Selector" "PITS Registry Cockpit / Project Runtime Summary" "Owner Review Queue" "Safe Action Boundary" "Read-only preview" "Future admin action requires audit" "Action is read-only preview only" "Admin Boundary" "Audit Required" "Permission Model" "Preview only" "Blocked in current stage" "Future admin action" "Preview only - not executable yet" "Suggested next actions" "Project readiness" "Runtime health:" "Registry Governance / Readiness" "Registry Runtime Health" "PITS is no longer only a registry/readiness shell" "Open PITS Project Workboard" "Open Work Item Detail" "EMERALD_PRECINCT_DEMO" "DEMO DATA - NOT PRODUCTION"
check_route "PITS_SHELL_LOCAL_PRODUCT_UAT_PROJECTS" "$PITS_SHELL_LOCAL_URL/projects" "Product User Journey / UAT Baseline" "${product_uat_ui_markers[@]}" "project registry shell" "true workflow app"
check_route "PITS_SHELL_LOCAL_RUNTIME" "$PITS_SHELL_LOCAL_URL/runtime" "Runtime Status" "PITS Registry Cockpit / Project Runtime Summary" "Safe Action Boundary" "Read-only preview" "Future admin action requires audit" "Audit / Permission / Admin Boundary" "Audit Required" "Permission Model" "Preview only" "Blocked in current stage" "Project readiness" "Registry Governance / Readiness" "Registry Runtime Health" "Core API source:" "PITS_SHELL" "PITS Project Workboard" "Read-only functional slice" "Work Item Detail" "Dry-run Action Preview" "No data will be changed" "Requires Stage 2B/2C write boundary"
check_route "PITS_SHELL_LOCAL_PRODUCT_UAT_RUNTIME" "$PITS_SHELL_LOCAL_URL/runtime" "Product Capability / UAT Status" "${product_uat_ui_markers[@]}"

section "Registry ID Discovery"
if public_staging_discover_registry_ids "$CORE_API_LOCAL_BASE"; then
  printf 'REGISTRY_IDS_READY %s\n' "$PUBLIC_STAGING_DETAIL"
else
  record_failure "$PUBLIC_STAGING_DETAIL"
fi

if [ -n "$REGISTRY_PRODUCT_ID" ] && [ -n "$REGISTRY_WORKSPACE_ID" ] && [ -n "$REGISTRY_PROJECT_ID" ] && [ -n "$REGISTRY_MODULE_ID" ] && [ -n "$REGISTRY_INSTALLATION_ID" ]; then
  registry_project_base_id="${REGISTRY_PROJECT_ID#prj_}"
  registry_work_item_id="pits-${registry_project_base_id}-open-site-access"
  section "Local Detail Routes"
  check_route "OIS_CONSOLE_LOCAL_PRODUCT_DETAIL" "$OIS_CONSOLE_LOCAL_URL/products/$REGISTRY_PRODUCT_ID" "Product Detail Source" "Owner-facing UAT summary" "Owner Review Queue" "Safe Action Boundary" "Action is read-only preview only" "Admin Boundary" "Audit Required" "Permission Model" "Preview only - not executable yet" "Blocked in current stage" "Product Governance / Readiness" "What is missing?" "No issue detected" "Product Runtime Health" "PITS_RUNTIME_SHELL" "$PITS_SHELL_PUBLIC_URL/projects/$REGISTRY_PROJECT_ID"
  check_route "OIS_CONSOLE_LOCAL_PRODUCT_UAT_PRODUCT_DETAIL" "$OIS_CONSOLE_LOCAL_URL/products/$REGISTRY_PRODUCT_ID" "${product_uat_ui_markers[@]}"
  check_route "OIS_CONSOLE_LOCAL_WORKSPACE_DETAIL" "$OIS_CONSOLE_LOCAL_URL/workspaces/$REGISTRY_WORKSPACE_ID" "Workspace Detail Source" "Owner-facing UAT summary" "Owner Review Queue" "Safe Action Boundary" "Action is read-only preview only" "Admin Boundary" "Audit Required" "Permission Model" "Preview only - not executable yet" "Blocked in current stage" "Workspace Governance / Readiness" "What is missing?" "No issue detected" "Workspace Runtime Health" "$PITS_SHELL_PUBLIC_URL/projects/$REGISTRY_PROJECT_ID"
  check_route "OIS_CONSOLE_LOCAL_PRODUCT_UAT_WORKSPACE_DETAIL" "$OIS_CONSOLE_LOCAL_URL/workspaces/$REGISTRY_WORKSPACE_ID" "${product_uat_ui_markers[@]}" "end-user workspace"
  check_route "OIS_CONSOLE_LOCAL_MODULE_DETAIL" "$OIS_CONSOLE_LOCAL_URL/modules/$REGISTRY_MODULE_ID" "Module Detail Source" "Owner-facing UAT summary" "Module Governance / Readiness" "What is missing?" "No issue detected" "Module Runtime Health" "$REGISTRY_INSTALLATION_ID"
  check_route "OIS_CONSOLE_LOCAL_INSTALLATION_DETAIL" "$OIS_CONSOLE_LOCAL_URL/installations/$REGISTRY_INSTALLATION_ID" "Installation Detail Source" "Owner-facing UAT summary" "Owner Review Queue" "Safe Action Boundary" "Action is read-only preview only" "Admin Boundary" "Audit Required" "Permission Model" "Preview only - not executable yet" "Blocked in current stage" "Installation Governance / Readiness" "What is missing?" "No issue detected" "Installation Runtime Health" "$OIS_CONSOLE_PUBLIC_URL/products/$REGISTRY_PRODUCT_ID"
  check_route "OIS_CONSOLE_LOCAL_PRODUCT_UAT_INSTALLATION_DETAIL" "$OIS_CONSOLE_LOCAL_URL/installations/$REGISTRY_INSTALLATION_ID" "${product_uat_ui_markers[@]}" "Future project status update" "No status write can be tested"
  check_route "LOCAL_PITS_PROJECT_WORKBOARD_ENDPOINT" "$CORE_API_LOCAL_BASE/platform/pits/projects/$REGISTRY_PROJECT_ID/workboard" "${pits_workboard_endpoint_markers[@]}"
  check_route "LOCAL_PITS_WORK_ITEM_DETAIL_ENDPOINT" "$CORE_API_LOCAL_BASE/platform/pits/projects/$REGISTRY_PROJECT_ID/work-items/$registry_work_item_id" "${pits_work_item_detail_endpoint_markers[@]}"
  check_route "LOCAL_PITS_DRY_RUN_ACTION_PREVIEW_ENDPOINT" "$CORE_API_LOCAL_BASE/platform/pits/projects/$REGISTRY_PROJECT_ID/work-items/$registry_work_item_id/action-preview" "${pits_dry_run_endpoint_markers[@]}"
  check_route "LOCAL_PITS_ACTION_REQUESTS_ENDPOINT" "$CORE_API_LOCAL_BASE/platform/pits/projects/$REGISTRY_PROJECT_ID/work-items/$registry_work_item_id/action-requests" "${pits_action_request_endpoint_markers[@]}"
  check_route "LOCAL_PITS_ACTION_REQUEST_PREVIEW_ENDPOINT" "$CORE_API_LOCAL_BASE/platform/pits/projects/$REGISTRY_PROJECT_ID/work-items/$registry_work_item_id/action-request-preview" "${pits_action_request_preview_endpoint_markers[@]}"
  check_route "PITS_SHELL_LOCAL_PROJECT_DETAIL" "$PITS_SHELL_LOCAL_URL/projects/$REGISTRY_PROJECT_ID" "Project Detail Source" "Owner-facing project UAT summary" "Owner Review Queue" "Safe Action Boundary" "Action is read-only preview only" "Admin Boundary" "Audit Required" "Permission Model" "Preview only - not executable yet" "Blocked in current stage" "Project readiness" "Project Governance / Readiness" "What is missing?" "No issue detected" "Project Runtime Health" "$OIS_CONSOLE_PUBLIC_URL/products/$REGISTRY_PRODUCT_ID" "$OIS_CONSOLE_PUBLIC_URL/workspaces/$REGISTRY_WORKSPACE_ID"
  check_route "PITS_SHELL_LOCAL_PRODUCT_UAT_PROJECT_DETAIL" "$PITS_SHELL_LOCAL_URL/projects/$REGISTRY_PROJECT_ID" "Project Product UAT Baseline" "${product_uat_ui_markers[@]}" "project detail/readiness shell" "Future issue and task workflow"
  check_route "PITS_SHELL_LOCAL_PROJECT_WORKBOARD" "$PITS_SHELL_LOCAL_URL/projects/$REGISTRY_PROJECT_ID/workboard" "${pits_workboard_ui_markers[@]}" "Project operator" "Safety lead" "Next action" "Preview only" "Not executable yet" "Open Work Item Detail"
  check_route "PITS_SHELL_LOCAL_WORK_ITEM_DETAIL" "$PITS_SHELL_LOCAL_URL/projects/$REGISTRY_PROJECT_ID/work-items/$registry_work_item_id" "${pits_work_item_detail_ui_markers[@]}" "Confirm site access package" "Project operator" "Next action" "Available dry-run actions"
  check_absent_markers "PITS_SHELL_LOCAL_PROJECT_WORKBOARD_LINK_BOUNDARY" "$PITS_SHELL_LOCAL_URL/projects/$REGISTRY_PROJECT_ID/workboard" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
  check_absent_markers "PITS_SHELL_LOCAL_WORK_ITEM_DETAIL_LINK_BOUNDARY" "$PITS_SHELL_LOCAL_URL/projects/$REGISTRY_PROJECT_ID/work-items/$registry_work_item_id" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
fi

section "Public Core API Endpoints"
check_health "public" "$CORE_API_URL/health"
check_overview "public" "$CORE_API_URL/platform/overview"
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
check_route "PUBLIC_STAGING_ECOSYSTEM_PRODUCTS" "$CORE_API_URL/platform/ecosystem-products" '"source":"default-db"' '"mode":"read-only"' '"OIMA"' '"MEETING_INTELLIGENCE_PRODUCT"'
check_route "PUBLIC_STAGING_LEARNING_CENTER" "$CORE_API_URL/platform/learning/center" "${learning_center_endpoint_markers[@]}"
check_route "PUBLIC_STAGING_OIMA_PRODUCT_CODE" "$CORE_API_URL/platform/products/code/OIMA" "${oima_endpoint_markers[@]}" '"relationships"' '"OIS Canonical Knowledge Fabric"'
check_route "PUBLIC_STAGING_OIMA_OVERVIEW" "$CORE_API_URL/platform/oima/overview" "${oima_endpoint_markers[@]}" '"OIS Canonical Knowledge Fabric"' '"Universal Knowledge API"'
check_route "PUBLIC_STAGING_OIMA_SOURCE_MODES" "$CORE_API_URL/platform/oima/source-modes" "${oima_endpoint_markers[@]}" '"primarySourceMode":"TRANSCRIPT_ONLY"' '"audioDoesNotBlockAnalysis":true'
check_route "PUBLIC_STAGING_OIMA_ROADMAP" "$CORE_API_URL/platform/oima/roadmap" "${oima_endpoint_markers[@]}" '"roadmap"' '"Stage 2H"' '"OIMA-0"' '"OIMA-9"'
check_route "PUBLIC_STAGING_OIMA_BOUNDARY" "$CORE_API_URL/platform/oima/boundary" "${oima_endpoint_markers[@]}" '"noCanonicalKnowledgeWrite":true' '"autoPromotionEnabled":false'
check_route "PUBLIC_STAGING_KNOWLEDGE_LAYERS" "$CORE_API_URL/platform/knowledge/layers" "${knowledge_endpoint_markers[@]}" '"layers"' '"productConsumptionMap"'
check_route "PUBLIC_STAGING_KNOWLEDGE_ITEMS" "$CORE_API_URL/platform/knowledge/items" "${knowledge_endpoint_markers[@]}" '"items"' '"summary"'
check_route "PUBLIC_STAGING_KNOWLEDGE_EVIDENCE" "$CORE_API_URL/platform/knowledge/evidence" '"source":"default-db"' '"mode":"read-only"' '"evidenceLinks"' '"totalLinks"'
check_route "PUBLIC_STAGING_KNOWLEDGE_CONTEXT" "$CORE_API_URL/platform/knowledge/context" "${knowledge_taxonomy_markers[@]}" '"deterministic-knowledge-context"' '"noCanonicalWrite":true'
check_route "PUBLIC_STAGING_KNOWLEDGE_LAYER_MAPPINGS" "$CORE_API_URL/platform/learning/layer-mappings" "${knowledge_mapping_status_markers[@]}" '"mappings"'
check_route "PUBLIC_STAGING_KEIHB_BUNDLES" "$CORE_API_URL/platform/knowledge/keihb/bundles" "${knowledge_taxonomy_markers[@]}" '"KEIHB"' '"projectionBoundary"'
check_route "PUBLIC_STAGING_ARCHITECTURE_MINDMAP" "$CORE_API_URL/platform/architecture/mindmap" "${knowledge_endpoint_markers[@]}" '"OIS Ecosystem Architecture Map"' '"apiContracts"'
check_absent_markers "PUBLIC_STAGING_REGISTRY_READINESS_LINK_BOUNDARY" "$CORE_API_URL/platform/registry/readiness" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
check_absent_markers "PUBLIC_STAGING_OWNER_REVIEW_LINK_BOUNDARY" "$CORE_API_URL/platform/owner-review" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
check_absent_markers "PUBLIC_STAGING_ADMIN_BOUNDARY_LINK_BOUNDARY" "$CORE_API_URL/platform/admin-boundary" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
check_absent_markers "PUBLIC_STAGING_PRODUCT_UAT_LINK_BOUNDARY" "$CORE_API_URL/platform/product-uat" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
if [ -n "$REGISTRY_PRODUCT_ID" ] && [ -n "$REGISTRY_WORKSPACE_ID" ] && [ -n "$REGISTRY_PROJECT_ID" ] && [ -n "$REGISTRY_MODULE_ID" ] && [ -n "$REGISTRY_INSTALLATION_ID" ]; then
  check_route "PUBLIC_STAGING_PRODUCT_DETAIL" "$CORE_API_URL/platform/products/$REGISTRY_PRODUCT_ID" '"source":"default-db"' '"mode":"read-only"' '"product"' '"relationships"'
  check_route "PUBLIC_STAGING_PRODUCT_CODE_DETAIL" "$CORE_API_URL/platform/products/code/$REGISTRY_PRODUCT_CODE" '"source":"default-db"' '"mode":"read-only"' '"product"' '"relationships"'
  check_route "PUBLIC_STAGING_WORKSPACE_DETAIL" "$CORE_API_URL/platform/workspaces/$REGISTRY_WORKSPACE_ID" '"source":"default-db"' '"mode":"read-only"' '"workspace"' '"relationships"'
  check_route "PUBLIC_STAGING_PROJECT_DETAIL" "$CORE_API_URL/platform/projects/$REGISTRY_PROJECT_ID" '"source":"default-db"' '"mode":"read-only"' '"project"' '"relationships"'
  check_route "PUBLIC_STAGING_PITS_PROJECT_WORKBOARD" "$CORE_API_URL/platform/pits/projects/$REGISTRY_PROJECT_ID/workboard" "${pits_workboard_endpoint_markers[@]}"
  registry_project_base_id="${REGISTRY_PROJECT_ID#prj_}"
  registry_work_item_id="pits-${registry_project_base_id}-open-site-access"
  check_route "PUBLIC_STAGING_PITS_WORK_ITEM_DETAIL" "$CORE_API_URL/platform/pits/projects/$REGISTRY_PROJECT_ID/work-items/$registry_work_item_id" "${pits_work_item_detail_endpoint_markers[@]}"
  check_route "PUBLIC_STAGING_PITS_DRY_RUN_ACTION_PREVIEW" "$CORE_API_URL/platform/pits/projects/$REGISTRY_PROJECT_ID/work-items/$registry_work_item_id/action-preview" "${pits_dry_run_endpoint_markers[@]}"
  check_route "PUBLIC_STAGING_PITS_ACTION_REQUESTS" "$CORE_API_URL/platform/pits/projects/$REGISTRY_PROJECT_ID/work-items/$registry_work_item_id/action-requests" "${pits_action_request_endpoint_markers[@]}"
  check_route "PUBLIC_STAGING_PITS_ACTION_REQUEST_PREVIEW" "$CORE_API_URL/platform/pits/projects/$REGISTRY_PROJECT_ID/work-items/$registry_work_item_id/action-request-preview" "${pits_action_request_preview_endpoint_markers[@]}"
  check_route "PUBLIC_STAGING_MODULE_DETAIL" "$CORE_API_URL/platform/modules/$REGISTRY_MODULE_ID" '"source":"default-db"' '"mode":"read-only"' '"module"' '"relationships"'
  check_route "PUBLIC_STAGING_INSTALLATION_DETAIL" "$CORE_API_URL/platform/installations/$REGISTRY_INSTALLATION_ID" '"source":"default-db"' '"mode":"read-only"' '"installation"' '"relationships"'
  check_controlled_404 "PUBLIC_STAGING_PRODUCT_DETAIL_404" "$CORE_API_URL/platform/products/stage-1c-missing-product" '"code":"NOT_FOUND"' '"entity":"product"'
fi

section "Public Cloudflare Tunnel Product Endpoints"
check_root_shell "OIS_CONSOLE_PUBLIC_ROOT" "$OIS_CONSOLE_PUBLIC_URL" "OIS_CONSOLE" "OIS Console"
check_route "OIS_CONSOLE_PUBLIC_SHELL_STANDARD" "$OIS_CONSOLE_PUBLIC_URL" "Modern Shell Layout" "Shell Navigation Toggle" "Fixed Navigation Shell" "Responsive Product Shell"
check_route "OIS_CONSOLE_PUBLIC_OWNER_DESIGN_SYSTEM" "$OIS_CONSOLE_PUBLIC_URL" "Owner-first Design System" "Visual Hierarchy Standard" "Owner-friendly Status Badges"
check_route "OIS_CONSOLE_PUBLIC_ROOT_COCKPIT" "$OIS_CONSOLE_PUBLIC_URL" "Owner Registry Cockpit / Registry Runtime Summary" "Ready to operate" "Forbidden link guard" "OIS_CONSOLE"
check_route "OIS_CONSOLE_PUBLIC_PRODUCT_UAT_ROOT" "$OIS_CONSOLE_PUBLIC_URL" "Product User Journey UAT Baseline" "${product_uat_ui_markers[@]}"
check_route "OIS_CONSOLE_PUBLIC_PRODUCT_FLOW" "$OIS_CONSOLE_PUBLIC_URL/product-flow" "${product_flow_ui_markers[@]}" "OIS Product UX Preview" "OIS Product UX Blueprint" "Executive Dashboard" "Workspace Intelligence Dashboard" "Meeting/Document Knowledge Feed" "Knowledge Detail" "Ask OIS / Copilot" "Runtime/Admin" "No LLM call"
check_absent_markers "OIS_CONSOLE_PUBLIC_PRODUCT_FLOW_LINK_BOUNDARY" "$OIS_CONSOLE_PUBLIC_URL/product-flow" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
check_route "OIS_CONSOLE_PUBLIC_LOCALIZATION" "$OIS_CONSOLE_PUBLIC_URL/localization" "Localization Catalog" "Read-only Localization Catalog" "Available locales" "Translation namespaces" "Missing keys" "Fallback keys" "packages/shared-ui/src/localization.ts" "Browser editing is not enabled yet" "OIS_CONSOLE"
check_absent_markers "OIS_CONSOLE_PUBLIC_LOCALIZATION_LINK_BOUNDARY" "$OIS_CONSOLE_PUBLIC_URL/localization" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
check_absent_markers "OIS_CONSOLE_PUBLIC_LEARNING_CENTER_LINK_BOUNDARY" "$OIS_CONSOLE_PUBLIC_URL/learning-center" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
check_absent_markers "OIS_CONSOLE_PUBLIC_KNOWLEDGE_FABRIC_LINK_BOUNDARY" "$OIS_CONSOLE_PUBLIC_URL/knowledge-fabric" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
check_absent_markers "OIS_CONSOLE_PUBLIC_OIMA_LINK_BOUNDARY" "$OIS_CONSOLE_PUBLIC_URL/oima" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
check_route "OIS_CONSOLE_PUBLIC_DASHBOARD" "$OIS_CONSOLE_PUBLIC_URL/dashboard" "Platform Overview" "Owner Registry Cockpit / Registry Runtime Summary" "Owner Review Queue" "Safe Action Boundary" "Read-only preview" "Future admin action requires audit" "Action is read-only preview only" "Admin Boundary" "Audit Required" "Permission Model" "Preview only" "Blocked in current stage" "Future admin action" "Preview only - not executable yet" "Suggested next actions" "Registry Governance / Readiness" "Registry Runtime Health" "Missing runtime URL" "Forbidden link guard" "DEMO DATA - NOT PRODUCTION"
check_route "OIS_CONSOLE_PUBLIC_PRODUCT_UAT_DASHBOARD" "$OIS_CONSOLE_PUBLIC_URL/dashboard" "Product User Journey / UAT Baseline" "${product_uat_ui_markers[@]}"
check_route "OIS_CONSOLE_PUBLIC_PRODUCTS" "$OIS_CONSOLE_PUBLIC_URL/products" "Products &amp; Modules" "Product &amp; Module Overview" "Owner Registry Cockpit / Registry Runtime Summary" "Registry Governance / Readiness" "Registry Runtime Health" "Runtime health:" "Readiness:" "Linked to PITS" "PITS_RUNTIME_SHELL" "OIS_CONSOLE"
check_route "OIS_CONSOLE_PUBLIC_WORKSPACES" "$OIS_CONSOLE_PUBLIC_URL/workspaces" "Organizations, Workspaces &amp; Projects" "Workspace Overview" "Owner Registry Cockpit / Registry Runtime Summary" "Registry Governance / Readiness" "Registry Runtime Health" "Runtime health:" "Readiness:" "PMC Org Demo" "OIS_CONSOLE"
check_route "OIS_CONSOLE_PUBLIC_LEARNING_CENTER" "$OIS_CONSOLE_PUBLIC_URL/learning-center" "${learning_center_ui_markers[@]}" "OIS_CONSOLE"
check_route "OIS_CONSOLE_PUBLIC_KNOWLEDGE_FABRIC" "$OIS_CONSOLE_PUBLIC_URL/knowledge-fabric" "${knowledge_ui_markers[@]}" "OIS_CONSOLE"
check_route "OIS_CONSOLE_PUBLIC_OIMA" "$OIS_CONSOLE_PUBLIC_URL/oima" "${oima_ui_markers[@]}" "OIS_CONSOLE" "OIMA-0" "OIMA-9"
check_route "OIS_CONSOLE_PUBLIC_RUNTIME" "$OIS_CONSOLE_PUBLIC_URL/runtime" "Runtime Status" "Owner Registry Cockpit / Registry Runtime Summary" "Safe Action Boundary" "Read-only preview" "Future admin action requires audit" "Audit / Permission / Admin Boundary" "Audit Required" "Permission Model" "Preview only" "Blocked in current stage" "Registry Governance / Readiness" "Registry Runtime Health" "Core API source:" "OIS_CONSOLE"
check_route "OIS_CONSOLE_PUBLIC_PRODUCT_UAT_RUNTIME" "$OIS_CONSOLE_PUBLIC_URL/runtime" "Product Capability / UAT Status" "${product_uat_ui_markers[@]}"
check_root_shell "PITS_SHELL_PUBLIC_ROOT" "$PITS_SHELL_PUBLIC_URL" "PITS_SHELL" "PITS Shell"
check_route "PITS_SHELL_PUBLIC_SHELL_STANDARD" "$PITS_SHELL_PUBLIC_URL" "Modern Shell Layout" "Shell Navigation Toggle" "Fixed Navigation Shell" "Responsive Product Shell"
check_route "PITS_SHELL_PUBLIC_OWNER_DESIGN_SYSTEM" "$PITS_SHELL_PUBLIC_URL" "Owner-first Design System" "Visual Hierarchy Standard" "Owner-friendly Status Badges"
check_route "PITS_SHELL_PUBLIC_ROOT_COCKPIT" "$PITS_SHELL_PUBLIC_URL" "PITS Registry Cockpit / Project Runtime Summary" "Project readiness" "Forbidden link guard" "PITS_SHELL"
check_route "PITS_SHELL_PUBLIC_PRODUCT_UAT_ROOT" "$PITS_SHELL_PUBLIC_URL" "Product User Journey UAT Baseline" "${product_uat_ui_markers[@]}" "project registry/readiness shell" "true project workflow app"
check_route "PITS_SHELL_PUBLIC_PRODUCT_FLOW" "$PITS_SHELL_PUBLIC_URL/product-flow" "${product_flow_ui_markers[@]}" "PITS Product UX Preview" "PITS Product UX Blueprint" "PITS Home" "Projects List" "Project Detail" "Project Workboard" "Work Item Detail" "Dry-run Action Preview" "Runtime/Admin" "No data will be changed"
check_absent_markers "PITS_SHELL_PUBLIC_PRODUCT_FLOW_LINK_BOUNDARY" "$PITS_SHELL_PUBLIC_URL/product-flow" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
check_route "PITS_SHELL_PUBLIC_LOCALIZATION" "$PITS_SHELL_PUBLIC_URL/localization" "Localization Catalog" "Read-only Localization Catalog" "Available locales" "Translation namespaces" "Missing keys" "Fallback keys" "packages/shared-ui/src/localization.ts" "Browser editing is not enabled yet" "PITS_SHELL"
check_absent_markers "PITS_SHELL_PUBLIC_LOCALIZATION_LINK_BOUNDARY" "$PITS_SHELL_PUBLIC_URL/localization" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
check_route "PITS_SHELL_PUBLIC_PROJECTS" "$PITS_SHELL_PUBLIC_URL/projects" "Project Selector" "PITS Registry Cockpit / Project Runtime Summary" "Owner Review Queue" "Safe Action Boundary" "Read-only preview" "Future admin action requires audit" "Action is read-only preview only" "Admin Boundary" "Audit Required" "Permission Model" "Preview only" "Blocked in current stage" "Future admin action" "Preview only - not executable yet" "Suggested next actions" "Project readiness" "Runtime health:" "Registry Governance / Readiness" "Registry Runtime Health" "PITS is no longer only a registry/readiness shell" "Open PITS Project Workboard" "Open Work Item Detail" "EMERALD_PRECINCT_DEMO" "DEMO DATA - NOT PRODUCTION"
check_route "PITS_SHELL_PUBLIC_PRODUCT_UAT_PROJECTS" "$PITS_SHELL_PUBLIC_URL/projects" "Product User Journey / UAT Baseline" "${product_uat_ui_markers[@]}" "project registry shell" "true workflow app"
check_route "PITS_SHELL_PUBLIC_RUNTIME" "$PITS_SHELL_PUBLIC_URL/runtime" "Runtime Status" "PITS Registry Cockpit / Project Runtime Summary" "Safe Action Boundary" "Read-only preview" "Future admin action requires audit" "Audit / Permission / Admin Boundary" "Audit Required" "Permission Model" "Preview only" "Blocked in current stage" "Project readiness" "Registry Governance / Readiness" "Registry Runtime Health" "Core API source:" "PITS_SHELL" "PITS Project Workboard" "Read-only functional slice" "Work Item Detail" "Dry-run Action Preview" "No data will be changed" "Requires Stage 2B/2C write boundary"
check_route "PITS_SHELL_PUBLIC_PRODUCT_UAT_RUNTIME" "$PITS_SHELL_PUBLIC_URL/runtime" "Product Capability / UAT Status" "${product_uat_ui_markers[@]}"
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
  check_absent_markers "PITS_SHELL_PUBLIC_PROJECT_WORKBOARD_LINK_BOUNDARY" "$PITS_SHELL_PUBLIC_URL/projects/$REGISTRY_PROJECT_ID/workboard" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
  check_absent_markers "PITS_SHELL_PUBLIC_WORK_ITEM_DETAIL_LINK_BOUNDARY" "$PITS_SHELL_PUBLIC_URL/projects/$REGISTRY_PROJECT_ID/work-items/$registry_work_item_id" "localhost" "127.0.0.1" "ois.dmp247.com" "oisys.abacusai.app"
fi

if [ "$failures" -gt 0 ]; then
  printf '\nPUBLIC_STAGING_RUNTIME_STATUS_FAILED failures=%s\n' "$failures" >&2
  exit 1
fi

printf '\nPUBLIC_STAGING_RUNTIME_STATUS_PASSED Core API, UI systemd services, cloudflared and public endpoints are healthy.\n'
