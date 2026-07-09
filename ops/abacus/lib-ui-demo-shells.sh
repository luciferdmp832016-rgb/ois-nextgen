#!/usr/bin/env bash

CORE_API_URL="${CORE_API_URL:-https://ois-nextgen.abacusai.cloud}"
NEXT_PUBLIC_CORE_API_URL="${NEXT_PUBLIC_CORE_API_URL:-$CORE_API_URL}"
NEXT_TELEMETRY_DISABLED="${NEXT_TELEMETRY_DISABLED:-1}"
CURL_TIMEOUT="${CURL_TIMEOUT:-20}"
UI_DEMO_READY_TIMEOUT="${UI_DEMO_READY_TIMEOUT:-45}"
UI_DEMO_READY_INTERVAL="${UI_DEMO_READY_INTERVAL:-2}"
UI_DEMO_DIR="${UI_DEMO_DIR:-${REPO_DIR:-/home/ubuntu/ois-nextgen}/.abacus-ui-demo}"

UI_HTTP_DETAIL=""
UI_CHECK_DETAIL=""

ui_demo_print_safety() {
  printf '%s\n' "Safety: temporary UI demo process management only."
  printf '%s\n' "Safety: no migrations, no seed, no prisma db push, no Core API service changes, no nginx changes."
  printf '%s\n' "Safety: no .env, DATABASE_URL or secret printing; UI shells receive no DATABASE_URL."
  printf '%s\n' "Safety: does not touch dmp247.com, oisys.abacusai.app, OIS Phase 1, Emerald/BQL or legacy storage prefixes."
}

ui_demo_require_repo() {
  if [ ! -f "$REPO_DIR/package.json" ] || [ ! -d "$REPO_DIR/apps/ois-console" ] || [ ! -d "$REPO_DIR/apps/pits-shell" ]; then
    printf 'STOP: REPO_DIR does not look like OIS NextGen repo: %s\n' "$REPO_DIR" >&2
    return 1
  fi
}

ui_demo_prepare_dir() {
  mkdir -p "$UI_DEMO_DIR"
}

ui_demo_pid_file() {
  printf '%s/%s.pid' "$UI_DEMO_DIR" "$1"
}

ui_demo_log_file() {
  printf '%s/%s.log' "$UI_DEMO_DIR" "$1"
}

ui_demo_pid_running() {
  local pid_file="$1"
  local pid=""

  if [ ! -f "$pid_file" ]; then
    return 1
  fi

  pid="$(cat "$pid_file" 2>/dev/null || true)"
  if [ -z "$pid" ]; then
    return 1
  fi

  kill -0 "$pid" >/dev/null 2>&1
}

ui_demo_build_shell() {
  local package_name="$1"
  local label="$2"

  printf 'UI_DEMO_BUILD_START %s package=%s\n' "$label" "$package_name"
  (
    cd "$REPO_DIR"
    env -u DATABASE_URL -u ABACUS_DATABASE_URL \
      CORE_API_URL="$CORE_API_URL" \
      NEXT_PUBLIC_CORE_API_URL="$NEXT_PUBLIC_CORE_API_URL" \
      NEXT_TELEMETRY_DISABLED="$NEXT_TELEMETRY_DISABLED" \
      pnpm --filter "$package_name" build
  )
  printf 'UI_DEMO_BUILD_PASSED %s\n' "$label"
}

ui_demo_start_shell() {
  local slug="$1"
  local label="$2"
  local package_name="$3"
  local port="$4"
  local pid_file
  local log_file
  local pid=""

  ui_demo_prepare_dir
  pid_file="$(ui_demo_pid_file "$slug")"
  log_file="$(ui_demo_log_file "$slug")"

  if ui_demo_pid_running "$pid_file"; then
    pid="$(cat "$pid_file")"
    printf 'UI_DEMO_ALREADY_RUNNING %s pid=%s port=%s log=%s\n' "$label" "$pid" "$port" "$log_file"
    return 0
  fi

  rm -f "$pid_file"
  printf 'UI_DEMO_STARTING %s package=%s port=%s mode=temporary_nohup log=%s\n' "$label" "$package_name" "$port" "$log_file"
  (
    cd "$REPO_DIR"
    exec nohup env -u DATABASE_URL -u ABACUS_DATABASE_URL \
      CORE_API_URL="$CORE_API_URL" \
      NEXT_PUBLIC_CORE_API_URL="$NEXT_PUBLIC_CORE_API_URL" \
      NEXT_TELEMETRY_DISABLED="$NEXT_TELEMETRY_DISABLED" \
      PORT="$port" \
      pnpm --filter "$package_name" start
  ) >"$log_file" 2>&1 &
  pid="$!"
  printf '%s\n' "$pid" > "$pid_file"
  printf 'UI_DEMO_STARTED %s pid=%s port=%s log=%s\n' "$label" "$pid" "$port" "$log_file"
}

ui_demo_stop_shell() {
  local slug="$1"
  local label="$2"
  local pid_file
  local pid=""
  local waited=0

  pid_file="$(ui_demo_pid_file "$slug")"

  if [ ! -f "$pid_file" ]; then
    printf 'UI_DEMO_STOP_SKIPPED %s reason=no_pid_file\n' "$label"
    return 0
  fi

  pid="$(cat "$pid_file" 2>/dev/null || true)"
  if [ -z "$pid" ] || ! kill -0 "$pid" >/dev/null 2>&1; then
    rm -f "$pid_file"
    printf 'UI_DEMO_STOP_SKIPPED %s reason=not_running\n' "$label"
    return 0
  fi

  printf 'UI_DEMO_STOPPING %s pid=%s\n' "$label" "$pid"
  kill "$pid" >/dev/null 2>&1 || true

  while kill -0 "$pid" >/dev/null 2>&1; do
    if [ "$waited" -ge 20 ]; then
      printf 'UI_DEMO_STOP_TIMEOUT %s pid=%s\n' "$label" "$pid" >&2
      return 1
    fi
    sleep 1
    waited=$((waited + 1))
  done

  rm -f "$pid_file"
  printf 'UI_DEMO_STOPPED %s pid=%s\n' "$label" "$pid"
}

ui_demo_http_get_body() {
  local body_var="$1"
  local code_var="$2"
  local url="$3"
  local body_file
  local err_file
  local response_code=""
  local response_body=""
  local curl_exit=0
  local err_text=""
  local errexit_was_set=false

  body_file="$(mktemp)"
  err_file="$(mktemp)"

  case "$-" in
    *e*)
      errexit_was_set=true
      set +e
      ;;
  esac

  response_code="$(curl -sS --max-time "$CURL_TIMEOUT" -o "$body_file" -w "%{http_code}" "$url" 2>"$err_file")"
  curl_exit=$?

  if [ "$errexit_was_set" = true ]; then
    set -e
  fi

  if [ -f "$body_file" ]; then
    response_body="$(cat "$body_file")"
  fi

  if [ "$curl_exit" -ne 0 ] && [ -f "$err_file" ]; then
    err_text="$(tr '\n' ' ' < "$err_file" | sed 's/[[:space:]]*$//')"
  fi

  rm -f "$body_file" "$err_file"

  printf -v "$body_var" '%s' "$response_body"
  printf -v "$code_var" '%s' "${response_code:-000}"

  if [ "$curl_exit" -ne 0 ]; then
    UI_HTTP_DETAIL="curl_exit=$curl_exit ${err_text}"
    return 1
  fi
}

ui_demo_validate_body() {
  local body="${1-}"
  local label="$2"
  local product_code="$3"
  local app_name="$4"

  UI_BODY="$body" UI_LABEL="$label" UI_PRODUCT_CODE="$product_code" UI_APP_NAME="$app_name" UI_CORE_API_URL="$CORE_API_URL" node <<'NODE'
const body = process.env.UI_BODY || "";
const label = process.env.UI_LABEL;
const productCode = process.env.UI_PRODUCT_CODE;
const appName = process.env.UI_APP_NAME;
const coreApiUrl = process.env.UI_CORE_API_URL;
const markers = [
  appName,
  productCode,
  coreApiUrl,
  "DEMO DATA - NOT PRODUCTION",
  "Platform Overview Counts",
  "Core API"
];
for (const marker of markers) {
  if (!body.includes(marker)) {
    console.error(`${label} missing marker: ${marker}`);
    process.exit(1);
  }
}
const minimumCounts = {
  industries: 1,
  organizations: 1,
  workspaces: 1,
  projects: 2,
  products: 5,
  installations: 2,
  modules: 3,
  auditRecords: 1
};
for (const [field, minimum] of Object.entries(minimumCounts)) {
  const pattern = new RegExp(`${field}[\\s\\S]{0,240}?>(\\d+)<`, "i");
  const match = body.match(pattern);
  const value = match ? Number.parseInt(match[1], 10) : Number.NaN;
  if (!Number.isInteger(value) || value < minimum) {
    console.error(`${label} missing seeded count ${field}>=${minimum}; found ${Number.isNaN(value) ? "none" : value}`);
    process.exit(1);
  }
}
NODE
}

ui_demo_check_once() {
  local label="$1"
  local url="$2"
  local product_code="$3"
  local app_name="$4"
  local body=""
  local code=""

  if ! ui_demo_http_get_body body code "$url"; then
    UI_CHECK_DETAIL="$label request failed ($UI_HTTP_DETAIL)"
    return 1
  fi

  if [ "$code" != "200" ]; then
    UI_CHECK_DETAIL="$label HTTP $code"
    return 1
  fi

  if ! ui_demo_validate_body "$body" "$label" "$product_code" "$app_name"; then
    UI_CHECK_DETAIL="$label payload marker/count mismatch"
    return 1
  fi

  UI_CHECK_DETAIL="$label HTTP 200 product=$product_code core_api=$CORE_API_URL seeded_count_minimums=verified"
}

ui_demo_wait_for_local() {
  local ready_label="$1"
  local check_label="$2"
  local url="$3"
  local product_code="$4"
  local app_name="$5"
  local attempt=1
  local start_seconds="$SECONDS"
  local elapsed=0
  local remaining
  local sleep_for

  while true; do
    if ui_demo_check_once "$check_label" "$url" "$product_code" "$app_name"; then
      printf '%s %s\n' "$ready_label" "$UI_CHECK_DETAIL"
      return 0
    fi

    elapsed=$((SECONDS - start_seconds))
    if [ "$elapsed" -ge "$UI_DEMO_READY_TIMEOUT" ]; then
      printf 'UI_DEMO_READY_TIMEOUT %s after %ss: %s\n' "$check_label" "$UI_DEMO_READY_TIMEOUT" "$UI_CHECK_DETAIL" >&2
      return 1
    fi

    printf 'UI_DEMO_WARMING_UP %s attempt=%s elapsed=%ss detail=%s\n' "$check_label" "$attempt" "$elapsed" "$UI_CHECK_DETAIL"
    remaining=$((UI_DEMO_READY_TIMEOUT - elapsed))
    sleep_for="$UI_DEMO_READY_INTERVAL"
    if [ "$sleep_for" -gt "$remaining" ]; then
      sleep_for="$remaining"
    fi
    if [ "$sleep_for" -gt 0 ]; then
      sleep "$sleep_for"
    fi
    attempt=$((attempt + 1))
  done
}

ui_demo_preview_url_for_port() {
  local port="$1"
  local base="${PREVIEW_URL:-${APP_ORIGIN:-}}"
  local scheme
  local rest
  local host
  local path=""
  local first_label
  local host_suffix

  if [ -z "$base" ]; then
    return 1
  fi

  base="${base%/}"
  case "$base" in
    http://*|https://*) ;;
    *)
      return 1
      ;;
  esac

  scheme="${base%%://*}://"
  rest="${base#*://}"
  host="${rest%%/*}"
  if [ "$host" != "$rest" ]; then
    path="/${rest#*/}"
  fi

  first_label="${host%%.*}"
  if [ "$first_label" = "$host" ]; then
    return 1
  fi
  host_suffix="${host#*.}"

  printf '%s%s-%s.%s%s\n' "$scheme" "$first_label" "$port" "$host_suffix" "$path"
}
