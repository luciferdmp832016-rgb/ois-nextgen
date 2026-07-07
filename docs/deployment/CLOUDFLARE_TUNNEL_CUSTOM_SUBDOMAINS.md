# Cloudflare Tunnel Custom Subdomains

Stage 0V-A plan/runbook and Stage 0V-B/C runtime verification record for OIS NextGen SuperComputer-hosted product subdomains.

Decision label: `CLOUDFLARE_TUNNEL_CUSTOM_SUBDOMAIN_PLAN_READY`.

Runtime labels:

- `CLOUDFLARE_TUNNEL_CONNECTOR_HEALTHY`
- `CLOUDFLARE_TUNNEL_PRODUCT_SUBDOMAINS_VERIFIED`

## Purpose

Stage 0U-A proved local nginx Host-header routing:

| Host | Local service | Result |
|---|---|---|
| `ois-ng.dmp247.com` | `http://127.0.0.1:3000` | HTTP 200 OIS Console with seeded counts. |
| `pits-ng.dmp247.com` | `http://127.0.0.1:3001` | HTTP 200 PITS Shell with seeded counts. |

Direct public CNAME routing to `ois-nextgen.abacusai.cloud` failed:

| Public check | Result |
|---|---|
| `https://ois-ng.dmp247.com` | SSL handshake failure. |
| `https://pits-ng.dmp247.com` | SSL handshake failure. |
| `http://ois-ng.dmp247.com` | HTTP 409. |
| `http://pits-ng.dmp247.com` | HTTP 409. |

Abacus confirmation:

```text
CUSTOM_HOSTNAME_NOT_SUPPORTED_FOR_SUPERCOMPUTER
CUSTOM_HOSTNAME_ONLY_SUPPORTED_FOR_MANAGED_APP_SHELLS
```

Cloudflare Tunnel is the selected and now verified workaround because it terminates public TLS in Cloudflare and forwards requests over an outbound connector to local services on the Abacus SuperComputer.

## Stage 0V-A Non-Goals

Stage 0V-A does not:

- Install `cloudflared`.
- Create or run a tunnel.
- Modify DNS.
- Deploy application code.
- Run migrations.
- Run seed.
- Run `prisma db push`.
- Touch `ois.dmp247.com`.
- Touch `oisys.abacusai.app`.
- Commit Cloudflare tokens or credentials.

## Target Topology

| Public hostname | Cloudflare Tunnel service URL | Product | Current source |
|---|---|---|---|
| `https://ois-ng.dmp247.com` | `http://127.0.0.1:3000` | OIS Console | SuperComputer local UI shell. |
| `https://pits-ng.dmp247.com` | `http://127.0.0.1:3001` | PITS Shell | SuperComputer local UI shell. |
| `https://api-ng.dmp247.com` | `http://127.0.0.1:4000` | Optional later Core API route | Not part of Stage 0V-A execution. |

Core API remains:

```text
https://ois-nextgen.abacusai.cloud
```

OIS Console and PITS Shell continue to fetch DB-backed data through Core API only.

## Stage 0V-B/C Runtime Verification

Owner configured Cloudflare DNS for `dmp247.com`, created tunnel `ois-nextgen-abacus`, installed/ran the connector on the Abacus VM and verified public HTTPS routes.

Connector evidence:

| Item | Result |
|---|---|
| Tunnel name | `ois-nextgen-abacus` |
| Cloudflare Tunnel status | Healthy |
| Active replicas | 1 |
| Routes | 2 |
| `cloudflared` version | `2026.6.1` |
| Token handling | Token not documented, printed, stored or committed. |

Verified tunnel routes:

| Public hostname | Tunnel target | Result |
|---|---|---|
| `https://ois-ng.dmp247.com` | `http://127.0.0.1:3000` | Opens OIS Console. |
| `https://pits-ng.dmp247.com` | `http://127.0.0.1:3001` | Opens PITS Shell. |

Verified public pages:

| Endpoint | Result |
|---|---|
| `https://ois-ng.dmp247.com` | OIS Console, product code `OIS_CONSOLE`. |
| `https://ois-ng.dmp247.com/dashboard` | OIS Platform Overview. |
| `https://pits-ng.dmp247.com` | PITS Shell, product code `PITS_SHELL`. |
| `https://pits-ng.dmp247.com/projects` | PITS Project Selector. |

Both shells show Core API URL `https://ois-nextgen.abacusai.cloud`, Core API healthy HTTP 200 and seeded demo counts: industries 1, organizations 1, workspaces 1, projects 2, products 5, installations 2, modules 3 and auditRecords 1.

UI shells do not use `DATABASE_URL`. DB-backed demo data is accessed only through Core API.

Direct CNAME to the Abacus SuperComputer remains unsupported. Cloudflare Tunnel is now the accepted custom subdomain path for SuperComputer-hosted OIS/PITS UI shells.

## Cloudflare Dashboard Reference Steps

These steps are retained as the reference path. Stage 0V-B/C owner execution completed the OIS and PITS routes; do not repeat unless restoring or recreating the tunnel.

1. Confirm the owner has access to the Cloudflare account and `dmp247.com` zone.
2. Open Cloudflare Zero Trust / dashboard tunnel management.
3. Create a named tunnel, recommended:

   ```text
   ois-nextgen-supercomputer-staging
   ```

4. Select a Linux connector and copy the dashboard-provided `cloudflared` install/run instructions only at execution time.
5. Keep the connector token secret. Do not paste the token into repo files, Git commits, screenshots, support tickets, Codex prompts or shared logs.
6. Add public hostname:

   | Field | Value |
   |---|---|
   | Subdomain | `ois-ng` |
   | Domain | `dmp247.com` |
   | Service type | `HTTP` |
   | Service URL | `http://127.0.0.1:3000` |

7. Add public hostname:

   | Field | Value |
   |---|---|
   | Subdomain | `pits-ng` |
   | Domain | `dmp247.com` |
   | Service type | `HTTP` |
   | Service URL | `http://127.0.0.1:3001` |

8. Do not add `api-ng.dmp247.com` until a later owner-approved API custom-domain stage.
9. Let Cloudflare create or manage the tunnel DNS records, or follow the dashboard's exact DNS instruction for tunnel hostnames.
10. Save changes and wait for connector/route health in Cloudflare before public validation.

## Abacus Web Terminal Reference Outline

For restoration/recreation only:

1. Preflight the repo and runtime:

   ```sh
   cd /home/ubuntu/ois-nextgen
   git status -sb
   bash ops/abacus/status.sh
   bash ops/abacus/status-ui-demo-shells.sh
   bash ops/abacus/status-product-subdomain-demo-routes.sh
   ```

2. If UI shells are not running, start them:

   ```sh
   bash ops/abacus/start-ui-demo-shells.sh
   ```

3. Confirm local Host-header routing:

   ```sh
   bash ops/abacus/status-product-subdomain-demo-routes.sh
   ```

4. Install/start `cloudflared` only from the Cloudflare dashboard-provided Linux connector instructions.
5. Do not echo, save or commit the tunnel token.
6. Validate public hostnames only after Cloudflare shows the connector is healthy.

## Validation Checklist

Local preflight:

| Check | Command | Expected |
|---|---|---|
| Core API health | `curl -i https://ois-nextgen.abacusai.cloud/health` | HTTP 200. |
| Platform overview | `curl -i https://ois-nextgen.abacusai.cloud/platform/overview` | HTTP 200 with seeded counts. |
| OIS local route | `curl -H "Host: ois-ng.dmp247.com" http://127.0.0.1/` | HTTP 200 with `OIS_CONSOLE`. |
| PITS local route | `curl -H "Host: pits-ng.dmp247.com" http://127.0.0.1/` | HTTP 200 with `PITS_SHELL`. |

Public validation:

| Check | Command | Expected |
|---|---|---|
| OIS root | `curl -i https://ois-ng.dmp247.com` | HTTP 200 OIS Console. |
| OIS dashboard | `curl -i https://ois-ng.dmp247.com/dashboard` | HTTP 200 OIS Console dashboard route. |
| PITS root | `curl -i https://pits-ng.dmp247.com` | HTTP 200 PITS Shell. |
| PITS projects | `curl -i https://pits-ng.dmp247.com/projects` | HTTP 200 PITS Shell projects route. |

Legacy do-not-touch:

| Endpoint | Rule |
|---|---|
| `https://ois.dmp247.com` | Do not modify; OIS Phase 1 custom domain. |
| `https://oisys.abacusai.app` | Do not modify; OIS Phase 1 App Shell. |

## Rollback

If later tunnel execution causes a problem:

1. Remove or disable Cloudflare Tunnel public hostname routes for `ois-ng.dmp247.com` and `pits-ng.dmp247.com`.
2. Stop/disable the `cloudflared` service on the Abacus SuperComputer only if that service was installed in the later execution stage.
3. Remove or revert Cloudflare DNS records for `ois-ng.dmp247.com` and `pits-ng.dmp247.com` per owner direction.
4. Do not change `ois.dmp247.com`.
5. Do not change `oisys.abacusai.app`.
6. Leave Core API nginx/systemd untouched unless a later stage explicitly approves Core API rollback.
7. Re-run:

   ```sh
   curl -i https://ois-nextgen.abacusai.cloud/health
   curl -i https://ois-nextgen.abacusai.cloud/platform/overview
   ```

8. If needed, disable only Stage 0U-A local product-subdomain nginx routing:

   ```sh
   bash ops/abacus/disable-product-subdomain-demo-routes.sh
   ```

Expected rollback result: `ois-ng.dmp247.com` and `pits-ng.dmp247.com` stop serving through Cloudflare Tunnel while `https://ois-nextgen.abacusai.cloud/health` and `/platform/overview` remain available.

## Safety Rules

- Never commit a Cloudflare tunnel token.
- Never print a Cloudflare tunnel token in logs.
- Never paste a Cloudflare tunnel token into Markdown docs.
- Never add `.cloudflared/`, tunnel credentials JSON, cert files or token files to git.
- Do not run `prisma db push`.
- Do not run migrations.
- Do not run seed.
- Do not use production credentials.
- Do not touch OIS Phase 1 or Emerald/BQL resources.
- Do not attach or modify `ois.dmp247.com`.
- Do not probe legacy endpoints unless the owner explicitly approves.

## References

- Cloudflare Tunnel documentation: `https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/`
- Cloudflare Tunnel routing/public hostnames documentation: `https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/routing-to-tunnel/`
