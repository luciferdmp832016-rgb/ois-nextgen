# Stage 0V-B/C Cloudflare Tunnel Public Subdomains Verified

Stage 0V-B connector result: `CLOUDFLARE_TUNNEL_CONNECTOR_HEALTHY`.

Stage 0V-C public route result: `CLOUDFLARE_TUNNEL_PRODUCT_SUBDOMAINS_VERIFIED`.

## Objective

Document owner-executed Cloudflare Tunnel installation and public HTTPS verification for OIS NextGen OIS and PITS product staging subdomains.

This report records runtime evidence only. It does not include Cloudflare tunnel tokens, credentials, connector command secrets or local Abacus VM secret values.

## Baseline

| Item | Previous status |
|---|---|
| Stage 0U-A local nginx Host-header routing | `SUPERCOMPUTER_PRODUCT_SUBDOMAIN_LOCAL_ROUTING_READY`. |
| Stage 0U-A direct public CNAME to Abacus SuperComputer | `CUSTOM_SUBDOMAIN_TLS_BLOCKED`. |
| Stage 0V-A Cloudflare Tunnel plan | `CLOUDFLARE_TUNNEL_CUSTOM_SUBDOMAIN_PLAN_READY`. |
| Abacus direct custom-hostname support | `CUSTOM_HOSTNAME_NOT_SUPPORTED_FOR_SUPERCOMPUTER`; `CUSTOM_HOSTNAME_ONLY_SUPPORTED_FOR_MANAGED_APP_SHELLS`. |

Direct CNAME to the Abacus SuperComputer remains unsupported for public custom HTTPS. Cloudflare Tunnel is now the accepted custom subdomain path for SuperComputer-hosted UI shells.

## Cloudflare Tunnel Evidence

| Item | Evidence |
|---|---|
| Tunnel name | `ois-nextgen-abacus`. |
| Tunnel status | Healthy. |
| Active replicas | 1. |
| Routes | 2. |
| `cloudflared` version | `2026.6.1`. |
| Token handling | Token not documented, printed, stored or committed. |
| Connector/runtime state | Lives on Abacus VM and Cloudflare dashboard only. |

Tunnel routes:

| Public route | Tunnel target | Product |
|---|---|---|
| `https://ois-ng.dmp247.com` | `http://127.0.0.1:3000` | OIS Console |
| `https://pits-ng.dmp247.com` | `http://127.0.0.1:3001` | PITS Shell |

Optional later `api-ng.dmp247.com` remains uncreated and unverified.

## Public HTTPS Verification

| Endpoint | Result |
|---|---|
| `https://ois-ng.dmp247.com` | Opens OIS Console. |
| `https://ois-ng.dmp247.com/dashboard` | Opens OIS Platform Overview. |
| `https://pits-ng.dmp247.com` | Opens PITS Shell. |
| `https://pits-ng.dmp247.com/projects` | Opens PITS Project Selector. |

Verified app evidence:

| Evidence item | Result |
|---|---|
| OIS product code | `OIS_CONSOLE` displayed. |
| PITS product code | `PITS_SHELL` displayed. |
| Core API URL shown by both shells | `https://ois-nextgen.abacusai.cloud`. |
| Core API health shown by both shells | Healthy, HTTP 200. |
| DB access boundary | UI shells do not use `DATABASE_URL`; DB-backed demo data is accessed only through Core API. |

Seeded demo counts shown by both shells:

| Count | Value |
|---|---:|
| industries | 1 |
| organizations | 1 |
| workspaces | 1 |
| projects | 2 |
| products | 5 |
| installations | 2 |
| modules | 3 |
| auditRecords | 1 |

## Architecture Result

Cloudflare Tunnel solved the Abacus SuperComputer custom hostname/TLS blocker for the two SuperComputer-hosted UI shells.

The accepted custom subdomain path is now:

```text
dmp247.com HTTPS hostname
  -> Cloudflare TLS and Tunnel public hostname route
  -> outbound cloudflared connector on Abacus VM
  -> local SuperComputer service on 127.0.0.1
```

Current verified routing:

| Surface | Public route | Runtime target |
|---|---|---|
| OIS Console | `https://ois-ng.dmp247.com` | `http://127.0.0.1:3000` |
| PITS Shell | `https://pits-ng.dmp247.com` | `http://127.0.0.1:3001` |

The shared Core API remains on the Abacus-managed public staging domain:

```text
https://ois-nextgen.abacusai.cloud
```

Direct public CNAME to `ois-nextgen.abacusai.cloud` for SuperComputer custom hostnames remains unsupported and should not be reused as the public custom-domain strategy.

## Published Endpoint Delta

### Added

| Endpoint | Status | Expected result | Evidence |
|---|---|---|---|
| None | N/A | N/A | Stage 0V-B/C verifies planned endpoints; it does not add unrelated endpoints. |

### Changed

| Endpoint | Previous status/result | New status/result | Evidence |
|---|---|---|---|
| `https://ois-ng.dmp247.com` | `PLANNED_CLOUDFLARE_TUNNEL`. | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED`; opens OIS Console. | Owner runtime verification. |
| `https://pits-ng.dmp247.com` | `PLANNED_CLOUDFLARE_TUNNEL`. | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED`; opens PITS Shell. | Owner runtime verification. |
| `https://ois-ng.dmp247.com/dashboard` | `PLANNED_CLOUDFLARE_TUNNEL`. | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED`; opens OIS Platform Overview. | Owner runtime verification. |
| `https://pits-ng.dmp247.com/projects` | `PLANNED_CLOUDFLARE_TUNNEL`. | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED`; opens PITS Project Selector. | Owner runtime verification. |

### Unchanged

| Endpoint | Status | Expected result |
|---|---|---|
| `https://ois-nextgen.abacusai.cloud/health` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200 Core API health. |
| `https://ois-nextgen.abacusai.cloud/platform/overview` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200 DB-backed read-only platform overview with seeded counts. |
| `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 live App Shell; do not touch. |
| `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 custom domain; do not touch. |

### Deprecated / Stopped

| Endpoint | Status | Reason |
|---|---|---|
| Direct CNAME-to-Abacus custom hostname strategy | `DEPRECATED` | Abacus SuperComputer custom hostname/TLS is unsupported. Use Cloudflare Tunnel for SuperComputer-hosted UI shell custom subdomains. |

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
| OIS public tunnel root | `curl -i https://ois-ng.dmp247.com` | HTTP 200 OIS Console. |
| OIS public tunnel dashboard | `curl -i https://ois-ng.dmp247.com/dashboard` | HTTP 200 OIS Platform Overview. |
| PITS public tunnel root | `curl -i https://pits-ng.dmp247.com` | HTTP 200 PITS Shell. |
| PITS public tunnel projects | `curl -i https://pits-ng.dmp247.com/projects` | HTTP 200 PITS Project Selector. |
| Core API staging health | `curl -i https://ois-nextgen.abacusai.cloud/health` | HTTP 200 and Core API health payload. |
| DB-backed platform overview | `curl -i https://ois-nextgen.abacusai.cloud/platform/overview` | HTTP 200, demo banner and seeded counts. |

## Security Statement

- Cloudflare tunnel token was not documented.
- Cloudflare tunnel token was not printed.
- Cloudflare tunnel token was not stored in the repo.
- No Cloudflare connector credential file was committed.
- Cloudflare connector/runtime state lives only on Abacus VM and Cloudflare dashboard.
- No migrations.
- No seed.
- No `prisma db push`.
- No production DB/storage/OpenRouter credentials.
- No `ois.dmp247.com` modification.
- No `oisys.abacusai.app` modification.
- No OIS Phase 1 or Emerald/BQL DB/storage touch.

## Decision

Stage 0V-B is marked `CLOUDFLARE_TUNNEL_CONNECTOR_HEALTHY`.

Stage 0V-C is marked `CLOUDFLARE_TUNNEL_PRODUCT_SUBDOMAINS_VERIFIED`.

Recommended next stage: Stage 0W-A - Public Staging UI Smoke Stabilization / Owner Acceptance Checklist.

## Validation

| Command | Result |
|---|---|
| `pnpm lint` | PASS. |
| `pnpm typecheck` | PASS. |
| `pnpm test` | PASS. |
| `pnpm -r --if-present build` | PASS. |
| `git status -sb` | PASS; Stage 0V-B/C documentation changes pending commit only. |
