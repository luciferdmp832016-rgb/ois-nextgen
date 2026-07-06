#!/usr/bin/env bash
set -euo pipefail

SERVICE_NAME="${SERVICE_NAME:-ois-nextgen-core-api}"
LOCAL_BASE="${LOCAL_BASE:-http://127.0.0.1:4000}"
PUBLIC_BASE="${PUBLIC_BASE:-https://ois-nextgen.abacusai.cloud}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=ops/abacus/lib-core-api-checks.sh
. "$SCRIPT_DIR/lib-core-api-checks.sh"

failures=0

record_failure() {
  printf 'FAIL: %s\n' "$1" >&2
  failures=$((failures + 1))
}

printf '%s\n' "Restarting $SERVICE_NAME."
printf '%s\n' "Safety: no migrations, no seed, no prisma db push, no nginx/systemd unit modification."
printf '%s\n' "Safety: does not print .env, DATABASE_URL or secrets."
printf 'Restart verification grace: waits up to %ss, retrying every %ss. Temporary connection failures or HTTP 502 are treated as WARMING_UP until timeout.\n' "$RESTART_VERIFY_TIMEOUT" "$RESTART_VERIFY_INTERVAL"

sudo systemctl restart "$SERVICE_NAME"
sudo systemctl is-active --quiet "$SERVICE_NAME" || record_failure "$SERVICE_NAME is not active after restart"
systemctl status "$SERVICE_NAME" --no-pager --lines=0 || true

if ! wait_for_core_api_restart_ready "$LOCAL_BASE" "$PUBLIC_BASE"; then
  record_failure "Core API restart readiness timeout"
fi

if [ "$failures" -gt 0 ]; then
  printf '\nRestart verification completed with %s failure(s).\n' "$failures" >&2
  exit 1
fi

printf '\nCore API restart verification completed.\n'
