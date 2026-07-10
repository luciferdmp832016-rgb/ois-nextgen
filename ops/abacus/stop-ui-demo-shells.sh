#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="${REPO_DIR:-/home/ubuntu/ois-nextgen}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=ops/abacus/lib-ui-demo-shells.sh
. "$SCRIPT_DIR/lib-ui-demo-shells.sh"

failures=0

record_failure() {
  printf 'FAIL: %s\n' "$1" >&2
  failures=$((failures + 1))
}

printf '%s\n' "Stopping temporary OIS NextGen UI demo shells only."
ui_demo_print_safety
printf '%s\n' "Core API service is not stopped or modified by this script."

if ! ui_demo_stop_shell "ois-console" "OIS_CONSOLE"; then
  record_failure "OIS Console demo did not stop cleanly"
fi

if ! ui_demo_stop_shell "pits-shell" "PITS_SHELL"; then
  record_failure "PITS Shell demo did not stop cleanly"
fi

if ! ui_demo_stop_shell "oima-shell" "OIMA_SHELL"; then
  record_failure "OIMA Shell demo did not stop cleanly"
fi

if [ "$failures" -gt 0 ]; then
  printf '\nUI_DEMO_STOP_FAILED failures=%s\n' "$failures" >&2
  exit 1
fi

printf '\nUI_DEMO_STOP_PASSED OIS Console, PITS Shell and OIMA Shell temporary demos are stopped or were not running.\n'
