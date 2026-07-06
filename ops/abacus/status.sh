#!/usr/bin/env bash
set -euo pipefail

SERVICE_NAME="${SERVICE_NAME:-ois-nextgen-core-api}"
REPO_DIR="${REPO_DIR:-/home/ubuntu/ois-nextgen}"
LOCAL_BASE="${LOCAL_BASE:-http://127.0.0.1:4000}"
PUBLIC_BASE="${PUBLIC_BASE:-https://ois-nextgen.abacusai.cloud}"
CURL_TIMEOUT="${CURL_TIMEOUT:-20}"

failures=0

section() {
  printf '\n== %s ==\n' "$1"
}

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
console.log(`OK ${payload.status} ${payload.service} ${payload.stage}`);
NODE
  then
    record_failure "$label health payload mismatch"
    return
  fi
}

print_overview_counts() {
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
if (payload.phaseGates?.PLATFORM_KERNEL !== "IN_PROGRESS") {
  console.error(`unexpected PLATFORM_KERNEL: ${payload.phaseGates?.PLATFORM_KERNEL}`);
  process.exit(1);
}
console.log(`banner=${payload.banner}`);
for (const key of Object.keys(expected)) {
  console.log(`${key}=${payload.kernel[key]}`);
}
console.log(`PLATFORM_KERNEL=${payload.phaseGates.PLATFORM_KERNEL}`);
NODE
  then
    record_failure "$label platform overview payload mismatch"
    return
  fi
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
check_health "local" "$LOCAL_BASE/health"
check_health "public" "$PUBLIC_BASE/health"

section "Platform Overview"
print_overview_counts "local" "$LOCAL_BASE/platform/overview"
print_overview_counts "public" "$PUBLIC_BASE/platform/overview"

if [ "$failures" -gt 0 ]; then
  printf '\nCompleted with %s failure(s).\n' "$failures" >&2
  exit 1
fi

printf '\nStatus checks passed.\n'
