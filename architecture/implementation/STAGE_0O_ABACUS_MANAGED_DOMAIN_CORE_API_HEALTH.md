# Stage 0O Abacus Managed Domain Core API Health

Final verdict: `ABACUS_MANAGED_DOMAIN_CORE_API_HEALTH_VERIFIED`.

## Baseline

| Item | Result |
|---|---|
| Documentation branch | `stage-0o-abacus-managed-domain-core-api-health` |
| Integration base | `stage-0b-complete-handoff-ingestion` |
| Integration base commit | `cc7ed28704c9e804385f6d2a4c21e8d887a775e3` |
| Prior stage | Stage 0N `ABACUS_RESOURCE_BOUNDARY_SUPERCOMPUTER_DEPLOYMENT_CONTRACT_READY` |
| Stage 0O objective | Serve Core API `/health` on `https://ois-nextgen.abacusai.cloud/health`. |
| Stage 0O result | PASS. Goal achieved. |
| Evidence source | User-provided Abacus SuperComputer Stage 0O execution evidence. |
| Local documentation task | Documentation-only status update; no Abacus command was executed from this repository. |

## Scope

| Item | Evidence |
|---|---|
| Abacus VM repo branch | `stage-0b-complete-handoff-ingestion` |
| Abacus VM deployed commit | `cc7ed28704c9e804385f6d2a4c21e8d887a775e3` |
| Package deployed | `@ois/core-api` |
| Package path | `apps/core-api` |
| Framework | Fastify |
| Runtime entrypoint | `pnpm start`, running `tsx src/server.ts` |
| Core API port | `4000` |
| OIS Console | Not started. |
| PITS Shell | Not started. |
| Worker | Not started. |

Stage 0O is a Core API-only staging health POC on the Abacus-managed public staging domain. It does not enable DB-backed functionality, storage-backed functionality, real AI/OpenRouter usage, Console UI deployment, PITS deployment or worker deployment.

## Install And Runtime Evidence

| Check | Result |
|---|---|
| `pnpm install --frozen-lockfile` | PASS in 24s. |
| Prisma client generation | PASS during install; client generation only. |
| `prisma db push` | Not run. |
| Migrations | Not run. |
| Database connection | Not used. |
| Core API compile/build artifact | Not required for this POC because `@ois/core-api` starts through `tsx src/server.ts`. |
| `/health` handler | Static response; does not query Prisma. |

Health payload:

```json
{"status":"ok","service":"core-api","stage":"bootstrap-stage-a"}
```

## Systemd Evidence

| Field | Evidence |
|---|---|
| Service file | `/etc/systemd/system/ois-nextgen-core-api.service` |
| WorkingDirectory | `/home/ubuntu/ois-nextgen/apps/core-api` |
| EnvironmentFile | `/home/ubuntu/ois-nextgen/.env` |
| ExecStart | `/usr/bin/pnpm start` |
| Restart | `on-failure` |
| Enabled at boot | Yes. |
| Status | Active/running. |

## Nginx Evidence

| Field | Evidence |
|---|---|
| Vhost file | `/etc/nginx/conf.d/ois-nextgen.conf` |
| `server_name` | `ois-nextgen.vm.internal` |
| `/health` route | Proxies to `127.0.0.1:4000`. |
| `/api/` route | Proxies to `127.0.0.1:4000`. |
| `/` route | Proxies to `127.0.0.1:4000`. |
| `sudo nginx -t` | PASS; syntax OK and test successful. |

## Environment Contract

The VM `.env` file exists at `/home/ubuntu/ois-nextgen/.env` and is gitignored. It must not be committed.

Documented key names only:

| Key | Stage 0O status |
|---|---|
| `APP_ENV` | Present as a staging/mock-safe runtime key. |
| `DEPLOY_TARGET` | Present as a staging/mock-safe runtime key. |
| `LOCALHOST_REQUIRED` | Present as a staging/mock-safe runtime key. |
| `AI_PROVIDER` | Mock-safe. |
| `AI_PROVIDER_MODE` | Mock-safe. |
| `OPENROUTER_API_KEY` | Empty. |
| `STORAGE_PROVIDER` | Mock-safe. |
| `CORE_API_HOST` | Present. |
| `CORE_API_PORT` | Present; Core API listens on port `4000`. |
| `CORE_API_URL` | Present. |
| `NEXT_TELEMETRY_DISABLED` | Present. |
| `DATABASE_URL` | Absent. |
| `ABACUS_DATABASE_URL` | Absent. |
| Real storage values | Absent. |
| Real OpenRouter key | Absent. |

No secret values are recorded in this repository.

## Health Verification

| Surface | Evidence |
|---|---|
| Local Core API | `curl -i http://127.0.0.1:4000/health` returned HTTP 200. |
| nginx proxy with `X-Original-Host` | Returned HTTP 200. |
| Abacus-managed public staging domain | `curl -i https://ois-nextgen.abacusai.cloud/health` returned HTTP/2 200 via Cloudflare/Envoy. |
| Response body | Core API health payload with `status=ok`, `service=core-api` and `stage=bootstrap-stage-a`. |

The Abacus-managed public staging domain is now live for Core API `/health`.

## Boundaries Confirmed

| Boundary | Stage 0O result |
|---|---|
| `ois.dmp247.com` | Untouched. |
| `oisys.abacusai.app` | Untouched. |
| `ois_phase1_dev` | Untouched. |
| `emerald_bql_web_dev` | Untouched. |
| OIS Console | Not deployed. |
| PITS Shell | Not deployed. |
| Worker | Not deployed. |
| DB-backed functionality | Not enabled. |
| Storage-backed functionality | Not enabled. |
| Real AI/OpenRouter | Not enabled. |

## Rollback

Rollback commands recorded for the Abacus VM:

```sh
sudo systemctl stop ois-nextgen-core-api
sudo systemctl disable ois-nextgen-core-api
sudo rm /etc/systemd/system/ois-nextgen-core-api.service
sudo systemctl daemon-reload
sudo rm /etc/nginx/conf.d/ois-nextgen.conf
sudo nginx -t && sudo systemctl reload nginx
```

Expected rollback result: `https://ois-nextgen.abacusai.cloud` reverts to the default `READY` page.

## Decision

Stage 0O passes as `ABACUS_MANAGED_DOMAIN_CORE_API_HEALTH_VERIFIED`.

The OIS NextGen Abacus-managed public staging domain now verifies the Core API health endpoint through SuperComputer nginx and systemd:

`https://ois-nextgen.abacusai.cloud/health` -> HTTP/2 200.

This is not a full product deployment. Console UI, PITS, worker, DB-backed routes, storage-backed routes and real AI/OpenRouter integrations remain out of scope.

Recommended next stage: Stage 0P - Default DB Staging Migration Gate / Prisma Baseline.

## Safety Statement

This local Stage 0O documentation update is documentation-only.

The recorded Abacus Stage 0O execution honored these constraints:

- Core API only.
- No OIS Console runtime.
- No PITS Shell runtime.
- No worker runtime.
- No migrations.
- No `prisma db push`.
- No database connection.
- No DB-backed endpoints called.
- No storage-backed endpoints called.
- No production database, storage or OpenRouter credentials used.
- No real credentials.
- No secrets printed or committed.
- No `.env` committed.
- `ois.dmp247.com`, `oisys.abacusai.app`, `ois_phase1_dev` and `emerald_bql_web_dev` were untouched.

## Validation

| Command | Result |
|---|---|
| `pnpm lint` | PASS; architecture guard passed. |
| `pnpm typecheck` | PASS; `tsc -p tsconfig.check.json --noEmit`. |
| `pnpm test` | PASS; 2 files, 16 tests. |
| `pnpm -r --if-present build` | PASS; Core API TypeScript build and OIS Console/PITS Shell Next.js static builds completed. |
| `git status -sb` | PASS; documentation-only Stage 0O changes pending commit. |
