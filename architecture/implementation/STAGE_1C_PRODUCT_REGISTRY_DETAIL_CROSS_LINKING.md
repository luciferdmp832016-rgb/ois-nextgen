# Stage 1C Product Registry Detail Cross-Linking

Stage 1C result: `PRODUCT_REGISTRY_DETAIL_CROSS_LINKING_READY`.

## Objective

Add read-only Product Registry detail views and cross-product links between OIS Console and PITS Shell on top of the Stage 1B read-only registry aggregate.

Stage 1C is a read-only API/UI/ops/test change. It does not deploy from Codex, modify Cloudflare dashboard, modify DNS, run migrations, run seed, run `prisma db push`, commit credentials, use UI `DATABASE_URL`, call write endpoints, call `/auth/demo-login`, touch legacy resources or inspect row data outside approved read-only registry responses.

## Runtime Baseline

Stage 1A-R2 owner evidence verified the public product shell route baseline:

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

Stage 1B added source-ready read-only Platform Registry aggregate/list endpoints. Stage 1C extends that surface with detail endpoints and UI detail routes. Owner runtime sync is still required before claiming public HTTP 200 for the new Stage 1C endpoints.

## Core API

Added read-only registry detail endpoints:

| Endpoint | Purpose |
|---|---|
| `GET /platform/products/:id` | Product detail by product ID with module, installation, project and workspace relationships. |
| `GET /platform/products/code/:code` | Product detail by product code with the same relationship context. |
| `GET /platform/workspaces/:id` | Workspace detail with organization, project and installation relationships. |
| `GET /platform/projects/:id` | Project detail with organization, workspace and installation relationships. |
| `GET /platform/modules/:id` | Module detail with owning product and related installations. |
| `GET /platform/installations/:id` | Product installation detail with product, organization, workspace, project and module relationships. |

Each success response includes the existing registry metadata:

```json
{
  "source": "default-db",
  "mode": "read-only",
  "environment": "staging",
  "generatedAt": "<ISO timestamp>"
}
```

Missing details return a controlled HTTP 404 with metadata plus:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "entity": "<product|workspace|project|module|installation>",
    "lookup": { "id": "<requested-id>" }
  }
}
```

The implementation builds details from the existing read-only registry snapshot. It does not add writes, migrations, seeds, schema changes, production-resource references or mutation-style routes.

## UI Cross-Linking

Extended `@ois/shared-ui` with:

- Detail response types for products, workspaces, projects, modules and installations.
- Detail fetch helpers that call Core API only.
- Cross-product URL helpers with safe staging defaults:
  - `OIS_PUBLIC_BASE_URL` or `NEXT_PUBLIC_OIS_PUBLIC_BASE_URL`, default `https://ois-ng.dmp247.com`.
  - `PITS_PUBLIC_BASE_URL` or `NEXT_PUBLIC_PITS_PUBLIC_BASE_URL`, default `https://pits-ng.dmp247.com`.

Added OIS Console detail routes:

| Route | Detail surface |
|---|---|
| `/products/[id]` | Product detail with modules, installations and PITS project links. |
| `/workspaces/[id]` | Workspace detail with products and PITS project links. |
| `/modules/[id]` | Module detail with owning product and installation links. |
| `/installations/[id]` | Installation detail with product, workspace, module and PITS project links. |

Added PITS Shell detail route:

| Route | Detail surface |
|---|---|
| `/projects/[id]` | Project detail with installation context and OIS product/workspace links. |

Updated existing OIS/PITS list and dashboard pages so registry cards link to their detail pages after owner runtime sync.

## Ops

Updated public staging scripts:

- `ops/abacus/lib-public-staging-runtime.sh` discovers seeded registry IDs from `/platform/registry`.
- `ops/abacus/check-public-staging-endpoints.sh` checks Core API detail endpoints, controlled 404s and public UI detail routes when IDs are available.
- `ops/abacus/status-public-staging-runtime.sh` checks local and public detail routes after service status and registry discovery.
- `ops/abacus/verify-ui-route-manifests.sh` now verifies Stage 1A and Stage 1C static and dynamic Next route artifacts.

Owner runtime sync after Stage 1C merge:

```sh
cd /home/ubuntu/ois-nextgen
git fetch origin
git checkout stage-0b-complete-handoff-ingestion
git pull --ff-only
PUBLIC_STAGING_RESTART_SCOPE=all bash ops/abacus/runtime-sync.sh
bash ops/abacus/status-public-staging-runtime.sh
bash ops/abacus/check-public-staging-endpoints.sh
```

Expected API detail checks after owner runtime sync:

```sh
curl -i https://ois-nextgen.abacusai.cloud/platform/products/<product-id>
curl -i https://ois-nextgen.abacusai.cloud/platform/products/code/<product-code>
curl -i https://ois-nextgen.abacusai.cloud/platform/workspaces/<workspace-id>
curl -i https://ois-nextgen.abacusai.cloud/platform/projects/<project-id>
curl -i https://ois-nextgen.abacusai.cloud/platform/modules/<module-id>
curl -i https://ois-nextgen.abacusai.cloud/platform/installations/<installation-id>
```

Expected public UI detail checks after owner runtime sync:

```sh
curl -i https://ois-ng.dmp247.com/products/<product-id>
curl -i https://ois-ng.dmp247.com/workspaces/<workspace-id>
curl -i https://ois-ng.dmp247.com/modules/<module-id>
curl -i https://ois-ng.dmp247.com/installations/<installation-id>
curl -i https://pits-ng.dmp247.com/projects/<project-id>
```

## Tests

Added/extended local tests for:

- Core API detail endpoint success responses.
- Core API controlled detail 404 responses.
- Read-only Prisma behavior for detail routes.
- OIS Console product/workspace/module/installation detail pages.
- PITS Shell project detail page.
- Cross-product staging links between OIS and PITS.
- Static UI guards blocking `DATABASE_URL`, legacy DB names and legacy production endpoint references in UI packages.
- Production route manifest checks for Stage 1C dynamic routes.

## Published Endpoint Delta

### Added

| Endpoint | Status | Expected result | Evidence |
|---|---|---|---|
| `https://ois-nextgen.abacusai.cloud/platform/products/{id}` | `PLANNED_NOT_CREATED` | HTTP 200 read-only product detail after owner runtime sync. | Stage 1C source/tests ready; not deployed from Codex. |
| `https://ois-nextgen.abacusai.cloud/platform/products/code/{code}` | `PLANNED_NOT_CREATED` | HTTP 200 read-only product detail by product code after owner runtime sync. | Stage 1C source/tests ready; not deployed from Codex. |
| `https://ois-nextgen.abacusai.cloud/platform/workspaces/{id}` | `PLANNED_NOT_CREATED` | HTTP 200 read-only workspace detail after owner runtime sync. | Stage 1C source/tests ready; not deployed from Codex. |
| `https://ois-nextgen.abacusai.cloud/platform/projects/{id}` | `PLANNED_NOT_CREATED` | HTTP 200 read-only project detail after owner runtime sync. | Stage 1C source/tests ready; not deployed from Codex. |
| `https://ois-nextgen.abacusai.cloud/platform/modules/{id}` | `PLANNED_NOT_CREATED` | HTTP 200 read-only module detail after owner runtime sync. | Stage 1C source/tests ready; not deployed from Codex. |
| `https://ois-nextgen.abacusai.cloud/platform/installations/{id}` | `PLANNED_NOT_CREATED` | HTTP 200 read-only installation detail after owner runtime sync. | Stage 1C source/tests ready; not deployed from Codex. |
| `https://ois-ng.dmp247.com/products/{id}` | `PLANNED_NOT_CREATED` | OIS product detail page after owner runtime sync. | Stage 1C source/tests ready; not deployed from Codex. |
| `https://ois-ng.dmp247.com/workspaces/{id}` | `PLANNED_NOT_CREATED` | OIS workspace detail page after owner runtime sync. | Stage 1C source/tests ready; not deployed from Codex. |
| `https://ois-ng.dmp247.com/modules/{id}` | `PLANNED_NOT_CREATED` | OIS module detail page after owner runtime sync. | Stage 1C source/tests ready; not deployed from Codex. |
| `https://ois-ng.dmp247.com/installations/{id}` | `PLANNED_NOT_CREATED` | OIS installation detail page after owner runtime sync. | Stage 1C source/tests ready; not deployed from Codex. |
| `https://pits-ng.dmp247.com/projects/{id}` | `PLANNED_NOT_CREATED` | PITS project detail page after owner runtime sync. | Stage 1C source/tests ready; not deployed from Codex. |

### Changed

| Endpoint | Previous status/result | New status/result | Evidence |
|---|---|---|---|
| `https://ois-ng.dmp247.com/dashboard` | Registry-aware dashboard. | Adds links to first product, workspace, module and installation detail pages after owner runtime sync. | Stage 1C code/tests ready. |
| `https://ois-ng.dmp247.com/products` | Core API-backed products/modules list. | Product and module cards link to detail routes after owner runtime sync. | Stage 1C code/tests ready. |
| `https://ois-ng.dmp247.com/workspaces` | Core API-backed workspace/project list. | Workspace cards link to detail routes after owner runtime sync. | Stage 1C code/tests ready. |
| `https://pits-ng.dmp247.com/projects` | Core API-backed project selector. | Project cards link to PITS project detail pages with OIS cross-links after owner runtime sync. | Stage 1C code/tests ready. |

### Unchanged

| Endpoint | Status | Expected result |
|---|---|---|
| `https://ois-nextgen.abacusai.cloud/health` | `ABACUS_MANAGED_PUBLIC_STAGING` | Core API health remains current. |
| `https://ois-nextgen.abacusai.cloud/platform/overview` | `ABACUS_MANAGED_PUBLIC_STAGING` | DB-backed read-only Platform Overview remains current. |
| `https://ois-ng.dmp247.com` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | OIS Console public staging root remains current. |
| `https://pits-ng.dmp247.com` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | PITS Shell public staging root remains current. |
| `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 live App Shell; do not touch. |
| `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 custom domain; do not touch. |

### Deprecated / Stopped

| Endpoint/process | Status | Reason |
|---|---|---|
| None | N/A | Stage 1C adds details and links only. |

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
| Public staging runtime status | `bash ops/abacus/status-public-staging-runtime.sh` | Core API, UI services, token-safe cloudflared status, registry detail APIs and detail UI routes pass after owner sync. |
| Public staging endpoint smoke | `bash ops/abacus/check-public-staging-endpoints.sh` | Core API, registry list/detail APIs, controlled 404s and OIS/PITS public detail markers pass after owner sync. |
| UI route manifest guard | `REPO_DIR=$(pwd) bash ops/abacus/verify-ui-route-manifests.sh` | `UI_ROUTE_MANIFEST_CHECK_PASSED` for Stage 1A and Stage 1C routes. |

## Safety Statement

- No Cloudflare dashboard change.
- No DNS change.
- No deploy from Codex.
- No migrations.
- No seed.
- No `prisma db push`.
- No credentials committed.
- No UI `DATABASE_URL`.
- No Prisma imports in UI shells.
- No write/mutation endpoints.
- No `/auth/demo-login` call or change.
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
| `REPO_DIR=$(pwd) bash ops/abacus/verify-ui-route-manifests.sh` | PASS. |
| `git status -sb` | PASS; Stage 1C changes pending commit only. |
