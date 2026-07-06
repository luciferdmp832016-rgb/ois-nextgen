#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="${REPO_DIR:-/home/ubuntu/ois-nextgen}"
INTEGRATION_BRANCH="${INTEGRATION_BRANCH:-stage-0b-complete-handoff-ingestion}"

printf '%s\n' "Runtime sync starting."
printf '%s\n' "Safety: no migrations, no seed, no prisma db push, no .env printing."
printf '%s\n' "Safety: stops if Prisma schema, migration or seed files changed in pulled commits."

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
pnpm -r --if-present build

bash ops/abacus/safe-restart-core-api.sh

printf '\nRuntime sync completed with no behavior regression detected by scripted checks.\n'
