# Stage 0P Default DB Prisma Baseline

Final verdict: `DEFAULT_DB_PRISMA_BASELINE_APPLIED`.

Abacus execution label: `DEFAULT_DB_MIGRATION_APPLIED_SUCCESS`.

## Baseline

| Item | Result |
|---|---|
| Documentation branch | `stage-0p-default-db-prisma-baseline` |
| Integration base | `stage-0b-complete-handoff-ingestion` |
| Integration base commit | `2e5821279ca81d472cde304305545f30c6785c29` |
| Prior stage | Stage 0O `ABACUS_MANAGED_DOMAIN_CORE_API_HEALTH_VERIFIED` |
| Stage 0P-A readiness label | `DEFAULT_DB_PRISMA_READINESS_CONFIRMED` |
| Stage 0P-B Abacus execution label | `DEFAULT_DB_MIGRATION_APPLIED_SUCCESS` |
| Normalized final project verdict | `DEFAULT_DB_PRISMA_BASELINE_APPLIED` |
| Evidence source | User-provided Abacus SuperComputer Stage 0P-A and 0P-B evidence. |
| Local documentation task | Documentation-only status update; no local database, migration, endpoint or Abacus command was executed from this repository. |

## Stage 0P-A Readiness Evidence

| Item | Evidence |
|---|---|
| Repo path | `/home/ubuntu/ois-nextgen` |
| Branch | `stage-0b-complete-handoff-ingestion` |
| Commit | `cc7ed28704c9e804385f6d2a4c21e8d887a775e3` |
| Prisma schema path | `/home/ubuntu/ois-nextgen/prisma/schema.prisma` |
| Provider | `postgresql` |
| DB env var | `DATABASE_URL` |
| Existing migration | `202607040001_platform_kernel` |
| Migration content | 18 tables, 36 indexes, 5 enum types. |
| Target DB | `default`, DB ID/name `2c30a48b7`. |
| Pre-migration target DB state | Empty, 0 tables. |
| Correct migration command | `prisma migrate deploy`, invoked through `pnpm db:migrate`. |
| `prisma db push` | Not required and must not be used. |

## Stage 0P-B Migration Execution Evidence

| Item | Evidence |
|---|---|
| Target DB | `default` only. |
| DB ID/name | `2c30a48b7` |
| Legacy DB reference check | PASS. |
| `ois_phase1_dev` | Untouched. |
| `emerald_bql_web_dev` | Untouched. |
| `ois.dmp247.com` | Untouched. |
| `oisys.abacusai.app` | Untouched. |
| Storage prefixes `49816/` and `52067/` | Untouched. |
| Pre-migration schema backup | `/home/ubuntu/ois-nextgen/.abacus-backups/default_schema_pre_0p_b_20260706_023524.sql` |
| Backup size | 728 B, 27 lines. |
| PostgreSQL client | Matching `postgresql-client-17` installed because system `pg_dump` was 16.14 and server was 17.9. |
| Migration command | `pnpm db:migrate` |
| Command mapping | `prisma migrate deploy` |
| Applied migration | `202607040001_platform_kernel` |
| Migration exit code | 0. |
| Output summary | All migrations have been successfully applied. |
| Post-migration status | `prisma migrate status` reported database schema is up to date. |

## Post-migration Schema Evidence

| Item | Evidence |
|---|---|
| Total tables | 19: 18 domain tables plus `_prisma_migrations`. |
| Public index count | 55. |
| Enum types | `IdentityRealmCode`, `LifecycleStatus`, `ModuleType`, `ProductCode`, `ScopeKind`. |
| `_prisma_migrations` row | `202607040001_platform_kernel`, finished `2026-07-06 02:35:40 UTC`, `applied_steps_count = 1`. |

Domain tables:

- `AuditRecord`
- `EffectiveConfigurationSnapshot`
- `FeatureFlag`
- `IdentityRealm`
- `Industry`
- `LegacyIdentityMap`
- `ModuleDefinition`
- `Organization`
- `PermissionDefinition`
- `ProductCapabilityGrant`
- `ProductDefinition`
- `ProductInstallation`
- `Project`
- `RoleDefinition`
- `RolePermission`
- `UserAccount`
- `Workspace`
- `WorkspaceMembership`

## Runtime Wiring

`DATABASE_URL` was added to `/home/ubuntu/ois-nextgen/.env` on the Abacus VM. The value was never printed. The `.env` file is gitignored and was not committed.

VM `.env` key names after Stage 0P:

- `AI_PROVIDER`
- `AI_PROVIDER_MODE`
- `APP_ENV`
- `CORE_API_HOST`
- `CORE_API_PORT`
- `CORE_API_URL`
- `DATABASE_URL`
- `DEPLOY_TARGET`
- `LOCALHOST_REQUIRED`
- `NEXT_TELEMETRY_DISABLED`
- `OPENROUTER_API_KEY`
- `STORAGE_PROVIDER`

Runtime service evidence:

| Item | Evidence |
|---|---|
| Service restart | `sudo systemctl restart ois-nextgen-core-api` succeeded. |
| Service status | Active/running. |
| Main PID after restart | `5754` |
| nginx | Unchanged and active. |

## Health And DB-backed Endpoint Evidence

| Endpoint | Result |
|---|---|
| Local `/health` | HTTP 200 before and after migration. |
| Public `/health` | HTTP 200 before and after migration. |
| Local `/platform/overview` | HTTP 200 after migration. |
| Public `/platform/overview` | HTTP 200 after migration. |

`/platform/overview` successfully executed 8 live Prisma `count()` queries against the migrated `default` DB. All counts were 0, which is expected because no seed data exists yet.

## Published Endpoint Delta

### Added

| Endpoint | Status | Expected result | Evidence |
|---|---|---|---|
| `https://ois-nextgen.abacusai.cloud/platform/overview` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200, DB-backed read-only platform overview with zero counts until seed data exists. | Stage 0P-B verified public HTTP 200 after migration and live Prisma count queries against the migrated `default` DB. |

### Changed

| Endpoint | Previous status/result | New status/result | Evidence |
|---|---|---|---|
| `https://ois-nextgen.abacusai.cloud/health` | HTTP 200 mock-safe Core API health with no DB env. | HTTP 200 Core API health while service now carries `DATABASE_URL` in VM `.env`; `/health` still does not query Prisma. | Stage 0P-B verified public `/health` before and after migration. |

### Unchanged

| Endpoint | Status | Expected result |
|---|---|---|
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
| DB-backed platform overview | `curl -i https://ois-nextgen.abacusai.cloud/platform/overview` | HTTP 200 and zero-count platform overview until seed data exists. |

## Decision

Stage 0P passes as `DEFAULT_DB_PRISMA_BASELINE_APPLIED`.

The `default` Abacus staging DB is now migrated with the platform kernel Prisma baseline. The Core API service now has `DATABASE_URL` in the VM `.env`, and `/platform/overview` is the first DB-backed public staging endpoint.

No seed data exists yet; zero counts are expected.

OIS Console, PITS Shell, worker, `/auth/demo-login`, write endpoints and custom `dmp247.com` domains remain out of scope.

Recommended next stage: Stage 0Q - Platform Kernel Seed / DB-backed Smoke Stabilization.

## Safety Statement

The recorded Abacus Stage 0P execution honored these constraints:

- No `prisma db push`.
- No `prisma migrate dev`.
- No production database, storage or OpenRouter credentials.
- No secrets or `DATABASE_URL` value printed.
- No `.env` committed.
- No row data inspected.
- No `/auth/demo-login` call.
- No write endpoints called.
- Legacy DBs untouched.
- Legacy domains untouched.
- Storage prefixes `49816/` and `52067/` untouched.

This local Stage 0P documentation update is documentation-only.

## Validation

| Command | Result |
|---|---|
| `pnpm lint` | PASS; architecture guard passed. |
| `pnpm typecheck` | PASS; `tsc -p tsconfig.check.json --noEmit`. |
| `pnpm test` | PASS; 2 files, 16 tests. |
| `pnpm -r --if-present build` | PASS; Core API TypeScript build and OIS Console/PITS Shell Next.js static builds completed. |
| `git status -sb` | PASS; documentation-only Stage 0P changes pending commit. |
