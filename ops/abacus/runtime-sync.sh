#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="${REPO_DIR:-/home/ubuntu/ois-nextgen}"
INTEGRATION_BRANCH="${INTEGRATION_BRANCH:-stage-0b-complete-handoff-ingestion}"
PUBLIC_STAGING_RESTART_SCOPE="${PUBLIC_STAGING_RESTART_SCOPE:-core}"
RESTART_CLOUDFLARED="${RESTART_CLOUDFLARED:-false}"
CLEAN_UI_BUILDS="${CLEAN_UI_BUILDS:-true}"

printf '%s\n' "Runtime sync starting."
printf '%s\n' "Safety: no migrations, no seed, no prisma db push, no .env printing."
printf '%s\n' "Safety: stops if Prisma schema, migration or seed files changed in pulled commits."
printf '%s\n' "Safety: cloudflared is not restarted unless RESTART_CLOUDFLARED=true and PUBLIC_STAGING_RESTART_SCOPE=all."
printf '%s\n' "Safety: UI build cleanup removes only generated .next folders for OIS Console and PITS Shell."

cd "$REPO_DIR"

if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  printf '%s\n' "STOP: tracked working tree changes are present."
  printf '%s\n' "Commit, stash or inspect them before runtime sync."
  git status --short --untracked-files=no
  exit 1
fi

before_commit="$(git rev-parse HEAD)"
printf 'before_commit=%s\n' "$before_commit"

git fetch origin
git checkout "$INTEGRATION_BRANCH"
git pull --ff-only origin "$INTEGRATION_BRANCH"

after_commit="$(git rev-parse HEAD)"
printf 'after_commit=%s\n' "$after_commit"

changed_db_files="$(
  git diff --name-only "$before_commit" "$after_commit" -- prisma/schema.prisma prisma/seed.ts prisma/migrations || true
)"

if [ -n "$changed_db_files" ]; then
  printf '%s\n' "STOP: Prisma schema, migration or seed files changed."
  printf '%s\n' "This runtime-sync script never runs migrations or seed."
  printf '%s\n' "Use an owner-approved migration/seed stage instead."
  printf '%s\n' "$changed_db_files"
  exit 1
fi

pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test

if [ "$CLEAN_UI_BUILDS" = "true" ]; then
  printf '%s\n' "UI_BUILD_CLEAN_START removing generated OIS/PITS .next folders before production build"
  rm -rf "$REPO_DIR/apps/ois-console/.next" "$REPO_DIR/apps/pits-shell/.next"
  printf '%s\n' "UI_BUILD_CLEAN_PASSED"
else
  printf '%s\n' "UI_BUILD_CLEAN_SKIPPED CLEAN_UI_BUILDS=false"
fi

pnpm -r --if-present build
bash ops/abacus/verify-ui-route-manifests.sh

printf '%s\n' "Restart verification uses a grace window so transient post-restart 502/connection failures are treated as WARMING_UP until timeout."
case "$PUBLIC_STAGING_RESTART_SCOPE" in
  core)
    bash ops/abacus/safe-restart-core-api.sh
    ;;
  all)
    restart_args=()
    if [ "$RESTART_CLOUDFLARED" = "true" ]; then
      restart_args+=(--include-cloudflared)
    fi
    bash ops/abacus/restart-public-staging-runtime.sh "${restart_args[@]}"
    ;;
  *)
    printf 'STOP: unsupported PUBLIC_STAGING_RESTART_SCOPE=%s. Use core or all.\n' "$PUBLIC_STAGING_RESTART_SCOPE" >&2
    exit 2
    ;;
esac

printf '\nRuntime sync completed with no behavior regression detected by scripted checks.\n'
