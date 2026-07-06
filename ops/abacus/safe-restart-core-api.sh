#!/usr/bin/env bash
set -euo pipefail

SERVICE_NAME="${SERVICE_NAME:-ois-nextgen-core-api}"
LOCAL_BASE="${LOCAL_BASE:-http://127.0.0.1:4000}"
PUBLIC_BASE="${PUBLIC_BASE:-https://ois-nextgen.abacusai.cloud}"
CURL_TIMEOUT="${CURL_TIMEOUT:-20}"

failures=0

record_failure() {
  printf 'FAIL: %s\n' "$1" >&2
  failures=$((failures + 1))
}

check_health() {
  local label="$1"
  local url="$2"
  local body

  if ! body="$(curl -fsS --max-time "$CURL_TIMEOUT" "$url")"; then
    record_failure "$label health request failed"
    return
  fi

  if ! HEALTH_BODY="$body" node <<'NODE'
const payload = JSON.parse(process.env.HEALTH_BODY);
if (payload.status !== "ok" || payload.service !== "core-api" || payload.stage !== "bootstrap-stage-a") {
  console.error(JSON.stringify(payload));
  process.exit(1);
}
NODE
  then
    record_failure "$label health payload mismatch"
  else
    printf 'OK %s /health\n' "$label"
  fi
}

check_overview() {
  local label="$1"
  local url="$2"
  local body

  if ! body="$(curl -fsS --max-time "$CURL_TIMEOUT" "$url")"; then
    record_failure "$label platform overview request failed"
    return
  fi

  if ! OVERVIEW_BODY="$body" node <<'NODE'
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
  then
    record_failure "$label platform overview payload mismatch"
  else
    printf 'OK %s /platform/overview seeded counts unchanged\n' "$label"
  fi
}

printf '%s\n' "Restarting $SERVICE_NAME."
printf '%s\n' "Safety: no migrations, no seed, no prisma db push, no nginx/systemd unit modification."
printf '%s\n' "Safety: does not print .env, DATABASE_URL or secrets."

sudo systemctl restart "$SERVICE_NAME"
sudo systemctl is-active --quiet "$SERVICE_NAME" || record_failure "$SERVICE_NAME is not active after restart"
systemctl status "$SERVICE_NAME" --no-pager --lines=0 || true

check_health "local" "$LOCAL_BASE/health"
check_health "public" "$PUBLIC_BASE/health"
check_overview "local" "$LOCAL_BASE/platform/overview"
check_overview "public" "$PUBLIC_BASE/platform/overview"

if [ "$failures" -gt 0 ]; then
  printf '\nRestart verification completed with %s failure(s).\n' "$failures" >&2
  exit 1
fi

printf '\nCore API restart verification passed.\n'
