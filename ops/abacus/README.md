# Abacus Safe SSH Operations

Reusable scripts for OIS NextGen Abacus SuperComputer operations.

Run these from the repository root on the Abacus VM:

```sh
cd /home/ubuntu/ois-nextgen
bash ops/abacus/status.sh
```

## Scripts

| Script | Default behavior | Mutates runtime? |
|---|---|---|
| `status.sh` | Shows repo branch/commit/status, Core API systemd status, local/public health, local/public platform overview and seeded counts. | No. Read-only. |
| `check-live-endpoints.sh` | Checks active OIS NextGen public staging endpoints only. Legacy probes require `--include-legacy-readonly`. | No. Read-only. |
| `safe-restart-core-api.sh` | Restarts `ois-nextgen-core-api`, then verifies local/public `/health` and `/platform/overview`. | Yes, service restart only. |
| `runtime-sync.sh` | Fetches/pulls the integration branch, runs install/lint/typecheck/test/build, then restarts Core API through `safe-restart-core-api.sh`. | Yes, source sync and service restart only. |
| `rollback-core-api-nginx-poc.sh` | Prints the Stage 0O rollback plan by default. Requires `--confirm-rollback` to stop/disable service and remove nginx/systemd POC files. | Yes, destructive only with explicit confirmation. |

## Security Rules

- Do not `cat .env`.
- Do not print `DATABASE_URL`.
- Do not print secrets.
- Do not run `printenv`, `env` or `set -x`.
- Do not run `prisma db push`.
- Do not run `prisma migrate dev`.
- Do not run migrations or seed unless a future owner-approved stage explicitly calls for it.
- Do not call write endpoints.
- Do not call `/auth/demo-login`.
- Do not touch `ois_phase1_dev`, `emerald_bql_web_dev`, `ois.dmp247.com`, `oisys.abacusai.app`, storage prefix `49816/` or storage prefix `52067/`.

## Examples

Read-only status:

```sh
bash ops/abacus/status.sh
```

Read-only active endpoint check:

```sh
bash ops/abacus/check-live-endpoints.sh
```

Optional legacy readonly status probes, only with owner approval:

```sh
bash ops/abacus/check-live-endpoints.sh --include-legacy-readonly
```

Safe Core API restart:

```sh
bash ops/abacus/safe-restart-core-api.sh
```

Runtime sync after a safe integration merge:

```sh
bash ops/abacus/runtime-sync.sh
```

Rollback plan only:

```sh
bash ops/abacus/rollback-core-api-nginx-poc.sh
```

Execute rollback after owner approval:

```sh
bash ops/abacus/rollback-core-api-nginx-poc.sh --confirm-rollback
```
