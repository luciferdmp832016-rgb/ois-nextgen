# PITS Shell Abacus Upload Bundle

Stage 0T-D-R1 prepares an uploadable source bundle for PITS Shell because the Abacus App Shell deployment environment reported that it cannot clone the external GitHub repository directly.

This bundle keeps the App Shell source tied to the OIS NextGen source-of-truth repo. Do not use a spec-generated PITS shell for this stage.

## Purpose

Create a reproducible ZIP that can be uploaded to the Abacus Apps Management Console source upload flow for:

| Field | Value |
|---|---|
| App name | `PITS NextGen Shell Demo` |
| App type | `nextjs` |
| Package | `@ois/pits-shell` |
| App path | `apps/pits-shell` |
| Core API | `https://ois-nextgen.abacusai.cloud` |
| Expected product code | `PITS_SHELL` |

## Dependency Inspection

PITS Shell imports one local workspace package:

| Import | Required bundle path | Evidence |
|---|---|---|
| `@ois/shared-ui` | `packages/shared-ui/**` | `apps/pits-shell/next.config.mjs` transpiles `@ois/shared-ui`; `home` and `projects` pages import `demoBannerText`. |

No direct Prisma, database client, Core API package, domain package or production/legacy package import is required for the PITS Shell App Shell build.

## Included Paths

The upload bundle intentionally includes only the source and workspace metadata needed to build PITS Shell:

| Path | Reason |
|---|---|
| `apps/pits-shell/**` | PITS Shell Next.js app source, package manifest, config and local tests. |
| `packages/shared-ui/**` | Only workspace package imported by PITS Shell. |
| `package.json` | Root package manager, dependencies and workspace scripts. |
| `pnpm-lock.yaml` | Reproducible dependency resolution. |
| `pnpm-workspace.yaml` | Workspace package discovery for `@ois/pits-shell` and `@ois/shared-ui`. |
| `tsconfig.base.json` | Base TypeScript config extended by `apps/pits-shell/tsconfig.json`. |

## Excluded Paths

The packaging script uses `git archive` with an explicit allowlist, and refuses forbidden tracked entries before creating the ZIP.

Excluded:

- `node_modules`
- `.next`
- `dist` and build output
- `.env` and `.env.*`
- secrets
- `.git`
- `.abacus-*` runtime files
- backups
- prior uploaded/generated artifacts
- unrelated apps, packages, domains, Prisma schema, migrations and seeds

## Packaging Command

From the repo root:

```sh
bash ops/abacus/package-pits-shell-upload-bundle.sh
```

Default output:

```text
artifacts/abacus/pits-shell-abacus-upload-bundle.zip
```

The script prints the absolute file path, size in bytes and source commit. `artifacts/` is gitignored; do not commit generated ZIP files.

The script fails if:

- required bundle paths are missing
- bundle paths have staged or unstaged changes
- root `.env` or `.env.local` exists
- env files exist under `apps/pits-shell` or `packages/shared-ui`
- forbidden generated/runtime/secret-like paths would be included

## Windows PowerShell Option

The preferred command on Windows is still the bash script through Git Bash, WSL or the repo's shell environment:

```powershell
bash ops/abacus/package-pits-shell-upload-bundle.sh
```

If bash is unavailable but Git is available, this equivalent PowerShell command creates the same allowlisted archive:

```powershell
New-Item -ItemType Directory -Force artifacts/abacus
git archive --format=zip --output artifacts/abacus/pits-shell-abacus-upload-bundle.zip HEAD -- package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json apps/pits-shell packages/shared-ui
```

Before using the PowerShell fallback, manually confirm no `.env`, `.env.local`, `node_modules`, `.next`, `dist`, `.git`, `.abacus-*`, backup or secret file exists under the included paths.

## Abacus Upload Instructions

1. Open the Abacus Apps Management Console.
2. Create or open `PITS NextGen Shell Demo`.
3. Choose the direct source upload option.
4. Upload `artifacts/abacus/pits-shell-abacus-upload-bundle.zip`.
5. Configure as a Next.js App Shell.
6. Configure safe environment values only.
7. Build and start using the commands below.
8. Verify the App Shell preview URL before any custom domain work.

## Build And Start

Build command:

```sh
corepack enable || true && pnpm install --frozen-lockfile && pnpm --filter @ois/pits-shell build
```

Start command:

```sh
pnpm --filter @ois/pits-shell start
```

Expected port:

```text
3001
```

## Environment Variables

Set only:

| Key | Value |
|---|---|
| `CORE_API_URL` | `https://ois-nextgen.abacusai.cloud` |
| `NEXT_PUBLIC_CORE_API_URL` | `https://ois-nextgen.abacusai.cloud` |
| `NEXT_TELEMETRY_DISABLED` | `1` |

Do not set:

- `DATABASE_URL`
- `ABACUS_DATABASE_URL`
- production DB credentials
- production storage credentials
- production OpenRouter credentials
- Phase 1 secrets

## Verification Checklist

After Abacus builds and starts the uploaded PITS Shell App Shell:

| Check | Expected |
|---|---|
| PITS App Shell URL | HTTP 200. |
| App Shell name | `PITS Shell` visible. |
| Product code | `PITS_SHELL` visible. |
| Core API URL | `https://ois-nextgen.abacusai.cloud` visible. |
| Core API health | `status=ok`, `service=core-api`, `stage=bootstrap-stage-a`, HTTP 200. |
| Demo banner | `DEMO DATA - NOT PRODUCTION` visible. |
| Seeded counts | industries 1, organizations 1, workspaces 1, projects 2, products 5, installations 2, modules 3, auditRecords 1. |
| Data boundary | Page states DB-backed demo data is accessed only through Core API. |
| Direct DB access | No `DATABASE_URL` or `ABACUS_DATABASE_URL` configured in the UI App Shell. |
| Legacy boundaries | `https://oisys.abacusai.app`, `https://ois.dmp247.com`, `ois_phase1_dev` and `emerald_bql_web_dev` remain untouched. |

## Safety

Stage 0T-D-R1 does not deploy, modify Abacus runtime, run migrations, run seed, run `prisma db push`, call write endpoints, call `/auth/demo-login`, attach a `dmp247.com` domain or touch legacy resources.
