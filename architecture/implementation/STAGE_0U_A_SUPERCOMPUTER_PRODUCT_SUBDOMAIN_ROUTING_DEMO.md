# Stage 0U-A SuperComputer Product Subdomain Routing Demo

Stage 0U-A local result: `PRODUCT_SUBDOMAIN_ROUTING_DEMO_OPS_READY`.

Owner-run success label after Abacus local Host-header verification: `SUPERCOMPUTER_PRODUCT_SUBDOMAIN_LOCAL_ROUTING_READY`.

## Baseline

| Item | Result |
|---|---|
| Branch | `stage-0u-a-supercomputer-product-subdomain-routing-demo` |
| Base commit | `0e1ce3fb47da3ba1ccfc5f54a905e1aa637bab31` |
| Prior stage | Stage 0T-E-A-R1 `OIS_CONSOLE_UPLOAD_BUNDLE_READY` |
| Objective | Create safe ops scripts and documentation for a SuperComputer-hosted OIS/PITS product subdomain routing demo using nginx host-based routing. |
| Local task type | Safe ops scripts and documentation only. No Abacus deploy, nginx reload, DNS change, migration, seed or runtime mutation from this workspace. |

Stage 0U-A prepares the owner-run SuperComputer path to prove OIS and PITS can run as two separate product shells under `dmp247.com` staging subdomains while both call the same Core API and read the same `default` DB only through Core API.

## Target Topology

| Surface | Host/path | Runtime target | Notes |
|---|---|---|---|
| Core API | `https://ois-nextgen.abacusai.cloud` | Existing Abacus SuperComputer nginx/systemd Core API on local port `4000`. | Unchanged. |
| OIS Console demo | `https://ois-ng.dmp247.com` | nginx host route to `http://127.0.0.1:3000`. | Planned staging subdomain only; do not touch `ois.dmp247.com`. |
| PITS Shell demo | `https://pits-ng.dmp247.com` | nginx host route to `http://127.0.0.1:3001`. | Planned staging subdomain only. |

Both UI shells must use:

```text
CORE_API_URL=https://ois-nextgen.abacusai.cloud
NEXT_PUBLIC_CORE_API_URL=https://ois-nextgen.abacusai.cloud
```

Neither UI shell may set `DATABASE_URL` or `ABACUS_DATABASE_URL`.

## DNS Principle

DNS CNAME maps hostnames only, not URL paths.

Allowed owner DNS examples:

```text
ois-ng.dmp247.com  CNAME  ois-nextgen.abacusai.cloud
pits-ng.dmp247.com CNAME  ois-nextgen.abacusai.cloud
```

Invalid DNS goal:

```text
ois-ng.dmp247.com -> ois-nextgen.abacusai.cloud/ois
```

Path and product routing are nginx/app concerns, not DNS concerns.

## Scripts Added

| Script | Purpose | Mutates runtime when owner runs it? |
|---|---|---|
| `ops/abacus/enable-product-subdomain-demo-routes.sh` | Writes `/etc/nginx/conf.d/ois-nextgen-product-subdomains.conf`, validates nginx and reloads nginx unless `--no-reload` is used. | Yes, nginx config only. |
| `ops/abacus/disable-product-subdomain-demo-routes.sh` | Removes only the Stage 0U-A managed nginx config after verifying its marker, validates nginx and reloads nginx unless `--no-reload` is used. | Yes, nginx config only. |
| `ops/abacus/status-product-subdomain-demo-routes.sh` | Read-only verification for local Host-header routing and optional public DNS/TLS checks. | No. |

The existing UI demo shell scripts already run OIS Console on port `3000` and PITS Shell on port `3001` with `DATABASE_URL` and `ABACUS_DATABASE_URL` unset, so Stage 0U-A did not change them.

## Nginx Contract

The enable script creates this dedicated config path only:

```text
/etc/nginx/conf.d/ois-nextgen-product-subdomains.conf
```

Managed route intent:

| server_name | Proxy target |
|---|---|
| `ois-ng.dmp247.com` | `http://127.0.0.1:3000` |
| `pits-ng.dmp247.com` | `http://127.0.0.1:3001` |

The config does not define `default_server` and does not modify the existing Core API route on `ois-nextgen.abacusai.cloud`. It should not break `/health`, `/platform/overview` or `/api/` on the existing Core API host.

## Owner-Run Sequence

From the Abacus SuperComputer Web Terminal:

```sh
cd /home/ubuntu/ois-nextgen
bash ops/abacus/start-ui-demo-shells.sh
bash ops/abacus/enable-product-subdomain-demo-routes.sh
bash ops/abacus/status-product-subdomain-demo-routes.sh
```

If local Host-header checks pass, the expected status label is:

```text
SUPERCOMPUTER_PRODUCT_SUBDOMAIN_LOCAL_ROUTING_READY
```

After owner-controlled DNS CNAME records are configured, run:

```sh
bash ops/abacus/status-product-subdomain-demo-routes.sh --include-public
```

Possible public outcomes:

| Label | Meaning |
|---|---|
| `SUPERCOMPUTER_PRODUCT_SUBDOMAIN_PUBLIC_DEMO_VERIFIED` | Public DNS + HTTPS routes serve both expected product shells. |
| `CUSTOM_SUBDOMAIN_HTTP_OK_TLS_BLOCKED` | HTTP route works but HTTPS fails, likely certificate/edge/TLS configuration. |
| `CUSTOM_SUBDOMAIN_TLS_BLOCKED` | HTTPS fails before a valid product shell response and HTTP did not validate either. |
| `CUSTOM_SUBDOMAIN_BLOCKED_BY_ABACUS_EDGE` | Abacus edge returns blocking/non-product responses for the custom host. |

Rollback/disable:

```sh
bash ops/abacus/disable-product-subdomain-demo-routes.sh
bash ops/abacus/stop-ui-demo-shells.sh
```

## Published Endpoint Delta

### Added Planned

| Endpoint | Status | Expected result | Evidence |
|---|---|---|---|
| `https://ois-ng.dmp247.com` | `PLANNED_NOT_CREATED` | OIS Console product shell, `OIS_CONSOLE`, shared Core API URL and seeded counts after owner DNS/nginx checks. | Stage 0U-A scripts/docs only; no DNS or public route configured locally. |
| `https://pits-ng.dmp247.com` | `PLANNED_NOT_CREATED` | PITS Shell product shell, `PITS_SHELL`, shared Core API URL and seeded counts after owner DNS/nginx checks. | Stage 0U-A scripts/docs only; no DNS or public route configured locally. |
| `https://ois-ng.dmp247.com/dashboard` | `PLANNED_NOT_CREATED` | OIS Console dashboard HTTP 200 after owner DNS/nginx checks. | Stage 0U-A scripts/docs only. |
| `https://pits-ng.dmp247.com/projects` | `PLANNED_NOT_CREATED` | PITS Shell projects HTTP 200 after owner DNS/nginx checks. | Stage 0U-A scripts/docs only. |

### Changed

| Endpoint | Previous status/result | New status/result | Evidence |
|---|---|---|---|
| None | N/A | N/A | Stage 0U-A does not alter existing endpoints. |

### Unchanged

| Endpoint | Status | Expected result |
|---|---|---|
| `https://ois-nextgen.abacusai.cloud/health` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200 Core API health. |
| `https://ois-nextgen.abacusai.cloud/platform/overview` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200 DB-backed read-only platform overview with seeded counts. |
| `https://113d93f4db-3001.na116.preview.abacusai.app` | `ABACUS_APP_SHELL_PREVIEW_PUBLIC` | HTTP 200 PITS Shell App Shell preview. |
| `https://161acd4ff8.na116.preview.abacusai.app` | `OIS_CONSOLE_APP_SHELL_PREVIEW_UNAVAILABLE_404` | OIS Console App Shell preview remains unavailable until restored/redeployed. |
| `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 live App Shell; do not touch. |
| `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 custom domain; do not touch. |

### Deprecated / stopped

| Endpoint | Status | Reason |
|---|---|---|
| None | N/A | No endpoint was deprecated or stopped. |

### Do Not Touch

| Endpoint/resource | Status | Reason |
|---|---|---|
| `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 custom domain; not a staging demo target. |
| `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 live App Shell. |
| `ois_phase1_dev` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 production-equivalent DB. |
| `emerald_bql_web_dev` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Emerald/BQL legacy DB. |
| Production storage and legacy storage prefixes | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Not part of Stage 0U-A. |

### Current Test Checklist

| Check | Command | Expected |
|---|---|---|
| Local OIS Host-header route | `curl -H "Host: ois-ng.dmp247.com" http://127.0.0.1/` | HTTP 200 OIS Console root demo page with `OIS_CONSOLE`, Core API URL and seeded counts. |
| Local PITS Host-header route | `curl -H "Host: pits-ng.dmp247.com" http://127.0.0.1/` | HTTP 200 PITS Shell root demo page with `PITS_SHELL`, Core API URL and seeded counts. |
| Public OIS root after DNS | `curl -i https://ois-ng.dmp247.com` | HTTP 200 after owner DNS/TLS/routing succeeds. |
| Public PITS root after DNS | `curl -i https://pits-ng.dmp247.com` | HTTP 200 after owner DNS/TLS/routing succeeds. |
| Public OIS dashboard after DNS | `curl -i https://ois-ng.dmp247.com/dashboard` | HTTP 200 after owner DNS/TLS/routing succeeds. |
| Public PITS projects after DNS | `curl -i https://pits-ng.dmp247.com/projects` | HTTP 200 after owner DNS/TLS/routing succeeds. |

## Safety Statement

Stage 0U-A preserves these rules:

- No deploy from this workspace.
- No Abacus runtime modification from this workspace.
- No DNS record modification.
- No migrations.
- No seed.
- No `prisma db push`.
- No Core API DB/runtime logic changes.
- No `DATABASE_URL` in UI shells.
- No production credentials.
- No OpenRouter usage.
- No `ois.dmp247.com` modification.
- No `oisys.abacusai.app` modification.
- No OIS Phase 1 or Emerald/BQL database touch.
- No production or legacy storage touch.

## Decision

Stage 0U-A local Codex work is marked `PRODUCT_SUBDOMAIN_ROUTING_DEMO_OPS_READY`.

Do not mark `SUPERCOMPUTER_PRODUCT_SUBDOMAIN_LOCAL_ROUTING_READY` until `status-product-subdomain-demo-routes.sh` passes on the Abacus SuperComputer after UI shells and nginx routes are enabled.

Recommended next stage: Stage 0U-A-R1 - Owner Web Terminal Local Host-Header Product Subdomain Routing Evidence.

## Validation

| Command | Result |
|---|---|
| `bash -n ops/abacus/*.sh` | PASS using Git Bash at `C:\Program Files\Git\bin\bash.exe`. Plain `bash` on this Windows host resolves to a broken WSL relay, so Git Bash was invoked explicitly. |
| `pnpm lint` | PASS; architecture guard passed. |
| `pnpm typecheck` | PASS; `tsc -p tsconfig.check.json --noEmit`. |
| `pnpm test` | PASS; 5 files, 25 tests. Expected mocked HTTP 500 log line came from deliberate Core API DB-error-path test. |
| `pnpm -r --if-present build` | PASS; Core API TypeScript build and OIS Console/PITS Shell Next builds completed. |
| `git status -sb` | PASS; Stage 0U-A safe ops/docs changes pending commit only, generated `artifacts/` ignored. |
