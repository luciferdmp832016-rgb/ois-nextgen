# Stage 0V-A Cloudflare Tunnel Custom Subdomain Plan

Stage 0V-A result: `CLOUDFLARE_TUNNEL_CUSTOM_SUBDOMAIN_PLAN_READY`.

## Objective

Create a documentation-only plan to resolve the Stage 0U-A public custom subdomain blocker for SuperComputer-hosted OIS and PITS product shells by using Cloudflare Tunnel.

Stage 0V-A does not install `cloudflared`, modify DNS, deploy, run migrations, run seed, run `prisma db push`, touch legacy endpoints or commit Cloudflare credentials.

## Baseline

| Item | Status |
|---|---|
| Stage 0U-A local Host-header routing | `SUPERCOMPUTER_PRODUCT_SUBDOMAIN_LOCAL_ROUTING_READY`. |
| Stage 0U-A public custom subdomains | `CUSTOM_SUBDOMAIN_TLS_BLOCKED`. |
| Abacus confirmation | `CUSTOM_HOSTNAME_NOT_SUPPORTED_FOR_SUPERCOMPUTER`; `CUSTOM_HOSTNAME_ONLY_SUPPORTED_FOR_MANAGED_APP_SHELLS`. |
| Current OIS local route | `Host: ois-ng.dmp247.com` -> `http://127.0.0.1:3000`, HTTP 200, `OIS_CONSOLE`, seeded counts. |
| Current PITS local route | `Host: pits-ng.dmp247.com` -> `http://127.0.0.1:3001`, HTTP 200, `PITS_SHELL`, seeded counts. |
| Current Core API | `https://ois-nextgen.abacusai.cloud`; `/health` and `/platform/overview` remain active staging endpoints. |

Direct CNAME from `ois-ng.dmp247.com` and `pits-ng.dmp247.com` to `ois-nextgen.abacusai.cloud` is not enough for public HTTPS because the Abacus SuperComputer edge does not register those custom hostnames or terminate their TLS.

## Selected Topology

Cloudflare Tunnel becomes the custom-domain transport layer only. GitHub/Codex remains the source-of-truth plane, and Abacus SuperComputer remains the runtime plane.

| Public hostname | Tunnel target | Product |
|---|---|---|
| `https://ois-ng.dmp247.com` | `http://127.0.0.1:3000` | OIS Console |
| `https://pits-ng.dmp247.com` | `http://127.0.0.1:3001` | PITS Shell |
| `https://api-ng.dmp247.com` | `http://127.0.0.1:4000` | Optional later Core API custom staging route; not part of Stage 0V-A execution. |

Cloudflare terminates public TLS for the `dmp247.com` hostnames and forwards traffic over an outbound `cloudflared` connector running on the Abacus SuperComputer. This avoids the unsupported Abacus SuperComputer custom-hostname path.

## Required Owner Inputs

| Input | Required for execution? | Notes |
|---|---|---|
| Cloudflare account with `dmp247.com` zone access | Yes | Owner-controlled; Codex must not use production credentials. |
| Named tunnel | Yes | Recommended name: `ois-nextgen-supercomputer-staging`. |
| Tunnel connector token | Yes | Secret. Never commit, print, screenshot into docs or paste into shared logs. |
| Public hostname routes | Yes | `ois-ng.dmp247.com` and `pits-ng.dmp247.com`; optional later `api-ng.dmp247.com`. |
| Abacus Web Terminal access | Yes | Used only in a later execution stage to install/run connector if owner approves. |
| OIS/PITS UI shells running locally | Yes for verification | Existing Stage 0S/0U scripts can start and verify local ports. |

## Planned Cloudflare Dashboard Steps

These are owner-run future steps, not Stage 0V-A execution:

1. Open Cloudflare Zero Trust / Cloudflare dashboard for the `dmp247.com` account.
2. Create a named Cloudflare Tunnel for OIS NextGen staging.
3. Choose the Linux connector instructions for `cloudflared`.
4. Store the tunnel token only in the owner-controlled Cloudflare/Abacus operational context. Do not commit it.
5. Add public hostname route `ois-ng.dmp247.com` with service URL `http://127.0.0.1:3000`.
6. Add public hostname route `pits-ng.dmp247.com` with service URL `http://127.0.0.1:3001`.
7. Leave `api-ng.dmp247.com` uncreated until a later owner-approved API custom-domain stage.
8. Let Cloudflare manage the tunnel DNS records, or update DNS only as directed by the Cloudflare Tunnel route flow.
9. Run a later controlled Abacus Web Terminal execution stage to install/start `cloudflared`.
10. Validate public HTTPS only after local OIS/PITS services and the tunnel connector are healthy.

## Planned Abacus Execution Gate

A later Stage 0V-B or equivalent may execute only if all are true:

- Owner approves Cloudflare Tunnel execution.
- The tunnel token is available only in the Cloudflare dashboard or owner-controlled secure context.
- `cloudflared` install command is taken from the Cloudflare dashboard at execution time.
- OIS Console is running on `127.0.0.1:3000`.
- PITS Shell is running on `127.0.0.1:3001`.
- Core API remains unchanged on `https://ois-nextgen.abacusai.cloud`.
- No migrations, seed, `prisma db push`, write endpoints or legacy endpoint changes are needed.

## Validation Checklist For Later Execution

Pre-tunnel local checks:

| Check | Expected |
|---|---|
| `curl -H "Host: ois-ng.dmp247.com" http://127.0.0.1/` on Abacus | HTTP 200 with `OIS_CONSOLE`, Core API URL and seeded counts. |
| `curl -H "Host: pits-ng.dmp247.com" http://127.0.0.1/` on Abacus | HTTP 200 with `PITS_SHELL`, Core API URL and seeded counts. |
| Core API public health | `https://ois-nextgen.abacusai.cloud/health` remains HTTP 200. |
| Core API platform overview | `https://ois-nextgen.abacusai.cloud/platform/overview` remains HTTP 200 with seeded counts. |

Post-tunnel public checks:

| Check | Expected |
|---|---|
| `https://ois-ng.dmp247.com` | HTTP 200 OIS Console demo shell. |
| `https://ois-ng.dmp247.com/dashboard` | HTTP 200 OIS Console route. |
| `https://pits-ng.dmp247.com` | HTTP 200 PITS Shell demo shell. |
| `https://pits-ng.dmp247.com/projects` | HTTP 200 PITS Shell route. |
| Legacy domains | `https://ois.dmp247.com` and `https://oisys.abacusai.app` remain untouched. |

## Rollback Plan For Later Execution

If a later tunnel execution fails:

1. Remove or disable the two Cloudflare Tunnel public hostname routes.
2. Stop/disable the `cloudflared` connector service on the Abacus SuperComputer only if it was installed in that later stage.
3. Revert `ois-ng.dmp247.com` and `pits-ng.dmp247.com` DNS to the prior non-working/blocked state or remove the records per owner direction.
4. Keep Core API nginx/systemd unchanged.
5. Keep Stage 0U-A local Host-header nginx config unless the owner intentionally rolls it back with `ops/abacus/disable-product-subdomain-demo-routes.sh`.
6. Confirm `https://ois-nextgen.abacusai.cloud/health` and `/platform/overview` still return HTTP 200.

## Published Endpoint Delta

### Added

| Endpoint | Status | Expected result | Evidence |
|---|---|---|---|
| None | N/A | N/A | Stage 0V-A is plan/runbook only. |

### Changed

| Endpoint | Previous status/result | New status/result | Evidence |
|---|---|---|---|
| `https://ois-ng.dmp247.com` | `CUSTOM_SUBDOMAIN_TLS_BLOCKED`. | `PLANNED_CLOUDFLARE_TUNNEL`; target `http://127.0.0.1:3000`. | Stage 0V-A tunnel plan. |
| `https://pits-ng.dmp247.com` | `CUSTOM_SUBDOMAIN_TLS_BLOCKED`. | `PLANNED_CLOUDFLARE_TUNNEL`; target `http://127.0.0.1:3001`. | Stage 0V-A tunnel plan. |
| `https://ois-ng.dmp247.com/dashboard` | `CUSTOM_SUBDOMAIN_TLS_BLOCKED`. | `PLANNED_CLOUDFLARE_TUNNEL`; same OIS Console tunnel host. | Stage 0V-A tunnel plan. |
| `https://pits-ng.dmp247.com/projects` | `CUSTOM_SUBDOMAIN_TLS_BLOCKED`. | `PLANNED_CLOUDFLARE_TUNNEL`; same PITS Shell tunnel host. | Stage 0V-A tunnel plan. |

### Unchanged

| Endpoint | Status | Expected result |
|---|---|---|
| `https://ois-nextgen.abacusai.cloud/health` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200 Core API health. |
| `https://ois-nextgen.abacusai.cloud/platform/overview` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200 DB-backed read-only platform overview with seeded counts. |
| `https://113d93f4db-3001.na116.preview.abacusai.app` | `ABACUS_APP_SHELL_PREVIEW_PUBLIC` | HTTP 200 PITS Shell App Shell preview. |
| `https://161acd4ff8.na116.preview.abacusai.app` | `OIS_CONSOLE_APP_SHELL_PREVIEW_UNAVAILABLE_404` | OIS Console App Shell preview remains unavailable until restored/redeployed. |
| `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 live App Shell; do not touch. |
| `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 custom domain; do not touch. |

### Deprecated / Stopped

| Endpoint | Status | Reason |
|---|---|---|
| None | N/A | Stage 0V-A does not stop or deprecate endpoints. |

### Do Not Touch

| Endpoint/resource | Status | Reason |
|---|---|---|
| `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 custom domain. |
| `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 live App Shell. |
| `ois_phase1_dev` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 production-equivalent DB. |
| `emerald_bql_web_dev` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Emerald/BQL legacy DB. |
| Cloudflare tunnel token | Secret | Never commit or print. |

### Current Test Checklist

| Check | Command | Expected |
|---|---|---|
| Core API staging health | `curl -i https://ois-nextgen.abacusai.cloud/health` | HTTP 200 and Core API health payload. |
| DB-backed platform overview | `curl -i https://ois-nextgen.abacusai.cloud/platform/overview` | HTTP 200, demo banner and seeded counts. |
| OIS tunnel route | `curl -i https://ois-ng.dmp247.com` | Not executed in Stage 0V-A; planned for Cloudflare Tunnel execution. |
| PITS tunnel route | `curl -i https://pits-ng.dmp247.com` | Not executed in Stage 0V-A; planned for Cloudflare Tunnel execution. |

## Safety Statement

- No `cloudflared` install.
- No tunnel token used, printed or committed.
- No DNS modification.
- No deploy.
- No Abacus runtime modification.
- No migrations.
- No seed.
- No `prisma db push`.
- No production credentials.
- No `ois.dmp247.com` modification.
- No `oisys.abacusai.app` modification.
- No OIS Phase 1 or Emerald/BQL DB/storage touch.

## Decision

Stage 0V-A is marked `CLOUDFLARE_TUNNEL_CUSTOM_SUBDOMAIN_PLAN_READY`.

Recommended next stage: Stage 0V-B - Owner-Assisted Cloudflare Tunnel Connector Setup.

## References

- Cloudflare Tunnel documentation: `https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/`
- Cloudflare Tunnel routing/public hostnames documentation: `https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/routing-to-tunnel/`

## Validation

| Command | Result |
|---|---|
| `pnpm lint` | PASS. |
| `pnpm typecheck` | PASS. |
| `pnpm test` | PASS. |
| `pnpm -r --if-present build` | PASS. |
| `git status -sb` | PASS; Stage 0V-A documentation changes pending commit only. |
