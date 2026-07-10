#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

printf '%s\n' "Restarting temporary OIS NextGen UI demo shells."
printf '%s\n' "Safety: stop/start only OIS Console, PITS Shell and OIMA Shell demo processes. Core API, nginx, DB and legacy resources are untouched."

bash "$SCRIPT_DIR/stop-ui-demo-shells.sh"
bash "$SCRIPT_DIR/start-ui-demo-shells.sh"
bash "$SCRIPT_DIR/status-ui-demo-shells.sh"

printf '\nUI_DEMO_RESTART_PASSED OIS Console, PITS Shell and OIMA Shell temporary demos restarted and verified.\n'
