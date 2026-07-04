# Phase Gate Register

| Gate | Required Before | Status | Evidence |
|---|---|---|---|
| Phase 1 input validation | Stage A code generation | PASSED | Previous Stage A evidence plus `PHASE1_DIRECTORY_RECONCILIATION.md`. |
| Complete handoff ingestion | Stage 0B checkpoint | PASSED_WITH_DISCREPANCIES | All required path, checksum and validation outputs created; hotfix/owner count drift recorded. |
| Native PostgreSQL runtime | Stage 0B checkpoint | PASSED | `pnpm db:migrate` passed; seed counts stable across two reruns. |
| Local HTTP runtime | Stage 0B checkpoint | PARTIAL_BLOCKED_BY_LOCAL_PROCESS_OWNERSHIP | Core API exact-port checks passed; exact Console/PITS ports are occupied by protected HTTP 500 processes; clean alternate Next runtime passed. |
| Platform kernel bootstrap | PITS vertical slices | PASSED | Kernel schema, seed, hierarchy, permission/capability, audit, idempotency and optimistic concurrency tests pass. |
| Phase 2 business rules | PITS, Knowledge, Learning, Wisdom, Intelligence behavior | READY_WITH_CONDITIONS | Verified behavior imported; 18 coverage gaps, 10 unverified critical APIs and owner decisions remain open. |
| Phase 2 API/UI contracts | Legacy compatibility and UI route mapping | READY_WITH_CONDITIONS | 273 route and 90 UI-page baselines preserved; unverified APIs are not authoritative contracts. |
| Phase 3 starter data | Full demo data and migration validation | READY_WITH_CONDITIONS | 220 fixtures imported as handoff reference; Stage 0B seed remains platform-kernel demo data only. |
| Phase 3 regression suite | Regression certification | READY_WITH_CONDITIONS | Regression queue created from 23 layers, 81 blueprint test cases and 135 minimum tests. |
| PITS Field Report vertical slice | Next implementation stage | NOT_STARTED | Explicitly deferred until after Stage 0B checkpoint. |
