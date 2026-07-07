#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
OUTPUT_DIR="${OUTPUT_DIR:-artifacts/abacus}"
ZIP_NAME="${ZIP_NAME:-ois-console-abacus-upload-bundle.zip}"
BUNDLE_REF="${BUNDLE_REF:-HEAD}"

REQUIRED_PATHS=(
  "package.json"
  "pnpm-lock.yaml"
  "pnpm-workspace.yaml"
  "tsconfig.base.json"
  "apps/ois-console"
  "packages/shared-ui"
)

FORBIDDEN_ENTRY_REGEX='(^|/)(node_modules|\.next|dist|\.git|\.abacus-[^/]*|\.env($|\.))'

fail() {
  printf 'ERROR: %s\n' "$1" >&2
  exit 1
}

file_size_bytes() {
  local file_path="$1"

  if stat -c '%s' "$file_path" >/dev/null 2>&1; then
    stat -c '%s' "$file_path"
    return
  fi

  if stat -f '%z' "$file_path" >/dev/null 2>&1; then
    stat -f '%z' "$file_path"
    return
  fi

  wc -c <"$file_path" | tr -d '[:space:]'
}

cd "$REPO_ROOT"

command -v git >/dev/null 2>&1 || fail "git is required to create the upload bundle"

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || fail "script must run inside a git worktree"
git cat-file -e "$BUNDLE_REF^{tree}" >/dev/null 2>&1 || fail "bundle ref '$BUNDLE_REF' is not a valid git tree"

for required_path in "${REQUIRED_PATHS[@]}"; do
  [ -e "$required_path" ] || fail "required path missing from working tree: $required_path"
  git cat-file -e "$BUNDLE_REF:$required_path" >/dev/null 2>&1 || fail "required path missing from $BUNDLE_REF: $required_path"
done

if ! git diff --quiet -- "${REQUIRED_PATHS[@]}"; then
  fail "bundle paths have unstaged changes; commit or discard them before packaging"
fi

if ! git diff --cached --quiet -- "${REQUIRED_PATHS[@]}"; then
  fail "bundle paths have staged changes; commit or unstage them before packaging"
fi

for forbidden_path in .env .env.local; do
  [ ! -e "$forbidden_path" ] || fail "refusing to package while $forbidden_path exists in repo root"
done

for source_path in apps/ois-console packages/shared-ui; do
  if find "$source_path" -name '.env' -o -name '.env.*' | grep -q .; then
    fail "refusing to package env files under $source_path"
  fi
done

if git ls-tree -r --name-only "$BUNDLE_REF" -- "${REQUIRED_PATHS[@]}" | grep -E "$FORBIDDEN_ENTRY_REGEX" >/dev/null; then
  printf '%s\n' "Forbidden tracked entries found:" >&2
  git ls-tree -r --name-only "$BUNDLE_REF" -- "${REQUIRED_PATHS[@]}" | grep -E "$FORBIDDEN_ENTRY_REGEX" >&2
  fail "bundle would include forbidden generated, runtime or secret-like paths"
fi

mkdir -p "$OUTPUT_DIR"

ZIP_PATH="$OUTPUT_DIR/$ZIP_NAME"
TMP_ZIP="$ZIP_PATH.tmp"
rm -f "$TMP_ZIP" "$ZIP_PATH"

git archive --format=zip --output="$TMP_ZIP" "$BUNDLE_REF" -- "${REQUIRED_PATHS[@]}"
mv "$TMP_ZIP" "$ZIP_PATH"

printf 'OIS Console upload bundle created\n'
printf 'path=%s\n' "$REPO_ROOT/$ZIP_PATH"
printf 'size_bytes=%s\n' "$(file_size_bytes "$ZIP_PATH")"
printf 'bundle_ref=%s\n' "$(git rev-parse "$BUNDLE_REF")"
printf '%s\n' "Upload this ZIP to the OIS Console Abacus App Shell source upload flow."
