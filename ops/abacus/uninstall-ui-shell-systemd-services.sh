#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="${REPO_DIR:-/home/ubuntu/ois-nextgen}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=ops/abacus/lib-public-staging-runtime.sh
. "$SCRIPT_DIR/lib-public-staging-runtime.sh"

SYSTEMD_DIR="${SYSTEMD_DIR:-/etc/systemd/system}"
CONFIRM=false

usage() {
  cat <<'USAGE'
Usage: bash ops/abacus/uninstall-ui-shell-systemd-services.sh --confirm

Removes only the Stage 0W-A OIS/PITS UI shell systemd units:
- ois-nextgen-ois-console
- ois-nextgen-pits-shell

Does not stop Core API, cloudflared, nginx, DBs, DNS or legacy resources.
USAGE
}

for arg in "$@"; do
  case "$arg" in
    --confirm)
      CONFIRM=true
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

if [ "$CONFIRM" != "true" ]; then
  usage
  printf '%s\n' "STOP: pass --confirm to remove UI shell systemd services." >&2
  exit 1
fi

printf '%s\n' "Uninstalling durable OIS NextGen UI shell systemd services."
public_staging_print_safety
printf '%s\n' "Safety: sudo is used only for systemd stop/disable/remove/daemon-reload."
printf '%s\n' "Safety: Core API and cloudflared are not stopped or modified."

sudo systemctl stop "$OIS_CONSOLE_SERVICE" "$PITS_SHELL_SERVICE" || true
sudo systemctl disable "$OIS_CONSOLE_SERVICE" "$PITS_SHELL_SERVICE" || true
sudo rm -f "$SYSTEMD_DIR/$OIS_CONSOLE_SERVICE.service" "$SYSTEMD_DIR/$PITS_SHELL_SERVICE.service"
sudo systemctl daemon-reload
sudo systemctl reset-failed "$OIS_CONSOLE_SERVICE" "$PITS_SHELL_SERVICE" || true

printf '\nUI_SYSTEMD_UNINSTALL_PASSED OIS Console and PITS Shell systemd units removed.\n'
