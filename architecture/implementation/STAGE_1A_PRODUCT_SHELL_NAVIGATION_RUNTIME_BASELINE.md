# Stage 1A Product Shell Navigation Runtime Baseline

Stage 1A result: `PRODUCT_SHELL_NAVIGATION_BASELINE_READY`.

## Objective

Create the first real product shell navigation baseline for OIS Console and PITS Shell on top of the operational public staging runtime.

Stage 1A is a safe product-shell code, test, ops-check and documentation commit. It does not deploy from Codex, modify Cloudflare dashboard, modify DNS, run migrations, run seed, run `prisma db push`, commit credentials or touch legacy resources.

## Baseline

Stage 0W-B owner/Abacus runtime evidence confirmed:

| Item | Status |
|---|---|
| Core API | `ois-nextgen-core-api` active. |
| OIS Console | `ois-nextgen-ois-console` active on port 3000. |
| PITS Shell | `ois-nextgen-pits-shell` active on port 3001. |
| Cloudflare Tunnel | `ois-nextgen-abacus` active. |
| Public OIS root | `https://ois-ng.dmp247.com` PASS. |
| Public OIS dashboard | `https://ois-ng.dmp247.com/dashboard` PASS. |
| Public PITS root | `https://pits-ng.dmp247.com` PASS. |
| Public PITS projects | `https://pits-ng.dmp247.com/projects` PASS. |
| Public endpoint script | `check-public-staging-endpoints.sh` PASS. |

## Product Shell Changes

### OIS Console

Updated `apps/ois-console` from a demo/status root into a product administration shell with:

- Product header.
- Left navigation.
- Staging/demo banner.
- Core API source indicator.
- Platform Overview Counts card.
- Product & Module Overview area.
- Runtime Status card.
- Data access boundary statement.

Routes added or updated:

| Route | Purpose |
|---|---|
| `/` | Product administration overview. |
| `/dashboard` | Platform overview dashboard. |
| `/products` | Product and module catalog baseline. |
| `/workspaces` | Organization/workspace/project baseline. |
| `/runtime` | Runtime status baseline. |

### PITS Shell

Updated `apps/pits-shell` from a demo/status root into a product runtime shell with:

- Product header.
- Top navigation.
- Staging/demo banner.
- Core API source indicator.
- Project Selector baseline.
- Project overview cards.
- Platform Overview Counts panel.
- Runtime Status card.
- Data access boundary statement.

Routes added or updated:

| Route | Purpose |
|---|---|
| `/` | Project runtime overview. |
| `/projects` | Project selector baseline. |
| `/runtime` | Runtime status baseline. |

## Data Contract

Both UI shells use Core API only:

- `https://ois-nextgen.abacusai.cloud/health`
- `https://ois-nextgen.abacusai.cloud/platform/overview`

Shared helpers in `@ois/shared-ui` now provide:

- Core API URL resolution from `CORE_API_URL` or `NEXT_PUBLIC_CORE_API_URL`.
- Health fetch.
- Platform overview fetch.
- Kernel count extraction.
- `PLATFORM_KERNEL` gate extraction.

The UI shells do not use `DATABASE_URL`, do not import Prisma and do not connect to the database directly.

## Ops Updates

Updated:

- `ops/abacus/check-public-staging-endpoints.sh`
- `ops/abacus/status-public-staging-runtime.sh`

New route checks after owner runtime sync:

| Endpoint | Expected marker checks |
|---|---|
| `https://ois-ng.dmp247.com/products` | `Products & Modules`, `Product & Module Overview`, `OIS_CONSOLE`. |
| `https://ois-ng.dmp247.com/workspaces` | `Organizations, Workspaces & Projects`, `Workspace Overview`, `OIS_CONSOLE`. |
| `https://ois-ng.dmp247.com/runtime` | `Runtime Status`, `Core API source:`, `OIS_CONSOLE`. |
| `https://pits-ng.dmp247.com/runtime` | `Runtime Status`, `Core API source:`, `PITS_SHELL`. |

Existing root checks continue to verify product markers, Core API URL and seeded counts.

## Published Endpoint Delta

### Added

| Endpoint | Status | Expected result | Evidence |
|---|---|---|---|
| `https://ois-ng.dmp247.com/products` | `PLANNED_NOT_CREATED` | OIS Console Products & Modules route after owner runtime sync. | Stage 1A code and ops checks ready; not deployed from Codex. |
| `https://ois-ng.dmp247.com/workspaces` | `PLANNED_NOT_CREATED` | OIS Console workspace route after owner runtime sync. | Stage 1A code and ops checks ready; not deployed from Codex. |
| `https://ois-ng.dmp247.com/runtime` | `PLANNED_NOT_CREATED` | OIS Console runtime route after owner runtime sync. | Stage 1A code and ops checks ready; not deployed from Codex. |
| `https://pits-ng.dmp247.com/runtime` | `PLANNED_NOT_CREATED` | PITS Shell runtime route after owner runtime sync. | Stage 1A code and ops checks ready; not deployed from Codex. |

### Changed

| Endpoint | Previous status/result | New status/result | Evidence |
|---|---|---|---|
| `https://ois-ng.dmp247.com` | Demo/status root. | Product administration overview shell after owner runtime sync. | Stage 1A code ready; public verification pending runtime sync. |
| `https://ois-ng.dmp247.com/dashboard` | Dashboard route. | Product-shell dashboard with Core API-sourced Platform Overview after owner runtime sync. | Stage 1A code ready; public verification pending runtime sync. |
| `https://pits-ng.dmp247.com` | Demo/status root. | Project runtime overview shell after owner runtime sync. | Stage 1A code ready; public verification pending runtime sync. |
| `https://pits-ng.dmp247.com/projects` | Project selector route. | Product-shell project selector with Core API-sourced runtime context after owner runtime sync. | Stage 1A code ready; public verification pending runtime sync. |

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
| Temporary demo/status-only root pages | `DEPRECATED` | Stage 1A replaces them with product-shell navigation baselines. |

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
| Public staging runtime status after owner sync | `bash ops/abacus/status-public-staging-runtime.sh` | Core API, OIS Console, PITS Shell, token-safe cloudflared status and expanded route checks pass. |
| Public endpoint smoke after owner sync | `bash ops/abacus/check-public-staging-endpoints.sh` | Core API, OIS and PITS public marker/count checks pass across the Stage 1A routes. |

## Safety Statement

- No Cloudflare dashboard change.
- No DNS change.
- No migrations.
- No seed.
- No `prisma db push`.
- No credentials committed.
- No `DATABASE_URL` usage in UI shells.
- No Prisma imports in UI shells.
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
| `git status -sb` | PASS; Stage 1A safe product-shell changes pending commit only. |
