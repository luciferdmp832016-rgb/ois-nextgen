#!/usr/bin/env bash

CURL_TIMEOUT="${CURL_TIMEOUT:-20}"
RESTART_VERIFY_TIMEOUT="${RESTART_VERIFY_TIMEOUT:-30}"
RESTART_VERIFY_INTERVAL="${RESTART_VERIFY_INTERVAL:-2}"

CHECK_DETAIL=""
HTTP_DETAIL=""

http_get_body() {
  local body_var="$1"
  local code_var="$2"
  local url="$3"
  local body_file
  local err_file
  local response_code=""
  local curl_exit=0
  local response_body=""
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
    HTTP_DETAIL="curl_exit=$curl_exit ${err_text}"
    return 1
  fi
}

validate_health_body() {
  local body="${1-}"

  HEALTH_BODY="$body" node <<'NODE'
const payload = JSON.parse(process.env.HEALTH_BODY);
if (payload.status !== "ok" || payload.service !== "core-api" || payload.stage !== "bootstrap-stage-a") {
  console.error(JSON.stringify(payload));
  process.exit(1);
}
NODE
}

validate_overview_body() {
  local body="${1-}"

  OVERVIEW_BODY="$body" node <<'NODE'
const payload = JSON.parse(process.env.OVERVIEW_BODY);
const expected = {
  industries: 1,
  organizations: 1,
  workspaces: 1,
  projects: 2,
  products: 5,
  installations: 2,
  modules: 3,
  auditRecords: 1
};
if (payload.banner !== "DEMO DATA - NOT PRODUCTION") {
  console.error(`unexpected banner: ${payload.banner}`);
  process.exit(1);
}
for (const [key, value] of Object.entries(expected)) {
  if (payload.kernel?.[key] !== value) {
    console.error(`unexpected ${key}: ${payload.kernel?.[key]} expected ${value}`);
    process.exit(1);
  }
}
const expectedGates = {
  PLATFORM_KERNEL: "IN_PROGRESS",
  PITS_BUSINESS_LOGIC: "BLOCKED_BY_PHASE2",
  KNOWLEDGE_PORTING: "BLOCKED_BY_PHASE2",
  FULL_STARTER_DATA: "BLOCKED_BY_PHASE3",
  REGRESSION_CERTIFICATION: "BLOCKED_BY_PHASE3"
};
for (const [key, value] of Object.entries(expectedGates)) {
  if (payload.phaseGates?.[key] !== value) {
    console.error(`unexpected ${key}: ${payload.phaseGates?.[key]} expected ${value}`);
    process.exit(1);
  }
}
NODE
}

check_core_api_health_once() {
  local label="$1"
  local url="$2"
  local body=""
  local code=""

  if ! http_get_body body code "$url"; then
    CHECK_DETAIL="$label /health request failed ($HTTP_DETAIL)"
    return 1
  fi

  if [ "$code" != "200" ]; then
    CHECK_DETAIL="$label /health HTTP $code"
    return 1
  fi

  if ! validate_health_body "$body"; then
    CHECK_DETAIL="$label /health payload mismatch"
    return 1
  fi

  CHECK_DETAIL="$label /health HTTP 200"
}

check_platform_overview_once() {
  local label="$1"
  local url="$2"
  local body=""
  local code=""

  if ! http_get_body body code "$url"; then
    CHECK_DETAIL="$label /platform/overview request failed ($HTTP_DETAIL)"
    return 1
  fi

  if [ "$code" != "200" ]; then
    CHECK_DETAIL="$label /platform/overview HTTP $code"
    return 1
  fi

  if ! validate_overview_body "$body"; then
    CHECK_DETAIL="$label /platform/overview payload mismatch"
    return 1
  fi

  CHECK_DETAIL="$label /platform/overview HTTP 200 seeded counts unchanged"
}

print_platform_overview_once() {
  local label="$1"
  local url="$2"
  local body=""
  local code=""

  if ! http_get_body body code "$url"; then
    CHECK_DETAIL="$label /platform/overview request failed ($HTTP_DETAIL)"
    return 1
  fi

  if [ "$code" != "200" ]; then
    CHECK_DETAIL="$label /platform/overview HTTP $code"
    return 1
  fi

  if ! validate_overview_body "$body"; then
    CHECK_DETAIL="$label /platform/overview payload mismatch"
    return 1
  fi

  OVERVIEW_BODY="$body" node <<'NODE'
const payload = JSON.parse(process.env.OVERVIEW_BODY);
const expected = [
  "industries",
  "organizations",
  "workspaces",
  "projects",
  "products",
  "installations",
  "modules",
  "auditRecords"
];
console.log(`banner=${payload.banner}`);
for (const key of expected) {
  console.log(`${key}=${payload.kernel[key]}`);
}
console.log(`PLATFORM_KERNEL=${payload.phaseGates.PLATFORM_KERNEL}`);
NODE

  CHECK_DETAIL="$label /platform/overview HTTP 200 seeded counts unchanged"
}

wait_for_check() {
  local ready_label="$1"
  local check_label="$2"
  local check_url="$3"
  local check_function="$4"
  local attempt=1
  local start_seconds="$SECONDS"
  local elapsed=0
  local sleep_for
  local remaining

  while true; do
    if "$check_function" "$check_label" "$check_url"; then
      printf '%s %s\n' "$ready_label" "$CHECK_DETAIL"
      return 0
    fi

    elapsed=$((SECONDS - start_seconds))
    if [ "$elapsed" -ge "$RESTART_VERIFY_TIMEOUT" ]; then
      printf 'RESTART_VERIFICATION_TIMEOUT %s after %ss: %s\n' "$check_label" "$RESTART_VERIFY_TIMEOUT" "$CHECK_DETAIL" >&2
      return 1
    fi

    printf 'WARMING_UP %s attempt=%s elapsed=%ss detail=%s\n' "$check_label" "$attempt" "$elapsed" "$CHECK_DETAIL"
    remaining=$((RESTART_VERIFY_TIMEOUT - elapsed))
    sleep_for="$RESTART_VERIFY_INTERVAL"
    if [ "$sleep_for" -gt "$remaining" ]; then
      sleep_for="$remaining"
    fi
    if [ "$sleep_for" -gt 0 ]; then
      sleep "$sleep_for"
    fi
    attempt=$((attempt + 1))
  done
}

wait_for_core_api_restart_ready() {
  local local_base="$1"
  local public_base="$2"

  printf 'WARMING_UP waiting up to %ss for Core API restart readiness; retry interval %ss\n' "$RESTART_VERIFY_TIMEOUT" "$RESTART_VERIFY_INTERVAL"

  wait_for_check "LOCAL_HEALTH_READY" "local" "$local_base/health" check_core_api_health_once || return 1
  wait_for_check "PUBLIC_HEALTH_READY" "public" "$public_base/health" check_core_api_health_once || return 1
  wait_for_check "PLATFORM_OVERVIEW_READY" "local" "$local_base/platform/overview" check_platform_overview_once || return 1
  wait_for_check "PLATFORM_OVERVIEW_READY" "public" "$public_base/platform/overview" check_platform_overview_once || return 1

  printf 'RESTART_VERIFICATION_PASSED Core API restart verification passed after readiness checks.\n'
}
