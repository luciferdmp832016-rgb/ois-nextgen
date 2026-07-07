#!/usr/bin/env bash

REPO_DIR="${REPO_DIR:-/home/ubuntu/ois-nextgen}"
CORE_API_SERVICE="${CORE_API_SERVICE:-ois-nextgen-core-api}"
OIS_CONSOLE_SERVICE="${OIS_CONSOLE_SERVICE:-ois-nextgen-ois-console}"
PITS_SHELL_SERVICE="${PITS_SHELL_SERVICE:-ois-nextgen-pits-shell}"
CLOUDFLARED_SERVICE="${CLOUDFLARED_SERVICE:-cloudflared}"

CORE_API_URL="${CORE_API_URL:-https://ois-nextgen.abacusai.cloud}"
NEXT_PUBLIC_CORE_API_URL="${NEXT_PUBLIC_CORE_API_URL:-$CORE_API_URL}"
NEXT_TELEMETRY_DISABLED="${NEXT_TELEMETRY_DISABLED:-1}"
CURL_TIMEOUT="${CURL_TIMEOUT:-20}"
UI_DEMO_READY_TIMEOUT="${UI_DEMO_READY_TIMEOUT:-30}"
UI_DEMO_READY_INTERVAL="${UI_DEMO_READY_INTERVAL:-2}"

CORE_API_LOCAL_BASE="${CORE_API_LOCAL_BASE:-http://127.0.0.1:4000}"
OIS_CONSOLE_LOCAL_URL="${OIS_CONSOLE_LOCAL_URL:-http://127.0.0.1:3000}"
PITS_SHELL_LOCAL_URL="${PITS_SHELL_LOCAL_URL:-http://127.0.0.1:3001}"
OIS_CONSOLE_PUBLIC_URL="${OIS_CONSOLE_PUBLIC_URL:-https://ois-ng.dmp247.com}"
PITS_SHELL_PUBLIC_URL="${PITS_SHELL_PUBLIC_URL:-https://pits-ng.dmp247.com}"

PUBLIC_STAGING_DETAIL=""
REGISTRY_PRODUCT_ID=""
REGISTRY_PRODUCT_CODE=""
REGISTRY_WORKSPACE_ID=""
REGISTRY_PROJECT_ID=""
REGISTRY_MODULE_ID=""
REGISTRY_INSTALLATION_ID=""

public_staging_print_safety() {
  printf '%s\n' "Safety: public staging runtime checks/ops only."
  printf '%s\n' "Safety: no migrations, no seed, no prisma db push."
  printf '%s\n' "Safety: no .env, DATABASE_URL, Cloudflare token or secret printing."
  printf '%s\n' "Safety: does not touch ois.dmp247.com, oisys.abacusai.app, legacy DBs or legacy storage."
}

public_staging_require_repo() {
  if [ ! -f "$REPO_DIR/package.json" ] || [ ! -d "$REPO_DIR/apps/ois-console" ] || [ ! -d "$REPO_DIR/apps/pits-shell" ]; then
    printf 'STOP: REPO_DIR does not look like OIS NextGen repo: %s\n' "$REPO_DIR" >&2
    return 1
  fi
}

public_staging_systemctl_active() {
  local service_name="$1"

  systemctl is-active --quiet "$service_name"
}

public_staging_report_service() {
  local service_name="$1"
  local label="$2"

  if ! command -v systemctl >/dev/null 2>&1; then
    PUBLIC_STAGING_DETAIL="$label systemctl not found"
    return 1
  fi

  systemctl status "$service_name" --no-pager --lines=0 || true
  if public_staging_systemctl_active "$service_name"; then
    PUBLIC_STAGING_DETAIL="$label active"
    return 0
  fi

  PUBLIC_STAGING_DETAIL="$label not active"
  return 1
}

public_staging_report_cloudflared_service() {
  local service_name="$1"
  local label="$2"
  local active_state=""

  if ! command -v systemctl >/dev/null 2>&1; then
    PUBLIC_STAGING_DETAIL="$label systemctl not found"
    return 1
  fi

  active_state="$(systemctl is-active "$service_name" 2>/dev/null || true)"
  printf '%s_is_active=%s\n' "$label" "${active_state:-unknown}"
  systemctl show "$service_name" --property=ActiveState,SubState,MainPID,NRestarts --no-pager || true

  if [ "$active_state" = "active" ]; then
    PUBLIC_STAGING_DETAIL="$label active token_safe_status=verified"
    return 0
  fi

  PUBLIC_STAGING_DETAIL="$label not active token_safe_status=verified"
  return 1
}

public_staging_report_port_listener() {
  local port="$1"
  local label="$2"
  local output=""

  printf 'PORT_DIAGNOSTIC %s port=%s\n' "$label" "$port"

  if command -v ss >/dev/null 2>&1; then
    output="$(ss -H -ltn "sport = :$port" 2>/dev/null || true)"
    if [ -n "$output" ]; then
      printf '%s\n' "$output" | sed "s/^/PORT_LISTENER $label /"
      return 0
    fi
    printf 'PORT_LISTENER %s none\n' "$label"
    return 0
  fi

  if command -v netstat >/dev/null 2>&1; then
    output="$(netstat -ltn 2>/dev/null | awk -v p=":$port" '$4 ~ p "$" {print}' || true)"
    if [ -n "$output" ]; then
      printf '%s\n' "$output" | sed "s/^/PORT_LISTENER $label /"
      return 0
    fi
    printf 'PORT_LISTENER %s none\n' "$label"
    return 0
  fi

  printf 'PORT_LISTENER %s unavailable reason=no_ss_or_netstat\n' "$label"
}

public_staging_port_has_listener() {
  local port="$1"
  local output=""

  if command -v ss >/dev/null 2>&1; then
    output="$(ss -H -ltn "sport = :$port" 2>/dev/null || true)"
    [ -n "$output" ]
    return
  fi

  if command -v netstat >/dev/null 2>&1; then
    output="$(netstat -ltn 2>/dev/null | awk -v p=":$port" '$4 ~ p "$" {print}' || true)"
    [ -n "$output" ]
    return
  fi

  if command -v fuser >/dev/null 2>&1; then
    fuser -s "$port/tcp" >/dev/null 2>&1
    return
  fi

  return 1
}

public_staging_http_get_body() {
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
    PUBLIC_STAGING_DETAIL="curl_exit=$curl_exit ${err_text}"
    return 1
  fi
}

public_staging_check_markers_once() {
  local label="$1"
  local url="$2"
  shift 2
  local body=""
  local code=""
  local marker

  if ! public_staging_http_get_body body code "$url"; then
    PUBLIC_STAGING_DETAIL="$label request failed ($PUBLIC_STAGING_DETAIL)"
    return 1
  fi

  if [ "$code" != "200" ]; then
    PUBLIC_STAGING_DETAIL="$label HTTP $code"
    return 1
  fi

  for marker in "$@"; do
    if [[ "$body" != *"$marker"* ]]; then
      PUBLIC_STAGING_DETAIL="$label missing marker: $marker"
      return 1
    fi
  done

  PUBLIC_STAGING_DETAIL="$label HTTP 200 markers=verified"
}

public_staging_check_root_shell_once() {
  local label="$1"
  local url="$2"
  local product_code="$3"
  local app_name="$4"

  if ui_demo_check_once "$label" "$url" "$product_code" "$app_name"; then
    PUBLIC_STAGING_DETAIL="$UI_CHECK_DETAIL"
    return 0
  fi

  PUBLIC_STAGING_DETAIL="$UI_CHECK_DETAIL"
  return 1
}

public_staging_wait_for_root_shell() {
  local ready_label="$1"
  local label="$2"
  local url="$3"
  local product_code="$4"
  local app_name="$5"
  local attempt=1
  local start_seconds="$SECONDS"
  local elapsed=0
  local remaining
  local sleep_for

  while true; do
    if public_staging_check_root_shell_once "$label" "$url" "$product_code" "$app_name"; then
      printf '%s %s\n' "$ready_label" "$PUBLIC_STAGING_DETAIL"
      return 0
    fi

    elapsed=$((SECONDS - start_seconds))
    if [ "$elapsed" -ge "$UI_DEMO_READY_TIMEOUT" ]; then
      printf 'PUBLIC_STAGING_READY_TIMEOUT %s after %ss: %s\n' "$label" "$UI_DEMO_READY_TIMEOUT" "$PUBLIC_STAGING_DETAIL" >&2
      return 1
    fi

    printf 'PUBLIC_STAGING_WARMING_UP %s attempt=%s elapsed=%ss detail=%s\n' "$label" "$attempt" "$elapsed" "$PUBLIC_STAGING_DETAIL"
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

public_staging_wait_for_route() {
  local ready_label="$1"
  local label="$2"
  local url="$3"
  shift 3
  local attempt=1
  local start_seconds="$SECONDS"
  local elapsed=0
  local remaining
  local sleep_for

  while true; do
    if public_staging_check_route_once "$label" "$url" "$@"; then
      printf '%s %s\n' "$ready_label" "$PUBLIC_STAGING_DETAIL"
      return 0
    fi

    elapsed=$((SECONDS - start_seconds))
    if [ "$elapsed" -ge "$UI_DEMO_READY_TIMEOUT" ]; then
      printf 'PUBLIC_STAGING_READY_TIMEOUT %s after %ss: %s\n' "$label" "$UI_DEMO_READY_TIMEOUT" "$PUBLIC_STAGING_DETAIL" >&2
      return 1
    fi

    printf 'PUBLIC_STAGING_WARMING_UP %s attempt=%s elapsed=%ss detail=%s\n' "$label" "$attempt" "$elapsed" "$PUBLIC_STAGING_DETAIL"
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

public_staging_check_route_once() {
  local label="$1"
  local url="$2"
  shift 2

  public_staging_check_markers_once "$label" "$url" "$@"
}

public_staging_discover_registry_ids() {
  local base_url="${1:-$CORE_API_URL}"
  local body=""
  local code=""
  local values=()

  if ! public_staging_http_get_body body code "$base_url/platform/registry"; then
    PUBLIC_STAGING_DETAIL="registry discovery request failed ($PUBLIC_STAGING_DETAIL)"
    return 1
  fi

  if [ "$code" != "200" ]; then
    PUBLIC_STAGING_DETAIL="registry discovery HTTP $code"
    return 1
  fi

  mapfile -t values < <(
    REGISTRY_BODY="$body" node <<'NODE'
const payload = JSON.parse(process.env.REGISTRY_BODY || "{}");
const product = payload.products?.find((item) => item.code === "PITS") || payload.products?.[0];
const workspace = payload.workspaces?.[0];
const project = payload.projects?.find((item) => item.code === "EMERALD_PRECINCT_DEMO") || payload.projects?.[0];
const module = payload.modules?.find((item) => item.code === "PITS_RUNTIME_SHELL") || payload.modules?.[0];
const installation =
  payload.installations?.find((item) => item.projectId === project?.id && item.productCode === product?.code) ||
  payload.installations?.[0];
const values = [product?.id, product?.code, workspace?.id, project?.id, module?.id, installation?.id];
if (values.some((value) => !value)) {
  console.error("missing registry ids for detail checks");
  process.exit(1);
}
for (const value of values) {
  console.log(value);
}
NODE
  )

  if [ "${#values[@]}" -ne 6 ]; then
    PUBLIC_STAGING_DETAIL="registry discovery did not return six ids"
    return 1
  fi

  REGISTRY_PRODUCT_ID="${values[0]}"
  REGISTRY_PRODUCT_CODE="${values[1]}"
  REGISTRY_WORKSPACE_ID="${values[2]}"
  REGISTRY_PROJECT_ID="${values[3]}"
  REGISTRY_MODULE_ID="${values[4]}"
  REGISTRY_INSTALLATION_ID="${values[5]}"
  PUBLIC_STAGING_DETAIL="registry ids discovered product=$REGISTRY_PRODUCT_ID workspace=$REGISTRY_WORKSPACE_ID project=$REGISTRY_PROJECT_ID module=$REGISTRY_MODULE_ID installation=$REGISTRY_INSTALLATION_ID"
}
