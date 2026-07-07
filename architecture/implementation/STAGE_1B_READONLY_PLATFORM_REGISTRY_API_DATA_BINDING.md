# Stage 1B Read-Only Platform Registry API Data Binding

Stage 1B result: `READONLY_PLATFORM_REGISTRY_API_DATA_BINDING_READY`.

## Objective

Add read-only Platform Registry Core API endpoints and bind OIS Console / PITS Shell pages to real Core API registry data now that Stage 1A public staging runtime is verified.

Stage 1B is a read-only API/UI data-binding change. It does not deploy from Codex, modify Cloudflare dashboard, modify DNS, run migrations, run seed, run `prisma db push`, commit credentials, use UI `DATABASE_URL`, touch legacy resources or add write/mutation endpoints.

## Runtime Baseline

Stage 1A/1A-R2 owner evidence confirms:

| Surface | Status |
|---|---|
| `https://ois-ng.dmp247.com` | PASS. |
| `https://ois-ng.dmp247.com/dashboard` | PASS. |
| `https://ois-ng.dmp247.com/products` | PASS. |
| `https://ois-ng.dmp247.com/workspaces` | PASS. |
| `https://ois-ng.dmp247.com/runtime` | PASS. |
| `https://pits-ng.dmp247.com` | PASS. |
| `https://pits-ng.dmp247.com/projects` | PASS. |
| `https://pits-ng.dmp247.com/runtime` | PASS. |

Core API remains `https://ois-nextgen.abacusai.cloud`. UI shells must call Core API only and must not use `DATABASE_URL`.

## Core API

Added read-only Platform Registry endpoints:

| Endpoint | Purpose |
|---|---|
| `GET /platform/products` | Product definitions with module and installation summaries. |
| `GET /platform/workspaces` | Organization and workspace registry with related projects/installations. |
| `GET /platform/projects` | Project registry with workspace, organization and installation summaries. |
| `GET /platform/modules` | Module definitions with product relationship. |
| `GET /platform/installations` | Product installation registry with product, organization, workspace and project relationships. |
| `GET /platform/registry` | Aggregate registry snapshot for UI shells. |

All responses include metadata:

```json
{
  "source": "default-db",
  "mode": "read-only",
  "environment": "staging",
  "generatedAt": "<ISO timestamp>"
}
```

The endpoints use existing Prisma models only and issue read-only `findMany` queries. Empty tables return empty arrays. No schema change, mutation endpoint, auth/demo-login change, migration or seed change was added.

## UI Binding

Extended `@ois/shared-ui` with:

- Registry response types.
- Safe registry array extraction.
- `getPlatformRegistrySnapshot()`.
- Registry metadata parsing.

Updated OIS Console:

| Route | Stage 1B binding |
|---|---|
| `/dashboard` | Adds read-only registry status panel. |
| `/products` | Renders product definitions and modules from Core API registry data. |
| `/workspaces` | Renders organizations, workspaces and projects from Core API registry data. |
| `/runtime` | Adds registry status next to runtime/overview status. |

Updated PITS Shell:

| Route | Stage 1B binding |
|---|---|
| `/` | Uses Core API registry projects/installations instead of hardcoded project cards. |
| `/projects` | Renders project selector and installation mapping from Core API registry data. |
| `/runtime` | Shows installation registry alongside runtime status. |

Both shells keep the staging/demo banner, Core API source indicator, fallback states and Core API-only data access boundary.

## Ops

Updated public staging checks:

- `ops/abacus/check-public-staging-endpoints.sh`
- `ops/abacus/status-public-staging-runtime.sh`
- `ops/abacus/restart-public-staging-runtime.sh`

Checks now cover:

- Core API registry endpoints returning HTTP 200 with `source=default-db` and `mode=read-only`.
- OIS `/products` showing `PITS_RUNTIME_SHELL`.
- OIS `/workspaces` showing `PMC Org Demo`.
- PITS `/projects` showing `EMERALD_PRECINCT_DEMO`.
- Existing Stage 1A routes and public endpoint checks.

## Published Endpoint Delta

### Added

| Endpoint | Status | Expected result | Evidence |
|---|---|---|---|
| `https://ois-nextgen.abacusai.cloud/platform/products` | `PLANNED_NOT_CREATED` | HTTP 200 read-only products registry after owner runtime sync. | Stage 1B source/tests ready; not deployed from Codex. |
| `https://ois-nextgen.abacusai.cloud/platform/workspaces` | `PLANNED_NOT_CREATED` | HTTP 200 read-only organizations/workspaces registry after owner runtime sync. | Stage 1B source/tests ready; not deployed from Codex. |
| `https://ois-nextgen.abacusai.cloud/platform/projects` | `PLANNED_NOT_CREATED` | HTTP 200 read-only projects registry after owner runtime sync. | Stage 1B source/tests ready; not deployed from Codex. |
| `https://ois-nextgen.abacusai.cloud/platform/modules` | `PLANNED_NOT_CREATED` | HTTP 200 read-only modules registry after owner runtime sync. | Stage 1B source/tests ready; not deployed from Codex. |
| `https://ois-nextgen.abacusai.cloud/platform/installations` | `PLANNED_NOT_CREATED` | HTTP 200 read-only installations registry after owner runtime sync. | Stage 1B source/tests ready; not deployed from Codex. |
| `https://ois-nextgen.abacusai.cloud/platform/registry` | `PLANNED_NOT_CREATED` | HTTP 200 aggregate read-only registry after owner runtime sync. | Stage 1B source/tests ready; not deployed from Codex. |

### Changed

| Endpoint | Previous status/result | New status/result | Evidence |
|---|---|---|---|
| `https://ois-ng.dmp247.com/dashboard` | Product shell dashboard. | Registry-aware dashboard after owner runtime sync. | Stage 1B code/tests ready. |
| `https://ois-ng.dmp247.com/products` | Product shell route. | Core API-backed product/module registry route after owner runtime sync. | Stage 1B code/tests ready. |
| `https://ois-ng.dmp247.com/workspaces` | Workspace shell route. | Core API-backed organization/workspace/project registry route after owner runtime sync. | Stage 1B code/tests ready. |
| `https://ois-ng.dmp247.com/runtime` | Runtime shell route. | Registry-aware runtime route after owner runtime sync. | Stage 1B code/tests ready. |
| `https://pits-ng.dmp247.com` | PITS overview route. | Core API-backed project/installation overview after owner runtime sync. | Stage 1B code/tests ready. |
| `https://pits-ng.dmp247.com/projects` | Project selector route. | Core API-backed project selector and installation mapping after owner runtime sync. | Stage 1B code/tests ready. |
| `https://pits-ng.dmp247.com/runtime` | Runtime shell route. | Registry-aware runtime route after owner runtime sync. | Stage 1B code/tests ready. |

### Unchanged

| Endpoint | Status | Expected result |
|---|---|---|
| `https://ois-nextgen.abacusai.cloud/health` | `ABACUS_MANAGED_PUBLIC_STAGING` | Core API health remains current. |
| `https://ois-nextgen.abacusai.cloud/platform/overview` | `ABACUS_MANAGED_PUBLIC_STAGING` | DB-backed read-only Platform Overview remains current. |
| `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 live App Shell; do not touch. |
| `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 custom domain; do not touch. |

### Deprecated / Stopped

| Endpoint/process | Status | Reason |
|---|---|---|
| Hardcoded OIS/PITS registry cards | `DEPRECATED` | Stage 1B replaces them with Core API-backed read-only registry data. |

### Do Not Touch

| Endpoint/resource | Status | Reason |
|---|---|---|
| `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 custom domain. |
| `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 live App Shell. |
| `ois_phase1_dev` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 production-equivalent DB. |
| `emerald_bql_web_dev` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Emerald/BQL legacy DB. |
| Cloudflare tunnel token | Secret | Never document, print, store or commit. |

### Current Test Checklist

| Check | Command | Expected |
|---|---|---|
| Core API registry products | `curl -i https://ois-nextgen.abacusai.cloud/platform/products` | HTTP 200 with `source=default-db`, `mode=read-only`, `products`. |
| Core API registry aggregate | `curl -i https://ois-nextgen.abacusai.cloud/platform/registry` | HTTP 200 with products, projects, modules and installations arrays. |
| Public staging endpoint smoke | `bash ops/abacus/check-public-staging-endpoints.sh` | Core API, registry and OIS/PITS public marker checks pass. |
| Public staging runtime status | `bash ops/abacus/status-public-staging-runtime.sh` | Core API, UI services, token-safe cloudflared status, registry endpoints and route checks pass. |

## Safety Statement

- No Cloudflare dashboard change.
- No DNS change.
- No migrations.
- No seed.
- No `prisma db push`.
- No credentials committed.
- No UI `DATABASE_URL`.
- No Prisma imports in UI shells.
- No write/mutation endpoints.
- No `/auth/demo-login` change.
- No `ois.dmp247.com` modification.
- No `oisys.abacusai.app` modification.
- No legacy DB/storage/resource touch.

## Validation

| Command | Result |
|---|---|
| `bash -n ops/abacus/*.sh` | PASS. |
| `pnpm lint` | PASS. |
| `pnpm typecheck` | PASS. |
| `pnpm test` | PASS. |
| `pnpm -r --if-present build` | PASS. |
| `ops/abacus/verify-ui-route-manifests.sh` | PASS. |
| `git status -sb` | PASS; Stage 1B changes pending commit only. |
