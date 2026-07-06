#!/usr/bin/env bash
set -euo pipefail

SERVICE_NAME="${SERVICE_NAME:-ois-nextgen-core-api}"
SYSTEMD_UNIT="${SYSTEMD_UNIT:-/etc/systemd/system/ois-nextgen-core-api.service}"
NGINX_VHOST="${NGINX_VHOST:-/etc/nginx/conf.d/ois-nextgen.conf}"

usage() {
  cat <<'USAGE'
Usage: bash ops/abacus/rollback-core-api-nginx-poc.sh [--confirm-rollback]

Without --confirm-rollback this script prints the rollback plan and exits without action.
With --confirm-rollback it stops/disables the Core API systemd service, removes the
Stage 0O systemd unit and nginx vhost, validates nginx config, and reloads nginx.
USAGE
}

CONFIRM_ROLLBACK=false
for arg in "$@"; do
  case "$arg" in
    --confirm-rollback)
      CONFIRM_ROLLBACK=true
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

cat <<PLAN
ROLLBACK PLAN - Stage 0O Core API nginx/systemd POC

This is destructive for the OIS NextGen Core API staging POC only.
It should make https://ois-nextgen.abacusai.cloud revert to the Abacus default READY page.

Planned actions:
- stop $SERVICE_NAME
- disable $SERVICE_NAME
- remove $SYSTEMD_UNIT
- run systemctl daemon-reload
- remove $NGINX_VHOST
- run nginx -t
- reload nginx

Safety:
- does not print .env, DATABASE_URL or secrets
- does not run migrations
- does not run seed
- does not run prisma db push
- does not touch ois.dmp247.com or oisys.abacusai.app
- does not touch legacy DBs or storage prefixes
PLAN

if [ "$CONFIRM_ROLLBACK" != true ]; then
  printf '\nNo action taken. Re-run with --confirm-rollback to execute the rollback.\n' >&2
  exit 1
fi

printf '\nExecuting rollback because --confirm-rollback was provided.\n'

sudo systemctl stop "$SERVICE_NAME" || true
sudo systemctl disable "$SERVICE_NAME" || true
sudo rm -f "$SYSTEMD_UNIT"
sudo systemctl daemon-reload
sudo rm -f "$NGINX_VHOST"
sudo nginx -t
sudo systemctl reload nginx

printf '\nRollback executed. Verify the public domain before continuing any staging work.\n'
