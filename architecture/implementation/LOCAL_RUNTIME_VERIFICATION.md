# Local Runtime Verification

Stage 0C local runtime verification on Windows-native PostgreSQL.

Final runtime verdict: `PASS_WITH_NON_BLOCKING_DEFERRED_ITEMS`

## Port Inspection

| Port | Initial state | Stage 0C result |
|---:|---|---|
| 3000 | Free at start of continuation run | PASSED: OIS Console listens on `127.0.0.1:3000` and returns HTTP 200. |
| 3001 | Free at start of continuation run | PASSED: PITS Shell listens on `127.0.0.1:3001` and returns HTTP 200. |
| 4000 | Free at start of Stage 0C | PASSED: Core API listens while `pnpm dev` is running. |
| 3100 | Free at start of Stage 0C | Not used as an acceptance substitute. |
| 3101 | Free at start of Stage 0C | Not used as an acceptance substitute. |

No broad Node process termination was used. Specific failed-attempt Node PIDs were stopped only after they were created by local OIS NextGen runtime probes.

## Database Runtime

| Check | Result |
|---|---|
| PostgreSQL service | `postgresql-x64-16` running. |
| TCP connectivity | `localhost:5432` accepted socket connection. |
| Connected database | `ois_nextgen`. |
| Connected role | `ois_nextgen`. |
| Current schema | `public`. |
| Server version | `16.14`. |
| Role/database privilege | `ois_nextgen` can connect to `ois_nextgen`. |

The local database password was not printed or committed.

## Core API Runtime

Verified while canonical `pnpm dev` was running.

| URL | Status | Content type / identity | Result |
|---|---:|---|---|
| `http://localhost:4000` | 200 | JSON service identity: `ois-nextgen-core-api` | PASS |
| `http://127.0.0.1:4000` | 200 | JSON service identity: `ois-nextgen-core-api` | PASS |
| `http://[::1]:4000` | 200 | JSON service identity: `ois-nextgen-core-api` | PASS |
| `http://localhost:4000/docs` | 200 | Swagger UI | PASS |
| `http://localhost:4000/health` | 200 | JSON health response | PASS |
| `http://localhost:4000/platform/overview` | 200 | Database-backed platform overview | PASS |

Core API now binds to `::` by default so localhost, IPv4 loopback and IPv6 loopback work on this Windows host. This preserves local development scope and does not add production credentials or production connectivity.

## Console And PITS Runtime

| Command | Expected URL | Observed result | Classification |
|---|---|---|---|
| `$env:CI='true'; pnpm dev:console` | `http://localhost:3000` | Listener on `127.0.0.1:3000`; HTTP 200; page title `OIS Console`. | PASS |
| `$env:CI='true'; pnpm dev:pits` | `http://localhost:3001` | Listener on `127.0.0.1:3001`; HTTP 200; page title `PITS Shell`. | PASS |
| `$env:CI='true'; pnpm dev` | `http://localhost:3000`, `http://localhost:3001`, `http://localhost:4000` | All three services run simultaneously; Console, PITS, Core API root, `/docs`, `/health` and database-backed overview return HTTP 200. | PASS |

Additional evidence:

- Sandboxed Next dev initially failed with `EPERM` creating or opening generated `.next` files.
- Generated `.next` caches were removed only after absolute path checks confirmed both targets were inside this workspace.
- Manual Windows ACL cleanup was performed before the continuation run.
- Direct Next CLI probes proved both apps bind when given explicit `-H 127.0.0.1`.
- The exact fix was updating the Console and PITS package `dev` scripts to include `-H 127.0.0.1` while preserving canonical ports 3000 and 3001.

## Shutdown Verification

After each runtime probe, repository-created Node processes were stopped and ports 3000, 3001, 4000, 3100 and 3101 were checked. Final inspection showed no listeners on inspected ports and no remaining Node processes.
