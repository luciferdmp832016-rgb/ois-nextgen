#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="${REPO_DIR:-/home/ubuntu/ois-nextgen}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INCLUDE_CLOUDFLARED=false

# shellcheck source=ops/abacus/lib-core-api-checks.sh
. "$SCRIPT_DIR/lib-core-api-checks.sh"
# shellcheck source=ops/abacus/lib-ui-demo-shells.sh
. "$SCRIPT_DIR/lib-ui-demo-shells.sh"
# shellcheck source=ops/abacus/lib-public-staging-runtime.sh
. "$SCRIPT_DIR/lib-public-staging-runtime.sh"

usage() {
  cat <<'USAGE'
Usage: bash ops/abacus/restart-public-staging-runtime.sh [--include-cloudflared]

Restarts the durable public staging app services:
- ois-nextgen-core-api
- ois-nextgen-ois-console
- ois-nextgen-pits-shell

cloudflared is checked but not restarted unless --include-cloudflared is passed.
USAGE
}

for arg in "$@"; do
  case "$arg" in
    --include-cloudflared)
      INCLUDE_CLOUDFLARED=true
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      usage >&2
      exit 2
      ;;
  esac
done

failures=0

record_failure() {
  printf 'FAIL: %s\n' "$1" >&2
  failures=$((failures + 1))
}

report_ui_ports() {
  local stage_label="$1"

  public_staging_report_port_listener "3000" "OIS_CONSOLE_${stage_label}"
  public_staging_report_port_listener "3001" "PITS_SHELL_${stage_label}"
}

report_orphan_suspect_if_needed() {
  local service_name="$1"
  local port="$2"
  local label="$3"

  if ! public_staging_systemctl_active "$service_name" && public_staging_port_has_listener "$port"; then
    printf 'ORPHAN_UI_PROCESS_SUSPECTED service=%s port=%s label=%s\n' "$service_name" "$port" "$label" >&2
    return 0
  fi

  return 1
}

cleanup_ui_port_orphans() {
  local needs_cleanup=false

  if public_staging_port_has_listener "3000"; then
    needs_cleanup=true
    if ! report_orphan_suspect_if_needed "$OIS_CONSOLE_SERVICE" "3000" "after_systemd_stop"; then
      printf 'UI_PORT_LISTENER_REMAINS service=%s port=3000 label=after_systemd_stop\n' "$OIS_CONSOLE_SERVICE" >&2
    fi
  fi

  if public_staging_port_has_listener "3001"; then
    needs_cleanup=true
    if ! report_orphan_suspect_if_needed "$PITS_SHELL_SERVICE" "3001" "after_systemd_stop"; then
      printf 'UI_PORT_LISTENER_REMAINS service=%s port=3001 label=after_systemd_stop\n' "$PITS_SHELL_SERVICE" >&2
    fi
  fi

  if [ "$needs_cleanup" != true ]; then
    printf '%s\n' "UI_ORPHAN_PORT_CLEANUP_SKIPPED no listeners remained on ports 3000/3001 after systemd stop"
    return 0
  fi

  if ! command -v fuser >/dev/null 2>&1; then
    record_failure "fuser is not available for UI orphan port cleanup"
    return 1
  fi

  printf '%s\n' "UI_ORPHAN_PORT_CLEANUP_START killing only listeners bound to 3000/tcp and 3001/tcp"
  if sudo fuser -k 3000/tcp 3001/tcp; then
    printf '%s\n' "UI_ORPHAN_PORT_CLEANUP_PASSED fuser killed only 3000/tcp and 3001/tcp listeners"
  else
    printf '%s\n' "UI_ORPHAN_PORT_CLEANUP_WARN fuser returned non-zero; ports will be rechecked before start" >&2
  fi

  return 0
}

verify_local_product_routes() {
  public_staging_wait_for_root_shell "LOCAL_UI_READY" "OIS_CONSOLE_LOCAL" "$OIS_CONSOLE_LOCAL_URL" "OIS_CONSOLE" "OIS Console" || record_failure "OIS Console local readiness timeout"
  public_staging_wait_for_route "LOCAL_ROUTE_READY" "OIS_CONSOLE_LOCAL_DASHBOARD" "$OIS_CONSOLE_LOCAL_URL/dashboard" "Platform Overview" "DEMO DATA - NOT PRODUCTION" || record_failure "OIS Console local dashboard route timeout"
  public_staging_wait_for_route "LOCAL_ROUTE_READY" "OIS_CONSOLE_LOCAL_PRODUCTS" "$OIS_CONSOLE_LOCAL_URL/products" "Products &amp; Modules" "Product &amp; Module Overview" "OIS_CONSOLE" || record_failure "OIS Console local products route timeout"
  public_staging_wait_for_route "LOCAL_ROUTE_READY" "OIS_CONSOLE_LOCAL_WORKSPACES" "$OIS_CONSOLE_LOCAL_URL/workspaces" "Organizations, Workspaces &amp; Projects" "Workspace Overview" "OIS_CONSOLE" || record_failure "OIS Console local workspaces route timeout"
  public_staging_wait_for_route "LOCAL_ROUTE_READY" "OIS_CONSOLE_LOCAL_RUNTIME" "$OIS_CONSOLE_LOCAL_URL/runtime" "Runtime Status" "Core API source:" "OIS_CONSOLE" || record_failure "OIS Console local runtime route timeout"

  public_staging_wait_for_root_shell "LOCAL_UI_READY" "PITS_SHELL_LOCAL" "$PITS_SHELL_LOCAL_URL" "PITS_SHELL" "PITS Shell" || record_failure "PITS Shell local readiness timeout"
  public_staging_wait_for_route "LOCAL_ROUTE_READY" "PITS_SHELL_LOCAL_PROJECTS" "$PITS_SHELL_LOCAL_URL/projects" "Project Selector" "DEMO DATA - NOT PRODUCTION" || record_failure "PITS Shell local projects route timeout"
  public_staging_wait_for_route "LOCAL_ROUTE_READY" "PITS_SHELL_LOCAL_RUNTIME" "$PITS_SHELL_LOCAL_URL/runtime" "Runtime Status" "Core API source:" "PITS_SHELL" || record_failure "PITS Shell local runtime route timeout"
}

printf '%s\n' "Restarting OIS NextGen public staging runtime."
public_staging_print_safety
printf '%s\n' "Safety: sudo is used only for systemd operations and fuser cleanup on ports 3000/3001."
printf '%s\n' "Safety: cloudflared is not restarted unless --include-cloudflared is passed."
printf '%s\n' "Safety: Core API port 4000 and cloudflared are never killed by UI orphan cleanup."

public_staging_require_repo

if ! bash "$SCRIPT_DIR/verify-ui-route-manifests.sh"; then
  record_failure "UI production route manifest verification failed before restart"
  printf '\nPUBLIC_STAGING_RESTART_BLOCKED reason=ui_route_manifest_check_failed\n' >&2
  exit 1
fi

if [ "$INCLUDE_CLOUDFLARED" = true ]; then
  printf 'SYSTEMD_RESTART %s explicit=true\n' "$CLOUDFLARED_SERVICE"
  sudo systemctl restart "$CLOUDFLARED_SERVICE"
else
  printf 'SYSTEMD_RESTART_SKIPPED %s reason=not_explicitly_requested\n' "$CLOUDFLARED_SERVICE"
fi

printf 'SYSTEMD_RESTART %s\n' "$CORE_API_SERVICE"
sudo systemctl restart "$CORE_API_SERVICE"
sudo systemctl is-active --quiet "$CORE_API_SERVICE" || record_failure "$CORE_API_SERVICE is not active after restart"

if ! wait_for_core_api_restart_ready "$CORE_API_LOCAL_BASE" "$CORE_API_URL"; then
  record_failure "Core API restart readiness timeout"
fi

printf 'SYSTEMD_STOP %s %s\n' "$OIS_CONSOLE_SERVICE" "$PITS_SHELL_SERVICE"
if ! sudo systemctl stop "$OIS_CONSOLE_SERVICE" "$PITS_SHELL_SERVICE"; then
  record_failure "UI systemd services did not stop cleanly"
fi

printf '%s\n' "LEGACY_UI_DEMO_CLEANUP_START stopping temporary nohup UI demo processes before orphan port cleanup"
if [ -f "$SCRIPT_DIR/stop-ui-demo-shells.sh" ]; then
  if ! bash "$SCRIPT_DIR/stop-ui-demo-shells.sh"; then
    record_failure "legacy UI demo process cleanup failed"
  fi
else
  printf '%s\n' "LEGACY_UI_DEMO_CLEANUP_SKIPPED reason=stop-ui-demo-shells.sh_missing"
fi

report_ui_ports "BEFORE_ORPHAN_CLEANUP"
cleanup_ui_port_orphans
report_ui_ports "AFTER_ORPHAN_CLEANUP"

if public_staging_port_has_listener "3000" || public_staging_port_has_listener "3001"; then
  record_failure "UI port listener remained on 3000/3001 after orphan cleanup"
fi

printf 'SYSTEMD_RESET_FAILED %s %s\n' "$OIS_CONSOLE_SERVICE" "$PITS_SHELL_SERVICE"
sudo systemctl reset-failed "$OIS_CONSOLE_SERVICE" "$PITS_SHELL_SERVICE" || true

printf 'SYSTEMD_START %s\n' "$OIS_CONSOLE_SERVICE"
if ! sudo systemctl start "$OIS_CONSOLE_SERVICE"; then
  record_failure "$OIS_CONSOLE_SERVICE failed to start"
fi
sudo systemctl is-active --quiet "$OIS_CONSOLE_SERVICE" || record_failure "$OIS_CONSOLE_SERVICE is not active after start"

printf 'SYSTEMD_START %s\n' "$PITS_SHELL_SERVICE"
if ! sudo systemctl start "$PITS_SHELL_SERVICE"; then
  record_failure "$PITS_SHELL_SERVICE failed to start"
fi
sudo systemctl is-active --quiet "$PITS_SHELL_SERVICE" || record_failure "$PITS_SHELL_SERVICE is not active after start"

report_ui_ports "AFTER_SYSTEMD_START"

if ! public_staging_systemctl_active "$CLOUDFLARED_SERVICE"; then
  record_failure "$CLOUDFLARED_SERVICE is not active"
fi

verify_local_product_routes

if ! bash "$SCRIPT_DIR/check-public-staging-endpoints.sh"; then
  record_failure "public staging endpoint verification failed"
fi

if [ "$failures" -gt 0 ]; then
  printf '\nPUBLIC_STAGING_RESTART_FAILED failures=%s\n' "$failures" >&2
  exit 1
fi

printf '\nPUBLIC_STAGING_RESTART_PASSED Core API, OIS Console, PITS Shell and public endpoints verified.\n'
