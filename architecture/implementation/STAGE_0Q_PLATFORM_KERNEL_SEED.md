# Stage 0Q Platform Kernel Seed

Stage 0Q-A result: `PLATFORM_KERNEL_SEED_SCRIPT_READY`.

Stage 0Q-B final result: `PLATFORM_KERNEL_SEED_APPLIED`.

## Baseline

| Item | Result |
|---|---|
| Documentation branch | `stage-0q-platform-kernel-seed` |
| Integration base | `stage-0b-complete-handoff-ingestion` |
| Integration base commit | `13006ca8451c2f6b3e515076365da33c6eed96b6` |
| Prior stage | Stage 0P `DEFAULT_DB_PRISMA_BASELINE_APPLIED` |
| Evidence source | User-provided Abacus SuperComputer Stage 0Q-A and 0Q-B evidence. |
| Local documentation task | Documentation-only status update; no local seed, migration, endpoint or Abacus command was executed from this repository. |

## Stage 0Q-A Readiness Evidence

| Item | Evidence |
|---|---|
| Seed script | `prisma/seed.ts` |
| Seed command | `pnpm db:seed` |
| Command mapping | `prisma db seed -> tsx prisma/seed.ts` |
| Table coverage | All 18 application tables. |
| Expected total records | 66. |
| ID strategy | Deterministic IDs. |
| Idempotency | Uses `ensureRecord` / `findUnique` -> create if missing -> update if changed. |
| Data label | `DEMO DATA - NOT PRODUCTION`. |
| Code changes | Not required. |
| Phase 1 data references | None detected. |
| Stage 0Q-A writes | None. |

## Stage 0Q-B Seed Execution Evidence

| Item | Evidence |
|---|---|
| Command | `pnpm db:seed` |
| Exit code | 0. |
| Output summary | `DEMO DATA - NOT PRODUCTION`; `The seed command has been executed.` |
| Stderr | Non-blocking Prisma 7 deprecation notice about `package.json#prisma` config. |
| Secrets | No `DATABASE_URL` or secret values printed. |
| Second seed run | Not performed. |

## Post-seed DB Counts

| Table | Count |
|---|---:|
| `Industry` | 1 |
| `Organization` | 1 |
| `Workspace` | 1 |
| `Project` | 2 |
| `ProductDefinition` | 5 |
| `IdentityRealm` | 5 |
| `UserAccount` | 6 |
| `WorkspaceMembership` | 6 |
| `RoleDefinition` | 6 |
| `PermissionDefinition` | 12 |
| `RolePermission` | 10 |
| `ModuleDefinition` | 3 |
| `ProductInstallation` | 2 |
| `ProductCapabilityGrant` | 2 |
| `EffectiveConfigurationSnapshot` | 1 |
| `FeatureFlag` | 1 |
| `AuditRecord` | 1 |
| `LegacyIdentityMap` | 1 |
| Total | 66 |

The `default` DB now has Platform Kernel demo/staging seed data across all 18 application tables.

## Endpoint Verification

| Endpoint | Result |
|---|---|
| Local `/platform/overview` | HTTP 200. |
| Public `/platform/overview` | HTTP 200 at `https://ois-nextgen.abacusai.cloud/platform/overview`. |
| Public `/health` | Remained HTTP 200 at `https://ois-nextgen.abacusai.cloud/health`. |
| Core API service | `ois-nextgen-core-api.service` remained active and was never interrupted. |

Public `/platform/overview` now includes:

| Field | Value |
|---|---|
| Banner | `DEMO DATA - NOT PRODUCTION` |
| `industries` | 1 |
| `organizations` | 1 |
| `workspaces` | 1 |
| `projects` | 2 |
| `products` | 5 |
| `installations` | 2 |
| `modules` | 3 |
| `auditRecords` | 1 |
| `phaseGates.PLATFORM_KERNEL` | `IN_PROGRESS` |

`PLATFORM_KERNEL` remains `IN_PROGRESS` because gate advancement is API-controlled logic, not purely count-driven. This is expected.

## Published Endpoint Delta

### Added

| Endpoint | Status | Expected result | Evidence |
|---|---|---|---|
| None. | N/A | N/A | N/A |

### Changed

| Endpoint | Previous status/result | New status/result | Evidence |
|---|---|---|---|
| `https://ois-nextgen.abacusai.cloud/platform/overview` | HTTP 200 with all kernel counts 0. | HTTP 200 with seeded Platform Kernel counts populated and banner `DEMO DATA - NOT PRODUCTION`. | Stage 0Q-B verified public HTTP 200 after seed execution. |

### Unchanged

| Endpoint | Status | Expected result |
|---|---|---|
| `https://ois-nextgen.abacusai.cloud/health` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200 Core API health. |
| `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 live App Shell; do not touch. |
| `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 custom domain; do not touch. |
| `https://7a162f29d-4000.na116.preview.abacusai.app/health` | `ABACUS_PREVIEW_PUBLIC` | Historical preview endpoint only. |

### Deprecated / stopped

| Endpoint | Status | Reason |
|---|---|---|
| None. | N/A | N/A |

### Do Not Touch

| Endpoint/resource | Status | Reason |
|---|---|---|
| `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 live App Shell. |
| `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 custom domain. |
| `ois_phase1_dev` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 production-equivalent DB. |
| `emerald_bql_web_dev` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Emerald/BQL legacy DB. |
| Storage prefixes `49816/` and `52067/` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Legacy storage boundaries. |

### Current Test Checklist

| Check | Command | Expected |
|---|---|---|
| Core API staging health | `curl -i https://ois-nextgen.abacusai.cloud/health` | HTTP 200 and Core API health payload. |
| Seeded DB-backed platform overview | `curl -i https://ois-nextgen.abacusai.cloud/platform/overview` | HTTP 200, demo-data banner, seeded Platform Kernel counts. |

## Backlog Note

Prisma emitted a non-blocking Prisma 7 deprecation warning that `package.json#prisma` seed configuration should later migrate to `prisma.config.ts`.

This was not fixed in Stage 0Q because the stage is evidence documentation only and no code/config change was required for the approved seed execution.

## Decision

Stage 0Q-B passes as `PLATFORM_KERNEL_SEED_APPLIED`.

The `default` DB now contains Platform Kernel demo/staging seed data. `/platform/overview` is the first DB-backed public staging endpoint with seeded counts.

Seed data is `DEMO DATA - NOT PRODUCTION`.

`PLATFORM_KERNEL` remains `IN_PROGRESS` by API-controlled logic, which is expected.

OIS Console, PITS Shell, worker, `/auth/demo-login`, write endpoints and custom `dmp247.com` domains remain out of scope.

Recommended next stage: Stage 0R - Platform Kernel Gate Logic / DB-backed Smoke Stabilization.

## Safety Statement

The recorded Abacus Stage 0Q execution honored these constraints:

- `ois_phase1_dev` was not referenced.
- `emerald_bql_web_dev` was not referenced.
- `ois.dmp247.com` was not touched.
- `oisys.abacusai.app` was not touched.
- Storage prefix `49816/` was not referenced.
- Storage prefix `52067/` was not referenced.
- `prisma db push` was not called.
- `prisma migrate dev` was not called.
- `.env` was not committed.
- Secrets and `DATABASE_URL` were not printed.
- Write HTTP endpoints were not called.
- `/auth/demo-login` was not called.
- Real Phase 1 data was not imported.
- nginx/systemd config was not modified.

This local Stage 0Q documentation update is documentation-only.

## Validation

| Command | Result |
|---|---|
| `pnpm lint` | PASS; architecture guard passed. |
| `pnpm typecheck` | PASS; `tsc -p tsconfig.check.json --noEmit`. |
| `pnpm test` | PASS; 2 files, 16 tests. |
| `pnpm -r --if-present build` | PASS; Core API TypeScript build and OIS Console/PITS Shell Next.js static builds completed. |
| `git status -sb` | PASS; documentation-only Stage 0Q changes pending commit. |
