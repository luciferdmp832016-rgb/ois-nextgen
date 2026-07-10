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

report_process() {
  local slug="$1"
  local label="$2"
  local pid_file
  local log_file
  local pid=""

  pid_file="$(ui_demo_pid_file "$slug")"
  log_file="$(ui_demo_log_file "$slug")"

  if ui_demo_pid_running "$pid_file"; then
    pid="$(cat "$pid_file")"
    printf 'UI_DEMO_PROCESS_RUNNING %s pid=%s log=%s\n' "$label" "$pid" "$log_file"
  else
    printf 'UI_DEMO_PROCESS_NOT_RUNNING %s pid_file=%s\n' "$label" "$pid_file"
    record_failure "$label process is not running"
  fi
}

check_local() {
  local label="$1"
  local url="$2"
  local product_code="$3"
  local app_name="$4"

  if ui_demo_check_once "$label" "$url" "$product_code" "$app_name"; then
    printf 'UI_DEMO_LOCAL_READY %s\n' "$UI_CHECK_DETAIL"
  else
    record_failure "$UI_CHECK_DETAIL"
  fi
}

check_preview_if_available() {
  local label="$1"
  local port="$2"
  local product_code="$3"
  local app_name="$4"
  local url=""

  if ! url="$(ui_demo_preview_url_for_port "$port")"; then
    printf 'UI_DEMO_PREVIEW_SKIPPED %s reason=PREVIEW_URL_or_APP_ORIGIN_not_available\n' "$label"
    return 0
  fi

  if ui_demo_check_once "$label" "$url" "$product_code" "$app_name"; then
    printf 'UI_DEMO_PREVIEW_READY %s url=%s\n' "$UI_CHECK_DETAIL" "$url"
  else
    record_failure "$UI_CHECK_DETAIL url=$url"
  fi
}

printf '%s\n' "Checking temporary OIS NextGen UI demo shells."
ui_demo_print_safety

ui_demo_require_repo

printf '\n== Processes ==\n'
report_process "ois-console" "OIS_CONSOLE"
report_process "pits-shell" "PITS_SHELL"
report_process "oima-shell" "OIMA_SHELL"

printf '\n== Local UI Demo Pages ==\n'
check_local "OIS_CONSOLE_LOCAL" "http://127.0.0.1:3000/" "OIS_CONSOLE" "OIS Console"
check_local "PITS_SHELL_LOCAL" "http://127.0.0.1:3001/" "PITS_SHELL" "PITS Shell"
check_local "OIMA_SHELL_LOCAL" "http://127.0.0.1:3002/" "OIMA_APP_SHELL" "OIMA"

printf '\n== Preview Proxy UI Demo Pages ==\n'
check_preview_if_available "OIS_CONSOLE_PREVIEW" "3000" "OIS_CONSOLE" "OIS Console"
check_preview_if_available "PITS_SHELL_PREVIEW" "3001" "PITS_SHELL" "PITS Shell"
check_preview_if_available "OIMA_SHELL_PREVIEW" "3002" "OIMA_APP_SHELL" "OIMA"

if [ "$failures" -gt 0 ]; then
  printf '\nUI_DEMO_STATUS_FAILED failures=%s\n' "$failures" >&2
  exit 1
fi

printf '\nUI_DEMO_STATUS_PASSED OIS Console, PITS Shell and OIMA Shell demo pages are running and reading seeded Core API data.\n'
