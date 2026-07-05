# Deployment Health Spec

## Current Health Checks

| Surface | URL | Expected |
|---|---|---|
| Core API root | `/` | JSON service identity for `ois-nextgen-core-api` |
| Core API health | `/health` | JSON `status=ok`, `service=core-api`, `stage=bootstrap-stage-a` |
| Core API docs | `/docs` | Swagger UI page |
| OIS Console | `/` | `OIS Console` and demo-data banner |
| PITS Shell | `/` | `PITS Shell` and demo-data banner |

## Evidence

Playwright smoke tests save screenshots to `test-results/stage-0d/` and CI uploads them as artifacts.

## Future Expansion

Production health must include migration version, app version, commit SHA, storage config hash and AI config hash without exposing secret values.
