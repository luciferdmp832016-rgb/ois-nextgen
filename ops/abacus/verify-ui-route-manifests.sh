#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="${REPO_DIR:-/home/ubuntu/ois-nextgen}"

failures=0

record_failure() {
  printf 'FAIL: %s\n' "$1" >&2
  failures=$((failures + 1))
}

check_required_path() {
  local path="$1"
  local label="$2"

  if [ ! -e "$path" ]; then
    record_failure "$label missing: $path"
    return 1
  fi

  return 0
}

check_manifest_routes() {
  local app_label="$1"
  local app_dir="$2"
  shift 2
  local routes=("$@")
  local manifest_path="$app_dir/.next/routes-manifest.json"
  local expected_routes=""
  local route

  if ! check_required_path "$manifest_path" "$app_label routes manifest"; then
    return 1
  fi

  for route in "${routes[@]}"; do
    if [ -n "$expected_routes" ]; then
      expected_routes="$expected_routes|$route"
    else
      expected_routes="$route"
    fi
  done

  MSYS2_ENV_CONV_EXCL='EXPECTED_ROUTES' EXPECTED_ROUTES="$expected_routes" node - "$manifest_path" <<'NODE'
const [manifestPath] = process.argv.slice(2);
const fs = require("node:fs");

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const expectedRoutes = (process.env.EXPECTED_ROUTES || "").split("|").filter(Boolean);
const staticRoutes = new Set((manifest.staticRoutes || []).map((route) => route.page));
const dynamicRoutes = new Set((manifest.dynamicRoutes || []).map((route) => route.page));
const missing = expectedRoutes.filter((route) => !staticRoutes.has(route) && !dynamicRoutes.has(route));

if (missing.length > 0) {
  console.error(`missing routes in ${manifestPath}: ${missing.join(", ")}`);
  process.exit(1);
}
NODE
}

check_server_entries() {
  local app_label="$1"
  local app_dir="$2"
  shift 2
  local routes=("$@")
  local server_app_dir="$app_dir/.next/server/app"
  local route
  local server_entry

  if ! check_required_path "$server_app_dir" "$app_label server app directory"; then
    return 0
  fi

  for route in "${routes[@]}"; do
    if [ "$route" = "/" ]; then
      server_entry="$server_app_dir/page.js"
    else
      server_entry="$server_app_dir/${route#/}/page.js"
    fi

    if [ -f "$server_entry" ]; then
      printf 'UI_ROUTE_SERVER_ENTRY_READY app=%s route=%s file=%s\n' "$app_label" "$route" "$server_entry"
    else
      record_failure "$app_label route $route missing server entry: $server_entry"
    fi
  done
}

check_app() {
  local app_label="$1"
  local relative_app_dir="$2"
  shift 2
  local routes=("$@")
  local app_dir="$REPO_DIR/$relative_app_dir"

  printf 'UI_ROUTE_MANIFEST_CHECK app=%s dir=%s\n' "$app_label" "$relative_app_dir"

  if ! check_required_path "$app_dir/package.json" "$app_label package"; then
    return
  fi

  if check_manifest_routes "$app_label" "$app_dir" "${routes[@]}"; then
    printf 'UI_ROUTE_MANIFEST_READY app=%s routes=%s\n' "$app_label" "${routes[*]}"
  else
    record_failure "$app_label route manifest missing expected routes"
  fi

  check_server_entries "$app_label" "$app_dir" "${routes[@]}"
}

printf '%s\n' "Verifying OIS NextGen UI production route manifests."
printf '%s\n' "Safety: read-only build artifact check; no env, secrets, DB, migrations, seed or network calls."

if [ ! -f "$REPO_DIR/package.json" ]; then
  printf 'STOP: REPO_DIR does not look like OIS NextGen repo: %s\n' "$REPO_DIR" >&2
  exit 1
fi

check_app "OIS_CONSOLE" "apps/ois-console" "/" "/product-flow" "/dashboard" "/products" "/products/[id]" "/workspaces" "/workspaces/[id]" "/modules/[id]" "/installations/[id]" "/runtime"
check_app "PITS_SHELL" "apps/pits-shell" "/" "/product-flow" "/projects" "/projects/[id]" "/projects/[id]/workboard" "/projects/[id]/work-items/[itemId]" "/runtime"

if [ "$failures" -gt 0 ]; then
  printf '\nUI_ROUTE_MANIFEST_CHECK_FAILED failures=%s\n' "$failures" >&2
  exit 1
fi

printf '\nUI_ROUTE_MANIFEST_CHECK_PASSED OIS Console and PITS Shell Stage 1A/1C plus Stage 2A workboard, Stage 2B work item detail and Stage 2C product-flow routes are present in production build artifacts.\n'
