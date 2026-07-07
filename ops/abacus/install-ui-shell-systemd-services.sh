#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="${REPO_DIR:-/home/ubuntu/ois-nextgen}"
BUILD_UI_SHELLS="${BUILD_UI_SHELLS:-true}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=ops/abacus/lib-public-staging-runtime.sh
. "$SCRIPT_DIR/lib-public-staging-runtime.sh"

SYSTEMD_USER="${SYSTEMD_USER:-ubuntu}"
SYSTEMD_DIR="${SYSTEMD_DIR:-/etc/systemd/system}"
SYSTEMD_PATH="${SYSTEMD_PATH:-/home/ubuntu/.local/share/pnpm:/usr/local/bin:/usr/bin:/bin}"

failures=0

record_failure() {
  printf 'FAIL: %s\n' "$1" >&2
  failures=$((failures + 1))
}

write_unit() {
  local service_name="$1"
  local description="$2"
  local working_dir="$3"
  local port="$4"
  local tmp_file

  tmp_file="$(mktemp)"
  cat > "$tmp_file" <<UNIT
[Unit]
Description=$description
After=network-online.target $CORE_API_SERVICE.service
Wants=network-online.target

[Service]
Type=simple
User=$SYSTEMD_USER
WorkingDirectory=$working_dir
Environment=PATH=$SYSTEMD_PATH
Environment=CORE_API_URL=$CORE_API_URL
Environment=NEXT_PUBLIC_CORE_API_URL=$NEXT_PUBLIC_CORE_API_URL
Environment=NEXT_TELEMETRY_DISABLED=$NEXT_TELEMETRY_DISABLED
Environment=PORT=$port
ExecStart=/usr/bin/env pnpm start
Restart=on-failure
RestartSec=5
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
UNIT

  printf 'SYSTEMD_UNIT_WRITE %s -> %s/%s.service\n' "$service_name" "$SYSTEMD_DIR" "$service_name"
  sudo install -m 0644 "$tmp_file" "$SYSTEMD_DIR/$service_name.service"
  rm -f "$tmp_file"
}

printf '%s\n' "Installing durable OIS NextGen UI shell systemd services."
public_staging_print_safety
printf '%s\n' "Safety: sudo is used only for systemd unit writing, daemon-reload, enable and start."
printf '%s\n' "Safety: UI service units do not set DATABASE_URL or ABACUS_DATABASE_URL."
printf '%s\n' "Safety: Core API and cloudflared service definitions are not modified."

public_staging_require_repo

if [ ! -x /usr/bin/env ]; then
  printf '%s\n' "STOP: /usr/bin/env not available for systemd ExecStart." >&2
  exit 1
fi

cd "$REPO_DIR"

if [ "$BUILD_UI_SHELLS" = "true" ]; then
  printf '%s\n' "UI_SYSTEMD_BUILD_START OIS Console and PITS Shell"
  env -u DATABASE_URL -u ABACUS_DATABASE_URL \
    CORE_API_URL="$CORE_API_URL" \
    NEXT_PUBLIC_CORE_API_URL="$NEXT_PUBLIC_CORE_API_URL" \
    NEXT_TELEMETRY_DISABLED="$NEXT_TELEMETRY_DISABLED" \
    pnpm --filter @ois/ois-console build
  env -u DATABASE_URL -u ABACUS_DATABASE_URL \
    CORE_API_URL="$CORE_API_URL" \
    NEXT_PUBLIC_CORE_API_URL="$NEXT_PUBLIC_CORE_API_URL" \
    NEXT_TELEMETRY_DISABLED="$NEXT_TELEMETRY_DISABLED" \
    pnpm --filter @ois/pits-shell build
  printf '%s\n' "UI_SYSTEMD_BUILD_PASSED"
else
  printf '%s\n' "UI_SYSTEMD_BUILD_SKIPPED BUILD_UI_SHELLS=false"
fi

write_unit "$OIS_CONSOLE_SERVICE" "OIS NextGen OIS Console public staging shell" "$REPO_DIR/apps/ois-console" "3000"
write_unit "$PITS_SHELL_SERVICE" "OIS NextGen PITS Shell public staging shell" "$REPO_DIR/apps/pits-shell" "3001"

sudo systemctl daemon-reload
sudo systemctl enable --now "$OIS_CONSOLE_SERVICE"
sudo systemctl enable --now "$PITS_SHELL_SERVICE"

if ! public_staging_systemctl_active "$OIS_CONSOLE_SERVICE"; then
  record_failure "$OIS_CONSOLE_SERVICE did not become active"
fi

if ! public_staging_systemctl_active "$PITS_SHELL_SERVICE"; then
  record_failure "$PITS_SHELL_SERVICE did not become active"
fi

if [ "$failures" -gt 0 ]; then
  printf '\nUI_SYSTEMD_INSTALL_FAILED failures=%s\n' "$failures" >&2
  exit 1
fi

printf '\nUI_SYSTEMD_INSTALL_PASSED durable OIS Console and PITS Shell services are enabled and active.\n'
printf '%s\n' "Run: bash ops/abacus/status-public-staging-runtime.sh"
