# Published Endpoint Registry

Persistent source of truth for OIS NextGen published and test endpoints.

Every future stage report must include a **Published Endpoint Delta** section with:

- Added
- Changed
- Unchanged
- Deprecated / stopped
- Do Not Touch
- Current test checklist

Do not probe or mutate legacy production endpoints during NextGen staging work unless an owner explicitly approves that action.

## Status Names

| Status | Meaning |
|---|---|
| `LOCAL_ONLY` | Developer-machine loopback endpoint; not public and not persistent. |
| `CODEX_CLOUD_LOOPBACK` | Codex/cloud sandbox loopback endpoint; not a persistent public URL. |
| `ABACUS_VM_LOCAL` | Abacus SuperComputer loopback endpoint inside the VM; not public. |
| `ABACUS_PREVIEW_PUBLIC` | Abacus VM preview proxy URL; public but tied to VM/process lifecycle and not final staging. |
| `ABACUS_MANAGED_PUBLIC_STAGING` | Abacus-managed public staging domain for OIS NextGen. |
| `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 or legacy production-equivalent surface; do not touch. |
| `PLANNED_NOT_CREATED` | Planned future endpoint that does not exist yet. |
| `BLOCKED` | Endpoint route is intentionally unavailable or blocked by missing gate/config. |
| `DEPRECATED` | Endpoint is no longer part of the active test/publication path. |

## 1. Current Live Endpoints

| Product/surface | Endpoint | Status | Expected result | Owner action |
|---|---|---|---|---|
| OIS NextGen Core API staging health | `https://ois-nextgen.abacusai.cloud/health` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200 with `{"status":"ok","service":"core-api","stage":"bootstrap-stage-a"}` | Primary current NextGen staging health check. |
| OIS NextGen platform overview | `https://ois-nextgen.abacusai.cloud/platform/overview` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200, DB-backed read-only platform overview with seeded Platform Kernel counts. | Primary current DB-backed staging smoke check. |
| OIS Phase 1 App Shell | `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing live OIS Phase 1 app shell. | Do not touch during NextGen staging. |
| OIS Phase 1 custom domain | `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Same OIS Phase 1 backend/custom domain. | Do not touch during NextGen staging. |

Current NextGen live scope is Core API `/health` and DB-backed read-only `/platform/overview` only. Platform Kernel seed data is demo/staging data marked `DEMO DATA - NOT PRODUCTION`. Stage 0T-A corrects the UI deployment path: OIS Console and PITS Shell must be separate Apps Management Console App Shells with Abacus-managed deployment URLs. Stage 0T-B adds local/Codex mocked UI demo tests before App Shell deployment. SuperComputer preview URLs on ports `3000` and `3001` are deprecated for App Shell proof. Worker, `/auth/demo-login`, write endpoints and custom `dmp247.com` domains are not live on the Abacus-managed public staging domain yet.

## 2. Local/Loopback Endpoints

| Environment | Endpoint | Status | Stage evidence | Expected result |
|---|---|---|---|---|
| Local developer runtime | `http://127.0.0.1:4000/health` | `LOCAL_ONLY` | Stage 0B/0C local runtime evidence. | HTTP 200, Core API health. |
| Local developer runtime | `http://127.0.0.1:4000/` | `LOCAL_ONLY` | Stage 0B/0C local runtime evidence. | HTTP 200, Core API service identity. |
| Local developer runtime | `http://127.0.0.1:3000/` | `LOCAL_ONLY` | Stage 0B/0C local runtime evidence. | HTTP 200, OIS Console shell. |
| Local developer runtime | `http://127.0.0.1:3001/` | `LOCAL_ONLY` | Stage 0B/0C local runtime evidence. | HTTP 200, PITS Shell. |

Local/loopback endpoints are not persistent public URLs.

## 3. Codex Cloud Test Endpoints

| Environment | Endpoint | Status | Stage evidence | Expected result |
|---|---|---|---|---|
| Codex Cloud Core API sandbox | `http://127.0.0.1:4000/health` | `CODEX_CLOUD_LOOPBACK` | Stage 0G. | HTTP 200, Core API health. |
| Codex Cloud Core API sandbox | `http://127.0.0.1:4000/` | `CODEX_CLOUD_LOOPBACK` | Stage 0G. | HTTP 200, Core API service identity. |
| Codex Cloud OIS Console sandbox | `http://127.0.0.1:3000/` | `CODEX_CLOUD_LOOPBACK` | Stage 0G. | HTTP 200, OIS Console shell. |
| Codex Cloud PITS Shell sandbox | `http://127.0.0.1:3001/` | `CODEX_CLOUD_LOOPBACK` | Stage 0G. | HTTP 200, PITS Shell. |

Codex Cloud test endpoints are process-bound and not persistent public URLs.

## 4. Abacus Preview Proxy Endpoints

| Environment | Endpoint | Status | Stage evidence | Expected result |
|---|---|---|---|---|
| Abacus VM preview proxy, Core API health | `https://7a162f29d-4000.na116.preview.abacusai.app/health` | `ABACUS_PREVIEW_PUBLIC` | Stage 0K. | HTTP 200, Core API health. |
| Abacus VM preview proxy, OIS Console demo | `https://<abacus-preview-base>-3000.../` | `DEPRECATED` | Stage 0T-A corrected UI deployment to Apps Management Console App Shells. | Not canonical App Shell proof; use OIS Console App Shell deployment URL instead. |
| Abacus VM preview proxy, PITS Shell demo | `https://<abacus-preview-base>-3001.../` | `DEPRECATED` | Stage 0T-A corrected UI deployment to Apps Management Console App Shells. | Not canonical App Shell proof; use PITS Shell App Shell deployment URL instead. |

The Abacus preview proxy is public and useful for temporary proof, but it is tied to VM/process lifecycle and is not the final staging URL.

## 5. Abacus-managed Public Staging Endpoints

| Environment | Endpoint | Status | Stage evidence | Expected result |
|---|---|---|---|---|
| OIS NextGen Core API health | `https://ois-nextgen.abacusai.cloud/health` | `ABACUS_MANAGED_PUBLIC_STAGING` | Stage 0O. | HTTP 200, Core API health payload. |
| OIS NextGen platform overview | `https://ois-nextgen.abacusai.cloud/platform/overview` | `ABACUS_MANAGED_PUBLIC_STAGING` | Introduced in Stage 0P-B; populated in Stage 0Q-B. | HTTP 200, DB-backed read-only overview with seeded counts: industries 1, organizations 1, workspaces 1, projects 2, products 5, installations 2, modules 3, auditRecords 1. |
| OIS NextGen Core API root | `https://ois-nextgen.abacusai.cloud/` | `BLOCKED` | Stage 0O did not verify public root as a staging contract. | Do not claim until verified in a future stage. |
| OIS NextGen Core API docs | `https://ois-nextgen.abacusai.cloud/docs` | `BLOCKED` | Not verified on the managed staging domain. | Do not claim until verified in a future stage. |
| OIS NextGen additional DB-backed API routes | `https://ois-nextgen.abacusai.cloud/api/<db-backed-route>` | `BLOCKED` | Stages 0P and 0Q verified only read-only `/platform/overview`. | Blocked until later route-specific gates. |
| OIS Console App Shell deployment URL | `https://<ois-console-app-shell>.abacusai.app/` or Apps Management Console managed URL | `PLANNED_NOT_CREATED` | Stage 0T-A contract ready; Stage 0T-B local test harness ready; App Shell not created by Codex. | Expected to show OIS Console shell name, product code `OIS_CONSOLE`, shared Core API URL, health, overview counts and Core API-only DB access note. |
| PITS Shell App Shell deployment URL | `https://<pits-shell-app-shell>.abacusai.app/` or Apps Management Console managed URL | `PLANNED_NOT_CREATED` | Stage 0T-A contract ready; Stage 0T-B local test harness ready; App Shell not created by Codex. | Expected to show PITS Shell shell name, product code `PITS_SHELL`, shared Core API URL, health, overview counts and Core API-only DB access note. |

## 6. Existing Production/Legacy Endpoints - Do Not Touch

| Product/surface | Endpoint | Status | Evidence | Boundary |
|---|---|---|---|---|
| OIS Phase 1 App Shell | `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Stage 0N audit. | Live OIS Phase 1 app shell; do not touch during NextGen validation. |
| OIS Phase 1 custom domain | `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Stage 0N audit. | Same OIS Phase 1 backend/custom domain; do not touch. |

Known OIS Phase 1 production-equivalent resources include database `ois_phase1_dev` and inferred storage prefix `52067/`. Known Emerald/BQL legacy resources include database `emerald_bql_web_dev` and inferred storage prefix `49816/`. These are resource boundaries, not endpoint test targets.

## 7. Future Planned Endpoints

| Planned surface | Endpoint pattern | Status | Required gate before creation |
|---|---|---|---|
| OIS NextGen custom branded domain | `https://ois-nextgen.dmp247.com` or owner-approved equivalent | `PLANNED_NOT_CREATED` | NextGen staging validation, owner domain approval and publication plan. |
| Future OIS NextGen `dmp247.com` publication | Owner-approved future `dmp247.com` hostname; not the current Phase 1 endpoint unless a production cutover gate approves it. | `PLANNED_NOT_CREATED` | Production cutover gate. Current `https://ois.dmp247.com` remains `LEGACY_PRODUCTION_DO_NOT_TOUCH`. |
| OIS Console App Shell public staging | Apps Management Console Abacus-managed deployment URL for `OIS NextGen Console Demo` | `PLANNED_NOT_CREATED` | Owner-assisted App Shell creation/deployment evidence after Stage 0T-B local harness. |
| PITS Shell App Shell public staging | Apps Management Console Abacus-managed deployment URL for `PITS NextGen Shell Demo` | `PLANNED_NOT_CREATED` | Owner-assisted App Shell creation/deployment evidence after Stage 0T-B local harness. |
| OIS Console custom staging domain | `ois-ng.dmp247.com` or `ois-staging.dmp247.com` | `PLANNED_NOT_CREATED` | Only after App Shell deployment URLs pass; do not touch `ois.dmp247.com`. |
| PITS Shell custom staging domain | `pits-ng.dmp247.com` or `pits-staging.dmp247.com` | `PLANNED_NOT_CREATED` | Only after App Shell deployment URLs pass. |
| OIS Console port preview | `https://<abacus-preview-base>-3000.../` | `DEPRECATED` | Stage 0T-A marks SuperComputer preview as non-canonical for App Shell proof. |
| PITS Shell port preview | `https://<abacus-preview-base>-3001.../` | `DEPRECATED` | Stage 0T-A marks SuperComputer preview as non-canonical for App Shell proof. |
| Additional DB-backed Core API routes | `https://ois-nextgen.abacusai.cloud/api/<route>` | `PLANNED_NOT_CREATED` | Stage 0Q or later route-specific smoke/stabilization gate. |

## 8. Stage Endpoint Matrix

| Stage | Endpoint | Status | Persistence | Expected result |
|---|---|---|---|---|
| Stage 0G | `http://127.0.0.1:4000/health` | `CODEX_CLOUD_LOOPBACK` | Ephemeral sandbox. | HTTP 200. |
| Stage 0G | `http://127.0.0.1:4000/` | `CODEX_CLOUD_LOOPBACK` | Ephemeral sandbox. | HTTP 200. |
| Stage 0G | `http://127.0.0.1:3000/` | `CODEX_CLOUD_LOOPBACK` | Ephemeral sandbox. | HTTP 200. |
| Stage 0G | `http://127.0.0.1:3001/` | `CODEX_CLOUD_LOOPBACK` | Ephemeral sandbox. | HTTP 200. |
| Stage 0J | `http://127.0.0.1:4000/health` | `ABACUS_VM_LOCAL` | VM-local process only. | HTTP 200. |
| Stage 0J | `http://127.0.0.1:4000/` | `ABACUS_VM_LOCAL` | VM-local process only. | HTTP 200. |
| Stage 0K | `https://7a162f29d-4000.na116.preview.abacusai.app/health` | `ABACUS_PREVIEW_PUBLIC` | VM/process-bound preview. | HTTP 200. |
| Stage 0L | `https://ois-nextgen.abacusai.cloud/health` | `BLOCKED` | Public route existed, backend mapping absent. | HTTP 404 at that stage. |
| Stage 0O | `https://ois-nextgen.abacusai.cloud/health` | `ABACUS_MANAGED_PUBLIC_STAGING` | Persistent staging route while systemd/nginx config remains active. | HTTP 200. |
| Stage 0P | `https://ois-nextgen.abacusai.cloud/platform/overview` | `ABACUS_MANAGED_PUBLIC_STAGING` | Persistent staging route while systemd/nginx config remains active and `DATABASE_URL` remains configured. | HTTP 200 with zero counts before Stage 0Q seed. |
| Stage 0Q | `https://ois-nextgen.abacusai.cloud/platform/overview` | `ABACUS_MANAGED_PUBLIC_STAGING` | Same persistent DB-backed read-only route after Platform Kernel seed. | HTTP 200 with seeded Platform Kernel counts. |
| Stage 0R-A | `https://ois-nextgen.abacusai.cloud/health` | `ABACUS_MANAGED_PUBLIC_STAGING` | Unchanged; no local endpoint probe in Stage 0R-A. | HTTP 200 per Stage 0O/0Q evidence. |
| Stage 0R-A | `https://ois-nextgen.abacusai.cloud/platform/overview` | `ABACUS_MANAGED_PUBLIC_STAGING` | Unchanged; code inspection confirms read-only count route and `PLATFORM_KERNEL=IN_PROGRESS`. | HTTP 200 with seeded Platform Kernel counts per Stage 0Q evidence. |
| Stage 0R-B | `https://ois-nextgen.abacusai.cloud/health` | `ABACUS_MANAGED_PUBLIC_STAGING` | Unchanged; no local endpoint probe in Stage 0R-B. | HTTP 200 per Stage 0O/0Q evidence; local tests lock static no-DB health behavior. |
| Stage 0R-B | `https://ois-nextgen.abacusai.cloud/platform/overview` | `ABACUS_MANAGED_PUBLIC_STAGING` | Unchanged; local tests lock read-only count mapping and `PLATFORM_KERNEL=IN_PROGRESS`. | HTTP 200 with seeded Platform Kernel counts per Stage 0Q evidence. |
| Stage 0R-C | `https://ois-nextgen.abacusai.cloud/health` | `ABACUS_MANAGED_PUBLIC_STAGING` | Unchanged after Abacus runtime sync to `e862b98ea601fa6ab8be6b78fd3ebbde5e66c66d`. | HTTP 200 verified on Abacus after Core API restart. |
| Stage 0R-C | `https://ois-nextgen.abacusai.cloud/platform/overview` | `ABACUS_MANAGED_PUBLIC_STAGING` | Unchanged after Abacus runtime sync; seeded counts and `PLATFORM_KERNEL=IN_PROGRESS` remained stable. | HTTP 200 with seeded Platform Kernel counts verified on Abacus after Core API restart. |
| Stage 0R-D | `https://ois-nextgen.abacusai.cloud/health` | `ABACUS_MANAGED_PUBLIC_STAGING` | Unchanged; safe SSH scripts can check this endpoint from Abacus, but Stage 0R-D did not probe it locally. | HTTP 200 current live health endpoint. |
| Stage 0R-D | `https://ois-nextgen.abacusai.cloud/platform/overview` | `ABACUS_MANAGED_PUBLIC_STAGING` | Unchanged; safe SSH scripts can check this endpoint from Abacus, but Stage 0R-D did not probe it locally. | HTTP 200 with seeded Platform Kernel counts. |
| Stage 0S-A | `https://<ois-console-abacus-preview-or-app-shell>/` | `PLANNED_NOT_CREATED` | Planned OIS Console demo endpoint; code ready, not deployed. | Should render the OIS Console demo/status page and call `https://ois-nextgen.abacusai.cloud` server-side. |
| Stage 0S-A | `https://<pits-shell-abacus-preview-or-app-shell>/` | `PLANNED_NOT_CREATED` | Planned PITS Shell demo endpoint; code ready, not deployed. | Should render the PITS Shell demo/status page and call `https://ois-nextgen.abacusai.cloud` server-side. |
| Stage 0S-B | `https://<abacus-preview-base>-3000.../` | `DEPRECATED` | Temporary SuperComputer preview path superseded by Stage 0T-A. | Not canonical OIS Console App Shell proof. |
| Stage 0S-B | `https://<abacus-preview-base>-3001.../` | `DEPRECATED` | Temporary SuperComputer preview path superseded by Stage 0T-A. | Not canonical PITS Shell App Shell proof. |
| Stage 0T-A | OIS Console Apps Management Console deployment URL | `PLANNED_NOT_CREATED` | Planned OIS Console App Shell endpoint; contract ready, not deployed. | Should render OIS Console demo/status page and verify seeded Core API counts after later deployment. |
| Stage 0T-A | PITS Shell Apps Management Console deployment URL | `PLANNED_NOT_CREATED` | Planned PITS Shell App Shell endpoint; contract ready, not deployed. | Should render PITS Shell demo/status page and verify seeded Core API counts after later deployment. |
| Stage 0T-B | OIS Console Apps Management Console deployment URL | `PLANNED_NOT_CREATED` | Endpoint unchanged; local mocked page test harness ready. | Later App Shell URL should render OIS Console demo/status page and verify seeded Core API counts. |
| Stage 0T-B | PITS Shell Apps Management Console deployment URL | `PLANNED_NOT_CREATED` | Endpoint unchanged; local mocked page test harness ready. | Later App Shell URL should render PITS Shell demo/status page and verify seeded Core API counts. |
| Stage 0N audit | `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing live Phase 1 app shell. | Do not touch. |
| Stage 0N audit | `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing live Phase 1 custom domain. | Do not touch. |

## 9. Stage Delta Log Template

Every future stage report must include this section.

```md
## Published Endpoint Delta

### Added

| Endpoint | Status | Expected result | Evidence |
|---|---|---|---|
| None | N/A | N/A | N/A |

### Changed

| Endpoint | Previous status/result | New status/result | Evidence |
|---|---|---|---|
| None | N/A | N/A | N/A |

### Unchanged

| Endpoint | Status | Expected result |
|---|---|---|
| https://ois-nextgen.abacusai.cloud/health | ABACUS_MANAGED_PUBLIC_STAGING | HTTP 200 Core API health |
| https://ois-nextgen.abacusai.cloud/platform/overview | ABACUS_MANAGED_PUBLIC_STAGING | HTTP 200 DB-backed read-only platform overview with seeded counts |

### Deprecated / stopped

| Endpoint | Status | Reason |
|---|---|---|
| None | N/A | N/A |

### Do Not Touch

| Endpoint/resource | Status | Reason |
|---|---|---|
| https://oisys.abacusai.app | LEGACY_PRODUCTION_DO_NOT_TOUCH | OIS Phase 1 live App Shell |
| https://ois.dmp247.com | LEGACY_PRODUCTION_DO_NOT_TOUCH | OIS Phase 1 custom domain |

### Current Test Checklist

| Check | Command | Expected |
|---|---|---|
| Core API staging health | curl -i https://ois-nextgen.abacusai.cloud/health | HTTP 200 and Core API health payload |
| DB-backed platform overview | curl -i https://ois-nextgen.abacusai.cloud/platform/overview | HTTP 200, demo-data banner and seeded Platform Kernel counts |
```

## 10. Test Commands And Expected Responses

Use these commands only on endpoints allowed by the current stage. Do not probe `LEGACY_PRODUCTION_DO_NOT_TOUCH` endpoints unless the owner explicitly approves.

### Current Owner Test Checklist

| Check | Command | Expected response |
|---|---|---|
| OIS NextGen Core API staging health | `curl -i https://ois-nextgen.abacusai.cloud/health` | HTTP/2 200 and `{"status":"ok","service":"core-api","stage":"bootstrap-stage-a"}` |
| OIS NextGen platform overview | `curl -i https://ois-nextgen.abacusai.cloud/platform/overview` | HTTP 200, `DEMO DATA - NOT PRODUCTION` banner, and seeded counts: industries 1, organizations 1, workspaces 1, projects 2, products 5, installations 2, modules 3, auditRecords 1. |

### Local/Codex Loopback Commands

| Check | Command | Expected response |
|---|---|---|
| Core API local health | `curl -i http://127.0.0.1:4000/health` | HTTP 200 and Core API health payload. |
| Core API local root | `curl -i http://127.0.0.1:4000/` | HTTP 200 and Core API service identity. |
| OIS Console local root | `curl -i http://127.0.0.1:3000/` | HTTP 200 when Console is running. |
| PITS Shell local root | `curl -i http://127.0.0.1:3001/` | HTTP 200 when PITS Shell is running. |
| OIS Console local demo | `curl -i http://127.0.0.1:3000/` | HTTP 200 and the Stage 0S-A OIS Console demo/status page when Console is running. |
| PITS Shell local demo | `curl -i http://127.0.0.1:3001/` | HTTP 200 and the Stage 0S-A PITS Shell demo/status page when PITS Shell is running. |

### Abacus VM Preview Command

| Check | Command | Expected response |
|---|---|---|
| Preview Core API health | `curl -i https://7a162f29d-4000.na116.preview.abacusai.app/health` | HTTP 200 when the Core API process is running and preview proxy is active. |
| OIS Console App Shell deployment URL | `curl -i https://<ois-console-app-shell-managed-url>/` | Future owner-run check after Stage 0T-B harness; HTTP 200 and OIS Console demo/status page. |
| PITS Shell App Shell deployment URL | `curl -i https://<pits-shell-app-shell-managed-url>/` | Future owner-run check after Stage 0T-B harness; HTTP 200 and PITS Shell demo/status page. |

### Blocked/Planned Checks

| Check | Endpoint | Status | Rule |
|---|---|---|---|
| Public Core API root | `https://ois-nextgen.abacusai.cloud/` | `BLOCKED` | Do not claim until a future stage verifies it. |
| Public Core API docs | `https://ois-nextgen.abacusai.cloud/docs` | `BLOCKED` | Do not claim until a future stage verifies it. |
| Additional DB-backed public API routes | `https://ois-nextgen.abacusai.cloud/api/<db-backed-route>` | `BLOCKED` | Requires later route-specific approval. |
| Auth/demo-login | `https://ois-nextgen.abacusai.cloud/auth/demo-login` | `BLOCKED` | Not called through Stage 0Q; requires later auth gate. |
| Write endpoints | Owner-approved future URLs | `BLOCKED` | Not called through Stage 0Q; requires later write-path gate. |
| SuperComputer OIS Console preview | `https://<abacus-preview-base>-3000.../` | `DEPRECATED` | Not canonical App Shell proof after Stage 0T-A. |
| SuperComputer PITS Shell preview | `https://<abacus-preview-base>-3001.../` | `DEPRECATED` | Not canonical App Shell proof after Stage 0T-A. |
| Console App Shell public staging | Apps Management Console managed URL | `PLANNED_NOT_CREATED` | Requires future Console App Shell creation/deployment gate; Stage 0S-A code is demo-ready but not deployed. |
| PITS App Shell public staging | Apps Management Console managed URL | `PLANNED_NOT_CREATED` | Requires future PITS App Shell creation/deployment gate; Stage 0S-A code is demo-ready but not deployed. |
| OIS Phase 1 live app shell | `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Do not test or mutate without owner approval. |
| OIS Phase 1 custom domain | `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Do not test or mutate without owner approval. |
