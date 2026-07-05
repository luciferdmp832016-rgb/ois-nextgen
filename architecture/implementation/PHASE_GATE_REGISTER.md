# Phase Gate Register

| Gate | Required Before | Status | Evidence |
|---|---|---|---|
| Phase 1 input validation | Stage A code generation | PASSED | Previous Stage A evidence plus `PHASE1_DIRECTORY_RECONCILIATION.md`. |
| Complete handoff ingestion | Stage 0B checkpoint | PASSED_WITH_DISCREPANCIES | All required path, checksum and validation outputs created; hotfix/owner count drift recorded. |
| Native PostgreSQL runtime | Stage 0B checkpoint | PASSED | Stage 0C verified PostgreSQL 16.14, database `ois_nextgen`, role `ois_nextgen`, schema `public`; `pnpm db:migrate` passed. |
| Prisma client generation | Stage 0B checkpoint | PASSED | Stage 0C `$env:CI='true'; pnpm db:generate` passed and generated Prisma Client v6.19.3. |
| Seed idempotency | Stage 0B checkpoint | PASSED | Stage 0C fixed seed no-op writes and verified two reruns with identical overall table fingerprint `4a83d1852d3eca5ea2970f7204825b1d4719a344fe27155ec272d404019054f7`. |
| Core API root contract | Stage 0B checkpoint | PASSED | Core API `/`, `/docs`, `/health`, `127.0.0.1` and `::1` returned HTTP 200 while canonical `pnpm dev` was running. |
| Local HTTP runtime | Stage 0B checkpoint | PASSED | `pnpm dev` serves OIS Console on 3000, PITS Shell on 3001, Core API root on 4000, `/docs` and `/health` simultaneously. Console/PITS scripts bind explicitly to `127.0.0.1`. |
| Cloud CI readiness | Stage 0D checkpoint | PASSED_WITH_MANUAL_GITHUB_SETUP | GitHub Actions CI and release preflight workflows added with PostgreSQL service, migration, seed, lint, typecheck, unit, e2e smoke and build gates. Local Stage 0D gates pass; first GitHub run and branch protection remain manual. |
| GitHub CI activation | Stage 0E checkpoint | PASSED | PR #1 final-head CI run `28738991764` completed successfully on commit `622d42d42572e44ace34795f860231e5027feb55`; artifact `stage-0d-evidence` exists and contains Console, PITS and Core API docs screenshots. |
| Abacus readiness foundation | Stage 0D checkpoint | MANUAL_SETUP_REQUIRED | Abacus staging and production readiness docs plus deployment manifest template added. No production deploy or credentials used. |
| Abacus staging runtime POC | Stage 0F checkpoint | PASS_WITH_MANUAL_ABACUS_STEPS | Split app staging is the recommended topology. Stage 0F-R1 records partial Abacus project access, but env/secrets/deploy access remains unknown and staging-only mock DB/storage/subdomain/AI-provider inputs are missing, so staging deployment was not executed. |
| Platform kernel bootstrap | PITS vertical slices | PASSED | Kernel schema, seed, hierarchy, permission/capability, audit, idempotency and optimistic concurrency tests pass. |
| Phase 2 business rules | PITS, Knowledge, Learning, Wisdom, Intelligence behavior | READY_WITH_CONDITIONS | Verified behavior imported; 18 coverage gaps, 10 unverified critical APIs and owner decisions remain open. |
| Phase 2 API/UI contracts | Legacy compatibility and UI route mapping | READY_WITH_CONDITIONS | 273 route and 90 UI-page baselines preserved; unverified APIs are not authoritative contracts. |
| Phase 3 starter data | Full demo data and migration validation | READY_WITH_CONDITIONS | 220 fixtures imported as handoff reference; Stage 0B seed remains platform-kernel demo data only. |
| Phase 3 regression suite | Regression certification | READY_WITH_CONDITIONS | Regression queue created from 23 layers, 81 blueprint test cases and 135 minimum tests. |
| PITS Field Report vertical slice | Next implementation stage | NOT_STARTED | Explicitly deferred until after Stage 0B checkpoint. |
