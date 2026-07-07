#!/usr/bin/env bash
set -euo pipefail

NGINX_CONFIG_PATH="${NGINX_CONFIG_PATH:-/etc/nginx/conf.d/ois-nextgen-product-subdomains.conf}"
CONFIG_MARKER="OIS_NEXTGEN_STAGE_0U_A_PRODUCT_SUBDOMAIN_DEMO"
NO_RELOAD=false
DRY_RUN=false

usage() {
  cat <<'USAGE'
Usage: bash ops/abacus/disable-product-subdomain-demo-routes.sh [--dry-run] [--no-reload]

Removes only the Stage 0U-A managed nginx config:
  /etc/nginx/conf.d/ois-nextgen-product-subdomains.conf

This script does not stop UI demo shells, modify Core API, modify DNS, touch
legacy resources, run migrations, run seed or print secrets.
USAGE
}

for arg in "$@"; do
  case "$arg" in
    --dry-run)
      DRY_RUN=true
      ;;
    --no-reload)
      NO_RELOAD=true
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

fail() {
  printf 'ERROR: %s\n' "$1" >&2
  exit 1
}

printf '%s\n' "Disabling OIS NextGen product subdomain demo nginx routes."
printf '%s\n' "Safety: removes only $NGINX_CONFIG_PATH when it contains the Stage 0U-A marker."
printf '%s\n' "Safety: does not stop UI shells, alter Core API, modify DNS, run migrations, seed, prisma db push, print .env or touch legacy resources."

command -v sudo >/dev/null 2>&1 || fail "sudo is required to inspect/remove nginx config"
command -v nginx >/dev/null 2>&1 || fail "nginx is required on the Abacus VM"

if ! sudo test -f "$NGINX_CONFIG_PATH"; then
  printf '%s\n' "PRODUCT_SUBDOMAIN_ROUTES_ALREADY_DISABLED config file not present."
  exit 0
fi

if ! sudo grep -q "$CONFIG_MARKER" "$NGINX_CONFIG_PATH"; then
  fail "$NGINX_CONFIG_PATH exists but is not a Stage 0U-A managed file"
fi

if [ "$DRY_RUN" = true ]; then
  printf 'PRODUCT_SUBDOMAIN_ROUTES_DRY_RUN would remove %s\n' "$NGINX_CONFIG_PATH"
  exit 0
fi

sudo rm -f "$NGINX_CONFIG_PATH"
sudo nginx -t

if [ "$NO_RELOAD" = true ]; then
  printf '%s\n' "PRODUCT_SUBDOMAIN_ROUTES_REMOVED_NO_RELOAD nginx config removed and remaining config validated; reload skipped by --no-reload."
else
  sudo systemctl reload nginx
  printf '%s\n' "PRODUCT_SUBDOMAIN_ROUTES_DISABLED nginx config removed, remaining config validated and nginx reloaded."
fi
