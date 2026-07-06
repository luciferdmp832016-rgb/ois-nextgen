#!/usr/bin/env bash
set -euo pipefail

SERVICE_NAME="${SERVICE_NAME:-ois-nextgen-core-api}"
REPO_DIR="${REPO_DIR:-/home/ubuntu/ois-nextgen}"
LOCAL_BASE="${LOCAL_BASE:-http://127.0.0.1:4000}"
PUBLIC_BASE="${PUBLIC_BASE:-https://ois-nextgen.abacusai.cloud}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=ops/abacus/lib-core-api-checks.sh
. "$SCRIPT_DIR/lib-core-api-checks.sh"

failures=0

section() {
  printf '\n== %s ==\n' "$1"
}

record_failure() {
  printf 'FAIL: %s\n' "$1" >&2
  failures=$((failures + 1))
}

section "Safety"
printf '%s\n' "Read-only status script. Does not print .env, DATABASE_URL or secrets."
printf '%s\n' "Does not run migrations, seed, prisma db push, write endpoints or /auth/demo-login."

section "Repository"
cd "$REPO_DIR"
printf 'repo=%s\n' "$REPO_DIR"
printf 'branch=%s\n' "$(git branch --show-current)"
printf 'commit=%s\n' "$(git rev-parse HEAD)"
printf '%s\n' "working_tree_status:"
git status --short

section "Systemd"
if command -v systemctl >/dev/null 2>&1; then
  systemctl status "$SERVICE_NAME" --no-pager --lines=0 || record_failure "systemd status unavailable"
else
  record_failure "systemctl not found"
fi

section "Health"
if check_core_api_health_once "local" "$LOCAL_BASE/health"; then
  printf 'OK %s\n' "$CHECK_DETAIL"
else
  record_failure "$CHECK_DETAIL"
fi

if check_core_api_health_once "public" "$PUBLIC_BASE/health"; then
  printf 'OK %s\n' "$CHECK_DETAIL"
else
  record_failure "$CHECK_DETAIL"
fi

section "Platform Overview"
if print_platform_overview_once "local" "$LOCAL_BASE/platform/overview"; then
  printf 'OK %s\n' "$CHECK_DETAIL"
else
  record_failure "$CHECK_DETAIL"
fi

if print_platform_overview_once "public" "$PUBLIC_BASE/platform/overview"; then
  printf 'OK %s\n' "$CHECK_DETAIL"
else
  record_failure "$CHECK_DETAIL"
fi

if [ "$failures" -gt 0 ]; then
  printf '\nCompleted with %s failure(s).\n' "$failures" >&2
  exit 1
fi

printf '\nStatus checks passed.\n'
