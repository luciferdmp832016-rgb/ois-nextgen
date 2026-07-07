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

printf '%s\n' "Restarting OIS NextGen public staging runtime."
public_staging_print_safety
printf '%s\n' "Safety: sudo is used only for systemd restart/status operations."
printf '%s\n' "Safety: cloudflared is not restarted unless --include-cloudflared is passed."

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

printf '%s\n' "LEGACY_UI_DEMO_CLEANUP_START stopping temporary nohup UI demo processes before systemd UI restart"
if [ -f "$SCRIPT_DIR/stop-ui-demo-shells.sh" ]; then
  if ! bash "$SCRIPT_DIR/stop-ui-demo-shells.sh"; then
    record_failure "legacy UI demo process cleanup failed"
  fi
else
  printf '%s\n' "LEGACY_UI_DEMO_CLEANUP_SKIPPED reason=stop-ui-demo-shells.sh_missing"
fi

public_staging_report_port_listener "3000" "OIS_CONSOLE_BEFORE_SYSTEMD_RESTART"
public_staging_report_port_listener "3001" "PITS_SHELL_BEFORE_SYSTEMD_RESTART"

printf 'SYSTEMD_RESTART %s\n' "$OIS_CONSOLE_SERVICE"
sudo systemctl restart "$OIS_CONSOLE_SERVICE"
sudo systemctl is-active --quiet "$OIS_CONSOLE_SERVICE" || record_failure "$OIS_CONSOLE_SERVICE is not active after restart"

printf 'SYSTEMD_RESTART %s\n' "$PITS_SHELL_SERVICE"
sudo systemctl restart "$PITS_SHELL_SERVICE"
sudo systemctl is-active --quiet "$PITS_SHELL_SERVICE" || record_failure "$PITS_SHELL_SERVICE is not active after restart"

public_staging_report_port_listener "3000" "OIS_CONSOLE_AFTER_SYSTEMD_RESTART"
public_staging_report_port_listener "3001" "PITS_SHELL_AFTER_SYSTEMD_RESTART"

if ! public_staging_systemctl_active "$CLOUDFLARED_SERVICE"; then
  record_failure "$CLOUDFLARED_SERVICE is not active"
fi

public_staging_wait_for_root_shell "LOCAL_UI_READY" "OIS_CONSOLE_LOCAL" "$OIS_CONSOLE_LOCAL_URL" "OIS_CONSOLE" "OIS Console" || record_failure "OIS Console local readiness timeout"
public_staging_wait_for_root_shell "LOCAL_UI_READY" "PITS_SHELL_LOCAL" "$PITS_SHELL_LOCAL_URL" "PITS_SHELL" "PITS Shell" || record_failure "PITS Shell local readiness timeout"

if ! bash "$SCRIPT_DIR/check-public-staging-endpoints.sh"; then
  record_failure "public staging endpoint verification failed"
fi

if [ "$failures" -gt 0 ]; then
  printf '\nPUBLIC_STAGING_RESTART_FAILED failures=%s\n' "$failures" >&2
  exit 1
fi

printf '\nPUBLIC_STAGING_RESTART_PASSED Core API, OIS Console, PITS Shell and public endpoints verified.\n'
