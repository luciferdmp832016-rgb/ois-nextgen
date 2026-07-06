#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="${REPO_DIR:-/home/ubuntu/ois-nextgen}"
BUILD_UI_DEMO_SHELLS="${BUILD_UI_DEMO_SHELLS:-true}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=ops/abacus/lib-ui-demo-shells.sh
. "$SCRIPT_DIR/lib-ui-demo-shells.sh"

printf '%s\n' "Starting temporary OIS NextGen UI demo shells."
ui_demo_print_safety
printf 'Runtime topology: Core API stays unchanged at %s; OIS Console port 3000; PITS Shell port 3001.\n' "$CORE_API_URL"
printf '%s\n' "Mode: temporary nohup with PID files under $UI_DEMO_DIR. No systemd or nginx changes."

ui_demo_require_repo
cd "$REPO_DIR"

if [ "$BUILD_UI_DEMO_SHELLS" = "true" ]; then
  ui_demo_build_shell "@ois/ois-console" "OIS_CONSOLE"
  ui_demo_build_shell "@ois/pits-shell" "PITS_SHELL"
else
  printf '%s\n' "UI_DEMO_BUILD_SKIPPED BUILD_UI_DEMO_SHELLS=false"
fi

ui_demo_start_shell "ois-console" "OIS_CONSOLE" "@ois/ois-console" "3000"
ui_demo_start_shell "pits-shell" "PITS_SHELL" "@ois/pits-shell" "3001"

ui_demo_wait_for_local "UI_DEMO_LOCAL_READY" "OIS_CONSOLE_LOCAL" "http://127.0.0.1:3000/" "OIS_CONSOLE" "OIS Console"
ui_demo_wait_for_local "UI_DEMO_LOCAL_READY" "PITS_SHELL_LOCAL" "http://127.0.0.1:3001/" "PITS_SHELL" "PITS Shell"

printf '%s\n' "UI_DEMO_START_VERIFICATION_PASSED OIS Console and PITS Shell local demo pages are ready."
printf '%s\n' "Run: bash ops/abacus/status-ui-demo-shells.sh"
