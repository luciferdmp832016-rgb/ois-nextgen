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
| `ABACUS_APP_SHELL_PREVIEW_PUBLIC` | Abacus Apps Management Console App Shell preview URL; public staging/proof endpoint for a specific App Shell. |
| `OIS_CONSOLE_APP_SHELL_PREVIEW_UNAVAILABLE_404` | Previously deployed OIS Console App Shell preview URL is currently returning HTTP 404 and must be restored or redeployed before two-shell verification. |
| `ABACUS_MANAGED_PUBLIC_STAGING` | Abacus-managed public staging domain for OIS NextGen. |
| `CUSTOM_SUBDOMAIN_TLS_BLOCKED` | DNS and local Host-header routing are confirmed, but public custom hostname HTTPS is blocked by Abacus edge/TLS registration. |
| `PLANNED_CLOUDFLARE_TUNNEL` | Endpoint is planned to be served through Cloudflare Tunnel; tunnel/DNS execution has not occurred yet. |
| `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 or legacy production-equivalent surface; do not touch. |
| `PLANNED_NOT_CREATED` | Planned future endpoint that does not exist yet. |
| `SOURCE_ACCESS_BLOCKED` | Planned endpoint cannot be created yet because the App Shell source acquisition path is blocked. |
| `BLOCKED` | Endpoint route is intentionally unavailable or blocked by missing gate/config. |
| `DEPRECATED` | Endpoint is no longer part of the active test/publication path. |

## 1. Current Live Endpoints

| Product/surface | Endpoint | Status | Expected result | Owner action |
|---|---|---|---|---|
| OIS NextGen Core API staging health | `https://ois-nextgen.abacusai.cloud/health` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200 with `{"status":"ok","service":"core-api","stage":"bootstrap-stage-a"}` | Primary current NextGen staging health check. |
| OIS NextGen platform overview | `https://ois-nextgen.abacusai.cloud/platform/overview` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200, DB-backed read-only platform overview with seeded Platform Kernel counts. | Primary current DB-backed staging smoke check. |
| PITS Shell App Shell preview | `https://113d93f4db-3001.na116.preview.abacusai.app` | `ABACUS_APP_SHELL_PREVIEW_PUBLIC` | HTTP 200 PITS Shell demo/status page with `PITS_SHELL`, shared Core API URL, demo banner and seeded counts. | Primary current PITS Shell App Shell preview check. |
| OIS Console App Shell preview | `https://161acd4ff8.na116.preview.abacusai.app` | `OIS_CONSOLE_APP_SHELL_PREVIEW_UNAVAILABLE_404` | Currently HTTP 404. Stage 0T-C screenshot evidence remains historical; Stage 0T-D-R2 records current preview unavailability. | Restore or redeploy before two-App-Shell verification. |
| OIS Phase 1 App Shell | `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing live OIS Phase 1 app shell. | Do not touch during NextGen staging. |
| OIS Phase 1 custom domain | `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Same OIS Phase 1 backend/custom domain. | Do not touch during NextGen staging. |

Current NextGen live scope is Core API `/health`, DB-backed read-only `/platform/overview`, and the PITS Shell App Shell preview. Platform Kernel seed data is demo/staging data marked `DEMO DATA - NOT PRODUCTION`. Stage 0T-A corrects the UI deployment path: OIS Console and PITS Shell must be separate Apps Management Console App Shells with Abacus-managed deployment URLs. Stage 0T-B adds local/Codex mocked UI demo tests before App Shell deployment. Stage 0T-C deployed OIS Console only as an App Shell preview. Stage 0T-D-R1 recorded PITS Shell as source-access blocked for GitHub clone and prepared a direct upload bundle. Stage 0T-D-R2 deployed PITS Shell from that bundle at `https://113d93f4db-3001.na116.preview.abacusai.app`; the previously deployed OIS Console preview URL now returns HTTP 404, so two-App-Shell simultaneous verification is blocked until OIS Console is restored or redeployed. Stage 0T-E-A-R1 prepares a direct upload bundle for that OIS Console restore/redeploy path but does not change endpoints. Stage 0U-A confirms DNS CNAME propagation and local SuperComputer/nginx Host-header routing for `ois-ng.dmp247.com` and `pits-ng.dmp247.com`, but public custom HTTPS is blocked by Abacus edge/TLS registration. Stage 0V-A changes those custom subdomains to planned Cloudflare Tunnel endpoints; no tunnel or DNS execution has occurred yet. SuperComputer preview URLs on ports `3000` and `3001` are deprecated for App Shell proof. Worker, `/auth/demo-login`, write endpoints and production/legacy `dmp247.com` domains are not live on the Abacus-managed public staging domain yet.

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
| PITS Shell App Shell preview | `https://113d93f4db-3001.na116.preview.abacusai.app` | `ABACUS_APP_SHELL_PREVIEW_PUBLIC` | Stage 0T-D-R2 owner/Abacus upload-bundle deploy evidence. | Shows PITS Shell name, product code `PITS_SHELL`, shared Core API URL, health, overview counts and Core API-only DB access note. |
| OIS Console App Shell preview | `https://161acd4ff8.na116.preview.abacusai.app` | `OIS_CONSOLE_APP_SHELL_PREVIEW_UNAVAILABLE_404` | Stage 0T-C owner/Abacus screenshot evidence confirmed prior HTTP 200; Stage 0T-D-R2 verification reported current HTTP 404. | Restore or redeploy before two-App-Shell simultaneous verification. |

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
| OIS Console App Shell restoration | Existing preview `https://161acd4ff8.na116.preview.abacusai.app` or a new owner-approved Apps Management Console URL | `PLANNED_NOT_CREATED` | Stage 0T-E-A-R1 upload bundle is ready; restore or redeploy before two-App-Shell verification. |
| OIS Console SuperComputer product subdomain root | `https://ois-ng.dmp247.com` | `PLANNED_CLOUDFLARE_TUNNEL` | Planned Cloudflare Tunnel route to `http://127.0.0.1:3000`; no tunnel/DNS execution in Stage 0V-A. Do not touch `ois.dmp247.com`. |
| PITS Shell SuperComputer product subdomain root | `https://pits-ng.dmp247.com` | `PLANNED_CLOUDFLARE_TUNNEL` | Planned Cloudflare Tunnel route to `http://127.0.0.1:3001`; no tunnel/DNS execution in Stage 0V-A. |
| OIS Console SuperComputer product subdomain dashboard | `https://ois-ng.dmp247.com/dashboard` | `PLANNED_CLOUDFLARE_TUNNEL` | Planned through the same OIS Console Cloudflare Tunnel hostname. |
| PITS Shell SuperComputer product subdomain projects | `https://pits-ng.dmp247.com/projects` | `PLANNED_CLOUDFLARE_TUNNEL` | Planned through the same PITS Shell Cloudflare Tunnel hostname. |
| Optional Core API custom staging hostname | `https://api-ng.dmp247.com` | `PLANNED_NOT_CREATED` | Optional later Cloudflare Tunnel route to `http://127.0.0.1:4000`; not part of Stage 0V-A execution. |
| OIS Console alternate custom staging domain | `ois-staging.dmp247.com` | `PLANNED_NOT_CREATED` | Future alternative only; do not touch `ois.dmp247.com`. |
| PITS Shell alternate custom staging domain | `pits-staging.dmp247.com` | `PLANNED_NOT_CREATED` | Future alternative only. |
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
| Stage 0T-C | `https://161acd4ff8.na116.preview.abacusai.app` | `ABACUS_APP_SHELL_PREVIEW_PUBLIC` | OIS Console App Shell preview deployed through Abacus App Shell flow. | HTTP 200 OIS Console demo/status page with `OIS_CONSOLE`, shared Core API URL, demo banner, Core API health and canonical seeded counts. |
| Stage 0T-C | PITS Shell Apps Management Console deployment URL | `PLANNED_NOT_CREATED` | Unchanged; PITS Shell was not deployed in Stage 0T-C. | Later PITS App Shell URL should render PITS Shell demo/status page and verify seeded Core API counts. |
| Stage 0T-D-R1 | PITS Shell Apps Management Console deployment URL | `SOURCE_ACCESS_BLOCKED` | Abacus App Shell GitHub clone path blocked; direct upload bundle prepared. | Use `artifacts/abacus/pits-shell-abacus-upload-bundle.zip` in a later upload deploy stage. |
| Stage 0T-D-R2 | `https://113d93f4db-3001.na116.preview.abacusai.app` | `ABACUS_APP_SHELL_PREVIEW_PUBLIC` | PITS Shell App Shell deployed successfully from `pits-shell-abacus-upload-bundle.zip`. | HTTP 200 PITS Shell demo/status page with `PITS_SHELL`, shared Core API URL, demo banner, Core API health and seeded counts. |
| Stage 0T-D-R2 | `https://161acd4ff8.na116.preview.abacusai.app` | `OIS_CONSOLE_APP_SHELL_PREVIEW_UNAVAILABLE_404` | Previously deployed OIS Console preview returned HTTP 404 during two-shell verification. | Blocks two-App-Shell simultaneous verification until restored or redeployed. |
| Stage 0T-E-A-R1 | `https://161acd4ff8.na116.preview.abacusai.app` | `OIS_CONSOLE_APP_SHELL_PREVIEW_UNAVAILABLE_404` | OIS Console upload bundle prepared; no redeploy executed in this stage. | Remains HTTP 404 until the upload bundle is used in a later restore/redeploy stage. |
| Stage 0T-E-A-R1 | `https://113d93f4db-3001.na116.preview.abacusai.app` | `ABACUS_APP_SHELL_PREVIEW_PUBLIC` | Unchanged from Stage 0T-D-R2. | HTTP 200 PITS Shell demo/status page. |
| Stage 0U-A | `https://ois-ng.dmp247.com` | `CUSTOM_SUBDOMAIN_TLS_BLOCKED` | DNS CNAME propagated and local Host-header route returned HTTP 200 for OIS Console. | Public HTTPS failed SSL handshake; public HTTP root returned HTTP 409. |
| Stage 0U-A | `https://pits-ng.dmp247.com` | `CUSTOM_SUBDOMAIN_TLS_BLOCKED` | DNS CNAME propagated and local Host-header route returned HTTP 200 for PITS Shell. | Public HTTPS failed SSL handshake; public HTTP root returned HTTP 409. |
| Stage 0U-A | `https://ois-ng.dmp247.com/dashboard` | `CUSTOM_SUBDOMAIN_TLS_BLOCKED` | Local OIS host route passed with seeded counts through Core API. | Public HTTPS `/dashboard` failed SSL handshake. |
| Stage 0U-A | `https://pits-ng.dmp247.com/projects` | `CUSTOM_SUBDOMAIN_TLS_BLOCKED` | Local PITS host route passed with seeded counts through Core API. | Public HTTPS `/projects` failed SSL handshake. |
| Stage 0V-A | `https://ois-ng.dmp247.com` | `PLANNED_CLOUDFLARE_TUNNEL` | Cloudflare Tunnel plan maps public hostname to `http://127.0.0.1:3000`. | Not executed; no `cloudflared` install or DNS change. |
| Stage 0V-A | `https://pits-ng.dmp247.com` | `PLANNED_CLOUDFLARE_TUNNEL` | Cloudflare Tunnel plan maps public hostname to `http://127.0.0.1:3001`. | Not executed; no `cloudflared` install or DNS change. |
| Stage 0V-A | `https://ois-ng.dmp247.com/dashboard` | `PLANNED_CLOUDFLARE_TUNNEL` | Planned through OIS Console tunnel route. | Not executed. |
| Stage 0V-A | `https://pits-ng.dmp247.com/projects` | `PLANNED_CLOUDFLARE_TUNNEL` | Planned through PITS Shell tunnel route. | Not executed. |
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
| PITS Shell App Shell preview | `curl -i https://113d93f4db-3001.na116.preview.abacusai.app` | HTTP 200 and PITS Shell demo/status page with `PITS_SHELL`, shared Core API URL, demo banner and seeded counts. |
| OIS Console App Shell preview restoration check | `curl -i https://161acd4ff8.na116.preview.abacusai.app` | Currently HTTP 404 per Stage 0T-D-R2; restore or redeploy before two-App-Shell verification. |

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
| PITS Shell App Shell preview | `curl -i https://113d93f4db-3001.na116.preview.abacusai.app` | Stage 0T-D-R2 App Shell preview check; HTTP 200 and PITS Shell demo/status page. |
| OIS Console App Shell preview | `curl -i https://161acd4ff8.na116.preview.abacusai.app` | Stage 0T-D-R2 current state is HTTP 404; Stage 0T-C HTTP 200 evidence remains historical only. |

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
| Console App Shell custom/branded staging | Owner-approved future custom URL | `PLANNED_NOT_CREATED` | Stage 0T-C confirmed historical OIS Console preview deployment, but Stage 0T-D-R2 found the current preview URL unavailable; custom/branded staging remains future and must not use `ois.dmp247.com`. |
| OIS Console App Shell current preview | `https://161acd4ff8.na116.preview.abacusai.app` | `OIS_CONSOLE_APP_SHELL_PREVIEW_UNAVAILABLE_404` | Restore or redeploy before two-App-Shell verification. |
| OIS product subdomain root | `https://ois-ng.dmp247.com` | `PLANNED_CLOUDFLARE_TUNNEL` | Planned Cloudflare Tunnel route to `127.0.0.1:3000`; do not claim public HTTP 200 until a later tunnel execution stage verifies it. |
| PITS product subdomain root | `https://pits-ng.dmp247.com` | `PLANNED_CLOUDFLARE_TUNNEL` | Planned Cloudflare Tunnel route to `127.0.0.1:3001`; do not claim public HTTP 200 until a later tunnel execution stage verifies it. |
| OIS product subdomain dashboard | `https://ois-ng.dmp247.com/dashboard` | `PLANNED_CLOUDFLARE_TUNNEL` | Planned through the OIS Console tunnel hostname; not executed in Stage 0V-A. |
| PITS product subdomain projects | `https://pits-ng.dmp247.com/projects` | `PLANNED_CLOUDFLARE_TUNNEL` | Planned through the PITS Shell tunnel hostname; not executed in Stage 0V-A. |
| Optional Core API tunnel hostname | `https://api-ng.dmp247.com` | `PLANNED_NOT_CREATED` | Optional later route only; not part of Stage 0V-A. |
| OIS Phase 1 live app shell | `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Do not test or mutate without owner approval. |
| OIS Phase 1 custom domain | `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Do not test or mutate without owner approval. |
