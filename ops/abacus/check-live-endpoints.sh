#!/usr/bin/env bash
set -euo pipefail

PUBLIC_BASE="${PUBLIC_BASE:-https://ois-nextgen.abacusai.cloud}"
CURL_TIMEOUT="${CURL_TIMEOUT:-20}"
INCLUDE_LEGACY_READONLY=false

usage() {
  cat <<'USAGE'
Usage: bash ops/abacus/check-live-endpoints.sh [--include-legacy-readonly]

Default checks only active OIS NextGen staging endpoints.
The optional --include-legacy-readonly flag probes legacy endpoints for status only
and labels them LEGACY_DO_NOT_TOUCH.
USAGE
}

for arg in "$@"; do
  case "$arg" in
    --include-legacy-readonly)
      INCLUDE_LEGACY_READONLY=true
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

probe_get_required_200() {
  local label="$1"
  local url="$2"
  local status

  status="$(curl -sS -o /dev/null -w "%{http_code}" --max-time "$CURL_TIMEOUT" "$url" || true)"
  printf '%s GET %s HTTP %s\n' "$label" "$url" "$status"
  if [ "$status" != "200" ]; then
    record_failure "$label expected HTTP 200"
  fi
}

probe_legacy_status() {
  local label="$1"
  local url="$2"
  local status
  local method="HEAD"

  status="$(curl -sS -I -o /dev/null -w "%{http_code}" --max-time "$CURL_TIMEOUT" "$url" || true)"
  if [ "$status" = "000" ] || [ "$status" = "405" ]; then
    method="GET"
    status="$(curl -sS -o /dev/null -w "%{http_code}" --max-time "$CURL_TIMEOUT" "$url" || true)"
  fi
  printf 'LEGACY_DO_NOT_TOUCH %s %s %s HTTP %s\n' "$label" "$method" "$url" "$status"
}

printf '%s\n' "Checking active OIS NextGen staging endpoints only."
printf '%s\n' "This script does not print .env, DATABASE_URL or secrets."
printf '%s\n' "This script does not call write endpoints or /auth/demo-login."

probe_get_required_200 "NEXTGEN_HEALTH" "$PUBLIC_BASE/health"
probe_get_required_200 "NEXTGEN_PLATFORM_OVERVIEW" "$PUBLIC_BASE/platform/overview"

if [ "$INCLUDE_LEGACY_READONLY" = true ]; then
  printf '\n%s\n' "Optional legacy readonly probes requested by owner."
  probe_legacy_status "OIS_PHASE1_APP_SHELL" "https://oisys.abacusai.app"
  probe_legacy_status "OIS_PHASE1_CUSTOM_DOMAIN" "https://ois.dmp247.com"
else
  printf '\n%s\n' "Legacy endpoints were not probed. Use --include-legacy-readonly only with owner approval."
fi

if [ "$failures" -gt 0 ]; then
  printf '\nCompleted with %s failure(s).\n' "$failures" >&2
  exit 1
fi

printf '\nEndpoint checks passed.\n'
