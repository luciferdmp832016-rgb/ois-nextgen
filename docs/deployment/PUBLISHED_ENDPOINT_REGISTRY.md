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
| `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Endpoint is publicly reachable over HTTPS through Cloudflare Tunnel and verified against the expected app shell/page. |
| `PUBLIC_STAGING_RUNTIME_OPERATIONAL` | Durable Core API, OIS Console, PITS Shell and Cloudflare Tunnel runtime operation is verified; endpoint status remains unchanged. |
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
| OIS NextGen owner review | `https://ois-nextgen.abacusai.cloud/platform/owner-review` | `PLANNED_NOT_CREATED` | HTTP 200 read-only owner review/action-boundary payload after Stage 1I runtime sync. | Stage 1I safe action-boundary smoke check. |
| OIS NextGen admin boundary | `https://ois-nextgen.abacusai.cloud/platform/admin-boundary` | `PLANNED_NOT_CREATED` | HTTP 200 read-only audit/admin permission model payload after Stage 1J runtime sync. | Stage 1J admin boundary smoke check. |
| OIS NextGen product UAT baseline | `https://ois-nextgen.abacusai.cloud/platform/product-uat` | `PLANNED_NOT_CREATED` | HTTP 200 read-only product user journey UAT baseline and functional gap map payload after Stage 1K runtime sync. | Stage 1K product UAT/gap-map smoke check. |
| OIS NextGen ecosystem products | `https://ois-nextgen.abacusai.cloud/platform/ecosystem-products` | `PLANNED_NOT_CREATED` | HTTP 200 Powered by OIS product registry after Stage 2F migration deploy and runtime sync. | Stage 2F product registry smoke check. |
| OIS NextGen learning center API | `https://ois-nextgen.abacusai.cloud/platform/learning/center` | `PLANNED_NOT_CREATED` | HTTP 200 SuperAdmin Learning Center payload after Stage 2F migration deploy and runtime sync. | Stage 2F learning center smoke check. |
| OIS NextGen agent chat API | `https://ois-nextgen.abacusai.cloud/platform/agent/chat` | `PLANNED_NOT_CREATED` | HTTP 200 deterministic OIS Agent Runtime stub response after Stage 2F runtime sync. | Stage 2F agent runtime smoke check. |
| OIS NextGen knowledge layers API | `https://ois-nextgen.abacusai.cloud/platform/knowledge/layers` | `PLANNED_NOT_CREATED` | HTTP 200 KL-0 through KL-5 taxonomy after Stage 2G migration deploy and runtime sync. | Stage 2G knowledge layer smoke check. |
| OIS NextGen knowledge context API | `https://ois-nextgen.abacusai.cloud/platform/knowledge/context` | `PLANNED_NOT_CREATED` | HTTP 200 deterministic knowledge context with global `knowledgeLayerTaxonomy`, no LLM call and no canonical write after Stage 2G-R1 runtime sync. | Stage 2G-R1 knowledge context smoke check. |
| OIS NextGen KEIHB bundle API | `https://ois-nextgen.abacusai.cloud/platform/knowledge/keihb/bundles` | `PLANNED_NOT_CREATED` | HTTP 200 KEIHB projection bundles with global `knowledgeLayerTaxonomy` and truthful per-bundle `includedLayerKeys` after Stage 2G-R1 runtime sync. | Stage 2G-R1 KEIHB projection smoke check. |
| OIS NextGen architecture mindmap API | `https://ois-nextgen.abacusai.cloud/platform/architecture/mindmap` | `PLANNED_NOT_CREATED` | HTTP 200 machine-readable OIS ecosystem architecture map after Stage 2G runtime sync. | Stage 2G mindmap smoke check. |
| OIS NextGen OIMA product code API | `https://ois-nextgen.abacusai.cloud/platform/products/code/OIMA` | `PLANNED_NOT_CREATED` | HTTP 200 OIMA product boundary projection with `productCode`, `productName`, `currentRuntimeCapabilities`, `plannedRuntimeCapabilities`, `MEETING_INTAKE`, `TRANSCRIPT_PROCESSING`, `MEETING_INTELLIGENCE_PRODUCT`, `PRODUCT_BOUNDARY_READY` and no fake installations after Stage 2K runtime sync. | Stage 2K OIMA product registry smoke check. |
| OIS NextGen OIMA overview API | `https://ois-nextgen.abacusai.cloud/platform/oima/overview` | `PLANNED_NOT_CREATED` | HTTP 200 OIMA overview with Stage 2K/OIMA-2 product shell metadata, transcript-first/audio-optional intake rules, current/planned runtime capabilities, empty-state surfaces, safety boundaries, OIS Core reuse map and explicit Universal Knowledge API display metadata after runtime sync. | Stage 2K OIMA overview smoke check validates `productCode`, `productName`, `currentRuntimeCapabilities`, `MEETING_INTAKE`, `TRANSCRIPT_PROCESSING`, `emptyStateSurfaces`, `universalKnowledgeApiDisplayName` and `universalKnowledgeApiLabel`. |
| OIS NextGen OIMA source modes API | `https://ois-nextgen.abacusai.cloud/platform/oima/source-modes` | `PLANNED_NOT_CREATED` | HTTP 200 source mode taxonomy including `TRANSCRIPT_ONLY`, `AUDIO_ONLY`, `TRANSCRIPT_AND_AUDIO`, `LISTENER_CAPTURED`, transcript-primary mode metadata and listener planned/not-runtime metadata. | Stage 2K source-mode smoke check. |
| OIS NextGen OIMA roadmap API | `https://ois-nextgen.abacusai.cloud/platform/oima/roadmap` | `PLANNED_NOT_CREATED` | HTTP 200 OIMA roadmap with `Stage 2K`, `TRANSCRIPT_PROCESSING_READY`, `OIMA-1`, `OIMA-2` and future analysis/listener stages. | Stage 2K roadmap smoke check. |
| OIS NextGen OIMA boundary API | `https://ois-nextgen.abacusai.cloud/platform/oima/boundary` | `PLANNED_NOT_CREATED` | HTTP 200 OIMA safety boundary with meeting intake and transcript processing enabled, audio/listener/voice-clone/LLM/analytics runtimes disabled, no canonical write, no auto-promotion and no impersonation markers. | Stage 2K boundary smoke check. |
| OIS NextGen OIMA meetings API | `https://ois-nextgen.abacusai.cloud/platform/oima/meetings` | `PLANNED_NOT_CREATED` | HTTP 200 OIMA Meeting Intake list payload with `intakeContract`, `meetingStatuses`, `sourceFileTypes`, `uploadStatuses`, `TRANSCRIPT_ONLY`, `TRANSCRIPT_AND_AUDIO`, `READY_FOR_PROCESSING`, `TRANSCRIPT`, `AUDIO`, `noFakeMeetingAnalysis=true` and `noLlmCalls=true`. Meeting rows may truthfully be empty until a user registers a meeting. | Stage 2J/2K Meeting Intake contract smoke check. |
| OIS NextGen OIMA transcript contract API | `https://ois-nextgen.abacusai.cloud/platform/oima/transcripts/contract` | `PLANNED_NOT_CREATED` | HTTP 200 OIMA transcript processing contract with `Stage 2K / OIMA-2`, `TRANSCRIPT_PROCESSING`, `RAW`, `NORMALIZED`, `CORRECTED`, `MICROSOFT_TEAMS`, `GENERIC_TEXT`, `NEEDS_REVIEW`, `rawTranscriptImmutable=true`, `normalizedTranscriptSeparate=true`, `rawTranscriptOverwriteAllowed=false`, `audioProcessingImplemented=false`, `meetingAnalyticsImplemented=false`, `issueDecisionActionRiskExtractionImplemented=false` and `realLlmCallsEnabled=false`. | Stage 2K transcript contract smoke check. |
| OIS NextGen OIMA meeting detail API | `https://ois-nextgen.abacusai.cloud/platform/oima/meetings/{meeting-id}` | `PLANNED_NOT_CREATED` | HTTP 200 OIMA Meeting Detail payload for a real registered meeting with metadata, source files, transcript/audio availability and planned next-step placeholders; no seeded fake detail row is required. | Stage 2J/2K real-record detail check after meeting registration. |
| OIS NextGen OIMA transcript status API | `https://ois-nextgen.abacusai.cloud/platform/oima/meetings/{meeting-id}/transcript/status` | `PLANNED_NOT_CREATED` | HTTP 200 transcript status for a real registered meeting with parse-run status, versions, segment count, warning count and immutable/raw-normalized boundary flags. | Stage 2K real-record transcript status check after meeting registration. |
| OIS NextGen OIMA transcript versions API | `https://ois-nextgen.abacusai.cloud/platform/oima/meetings/{meeting-id}/transcript/versions` | `PLANNED_NOT_CREATED` | HTTP 200 transcript versions for a real registered meeting, including truthful `RAW`, `NORMALIZED` or `CORRECTED` version rows. | Stage 2K real-record transcript versions check after meeting registration. |
| OIS NextGen OIMA transcript segments API | `https://ois-nextgen.abacusai.cloud/platform/oima/meetings/{meeting-id}/transcript/segments` | `PLANNED_NOT_CREATED` | HTTP 200 ordered transcript segments for a real processed meeting, preserving raw speaker, timestamp, raw text and source order while exposing separate normalized text. | Stage 2K real-record transcript segment check after meeting registration. |
| OIS NextGen OIMA transcript warnings API | `https://ois-nextgen.abacusai.cloud/platform/oima/meetings/{meeting-id}/transcript/warnings` | `PLANNED_NOT_CREATED` | HTTP 200 parse warnings for a real processed meeting; warnings may truthfully be empty. | Stage 2K real-record transcript warning check after meeting registration. |
| OIS Console Cloudflare Tunnel staging | `https://ois-ng.dmp247.com` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | HTTPS opens OIS Console with `OIS_CONSOLE`, shared Core API URL, healthy Core API and seeded counts. | Primary current OIS product staging subdomain. |
| OIS Console Cloudflare Tunnel dashboard | `https://ois-ng.dmp247.com/dashboard` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | HTTPS opens OIS Platform Overview. | Current OIS dashboard smoke check. |
| OIS Console Cloudflare Tunnel products | `https://ois-ng.dmp247.com/products` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | HTTPS opens OIS Products & Modules route. | Current OIS products smoke check. |
| OIS Console Cloudflare Tunnel workspaces | `https://ois-ng.dmp247.com/workspaces` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | HTTPS opens OIS Workspaces route. | Current OIS workspaces smoke check. |
| OIS Console Cloudflare Tunnel runtime | `https://ois-ng.dmp247.com/runtime` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | HTTPS opens OIS Runtime Status route. | Current OIS runtime smoke check. |
| OIS Console Learning Center | `https://ois-ng.dmp247.com/learning-center` | `PLANNED_NOT_CREATED` | HTTP 200 OIS Learning Center with learning stream, pending review, policies and executive queue after Stage 2F runtime sync. | Stage 2F OIS Learning Center smoke check. |
| OIS Console Knowledge Fabric | `https://ois-ng.dmp247.com/knowledge-fabric` | `PLANNED_NOT_CREATED` | HTTP 200 OIS Knowledge Fabric with KL layers, canonical items, evidence, mappings, KEIHB bundles and mindmap after Stage 2G runtime sync. | Stage 2G Knowledge Fabric smoke check. |
| OIS Console OIMA product boundary | `https://ois-ng.dmp247.com/oima` | `PLANNED_NOT_CREATED` | HTTP 200 OIMA product shell with OIMA overview, product boundary, source modes, safety boundary, OIS Core reuse, roadmap, OIMA-2 transcript ready status and truthful product surface empty states after Stage 2K runtime sync. | Stage 2K OIMA UI smoke check. |
| OIS Console OIMA Meeting Library | `https://ois-ng.dmp247.com/oima/meetings` | `PLANNED_NOT_CREATED` | HTTP 200 OIMA Meeting Library table with title, meeting date, source mode, status, transcript/audio presence, created date and open-detail action; empty table is valid before user registration. | Stage 2J/2K Meeting Library UI smoke check. |
| OIS Console OIMA Upload/Register Meeting | `https://ois-ng.dmp247.com/oima/meetings/new` | `PLANNED_NOT_CREATED` | HTTP 200 OIMA meeting intake form with transcript-first validation, optional audio metadata registration, listener planned/not-runtime copy, transcript processing available after registration and no fake meeting analysis. | Stage 2K meeting creation UI smoke check. |
| OIS Console OIMA Meeting Detail | `https://ois-ng.dmp247.com/oima/meetings/{meeting-id}` | `PLANNED_NOT_CREATED` | HTTP 200 OIMA detail route for a real registered meeting, including source files, transcript processing status, version list, segment timeline, warnings and planned OIS Agent Analysis, Clarification Review and Dashboard placeholders. | Stage 2K real-record detail UI check after meeting registration. |
| OIS Console Agent Widget | `https://ois-ng.dmp247.com` | `PLANNED_NOT_CREATED` | OIS Console pages show the floating `Powered by OIS` Agent Widget after Stage 2F runtime sync. | Stage 2F widget browser/UAT check. |
| PITS Shell Cloudflare Tunnel staging | `https://pits-ng.dmp247.com` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | HTTPS opens PITS Shell with `PITS_SHELL`, shared Core API URL, healthy Core API and seeded counts. | Primary current PITS product staging subdomain. |
| PITS Shell Cloudflare Tunnel projects | `https://pits-ng.dmp247.com/projects` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | HTTPS opens PITS Project Selector. | Current PITS projects smoke check. |
| PITS Shell Cloudflare Tunnel runtime | `https://pits-ng.dmp247.com/runtime` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | HTTPS opens PITS Runtime Status route. | Current PITS runtime smoke check. |
| PITS Shell App Shell preview | `https://113d93f4db-3001.na116.preview.abacusai.app` | `ABACUS_APP_SHELL_PREVIEW_PUBLIC` | HTTP 200 PITS Shell demo/status page with `PITS_SHELL`, shared Core API URL, demo banner and seeded counts. | Primary current PITS Shell App Shell preview check. |
| OIS Console App Shell preview | `https://161acd4ff8.na116.preview.abacusai.app` | `OIS_CONSOLE_APP_SHELL_PREVIEW_UNAVAILABLE_404` | Currently HTTP 404. Stage 0T-C screenshot evidence remains historical; Stage 0T-D-R2 records current preview unavailability. | Restore or redeploy before two-App-Shell verification. |
| OIS Phase 1 App Shell | `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing live OIS Phase 1 app shell. | Do not touch during NextGen staging. |
| OIS Phase 1 custom domain | `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Same OIS Phase 1 backend/custom domain. | Do not touch during NextGen staging. |

Current NextGen live scope is Core API `/health`, DB-backed read-only `/platform/overview`, Cloudflare Tunnel public OIS/PITS staging subdomains and the PITS Shell App Shell preview. Platform Kernel seed data is demo/staging data marked `DEMO DATA - NOT PRODUCTION`. Stage 0T-A corrects the UI deployment path: OIS Console and PITS Shell must be separate Apps Management Console App Shells with Abacus-managed deployment URLs. Stage 0T-B adds local/Codex mocked UI demo tests before App Shell deployment. Stage 0T-C deployed OIS Console only as an App Shell preview. Stage 0T-D-R1 recorded PITS Shell as source-access blocked for GitHub clone and prepared a direct upload bundle. Stage 0T-D-R2 deployed PITS Shell from that bundle at `https://113d93f4db-3001.na116.preview.abacusai.app`; the previously deployed OIS Console preview URL now returns HTTP 404, so two-App-Shell simultaneous verification is blocked until OIS Console is restored or redeployed. Stage 0T-E-A-R1 prepares a direct upload bundle for that OIS Console restore/redeploy path but does not change endpoints. Stage 0U-A confirmed DNS CNAME propagation and local SuperComputer/nginx Host-header routing for `ois-ng.dmp247.com` and `pits-ng.dmp247.com`, but public custom HTTPS was blocked by Abacus edge/TLS registration. Stage 0V-A planned Cloudflare Tunnel, and Stage 0V-B/C verified Cloudflare Tunnel `ois-nextgen-abacus` with public HTTPS OIS/PITS product staging subdomains. Stage 0W-A adds durable systemd runtime operations and public endpoint checks without changing published endpoints. Stage 0W-B records public staging as operational and updates ops scripts so cloudflared status is token-safe. Stage 1A adds product shell navigation baseline routes; owner Abacus verification initially found new-route HTTP 404s on OIS `/products`, `/workspaces`, `/runtime` and PITS `/runtime`. Stage 1A-R1 added the clean-build and route-manifest hotfix. Stage 1A-R2 records the manual orphan UI port cleanup evidence that restored all Stage 1A local/public routes and makes the cleanup permanent in public staging restart ops. Stage 1B adds source-ready read-only Platform Registry API endpoints and registry-aware OIS/PITS UI binding. Stage 1C adds source-ready read-only registry detail endpoints and OIS/PITS cross-product detail links. Stage 1C-R1 hotfixes the existing detail UI response-body marker contract. Stage 1D adds source-ready read-only registry runtime health and owner-facing OIS/PITS health panels. Stage 1E adds source-ready read-only registry governance/readiness and owner-facing OIS/PITS readiness panels. Stage 1F adds source-ready owner cockpit and visual UAT navigation markers without adding an endpoint. Stage 1F-R1 fixes the OIS Console root cockpit marker contract so `/` renders deterministic server-side `Ready to operate` text while preserving the real cockpit status; public endpoint verification is pending owner runtime sync and browser/UAT. SuperComputer preview URLs on ports `3000` and `3001` are deprecated for App Shell proof. Worker, `/auth/demo-login`, write endpoints and production/legacy `dmp247.com` domains are not live on the Abacus-managed public staging domain yet.

Stage 1G standardizes the existing OIS/PITS public staging shells around a modern responsive layout. It adds no endpoint, but after owner runtime sync the OIS and PITS roots should also include `Modern Shell Layout`, `Shell Navigation Toggle`, `Fixed Navigation Shell` and `Responsive Product Shell`.

Stage 1H polishes the existing OIS/PITS public staging shells with owner-first IA, visual hierarchy, status badges, safe empty/fallback states and responsive readability. It adds no endpoint, but after owner runtime sync the OIS and PITS roots should also include `Owner-first Design System`, `Visual Hierarchy Standard` and `Owner-friendly Status Badges`.

Stage 1I adds read-only Core API `/platform/owner-review` and preview-only OIS/PITS owner review boundary surfaces. After owner runtime sync, dashboard/runtime/detail routes should include `Owner Review Queue`, `Safe Action Boundary`, `Read-only preview` and `Future admin action requires audit`.

Stage 1J adds read-only Core API `/platform/admin-boundary` and preview-only OIS/PITS audit/admin permission model surfaces. After owner runtime sync, dashboard/runtime/detail routes should include `Admin Boundary`, `Audit Required`, `Permission Model`, `Preview only` and `Blocked in current stage`.

Stage 1K adds read-only Core API `/platform/product-uat` and OIS/PITS product UAT baseline surfaces. After owner runtime sync, root/dashboard/runtime/detail routes should include `Product User Journey UAT`, `Testable now`, `Control-plane only`, `Functional gap map` and `Next product journey`.

Stage 2F adds source-ready OIS Agent Runtime and Self-Improvement Engine foundation endpoints: `/platform/ecosystem-products`, `/platform/learning/signals`, `/platform/learning/candidates`, `/platform/learning/policies`, `/platform/learning/center`, `/platform/agent/chat` and `/platform/agent/learning-submissions`. It also adds OIS `/learning-center` and the floating `Powered by OIS` Agent Widget. Public verification is pending owner runtime sync, versioned migration deploy and browser/UAT; widget submissions create Learning Signals/Candidates and AuditRecords only, not canonical Knowledge Layer records.

Stage 2G adds source-ready OIS Canonical Knowledge Fabric and KEIHB projection endpoints: `/platform/knowledge/layers`, `/platform/knowledge/items`, `/platform/knowledge/evidence`, `/platform/knowledge/context`, `/platform/knowledge/read-contract/example`, `/platform/learning/layer-mappings`, `/platform/knowledge/keihb/bundles`, `/platform/knowledge/keihb/preview`, `/platform/agent/knowledge-context` and `/platform/architecture/mindmap`. It also adds OIS `/knowledge-fabric` and Learning Center knowledge-layer integration. Stage 2G-R1 standardizes global `knowledgeLayerTaxonomy` / `availableLayers` metadata on context, mapping and KEIHB bundle responses so smoke checks validate the canonical taxonomy without confusing it with scoped result membership. Stage 2G-R2 standardizes `mappingStatusTaxonomy` / `availableStatuses` metadata on Learning layer mapping responses so smoke checks validate allowed statuses without requiring current row data to contain `READY_FOR_REVIEW`. Public verification is pending owner runtime sync, versioned migration deploy and browser/UAT; auto-promotion remains disabled.

Stage 2H adds source-ready OIMA product boundary endpoints: `/platform/products/code/OIMA`, `/platform/oima/overview`, `/platform/oima/source-modes`, `/platform/oima/roadmap` and `/platform/oima/boundary`. It also adds OIS `/oima`.

Stage 2I / OIMA-0 hardens the OIMA product shell and product boundary metadata without adding meeting intake runtime, migrations or seed data.

Stage 2J / OIMA-1 adds source-ready OIMA Meeting Intake endpoints: `/platform/oima/meetings`, `/platform/oima/meetings/{meeting-id}`, `/platform/oima/meetings/{meeting-id}/source-files` and `/platform/oima/meetings/{meeting-id}/status`. It also adds OIS `/oima/meetings`, `/oima/meetings/new` and `/oima/meetings/{meeting-id}`.

Stage 2K / OIMA-2 adds source-ready OIMA Transcript Processing endpoints: `/platform/oima/transcripts/contract`, `/platform/oima/meetings/{meeting-id}/transcript/process`, `/platform/oima/meetings/{meeting-id}/transcript/status`, `/platform/oima/meetings/{meeting-id}/transcript/versions`, `/platform/oima/meetings/{meeting-id}/transcript/segments` and `/platform/oima/meetings/{meeting-id}/transcript/warnings`. Public verification is pending owner runtime sync, versioned migration deploy and browser/UAT; audio processing, Listener Mode, voice clone, issue/decision/action/risk extraction and LLM-backed analysis remain future stages.

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
| OIS NextGen platform overview | `https://ois-nextgen.abacusai.cloud/platform/overview` | `ABACUS_MANAGED_PUBLIC_STAGING` | Introduced in Stage 0P-B; populated in Stage 0Q-B. Stage 2H-R1 keeps the smoke contract on minimum seeded counts because later stages add legitimate products/modules. | HTTP 200, DB-backed read-only overview with seeded counts at least: industries 1, organizations 1, workspaces 1, projects 2, products 5, installations 2, modules 3, auditRecords 1. |
| OIS NextGen product registry | `https://ois-nextgen.abacusai.cloud/platform/products` | `PLANNED_NOT_CREATED` | Stage 1B source/tests ready; owner runtime sync pending. | Expected HTTP 200 read-only products registry with `source=default-db` and `mode=read-only`. |
| OIS NextGen workspace registry | `https://ois-nextgen.abacusai.cloud/platform/workspaces` | `PLANNED_NOT_CREATED` | Stage 1B source/tests ready; owner runtime sync pending. | Expected HTTP 200 read-only organizations/workspaces registry with `source=default-db` and `mode=read-only`. |
| OIS NextGen project registry | `https://ois-nextgen.abacusai.cloud/platform/projects` | `PLANNED_NOT_CREATED` | Stage 1B source/tests ready; owner runtime sync pending. | Expected HTTP 200 read-only projects registry with `source=default-db` and `mode=read-only`. |
| OIS NextGen module registry | `https://ois-nextgen.abacusai.cloud/platform/modules` | `PLANNED_NOT_CREATED` | Stage 1B source/tests ready; owner runtime sync pending. | Expected HTTP 200 read-only modules registry with `source=default-db` and `mode=read-only`. |
| OIS NextGen installation registry | `https://ois-nextgen.abacusai.cloud/platform/installations` | `PLANNED_NOT_CREATED` | Stage 1B source/tests ready; owner runtime sync pending. | Expected HTTP 200 read-only installations registry with `source=default-db` and `mode=read-only`. |
| OIS NextGen aggregate registry | `https://ois-nextgen.abacusai.cloud/platform/registry` | `PLANNED_NOT_CREATED` | Stage 1B source/tests ready; owner runtime sync pending. | Expected HTTP 200 aggregate read-only registry for OIS/PITS UI shells. |
| OIS NextGen registry runtime health | `https://ois-nextgen.abacusai.cloud/platform/registry/health` | `PLANNED_NOT_CREATED` | Stage 1D source/tests ready; owner runtime sync pending. | Expected HTTP 200 read-only registry health with `source=default-db`, `mode=read-only`, `summary`, `entities` and staging-safe URLs. |
| OIS NextGen registry governance readiness | `https://ois-nextgen.abacusai.cloud/platform/registry/readiness` | `PLANNED_NOT_CREATED` | Stage 1E source/tests ready; owner runtime sync pending. | Expected HTTP 200 read-only registry readiness with `source=default-db`, `mode=read-only`, `summary`, `entities`, `READY` and staging-safe URLs. |
| OIS NextGen owner review | `https://ois-nextgen.abacusai.cloud/platform/owner-review` | `PLANNED_NOT_CREATED` | Stage 1I source/tests ready; owner runtime sync pending. | Expected HTTP 200 read-only owner review boundary with `Owner Review Queue`, `Safe Action Boundary`, `Read-only preview` and `NOT_ALLOWED_IN_STAGE_1I`. |
| OIS NextGen admin boundary | `https://ois-nextgen.abacusai.cloud/platform/admin-boundary` | `PLANNED_NOT_CREATED` | Stage 1J source/tests ready; owner runtime sync pending. | Expected HTTP 200 read-only admin boundary with `Admin Boundary`, `Audit Required`, `Permission Model`, `Preview only`, `Blocked in current stage` and `BLOCKED_IN_CURRENT_STAGE`. |
| OIS NextGen product UAT baseline | `https://ois-nextgen.abacusai.cloud/platform/product-uat` | `PLANNED_NOT_CREATED` | Stage 1K source/tests ready; owner runtime sync pending. | Expected HTTP 200 read-only product user journey UAT baseline with `Product User Journey UAT`, `Testable now`, `Control-plane only`, `Functional gap map`, `Next product journey` and `NOT_ALLOWED_IN_STAGE_1K`. |
| OIS NextGen ecosystem products | `https://ois-nextgen.abacusai.cloud/platform/ecosystem-products` | `PLANNED_NOT_CREATED` | Stage 2F source/tests ready; owner runtime sync and migration deploy pending. | Expected HTTP 200 with Powered by OIS registry keys `OIS_PLATFORM`, `PITS`, `KEIHB`, `ICR`, `CSAGENT`, `FUTURE_PRODUCT` and `CUSTOM`. |
| OIS NextGen learning signals | `https://ois-nextgen.abacusai.cloud/platform/learning/signals` | `PLANNED_NOT_CREATED` | Stage 2F source/tests ready; owner runtime sync and migration deploy pending. | Expected guarded create/list support for Learning Signals with tenant scope, provenance, confidence and audit writes. |
| OIS NextGen learning candidates | `https://ois-nextgen.abacusai.cloud/platform/learning/candidates` | `PLANNED_NOT_CREATED` | Stage 2F source/tests ready; owner runtime sync and migration deploy pending. | Expected guarded review/list support for Learning Candidates with `noCanonicalKnowledgeWrite=true`. |
| OIS NextGen learning policies | `https://ois-nextgen.abacusai.cloud/platform/learning/policies` | `PLANNED_NOT_CREATED` | Stage 2F source/tests ready; owner runtime sync and migration deploy pending. | Expected HTTP 200 policy list/update surface for `ALWAYS_ASK`, `AUTO_IF_CONFIDENCE`, `FULL_AUTO_PILOT` and `LOG_ONLY`. |
| OIS NextGen learning center | `https://ois-nextgen.abacusai.cloud/platform/learning/center` | `PLANNED_NOT_CREATED` | Stage 2F source/tests ready; owner runtime sync and migration deploy pending. | Expected HTTP 200 SuperAdmin Learning Center payload with overview, stream, pending review, policies, executive queue, product map and audit placeholder. |
| OIS NextGen agent chat | `https://ois-nextgen.abacusai.cloud/platform/agent/chat` | `PLANNED_NOT_CREATED` | Stage 2F source/tests ready; owner runtime sync pending. | Expected deterministic OIS Agent Runtime stub response; no OpenRouter/LLM call in Stage 2F. |
| OIS NextGen agent learning submissions | `https://ois-nextgen.abacusai.cloud/platform/agent/learning-submissions` | `PLANNED_NOT_CREATED` | Stage 2F source/tests ready; owner runtime sync and migration deploy pending. | Expected widget learning submission path that creates Learning Signal/Submission records and audit evidence without canonical Knowledge Layer writes. |
| OIS NextGen product detail | `https://ois-nextgen.abacusai.cloud/platform/products/{id}` | `PLANNED_NOT_CREATED` | Stage 1C source/tests ready; owner runtime sync pending. | Expected HTTP 200 read-only product detail with relationship context. |
| OIS NextGen product code detail | `https://ois-nextgen.abacusai.cloud/platform/products/code/{code}` | `PLANNED_NOT_CREATED` | Stage 1C source/tests ready; owner runtime sync pending. | Expected HTTP 200 read-only product detail by product code. |
| OIS NextGen workspace detail | `https://ois-nextgen.abacusai.cloud/platform/workspaces/{id}` | `PLANNED_NOT_CREATED` | Stage 1C source/tests ready; owner runtime sync pending. | Expected HTTP 200 read-only workspace detail. |
| OIS NextGen project detail | `https://ois-nextgen.abacusai.cloud/platform/projects/{id}` | `PLANNED_NOT_CREATED` | Stage 1C source/tests ready; owner runtime sync pending. | Expected HTTP 200 read-only project detail. |
| OIS NextGen module detail | `https://ois-nextgen.abacusai.cloud/platform/modules/{id}` | `PLANNED_NOT_CREATED` | Stage 1C source/tests ready; owner runtime sync pending. | Expected HTTP 200 read-only module detail. |
| OIS NextGen installation detail | `https://ois-nextgen.abacusai.cloud/platform/installations/{id}` | `PLANNED_NOT_CREATED` | Stage 1C source/tests ready; owner runtime sync pending. | Expected HTTP 200 read-only installation detail. |
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
| OIS Console SuperComputer product subdomain root | `https://ois-ng.dmp247.com` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Verified Cloudflare Tunnel route to `http://127.0.0.1:3000`; opens OIS Console. Do not touch `ois.dmp247.com`. |
| PITS Shell SuperComputer product subdomain root | `https://pits-ng.dmp247.com` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Verified Cloudflare Tunnel route to `http://127.0.0.1:3001`; opens PITS Shell. |
| OIS Console SuperComputer product subdomain dashboard | `https://ois-ng.dmp247.com/dashboard` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Verified through the OIS Console Cloudflare Tunnel hostname; opens OIS Platform Overview. |
| PITS Shell SuperComputer product subdomain projects | `https://pits-ng.dmp247.com/projects` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Verified through the PITS Shell Cloudflare Tunnel hostname; opens PITS Project Selector. |
| Optional Core API custom staging hostname | `https://api-ng.dmp247.com` | `PLANNED_NOT_CREATED` | Optional later Cloudflare Tunnel route to `http://127.0.0.1:4000`; not part of Stage 0V-A execution. |
| OIS Console alternate custom staging domain | `ois-staging.dmp247.com` | `PLANNED_NOT_CREATED` | Future alternative only; do not touch `ois.dmp247.com`. |
| PITS Shell alternate custom staging domain | `pits-staging.dmp247.com` | `PLANNED_NOT_CREATED` | Future alternative only. |
| OIS Console products route | `https://ois-ng.dmp247.com/products` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Stage 1A-R2 manual orphan UI port cleanup evidence verified public HTTP 200/pass. |
| OIS Console workspaces route | `https://ois-ng.dmp247.com/workspaces` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Stage 1A-R2 manual orphan UI port cleanup evidence verified public HTTP 200/pass. |
| OIS Console runtime route | `https://ois-ng.dmp247.com/runtime` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Stage 1A-R2 manual orphan UI port cleanup evidence verified public HTTP 200/pass. |
| PITS Shell runtime route | `https://pits-ng.dmp247.com/runtime` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Stage 1A-R2 manual orphan UI port cleanup evidence verified public HTTP 200/pass. |
| OIS NextGen product registry API | `https://ois-nextgen.abacusai.cloud/platform/products` | `PLANNED_NOT_CREATED` | Stage 1B source/tests ready; owner runtime sync must verify HTTP 200. |
| OIS NextGen workspace registry API | `https://ois-nextgen.abacusai.cloud/platform/workspaces` | `PLANNED_NOT_CREATED` | Stage 1B source/tests ready; owner runtime sync must verify HTTP 200. |
| OIS NextGen project registry API | `https://ois-nextgen.abacusai.cloud/platform/projects` | `PLANNED_NOT_CREATED` | Stage 1B source/tests ready; owner runtime sync must verify HTTP 200. |
| OIS NextGen module registry API | `https://ois-nextgen.abacusai.cloud/platform/modules` | `PLANNED_NOT_CREATED` | Stage 1B source/tests ready; owner runtime sync must verify HTTP 200. |
| OIS NextGen installation registry API | `https://ois-nextgen.abacusai.cloud/platform/installations` | `PLANNED_NOT_CREATED` | Stage 1B source/tests ready; owner runtime sync must verify HTTP 200. |
| OIS NextGen aggregate registry API | `https://ois-nextgen.abacusai.cloud/platform/registry` | `PLANNED_NOT_CREATED` | Stage 1B source/tests ready; owner runtime sync must verify HTTP 200. |
| OIS NextGen registry runtime health API | `https://ois-nextgen.abacusai.cloud/platform/registry/health` | `PLANNED_NOT_CREATED` | Stage 1D source/tests ready; owner runtime sync must verify HTTP 200. |
| OIS NextGen registry readiness API | `https://ois-nextgen.abacusai.cloud/platform/registry/readiness` | `PLANNED_NOT_CREATED` | Stage 1E source/tests ready; owner runtime sync must verify HTTP 200. |
| OIS NextGen owner review API | `https://ois-nextgen.abacusai.cloud/platform/owner-review` | `PLANNED_NOT_CREATED` | Stage 1I source/tests ready; owner runtime sync must verify HTTP 200. |
| OIS NextGen admin boundary API | `https://ois-nextgen.abacusai.cloud/platform/admin-boundary` | `PLANNED_NOT_CREATED` | Stage 1J source/tests ready; owner runtime sync must verify HTTP 200. |
| OIS NextGen product UAT baseline API | `https://ois-nextgen.abacusai.cloud/platform/product-uat` | `PLANNED_NOT_CREATED` | Stage 1K source/tests ready; owner runtime sync must verify HTTP 200. |
| OIS NextGen product detail API | `https://ois-nextgen.abacusai.cloud/platform/products/{id}` | `PLANNED_NOT_CREATED` | Stage 1C source/tests ready; owner runtime sync must verify HTTP 200. |
| OIS NextGen product code detail API | `https://ois-nextgen.abacusai.cloud/platform/products/code/{code}` | `PLANNED_NOT_CREATED` | Stage 1C source/tests ready; owner runtime sync must verify HTTP 200. |
| OIS NextGen workspace detail API | `https://ois-nextgen.abacusai.cloud/platform/workspaces/{id}` | `PLANNED_NOT_CREATED` | Stage 1C source/tests ready; owner runtime sync must verify HTTP 200. |
| OIS NextGen project detail API | `https://ois-nextgen.abacusai.cloud/platform/projects/{id}` | `PLANNED_NOT_CREATED` | Stage 1C source/tests ready; owner runtime sync must verify HTTP 200. |
| OIS NextGen module detail API | `https://ois-nextgen.abacusai.cloud/platform/modules/{id}` | `PLANNED_NOT_CREATED` | Stage 1C source/tests ready; owner runtime sync must verify HTTP 200. |
| OIS NextGen installation detail API | `https://ois-nextgen.abacusai.cloud/platform/installations/{id}` | `PLANNED_NOT_CREATED` | Stage 1C source/tests ready; owner runtime sync must verify HTTP 200. |
| OIS Console product detail route | `https://ois-ng.dmp247.com/products/{id}` | `PLANNED_NOT_CREATED` | Stage 1C source/tests ready; owner runtime sync must verify HTTP 200. |
| OIS Console workspace detail route | `https://ois-ng.dmp247.com/workspaces/{id}` | `PLANNED_NOT_CREATED` | Stage 1C source/tests ready; owner runtime sync must verify HTTP 200. |
| OIS Console module detail route | `https://ois-ng.dmp247.com/modules/{id}` | `PLANNED_NOT_CREATED` | Stage 1C source/tests ready; owner runtime sync must verify HTTP 200. |
| OIS Console installation detail route | `https://ois-ng.dmp247.com/installations/{id}` | `PLANNED_NOT_CREATED` | Stage 1C source/tests ready; owner runtime sync must verify HTTP 200. |
| PITS Shell project detail route | `https://pits-ng.dmp247.com/projects/{id}` | `PLANNED_NOT_CREATED` | Stage 1C source/tests ready; owner runtime sync must verify HTTP 200. |
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
| Stage 0V-B/C | `https://ois-ng.dmp247.com` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Cloudflare Tunnel `ois-nextgen-abacus` healthy, 1 active replica, 2 routes. | Opens OIS Console with `OIS_CONSOLE`, shared Core API URL, healthy Core API and seeded counts. |
| Stage 0V-B/C | `https://ois-ng.dmp247.com/dashboard` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Same verified OIS tunnel hostname. | Opens OIS Platform Overview. |
| Stage 0V-B/C | `https://pits-ng.dmp247.com` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Cloudflare Tunnel `ois-nextgen-abacus` healthy, 1 active replica, 2 routes. | Opens PITS Shell with `PITS_SHELL`, shared Core API URL, healthy Core API and seeded counts. |
| Stage 0V-B/C | `https://pits-ng.dmp247.com/projects` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Same verified PITS tunnel hostname. | Opens PITS Project Selector. |
| Stage 0W-A | `https://ois-ng.dmp247.com` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Endpoint unchanged; durable systemd OIS Console service operations prepared. | OIS Console public staging root remains current verified endpoint. |
| Stage 0W-A | `https://ois-ng.dmp247.com/dashboard` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Endpoint unchanged; public staging status/check scripts prepared. | OIS Platform Overview remains current verified endpoint. |
| Stage 0W-A | `https://pits-ng.dmp247.com` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Endpoint unchanged; durable systemd PITS Shell service operations prepared. | PITS Shell public staging root remains current verified endpoint. |
| Stage 0W-A | `https://pits-ng.dmp247.com/projects` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Endpoint unchanged; public staging status/check scripts prepared. | PITS Project Selector remains current verified endpoint. |
| Stage 0W-B | `https://ois-ng.dmp247.com` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Runtime operational evidence passed; endpoint unchanged. | OIS Console public staging root remains passing. |
| Stage 0W-B | `https://ois-ng.dmp247.com/dashboard` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Runtime operational evidence passed; endpoint unchanged. | OIS Platform Overview remains passing. |
| Stage 0W-B | `https://pits-ng.dmp247.com` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Runtime operational evidence passed; endpoint unchanged. | PITS Shell public staging root remains passing. |
| Stage 0W-B | `https://pits-ng.dmp247.com/projects` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Runtime operational evidence passed; endpoint unchanged. | PITS Project Selector remains passing. |
| Stage 1A | `https://ois-ng.dmp247.com` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | OIS root remained passing during Stage 1A Abacus verification. | HTTP 200. |
| Stage 1A | `https://ois-ng.dmp247.com/dashboard` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | OIS dashboard remained passing during Stage 1A Abacus verification. | HTTP 200. |
| Stage 1A | `https://ois-ng.dmp247.com/products` | `BLOCKED` | New OIS Console products route returned local/public HTTP 404 after Stage 1A runtime sync. | Stage 1A-R1 hotfix ready; owner runtime re-sync required before public HTTP 200 can be claimed. |
| Stage 1A | `https://ois-ng.dmp247.com/workspaces` | `BLOCKED` | New OIS Console workspaces route returned local/public HTTP 404 after Stage 1A runtime sync. | Stage 1A-R1 hotfix ready; owner runtime re-sync required before public HTTP 200 can be claimed. |
| Stage 1A | `https://ois-ng.dmp247.com/runtime` | `BLOCKED` | New OIS Console runtime route returned local/public HTTP 404 after Stage 1A runtime sync. | Stage 1A-R1 hotfix ready; owner runtime re-sync required before public HTTP 200 can be claimed. |
| Stage 1A | `https://pits-ng.dmp247.com` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | PITS root remained passing during Stage 1A Abacus verification. | HTTP 200. |
| Stage 1A | `https://pits-ng.dmp247.com/projects` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | PITS projects remained passing during Stage 1A Abacus verification. | HTTP 200. |
| Stage 1A | `https://pits-ng.dmp247.com/runtime` | `BLOCKED` | New PITS runtime route returned local/public HTTP 404 after Stage 1A runtime sync. | Stage 1A-R1 hotfix ready; owner runtime re-sync required before public HTTP 200 can be claimed. |
| Stage 1A-R1 | `https://ois-ng.dmp247.com/products` | `BLOCKED` | Hotfix prepared; public route is not reverified from Codex. | Expected HTTP 200 after owner runtime re-sync with `UI_ROUTE_MANIFEST_CHECK_PASSED`. |
| Stage 1A-R1 | `https://ois-ng.dmp247.com/workspaces` | `BLOCKED` | Hotfix prepared; public route is not reverified from Codex. | Expected HTTP 200 after owner runtime re-sync with `UI_ROUTE_MANIFEST_CHECK_PASSED`. |
| Stage 1A-R1 | `https://ois-ng.dmp247.com/runtime` | `BLOCKED` | Hotfix prepared; public route is not reverified from Codex. | Expected HTTP 200 after owner runtime re-sync with `UI_ROUTE_MANIFEST_CHECK_PASSED`. |
| Stage 1A-R1 | `https://pits-ng.dmp247.com/runtime` | `BLOCKED` | Hotfix prepared; public route is not reverified from Codex. | Expected HTTP 200 after owner runtime re-sync with `UI_ROUTE_MANIFEST_CHECK_PASSED`. |
| Stage 1A-R2 | `https://ois-ng.dmp247.com` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Manual orphan UI port cleanup evidence verified OIS root. | HTTP 200/pass. |
| Stage 1A-R2 | `https://ois-ng.dmp247.com/dashboard` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Manual orphan UI port cleanup evidence verified OIS dashboard. | HTTP 200/pass. |
| Stage 1A-R2 | `https://ois-ng.dmp247.com/products` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Manual orphan UI port cleanup evidence verified OIS products. | HTTP 200/pass. |
| Stage 1A-R2 | `https://ois-ng.dmp247.com/workspaces` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Manual orphan UI port cleanup evidence verified OIS workspaces. | HTTP 200/pass. |
| Stage 1A-R2 | `https://ois-ng.dmp247.com/runtime` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Manual orphan UI port cleanup evidence verified OIS runtime. | HTTP 200/pass. |
| Stage 1A-R2 | `https://pits-ng.dmp247.com` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Manual orphan UI port cleanup evidence verified PITS root. | HTTP 200/pass. |
| Stage 1A-R2 | `https://pits-ng.dmp247.com/projects` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Manual orphan UI port cleanup evidence verified PITS projects. | HTTP 200/pass. |
| Stage 1A-R2 | `https://pits-ng.dmp247.com/runtime` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Manual orphan UI port cleanup evidence verified PITS runtime. | HTTP 200/pass. |
| Stage 1B | `https://ois-nextgen.abacusai.cloud/platform/products` | `PLANNED_NOT_CREATED` | Source-ready read-only registry route; not deployed from Codex. | Expected HTTP 200 with `products`, `source=default-db` and `mode=read-only` after owner runtime sync. |
| Stage 1B | `https://ois-nextgen.abacusai.cloud/platform/workspaces` | `PLANNED_NOT_CREATED` | Source-ready read-only registry route; not deployed from Codex. | Expected HTTP 200 with organizations/workspaces, `source=default-db` and `mode=read-only` after owner runtime sync. |
| Stage 1B | `https://ois-nextgen.abacusai.cloud/platform/projects` | `PLANNED_NOT_CREATED` | Source-ready read-only registry route; not deployed from Codex. | Expected HTTP 200 with `projects`, `source=default-db` and `mode=read-only` after owner runtime sync. |
| Stage 1B | `https://ois-nextgen.abacusai.cloud/platform/modules` | `PLANNED_NOT_CREATED` | Source-ready read-only registry route; not deployed from Codex. | Expected HTTP 200 with `modules`, `source=default-db` and `mode=read-only` after owner runtime sync. |
| Stage 1B | `https://ois-nextgen.abacusai.cloud/platform/installations` | `PLANNED_NOT_CREATED` | Source-ready read-only registry route; not deployed from Codex. | Expected HTTP 200 with `installations`, `source=default-db` and `mode=read-only` after owner runtime sync. |
| Stage 1B | `https://ois-nextgen.abacusai.cloud/platform/registry` | `PLANNED_NOT_CREATED` | Source-ready aggregate registry route; not deployed from Codex. | Expected HTTP 200 aggregate registry after owner runtime sync. |
| Stage 1C | `https://ois-nextgen.abacusai.cloud/platform/products/{id}` | `PLANNED_NOT_CREATED` | Source-ready read-only product detail route; not deployed from Codex. | Expected HTTP 200 product detail with relationship context after owner runtime sync. |
| Stage 1C | `https://ois-nextgen.abacusai.cloud/platform/products/code/{code}` | `PLANNED_NOT_CREATED` | Source-ready read-only product-code detail route; not deployed from Codex. | Expected HTTP 200 product detail after owner runtime sync. |
| Stage 1C | `https://ois-nextgen.abacusai.cloud/platform/workspaces/{id}` | `PLANNED_NOT_CREATED` | Source-ready read-only workspace detail route; not deployed from Codex. | Expected HTTP 200 workspace detail after owner runtime sync. |
| Stage 1C | `https://ois-nextgen.abacusai.cloud/platform/projects/{id}` | `PLANNED_NOT_CREATED` | Source-ready read-only project detail route; not deployed from Codex. | Expected HTTP 200 project detail after owner runtime sync. |
| Stage 1C | `https://ois-nextgen.abacusai.cloud/platform/modules/{id}` | `PLANNED_NOT_CREATED` | Source-ready read-only module detail route; not deployed from Codex. | Expected HTTP 200 module detail after owner runtime sync. |
| Stage 1C | `https://ois-nextgen.abacusai.cloud/platform/installations/{id}` | `PLANNED_NOT_CREATED` | Source-ready read-only installation detail route; not deployed from Codex. | Expected HTTP 200 installation detail after owner runtime sync. |
| Stage 1C | `https://ois-ng.dmp247.com/products/{id}` | `PLANNED_NOT_CREATED` | Source-ready OIS product detail route; not deployed from Codex. | Expected HTTP 200 product detail page after owner runtime sync. |
| Stage 1C | `https://ois-ng.dmp247.com/workspaces/{id}` | `PLANNED_NOT_CREATED` | Source-ready OIS workspace detail route; not deployed from Codex. | Expected HTTP 200 workspace detail page after owner runtime sync. |
| Stage 1C | `https://ois-ng.dmp247.com/modules/{id}` | `PLANNED_NOT_CREATED` | Source-ready OIS module detail route; not deployed from Codex. | Expected HTTP 200 module detail page after owner runtime sync. |
| Stage 1C | `https://ois-ng.dmp247.com/installations/{id}` | `PLANNED_NOT_CREATED` | Source-ready OIS installation detail route; not deployed from Codex. | Expected HTTP 200 installation detail page after owner runtime sync. |
| Stage 1C | `https://pits-ng.dmp247.com/projects/{id}` | `PLANNED_NOT_CREATED` | Source-ready PITS project detail route; not deployed from Codex. | Expected HTTP 200 project detail page after owner runtime sync. |
| Stage 1C-R1 | `https://ois-ng.dmp247.com/products/{id}` | `PLANNED_NOT_CREATED` | Marker hotfix prepared; not deployed from Codex. | Expected HTTP 200 with `Product Detail Source` after owner runtime sync. |
| Stage 1C-R1 | `https://ois-ng.dmp247.com/workspaces/{id}` | `PLANNED_NOT_CREATED` | Marker hotfix prepared; not deployed from Codex. | Expected HTTP 200 with `Workspace Detail Source` after owner runtime sync. |
| Stage 1C-R1 | `https://ois-ng.dmp247.com/modules/{id}` | `PLANNED_NOT_CREATED` | Marker hotfix prepared; not deployed from Codex. | Expected HTTP 200 with `Module Detail Source` after owner runtime sync. |
| Stage 1C-R1 | `https://ois-ng.dmp247.com/installations/{id}` | `PLANNED_NOT_CREATED` | Marker hotfix prepared; not deployed from Codex. | Expected HTTP 200 with `Installation Detail Source` after owner runtime sync. |
| Stage 1C-R1 | `https://pits-ng.dmp247.com/projects/{id}` | `PLANNED_NOT_CREATED` | Marker hotfix prepared; not deployed from Codex. | Expected HTTP 200 with `Project Detail Source` after owner runtime sync. |
| Stage 1D | `https://ois-nextgen.abacusai.cloud/platform/registry/health` | `PLANNED_NOT_CREATED` | Source-ready read-only registry runtime health route; not deployed from Codex. | Expected HTTP 200 with `summary`, `entities`, `Reachable`, `source=default-db` and `mode=read-only` after owner runtime sync. |
| Stage 1D | `https://ois-ng.dmp247.com/dashboard` | `PLANNED_NOT_CREATED` | Source-ready owner health UI marker; not deployed from Codex. | Expected HTTP 200 with `Registry Runtime Health` after owner runtime sync. |
| Stage 1D | `https://ois-ng.dmp247.com/products/{id}` | `PLANNED_NOT_CREATED` | Source-ready owner product health UI marker; not deployed from Codex. | Expected HTTP 200 with `Product Runtime Health` after owner runtime sync. |
| Stage 1D | `https://ois-ng.dmp247.com/workspaces/{id}` | `PLANNED_NOT_CREATED` | Source-ready owner workspace health UI marker; not deployed from Codex. | Expected HTTP 200 with `Workspace Runtime Health` after owner runtime sync. |
| Stage 1D | `https://ois-ng.dmp247.com/modules/{id}` | `PLANNED_NOT_CREATED` | Source-ready owner module health UI marker; not deployed from Codex. | Expected HTTP 200 with `Module Runtime Health` after owner runtime sync. |
| Stage 1D | `https://ois-ng.dmp247.com/installations/{id}` | `PLANNED_NOT_CREATED` | Source-ready owner installation health UI marker; not deployed from Codex. | Expected HTTP 200 with `Installation Runtime Health` after owner runtime sync. |
| Stage 1D | `https://pits-ng.dmp247.com/projects` | `PLANNED_NOT_CREATED` | Source-ready owner project registry health UI marker; not deployed from Codex. | Expected HTTP 200 with `Registry Runtime Health` after owner runtime sync. |
| Stage 1D | `https://pits-ng.dmp247.com/projects/{id}` | `PLANNED_NOT_CREATED` | Source-ready owner project health UI marker; not deployed from Codex. | Expected HTTP 200 with `Project Runtime Health` after owner runtime sync. |
| Stage 1E | `https://ois-nextgen.abacusai.cloud/platform/registry/readiness` | `PLANNED_NOT_CREATED` | Source-ready read-only registry readiness route; not deployed from Codex. | Expected HTTP 200 with `summary`, `entities`, `READY`, `source=default-db` and `mode=read-only` after owner runtime sync. |
| Stage 1E | `https://ois-ng.dmp247.com/dashboard` | `PLANNED_NOT_CREATED` | Source-ready owner readiness UI marker; not deployed from Codex. | Expected HTTP 200 with `Registry Governance / Readiness` after owner runtime sync. |
| Stage 1E | `https://ois-ng.dmp247.com/products/{id}` | `PLANNED_NOT_CREATED` | Source-ready owner product readiness UI marker; not deployed from Codex. | Expected HTTP 200 with `Product Governance / Readiness` and `What is missing?` after owner runtime sync. |
| Stage 1E | `https://ois-ng.dmp247.com/workspaces/{id}` | `PLANNED_NOT_CREATED` | Source-ready owner workspace readiness UI marker; not deployed from Codex. | Expected HTTP 200 with `Workspace Governance / Readiness` and `What is missing?` after owner runtime sync. |
| Stage 1E | `https://ois-ng.dmp247.com/modules/{id}` | `PLANNED_NOT_CREATED` | Source-ready owner module readiness UI marker; not deployed from Codex. | Expected HTTP 200 with `Module Governance / Readiness` and `What is missing?` after owner runtime sync. |
| Stage 1E | `https://ois-ng.dmp247.com/installations/{id}` | `PLANNED_NOT_CREATED` | Source-ready owner installation readiness UI marker; not deployed from Codex. | Expected HTTP 200 with `Installation Governance / Readiness` and `What is missing?` after owner runtime sync. |
| Stage 1E | `https://pits-ng.dmp247.com/projects` | `PLANNED_NOT_CREATED` | Source-ready owner project registry readiness UI marker; not deployed from Codex. | Expected HTTP 200 with `Registry Governance / Readiness` after owner runtime sync. |
| Stage 1E | `https://pits-ng.dmp247.com/projects/{id}` | `PLANNED_NOT_CREATED` | Source-ready owner project readiness UI marker; not deployed from Codex. | Expected HTTP 200 with `Project Governance / Readiness` and `What is missing?` after owner runtime sync. |
| Stage 1F | `https://ois-ng.dmp247.com` | `PLANNED_NOT_CREATED` | Source-ready owner cockpit root marker; not deployed from Codex. | Expected HTTP 200 with `Owner Registry Cockpit / Registry Runtime Summary`, `Ready to operate` and `Forbidden link guard` after owner runtime sync. |
| Stage 1F | `https://ois-ng.dmp247.com/dashboard` | `PLANNED_NOT_CREATED` | Source-ready owner cockpit dashboard marker; not deployed from Codex. | Expected HTTP 200 with `Owner Registry Cockpit / Registry Runtime Summary`, `Missing runtime URL` and `Forbidden link guard` after owner runtime sync. |
| Stage 1F | `https://ois-ng.dmp247.com/products` | `PLANNED_NOT_CREATED` | Source-ready owner product card UAT markers; not deployed from Codex. | Expected HTTP 200 with `Runtime health:`, `Readiness:` and `Linked to PITS` after owner runtime sync. |
| Stage 1F | `https://ois-ng.dmp247.com/workspaces` | `PLANNED_NOT_CREATED` | Source-ready owner workspace/project card UAT markers; not deployed from Codex. | Expected HTTP 200 with `Runtime health:` and `Readiness:` after owner runtime sync. |
| Stage 1F | `https://ois-ng.dmp247.com/runtime` | `PLANNED_NOT_CREATED` | Source-ready owner cockpit runtime marker; not deployed from Codex. | Expected HTTP 200 with `Owner Registry Cockpit / Registry Runtime Summary` after owner runtime sync. |
| Stage 1F | `https://ois-ng.dmp247.com/products/{id}` | `PLANNED_NOT_CREATED` | Source-ready owner product UAT summary marker; not deployed from Codex. | Expected HTTP 200 with `Owner-facing UAT summary` after owner runtime sync. |
| Stage 1F | `https://ois-ng.dmp247.com/workspaces/{id}` | `PLANNED_NOT_CREATED` | Source-ready owner workspace UAT summary marker; not deployed from Codex. | Expected HTTP 200 with `Owner-facing UAT summary` after owner runtime sync. |
| Stage 1F | `https://ois-ng.dmp247.com/modules/{id}` | `PLANNED_NOT_CREATED` | Source-ready owner module UAT summary marker; not deployed from Codex. | Expected HTTP 200 with `Owner-facing UAT summary` after owner runtime sync. |
| Stage 1F | `https://ois-ng.dmp247.com/installations/{id}` | `PLANNED_NOT_CREATED` | Source-ready owner installation UAT summary marker; not deployed from Codex. | Expected HTTP 200 with `Owner-facing UAT summary` after owner runtime sync. |
| Stage 1F | `https://pits-ng.dmp247.com` | `PLANNED_NOT_CREATED` | Source-ready PITS owner cockpit root marker; not deployed from Codex. | Expected HTTP 200 with `PITS Registry Cockpit / Project Runtime Summary` after owner runtime sync. |
| Stage 1F | `https://pits-ng.dmp247.com/projects` | `PLANNED_NOT_CREATED` | Source-ready PITS project card UAT markers; not deployed from Codex. | Expected HTTP 200 with `Project readiness` and `Runtime health:` after owner runtime sync. |
| Stage 1F | `https://pits-ng.dmp247.com/projects/{id}` | `PLANNED_NOT_CREATED` | Source-ready PITS project UAT summary marker; not deployed from Codex. | Expected HTTP 200 with `Owner-facing project UAT summary` after owner runtime sync. |
| Stage 1F | `https://pits-ng.dmp247.com/runtime` | `PLANNED_NOT_CREATED` | Source-ready PITS owner cockpit runtime marker; not deployed from Codex. | Expected HTTP 200 with `PITS Registry Cockpit / Project Runtime Summary` after owner runtime sync. |
| Stage 1F-R1 | `https://ois-ng.dmp247.com` | `PLANNED_NOT_CREATED` | Source-ready OIS root marker hotfix; not deployed from Codex. | Expected HTTP 200 with `Owner Registry Cockpit / Registry Runtime Summary`, `Ready to operate` and `Forbidden link guard` after owner runtime sync. |
| Stage 1G | `https://ois-ng.dmp247.com` | `PLANNED_NOT_CREATED` | Source-ready OIS modern shell standard markers; not deployed from Codex. | Expected HTTP 200 with `Modern Shell Layout`, `Shell Navigation Toggle`, `Fixed Navigation Shell`, `Responsive Product Shell` and existing cockpit markers after owner runtime sync. |
| Stage 1G | `https://pits-ng.dmp247.com` | `PLANNED_NOT_CREATED` | Source-ready PITS modern shell standard markers; not deployed from Codex. | Expected HTTP 200 with `Modern Shell Layout`, `Shell Navigation Toggle`, `Fixed Navigation Shell`, `Responsive Product Shell` and existing cockpit markers after owner runtime sync. |
| Stage 1H | `https://ois-ng.dmp247.com` | `PLANNED_NOT_CREATED` | Source-ready OIS owner-first visual design markers; not deployed from Codex. | Expected HTTP 200 with `Owner-first Design System`, `Visual Hierarchy Standard`, `Owner-friendly Status Badges` and existing shell/cockpit markers after owner runtime sync. |
| Stage 1H | `https://pits-ng.dmp247.com` | `PLANNED_NOT_CREATED` | Source-ready PITS owner-first visual design markers; not deployed from Codex. | Expected HTTP 200 with `Owner-first Design System`, `Visual Hierarchy Standard`, `Owner-friendly Status Badges` and existing shell/cockpit markers after owner runtime sync. |
| Stage 1I | `https://ois-nextgen.abacusai.cloud/platform/owner-review` | `PLANNED_NOT_CREATED` | Source-ready read-only owner review safe action-boundary endpoint; not deployed from Codex. | Expected HTTP 200 with `Owner Review Queue`, `Safe Action Boundary`, `Read-only preview`, `Future admin action requires audit` and `NOT_ALLOWED_IN_STAGE_1I` after owner runtime sync. |
| Stage 1I | `https://ois-ng.dmp247.com/dashboard` | `PLANNED_NOT_CREATED` | Source-ready OIS owner review queue marker; not deployed from Codex. | Expected HTTP 200 with `Owner Review Queue`, `Safe Action Boundary`, `Read-only preview` and `Future admin action requires audit` after owner runtime sync. |
| Stage 1I | `https://ois-ng.dmp247.com/runtime` | `PLANNED_NOT_CREATED` | Source-ready OIS safe action-boundary marker; not deployed from Codex. | Expected HTTP 200 with `Safe Action Boundary`, `Read-only preview` and `Future admin action requires audit` after owner runtime sync. |
| Stage 1I | `https://ois-ng.dmp247.com/products/{id}` | `PLANNED_NOT_CREATED` | Source-ready OIS product owner review boundary; not deployed from Codex. | Expected HTTP 200 with `Owner Review Queue`, `Safe Action Boundary` and `Action is read-only preview only` after owner runtime sync. |
| Stage 1I | `https://ois-ng.dmp247.com/workspaces/{id}` | `PLANNED_NOT_CREATED` | Source-ready OIS workspace owner review boundary; not deployed from Codex. | Expected HTTP 200 with `Owner Review Queue`, `Safe Action Boundary` and `Action is read-only preview only` after owner runtime sync. |
| Stage 1I | `https://ois-ng.dmp247.com/installations/{id}` | `PLANNED_NOT_CREATED` | Source-ready OIS installation owner review boundary; not deployed from Codex. | Expected HTTP 200 with `Owner Review Queue`, `Safe Action Boundary` and `Action is read-only preview only` after owner runtime sync. |
| Stage 1I | `https://pits-ng.dmp247.com/projects` | `PLANNED_NOT_CREATED` | Source-ready PITS project owner review queue marker; not deployed from Codex. | Expected HTTP 200 with `Owner Review Queue`, `Safe Action Boundary`, `Read-only preview` and `Future admin action requires audit` after owner runtime sync. |
| Stage 1I | `https://pits-ng.dmp247.com/runtime` | `PLANNED_NOT_CREATED` | Source-ready PITS safe action-boundary marker; not deployed from Codex. | Expected HTTP 200 with `Safe Action Boundary`, `Read-only preview` and `Future admin action requires audit` after owner runtime sync. |
| Stage 1I | `https://pits-ng.dmp247.com/projects/{id}` | `PLANNED_NOT_CREATED` | Source-ready PITS project owner review boundary; not deployed from Codex. | Expected HTTP 200 with `Owner Review Queue`, `Safe Action Boundary` and `Action is read-only preview only` after owner runtime sync. |
| Stage 1J | `https://ois-nextgen.abacusai.cloud/platform/admin-boundary` | `PLANNED_NOT_CREATED` | Source-ready read-only audit/admin permission model endpoint; not deployed from Codex. | Expected HTTP 200 with `Admin Boundary`, `Audit Required`, `Permission Model`, `Preview only`, `Blocked in current stage` and `BLOCKED_IN_CURRENT_STAGE` after owner runtime sync. |
| Stage 1J | `https://ois-ng.dmp247.com/dashboard` | `PLANNED_NOT_CREATED` | Source-ready OIS admin boundary marker; not deployed from Codex. | Expected HTTP 200 with `Admin Boundary`, `Audit Required`, `Permission Model`, `Preview only` and `Blocked in current stage` after owner runtime sync. |
| Stage 1J | `https://ois-ng.dmp247.com/runtime` | `PLANNED_NOT_CREATED` | Source-ready OIS audit/admin boundary marker; not deployed from Codex. | Expected HTTP 200 with `Audit / Permission / Admin Boundary`, `Audit Required`, `Permission Model`, `Preview only` and `Blocked in current stage` after owner runtime sync. |
| Stage 1J | `https://ois-ng.dmp247.com/products/{id}` | `PLANNED_NOT_CREATED` | Source-ready OIS product admin boundary; not deployed from Codex. | Expected HTTP 200 with `Admin Boundary`, `Audit Required`, `Permission Model` and `Preview only - not executable yet` after owner runtime sync. |
| Stage 1J | `https://ois-ng.dmp247.com/workspaces/{id}` | `PLANNED_NOT_CREATED` | Source-ready OIS workspace admin boundary; not deployed from Codex. | Expected HTTP 200 with `Admin Boundary`, `Audit Required`, `Permission Model` and `Preview only - not executable yet` after owner runtime sync. |
| Stage 1J | `https://ois-ng.dmp247.com/installations/{id}` | `PLANNED_NOT_CREATED` | Source-ready OIS installation admin boundary; not deployed from Codex. | Expected HTTP 200 with `Admin Boundary`, `Audit Required`, `Permission Model` and `Preview only - not executable yet` after owner runtime sync. |
| Stage 1J | `https://pits-ng.dmp247.com/projects` | `PLANNED_NOT_CREATED` | Source-ready PITS admin boundary marker; not deployed from Codex. | Expected HTTP 200 with `Admin Boundary`, `Audit Required`, `Permission Model`, `Preview only` and `Blocked in current stage` after owner runtime sync. |
| Stage 1J | `https://pits-ng.dmp247.com/runtime` | `PLANNED_NOT_CREATED` | Source-ready PITS audit/admin boundary marker; not deployed from Codex. | Expected HTTP 200 with `Audit / Permission / Admin Boundary`, `Audit Required`, `Permission Model`, `Preview only` and `Blocked in current stage` after owner runtime sync. |
| Stage 1J | `https://pits-ng.dmp247.com/projects/{id}` | `PLANNED_NOT_CREATED` | Source-ready PITS project admin boundary; not deployed from Codex. | Expected HTTP 200 with `Admin Boundary`, `Audit Required`, `Permission Model` and `Preview only - not executable yet` after owner runtime sync. |
| Stage 1K | `https://ois-nextgen.abacusai.cloud/platform/product-uat` | `PLANNED_NOT_CREATED` | Source-ready read-only product user journey UAT baseline endpoint; not deployed from Codex. | Expected HTTP 200 with `Product User Journey UAT`, `Testable now`, `Control-plane only`, `Functional gap map`, `Next product journey` and `NOT_ALLOWED_IN_STAGE_1K` after owner runtime sync. |
| Stage 1K | `https://ois-ng.dmp247.com` | `PLANNED_NOT_CREATED` | Source-ready OIS product UAT summary; not deployed from Codex. | Expected HTTP 200 with `Product User Journey UAT Baseline` and product UAT markers after owner runtime sync. |
| Stage 1K | `https://ois-ng.dmp247.com/dashboard` | `PLANNED_NOT_CREATED` | Source-ready OIS product UAT dashboard panel; not deployed from Codex. | Expected HTTP 200 with `Product User Journey / UAT Baseline`, `Testable now`, `Control-plane only`, `Functional gap map` and `Next product journey` after owner runtime sync. |
| Stage 1K | `https://ois-ng.dmp247.com/runtime` | `PLANNED_NOT_CREATED` | Source-ready OIS product capability/UAT status panel; not deployed from Codex. | Expected HTTP 200 with `Product Capability / UAT Status` and product UAT markers after owner runtime sync. |
| Stage 1K | `https://ois-ng.dmp247.com/products/{id}` | `PLANNED_NOT_CREATED` | Source-ready OIS product detail UAT baseline; not deployed from Codex. | Expected HTTP 200 with product UAT markers and clear current/future function separation after owner runtime sync. |
| Stage 1K | `https://ois-ng.dmp247.com/workspaces/{id}` | `PLANNED_NOT_CREATED` | Source-ready OIS workspace detail gap map; not deployed from Codex. | Expected HTTP 200 with product UAT markers and honest end-user workspace gap copy after owner runtime sync. |
| Stage 1K | `https://ois-ng.dmp247.com/installations/{id}` | `PLANNED_NOT_CREATED` | Source-ready OIS installation detail gap map; not deployed from Codex. | Expected HTTP 200 with product UAT markers and no enabled status write after owner runtime sync. |
| Stage 1K | `https://pits-ng.dmp247.com` | `PLANNED_NOT_CREATED` | Source-ready PITS product UAT summary; not deployed from Codex. | Expected HTTP 200 with `Product User Journey UAT Baseline`, product UAT markers and current registry/readiness shell wording after owner runtime sync. |
| Stage 1K | `https://pits-ng.dmp247.com/projects` | `PLANNED_NOT_CREATED` | Source-ready PITS project list UAT baseline; not deployed from Codex. | Expected HTTP 200 with product UAT markers and clear registry shell versus true workflow app wording after owner runtime sync. |
| Stage 1K | `https://pits-ng.dmp247.com/runtime` | `PLANNED_NOT_CREATED` | Source-ready PITS product capability/UAT status panel; not deployed from Codex. | Expected HTTP 200 with `Product Capability / UAT Status` and product UAT markers after owner runtime sync. |
| Stage 1K | `https://pits-ng.dmp247.com/projects/{id}` | `PLANNED_NOT_CREATED` | Source-ready PITS project detail functional gap map; not deployed from Codex. | Expected HTTP 200 with `Project Product UAT Baseline`, product UAT markers and future issue/task workflow gaps after owner runtime sync. |
| Stage 2A | `https://ois-nextgen.abacusai.cloud/platform/pits/projects/{id}/workboard` | `PLANNED_NOT_CREATED` | Source-ready read-only PITS Project Workboard endpoint; not deployed from Codex. | Expected HTTP 200 with `PITS Project Workboard`, `Read-only functional slice`, `Work items` and `NOT_ALLOWED_IN_STAGE_2A` after owner runtime sync. |
| Stage 2A | `https://pits-ng.dmp247.com/projects/{id}/workboard` | `PLANNED_NOT_CREATED` | Source-ready PITS Project Workboard UI route; not deployed from Codex. | Expected HTTP 200 with status groups, work item cards, read-only notice and no enabled mutation action after owner runtime sync. |
| Stage 2B | `https://ois-nextgen.abacusai.cloud/platform/pits/projects/{projectId}/work-items/{itemId}` | `PLANNED_NOT_CREATED` | Source-ready read-only PITS Work Item Detail endpoint; not deployed from Codex. | Expected HTTP 200 with `Work Item Detail`, `Dry-run Action Preview`, `No data will be changed` and `NOT_ALLOWED_IN_STAGE_2B` after owner runtime sync. |
| Stage 2B | `https://ois-nextgen.abacusai.cloud/platform/pits/projects/{projectId}/work-items/{itemId}/action-preview` | `PLANNED_NOT_CREATED` | Source-ready non-mutating PITS dry-run action preview endpoint; not deployed from Codex. | Expected HTTP 200 with `DRY_RUN_ONLY`, `allowedInCurrentStage=false` and `noDataChanged=true` after owner runtime sync. |
| Stage 2B | `https://pits-ng.dmp247.com/projects/{id}/work-items/{itemId}` | `PLANNED_NOT_CREATED` | Source-ready PITS Work Item Detail UI route; not deployed from Codex. | Expected HTTP 200 with `Work Item Detail`, `Dry-run Action Preview`, `Preview only`, `Requires audit trail`, `Requires confirmation`, `Requires rollback plan` and no enabled mutation action after owner runtime sync. |
| Stage 2D | `https://ois-ng.dmp247.com/product-flow` | `PLANNED_NOT_CREATED` | Source-ready localized OIS Product Flow Preview route; not deployed from Codex. | Expected HTTP 200 with `Product Flow Preview`, `Localization Foundation`, `Language Settings`, `OIS Product UX Preview`, `OIS Product UX Blueprint`, `Primary user`, `Main action`, `Current stage status`, `Screen mock`, `Executive Dashboard`, `Ask OIS / Copilot` and no write/LLM action after owner runtime sync. |
| Stage 2D | `https://pits-ng.dmp247.com/product-flow` | `PLANNED_NOT_CREATED` | Source-ready localized PITS Product Flow Preview route; not deployed from Codex. | Expected HTTP 200 with `Product Flow Preview`, `Localization Foundation`, `Language Settings`, `PITS Product UX Preview`, `PITS Product UX Blueprint`, `PITS Home`, `Projects List`, `Project Workboard`, `Work Item Detail`, `Dry-run Action Preview`, `Runtime/Admin` and no enabled mutation action after owner runtime sync. |
| Stage 2D-R1 | `https://ois-ng.dmp247.com/localization` | `PLANNED_NOT_CREATED` | Source-ready read-only OIS localization catalog route; not deployed from Codex. | Expected HTTP 200 with `Localization Catalog`, `Read-only Localization Catalog`, `Available locales`, `Translation namespaces`, `Missing keys`, `Fallback keys`, `packages/shared-ui/src/localization.ts`, `Browser editing is not enabled yet` and no write action after owner runtime sync. |
| Stage 2D-R1 | `https://pits-ng.dmp247.com/localization` | `PLANNED_NOT_CREATED` | Source-ready read-only PITS localization catalog route; not deployed from Codex. | Expected HTTP 200 with `Localization Catalog`, `Read-only Localization Catalog`, `Available locales`, `Translation namespaces`, `Missing keys`, `Fallback keys`, `packages/shared-ui/src/localization.ts`, `Browser editing is not enabled yet` and no mutation action after owner runtime sync. |
| Stage 2E | `https://ois-nextgen.abacusai.cloud/platform/pits/projects/{projectId}/work-items/{itemId}/action-requests` | `PLANNED_NOT_CREATED` | Source-ready read-only PITS Action Request list endpoint; not deployed from Codex. | Expected HTTP 200 with `PITS Action Request`, `Action request only`, `No direct mutation`, `Pending review`, `noDirectMutation=true` and `NOT_ALLOWED_IN_STAGE_2E` after owner runtime sync. |
| Stage 2E | `https://ois-nextgen.abacusai.cloud/platform/pits/projects/{projectId}/work-items/{itemId}/action-request-preview` | `PLANNED_NOT_CREATED` | Source-ready non-mutating PITS Action Request preview endpoint; not deployed from Codex. | Expected HTTP 200 with `PITS Action Request`, `sourceItemUnchanged`, `No direct mutation`, `Requires audit trail`, `Requires confirmation`, `Requires rollback plan` and `noDirectMutation=true` after owner runtime sync. |
| Stage 2E | `https://pits-ng.dmp247.com/projects/{id}/work-items/{itemId}` | `PLANNED_NOT_CREATED` | Source-ready PITS Work Item Detail UI route with action-request panel; not deployed from Codex. | Expected HTTP 200 with `PITS Action Request`, `Action request only`, `No direct mutation`, `Pending review`, `Requires audit trail`, `Requires confirmation`, `Requires rollback plan` and no enabled mutation action after owner runtime sync. |
| Stage 2F | `https://ois-nextgen.abacusai.cloud/platform/ecosystem-products` | `PLANNED_NOT_CREATED` | Source-ready Powered by OIS product registry endpoint; not deployed from Codex. | Expected HTTP 200 with ecosystem product keys and no production resource touch after owner runtime sync. |
| Stage 2F | `https://ois-nextgen.abacusai.cloud/platform/learning/signals` | `PLANNED_NOT_CREATED` | Source-ready Learning Signal create/list endpoint; not deployed from Codex. | Expected tenant-scoped Learning Signal records with provenance, confidence and audit evidence after migration deploy and owner runtime sync. |
| Stage 2F | `https://ois-nextgen.abacusai.cloud/platform/learning/candidates` | `PLANNED_NOT_CREATED` | Source-ready Learning Candidate list/review endpoint; not deployed from Codex. | Expected candidate review payloads with `noCanonicalKnowledgeWrite=true` after migration deploy and owner runtime sync. |
| Stage 2F | `https://ois-nextgen.abacusai.cloud/platform/learning/policies` | `PLANNED_NOT_CREATED` | Source-ready learning policy list/update endpoint; not deployed from Codex. | Expected governed policy payloads for `ALWAYS_ASK`, `AUTO_IF_CONFIDENCE`, `FULL_AUTO_PILOT` and `LOG_ONLY` after owner runtime sync. |
| Stage 2F | `https://ois-nextgen.abacusai.cloud/platform/learning/center` | `PLANNED_NOT_CREATED` | Source-ready SuperAdmin Learning Center API endpoint; not deployed from Codex. | Expected HTTP 200 with overview, stream, pending review, policies, executive queue, product map and audit placeholder after owner runtime sync. |
| Stage 2F | `https://ois-nextgen.abacusai.cloud/platform/agent/chat` | `PLANNED_NOT_CREATED` | Source-ready OIS Agent Runtime chat endpoint; not deployed from Codex. | Expected deterministic stub response and no OpenRouter/LLM runtime call in Stage 2F. |
| Stage 2F | `https://ois-nextgen.abacusai.cloud/platform/agent/learning-submissions` | `PLANNED_NOT_CREATED` | Source-ready OIS Agent Widget submission endpoint; not deployed from Codex. | Expected Learning Signal and Agent Learning Submission records with audit evidence and no canonical Knowledge Layer write. |
| Stage 2F | `https://ois-ng.dmp247.com/learning-center` | `PLANNED_NOT_CREATED` | Source-ready OIS Learning Center route; not deployed from Codex. | Expected HTTP 200 with `OIS Learning Center`, `Learning Stream`, `Pending Review`, `Learning Policies`, `Executive Intent Queue`, `Product Contribution Map` and `Audit Log Placeholder` after owner runtime sync. |
| Stage 2F | `https://ois-ng.dmp247.com` | `PLANNED_NOT_CREATED` | Source-ready OIS Agent Widget on OIS Console pages; not deployed from Codex. | Expected floating `Powered by OIS` widget with `Ask`, `Teach OIS`, `Evidence` and `Status` tabs after owner runtime sync and browser/UAT. |
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
| OIS NextGen platform overview | `curl -i https://ois-nextgen.abacusai.cloud/platform/overview` | HTTP 200, `DEMO DATA - NOT PRODUCTION` banner, phase gates, and seeded counts at least: industries 1, organizations 1, workspaces 1, projects 2, products 5, installations 2, modules 3, auditRecords 1. |
| OIS NextGen product registry after Stage 1B sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/products` | HTTP 200 with `products`, `source=default-db` and `mode=read-only`. |
| OIS NextGen workspace registry after Stage 1B sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/workspaces` | HTTP 200 with organizations/workspaces, `source=default-db` and `mode=read-only`. |
| OIS NextGen project registry after Stage 1B sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/projects` | HTTP 200 with `projects`, `source=default-db` and `mode=read-only`. |
| OIS NextGen module registry after Stage 1B sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/modules` | HTTP 200 with `modules`, `source=default-db` and `mode=read-only`. |
| OIS NextGen installation registry after Stage 1B sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/installations` | HTTP 200 with `installations`, `source=default-db` and `mode=read-only`. |
| OIS NextGen aggregate registry after Stage 1B sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/registry` | HTTP 200 aggregate registry for OIS/PITS UI shells. |
| OIS NextGen registry runtime health after Stage 1D sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/registry/health` | HTTP 200 with `summary`, `entities`, `Reachable`, `source=default-db`, `mode=read-only` and no localhost/legacy links. |
| OIS NextGen registry readiness after Stage 1E sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/registry/readiness` | HTTP 200 with `summary`, `entities`, `READY`, `source=default-db`, `mode=read-only` and no localhost/legacy links. |
| OIS NextGen product detail after Stage 1C sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/products/<product-id>` | HTTP 200 read-only product detail with `source=default-db` and `mode=read-only`. |
| OIS NextGen product-code detail after Stage 1C sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/products/code/<product-code>` | HTTP 200 read-only product detail by product code. |
| OIS NextGen workspace detail after Stage 1C sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/workspaces/<workspace-id>` | HTTP 200 read-only workspace detail. |
| OIS NextGen project detail after Stage 1C sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/projects/<project-id>` | HTTP 200 read-only project detail. |
| OIS NextGen module detail after Stage 1C sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/modules/<module-id>` | HTTP 200 read-only module detail. |
| OIS NextGen installation detail after Stage 1C sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/installations/<installation-id>` | HTTP 200 read-only installation detail. |
| OIS Console Cloudflare Tunnel root | `curl -i https://ois-ng.dmp247.com` | HTTP 200 OIS Console with `OIS_CONSOLE`, Core API URL, healthy Core API and seeded counts. |
| OIS Console Cloudflare Tunnel dashboard | `curl -i https://ois-ng.dmp247.com/dashboard` | HTTP 200 OIS Platform Overview. |
| PITS Shell Cloudflare Tunnel root | `curl -i https://pits-ng.dmp247.com` | HTTP 200 PITS Shell with `PITS_SHELL`, Core API URL, healthy Core API and seeded counts. |
| PITS Shell Cloudflare Tunnel projects | `curl -i https://pits-ng.dmp247.com/projects` | HTTP 200 PITS Project Selector. |
| UI route manifest guard after Stage 1A-R1 build | `bash ops/abacus/verify-ui-route-manifests.sh` | `UI_ROUTE_MANIFEST_CHECK_PASSED`. |
| Public staging restart with UI orphan cleanup | `bash ops/abacus/restart-public-staging-runtime.sh` | Stops UI services, cleans only orphan listeners on `3000/tcp` and `3001/tcp` if needed, restarts OIS/PITS and verifies local/public routes. |
| OIS Console products route | `curl -i https://ois-ng.dmp247.com/products` | HTTP 200 OIS Products & Modules route. |
| OIS Console workspaces route | `curl -i https://ois-ng.dmp247.com/workspaces` | HTTP 200 OIS Workspaces route. |
| OIS Console runtime route | `curl -i https://ois-ng.dmp247.com/runtime` | HTTP 200 OIS Runtime Status route. |
| PITS Shell runtime route | `curl -i https://pits-ng.dmp247.com/runtime` | HTTP 200 PITS Runtime Status route. |
| OIS Console product detail after Stage 1C-R1 sync | `curl -i https://ois-ng.dmp247.com/products/<product-id>` | HTTP 200 OIS product detail route with `Product Detail Source`. |
| OIS Console workspace detail after Stage 1C-R1 sync | `curl -i https://ois-ng.dmp247.com/workspaces/<workspace-id>` | HTTP 200 OIS workspace detail route with `Workspace Detail Source`. |
| OIS Console module detail after Stage 1C-R1 sync | `curl -i https://ois-ng.dmp247.com/modules/<module-id>` | HTTP 200 OIS module detail route with `Module Detail Source`. |
| OIS Console installation detail after Stage 1C-R1 sync | `curl -i https://ois-ng.dmp247.com/installations/<installation-id>` | HTTP 200 OIS installation detail route with `Installation Detail Source`. |
| PITS Shell project detail after Stage 1C-R1 sync | `curl -i https://pits-ng.dmp247.com/projects/<project-id>` | HTTP 200 PITS project detail route with `Project Detail Source`. |
| OIS Console dashboard after Stage 1D sync | `curl -i https://ois-ng.dmp247.com/dashboard` | HTTP 200 with `Registry Runtime Health`. |
| OIS Console product health after Stage 1D sync | `curl -i https://ois-ng.dmp247.com/products/<product-id>` | HTTP 200 with `Product Runtime Health`. |
| OIS Console workspace health after Stage 1D sync | `curl -i https://ois-ng.dmp247.com/workspaces/<workspace-id>` | HTTP 200 with `Workspace Runtime Health`. |
| OIS Console module health after Stage 1D sync | `curl -i https://ois-ng.dmp247.com/modules/<module-id>` | HTTP 200 with `Module Runtime Health`. |
| OIS Console installation health after Stage 1D sync | `curl -i https://ois-ng.dmp247.com/installations/<installation-id>` | HTTP 200 with `Installation Runtime Health`. |
| PITS Shell projects health after Stage 1D sync | `curl -i https://pits-ng.dmp247.com/projects` | HTTP 200 with `Registry Runtime Health`. |
| PITS Shell project health after Stage 1D sync | `curl -i https://pits-ng.dmp247.com/projects/<project-id>` | HTTP 200 with `Project Runtime Health`. |
| OIS Console dashboard readiness after Stage 1E sync | `curl -i https://ois-ng.dmp247.com/dashboard` | HTTP 200 with `Registry Governance / Readiness`. |
| OIS Console product readiness after Stage 1E sync | `curl -i https://ois-ng.dmp247.com/products/<product-id>` | HTTP 200 with `Product Governance / Readiness` and `What is missing?`. |
| OIS Console workspace readiness after Stage 1E sync | `curl -i https://ois-ng.dmp247.com/workspaces/<workspace-id>` | HTTP 200 with `Workspace Governance / Readiness` and `What is missing?`. |
| OIS Console module readiness after Stage 1E sync | `curl -i https://ois-ng.dmp247.com/modules/<module-id>` | HTTP 200 with `Module Governance / Readiness` and `What is missing?`. |
| OIS Console installation readiness after Stage 1E sync | `curl -i https://ois-ng.dmp247.com/installations/<installation-id>` | HTTP 200 with `Installation Governance / Readiness` and `What is missing?`. |
| PITS Shell projects readiness after Stage 1E sync | `curl -i https://pits-ng.dmp247.com/projects` | HTTP 200 with `Registry Governance / Readiness`. |
| PITS Shell project readiness after Stage 1E sync | `curl -i https://pits-ng.dmp247.com/projects/<project-id>` | HTTP 200 with `Project Governance / Readiness` and `What is missing?`. |
| OIS Console root cockpit after Stage 1F-R1 sync | `curl -i https://ois-ng.dmp247.com` | HTTP 200 with `Owner Registry Cockpit / Registry Runtime Summary`, `Ready to operate` and `Forbidden link guard`. |
| OIS Console shell standard after Stage 1G sync | `curl -i https://ois-ng.dmp247.com` | HTTP 200 with `Modern Shell Layout`, `Shell Navigation Toggle`, `Fixed Navigation Shell`, `Responsive Product Shell` and existing cockpit markers. |
| OIS Console owner-first design after Stage 1H sync | `curl -i https://ois-ng.dmp247.com` | HTTP 200 with `Owner-first Design System`, `Visual Hierarchy Standard`, `Owner-friendly Status Badges` and existing cockpit markers. |
| Owner review endpoint after Stage 1I sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/owner-review` | HTTP 200 with `Owner Review Queue`, `Safe Action Boundary`, `Read-only preview`, `Future admin action requires audit` and `NOT_ALLOWED_IN_STAGE_1I`. |
| Admin boundary endpoint after Stage 1J sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/admin-boundary` | HTTP 200 with `Admin Boundary`, `Audit Required`, `Permission Model`, `Preview only`, `Blocked in current stage` and `BLOCKED_IN_CURRENT_STAGE`. |
| Product UAT endpoint after Stage 1K sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/product-uat` | HTTP 200 with `Product User Journey UAT`, `Testable now`, `Control-plane only`, `Functional gap map`, `Next product journey` and `NOT_ALLOWED_IN_STAGE_1K`. |
| PITS Project Workboard endpoint after Stage 2A sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/pits/projects/<project-id>/workboard` | HTTP 200 with `PITS Project Workboard`, `Read-only functional slice`, `Work items`, `Open`, `In progress`, `Blocked`, `Done` and `NOT_ALLOWED_IN_STAGE_2A`. |
| PITS Work Item Detail endpoint after Stage 2B sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/pits/projects/<project-id>/work-items/<item-id>` | HTTP 200 with `Work Item Detail`, `Dry-run Action Preview`, `No data will be changed` and `NOT_ALLOWED_IN_STAGE_2B`. |
| PITS Dry-run Action Preview endpoint after Stage 2B sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/pits/projects/<project-id>/work-items/<item-id>/action-preview` | HTTP 200 with `DRY_RUN_ONLY`, `allowedInCurrentStage=false` and `noDataChanged=true`. |
| OIS Product Flow Preview after Stage 2D sync | `curl -i https://ois-ng.dmp247.com/product-flow` | HTTP 200 with `Product Flow Preview`, `Localization Foundation`, `Language Settings`, `OIS Product UX Preview`, `Primary user`, `Main action`, `Current stage status`, `Screen mock`, `Executive Dashboard`, `Workspace Intelligence Dashboard`, `Ask OIS / Copilot` and no enabled write/LLM action. |
| PITS Product Flow Preview after Stage 2D sync | `curl -i https://pits-ng.dmp247.com/product-flow` | HTTP 200 with `Product Flow Preview`, `Localization Foundation`, `Language Settings`, `PITS Product UX Preview`, `PITS Home`, `Projects List`, `Project Workboard`, `Work Item Detail`, `Dry-run Action Preview`, `Runtime/Admin`, `No data will be changed` and no enabled mutation action. |
| OIS Localization Catalog after Stage 2D-R1 sync | `curl -i https://ois-ng.dmp247.com/localization` | HTTP 200 with `Localization Catalog`, `Read-only Localization Catalog`, `Available locales`, `Translation namespaces`, `Missing keys`, `Fallback keys`, `packages/shared-ui/src/localization.ts` and no enabled browser editing action. |
| PITS Localization Catalog after Stage 2D-R1 sync | `curl -i https://pits-ng.dmp247.com/localization` | HTTP 200 with `Localization Catalog`, `Read-only Localization Catalog`, `Available locales`, `Translation namespaces`, `Missing keys`, `Fallback keys`, `packages/shared-ui/src/localization.ts` and no enabled browser editing action. |
| PITS Action Request list endpoint after Stage 2E sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/pits/projects/<project-id>/work-items/<item-id>/action-requests` | HTTP 200 with `PITS Action Request`, `Action request only`, `No direct mutation`, `Pending review`, `noDirectMutation=true` and `NOT_ALLOWED_IN_STAGE_2E`. |
| PITS Action Request preview endpoint after Stage 2E sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/pits/projects/<project-id>/work-items/<item-id>/action-request-preview` | HTTP 200 with `PITS Action Request`, `sourceItemUnchanged`, `No direct mutation`, `Requires audit trail`, `Requires confirmation`, `Requires rollback plan` and `noDirectMutation=true`. |
| Ecosystem products after Stage 2F sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/ecosystem-products` | HTTP 200 with Powered by OIS product registry keys including `OIS_PLATFORM`, `PITS`, `KEIHB`, `ICR`, `CSAGENT`, `FUTURE_PRODUCT` and `CUSTOM`. |
| Learning Center API after Stage 2F sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/learning/center` | HTTP 200 with overview, learning stream, pending review, learning policies, executive intent queue, product contribution map and audit placeholder. |
| Agent chat API after Stage 2F sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/agent/chat` | HTTP 200 deterministic OIS Agent Runtime stub response; no OpenRouter/LLM call in Stage 2F. |
| OIS Learning Center after Stage 2F sync | `curl -i https://ois-ng.dmp247.com/learning-center` | HTTP 200 with `OIS Learning Center`, `Learning Stream`, `Pending Review`, `Learning Policies`, `Executive Intent Queue`, `Product Contribution Map` and `Audit Log Placeholder`. |
| OIS Agent Widget after Stage 2F sync | `curl -i https://ois-ng.dmp247.com` | HTTP 200 page response containing `Powered by OIS`, `Ask`, `Teach OIS`, `Evidence` and `Status` widget markers. |
| Knowledge layers API after Stage 2G sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/knowledge/layers` | HTTP 200 with `KL_0_LEGAL_REGULATORY_CORE`, `KL_5_LIVE_OPERATIONAL_SIGNALS`, `productConsumptionMap` and `autoPromotionEnabled=false`. |
| Knowledge items API after Stage 2G sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/knowledge/items` | HTTP 200 with canonical item summaries, layer counts and no mutation affordance. |
| Knowledge evidence API after Stage 2G sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/knowledge/evidence` | HTTP 200 with evidence links and provenance markers. |
| Knowledge context API after Stage 2G-R1 sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/knowledge/context` | HTTP 200 with `deterministic-knowledge-context`, `knowledgeLayerTaxonomy`, `availableLayers`, `KL_0_LEGAL_REGULATORY_CORE`, `noLlmCall=true`, `noCanonicalWrite=true` and `autoPromotionEnabled=false`. |
| Knowledge layer mappings API after Stage 2G-R2 sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/learning/layer-mappings` | HTTP 200 with `knowledgeLayerTaxonomy`, `availableLayers`, `KL_0_LEGAL_REGULATORY_CORE`, `mappingStatusTaxonomy`, `availableStatuses` and `READY_FOR_REVIEW`. Mapping rows remain truthful and may be empty. |
| KEIHB bundles API after Stage 2G-R1 sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/knowledge/keihb/bundles` | HTTP 200 with `knowledgeLayerTaxonomy`, `availableLayers`, `KL_0_LEGAL_REGULATORY_CORE`, `KEIHB`, `projectionBoundary` and `sourceOfTruth` as OIS Knowledge Fabric. Bundle rows keep truthful `includedLayerKeys`. |
| Architecture mindmap API after Stage 2G sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/architecture/mindmap` | HTTP 200 with `OIS Ecosystem Architecture Map`, `apiContracts` and governance checkpoints. |
| OIS Knowledge Fabric after Stage 2G sync | `curl -i https://ois-ng.dmp247.com/knowledge-fabric` | HTTP 200 with `OIS Knowledge Fabric`, `Universal Knowledge Read Contract`, `Knowledge Layers Overview`, `Canonical Knowledge Items`, `Evidence Links`, `KEIHB Bundles` and `Architecture Map / Mindmap`. |
| OIMA product code API after Stage 2K sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/products/code/OIMA` | HTTP 200 with `displayName`, `OIMA`, `MEETING_INTELLIGENCE_PRODUCT`, `MEETING_INTAKE`, `TRANSCRIPT_PROCESSING`, `PRODUCT_BOUNDARY_READY`, `TRANSCRIPT_ONLY`, `NO_LIVE_SPEAKING_AGENT` and `OIS Canonical Knowledge Fabric`. |
| OIMA overview API after Stage 2K sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/oima/overview` | HTTP 200 with `productCode=OIMA`, `productName=Organizational Intelligence Meeting Agent`, source modes, `MEETING_INTAKE`, `TRANSCRIPT_PROCESSING`, `currentRuntimeCapabilities`, `plannedRuntimeCapabilities`, `emptyStateSurfaces`, safety boundaries, OIS Core reuse map, `universalKnowledgeApiDisplayName="Universal Knowledge API"`, `universalKnowledgeApiLabel="OIS Universal Knowledge API"` and no LLM/runtime meeting analysis claim. |
| OIMA source modes API after Stage 2K sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/oima/source-modes` | HTTP 200 with `TRANSCRIPT_ONLY`, `AUDIO_ONLY`, `TRANSCRIPT_AND_AUDIO`, `LISTENER_CAPTURED`, `primarySourceMode=TRANSCRIPT_ONLY`, transcript-first guidance, optional audio metadata and listener planned/not-runtime markers. |
| OIMA roadmap API after Stage 2K sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/oima/roadmap` | HTTP 200 with `Stage 2K`, `TRANSCRIPT_PROCESSING_READY`, `OIMA-0`, `OIMA-1`, `OIMA-2`, `OIMA-9` and planned analysis/listener stages. |
| OIMA boundary API after Stage 2K sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/oima/boundary` | HTTP 200 with `meetingIntakeImplemented=true`, `transcriptProcessingImplemented=true`, `rawTranscriptImmutable=true`, `normalizedTranscriptSeparate=true`, no canonical write, no auto-promotion, no live speaking agent, no voice clone, no impersonation and no autonomous decision markers. |
| OIMA meetings API after Stage 2K sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/oima/meetings` | HTTP 200 with `intakeContract`, `meetingStatuses`, `sourceFileTypes`, `uploadStatuses`, `TRANSCRIPT_ONLY`, `TRANSCRIPT_AND_AUDIO`, `AUDIO_ONLY`, `READY_FOR_PROCESSING`, `TRANSCRIPT`, `AUDIO`, `noFakeMeetingAnalysis=true` and `noLlmCalls=true`. Meeting rows may be empty until real registration. |
| OIMA transcript contract API after Stage 2K sync | `curl -i https://ois-nextgen.abacusai.cloud/platform/oima/transcripts/contract` | HTTP 200 with `Stage 2K / OIMA-2`, `TRANSCRIPT_PROCESSING`, `RAW`, `NORMALIZED`, `CORRECTED`, `MICROSOFT_TEAMS`, `GENERIC_TEXT`, `NEEDS_REVIEW`, `rawTranscriptImmutable=true`, `normalizedTranscriptSeparate=true`, `rawTranscriptOverwriteAllowed=false`, `meetingAnalyticsImplemented=false`, `issueDecisionActionRiskExtractionImplemented=false` and `realLlmCallsEnabled=false`. |
| OIS OIMA shell after Stage 2K sync | `curl -i https://ois-ng.dmp247.com/oima` | HTTP 200 with `OIMA Product Overview`, `OIMA-2 transcript ready`, `Open Meeting Library`, `Product Boundary`, `Source Mode Contract`, `Safety Boundary`, `OIS Core Reuse Map`, `OIMA Roadmap`, `OIMA Product Surface Empty States`, `Meeting Library`, `Upload Meeting`, `Transcript Processing`, `Available now`, `Agent Analysis`, `Clarification Review`, `Self-Improvement Center`, `Listener Mode`, `Planned / not runtime`, `No fake meeting data`, `TRANSCRIPT_ONLY`, `MEETING_INTAKE` and `TRANSCRIPT_PROCESSING`. |
| OIS OIMA Meeting Library after Stage 2K sync | `curl -i https://ois-ng.dmp247.com/oima/meetings` | HTTP 200 with `OIMA Meeting Intake`, `Meeting Library`, `Register meeting`, `Source mode`, `Transcript present`, `Audio present`, `LISTENER_CAPTURED planned/not-runtime`, `No fake meeting analysis`, `OIMA-2 available` and `MEETING_INTAKE`. |
| OIS OIMA Upload/Register Meeting after Stage 2K sync | `curl -i https://ois-ng.dmp247.com/oima/meetings/new` | HTTP 200 with `Register OIMA Meeting`, `Transcript-first intake`, `TRANSCRIPT_ONLY`, `TRANSCRIPT_AND_AUDIO`, `Optional audio metadata`, `LISTENER_CAPTURED planned/not-runtime`, `Transcript processing available after registration`, `No audio processing`, `No OIS Agent analysis`, `No voice clone` and `No LLM/OpenRouter calls`. |
| OIS OIMA Meeting Detail after Stage 2K registration | `curl -i https://ois-ng.dmp247.com/oima/meetings/<meeting-id>` | HTTP 200 for a real registered meeting with `Meeting Detail`, `Source Files`, `Transcript Processing`, `RAW transcript immutable`, `NORMALIZED transcript separate`, `Transcript Timeline`, `Parse Warnings`, `OIS Agent Analysis`, `Clarification Review`, `Dashboard`, `Planned / not runtime` and no fake analytics. |
| OIS Console dashboard owner review after Stage 1I sync | `curl -i https://ois-ng.dmp247.com/dashboard` | HTTP 200 with `Owner Review Queue`, `Safe Action Boundary` and preview-only action copy. |
| OIS Console dashboard admin boundary after Stage 1J sync | `curl -i https://ois-ng.dmp247.com/dashboard` | HTTP 200 with `Admin Boundary`, `Audit Required`, `Permission Model`, `Preview only` and no executable admin action. |
| OIS Console root product UAT after Stage 1K sync | `curl -i https://ois-ng.dmp247.com` | HTTP 200 with `Product User Journey UAT Baseline`, `Functional gap map` and `Next product journey`. |
| OIS Console dashboard product UAT after Stage 1K sync | `curl -i https://ois-ng.dmp247.com/dashboard` | HTTP 200 with `Product User Journey / UAT Baseline`, `Testable now`, `Control-plane only` and no executable product action. |
| OIS Console runtime product UAT after Stage 1K sync | `curl -i https://ois-ng.dmp247.com/runtime` | HTTP 200 with `Product Capability / UAT Status` and owner-friendly UAT wording. |
| OIS Console dashboard cockpit after Stage 1F sync | `curl -i https://ois-ng.dmp247.com/dashboard` | HTTP 200 with `Owner Registry Cockpit / Registry Runtime Summary`, `Missing runtime URL` and `Forbidden link guard`. |
| OIS Console product card UAT after Stage 1F sync | `curl -i https://ois-ng.dmp247.com/products` | HTTP 200 with `Runtime health:`, `Readiness:` and `Linked to PITS`. |
| OIS Console workspace card UAT after Stage 1F sync | `curl -i https://ois-ng.dmp247.com/workspaces` | HTTP 200 with `Runtime health:` and `Readiness:`. |
| OIS Console runtime cockpit after Stage 1F sync | `curl -i https://ois-ng.dmp247.com/runtime` | HTTP 200 with `Owner Registry Cockpit / Registry Runtime Summary`. |
| OIS Console detail UAT after Stage 1F sync | `curl -i https://ois-ng.dmp247.com/products/<product-id>` | HTTP 200 with `Owner-facing UAT summary`. |
| PITS Shell root cockpit after Stage 1F sync | `curl -i https://pits-ng.dmp247.com` | HTTP 200 with `PITS Registry Cockpit / Project Runtime Summary`. |
| PITS Shell standard after Stage 1G sync | `curl -i https://pits-ng.dmp247.com` | HTTP 200 with `Modern Shell Layout`, `Shell Navigation Toggle`, `Fixed Navigation Shell`, `Responsive Product Shell` and existing cockpit markers. |
| PITS Shell owner-first design after Stage 1H sync | `curl -i https://pits-ng.dmp247.com` | HTTP 200 with `Owner-first Design System`, `Visual Hierarchy Standard`, `Owner-friendly Status Badges` and existing cockpit markers. |
| PITS Shell projects owner review after Stage 1I sync | `curl -i https://pits-ng.dmp247.com/projects` | HTTP 200 with `Owner Review Queue`, `Safe Action Boundary` and preview-only action copy. |
| PITS Shell projects admin boundary after Stage 1J sync | `curl -i https://pits-ng.dmp247.com/projects` | HTTP 200 with `Admin Boundary`, `Audit Required`, `Permission Model`, `Preview only` and no executable admin action. |
| PITS Shell root product UAT after Stage 1K sync | `curl -i https://pits-ng.dmp247.com` | HTTP 200 with `Product User Journey UAT Baseline`, `Functional gap map` and registry/readiness shell wording. |
| PITS Shell projects product UAT after Stage 1K sync | `curl -i https://pits-ng.dmp247.com/projects` | HTTP 200 with `Product User Journey / UAT Baseline`, `Testable now`, `Control-plane only` and true workflow app gap wording. |
| PITS Shell runtime product UAT after Stage 1K sync | `curl -i https://pits-ng.dmp247.com/runtime` | HTTP 200 with `Product Capability / UAT Status` and no executable project action. |
| PITS Shell project card UAT after Stage 1F sync | `curl -i https://pits-ng.dmp247.com/projects` | HTTP 200 with `Project readiness` and `Runtime health:`. |
| PITS Shell project detail UAT after Stage 1F sync | `curl -i https://pits-ng.dmp247.com/projects/<project-id>` | HTTP 200 with `Owner-facing project UAT summary`. |
| PITS Shell project detail product UAT after Stage 1K sync | `curl -i https://pits-ng.dmp247.com/projects/<project-id>` | HTTP 200 with `Project Product UAT Baseline`, `Functional gap map` and future issue/task workflow gaps. |
| PITS Shell project workboard after Stage 2A sync | `curl -i https://pits-ng.dmp247.com/projects/<project-id>/workboard` | HTTP 200 with `PITS Project Workboard`, `Read-only functional slice`, status groups, work item cards and no enabled mutation action. |
| PITS Shell work item detail after Stage 2B/2E sync | `curl -i https://pits-ng.dmp247.com/projects/<project-id>/work-items/<item-id>` | HTTP 200 with `Work Item Detail`, `Dry-run Action Preview`, `PITS Action Request`, `Action request only`, `No direct mutation`, `Pending review`, `Requires audit trail`, `Requires confirmation`, `Requires rollback plan` and no enabled mutation action. |
| PITS Shell runtime cockpit after Stage 1F sync | `curl -i https://pits-ng.dmp247.com/runtime` | HTTP 200 with `PITS Registry Cockpit / Project Runtime Summary`. |
| Public staging runtime status | `bash ops/abacus/status-public-staging-runtime.sh` | Core API, OIS Console, PITS Shell, token-safe cloudflared status and public endpoint checks pass. |
| Public staging endpoint smoke | `bash ops/abacus/check-public-staging-endpoints.sh` | Core API, OIS and PITS public marker/count checks pass. |
| Token-safe cloudflared check | `systemctl is-active cloudflared && systemctl show cloudflared --property=ActiveState,SubState,MainPID,NRestarts --no-pager` | Active state/properties only; no `ExecStart`, process command line or tunnel token. |
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
| OIS product subdomain root | `https://ois-ng.dmp247.com` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Current verified OIS Console public staging subdomain through Cloudflare Tunnel. |
| PITS product subdomain root | `https://pits-ng.dmp247.com` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Current verified PITS Shell public staging subdomain through Cloudflare Tunnel. |
| OIS product subdomain dashboard | `https://ois-ng.dmp247.com/dashboard` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Current verified OIS Platform Overview route through Cloudflare Tunnel. |
| OIS product subdomain products | `https://ois-ng.dmp247.com/products` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Current verified OIS Products & Modules route through Cloudflare Tunnel. |
| OIS product subdomain workspaces | `https://ois-ng.dmp247.com/workspaces` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Current verified OIS Workspaces route through Cloudflare Tunnel. |
| OIS product subdomain runtime | `https://ois-ng.dmp247.com/runtime` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Current verified OIS Runtime Status route through Cloudflare Tunnel. |
| PITS product subdomain projects | `https://pits-ng.dmp247.com/projects` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Current verified PITS Project Selector route through Cloudflare Tunnel. |
| PITS product subdomain project workboard | `https://pits-ng.dmp247.com/projects/<project-id>/workboard` | `PLANNED_NOT_CREATED` | Source-ready Stage 2A PITS Project Workboard route; owner runtime sync and UAT required before public verification. |
| PITS product subdomain work item detail | `https://pits-ng.dmp247.com/projects/<project-id>/work-items/<item-id>` | `PLANNED_NOT_CREATED` | Source-ready Stage 2B PITS Work Item Detail, Dry-run Action Preview and Stage 2E Action Request panel route; owner runtime sync and UAT required before public verification. |
| OIS product subdomain product flow preview | `https://ois-ng.dmp247.com/product-flow` | `PLANNED_NOT_CREATED` | Source-ready Stage 2D localized OIS Product Flow Preview route; owner runtime sync and UAT required before public verification. |
| PITS product subdomain product flow preview | `https://pits-ng.dmp247.com/product-flow` | `PLANNED_NOT_CREATED` | Source-ready Stage 2D localized PITS Product Flow Preview route; owner runtime sync and UAT required before public verification. |
| OIS product subdomain Learning Center | `https://ois-ng.dmp247.com/learning-center` | `PLANNED_NOT_CREATED` | Source-ready Stage 2F OIS Learning Center route; owner runtime sync, migration deploy and UAT required before public verification. |
| OIS Agent Widget on OIS Console | `https://ois-ng.dmp247.com` | `PLANNED_NOT_CREATED` | Source-ready Stage 2F widget shell on OIS Console pages; owner runtime sync and browser/UAT required before public verification. |
| OIS NextGen ecosystem products API | `https://ois-nextgen.abacusai.cloud/platform/ecosystem-products` | `PLANNED_NOT_CREATED` | Source-ready Stage 2F registry endpoint; owner runtime sync required before public verification. |
| OIS NextGen learning APIs | `https://ois-nextgen.abacusai.cloud/platform/learning/<route>` | `PLANNED_NOT_CREATED` | Source-ready Stage 2F learning signal, candidate, policy and center endpoints; owner runtime sync and migration deploy required before public verification. |
| OIS NextGen agent APIs | `https://ois-nextgen.abacusai.cloud/platform/agent/<route>` | `PLANNED_NOT_CREATED` | Source-ready Stage 2F agent chat and learning submission endpoints; owner runtime sync required before public verification. |
| OIS product subdomain Knowledge Fabric | `https://ois-ng.dmp247.com/knowledge-fabric` | `PLANNED_NOT_CREATED` | Source-ready Stage 2G OIS Knowledge Fabric route; owner runtime sync, migration deploy and browser/UAT required before public verification. |
| OIS NextGen knowledge APIs | `https://ois-nextgen.abacusai.cloud/platform/knowledge/<route>` | `PLANNED_NOT_CREATED` | Source-ready Stage 2G knowledge layer, item, evidence, context and KEIHB projection endpoints; owner runtime sync and migration deploy required before public verification. |
| OIS NextGen architecture mindmap API | `https://ois-nextgen.abacusai.cloud/platform/architecture/mindmap` | `PLANNED_NOT_CREATED` | Source-ready Stage 2G architecture mindmap endpoint; owner runtime sync required before public verification. |
| PITS product subdomain runtime | `https://pits-ng.dmp247.com/runtime` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Current verified PITS Runtime Status route through Cloudflare Tunnel. |
| Optional Core API tunnel hostname | `https://api-ng.dmp247.com` | `PLANNED_NOT_CREATED` | Optional later route only; not part of Stage 0V-A. |
| OIS Phase 1 live app shell | `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Do not test or mutate without owner approval. |
| OIS Phase 1 custom domain | `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Do not test or mutate without owner approval. |
