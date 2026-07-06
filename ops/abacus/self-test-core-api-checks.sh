#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=ops/abacus/lib-core-api-checks.sh
. "$SCRIPT_DIR/lib-core-api-checks.sh"

fake_curl_code="200"
fake_curl_body=""
fake_curl_exit="0"
fake_curl_error=""

curl() {
  local output_file=""

  while [ "$#" -gt 0 ]; do
    case "$1" in
      -o)
        output_file="$2"
        shift 2
        ;;
      -w|--max-time)
        shift 2
        ;;
      -sS)
        shift
        ;;
      *)
        shift
        ;;
    esac
  done

  if [ -n "$output_file" ]; then
    printf '%s' "${fake_curl_body:-}" > "$output_file"
  fi

  if [ "${fake_curl_exit:-0}" -ne 0 ]; then
    printf '%s\n' "${fake_curl_error:-simulated curl failure}" >&2
    printf '%s' "${fake_curl_code:-000}"
    return "$fake_curl_exit"
  fi

  printf '%s' "${fake_curl_code:-200}"
}

assert_pass() {
  local description="$1"
  shift

  if "$@"; then
    printf 'SELF_TEST_PASS %s\n' "$description"
  else
    printf 'SELF_TEST_FAIL %s: %s\n' "$description" "$CHECK_DETAIL" >&2
    exit 1
  fi
}

assert_fail_contains() {
  local description="$1"
  local expected="$2"
  shift 2

  if "$@"; then
    printf 'SELF_TEST_FAIL %s: expected failure containing %s\n' "$description" "$expected" >&2
    exit 1
  fi

  case "$CHECK_DETAIL" in
    *"$expected"*)
      printf 'SELF_TEST_PASS %s\n' "$description"
      ;;
    *)
      printf 'SELF_TEST_FAIL %s: detail=%s expected=%s\n' "$description" "$CHECK_DETAIL" "$expected" >&2
      exit 1
      ;;
  esac
}

health_body='{"status":"ok","service":"core-api","stage":"bootstrap-stage-a"}'
overview_body='{"banner":"DEMO DATA - NOT PRODUCTION","kernel":{"industries":1,"organizations":1,"workspaces":1,"projects":2,"products":5,"installations":2,"modules":3,"auditRecords":1},"phaseGates":{"PLATFORM_KERNEL":"IN_PROGRESS","PITS_BUSINESS_LOGIC":"BLOCKED_BY_PHASE2","KNOWLEDGE_PORTING":"BLOCKED_BY_PHASE2","FULL_STARTER_DATA":"BLOCKED_BY_PHASE3","REGRESSION_CERTIFICATION":"BLOCKED_BY_PHASE3"}}'

fake_curl_code="200"
fake_curl_body="$health_body"
fake_curl_exit="0"
fake_curl_error=""
assert_pass "health 200 body parsing under set -u" check_core_api_health_once "local" "http://example.test/health"

fake_curl_code="502"
fake_curl_body=""
fake_curl_exit="0"
fake_curl_error=""
assert_fail_contains "empty HTTP 502 is clean failure, not unbound variable" "HTTP 502" check_core_api_health_once "public" "http://example.test/health"

fake_curl_code="000"
fake_curl_body=""
fake_curl_exit="28"
fake_curl_error="Operation timed out"
assert_fail_contains "curl timeout is clean failure, not unbound variable" "curl_exit=28" check_core_api_health_once "local" "http://example.test/health"

fake_curl_code="200"
fake_curl_body="$overview_body"
fake_curl_exit="0"
fake_curl_error=""
assert_pass "overview 200 body parsing under set -u" check_platform_overview_once "local" "http://example.test/platform/overview"

printf 'SELF_TEST_PASS lib-core-api-checks no-network parsing checks completed.\n'
