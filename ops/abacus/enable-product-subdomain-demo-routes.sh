#!/usr/bin/env bash
set -euo pipefail

NGINX_CONFIG_PATH="${NGINX_CONFIG_PATH:-/etc/nginx/conf.d/ois-nextgen-product-subdomains.conf}"
OIS_HOST="${OIS_HOST:-ois-ng.dmp247.com}"
PITS_HOST="${PITS_HOST:-pits-ng.dmp247.com}"
OIMA_HOST="${OIMA_HOST:-oima.dmp247.com}"
OIS_UPSTREAM="${OIS_UPSTREAM:-http://127.0.0.1:3000}"
PITS_UPSTREAM="${PITS_UPSTREAM:-http://127.0.0.1:3001}"
OIMA_UPSTREAM="${OIMA_UPSTREAM:-http://127.0.0.1:3002}"
CONFIG_MARKER="OIS_NEXTGEN_STAGE_0U_A_PRODUCT_SUBDOMAIN_DEMO"
NO_RELOAD=false
PRINT_CONFIG_ONLY=false

usage() {
  cat <<'USAGE'
Usage: bash ops/abacus/enable-product-subdomain-demo-routes.sh [--print-config-only] [--no-reload]

Creates /etc/nginx/conf.d/ois-nextgen-product-subdomains.conf with host-based
routes for:
  ois-ng.dmp247.com  -> http://127.0.0.1:3000
  pits-ng.dmp247.com -> http://127.0.0.1:3001
  oima.dmp247.com    -> http://127.0.0.1:3002

This script does not modify DNS, Core API systemd service files, legacy OIS
Phase 1 resources, production domains, migrations, seed data or secrets.
USAGE
}

for arg in "$@"; do
  case "$arg" in
    --print-config-only)
      PRINT_CONFIG_ONLY=true
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

write_config() {
  cat <<EOF
# $CONFIG_MARKER
# Stage 0U-A OIS NextGen product subdomain demo routes.
# DNS CNAME maps hostnames only. Product/path routing happens here in nginx.
# Do not add ois.dmp247.com, oisys.abacusai.app or production/legacy hosts.

server {
    listen 80;
    server_name $OIS_HOST;

    location / {
        proxy_pass $OIS_UPSTREAM;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

server {
    listen 80;
    server_name $PITS_HOST;

    location / {
        proxy_pass $PITS_UPSTREAM;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

server {
    listen 80;
    server_name $OIMA_HOST;

    location / {
        proxy_pass $OIMA_UPSTREAM;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
EOF
}

printf '%s\n' "Preparing OIS NextGen product subdomain demo nginx routes."
printf '%s\n' "Safety: writes only $NGINX_CONFIG_PATH."
printf '%s\n' "Safety: does not touch Core API service files, ois.dmp247.com, oisys.abacusai.app, legacy DBs, migrations, seed, prisma db push, .env or secrets."
printf 'Route: %s -> %s\n' "$OIS_HOST" "$OIS_UPSTREAM"
printf 'Route: %s -> %s\n' "$PITS_HOST" "$PITS_UPSTREAM"
printf 'Route: %s -> %s\n' "$OIMA_HOST" "$OIMA_UPSTREAM"

if [ "$PRINT_CONFIG_ONLY" = true ]; then
  write_config
  exit 0
fi

command -v sudo >/dev/null 2>&1 || fail "sudo is required to write nginx config"
command -v nginx >/dev/null 2>&1 || fail "nginx is required on the Abacus VM"

if sudo test -f "$NGINX_CONFIG_PATH"; then
  if ! sudo grep -q "$CONFIG_MARKER" "$NGINX_CONFIG_PATH"; then
    fail "$NGINX_CONFIG_PATH exists but is not a Stage 0U-A managed file"
  fi
fi

tmp_config="$(mktemp)"
trap 'rm -f "$tmp_config"' EXIT
write_config > "$tmp_config"

sudo install -m 0644 "$tmp_config" "$NGINX_CONFIG_PATH"
sudo nginx -t

if [ "$NO_RELOAD" = true ]; then
  printf '%s\n' "PRODUCT_SUBDOMAIN_ROUTES_CONFIGURED_NO_RELOAD nginx config installed and validated; reload skipped by --no-reload."
else
  sudo systemctl reload nginx
  printf '%s\n' "PRODUCT_SUBDOMAIN_ROUTES_ENABLED nginx config installed, validated and reloaded."
fi

printf '%s\n' "Next: run bash ops/abacus/status-product-subdomain-demo-routes.sh"
