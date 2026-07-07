#!/usr/bin/env bash
set -euo pipefail

OIS_HOST="${OIS_HOST:-ois-ng.dmp247.com}"
PITS_HOST="${PITS_HOST:-pits-ng.dmp247.com}"
CURL_TIMEOUT="${CURL_TIMEOUT:-20}"
CHECK_PUBLIC=false
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=ops/abacus/lib-ui-demo-shells.sh
. "$SCRIPT_DIR/lib-ui-demo-shells.sh"

usage() {
  cat <<'USAGE'
Usage: bash ops/abacus/status-product-subdomain-demo-routes.sh [--include-public]

Default mode checks local nginx host-header routing before DNS:
  Host: ois-ng.dmp247.com  -> http://127.0.0.1/
  Host: pits-ng.dmp247.com -> http://127.0.0.1/

Use --include-public only after owner-configured DNS is in place. Public checks
probe:
  https://ois-ng.dmp247.com
  https://pits-ng.dmp247.com
  https://ois-ng.dmp247.com/dashboard
  https://pits-ng.dmp247.com/projects

This script does not modify nginx, DNS, Core API, UI shell processes, DB, seed
data, .env files or legacy resources.
USAGE
}

for arg in "$@"; do
  case "$arg" in
    --include-public)
      CHECK_PUBLIC=true
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
PRODUCT_ROUTE_DETAIL=""

record_failure() {
  printf 'FAIL: %s\n' "$1" >&2
  failures=$((failures + 1))
}

http_get_body() {
  local body_var="$1"
  local code_var="$2"
  local detail_var="$3"
  shift 3
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

  response_code="$(curl -sS --max-time "$CURL_TIMEOUT" -o "$body_file" -w "%{http_code}" "$@" 2>"$err_file")"
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
  printf -v "$detail_var" '%s' "curl_exit=$curl_exit code=${response_code:-000} ${err_text}"

  if [ "$curl_exit" -ne 0 ]; then
    return 1
  fi
}

check_product_response() {
  local label="$1"
  local product_code="$2"
  local app_name="$3"
  local body="${4-}"

  if ! ui_demo_validate_body "$body" "$label" "$product_code" "$app_name"; then
    PRODUCT_ROUTE_DETAIL="$label payload marker/count mismatch"
    return 1
  fi

  PRODUCT_ROUTE_DETAIL="$label HTTP 200 product=$product_code core_api=$CORE_API_URL seeded_counts=verified"
}

check_product_url() {
  local label="$1"
  local product_code="$2"
  local app_name="$3"
  shift 3
  local body=""
  local code=""
  local detail=""

  if ! http_get_body body code detail "$@"; then
    PRODUCT_ROUTE_DETAIL="$label request failed ($detail)"
    return 1
  fi

  if [ "$code" != "200" ]; then
    PRODUCT_ROUTE_DETAIL="$label HTTP $code"
    return 1
  fi

  check_product_response "$label" "$product_code" "$app_name" "$body"
}

check_local_host_header() {
  local label="$1"
  local host="$2"
  local product_code="$3"
  local app_name="$4"

  if check_product_url "$label" "$product_code" "$app_name" -H "Host: $host" "http://127.0.0.1/"; then
    printf 'PRODUCT_SUBDOMAIN_LOCAL_READY %s host=%s %s\n' "$label" "$host" "$PRODUCT_ROUTE_DETAIL"
  else
    record_failure "$PRODUCT_ROUTE_DETAIL host=$host"
  fi
}

check_http_200() {
  local label="$1"
  local url="$2"
  local body=""
  local code=""
  local detail=""

  if ! http_get_body body code detail "$url"; then
    PRODUCT_ROUTE_DETAIL="$label request failed ($detail)"
    return 1
  fi

  if [ "$code" != "200" ]; then
    PRODUCT_ROUTE_DETAIL="$label HTTP $code"
    return 1
  fi

  PRODUCT_ROUTE_DETAIL="$label HTTP 200"
}

check_public_product_root() {
  local label="$1"
  local host="$2"
  local product_code="$3"
  local app_name="$4"
  local https_detail=""
  local http_detail=""

  if check_product_url "${label}_HTTPS_ROOT" "$product_code" "$app_name" "https://$host/"; then
    printf 'PRODUCT_SUBDOMAIN_PUBLIC_READY %s host=%s %s\n' "$label" "$host" "$PRODUCT_ROUTE_DETAIL"
    return 0
  fi

  https_detail="$PRODUCT_ROUTE_DETAIL"

  if check_product_url "${label}_HTTP_ROOT" "$product_code" "$app_name" "http://$host/"; then
    printf 'CUSTOM_SUBDOMAIN_HTTP_OK_TLS_BLOCKED %s host=%s https_detail="%s" http_detail="%s"\n' "$label" "$host" "$https_detail" "$PRODUCT_ROUTE_DETAIL" >&2
    record_failure "$label HTTPS failed while HTTP passed"
    return 1
  fi

  http_detail="$PRODUCT_ROUTE_DETAIL"

  case "$https_detail $http_detail" in
    *"HTTP 403"*|*"HTTP 404"*|*"HTTP 421"*|*"HTTP 502"*)
      printf 'CUSTOM_SUBDOMAIN_BLOCKED_BY_ABACUS_EDGE %s host=%s https_detail="%s" http_detail="%s"\n' "$label" "$host" "$https_detail" "$http_detail" >&2
      ;;
    *)
      printf 'CUSTOM_SUBDOMAIN_TLS_BLOCKED %s host=%s https_detail="%s" http_detail="%s"\n' "$label" "$host" "$https_detail" "$http_detail" >&2
      ;;
  esac

  record_failure "$label public root did not validate"
}

check_public_path() {
  local label="$1"
  local url="$2"

  if check_http_200 "$label" "$url"; then
    printf 'PRODUCT_SUBDOMAIN_PUBLIC_PATH_READY %s url=%s\n' "$label" "$url"
  else
    record_failure "$PRODUCT_ROUTE_DETAIL url=$url"
  fi
}

printf '%s\n' "Checking OIS NextGen product subdomain demo routes."
printf '%s\n' "Safety: read-only status only; no nginx, DNS, Core API, DB, seed, .env or legacy resource changes."
printf '%s\n' "DNS note: CNAME maps hostnames only. Path/product routing belongs to nginx/app config."

printf '\n== Local host-header routing before DNS ==\n'
check_local_host_header "OIS_CONSOLE_LOCAL_HOST_HEADER" "$OIS_HOST" "OIS_CONSOLE" "OIS Console"
check_local_host_header "PITS_SHELL_LOCAL_HOST_HEADER" "$PITS_HOST" "PITS_SHELL" "PITS Shell"

if [ "$CHECK_PUBLIC" = true ]; then
  printf '\n== Public custom subdomain checks after DNS ==\n'
  check_public_product_root "OIS_CONSOLE_PUBLIC" "$OIS_HOST" "OIS_CONSOLE" "OIS Console"
  check_public_product_root "PITS_SHELL_PUBLIC" "$PITS_HOST" "PITS_SHELL" "PITS Shell"
  check_public_path "OIS_CONSOLE_PUBLIC_DASHBOARD" "https://$OIS_HOST/dashboard"
  check_public_path "PITS_SHELL_PUBLIC_PROJECTS" "https://$PITS_HOST/projects"
else
  printf '\nPRODUCT_SUBDOMAIN_PUBLIC_SKIPPED reason=run_with_--include-public_after_owner_dns_is_configured\n'
fi

if [ "$failures" -gt 0 ]; then
  printf '\nPRODUCT_SUBDOMAIN_STATUS_FAILED failures=%s\n' "$failures" >&2
  exit 1
fi

if [ "$CHECK_PUBLIC" = true ]; then
  printf '\nSUPERCOMPUTER_PRODUCT_SUBDOMAIN_PUBLIC_DEMO_VERIFIED OIS and PITS public custom subdomains are serving expected product shells.\n'
else
  printf '\nSUPERCOMPUTER_PRODUCT_SUBDOMAIN_LOCAL_ROUTING_READY OIS and PITS local host-header routing is ready for DNS/CNAME setup.\n'
fi
