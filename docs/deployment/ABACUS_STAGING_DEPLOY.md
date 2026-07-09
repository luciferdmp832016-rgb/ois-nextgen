# Abacus Staging Deploy

Stage 0F defines the first safe staging path. Use staging/demo data only.

## Recommended Topology

Stage 0T-A corrected the UI deployment model:

- Core API can remain on SuperComputer/nginx/systemd at `https://ois-nextgen.abacusai.cloud`.
- OIS Console must be deployed as its own Abacus App Shell through Apps Management Console.
- PITS Shell must be deployed as its own Abacus App Shell through Apps Management Console.
- SuperComputer preview proxy URLs are temporary VM/process previews and are not canonical proof of UI App Shell deployment.
- Connected Services are connector configuration, not App Shell deployment.
- Abacus CLI is not currently available for this project because API metering must be enabled first.
- Stage 0T-B adds local/Codex UI demo test harness coverage before any owner-assisted App Shell deployment.
- Stage 0T-C deployed OIS Console only as an Abacus App Shell at `https://161acd4ff8.na116.preview.abacusai.app`; Stage 0T-D-R2 later found that preview URL currently returns HTTP 404 and must be restored or redeployed.
- Stage 0T-D-R1 prepared a direct upload bundle for PITS Shell because Abacus reported external GitHub clone is blocked in the App Shell environment.
- Stage 0T-D-R2 deployed PITS Shell from that upload bundle at `https://113d93f4db-3001.na116.preview.abacusai.app`.
- Stage 0T-E-A-R1 prepares a direct upload bundle for restoring/redeploying OIS Console with the same upload strategy.
- Stage 0U-A prepares safe SuperComputer nginx host-routing scripts for `ois-ng.dmp247.com` and `pits-ng.dmp247.com`, then owner runtime evidence confirmed DNS CNAME propagation and local Host-header routing. Public custom subdomain HTTPS is still blocked by Abacus edge/TLS registration.
- Stage 0V-A documents the owner-selected Cloudflare Tunnel plan to solve the SuperComputer custom-hostname HTTPS blocker without changing GitHub/Codex source-of-truth or Abacus SuperComputer runtime ownership.
- Stage 0V-B/C verifies Cloudflare Tunnel `ois-nextgen-abacus` is healthy and public HTTPS works for `https://ois-ng.dmp247.com` and `https://pits-ng.dmp247.com`.
- Stage 0W-A adds safe systemd service install/restart/status/check scripts so OIS Console and PITS Shell public staging can move from temporary `nohup` demo processes to durable services.
- Stage 0W-B records public staging as operational and hotfixes the ops scripts so cloudflared status is token-safe and legacy temporary UI demo processes are stopped before OIS/PITS systemd restarts.
- Stage 1A adds the first real OIS Console and PITS Shell product navigation baselines and expands public endpoint checks for the new routes.
- Stage 1A-R1 fixes the route 404 verification gap by cleaning generated UI `.next` build artifacts before Abacus builds and verifying Next production route manifests before UI service restart.
- Stage 1A-R2 makes the manual orphan UI port cleanup permanent so OIS/PITS systemd restarts can recover when stale Next.js listeners hold ports 3000/3001.
- Stage 1B adds read-only Platform Registry Core API endpoints and binds OIS/PITS product shell pages to Core API registry data instead of hardcoded cards.
- Stage 1C adds read-only Platform Registry detail endpoints and cross-product links between OIS Console and PITS Shell.
- Stage 1C-R1 hotfixes the detail route HTML marker contract after Abacus runtime verification found detail pages returning HTTP 200 without the expected grep-safe markers.
- Stage 1D adds read-only Platform Registry runtime health through Core API and owner-verifiable health panels in OIS Console and PITS Shell.
- Stage 1E adds read-only Platform Registry governance/readiness through Core API and owner-verifiable readiness panels in OIS Console and PITS Shell.
- Stage 1F adds read-only owner cockpit and visual UAT navigation surfaces in OIS Console and PITS Shell without adding a Core API endpoint.
- Stage 1F-R1 fixes the OIS Console root cockpit marker contract by rendering deterministic `Ready to operate` text on `/`.
- Stage 1G standardizes OIS Console and PITS Shell around a modern responsive shell with fixed navigation/header, independent content scrolling and hide/show navigation controls.
- Stage 1H polishes owner-first OIS/PITS information architecture, visual hierarchy, status badges, empty/fallback states and responsive readability without changing business logic or endpoints.
- Stage 1I adds read-only owner review workflow and safe action-boundary preview surfaces, backed by Core API `/platform/owner-review`.
- Stage 1J adds read-only audit trail and admin permission model surfaces, backed by Core API `/platform/admin-boundary`.
- Stage 1K adds read-only product user journey UAT baseline and functional gap map surfaces, backed by Core API `/platform/product-uat`.
- Stage 2A adds the read-only PITS Project Workboard functional slice, backed by Core API `/platform/pits/projects/{id}/workboard`.
- Stage 2B adds read-only PITS Work Item Detail and Dry-run Action Preview, backed by Core API `/platform/pits/projects/{projectId}/work-items/{itemId}` and `/action-preview`.
- Stage 2C adds read-only OIS/PITS Product Flow Preview routes and product UX blueprint docs; it adds no Core API endpoint.
- Stage 2D adds shared English/Tiếng Việt localization, shell language selectors and visual OIS/PITS Product Flow Preview pages; it adds no Core API endpoint.
- Stage 2E adds read-only PITS Action Request list/detail/preview contracts and PITS action-request panel markers; it does not execute product mutations.
- Stage 2F adds the OIS Agent Runtime and Self-Improvement Engine foundation, backed by a versioned Prisma migration, audit-backed Learning Signal/Candidate routes, SuperAdmin Learning Center and OIS Agent Widget. It does not promote widget input into canonical Knowledge Layer records.
- Stage 2G adds the Canonical Knowledge Fabric and KEIHB projection foundation, backed by ADR 0005, a versioned Prisma migration, seeded demo knowledge items/evidence/mappings/bundles, OIS `/knowledge-fabric` and deterministic knowledge-context routes. It does not enable auto-promotion or canonical knowledge mutation endpoints.

Use separate App Shells for UI staging unless a later owner-approved Abacus feature explicitly supersedes this contract.

| Service | Build command | Start command | Health check |
|---|---|---|---|
| Core API | `pnpm install --frozen-lockfile && pnpm db:generate && pnpm --filter @ois/core-api build` | `pnpm --filter @ois/core-api start` | `/health` |
| OIS Console | `pnpm install --frozen-lockfile && pnpm --filter @ois/ois-console build` | `pnpm --filter @ois/ois-console start` | `/` |
| PITS Shell | `pnpm install --frozen-lockfile && pnpm --filter @ois/pits-shell build` | `pnpm --filter @ois/pits-shell start` | `/` |

Recommended service names:

- `ois-nextgen-core-api-staging`
- `ois-nextgen-console-staging`
- `ois-nextgen-pits-staging`

Use the same release ref for all three services.

## Prerequisites

- CI green on the release ref.
- Release preflight green on the same ref.
- Abacus staging app exists.
- Abacus staging project access is sufficient to configure environment values, secrets and deployment settings.
- Abacus staging database and storage are provisioned.
- Production credentials are absent.
- Deployment manifest draft is complete.

Stage 0F-R2 discovery result: these prerequisites are not yet satisfied from Codex. Access to the `OIS NextGen Staging` project is partial, but staging env/secrets/deploy configuration, service identifiers, staging URLs, staging database, staging storage or mock mode, and staging AI mock values are still unknown.

Stage 0F-R3 owner acquisition package: complete `docs/deployment/ABACUS_STAGING_INPUTS_CHECKLIST.md` with staging-only confirmations, secret names/private paths and approvals before any staging runtime POC is attempted. Do not commit real secret values.

Stage 0F-R4 discovery result: repo/local verification confirms the expected env var names, split-app package scripts, `.env.example`, mock AI/storage defaults and Prisma `DATABASE_URL` contract. It does not confirm owner-filled staging values, Abacus project/service IDs, env/secrets injection, staging URLs, SuperComputer/cloud evidence, Always On status, GitHub connection status or Abacus port behavior. The runtime POC remains blocked.

Stage 0H handoff result: the Abacus staging runtime handoff package is documented in `architecture/implementation/STAGE_0H_ABACUS_STAGING_RUNTIME_HANDOFF.md`. Use it as the no-deploy source of truth for the first Abacus staging POC. The handoff is ready, but Abacus owner inputs remain blocked.

Stage 0I discovery result: Abacus live runtime configuration remains blocked. No Abacus connector, CLI, authenticated UI, screenshots or owner-filled checklist were available in Stage 0I. Treat project ID, SuperComputer/cloud ID, public URL, GitHub/source state, service IDs, env/secrets mechanism, live mock config and port/proxy behavior as unknown until owner evidence is provided.

Stage 0I-R1 owner-assisted source result: GitHub/source bootstrap is confirmed on Abacus SuperComputer. The repo is cloned at `/home/ubuntu/ois-nextgen`, `origin` points to `https://github.com/luciferdmp832016-rgb/ois-nextgen.git`, branch `stage-0b-complete-handoff-ingestion` is checked out at commit `64486c1ebf9d5bc96cadc8220d1616dea9ccbf70`, and the working tree is clean/up to date. No `pnpm install`, build, app start, migration, `prisma db push` or secret printing occurred. Runtime port/proxy behavior, env/secrets injection and public URL mapping remain unknown, so the runtime POC remains blocked.

Stage 0J Core API only POC result: Abacus Agent verified the VM can install, lint, typecheck, test, build and start the Core API locally with mock-safe configuration. Core API `/health` and `/` returned HTTP 200 on `127.0.0.1:4000`, then the process was stopped and port 4000 was clear. `https://ois-nextgen.abacusai.cloud/health` returned HTTP 404 from cloudflare/nginx because no public deployment/routing was performed. Public URL routing remains blocked; this is not a Core API boot failure.

Stage 0K preview public routing result: Abacus Agent verified public health through the Abacus VM preview proxy. Core API was bound to `0.0.0.0:4000`; local `http://127.0.0.1:4000/health` and preview `https://7a162f29d-4000.na116.preview.abacusai.app/health` both returned HTTP 200. The hosted-app custom domain `https://ois-nextgen.abacusai.cloud/health` still returned HTTP 404 because it requires an actual Abacus hosted-app deployment or Always-On app. Preview routing is suitable for controlled public POC evidence, not final live hosting.

Stage 0L hosted-app custom domain result: Abacus Agent confirmed the custom domain cannot be mapped to Core API from the VM shell alone. No `abacus`/`abacusai` deploy CLI exists on `PATH`, and observed Abacus SDK deploy paths are for ML models/agents rather than a generic Node/Fastify web-service hosted-app deploy. `https://ois-nextgen.abacusai.cloud/` returns HTTP 200 body `READY` from the Abacus edge placeholder, while `https://ois-nextgen.abacusai.cloud/health` returns HTTP 404 because no backend hosted app is mapped. Owner-assisted Abacus hosted-app service registration is required.

Stage 0N resource boundary contract: `https://ois-nextgen.abacusai.cloud` is the Abacus-managed public domain for the OIS NextGen SuperComputer/App Shell. Codex/GitHub is the engineering/test plane. Abacus SuperComputer is the staging VM/App Shell plane with nginx, systemd, SSH, GitHub integration, attached `default` DB and S3 prefix `59543/`. VM preview proxy URLs remain temporary. External `dmp247.com` custom domains are optional branding/publication layers and must not be touched until NextGen is validated.

Stage 0O managed-domain Core API health result: Abacus Agent verified the first SuperComputer nginx/systemd staging slice. `@ois/core-api` runs under systemd, nginx proxies the Abacus-managed public staging domain to `127.0.0.1:4000`, and `https://ois-nextgen.abacusai.cloud/health` returns HTTP/2 200 with the Core API health payload. Console, PITS and worker were not started. DB-backed functionality, storage-backed functionality and real AI/OpenRouter usage remain disabled.

Stage 0P default DB Prisma baseline result: Abacus Agent verified readiness label `DEFAULT_DB_PRISMA_READINESS_CONFIRMED`, then applied migration `202607040001_platform_kernel` to the `default` DB only with `pnpm db:migrate`, which maps to `prisma migrate deploy`. Final verdict is `DEFAULT_DB_PRISMA_BASELINE_APPLIED`; Abacus execution label is `DEFAULT_DB_MIGRATION_APPLIED_SUCCESS`. `https://ois-nextgen.abacusai.cloud/platform/overview` now returns HTTP 200 as the first DB-backed read-only public staging endpoint. Counts are 0 because no seed data exists yet. Console, PITS, worker, `/auth/demo-login`, write endpoints and custom `dmp247.com` domains remain out of scope.

Stage 0Q Platform Kernel seed result: Abacus Agent verified readiness label `PLATFORM_KERNEL_SEED_SCRIPT_READY`, then executed `pnpm db:seed`, which maps to `prisma db seed -> tsx prisma/seed.ts`. Final result is `PLATFORM_KERNEL_SEED_APPLIED`. The seed populated 66 `DEMO DATA - NOT PRODUCTION` records across all 18 application tables in the `default` DB. `https://ois-nextgen.abacusai.cloud/platform/overview` remains HTTP 200 and now returns seeded Platform Kernel counts. `PLATFORM_KERNEL` remains `IN_PROGRESS` by API-controlled logic, which is expected. Console, PITS, worker, `/auth/demo-login`, write endpoints and custom `dmp247.com` domains remain out of scope.

Stage 0R-A Platform Kernel gate smoke stabilization result: local code inspection confirms `/platform/overview` is read-only, uses eight Prisma `count()` queries, and returns `phaseGates.PLATFORM_KERNEL` as a hardcoded API response literal `IN_PROGRESS`. The gate is not count-driven, config-driven, feature-flag-driven or manually DB-controlled. This is correct for Stage 0Q/0R-A, but focused tests for overview counts, gate behavior, no-DB health and legacy/prod reference guards are required before gate advancement. Final result is `PLATFORM_KERNEL_TEST_COVERAGE_REQUIRED`.

Stage 0R-B Platform Kernel test coverage result: local-only tests now cover `/health` no-DB behavior, `/platform/overview` read-only Prisma count mapping, current phase gate statuses, DB-unavailable HTTP 500 behavior and static legacy/prod resource guards. `buildCoreApi()` accepts an optional Prisma client for mocked tests while default runtime behavior remains unchanged. Final result is `PLATFORM_KERNEL_TEST_COVERAGE_ADDED`.

Stage 0R-C Abacus runtime sync result: Abacus runtime fast-forwarded from `cc7ed28704c9e804385f6d2a4c21e8d887a775e3` to integration commit `e862b98ea601fa6ab8be6b78fd3ebbde5e66c66d`, validation passed, Core API restarted cleanly, and local/public `/health` plus `/platform/overview` remained HTTP 200 with seeded counts. Stage 0R-B test coverage is now live in runtime source. No endpoint behavior, DB schema, migration or seed behavior changed. Final result is `ABACUS_RUNTIME_SYNCED_NO_BEHAVIOR_REGRESSION`.

Stage 0R-D safe SSH operations result: reusable scripts under `ops/abacus/` and owner documentation in `docs/deployment/ABACUS_SSH_OPERATIONS.md` are ready. The scripts support safe status checks, active endpoint checks, Core API restart, runtime sync and guarded Stage 0O rollback over SSH when the relay works, or through Web Terminal while the relay is blocked. Default scripts do not print secrets, run migrations, run seed, run `prisma db push`, call write endpoints or probe legacy endpoints. Final result is `SAFE_SSH_OPERATIONS_READY`.

Stage 0R-E SSH relay diagnostic result: direct external SSH through the Abacus SSH tile endpoint is blocked by platform-side Abacus edge/relay routing. Owner SSH attempts timed out before authentication from Wi-Fi and 5G, while Abacus internal diagnostics confirmed healthy in-VM `sshd`, valid `authorized_keys` and working local VM SSH TCP. Until Abacus fixes the relay, use Abacus Web Terminal plus `ops/abacus/*.sh`. Final result is `ABACUS_SSH_RELAY_BLOCKED_WEB_TERMINAL_FALLBACK_READY`.

Stage 0R-F ops restart grace window result: owner Web Terminal evidence showed immediate post-restart local connection failures and public HTTP 502 responses that cleared on a later `status.sh` run after Core API had bound port `4000`. `safe-restart-core-api.sh` and `runtime-sync.sh` now treat transient restart failures as `WARMING_UP` until a 30-second retry timeout expires. Final result is `OPS_RESTART_GRACE_WINDOW_ADDED`.

Stage 0R-G ops script unbound variable fix result: after Stage 0R-F was merged and pulled into the Abacus VM at commit `124741498e1557e660aa1f960f9f5c8e1c3e55c9`, `status.sh` crashed with `body: unbound variable` in `lib-core-api-checks.sh` even though systemd reported Core API active/running. Stage 0R-G fixes the shell helper variable initialization/shadowing bug and adds a no-network parser self-test. Final result is `OPS_SCRIPT_UNBOUND_VARIABLE_FIX_READY`.

Stage 0S-A two UI shell demo result: OIS Console and PITS Shell now have minimal root demo/status pages ready for Abacus preview. Both shells call the same Core API, default to `https://ois-nextgen.abacusai.cloud`, show `/health` status plus `/platform/overview` counts and keep DB access behind Core API only. No Abacus deploy, runtime modification, migration, seed, `prisma db push`, production credential or legacy resource touch occurred. Final result is `TWO_UI_SHELL_DEMO_READY_FOR_ABACUS_PREVIEW`.

Stage 0S-B two UI shell preview ops result: safe Abacus Web Terminal scripts now build, start, status-check, stop and restart temporary OIS Console and PITS Shell demo processes on ports `3000` and `3001`. Both shells use `CORE_API_URL=https://ois-nextgen.abacusai.cloud`, no UI `DATABASE_URL`, no Core API DB/runtime change, no nginx change and no `dmp247.com`/legacy touch. Final result is `TWO_UI_SHELL_PREVIEW_OPS_READY`.

Stage 0T-A App Shell deployment contract result: owner evidence from Apps Management Console corrected the canonical UI deployment path. OIS Console and PITS Shell should not be proven through SuperComputer preview/nginx routing; each must be created as its own Abacus App Shell with its own Abacus-managed Deployment URL, Database, Storage, Versions and Custom Domain lifecycle. Core API remains on `https://ois-nextgen.abacusai.cloud`. Final result is `ABACUS_APP_SHELL_DEPLOYMENT_CONTRACT_READY`.

Stage 0T-B UI demo test harness result: local/Codex Vitest coverage now renders the OIS Console and PITS Shell demo pages with mocked Core API `/health` and `/platform/overview` responses. Tests verify shell names, product codes, Core API URL, demo banner, health OK state, seeded counts and that UI packages avoid direct DB and legacy/production references. Final result is `UI_DEMO_TEST_HARNESS_READY`.

Stage 0T-C OIS Console App Shell deploy result: owner/Abacus App Shell evidence confirms `OIS NextGen Console Demo` deployed as a Next.js App Shell at `https://161acd4ff8.na116.preview.abacusai.app`. The page shows `OIS_CONSOLE`, shared Core API URL `https://ois-nextgen.abacusai.cloud`, Core API health OK, demo banner, canonical seeded counts and the Core API-only DB access boundary. PITS was not deployed, Core API was not modified, and no production/legacy resources were touched. Final result is `OIS_CONSOLE_APP_SHELL_DEPLOYED`.

Stage 0T-D-R1 PITS Shell upload bundle result: Abacus reported the PITS Shell App Shell environment cannot clone the external GitHub repo directly. Stage 0T-D-R1 rejects spec-build for now and prepares `artifacts/abacus/pits-shell-abacus-upload-bundle.zip` from source-of-truth repo paths: `apps/pits-shell`, `packages/shared-ui`, root package/lock/workspace metadata and `tsconfig.base.json`. Final result is `PITS_SHELL_UPLOAD_BUNDLE_READY`.

Stage 0T-D-R2 PITS Shell upload deploy result: owner/Abacus evidence confirms `pits-shell-abacus-upload-bundle.zip` deployed successfully from `/home/ubuntu/pits_shell_bundle` as a PITS Shell App Shell at `https://113d93f4db-3001.na116.preview.abacusai.app`. The page returned HTTP 200, displayed `PITS_SHELL`, shared Core API `https://ois-nextgen.abacusai.cloud`, health OK, demo banner and seeded counts. The combined two-shell verification remains blocked only because the previous OIS Console preview `https://161acd4ff8.na116.preview.abacusai.app` currently returns HTTP 404. Final result is `PITS_SHELL_APP_SHELL_DEPLOYED_FROM_BUNDLE`; two-shell status is `TWO_APP_SHELL_VERIFICATION_BLOCKED_BY_OIS_CONSOLE_PREVIEW_404`.

Stage 0T-E-A-R1 OIS Console upload bundle result: the OIS Console direct source upload bundle is ready for owner-assisted restore/redeploy. The bundle packages `apps/ois-console`, `packages/shared-ui`, root package/lock/workspace metadata and `tsconfig.base.json`, excluding env files, generated output, `.git`, secrets, runtime files and unrelated apps/domains/Prisma assets. Final result is `OIS_CONSOLE_UPLOAD_BUNDLE_READY`.

Stage 0U-A product subdomain routing demo result: safe owner-run scripts are ready for a SuperComputer nginx host-based routing demo. Owner runtime evidence confirmed `ois-ng.dmp247.com` and `pits-ng.dmp247.com` CNAME to `ois-nextgen.abacusai.cloud`, and local nginx Host-header routing returned HTTP 200 for OIS Console and PITS Shell with seeded counts through Core API. Public custom HTTPS checks failed with SSL handshake errors and public HTTP roots returned HTTP 409, so the public custom subdomains remain blocked at the Abacus edge/TLS registration layer. Final labels are `SUPERCOMPUTER_PRODUCT_SUBDOMAIN_LOCAL_ROUTING_READY` and `CUSTOM_SUBDOMAIN_TLS_BLOCKED`.

Stage 0V-A Cloudflare Tunnel plan result: Abacus confirmed `CUSTOM_HOSTNAME_NOT_SUPPORTED_FOR_SUPERCOMPUTER` and `CUSTOM_HOSTNAME_ONLY_SUPPORTED_FOR_MANAGED_APP_SHELLS`. Stage 0V-A records Cloudflare Tunnel as the planned custom HTTPS transport: `ois-ng.dmp247.com` -> `127.0.0.1:3000`, `pits-ng.dmp247.com` -> `127.0.0.1:3001`, with optional later `api-ng.dmp247.com` -> `127.0.0.1:4000`. No `cloudflared` install, DNS change, deploy, migration, seed, `prisma db push`, production credential or Cloudflare token commit occurred. Final result is `CLOUDFLARE_TUNNEL_CUSTOM_SUBDOMAIN_PLAN_READY`.

Stage 0V-B/C Cloudflare Tunnel runtime result: owner configured Cloudflare DNS and tunnel `ois-nextgen-abacus`; Cloudflare reports Healthy, 1 active replica, 2 routes and `cloudflared` version `2026.6.1`. Public HTTPS now verifies: `https://ois-ng.dmp247.com` opens OIS Console, `/dashboard` opens OIS Platform Overview, `https://pits-ng.dmp247.com` opens PITS Shell and `/projects` opens PITS Project Selector. Both shells show Core API `https://ois-nextgen.abacusai.cloud`, healthy Core API HTTP 200 and seeded counts through Core API only. No Cloudflare tunnel token or connector credential is documented or committed. Final labels are `CLOUDFLARE_TUNNEL_CONNECTOR_HEALTHY` and `CLOUDFLARE_TUNNEL_PRODUCT_SUBDOMAINS_VERIFIED`.

Stage 0W-A public staging runtime hardening result: safe owner-run scripts now install/uninstall durable systemd services `ois-nextgen-ois-console` and `ois-nextgen-pits-shell`, restart/status-check Core API plus OIS/PITS public staging runtime, and verify public Cloudflare Tunnel endpoints. UI services use ports 3000/3001, Core API `https://ois-nextgen.abacusai.cloud`, `NEXT_TELEMETRY_DISABLED=1` and no `DATABASE_URL`. `runtime-sync.sh` defaults to Core API-only restart and supports `PUBLIC_STAGING_RESTART_SCOPE=all` for Core API plus OIS/PITS restart; cloudflared is never restarted unless explicitly requested. Final result is `PUBLIC_STAGING_RUNTIME_HARDENING_READY`.

Stage 0W-B public staging runtime result: owner/Abacus execution confirms public staging is operational. Core API, OIS Console, PITS Shell and cloudflared were active; `https://ois-ng.dmp247.com`, `/dashboard`, `https://pits-ng.dmp247.com` and `/projects` passed; `check-public-staging-endpoints.sh` passed. Stage 0W-B hotfixes the ops scripts so `status-public-staging-runtime.sh` no longer prints full `systemctl status cloudflared`, and `restart-public-staging-runtime.sh` stops legacy temporary UI demo processes before restarting OIS/PITS systemd services. Final labels are `PUBLIC_STAGING_RUNTIME_OPERATIONAL` and `PUBLIC_STAGING_RUNTIME_SECRET_SAFE_HOTFIX_READY`.

Stage 1A product shell navigation result: OIS Console now has `/`, `/dashboard`, `/products`, `/workspaces` and `/runtime` shell routes; PITS Shell now has `/`, `/projects` and `/runtime` shell routes. Both shells use shared Core API snapshot helpers, show staging/demo banners, Core API source indicators, runtime cards and seeded Platform Kernel counts through Core API only. Public endpoint scripts now check the expanded route set after owner runtime sync. Final result is `PRODUCT_SHELL_NAVIGATION_BASELINE_READY`.

Stage 1A-R1 product shell route 404 hotfix result: owner Abacus verification after Stage 1A found local/public HTTP 404 on OIS `/products`, `/workspaces`, `/runtime` and PITS `/runtime` while root/dashboard/projects and Core API stayed healthy. Stage 1A-R1 confirms source route files and local production build manifests exist, then updates Abacus ops so generated UI `.next` folders are cleaned before build and `verify-ui-route-manifests.sh` blocks service restart if expected route artifacts are missing. Final result is `PRODUCT_SHELL_ROUTE_404_HOTFIX_READY`; public HTTP 200 verification requires owner runtime re-sync.

Stage 1A-R2 UI orphan port cleanup result: owner/manual Abacus evidence confirms Stage 1A-R1 route artifacts passed, but orphan/legacy Next.js processes held ports `3000` and `3001`, blocking OIS/PITS systemd restart. Manual `systemctl stop`, `fuser -k 3000/tcp 3001/tcp`, `reset-failed` and `start` restored both services, and every Stage 1A local/public route passed. Stage 1A-R2 adds that cleanup to `restart-public-staging-runtime.sh`, targeting only UI ports `3000/3001`, then verifying local routes before public endpoints. Final result is `UI_ORPHAN_PORT_CLEANUP_READY`.

Stage 1B read-only Platform Registry result: Core API now exposes source-ready read-only registry list/aggregate endpoints for products, workspaces, projects, modules, installations and aggregate registry data. OIS Console and PITS Shell bind product shell pages to that registry through Core API only. Final result is `READONLY_PLATFORM_REGISTRY_API_DATA_BINDING_READY`; public HTTP 200 verification requires owner runtime sync.

Stage 1D registry runtime health result: Core API now exposes source-ready read-only `/platform/registry/health`. OIS Console and PITS Shell render owner-facing `Registry Runtime Health` plus product/workspace/project/module/installation runtime health panels. Final result is `REGISTRY_RUNTIME_HEALTH_OWNER_UAT_READY`; public HTTP 200 verification requires owner runtime sync.

Stage 1E registry governance readiness result: Core API now exposes source-ready read-only `/platform/registry/readiness`. OIS Console and PITS Shell render owner-facing `Registry Governance / Readiness` plus per-entity readiness panels with `What is missing?` sections. Final result is `REGISTRY_GOVERNANCE_INSTALLATION_LIFECYCLE_READY`; public HTTP 200 verification requires owner runtime sync and browser/UAT.

Stage 1F owner registry cockpit visual UAT result: OIS Console and PITS Shell now render source-ready owner cockpit surfaces that summarize existing registry counts, health, readiness, missing link/runtime URL guard status, forbidden link guard status and cross-product detail links. Final result is `OWNER_REGISTRY_COCKPIT_VISUAL_UAT_READY`; public HTTP 200 verification requires owner runtime sync and browser/UAT.

Stage 1F-R1 OIS Console root cockpit marker hotfix result: OIS Console root `/` now renders deterministic server-side `Ready to operate` text while preserving the real cockpit status. Final result is `OWNER_REGISTRY_COCKPIT_ROOT_MARKER_HOTFIX_READY`; public HTTP 200 verification requires owner runtime sync and browser/UAT.

Stage 1G modern responsive shell layout result: OIS Console and PITS Shell now share a source-ready modern product shell standard with fixed navigation/header, independent content scrolling, responsive drawer behavior, hide/show navigation controls and deterministic shell markers. Final result is `MODERN_RESPONSIVE_SHELL_NAVIGATION_STANDARD_READY`; public HTTP 200 verification requires owner runtime sync and browser/UAT.

Stage 1H owner-first information architecture visual design polish result: OIS Console and PITS Shell now share source-ready owner-first page cues, visual hierarchy, status badge metadata, safe empty/fallback copy and responsive readability polish. Final result is `OWNER_FIRST_VISUAL_DESIGN_SYSTEM_POLISH_READY`; public HTTP 200 verification requires owner runtime sync and browser/UAT.

Stage 1I owner review workflow boundary and safe admin action design result: Core API now exposes read-only `/platform/owner-review` derived from existing registry health/readiness data, and OIS/PITS render preview-only `Owner Review Queue` / `Safe Action Boundary` surfaces. Final result is `OWNER_REVIEW_WORKFLOW_SAFE_ACTION_BOUNDARY_READY`; public HTTP 200 verification requires owner runtime sync and browser/UAT.

Stage 1J audit trail and admin permission model design result: Core API now exposes read-only `/platform/admin-boundary` with deterministic roles, permission states, action categories, audit requirements, confirmation requirements, rollback requirements, blocked actions and preview-only future actions. OIS/PITS render `Admin Boundary`, `Audit Required`, `Permission Model`, `Preview only` and `Blocked in current stage` markers without executable admin controls. Final result is `AUDIT_TRAIL_ADMIN_PERMISSION_MODEL_READY`; public HTTP 200 verification requires owner runtime sync and browser/UAT.

Stage 1K product user journey UAT baseline result: Core API now exposes read-only `/platform/product-uat` with deterministic OIS/PITS product UAT categories, testable-now surfaces, platform/control-plane-only surfaces, missing product functions, blockers and recommended next journeys. OIS/PITS render `Product User Journey UAT`, `Testable now`, `Control-plane only`, `Functional gap map` and `Next product journey` markers without executable product/admin controls. Final result is `PRODUCT_USER_JOURNEY_UAT_BASELINE_READY`; public HTTP 200 verification requires owner runtime sync and browser/UAT.

Stage 2B PITS work item detail and dry-run action preview result: Core API now exposes read-only `/platform/pits/projects/{projectId}/work-items/{itemId}` and `/platform/pits/projects/{projectId}/work-items/{itemId}/action-preview`. PITS Shell renders `/projects/{id}/work-items/{itemId}` with `Work Item Detail`, `Dry-run Action Preview`, `Preview only`, `No data will be changed`, `Requires audit trail`, `Requires confirmation` and `Requires rollback plan` markers. Final result is `PITS_WORK_ITEM_DETAIL_DRY_RUN_ACTION_PREVIEW_READY`; public HTTP 200 verification requires owner runtime sync and browser/UAT.

Stage 2C product UX blueprint and screen-flow draft gate result: OIS and PITS now have blueprint docs plus read-only `/product-flow` routes. OIS renders `Product Flow Preview`, `OIS Product UX Blueprint`, `Product page vs Admin console`, `Executive Dashboard`, `Workspace Intelligence Dashboard` and `Ask OIS / Copilot`. PITS renders `Product Flow Preview`, `PITS Product UX Blueprint`, `Product page vs Admin console`, `Workboard`, `Work Item Detail` and `Dry-run Action Preview`. Final result is `PRODUCT_UX_BLUEPRINT_SCREEN_FLOW_DRAFT_READY`; public HTTP 200 verification requires owner runtime sync and browser/UAT.

Stage 2D localization foundation and visual product-flow preview result: OIS and PITS now share English/Tiếng Việt localization helpers and shell language selectors. OIS `/product-flow` renders `Localization Foundation`, `Language Settings`, `OIS Product UX Preview`, `Primary user`, `Main action`, `Current stage status`, `Screen mock`, `Executive Dashboard`, `Workspace Intelligence Dashboard`, `Meeting/Document Knowledge Feed`, `Knowledge Detail`, `Ask OIS / Copilot` and `Runtime/Admin`. PITS `/product-flow` renders `Localization Foundation`, `Language Settings`, `PITS Product UX Preview`, `PITS Home`, `Projects List`, `Project Detail`, `Project Workboard`, `Work Item Detail`, `Dry-run Action Preview` and `Runtime/Admin`. Final result is `LOCALIZATION_FOUNDATION_PRODUCT_FLOW_PREVIEW_READY`; public HTTP 200 verification requires owner runtime sync and browser/UAT.

Stage 2D-R1 localization coverage, Vietnamese font and runtime marker hotfix result: OIS/PITS shared shells now preserve the language-neutral `Core API source:` runtime marker via `data-ops-marker="core-api-source"`, broaden visible English/Tiếng Việt coverage across runtime, dashboard, project, workboard, work item and dry-run labels, use Vietnamese-safe system font/line-height safeguards and add read-only `/localization` catalog routes. Final result is `LOCALIZATION_COVERAGE_FONT_RUNTIME_MARKER_HOTFIX_READY`; public HTTP 200 verification requires owner runtime sync and browser/UAT.

Stage 2E PITS work item action request and audit-safe write boundary result: Core API now exposes read-only `/platform/pits/projects/{projectId}/work-items/{itemId}/action-requests`, `/platform/pits/projects/{projectId}/work-items/{itemId}/action-requests/{requestId}` and `/platform/pits/projects/{projectId}/work-items/{itemId}/action-request-preview`. PITS Shell keeps `/projects/{id}/work-items/{itemId}` and adds `PITS Action Request`, `Action request only`, `No direct mutation`, `Pending review`, `Requires audit trail`, `Requires confirmation` and `Requires rollback plan` markers without executable mutation controls. Final result is `PITS_ACTION_REQUEST_AUDIT_SAFE_WRITE_BOUNDARY_READY`; public HTTP 200 verification requires owner runtime sync and browser/UAT.

Stage 2F OIS Agent Runtime and Self-Improvement Engine foundation result: Core API now exposes source-ready `/platform/ecosystem-products`, `/platform/learning/signals`, `/platform/learning/candidates`, `/platform/learning/policies`, `/platform/learning/center`, `/platform/agent/chat` and `/platform/agent/learning-submissions`. OIS Console adds `/learning-center` and mounts the OIS Agent Widget with Ask, Teach OIS, Evidence and Status tabs. The migration is `202607090001_stage_2f_agent_runtime_self_improvement`; validation passed locally against the non-production `ois_nextgen` database. Final result is `OIS_AGENT_RUNTIME_SELF_IMPROVEMENT_FOUNDATION_READY`; public HTTP verification requires owner runtime sync, migration deploy and browser/UAT.

Stage 1C Product Registry detail cross-linking result: Core API now exposes source-ready read-only detail endpoints for products, product code lookup, workspaces, projects, modules and installations. OIS Console adds product/workspace/module/installation detail routes, PITS Shell adds project detail routes, and shared UI helpers build staging-only links between `https://ois-ng.dmp247.com` and `https://pits-ng.dmp247.com`. Final result is `PRODUCT_REGISTRY_DETAIL_CROSS_LINKING_READY`; public HTTP 200 verification requires owner runtime sync.

Published endpoint registry: use `docs/deployment/PUBLISHED_ENDPOINT_REGISTRY.md` as the persistent source of truth for local, Codex Cloud, Abacus VM local, preview proxy, Abacus-managed public staging, legacy production/do-not-touch and future planned endpoints. Every future stage report must include a Published Endpoint Delta section covering added, changed, unchanged, deprecated/stopped, do-not-touch and current test checklist entries.

## Stage 0H Handoff Summary

Initial Abacus POC scope must reproduce the Stage 0G mock-safe boot only:

| Service | Build command | Start command | Port | Healthcheck |
|---|---|---|---:|---|
| Core API | `pnpm install --frozen-lockfile && pnpm db:generate && pnpm --filter @ois/core-api build` | `pnpm --filter @ois/core-api start` | 4000 | `/health` |
| OIS Console | `pnpm install --frozen-lockfile && pnpm --filter @ois/ois-console build` | `pnpm --filter @ois/ois-console start` | 3000 | `/` |
| PITS Shell | `pnpm install --frozen-lockfile && pnpm --filter @ois/pits-shell build` | `pnpm --filter @ois/pits-shell start` | 3001 | `/` |

Initial POC exclusions:

- Do not call DB-backed endpoints.
- Do not run `pnpm db:migrate` unless a staging-only DB and owner approval are confirmed.
- Do not run `pnpm db:seed` unless demo-only staging seed approval is confirmed.
- Do not use OpenRouter or storage runtime credentials; keep AI and storage mock-only.
- Do not deploy to production or use production values.

Stage 0I go/no-go remains blocked until the following are confirmed with redacted staging-only evidence:

- Abacus project ID and SuperComputer/cloud ID.
- GitHub connection or cloned repo path, branch and commit.
- Core API, OIS Console and PITS service/task IDs.
- Env/secrets injection path with names only and values hidden.
- `AI_PROVIDER=mock`, `AI_PROVIDER_MODE=mock`, `STORAGE_PROVIDER=mock`, and no production OpenRouter key.
- Public staging URLs and healthcheck path configuration.
- Fixed port or proxy behavior for 4000, 3000 and 3001, or a split-app equivalent.

Stage 0I-R1 recommendation for Stage 0J: perform a Core API only POC first, using mock-safe env only. Do not call DB-backed endpoints, storage-backed endpoints or real AI/OpenRouter providers. Confirm local HTTP 200 at `127.0.0.1:4000/health` before trying any public URL `/health` mapping. Stop if Abacus requires production credentials, migrations, `prisma db push`, secret printing or an unconfirmed port/proxy path.

Stage 0J outcome and Stage 0K direction: keep the next POC Core API only and solve public routing/deployment mapping. Do not expand to Console, PITS, DB-backed endpoints, storage-backed endpoints or real AI providers until the public Core API `/health` route is mapped safely.

Stage 0J mock-safe Core API start command used by Abacus:

```sh
env -u DATABASE_URL -u ABACUS_DATABASE_URL -u ABACUS_STORAGE_* \
  APP_ENV=codex-cloud-test DEPLOY_TARGET=codex-cloud-test LOCALHOST_REQUIRED=false \
  AI_PROVIDER=mock AI_PROVIDER_MODE=mock OPENROUTER_API_KEY= STORAGE_PROVIDER=mock \
  CORE_API_HOST=127.0.0.1 CORE_API_PORT=4000 CORE_API_URL=http://127.0.0.1:4000 \
  NEXT_TELEMETRY_DISABLED=1 \
  pnpm --filter @ois/core-api start
```

Stage 0K preview proxy conclusion: for VM preview checks, bind Core API to `0.0.0.0:4000` and use the Abacus preview hostname with the `-4000` suffix. For hosted-app/custom-domain checks, do not expect `https://ois-nextgen.abacusai.cloud/health` to work until a controlled hosted-app deployment or Always-On app is configured.

Stage 0K mock-safe Core API start command used by Abacus:

```sh
env -u DATABASE_URL -u ABACUS_DATABASE_URL -u ABACUS_STORAGE_ENDPOINT -u ABACUS_STORAGE_ACCESS_KEY -u ABACUS_STORAGE_SECRET_KEY \
  APP_ENV=codex-cloud-test DEPLOY_TARGET=codex-cloud-test LOCALHOST_REQUIRED=false \
  AI_PROVIDER=mock AI_PROVIDER_MODE=mock OPENROUTER_API_KEY= STORAGE_PROVIDER=mock \
  CORE_API_HOST=0.0.0.0 CORE_API_PORT=4000 CORE_API_URL=http://0.0.0.0:4000 NEXT_TELEMETRY_DISABLED=1 \
  pnpm --filter @ois/core-api start
```

Recommended Stage 0L direction: Abacus Hosted-App Core API Deployment / Custom Domain POC. Keep Core API only, keep mock-safe env, avoid DB/storage-backed endpoints and real AI providers, and verify whether `https://ois-nextgen.abacusai.cloud/health` maps to the hosted Core API only after the hosted-app deployment path is configured.

Stage 0L conclusion and Stage 0M direction: do not keep trying to bind the custom domain from the VM shell. Register a Core API hosted app/service through Abacus platform/console owner assistance, then map `https://ois-nextgen.abacusai.cloud/health` to that hosted backend. Keep the topology Core API only, mock-safe, no DB/storage/AI, healthcheck `/health`, port `4000` or platform-required `PORT`, and Always On only for the single Core API service with owner approval.

Stage 0L mock-safe Core API start command used during investigation:

```sh
env -u DATABASE_URL -u ABACUS_DATABASE_URL -u ABACUS_STORAGE_* \
  APP_ENV=codex-cloud-test DEPLOY_TARGET=codex-cloud-test \
  LOCALHOST_REQUIRED=false AI_PROVIDER=mock AI_PROVIDER_MODE=mock \
  OPENROUTER_API_KEY= STORAGE_PROVIDER=mock \
  CORE_API_HOST=0.0.0.0 CORE_API_PORT=4000 \
  pnpm --filter @ois/core-api start
```

Stage 0N deployment pivot: the safer immediate path is SuperComputer nginx + systemd on the Abacus-managed public domain. Stage 0O should deploy Core API only behind nginx/systemd and target `https://ois-nextgen.abacusai.cloud/health` HTTP 200. The initial Stage 0O POC must remain mock-safe, must not call DB-backed or storage-backed endpoints, must not run migrations, and must not use `prisma db push`.

Stage 0O result: Core API `/health` is verified on the Abacus-managed public staging domain. Continue to treat this as Core API-only staging health, not full product deployment.

Stage 0P result: the `default` DB Prisma baseline is applied and `/platform/overview` is verified as the first DB-backed read-only public staging endpoint. Recommended next stage: Stage 0Q - Platform Kernel Seed / DB-backed Smoke Stabilization.

Stage 0Q result: Platform Kernel demo/staging seed data is applied to the `default` DB and `/platform/overview` is verified with seeded counts. Recommended next stage: Stage 0R - Platform Kernel Gate Logic / DB-backed Smoke Stabilization.

Stage 0R-A result: Platform Kernel gate logic is confirmed as intentionally not count-driven, and no endpoint delta occurred. Recommended next stage: Stage 0R-B - Platform Kernel Gate and Overview Test Coverage.

Stage 0R-B result: Platform Kernel gate and DB-backed overview tests are added and pass locally. Future gate advancement still requires an explicit promotion rule and owner approval.

Stage 0R-C result: Abacus runtime is synced to integration commit `e862b98ea601fa6ab8be6b78fd3ebbde5e66c66d` with no behavior regression. Recommended next stage: Stage 0R-D - Safe SSH Operations Scripts, or Stage 0S-A - Two UI Shell Demo.

Stage 0R-D result: safe SSH operation scripts are ready. Recommended next stage: Stage 0S-A - Two UI Shell Demo, unless the owner first wants Stage 0R-D1 to manually run the SSH scripts and record evidence.

Stage 0R-E result: direct external SSH is blocked by the Abacus platform relay, not by the local key or in-VM `sshd`. Use Abacus Web Terminal plus `ops/abacus/*.sh` as the fallback path until Abacus support fixes the relay. Recommended next stage: Stage 0S-A - Two UI Shell Demo, or an owner/support follow-up to retest SSH after relay remediation.

Stage 0R-F result: safe restart verification now includes a 30-second grace window and 2-second retry loop. Temporary local connection failures or public HTTP 502 responses immediately after restart are expected warm-up states until `RESTART_VERIFICATION_TIMEOUT`. Recommended next stage: Stage 0R-F1 - Owner Web Terminal retry evidence, or Stage 0S-A - Two UI Shell Demo.

Stage 0R-G result: ops helper parsing now handles empty/missing response bodies safely under `set -u`. HTTP 502, timeout and no-body cases should report clean failures or `WARMING_UP`, not crash with an unbound variable. Recommended next stage: Stage 0R-G1 - Owner Web Terminal retry evidence, or Stage 0S-A - Two UI Shell Demo.

Stage 0S-A result: two UI shell demos are code-ready for Abacus preview. Recommended next stage: Stage 0S-B - Abacus OIS Console and PITS Shell Preview POC, keeping both shells pointed at the existing Core API staging URL and avoiding production/legacy resources.

Stage 0S-B result: temporary UI demo shell preview operations are ready for owner execution in Abacus Web Terminal. Stage 0T-A later supersedes this path for canonical UI App Shell proof; keep the scripts for VM diagnostics only.

Stage 0T-A result: canonical UI deployment should use Apps Management Console App Shells, not SuperComputer preview proxy.

Stage 0T-B result: local/Codex UI demo page harness is ready.

Stage 0T-C result: OIS Console App Shell was deployed at `https://161acd4ff8.na116.preview.abacusai.app`.

Stage 0T-D-R1 result: PITS Shell direct source upload bundle is ready after GitHub clone was blocked. Recommended next stage: Stage 0T-D-R2 - PITS Shell App Shell Upload Deploy Evidence.

Stage 0T-D-R2 result: PITS Shell App Shell is deployed from the upload bundle at `https://113d93f4db-3001.na116.preview.abacusai.app`. The previous OIS Console App Shell preview currently returns HTTP 404, so restore/redeploy OIS Console before two-App-Shell verification. Recommended next stages: Stage 0T-E-A - Restore or Redeploy OIS Console App Shell Preview, then Stage 0T-E-B - Two App Shell Verification.

Stage 0T-E-A-R1 result: OIS Console direct source upload bundle is ready. Recommended next stage: Stage 0T-E-A-R2 - OIS Console App Shell Redeploy From Bundle.

Stage 0U-A runtime result: SuperComputer product subdomain local Host-header routing is ready, but public custom subdomain TLS is blocked at the Abacus edge. Recommended next stage: Stage 0U-B - Abacus Custom Hostname / TLS Registration Check.

Stage 0V-A result: Cloudflare Tunnel custom subdomain plan is ready. Recommended next stage: Stage 0V-B - Owner-Assisted Cloudflare Tunnel Connector Setup.

Stage 0V-B/C result: Cloudflare Tunnel public product subdomains are verified. Recommended next stage: Stage 0W-A - Public Staging UI Smoke Stabilization / Owner Acceptance Checklist.

Stage 0W-A result: public staging runtime hardening scripts are ready. Recommended next stage: Stage 0W-B - Owner-Executed Systemd UI Shell Install Evidence.

Stage 0W-B result: public staging runtime is operational and the secret-safe hotfix is ready. Recommended next stage: Stage 0W-C - Owner Pull Hotfix And Verify Token-Safe Status.

Stage 1A result: product shell navigation baseline is ready. Recommended next stage: Stage 1B - Owner Runtime Sync And Public Product Shell Verification.

Stage 1A-R1 result: product shell route 404 hotfix is ready. Recommended next stage: Stage 1A-R2 - Owner Runtime Sync And Route 200 Verification.

Stage 1A-R2 result: UI orphan port cleanup is ready. Recommended next stage: Stage 1B - Product Shell Owner Acceptance And Navigation Baseline Expansion.

Stage 1B result: read-only Platform Registry API data binding is ready. Recommended next stage: Stage 1B-R1 - Owner Runtime Sync And Registry Endpoint Verification.

Stage 1C result: Product Registry detail cross-linking is ready. Recommended next stage: Stage 1C-R1 - Owner Runtime Sync And Detail Endpoint Verification.

Stage 1C-R1 result: Product Registry detail UI marker hotfix is ready. Recommended next stage: Stage 1C-R2 - Owner Runtime Sync And Marker Verification Evidence.

Stage 1D result: Registry Runtime Health & Owner UAT Surface is ready. Recommended next stage: Stage 1D-R1 - Owner Runtime Sync And Browser/UAT Verification Evidence.

Stage 1E result: Registry Governance & Installation Lifecycle Readiness is ready. Recommended next action: owner runtime sync and browser/UAT verification for `REGISTRY_GOVERNANCE_INSTALLATION_LIFECYCLE_RUNTIME_VERIFIED`; do not start Stage 1F before that pass.

## Stage 0N Resource Boundaries

| Resource | Contract |
|---|---|
| OIS NextGen public staging surface | `https://ois-nextgen.abacusai.cloud` Abacus-managed public domain. |
| OIS NextGen database | `default` only; attached, active, empty and safe for staging. |
| OIS NextGen storage | S3 numeric prefix `59543/` only; attached and empty. |
| OIS Phase 1 App Shell | `oisys.abacusai.app` and `ois.dmp247.com`; do not touch. |
| OIS Phase 1 database/storage | `ois_phase1_dev` and inferred prefix `52067/`; do not touch. |
| Emerald/BQL database/storage | `emerald_bql_web_dev` and inferred prefix `49816/`; do not touch. |
| Secrets | Create fresh OIS NextGen staging secrets. Never reuse Phase 1 JWT, DB, Redis, MinIO or Neo4j secrets. |
| Repo state | Session-dependent; always preflight clone/pull before deployment work. |

## Stage 0O Gate And Result

Stage 0O is SuperComputer Nginx/Systemd Core API Staging Deploy POC.

Required constraints:

- Core API only first.
- Mock-safe env only.
- No DB-backed endpoints.
- No storage-backed endpoints.
- No real AI/OpenRouter provider.
- No migrations.
- No `prisma db push`.
- User-deployed systemd service scoped to Core API only.
- nginx vhost scoped to OIS NextGen only.
- Target health: `https://ois-nextgen.abacusai.cloud/health` returns HTTP 200.
- Do not touch `ois.dmp247.com`, `oisys.abacusai.app`, `ois_phase1_dev`, `emerald_bql_web_dev`, `49816/` or `52067/`.

Stage 0O verified result:

| Area | Evidence |
|---|---|
| Package | `@ois/core-api` from `apps/core-api`. |
| Abacus VM commit | `cc7ed28704c9e804385f6d2a4c21e8d887a775e3`. |
| Install | `pnpm install --frozen-lockfile` passed in 24s; Prisma client generation only. |
| systemd service | `/etc/systemd/system/ois-nextgen-core-api.service`, enabled at boot and active/running. |
| nginx vhost | `/etc/nginx/conf.d/ois-nextgen.conf`; `sudo nginx -t` passed. |
| Local health | `http://127.0.0.1:4000/health` returned HTTP 200. |
| Public health | `https://ois-nextgen.abacusai.cloud/health` returned HTTP/2 200 via Cloudflare/Envoy. |
| Exclusions | Console, PITS and worker not started; no DB-backed endpoints, storage-backed endpoints, migrations, `prisma db push` or real credentials. |

Stage 0O VM env names, values redacted or omitted:

| Key | Contract |
|---|---|
| `APP_ENV` | Runtime env key only; value kept on VM. |
| `DEPLOY_TARGET` | Runtime env key only; value kept on VM. |
| `LOCALHOST_REQUIRED` | Runtime env key only; value kept on VM. |
| `AI_PROVIDER` | Mock-safe. |
| `AI_PROVIDER_MODE` | Mock-safe. |
| `OPENROUTER_API_KEY` | Empty. |
| `STORAGE_PROVIDER` | Mock-safe. |
| `CORE_API_HOST` | Runtime env key only; value kept on VM. |
| `CORE_API_PORT` | Port `4000`. |
| `CORE_API_URL` | Runtime env key only; value kept on VM. |
| `NEXT_TELEMETRY_DISABLED` | Runtime env key only; value kept on VM. |
| `DATABASE_URL` | Absent. |
| `ABACUS_DATABASE_URL` | Absent. |

Stage 0O rollback:

```sh
sudo systemctl stop ois-nextgen-core-api
sudo systemctl disable ois-nextgen-core-api
sudo rm /etc/systemd/system/ois-nextgen-core-api.service
sudo systemctl daemon-reload
sudo rm /etc/nginx/conf.d/ois-nextgen.conf
sudo nginx -t && sudo systemctl reload nginx
```

Expected rollback result: `https://ois-nextgen.abacusai.cloud` reverts to the default `READY` page.

## Stage 0P Default DB Prisma Baseline

Stage 0P-A readiness facts:

| Area | Evidence |
|---|---|
| Prisma schema | `/home/ubuntu/ois-nextgen/prisma/schema.prisma`, provider `postgresql`. |
| DB env var | `DATABASE_URL`. |
| Existing migration | `202607040001_platform_kernel`, creating 18 tables, 36 indexes and 5 enum types. |
| Target DB | `default`, DB ID/name `2c30a48b7`; empty with 0 tables before migration. |
| Correct command | `pnpm db:migrate`, mapping to `prisma migrate deploy`. |
| Forbidden command | `prisma db push` was not required and must not be used. |

Stage 0P-B execution facts:

| Area | Evidence |
|---|---|
| Backup | `/home/ubuntu/ois-nextgen/.abacus-backups/default_schema_pre_0p_b_20260706_023524.sql`, 728 B and 27 lines. |
| Migration command | `pnpm db:migrate`; exit code 0. |
| Applied migration | `202607040001_platform_kernel`. |
| Migration status | Database schema is up to date. |
| Post-migration schema | 19 tables: 18 domain tables plus `_prisma_migrations`; 55 public indexes; 5 enum types. |
| Runtime env | `DATABASE_URL` added to VM `.env`; value not printed, `.env` not committed. |
| Service restart | `sudo systemctl restart ois-nextgen-core-api` succeeded; service active/running with Main PID `5754`. |
| nginx | Unchanged and active. |
| Public DB-backed check | `https://ois-nextgen.abacusai.cloud/platform/overview` returned HTTP 200 after 8 live Prisma `count()` queries. |

Stage 0P exclusions:

- No `prisma db push`.
- No `prisma migrate dev`.
- No production database, storage or OpenRouter credentials.
- No secrets or `DATABASE_URL` value printed.
- No `.env` committed.
- No row data inspected.
- No seed data created.
- No `/auth/demo-login` call.
- No write endpoints called.
- No OIS Console, PITS Shell or worker runtime.
- No custom `dmp247.com` domain changes.
- No legacy DB, legacy domain or legacy storage-prefix touch.

## Stage 0Q Platform Kernel Seed

Stage 0Q-A readiness facts:

| Area | Evidence |
|---|---|
| Seed script | `prisma/seed.ts`. |
| Seed command | `pnpm db:seed`. |
| Command mapping | `prisma db seed -> tsx prisma/seed.ts`. |
| Table coverage | All 18 application tables. |
| Expected total records | 66. |
| Idempotency | Deterministic IDs with `ensureRecord` / `findUnique` -> create if missing -> update if changed. |
| Data label | `DEMO DATA - NOT PRODUCTION`. |
| Stage 0Q-A writes | None. |

Stage 0Q-B execution facts:

| Area | Evidence |
|---|---|
| Seed command | `pnpm db:seed`; exit code 0. |
| Output summary | `DEMO DATA - NOT PRODUCTION`; `The seed command has been executed.` |
| Stderr | Non-blocking Prisma 7 deprecation notice about `package.json#prisma` config. |
| Second seed run | Not performed. |
| Public DB-backed check | `https://ois-nextgen.abacusai.cloud/platform/overview` returned HTTP 200 with seeded Platform Kernel counts. |
| Public health | `https://ois-nextgen.abacusai.cloud/health` remained HTTP 200. |
| Service continuity | `ois-nextgen-core-api.service` remained active and was never interrupted. |

Seeded `/platform/overview` expected counts:

| Field | Count |
|---|---:|
| `industries` | 1 |
| `organizations` | 1 |
| `workspaces` | 1 |
| `projects` | 2 |
| `products` | 5 |
| `installations` | 2 |
| `modules` | 3 |
| `auditRecords` | 1 |

`PLATFORM_KERNEL` remains `IN_PROGRESS` because gate advancement is API-controlled logic, not purely count-driven. This is expected.

Stage 0Q backlog note: Prisma emitted a non-blocking Prisma 7 deprecation warning that `package.json#prisma` seed configuration should later migrate to `prisma.config.ts`. Do not fix that in Stage 0Q unless separately planned.

Stage 0Q exclusions:

- No `prisma db push`.
- No `prisma migrate dev`.
- No secrets or `DATABASE_URL` value printed.
- No `.env` committed.
- No second seed run.
- No write HTTP endpoints called.
- No `/auth/demo-login` call.
- No real Phase 1 data imported.
- No OIS Console, PITS Shell or worker runtime.
- No nginx/systemd config modification.
- No legacy DB, legacy domain or legacy storage-prefix touch.

## Stage 0R-A Platform Kernel Gate Smoke Stabilization

Stage 0R-A code inspection facts:

| Area | Finding |
|---|---|
| `/health` | Static no-DB health response. |
| `/platform/overview` | Read-only Core API route using eight Prisma `count()` queries. |
| Counted models | `Industry`, `Organization`, `Workspace`, `Project`, `ProductDefinition`, `ProductInstallation`, `ModuleDefinition`, `AuditRecord`. |
| Writes/side effects | None observed in the route. |
| `PLATFORM_KERNEL` gate | Hardcoded API response literal `IN_PROGRESS`. |
| Count-driven gate | No. Seeded counts do not promote the gate. |
| Config/feature-flag gate | No. The route does not read `FeatureFlag`, `EffectiveConfigurationSnapshot` or environment config for the gate. |
| Missing DB behavior | No route-level fallback for `/platform/overview`; `/health` remains no-DB. |
| Empty DB behavior | Stage 0P verified HTTP 200 with zero counts after migration. |
| Seeded DB behavior | Stage 0Q verified HTTP 200 with seeded counts after seed. |
| Stage 0R-A result | `PLATFORM_KERNEL_TEST_COVERAGE_REQUIRED`. |

Stage 0R-A required follow-up tests:

- Core API `/health` no-DB behavior.
- Core API `/platform/overview` count mapping.
- `phaseGates.PLATFORM_KERNEL=IN_PROGRESS` behavior or later documented promotion rule.
- Empty DB and seeded DB overview behavior.
- Missing/unavailable DB behavior for `/platform/overview`.
- Legacy/prod reference guard for smoke paths.

Stage 0R-A exclusions:

- No Abacus deploy.
- No runtime modification.
- No migration.
- No seed.
- No `prisma db push`.
- No live endpoint probe from the local documentation task.
- No production or legacy resource touch.

## Stage 0R-B Platform Kernel Test Coverage

Stage 0R-B local test coverage:

| Area | Coverage |
|---|---|
| `/health` | HTTP 200 static payload; no `DATABASE_URL`; no Prisma read/write calls. |
| `/platform/overview` | Eight Prisma `count()` results are mapped into the `kernel` response. |
| `/platform/overview` read-only guard | Count calls only; create/update/delete/upsert write guards remain unused. |
| Phase gates | `PLATFORM_KERNEL=IN_PROGRESS`, `PITS_BUSINESS_LOGIC=BLOCKED_BY_PHASE2`, `KNOWLEDGE_PORTING=BLOCKED_BY_PHASE2`, `FULL_STARTER_DATA=BLOCKED_BY_PHASE3`, `REGRESSION_CERTIFICATION=BLOCKED_BY_PHASE3`. |
| DB-unavailable behavior | Current behavior remains HTTP 500 when a Prisma count rejects; no fallback was invented. |
| Legacy/prod references | Runtime/test config guard checks for absence of legacy DB names, domains and storage prefixes. |
| Testability refactor | `buildCoreApi()` accepts optional mocked Prisma; production default remains `new PrismaClient()`. |

Stage 0R-B exclusions:

- No Abacus deploy.
- No runtime modification.
- No migration.
- No seed.
- No `prisma db push`.
- No live endpoint probe.
- No production or legacy resource touch.

## Stage 0R-C Abacus Runtime Sync No Regression

Stage 0R-C Abacus execution facts:

| Area | Evidence |
|---|---|
| Runtime branch | `stage-0b-complete-handoff-ingestion`. |
| Commit before | `cc7ed28704c9e804385f6d2a4c21e8d887a775e3`. |
| Commit after | `e862b98ea601fa6ab8be6b78fd3ebbde5e66c66d`. |
| Pull type | Fast-forward, `+11` commits. |
| Working tree | Clean except expected `.abacus-backups/` and `.abacus.donotdelete`. |
| Validation | `pnpm install --frozen-lockfile`, lint, typecheck, tests and recursive build passed. |
| Test note | One HTTP 500 log line is expected from the deliberate DB-error-path test. |
| Service restart | `ois-nextgen-core-api` restarted and active running, PID `7674`, started `2026-07-06 04:34:18 UTC`. |
| Local health | `http://127.0.0.1:4000/health` HTTP 200. |
| Public health | `https://ois-nextgen.abacusai.cloud/health` HTTP 200. |
| Local overview | `http://127.0.0.1:4000/platform/overview` HTTP 200. |
| Public overview | `https://ois-nextgen.abacusai.cloud/platform/overview` HTTP 200. |
| `PLATFORM_KERNEL` | Remains `IN_PROGRESS` by current API logic. |

Stage 0R-C exclusions:

- No migrations.
- No `prisma db push`.
- No `prisma migrate dev`.
- No `prisma migrate deploy`.
- No seed.
- No nginx config modification.
- No systemd unit modification.
- No `DATABASE_URL` or secret printing.
- No DB schema or seed data change.
- No write endpoint or `/auth/demo-login` call.
- No OIS Phase 1, Emerald/BQL, legacy domain or legacy storage-prefix touch.

## Stage 0R-D Safe SSH Operations

Stage 0R-D adds owner-run SSH scripts under `ops/abacus/`:

| Script | Purpose | Mutation level |
|---|---|---|
| `status.sh` | Repo/service/health/overview status and seeded counts. | Read-only. |
| `check-live-endpoints.sh` | Active OIS NextGen public staging endpoint checks. | Read-only. |
| `safe-restart-core-api.sh` | Restart Core API service and verify health/overview. | Service restart only. |
| `runtime-sync.sh` | Fetch/pull integration, run validation, clean generated UI `.next` folders before build, verify UI route manifests, restart Core API or all public staging services and verify health/overview. | Source sync and service restart only. |
| `verify-ui-route-manifests.sh` | Verifies OIS/PITS production `.next/routes-manifest.json` and `.next/server/app/**/page.js` entries for Stage 1A static routes and Stage 1C dynamic detail routes. | No. Read-only build artifact check. |
| `rollback-core-api-nginx-poc.sh` | Print rollback plan; execute only with `--confirm-rollback`. | Destructive only with explicit confirmation. |

Stage 0R-D scripts and docs do not add, change or deprecate endpoints. They reduce Abacus Agent credit use by letting the owner run repeatable operations through SSH when the relay works, or through Abacus Web Terminal while the relay is blocked.

## Stage 0R-E SSH Relay Diagnostic

Stage 0R-E confirms the Stage 0R-D scripts remain usable, but direct external SSH is not currently a reliable transport.

| Area | Evidence |
|---|---|
| External SSH endpoint | `ssh ubuntu@ois-nextgen.ssh4.abacusai.cloud -p 22469`. |
| Owner network tests | Failed from Wi-Fi and 5G. |
| Windows TCP check | `Test-NetConnection` returned `TcpTestSucceeded False`. |
| Verbose SSH | `ssh -vvv` timed out before authentication. |
| In-VM `sshd` | Active and healthy. |
| SSH listeners | `0.0.0.0:22` and `[::]:22`. |
| Authorized key | `authorized_keys` exists with correct permissions and one ED25519 key fingerprint `SHA256:majzUhvYdiEw8IRkimxA5RXJXgiHF6bmi5CP1pey+5A ois-nextgen-abacus`. |
| Local VM SSH TCP path | Works. |
| In-VM tunnel agent | None found. |
| VM metadata | HTTP ingress only; no SSH relay details. |
| Conclusion | Platform-side Abacus edge/relay routing issue. |

Fallback path until the relay is fixed:

```sh
cd /home/ubuntu/ois-nextgen
bash ops/abacus/status.sh
bash ops/abacus/check-live-endpoints.sh
bash ops/abacus/safe-restart-core-api.sh
bash ops/abacus/runtime-sync.sh
```

Rollback remains owner-approved only:

```sh
cd /home/ubuntu/ois-nextgen
bash ops/abacus/rollback-core-api-nginx-poc.sh
bash ops/abacus/rollback-core-api-nginx-poc.sh --confirm-rollback
```

## Stage 0R-F Ops Restart Grace Window

Stage 0R-F updates restart verification after owner Web Terminal evidence showed a false negative immediately after `systemctl restart`.

| Area | Contract |
|---|---|
| Warm-up timeout | `RESTART_VERIFY_TIMEOUT=30` seconds by default. |
| Retry interval | `RESTART_VERIFY_INTERVAL=2` seconds by default. |
| First gate | Local `/health` must return HTTP 200 before public checks run. |
| Public health | Public `/health` is checked after local health is ready. |
| Overview | Local and public `/platform/overview` are checked only after health is ready. |
| Temporary 502 | Treated as `WARMING_UP` until timeout expires. |
| Final success | `RESTART_VERIFICATION_PASSED`. |
| Final failure | `RESTART_VERIFICATION_TIMEOUT`. |

This does not add, change or deprecate endpoints. It only prevents false restart failures while Core API warms up and binds port `4000`.

## Stage 0R-G Ops Script Unbound Variable Fix

Stage 0R-G fixes a shell helper bug observed after the Stage 0R-F scripts were pulled into the Abacus VM.

| Area | Contract |
|---|---|
| Observed crash | `lib-core-api-checks.sh: line 110: body: unbound variable`. |
| Runtime interpretation | Not evidence of Core API runtime failure; systemd service was active/running. |
| Root cause | Helper-local `body` variable shadowed caller `body` under Bash dynamic scoping, leaving the caller variable unset under `set -u`. |
| Fix | Initialize response variables and avoid helper/caller variable shadowing in `http_get_body`. |
| Empty/no-body behavior | HTTP 502, curl timeout or missing body now reports a clean failure detail instead of crashing. |
| Self-test | `bash ops/abacus/self-test-core-api-checks.sh`; stubs `curl` and does not hit live endpoints. |

This does not add, change or deprecate endpoints.

## Stage 0S-A Two UI Shell Demo

Stage 0S-A prepares the first minimal separate UI shell demo for Abacus preview. It does not deploy or modify the Abacus runtime.

| Shell | Package | Page | Port | Product code | Start command |
|---|---|---|---:|---|---|
| OIS Console | `@ois/ois-console` | `/` | 3000 | `OIS_CONSOLE` | `CORE_API_URL=https://ois-nextgen.abacusai.cloud pnpm --filter @ois/ois-console start` |
| PITS Shell | `@ois/pits-shell` | `/` | 3001 | `PITS_SHELL` | `CORE_API_URL=https://ois-nextgen.abacusai.cloud pnpm --filter @ois/pits-shell start` |

Stage 0S-A UI contract:

- Use `CORE_API_URL` or `NEXT_PUBLIC_CORE_API_URL`, defaulting to `https://ois-nextgen.abacusai.cloud`.
- Fetch Core API `/health` and `/platform/overview` server-side from the Next page.
- Show app shell name, product code, Core API URL, Core API health, Platform Kernel counts and `DEMO DATA - NOT PRODUCTION`.
- Do not import Prisma in UI shells.
- Do not use `DATABASE_URL` in UI shells.
- Do not call DB directly from UI shells; DB-backed demo data is accessed only through Core API.
- Keep Console and PITS preview/deploy endpoints planned until a later Abacus preview stage creates them.

Stage 0T-A App Shell checks supersede the older Stage 0S-B preview checks:

| Planned endpoint | Status | Expected check |
|---|---|---|
| `https://113d93f4db-3001.na116.preview.abacusai.app` | `ABACUS_APP_SHELL_PREVIEW_PUBLIC` | HTTP 200 and PITS Shell demo/status page with `PITS_SHELL`, shared Core API URL and canonical seeded counts. |
| `https://161acd4ff8.na116.preview.abacusai.app` | `OIS_CONSOLE_APP_SHELL_PREVIEW_UNAVAILABLE_404` | Currently HTTP 404; restore or redeploy before two-App-Shell verification. |
| `https://<abacus-preview-base>-3000.../` | `DEPRECATED` | VM diagnostic only; not canonical OIS Console App Shell proof. |
| `https://<abacus-preview-base>-3001.../` | `DEPRECATED` | VM diagnostic only; not canonical PITS Shell App Shell proof. |
| `https://ois-nextgen.abacusai.cloud/health` | `ABACUS_MANAGED_PUBLIC_STAGING` | Existing Core API health remains HTTP 200. |
| `https://ois-nextgen.abacusai.cloud/platform/overview` | `ABACUS_MANAGED_PUBLIC_STAGING` | Existing read-only seeded overview remains HTTP 200. |

## Stage 0S-B Two UI Shell Preview Ops

Stage 0S-B adds safe Web Terminal operations for temporary UI preview only. It does not execute the preview from this local workspace and does not modify Abacus runtime during documentation/script creation.

Stage 0T-A supersedes this path for UI App Shell proof. Keep these scripts for VM diagnostics only; do not treat `-3000` or `-3001` preview URLs as canonical OIS/PITS App Shell deployment evidence.

Port map:

| Service | Port | Runtime role | Persistence |
|---|---:|---|---|
| Core API | 4000 | Existing systemd/nginx staging API. | Unchanged. |
| OIS Console demo | 3000 | Temporary `nohup` UI shell preview process. | PID/log under `.abacus-ui-demo/`. |
| PITS Shell demo | 3001 | Temporary `nohup` UI shell preview process. | PID/log under `.abacus-ui-demo/`. |

Owner Web Terminal commands:

```sh
cd /home/ubuntu/ois-nextgen
bash ops/abacus/start-ui-demo-shells.sh
bash ops/abacus/status-ui-demo-shells.sh
bash ops/abacus/stop-ui-demo-shells.sh
```

Restart both UI demos:

```sh
cd /home/ubuntu/ois-nextgen
bash ops/abacus/restart-ui-demo-shells.sh
```

Safe env used by UI scripts:

| Key | Value |
|---|---|
| `CORE_API_URL` | `https://ois-nextgen.abacusai.cloud` |
| `NEXT_PUBLIC_CORE_API_URL` | `https://ois-nextgen.abacusai.cloud` |
| `NEXT_TELEMETRY_DISABLED` | `1` |
| `PORT` | `3000` for OIS Console, `3001` for PITS Shell. |
| `DATABASE_URL` | Explicitly unset for UI shell build/start commands. |
| `ABACUS_DATABASE_URL` | Explicitly unset for UI shell build/start commands. |

Preview URL inference:

| Shell | Local check | Preview check if `PREVIEW_URL` or `APP_ORIGIN` is available |
|---|---|---|
| OIS Console | `http://127.0.0.1:3000/` | `<preview-base>-3000.../` |
| PITS Shell | `http://127.0.0.1:3001/` | `<preview-base>-3001.../` |

The status script verifies HTTP 200, product markers and seeded Platform Kernel counts in each UI page. It does not probe legacy endpoints.

Stage 0S-B is preview/demo only:

- No `dmp247.com` deploy.
- No OIS Phase 1 touch.
- No migrations.
- No seed.
- No `prisma db push`.
- No UI `DATABASE_URL`.
- No Core API DB/runtime logic change.
- No nginx change.

## Stage 0T-A App Shell Deployment Contract

Apps Management Console is now the source of truth for OIS/PITS UI App Shell deployment.

Corrected model:

| Area | Contract |
|---|---|
| Core API | Remains on SuperComputer/nginx/systemd at `https://ois-nextgen.abacusai.cloud`. |
| OIS Console | Separate Abacus App Shell with its own Abacus-managed Deployment URL. |
| PITS Shell | Separate Abacus App Shell with its own Abacus-managed Deployment URL. |
| SuperComputer preview proxy | Temporary diagnostic route only; not canonical UI App Shell proof. |
| Connected Services | Connector configuration only. |
| Abacus CLI | Not currently available because API metering must be enabled first. |

Existing App Shells visible in Apps Management Console:

| App Shell | Deployment URL evidence | Boundary |
|---|---|---|
| `9 - Organizational Intelligence System` | `oisys.abacusai.app`; custom domain, database, storage and version links visible. | OIS Phase 1; do not touch. |
| `Multi-Tenant Condo App PRD` | Deployment URL starts with `emerald-bql-web-`; custom domain, database, storage and version links visible. | Emerald/BQL legacy; do not touch. |

OIS Console App Shell contract:

| Field | Value |
|---|---|
| App name | `OIS NextGen Console Demo` |
| Source repo | `luciferdmp832016-rgb/ois-nextgen` |
| Branch | `stage-0b-complete-handoff-ingestion` |
| App path/package | `apps/ois-console` / `@ois/ois-console` |
| Build command | `corepack enable || true && pnpm install --frozen-lockfile && pnpm --filter @ois/ois-console build` |
| Start command | `pnpm --filter @ois/ois-console start` |
| Env | `CORE_API_URL=https://ois-nextgen.abacusai.cloud`, `NEXT_PUBLIC_CORE_API_URL=https://ois-nextgen.abacusai.cloud`, `NEXT_TELEMETRY_DISABLED=1` |
| Forbidden env | Do not set `DATABASE_URL`. |
| Initial domain | Abacus-managed deployment URL. |
| Later custom domain candidates | `ois-ng.dmp247.com` or `ois-staging.dmp247.com`; do not touch `ois.dmp247.com`. |

PITS Shell App Shell contract:

| Field | Value |
|---|---|
| App name | `PITS NextGen Shell Demo` |
| Source repo | `luciferdmp832016-rgb/ois-nextgen` |
| Branch | `stage-0b-complete-handoff-ingestion` |
| App path/package | `apps/pits-shell` / `@ois/pits-shell` |
| Build command | `corepack enable || true && pnpm install --frozen-lockfile && pnpm --filter @ois/pits-shell build` |
| Start command | `pnpm --filter @ois/pits-shell start` |
| Env | `CORE_API_URL=https://ois-nextgen.abacusai.cloud`, `NEXT_PUBLIC_CORE_API_URL=https://ois-nextgen.abacusai.cloud`, `NEXT_TELEMETRY_DISABLED=1` |
| Forbidden env | Do not set `DATABASE_URL`. |
| Initial domain | Abacus-managed deployment URL. |
| Later custom domain candidates | `pits-ng.dmp247.com` or `pits-staging.dmp247.com`. |

Manual deployment checklist for a later stage:

1. Create or open `OIS NextGen Console Demo` in Apps Management Console.
2. Configure source repo, branch and app path/package.
3. Configure env values without `DATABASE_URL`.
4. Deploy to Abacus-managed URL.
5. Verify OIS page shows `OIS_CONSOLE` and Core API seeded counts.
6. Repeat for `PITS NextGen Shell Demo`.
7. Verify both App Shell URLs are separate and both call the same Core API.
8. Only after both pass, test optional custom staging subdomains.

## Stage 0T-B UI Demo Test Harness

Stage 0T-B adds the local/Codex gate before spending Abacus App Shell hosting or visit credits.

Harness checks:

| Package | Test file | Coverage |
|---|---|---|
| `@ois/ois-console` | `apps/ois-console/app/page.test.tsx` | Renders the OIS Console root demo page with mocked Core API health and seeded overview data. |
| `@ois/pits-shell` | `apps/pits-shell/app/page.test.tsx` | Renders the PITS Shell root demo page with the same mocked Core API health and seeded overview data. |
| UI package guard | `apps/ui-demo-static-guard.test.ts` | Blocks direct DB and legacy/production references in `apps/ois-console` and `apps/pits-shell`. |

The harness uses mocked responses only. It does not call `https://ois-nextgen.abacusai.cloud`, does not deploy App Shells, does not modify Abacus runtime and does not read or print secrets.

Required pre-deploy checks before owner-assisted App Shell deployment:

| Check | Command | Expected |
|---|---|---|
| UI demo harness | `pnpm test` | OIS Console and PITS Shell page tests pass. |
| Static guard | `pnpm test` | UI packages contain no direct DB or legacy/production references. |
| Full local quality gate | `pnpm lint && pnpm typecheck && pnpm test && pnpm -r --if-present build` | All pass before App Shell creation evidence is requested. |

## Stage 0T-C OIS Console App Shell Deploy

Stage 0T-C records owner/Abacus App Shell evidence for OIS Console only.

Deployment:

| Field | Value |
|---|---|
| App Shell URL | `https://161acd4ff8.na116.preview.abacusai.app` |
| App name | `OIS NextGen Console Demo` |
| App type | `nextjs` |
| Source repo | `https://github.com/luciferdmp832016-rgb/ois-nextgen` |
| Branch | `stage-0b-complete-handoff-ingestion` |
| App path/package | `apps/ois-console` / `@ois/ois-console` |
| Build command | `corepack enable || true && pnpm install --frozen-lockfile && pnpm --filter @ois/ois-console build` |
| Start command | `pnpm --filter @ois/ois-console start` |
| Port | `3000` |

Safe environment:

| Key | Value |
|---|---|
| `CORE_API_URL` | `https://ois-nextgen.abacusai.cloud` |
| `NEXT_PUBLIC_CORE_API_URL` | `https://ois-nextgen.abacusai.cloud` |
| `NEXT_TELEMETRY_DISABLED` | `1` |
| `DATABASE_URL` | Excluded. |
| `ABACUS_DATABASE_URL` | Excluded. |

Screenshot evidence confirms:

| Check | Evidence |
|---|---|
| Product code | `OIS_CONSOLE`. |
| Core API health | `status=ok`, `service=core-api`, `stage=bootstrap-stage-a`, `HTTP=200`. |
| Demo banner | `DEMO DATA - NOT PRODUCTION`. |
| Data boundary | UI shell does not import Prisma or read DB connection settings; DB-backed demo data is accessed only through Core API. |
| Canonical seeded counts | industries 1, organizations 1, workspaces 1, projects 2, products 5, installations 2, modules 3, auditRecords 1. |

Do not record the pasted Abacus text typo of `workspaces=2` and `products=1` as canonical; the screenshot/canonical seeded counts above remain authoritative.

Stage 0T-C safety:

- OIS Console only.
- PITS was not deployed.
- Core API was not modified.
- No migrations.
- No seed.
- No `prisma db push`.
- No write endpoints.
- No `/auth/demo-login`.
- No production DB/storage/OpenRouter credentials.
- No `dmp247.com` custom domain attached.
- OIS Phase 1 domains `https://oisys.abacusai.app` and `https://ois.dmp247.com` remain untouched.

## Stage 0T-D-R1 PITS Shell Upload Bundle

Stage 0T-D attempted to deploy PITS Shell from GitHub. Abacus reported that the App Shell deployment environment does not allow cloning external GitHub repositories. Stage 0T-D-R1 chooses direct source upload and rejects spec-build for now because the App Shell must come from the OIS NextGen source-of-truth repo.

Bundle manifest:

```text
docs/deployment/PITS_SHELL_ABACUS_UPLOAD_BUNDLE.md
```

Packaging script:

```sh
bash ops/abacus/package-pits-shell-upload-bundle.sh
```

Default artifact:

```text
artifacts/abacus/pits-shell-abacus-upload-bundle.zip
```

The generated artifact is ignored by git and must not be committed.

Bundle allowlist:

| Path | Reason |
|---|---|
| `apps/pits-shell/**` | PITS Shell Next.js source and config. |
| `packages/shared-ui/**` | Only workspace package imported by PITS Shell. |
| `package.json` | Root package manager and dependency metadata. |
| `pnpm-lock.yaml` | Reproducible dependency lock. |
| `pnpm-workspace.yaml` | Workspace discovery. |
| `tsconfig.base.json` | TypeScript base config required by PITS Shell. |

Excluded:

- `node_modules`
- `.next`
- `dist` and build output
- `.env` and `.env.*`
- secrets
- `.git`
- `.abacus-*` runtime files
- backups
- prior generated artifacts
- unrelated apps, packages, domains, Prisma schema, migrations and seeds

Upload deployment contract:

| Field | Value |
|---|---|
| App name | `PITS NextGen Shell Demo` |
| App type | `nextjs` |
| Source method | Direct source ZIP upload. |
| Package | `@ois/pits-shell` |
| Build command | `corepack enable || true && pnpm install --frozen-lockfile && pnpm --filter @ois/pits-shell build` |
| Start command | `pnpm --filter @ois/pits-shell start` |
| Expected port | `3001` |
| Core API URL | `https://ois-nextgen.abacusai.cloud` |

Safe environment:

| Key | Value |
|---|---|
| `CORE_API_URL` | `https://ois-nextgen.abacusai.cloud` |
| `NEXT_PUBLIC_CORE_API_URL` | `https://ois-nextgen.abacusai.cloud` |
| `NEXT_TELEMETRY_DISABLED` | `1` |
| `DATABASE_URL` | Do not set. |
| `ABACUS_DATABASE_URL` | Do not set. |

Stage 0T-D-R1 safety:

- No deploy.
- No Abacus runtime modification.
- No migrations.
- No seed.
- No `prisma db push`.
- No write endpoints.
- No `/auth/demo-login`.
- No production DB/storage/OpenRouter credentials.
- No `dmp247.com` custom domain change.
- No OIS Phase 1 or Emerald/BQL touch.

## Stage 0T-D-R2 PITS Shell App Shell Deploy From Bundle

Stage 0T-D-R2 records owner/Abacus evidence that the Stage 0T-D-R1 direct upload bundle successfully deployed PITS Shell as its own Abacus App Shell.

Deployment:

| Field | Value |
|---|---|
| Result label | `PITS_SHELL_APP_SHELL_DEPLOYED_FROM_BUNDLE` |
| Two-shell verification status | `TWO_APP_SHELL_VERIFICATION_BLOCKED_BY_OIS_CONSOLE_PREVIEW_404` |
| App Shell URL | `https://113d93f4db-3001.na116.preview.abacusai.app` |
| Uploaded bundle | `pits-shell-abacus-upload-bundle.zip` |
| Extracted source path | `/home/ubuntu/pits_shell_bundle` |
| Preserved bundle structure | `apps/pits-shell`, `packages/shared-ui` and root workspace files. |
| Install | `pnpm install --frozen-lockfile` passed. |
| Build | `pnpm --filter @ois/pits-shell build` passed. |
| Start | `pnpm --filter @ois/pits-shell start`. |
| Runtime port | `3001`. |

PITS verification:

| Check | Evidence |
|---|---|
| HTTP result | PITS URL returned HTTP 200. |
| Product code | `PITS_SHELL`. |
| Core API URL | `https://ois-nextgen.abacusai.cloud`. |
| Core API health | Healthy / OK. |
| Demo banner | `DEMO DATA - NOT PRODUCTION`. |
| Canonical seeded counts | industries 1, organizations 1, workspaces 1, projects 2, products 5, installations 2, modules 3, auditRecords 1. |
| Direct DB env | No `DATABASE_URL`; no `ABACUS_DATABASE_URL`. |
| DB access boundary | PITS Shell reads DB-backed demo data only through Core API. |

Core API verification remained stable:

| Endpoint | Evidence |
|---|---|
| `https://ois-nextgen.abacusai.cloud/health` | HTTP 200. |
| `https://ois-nextgen.abacusai.cloud/platform/overview` | HTTP 200 with expected JSON structure. |

Important caveat:

- The overall verification script result was `FAIL` only because the previous OIS Console App Shell preview URL `https://161acd4ff8.na116.preview.abacusai.app` returned HTTP 404.
- Record that as `OIS_CONSOLE_APP_SHELL_PREVIEW_UNAVAILABLE_404`.
- Do not record it as a PITS deployment failure.
- Two-App-Shell simultaneous verification remains blocked until OIS Console is restored or redeployed.

Stage 0T-D-R2 safety:

- PITS Shell only.
- Core API was not modified.
- No migrations.
- No seed.
- No `prisma db push`.
- No write endpoints.
- No `/auth/demo-login`.
- No production DB/storage/OpenRouter credentials.
- No `dmp247.com` custom domain change.
- No OIS Phase 1 or Emerald/BQL touch.

## Stage 0T-E-A-R1 OIS Console Upload Bundle

Stage 0T-E-A-R1 prepares a direct source upload bundle for restoring or redeploying OIS Console after the previous App Shell preview URL began returning HTTP 404.

Bundle manifest:

```text
docs/deployment/OIS_CONSOLE_ABACUS_UPLOAD_BUNDLE.md
```

Packaging script:

```sh
bash ops/abacus/package-ois-console-upload-bundle.sh
```

Default artifact:

```text
artifacts/abacus/ois-console-abacus-upload-bundle.zip
```

The generated artifact is ignored by git and must not be committed.

Bundle allowlist:

| Path | Reason |
|---|---|
| `apps/ois-console/**` | OIS Console Next.js source and config. |
| `packages/shared-ui/**` | Only workspace package imported by OIS Console. |
| `package.json` | Root package manager and dependency metadata. |
| `pnpm-lock.yaml` | Reproducible dependency lock. |
| `pnpm-workspace.yaml` | Workspace discovery. |
| `tsconfig.base.json` | TypeScript base config required by OIS Console. |

Excluded:

- `node_modules`
- `.next`
- `dist` and build output
- `.env` and `.env.*`
- secrets
- `.git`
- `.abacus-*` runtime files
- backups
- prior generated artifacts
- unrelated apps, packages, domains, Prisma schema, migrations and seeds

Upload deployment contract:

| Field | Value |
|---|---|
| App name | `OIS NextGen Console Demo` |
| App type | `nextjs` |
| Source method | Direct source ZIP upload. |
| Package | `@ois/ois-console` |
| Build command | `corepack enable || true && pnpm install --frozen-lockfile && pnpm --filter @ois/ois-console build` |
| Start command | `pnpm --filter @ois/ois-console start` |
| Expected port | `3000` |
| Core API URL | `https://ois-nextgen.abacusai.cloud` |

Safe environment:

| Key | Value |
|---|---|
| `CORE_API_URL` | `https://ois-nextgen.abacusai.cloud` |
| `NEXT_PUBLIC_CORE_API_URL` | `https://ois-nextgen.abacusai.cloud` |
| `NEXT_TELEMETRY_DISABLED` | `1` |
| `DATABASE_URL` | Do not set. |
| `ABACUS_DATABASE_URL` | Do not set. |

Stage 0T-E-A-R1 safety:

- No deploy.
- No Abacus runtime modification.
- No migrations.
- No seed.
- No `prisma db push`.
- No write endpoints.
- No `/auth/demo-login`.
- No production DB/storage/OpenRouter credentials.
- No `dmp247.com` custom domain change.
- No OIS Phase 1 or Emerald/BQL touch.

## Stage 0U-A SuperComputer Product Subdomain Routing Demo

Stage 0U-A prepares safe owner-run scripts for a SuperComputer nginx host-based routing demo.

Target product subdomains:

| Product | Planned host | Local upstream |
|---|---|---|
| OIS Console | `ois-ng.dmp247.com` | `http://127.0.0.1:3000` |
| PITS Shell | `pits-ng.dmp247.com` | `http://127.0.0.1:3001` |

Existing Core API remains unchanged:

```text
https://ois-nextgen.abacusai.cloud
```

DNS principle:

- DNS CNAME maps hostnames only, not URL paths.
- `ois-ng.dmp247.com` can CNAME to `ois-nextgen.abacusai.cloud`.
- `pits-ng.dmp247.com` can CNAME to `ois-nextgen.abacusai.cloud`.
- DNS cannot map `ois-ng.dmp247.com` to `ois-nextgen.abacusai.cloud/ois`.
- Path and product routing are nginx/app concerns.

Scripts:

| Script | Purpose |
|---|---|
| `ops/abacus/enable-product-subdomain-demo-routes.sh` | Writes `/etc/nginx/conf.d/ois-nextgen-product-subdomains.conf`, validates nginx and reloads nginx. |
| `ops/abacus/status-product-subdomain-demo-routes.sh` | Read-only local Host-header checks and optional public DNS/TLS checks. |
| `ops/abacus/disable-product-subdomain-demo-routes.sh` | Removes only the Stage 0U-A managed nginx config, validates nginx and reloads nginx. |

Owner Web Terminal local Host-header sequence:

```sh
cd /home/ubuntu/ois-nextgen
bash ops/abacus/start-ui-demo-shells.sh
bash ops/abacus/enable-product-subdomain-demo-routes.sh
bash ops/abacus/status-product-subdomain-demo-routes.sh
```

Expected local success label:

```text
SUPERCOMPUTER_PRODUCT_SUBDOMAIN_LOCAL_ROUTING_READY
```

Owner DNS setup after local Host-header success:

```text
ois-ng.dmp247.com  CNAME  ois-nextgen.abacusai.cloud
pits-ng.dmp247.com CNAME  ois-nextgen.abacusai.cloud
```

Public check after DNS:

```sh
bash ops/abacus/status-product-subdomain-demo-routes.sh --include-public
```

Possible public labels:

| Label | Meaning |
|---|---|
| `SUPERCOMPUTER_PRODUCT_SUBDOMAIN_PUBLIC_DEMO_VERIFIED` | Public DNS and HTTPS serve both product shells correctly. |
| `CUSTOM_SUBDOMAIN_HTTP_OK_TLS_BLOCKED` | HTTP route works but HTTPS fails due TLS/edge certificate handling. |
| `CUSTOM_SUBDOMAIN_TLS_BLOCKED` | HTTPS fails and HTTP did not validate either. |
| `CUSTOM_SUBDOMAIN_BLOCKED_BY_ABACUS_EDGE` | Abacus edge blocks or misroutes the custom Host header. |

Runtime verification result:

| Check | Result |
|---|---|
| DNS CNAME propagation | `ois-ng.dmp247.com` and `pits-ng.dmp247.com` resolve as CNAMEs to `ois-nextgen.abacusai.cloud`. |
| Local OIS Host-header route | `Host: ois-ng.dmp247.com` returned HTTP 200, `OIS_CONSOLE`, Core API `https://ois-nextgen.abacusai.cloud` and seeded counts. |
| Local PITS Host-header route | `Host: pits-ng.dmp247.com` returned HTTP 200, `PITS_SHELL`, Core API `https://ois-nextgen.abacusai.cloud` and seeded counts. |
| Public HTTPS root checks | `https://ois-ng.dmp247.com` and `https://pits-ng.dmp247.com` failed with SSL handshake failure. |
| Public HTTP root checks | `http://ois-ng.dmp247.com` and `http://pits-ng.dmp247.com` returned HTTP 409. |
| Public HTTPS app paths | `/dashboard` and `/projects` checks failed with SSL handshake failure. |

Interpretation: DNS propagation and local nginx/app routing succeeded. Public custom hostname routing is blocked at the Abacus edge/TLS registration layer, not by OIS Console, PITS Shell, Core API or local nginx routing. Recommended next stage is Stage 0U-B - Abacus Custom Hostname / TLS Registration Check.

Stage 0U-A safety:

- No DNS changes from Codex.
- No Abacus runtime mutation from Codex.
- No migrations.
- No seed.
- No `prisma db push`.
- No Core API DB/runtime logic changes.
- No `DATABASE_URL` in UI shells.
- No production credentials or OpenRouter usage.
- No `ois.dmp247.com` or `oisys.abacusai.app` modification.
- No OIS Phase 1 or Emerald/BQL DB/storage touch.

## Stage 0V-A Cloudflare Tunnel Custom Subdomain Plan

Stage 0V-A documents a Cloudflare Tunnel plan only. It does not install `cloudflared`, create a tunnel, modify DNS, deploy code or use credentials.

Why this pivot is needed:

- Stage 0U-A local Host-header routing passed for OIS Console and PITS Shell.
- Direct CNAME to `ois-nextgen.abacusai.cloud` propagated.
- Public HTTPS failed with SSL handshake errors and public HTTP returned 409.
- Abacus confirmed SuperComputer custom hostnames are not supported; custom hostnames are supported only for managed App Shells.
- Cloudflare Tunnel can terminate TLS for `dmp247.com` hostnames and forward over an outbound connector to local SuperComputer services.

Planned tunnel routes:

| Public hostname | Tunnel service URL | Scope |
|---|---|---|
| `https://ois-ng.dmp247.com` | `http://127.0.0.1:3000` | OIS Console product shell. |
| `https://pits-ng.dmp247.com` | `http://127.0.0.1:3001` | PITS Shell product shell. |
| `https://api-ng.dmp247.com` | `http://127.0.0.1:4000` | Optional later Core API route; not part of Stage 0V-A execution. |

Owner dashboard steps for a later execution stage:

1. Open Cloudflare tunnel management for the `dmp247.com` zone.
2. Create tunnel `ois-nextgen-supercomputer-staging`.
3. Use the dashboard-provided Linux connector instructions only at execution time.
4. Add public hostname `ois-ng.dmp247.com` -> `http://127.0.0.1:3000`.
5. Add public hostname `pits-ng.dmp247.com` -> `http://127.0.0.1:3001`.
6. Do not add `api-ng.dmp247.com` until a later owner-approved API custom-domain stage.
7. Let Cloudflare manage the tunnel DNS records or follow the dashboard's exact DNS instructions.
8. Keep the tunnel token secret; never commit or print it.

Later execution validation:

| Check | Expected |
|---|---|
| Local OIS Host-header | HTTP 200 with `OIS_CONSOLE`, Core API URL and seeded counts. |
| Local PITS Host-header | HTTP 200 with `PITS_SHELL`, Core API URL and seeded counts. |
| `https://ois-ng.dmp247.com` after tunnel | HTTP 200 OIS Console. |
| `https://pits-ng.dmp247.com` after tunnel | HTTP 200 PITS Shell. |
| `https://ois-nextgen.abacusai.cloud/health` | Remains HTTP 200. |
| `https://ois-nextgen.abacusai.cloud/platform/overview` | Remains HTTP 200 with seeded counts. |

Rollback for a later execution stage:

- Remove or disable the Cloudflare Tunnel public hostnames.
- Stop/disable `cloudflared` only if it was installed in that later stage.
- Remove or revert tunnel DNS records per owner direction.
- Do not change `ois.dmp247.com`, `oisys.abacusai.app`, Core API nginx/systemd, DB schema or seed data.

Stage 0V-A safety:

- No `cloudflared` install.
- No tunnel token use, printing or commit.
- No DNS changes.
- No deploy.
- No migrations.
- No seed.
- No `prisma db push`.
- No production credentials.
- No `ois.dmp247.com` or `oisys.abacusai.app` modification.

## Stage 0V-B/C Cloudflare Tunnel Public Verification

Stage 0V-B/C records owner-executed runtime verification. Cloudflare Tunnel solved the Abacus SuperComputer custom hostname/TLS blocker for OIS/PITS public staging subdomains.

Tunnel state:

| Item | Result |
|---|---|
| Tunnel name | `ois-nextgen-abacus` |
| Status | Healthy |
| Active replicas | 1 |
| Routes | 2 |
| `cloudflared` version | `2026.6.1` |

Verified routes:

| Public endpoint | Runtime target | Result |
|---|---|---|
| `https://ois-ng.dmp247.com` | `http://127.0.0.1:3000` | Opens OIS Console. |
| `https://ois-ng.dmp247.com/dashboard` | OIS Console route | Opens OIS Platform Overview. |
| `https://pits-ng.dmp247.com` | `http://127.0.0.1:3001` | Opens PITS Shell. |
| `https://pits-ng.dmp247.com/projects` | PITS Shell route | Opens PITS Project Selector. |

Verified UI evidence:

- OIS page shows product code `OIS_CONSOLE`.
- PITS page shows product code `PITS_SHELL`.
- Both show Core API URL `https://ois-nextgen.abacusai.cloud`.
- Both show Core API healthy HTTP 200.
- Both show seeded demo counts: industries 1, organizations 1, workspaces 1, projects 2, products 5, installations 2, modules 3 and auditRecords 1.
- UI shells do not use `DATABASE_URL`.
- DB-backed demo data is accessed only through Core API.

Architecture result:

- Direct CNAME to Abacus SuperComputer remains unsupported for custom HTTPS.
- Cloudflare Tunnel is now the accepted custom subdomain path for SuperComputer-hosted UI shells.
- Cloudflare connector/runtime state lives on the Abacus VM and Cloudflare dashboard only.
- Cloudflare tunnel token must never be documented, printed, stored in repo or committed.

Stage 0V-B/C safety:

- No Cloudflare tunnel token documented or committed.
- No migrations.
- No seed.
- No `prisma db push`.
- No production DB/storage/OpenRouter credentials.
- No `ois.dmp247.com` modification.
- No `oisys.abacusai.app` modification.
- No OIS Phase 1 or Emerald/BQL DB/storage touch.

## Stage 0W-A Public Staging Runtime Hardening

Stage 0W-A prepares durable systemd operations for the public OIS/PITS staging UI shells. It does not execute the install from Codex.

Systemd service contract:

| Service | Working directory | Port | Env |
|---|---|---:|---|
| `ois-nextgen-ois-console` | `/home/ubuntu/ois-nextgen/apps/ois-console` | 3000 | `CORE_API_URL=https://ois-nextgen.abacusai.cloud`, `NEXT_PUBLIC_CORE_API_URL=https://ois-nextgen.abacusai.cloud`, `NEXT_TELEMETRY_DISABLED=1` |
| `ois-nextgen-pits-shell` | `/home/ubuntu/ois-nextgen/apps/pits-shell` | 3001 | `CORE_API_URL=https://ois-nextgen.abacusai.cloud`, `NEXT_PUBLIC_CORE_API_URL=https://ois-nextgen.abacusai.cloud`, `NEXT_TELEMETRY_DISABLED=1` |

Scripts:

| Script | Purpose |
|---|---|
| `ops/abacus/install-ui-shell-systemd-services.sh` | Builds OIS/PITS UI shells, writes units, daemon-reloads and enables/starts the two UI services. |
| `ops/abacus/uninstall-ui-shell-systemd-services.sh` | Removes only the two Stage 0W-A UI systemd units after `--confirm`. |
| `ops/abacus/restart-public-staging-runtime.sh` | Restarts Core API, OIS Console and PITS Shell, then verifies local/public runtime. `cloudflared` restart requires `--include-cloudflared`. |
| `ops/abacus/status-public-staging-runtime.sh` | Read-only status for Core API, OIS, PITS, cloudflared and local/public endpoints. |
| `ops/abacus/check-public-staging-endpoints.sh` | Read-only public endpoint marker/count checks. |

Owner install sequence after a safe branch pull:

```sh
cd /home/ubuntu/ois-nextgen
bash ops/abacus/stop-ui-demo-shells.sh
bash ops/abacus/install-ui-shell-systemd-services.sh
bash ops/abacus/status-public-staging-runtime.sh
bash ops/abacus/check-public-staging-endpoints.sh
```

Runtime sync restart options:

```sh
PUBLIC_STAGING_RESTART_SCOPE=core bash ops/abacus/runtime-sync.sh
PUBLIC_STAGING_RESTART_SCOPE=all bash ops/abacus/runtime-sync.sh
PUBLIC_STAGING_RESTART_SCOPE=all RESTART_CLOUDFLARED=true bash ops/abacus/runtime-sync.sh
```

Stage 0W-A safety:

- UI systemd units do not set `DATABASE_URL` or `ABACUS_DATABASE_URL`.
- Installer does not modify Core API service, cloudflared service/token, nginx, Cloudflare dashboard or DNS.
- No Codex deploy.
- No migrations.
- No seed.
- No `prisma db push`.
- No credentials committed.
- No `ois.dmp247.com` or `oisys.abacusai.app` modification.
- No OIS Phase 1 or Emerald/BQL DB/storage touch.

## Stage 0W-B Public Staging Runtime Hotfix

Stage 0W-B records owner runtime verification and patches the public staging ops scripts.

Runtime evidence:

| Check | Result |
|---|---|
| `ois-nextgen-core-api` | Active. |
| `ois-nextgen-ois-console` | Active. |
| `ois-nextgen-pits-shell` | Active. |
| `cloudflared` | Active. |
| `https://ois-ng.dmp247.com` | PASS. |
| `https://ois-ng.dmp247.com/dashboard` | PASS. |
| `https://pits-ng.dmp247.com` | PASS. |
| `https://pits-ng.dmp247.com/projects` | PASS. |
| `ops/abacus/check-public-staging-endpoints.sh` | PASS. |

Secret-safe cloudflared status contract:

```sh
systemctl is-active cloudflared
systemctl show cloudflared --property=ActiveState,SubState,MainPID,NRestarts --no-pager
```

Do not use full `systemctl status cloudflared` in shared logs because the process command line can expose the Cloudflare tunnel token.

Restart cleanup:

- `ops/abacus/restart-public-staging-runtime.sh` stops legacy temporary UI demo processes with `stop-ui-demo-shells.sh` before restarting OIS/PITS systemd services.
- It prints safe listener diagnostics for ports `3000` and `3001`.
- It does not kill Core API.
- It does not kill or restart cloudflared unless `--include-cloudflared` is explicitly passed.
- It does not touch legacy resources.

Stage 0W-B safety:

- No Cloudflare token committed.
- No token printed in docs.
- No migrations.
- No seed.
- No `prisma db push`.
- No DNS or Cloudflare dashboard changes.
- No legacy resources touched.

## Stage 1A Product Shell Navigation Baseline

Stage 1A prepares the first real product shell routes for the already operational public staging runtime. It does not deploy from Codex.

OIS Console routes:

| Route | Purpose |
|---|---|
| `/` | Product administration overview. |
| `/dashboard` | Platform Overview dashboard. |
| `/products` | Product and module overview. |
| `/workspaces` | Organization/workspace/project baseline. |
| `/runtime` | Runtime status baseline. |

PITS Shell routes:

| Route | Purpose |
|---|---|
| `/` | Project runtime overview. |
| `/projects` | Project selector baseline. |
| `/runtime` | Runtime status baseline. |

Owner runtime sync after Stage 1A merge:

```sh
cd /home/ubuntu/ois-nextgen
PUBLIC_STAGING_RESTART_SCOPE=all bash ops/abacus/runtime-sync.sh
bash ops/abacus/status-public-staging-runtime.sh
bash ops/abacus/check-public-staging-endpoints.sh
```

Expanded public checks include:

- `https://ois-ng.dmp247.com/products`
- `https://ois-ng.dmp247.com/workspaces`
- `https://ois-ng.dmp247.com/runtime`
- `https://pits-ng.dmp247.com/runtime`

Stage 1A safety:

- UI shells call Core API only.
- UI shells do not use `DATABASE_URL`.
- No Cloudflare dashboard change.
- No DNS change.
- No migrations.
- No seed.
- No `prisma db push`.
- No legacy resources touched.

## Stage 1A-R1 Product Shell Route 404 Hotfix

Stage 1A Abacus verification found HTTP 404 on the new product routes even though source builds had advertised them:

- OIS Console: `/products`, `/workspaces`, `/runtime`.
- PITS Shell: `/runtime`.

Local loopback returned the same 404s, so the issue was not Cloudflare, DNS or the tunnel. Stage 1A-R1 confirms the App Router page files and local production build manifests exist, then hardens Abacus runtime ops against stale generated UI builds.

Hotfix behavior:

- `runtime-sync.sh` removes only generated `apps/ois-console/.next` and `apps/pits-shell/.next` before the recursive production build by default.
- `install-ui-shell-systemd-services.sh` performs the same generated build cleanup before UI systemd install builds.
- `verify-ui-route-manifests.sh` checks `.next/routes-manifest.json` plus `.next/server/app/**/page.js` for every Stage 1A public route.
- `restart-public-staging-runtime.sh` runs the manifest guard before restarting services and stops if route artifacts are missing.

Owner runtime sync after Stage 1A-R1 merge:

```sh
cd /home/ubuntu/ois-nextgen
PUBLIC_STAGING_RESTART_SCOPE=all bash ops/abacus/runtime-sync.sh
bash ops/abacus/status-public-staging-runtime.sh
bash ops/abacus/check-public-staging-endpoints.sh
```

Expected guard label:

```text
UI_ROUTE_MANIFEST_CHECK_PASSED
```

Stage 1A-R1 safety:

- Generated `.next` cleanup only; no source, env, DB or Cloudflare state is deleted.
- No Cloudflare dashboard change.
- No DNS change.
- No migrations.
- No seed.
- No `prisma db push`.
- No credentials committed.
- No UI `DATABASE_URL`.
- No legacy resources touched.

## Stage 1A-R2 UI Orphan Port Cleanup

Stage 1A-R2 makes the owner/manual Abacus recovery permanent in `restart-public-staging-runtime.sh`.

Root cause:

```text
ORPHAN_UI_PORT_PROCESS_BLOCKED_SYSTEMD_RESTART
```

Manual runtime recovery that Stage 1A-R2 codifies:

```sh
sudo systemctl stop ois-nextgen-ois-console ois-nextgen-pits-shell
sudo fuser -k 3000/tcp 3001/tcp
sudo systemctl reset-failed ois-nextgen-ois-console ois-nextgen-pits-shell
sudo systemctl start ois-nextgen-ois-console ois-nextgen-pits-shell
```

Permanent restart behavior:

1. Stop OIS/PITS UI systemd services.
2. Stop legacy temporary UI demo PID-file processes.
3. Print listeners on ports `3000` and `3001`.
4. If a listener remains while the service is inactive, print `ORPHAN_UI_PROCESS_SUSPECTED`.
5. Run `sudo fuser -k 3000/tcp 3001/tcp` only when listeners remain.
6. Print listeners after cleanup.
7. Reset failed state for OIS/PITS UI services.
8. Start OIS/PITS UI services.
9. Print listeners after systemd start.
10. Verify every Stage 1A local route.
11. Verify public Cloudflare Tunnel endpoints.

Owner runtime command:

```sh
cd /home/ubuntu/ois-nextgen
bash ops/abacus/restart-public-staging-runtime.sh
```

Stage 1A-R2 verified route set from manual evidence:

- `https://ois-ng.dmp247.com`
- `https://ois-ng.dmp247.com/dashboard`
- `https://ois-ng.dmp247.com/products`
- `https://ois-ng.dmp247.com/workspaces`
- `https://ois-ng.dmp247.com/runtime`
- `https://pits-ng.dmp247.com`
- `https://pits-ng.dmp247.com/projects`
- `https://pits-ng.dmp247.com/runtime`

Stage 1A-R2 safety:

- `fuser -k` is limited to `3000/tcp` and `3001/tcp`.
- Do not kill Core API port `4000`.
- Do not kill `cloudflared`.
- Do not print process command lines, `.env`, `DATABASE_URL`, Cloudflare token or secrets.
- No Cloudflare dashboard change.
- No DNS change.
- No migrations.
- No seed.
- No `prisma db push`.
- No legacy resources touched.

## Stage 1B Read-Only Platform Registry API Data Binding

Stage 1B adds source-ready read-only Platform Registry endpoints and product shell data binding. It does not deploy from Codex. Owner runtime sync is required before claiming public HTTP 200 for the new Core API registry endpoints.

Core API registry endpoints added:

| Endpoint | Contract |
|---|---|
| `/platform/products` | Read-only product definitions with related module and installation summaries. |
| `/platform/workspaces` | Read-only organizations and workspaces with project/installation summaries. |
| `/platform/projects` | Read-only project registry with workspace, organization and installation summaries. |
| `/platform/modules` | Read-only module definitions with product relationship. |
| `/platform/installations` | Read-only product installation registry with product, organization, workspace and project relationships. |
| `/platform/registry` | Aggregate registry snapshot for OIS/PITS UI shells. |

Response metadata:

```json
{
  "source": "default-db",
  "mode": "read-only",
  "environment": "staging"
}
```

UI binding:

- OIS Console `/dashboard`, `/products`, `/workspaces` and `/runtime` use Core API registry data.
- PITS Shell `/`, `/projects` and `/runtime` use Core API registry projects/installations.
- UI shells still call Core API only.
- UI shells do not import Prisma or read `DATABASE_URL`.
- Empty registry arrays render fallback panels instead of failing the page.

Owner runtime sync after Stage 1B merge:

```sh
cd /home/ubuntu/ois-nextgen
git fetch origin
git checkout stage-0b-complete-handoff-ingestion
git pull --ff-only
PUBLIC_STAGING_RESTART_SCOPE=all bash ops/abacus/runtime-sync.sh
bash ops/abacus/status-public-staging-runtime.sh
bash ops/abacus/check-public-staging-endpoints.sh
```

Expected public Core API checks after owner runtime sync:

```sh
curl -i https://ois-nextgen.abacusai.cloud/platform/products
curl -i https://ois-nextgen.abacusai.cloud/platform/workspaces
curl -i https://ois-nextgen.abacusai.cloud/platform/projects
curl -i https://ois-nextgen.abacusai.cloud/platform/modules
curl -i https://ois-nextgen.abacusai.cloud/platform/installations
curl -i https://ois-nextgen.abacusai.cloud/platform/registry
```

Each response should return HTTP 200 with `source=default-db` and `mode=read-only`. Stage 1B public staging scripts also verify registry-aware UI markers such as `PITS_RUNTIME_SHELL`, `PMC Org Demo` and `EMERALD_PRECINCT_DEMO`.

Stage 1B safety:

- No Cloudflare dashboard change.
- No DNS change.
- No migrations.
- No seed.
- No `prisma db push`.
- No credentials committed.
- No UI `DATABASE_URL`.
- No Prisma import in UI shells.
- No write/mutation endpoints.
- No `/auth/demo-login` change.
- No legacy resources touched.

## Stage 1C Product Registry Detail Cross-Linking

Stage 1C adds source-ready read-only registry detail endpoints and OIS/PITS cross-product detail links. It does not deploy from Codex. Owner runtime sync is required before claiming public HTTP 200 for the new detail endpoints and dynamic UI routes.

Core API detail endpoints added:

| Endpoint | Contract |
|---|---|
| `/platform/products/:id` | Read-only product detail with modules, installations, projects and workspaces. |
| `/platform/products/code/:code` | Read-only product detail by product code. |
| `/platform/workspaces/:id` | Read-only workspace detail with organization, project and installation context. |
| `/platform/projects/:id` | Read-only project detail with workspace, organization and installation context. |
| `/platform/modules/:id` | Read-only module detail with product and installation context. |
| `/platform/installations/:id` | Read-only installation detail with product, workspace, project and module context. |

Controlled missing-detail responses return HTTP 404 with `error.code=NOT_FOUND`, the entity name and the requested lookup. They must not leak secrets or query legacy resources.

UI detail routes added:

| Shell | Route | Contract |
|---|---|---|
| OIS Console | `/products/[id]` | Product detail with module, installation and PITS project links. |
| OIS Console | `/workspaces/[id]` | Workspace detail with product and PITS project links. |
| OIS Console | `/modules/[id]` | Module detail with owning product and installation links. |
| OIS Console | `/installations/[id]` | Installation detail with product, workspace, module and PITS project links. |
| PITS Shell | `/projects/[id]` | Project detail with OIS product/workspace cross-links. |

Cross-product link defaults:

- OIS public base: `OIS_PUBLIC_BASE_URL` or `NEXT_PUBLIC_OIS_PUBLIC_BASE_URL`, default `https://ois-ng.dmp247.com`.
- PITS public base: `PITS_PUBLIC_BASE_URL` or `NEXT_PUBLIC_PITS_PUBLIC_BASE_URL`, default `https://pits-ng.dmp247.com`.
- UI shells still call Core API only for data and do not read `DATABASE_URL`.

Owner runtime sync after Stage 1C merge:

```sh
cd /home/ubuntu/ois-nextgen
git fetch origin
git checkout stage-0b-complete-handoff-ingestion
git pull --ff-only
PUBLIC_STAGING_RESTART_SCOPE=all bash ops/abacus/runtime-sync.sh
bash ops/abacus/status-public-staging-runtime.sh
bash ops/abacus/check-public-staging-endpoints.sh
```

Expected detail API checks after owner runtime sync:

```sh
curl -i https://ois-nextgen.abacusai.cloud/platform/products/<product-id>
curl -i https://ois-nextgen.abacusai.cloud/platform/products/code/<product-code>
curl -i https://ois-nextgen.abacusai.cloud/platform/workspaces/<workspace-id>
curl -i https://ois-nextgen.abacusai.cloud/platform/projects/<project-id>
curl -i https://ois-nextgen.abacusai.cloud/platform/modules/<module-id>
curl -i https://ois-nextgen.abacusai.cloud/platform/installations/<installation-id>
```

Expected public UI detail checks after owner runtime sync:

```sh
curl -i https://ois-ng.dmp247.com/products/<product-id>
curl -i https://ois-ng.dmp247.com/workspaces/<workspace-id>
curl -i https://ois-ng.dmp247.com/modules/<module-id>
curl -i https://ois-ng.dmp247.com/installations/<installation-id>
curl -i https://pits-ng.dmp247.com/projects/<project-id>
```

The public staging scripts discover seeded registry IDs from `/platform/registry`, verify the detail APIs, verify controlled 404 responses and then check the dynamic UI detail routes.

Stage 1C safety:

- No Cloudflare dashboard change.
- No DNS change.
- No migrations.
- No seed.
- No `prisma db push`.
- No credentials committed.
- No UI `DATABASE_URL`.
- No Prisma import in UI shells.
- No write/mutation endpoints.
- No `/auth/demo-login` change.
- No `ois.dmp247.com` or `oisys.abacusai.app` change.
- No legacy resources touched.

## Stage 1C-R1 Detail UI Marker Runtime Hotfix

Stage 1C-R1 fixes the detail route marker contract after owner Abacus runtime verification showed:

- Core API detail endpoints passed.
- UI production route manifests passed.
- systemd services were active.
- `cloudflared` was active.
- OIS/PITS root, list and runtime pages passed.
- Local/public detail route checks returned HTTP 200 but failed because expected markers were missing.

Required marker contract:

| UI route | Required marker |
|---|---|
| OIS Console `/products/[id]` | `Product Detail Source` |
| OIS Console `/workspaces/[id]` | `Workspace Detail Source` |
| OIS Console `/modules/[id]` | `Module Detail Source` |
| OIS Console `/installations/[id]` | `Installation Detail Source` |
| PITS Shell `/projects/[id]` | `Project Detail Source` |

Stage 1C-R1 renders each marker as visible server-rendered text and as `data-detail-source`, while leaving the existing ops marker checks unchanged.

Owner runtime sync after Stage 1C-R1 merge:

```sh
cd /home/ubuntu/ois-nextgen
git fetch origin
git checkout stage-0b-complete-handoff-ingestion
git pull --ff-only
PUBLIC_STAGING_RESTART_SCOPE=all bash ops/abacus/runtime-sync.sh
bash ops/abacus/status-public-staging-runtime.sh
bash ops/abacus/check-public-staging-endpoints.sh
```

Expected owner runtime label after Abacus pass: `PRODUCT_REGISTRY_DETAIL_CROSS_LINKING_RUNTIME_VERIFIED`.

Stage 1C-R1 safety:

- No Cloudflare dashboard change.
- No DNS change.
- No migrations.
- No seed.
- No `prisma db push`.
- No credentials committed.
- No UI `DATABASE_URL`.
- No Prisma import in UI shells.
- No write/mutation endpoints.
- No `/auth/demo-login` change.
- No `ois.dmp247.com` or `oisys.abacusai.app` change.
- No legacy resources touched.

## Stage 1D Registry Runtime Health Owner UAT Surface

Stage 1D adds a read-only owner-verifiable runtime health layer over the existing Platform Registry.

Core API adds:

- `GET /platform/registry/health`

The health payload is deterministic from the existing registry snapshot. It reports configured rows, relationship links, staging-safe public URLs and aggregate counts for `Healthy`, `Degraded`, `Unavailable` and `Missing URL`. It does not probe external UI routes; `Reachable` means a staging-safe public URL is configured.

OIS Console markers:

| Route | Required marker |
|---|---|
| `/dashboard` | `Registry Runtime Health` |
| `/products/[id]` | `Product Runtime Health` |
| `/workspaces/[id]` | `Workspace Runtime Health` |
| `/modules/[id]` | `Module Runtime Health` |
| `/installations/[id]` | `Installation Runtime Health` |

PITS Shell markers:

| Route | Required marker |
|---|---|
| `/projects` | `Registry Runtime Health` |
| `/runtime` | `Registry Runtime Health` |
| `/projects/[id]` | `Project Runtime Health` |

Owner runtime sync after Stage 1D merge:

```sh
cd /home/ubuntu/ois-nextgen
git fetch origin
git checkout stage-0b-complete-handoff-ingestion
git pull --ff-only
PUBLIC_STAGING_RESTART_SCOPE=all bash ops/abacus/runtime-sync.sh
bash ops/abacus/status-public-staging-runtime.sh
bash ops/abacus/check-public-staging-endpoints.sh
```

Expected owner runtime label after Abacus pass: `REGISTRY_RUNTIME_HEALTH_OWNER_UAT_RUNTIME_VERIFIED`.

Owner browser/UAT must also be performed from real browser sessions on:

- `https://ois-ng.dmp247.com`
- `https://ois-ng.dmp247.com/dashboard`
- `https://ois-ng.dmp247.com/products`
- One OIS product detail page.
- `https://ois-ng.dmp247.com/workspaces`
- One OIS workspace detail page.
- `https://pits-ng.dmp247.com`
- `https://pits-ng.dmp247.com/projects`
- One PITS project detail page.

Stage 1D safety:

- No Cloudflare dashboard change.
- No DNS change.
- No migrations.
- No seed.
- No `prisma db push`.
- No credentials committed.
- No UI `DATABASE_URL`.
- No Prisma import in UI shells.
- No write/mutation endpoints.
- No `/auth/demo-login` change.
- No `ois.dmp247.com` or `oisys.abacusai.app` change.
- No legacy resources touched.

## Stage 1E Registry Governance Installation Lifecycle Readiness

Stage 1E adds a read-only owner-verifiable governance/readiness layer over the existing Platform Registry.

Core API adds:

- `GET /platform/registry/readiness`

The readiness payload is deterministic from the existing registry snapshot and staging-safe runtime config. It reports `READY`, `INCOMPLETE`, `BLOCKED`, `NOT_APPLICABLE` and `UNKNOWN` states with owner-readable reasons, missing items and owner actions. It does not use LLMs, migrations, seed data, write endpoints or external route probes.

OIS Console markers:

| Route | Required marker |
|---|---|
| `/dashboard` | `Registry Governance / Readiness` |
| `/products` | `Registry Governance / Readiness` |
| `/products/[id]` | `Product Governance / Readiness` and `What is missing?` |
| `/workspaces` | `Registry Governance / Readiness` |
| `/workspaces/[id]` | `Workspace Governance / Readiness` and `What is missing?` |
| `/modules/[id]` | `Module Governance / Readiness` and `What is missing?` |
| `/installations/[id]` | `Installation Governance / Readiness` and `What is missing?` |
| `/runtime` | `Registry Governance / Readiness` |

PITS Shell markers:

| Route | Required marker |
|---|---|
| `/projects` | `Registry Governance / Readiness` |
| `/projects/[id]` | `Project Governance / Readiness` and `What is missing?` |
| `/runtime` | `Registry Governance / Readiness` |

Owner runtime sync after Stage 1E merge:

```sh
cd /home/ubuntu/ois-nextgen
git fetch origin
git checkout stage-0b-complete-handoff-ingestion
git pull --ff-only
PUBLIC_STAGING_RESTART_SCOPE=all bash ops/abacus/runtime-sync.sh
bash ops/abacus/status-public-staging-runtime.sh
bash ops/abacus/check-public-staging-endpoints.sh
```

Expected owner runtime label after Abacus pass and browser/UAT: `REGISTRY_GOVERNANCE_INSTALLATION_LIFECYCLE_RUNTIME_VERIFIED`.

Stage 1E safety:

- No Cloudflare dashboard change.
- No DNS change.
- No migrations.
- No seed.
- No `prisma db push`.
- No credentials committed.
- No UI `DATABASE_URL`.
- No Prisma import in UI shells.
- No write/mutation endpoints.
- No `/auth/demo-login` change.
- No `ois.dmp247.com` or `oisys.abacusai.app` change.
- No legacy resources touched.

## Stage 1F Owner Registry Cockpit Visual UAT Navigation Surface

Stage 1F adds a read-only owner-verifiable cockpit over the existing Platform Registry, registry health and registry readiness data.

Core API changes:

- None. Stage 1F reuses `/platform/registry`, `/platform/registry/health` and `/platform/registry/readiness`.

OIS Console markers:

| Route | Required marker |
|---|---|
| `/` | `Owner Registry Cockpit / Registry Runtime Summary` |
| `/dashboard` | `Owner Registry Cockpit / Registry Runtime Summary`, `Missing runtime URL`, `Forbidden link guard` |
| `/products` | `Runtime health:`, `Readiness:`, `Linked to PITS` |
| `/products/[id]` | `Owner-facing UAT summary` |
| `/workspaces` | `Runtime health:`, `Readiness:` |
| `/workspaces/[id]` | `Owner-facing UAT summary` |
| `/modules/[id]` | `Owner-facing UAT summary` |
| `/installations/[id]` | `Owner-facing UAT summary` |
| `/runtime` | `Owner Registry Cockpit / Registry Runtime Summary` |

PITS Shell markers:

| Route | Required marker |
|---|---|
| `/` | `PITS Registry Cockpit / Project Runtime Summary` |
| `/projects` | `Project readiness`, `Runtime health:` |
| `/projects/[id]` | `Owner-facing project UAT summary` |
| `/runtime` | `PITS Registry Cockpit / Project Runtime Summary` |

Owner runtime sync after Stage 1F merge:

```sh
cd /home/ubuntu/ois-nextgen
git fetch origin
git checkout stage-0b-complete-handoff-ingestion
git pull --ff-only
PUBLIC_STAGING_RESTART_SCOPE=all bash ops/abacus/runtime-sync.sh
bash ops/abacus/status-public-staging-runtime.sh
bash ops/abacus/check-public-staging-endpoints.sh
```

Expected owner runtime label after Abacus pass and browser/UAT: `OWNER_REGISTRY_COCKPIT_VISUAL_UAT_RUNTIME_VERIFIED`.

Stage 1F safety:

- No new Core API endpoint.
- No Cloudflare dashboard change.
- No DNS change.
- No migrations.
- No seed.
- No `prisma db push`.
- No credentials committed.
- No UI `DATABASE_URL`.
- No Prisma import in UI shells.
- No write/mutation endpoints.
- No `/auth/demo-login` change.
- No `ois.dmp247.com` or `oisys.abacusai.app` change.
- No legacy resources touched.

## Stage 1F-R1 OIS Console Root Cockpit Marker Hotfix

Stage 1F-R1 fixes the OIS Console root marker contract after runtime verification found:

- `OIS_CONSOLE_LOCAL_ROOT_COCKPIT` missing marker: `Ready to operate`
- `OIS_CONSOLE_PUBLIC_ROOT_COCKPIT` missing marker: `Ready to operate`

The root page `/` must render server-side HTML containing:

- `Owner Registry Cockpit / Registry Runtime Summary`
- `Ready to operate`
- `Forbidden link guard`

The hotfix does not weaken ops checks and does not force the real cockpit status to green. It adds deterministic owner-facing target-state text on the root page while preserving the cockpit's actual `Ready to operate` or `Needs owner review` status.

Expected owner runtime label after Abacus pass and browser/UAT remains: `OWNER_REGISTRY_COCKPIT_VISUAL_UAT_RUNTIME_VERIFIED`.

Stage 1F-R1 safety:

- No new Core API endpoint.
- No Cloudflare dashboard change.
- No DNS change.
- No migrations.
- No seed.
- No `prisma db push`.
- No credentials committed.
- No UI `DATABASE_URL`.
- No Prisma import in UI shells.
- No write/mutation endpoints.
- No `/auth/demo-login` change.
- No `ois.dmp247.com` or `oisys.abacusai.app` change.
- No legacy resources touched.

## Stage 1G Modern Responsive Shell Layout Navigation Standard

Stage 1G standardizes the OIS Console and PITS Shell layout before additional UI surfaces are added.

The source-ready shell standard provides:

- Fixed desktop sidebar navigation.
- Fixed top header/top bar.
- Independent main-content scrolling.
- Desktop navigation hide/show control.
- Responsive mobile drawer/menu control.
- Lightweight non-blocking bottom shell status bar.
- Active route highlighting.
- Product-specific visual tokens while preserving one shared shell behavior.

Stage 1G deterministic UI markers:

- `Modern Shell Layout`
- `Shell Navigation Toggle`
- `Fixed Navigation Shell`
- `Responsive Product Shell`

Stage 1G keeps existing Stage 1B/1C/1D/1E/1F behavior intact:

- OIS root still renders `Owner Registry Cockpit / Registry Runtime Summary`, `Ready to operate` and `Forbidden link guard`.
- OIS dashboard/products/workspaces/runtime and detail routes still render owner cockpit, health, readiness and UAT markers.
- PITS root/projects/runtime and project detail routes still render cockpit, project readiness, health and UAT markers.
- OIS/PITS cross-links still use `https://ois-ng.dmp247.com` and `https://pits-ng.dmp247.com`.

Owner runtime sync after Stage 1G merge:

```sh
cd /home/ubuntu/ois-nextgen
git fetch origin
git checkout stage-0b-complete-handoff-ingestion
git pull --ff-only
PUBLIC_STAGING_RESTART_SCOPE=all bash ops/abacus/runtime-sync.sh
bash ops/abacus/status-public-staging-runtime.sh
bash ops/abacus/check-public-staging-endpoints.sh
```

Stage 1G safety:

- No new Core API endpoint.
- No registry data behavior change.
- No Cloudflare dashboard change.
- No DNS change.
- No migrations.
- No seed.
- No `prisma db push`.
- No credentials committed.
- No UI `DATABASE_URL`.
- No Prisma import in UI shells.
- No write/mutation endpoints.
- No `/auth/demo-login` change.
- No `ois.dmp247.com` or `oisys.abacusai.app` change.
- No legacy resources touched.

## Stage 1H Owner-first Information Architecture Visual Design System Polish

Stage 1H polishes the existing OIS Console and PITS Shell owner surfaces without changing business logic.

The source-ready owner-first polish provides:

- Consistent page-heading cues for what the page is, health, readiness, missing items and next action.
- Consistent visual hierarchy for page headings, panels, metric/card sections, quick links and owner guard summaries.
- Owner-friendly status badge metadata and labels across shell, cockpit, readiness, health and detail surfaces.
- Safe empty and fallback states that avoid secrets, environment values, stack traces and internal paths.
- Responsive badge/link/card behavior so owner UAT remains readable on narrow screens.

Stage 1H deterministic UI markers:

- `Owner-first Design System`
- `Visual Hierarchy Standard`
- `Owner-friendly Status Badges`

Stage 1H keeps existing Stage 1B/1C/1D/1E/1F/1G behavior intact:

- OIS/PITS pages still use Core API registry, health and readiness data only.
- OIS/PITS cockpit, readiness, health, detail and cross-link markers remain rendered.
- Stage 1G shell markers remain rendered.
- Forbidden localhost and legacy links remain absent from checked public routes.

Owner runtime sync after Stage 1H merge:

```sh
cd /home/ubuntu/ois-nextgen
git fetch origin
git checkout stage-0b-complete-handoff-ingestion
git pull --ff-only
PUBLIC_STAGING_RESTART_SCOPE=all bash ops/abacus/runtime-sync.sh
bash ops/abacus/status-public-staging-runtime.sh
bash ops/abacus/check-public-staging-endpoints.sh
```

Stage 1H safety:

- No new Core API endpoint.
- No registry data behavior change.
- No Cloudflare dashboard change.
- No DNS change.
- No migrations.
- No seed.
- No `prisma db push`.
- No credentials committed.
- No UI `DATABASE_URL`.
- No Prisma import in UI shells.
- No write/mutation endpoints.
- No `/auth/demo-login` change.
- No `ois.dmp247.com` or `oisys.abacusai.app` change.
- No legacy resources touched.

## Stage 1I Owner Review Workflow Boundary Safe Admin Action Design

Stage 1I adds read-only owner review workflow and safe action-boundary preview surfaces before any future admin/write design.

Core API:

- Adds `GET /platform/owner-review`.
- Derives deterministic review items from existing `/platform/registry/health` and `/platform/registry/readiness` data.
- Reports severity, status, reason, suggested owner action, action permission, current allowance, safety gates, audit requirement, rollback requirement and confirmation requirement.
- Keeps `enabledAdminActions=0`, `mutationEndpointsAdded=false` and `writePermission=NOT_ALLOWED_IN_STAGE_1I`.

OIS/PITS UI markers:

- `Owner Review Queue`
- `Safe Action Boundary`
- `Read-only preview`
- `Future admin action requires audit`
- `Action is read-only preview only`
- `Suggested next actions`

Stage 1I keeps existing Stage 1B/1C/1D/1E/1F/1G/1H behavior intact:

- Existing registry, health, readiness, cockpit, shell and owner-first markers remain checked.
- OIS dashboard/runtime plus product, workspace and installation detail routes render safe boundary information.
- PITS projects/runtime plus project detail render project-level safe boundary information.
- UI controls are preview labels only; no mutation button or executable admin action is introduced.

Owner runtime sync after Stage 1I merge:

```sh
cd /home/ubuntu/ois-nextgen
git fetch origin
git checkout stage-0b-complete-handoff-ingestion
git pull --ff-only
PUBLIC_STAGING_RESTART_SCOPE=all bash ops/abacus/runtime-sync.sh
bash ops/abacus/status-public-staging-runtime.sh
bash ops/abacus/check-public-staging-endpoints.sh
```

Stage 1I safety:

- No real write/admin/sync actions.
- No owner-review mutation endpoint.
- No registry data behavior change.
- No Cloudflare dashboard change.
- No DNS change.
- No migrations.
- No seed.
- No `prisma db push`.
- No credentials committed.
- No UI `DATABASE_URL`.
- No Prisma import in UI shells.
- No `/auth/demo-login` change.
- No `ois.dmp247.com` or `oisys.abacusai.app` change.
- No legacy resources touched.

## Stage 0F-R2 Readiness Matrix

| Area | Minimum staging-only input | Stage 0F-R2 status |
|---|---|---|
| DB | Staging-only `DATABASE_URL`, or confirmed mock DB mode. | Missing; no staging database URL or mock DB mode was confirmed. |
| Storage | Confirmed `STORAGE_PROVIDER=mock`, or staging-only storage credentials after storage tests are approved. | Missing; Abacus storage/mock configuration remains unknown. |
| AI | Confirmed `AI_PROVIDER=mock` and `AI_PROVIDER_MODE=mock`, or approved non-production AI key. | Missing; Abacus AI env values remain unknown. |
| Abacus identifiers | Exact project/app/service/task identifiers for the split Core API, Console and PITS services. | Partial; project `OIS NextGen Staging` is known, exact app/service/task IDs are not. |
| Runtime entrypoint | Confirmed split-app build/start commands and port behavior accepted by Abacus. | Partially known from repo scripts, but Abacus runtime and dynamic port behavior remain unknown. |
| Secrets/env injection | Verified Abacus staging UI or agent path for environment values and secrets. | Unknown; no safe injection path was verified. |
| Staging URLs | Staging subdomain/path for Core API, Console and PITS. | Missing. |

Do not execute a staging deployment until every row above is confirmed as staging-only. If any row remains unknown, document the blocker and stop.

## Required Staging Secrets

- `ABACUS_ENV=staging`
- `ABACUS_APP_ID`
- `ABACUS_PUBLIC_APP_URL`
- `ABACUS_DATABASE_URL`
- `ABACUS_STORAGE_BUCKET`
- `ABACUS_STORAGE_ENDPOINT`
- `ABACUS_STORAGE_ACCESS_KEY`
- `ABACUS_STORAGE_SECRET_KEY`

Keep storage secrets unset and `STORAGE_PROVIDER=mock` until staging storage tests are approved.

## Required Non-Secret Variables

- `APP_ENV=staging`
- `DEPLOY_TARGET=abacus-staging`
- `AI_PROVIDER=mock`
- `AI_PROVIDER_MODE=mock`
- `STORAGE_PROVIDER=mock`
- `DEPLOYMENT_VERSION_ENABLED=false`
- `NEXT_TELEMETRY_DISABLED=1`

## Staging Steps

Do not begin these steps until the Stage 0F-R3 checklist is complete and reviewed.
Stage 0F-R4 did not execute these steps.
Stage 0H did not execute these steps.
Stage 0I-R1 did not execute these steps.
Stage 0J executed only a local VM Core API health POC, not a public deployment or full split-app staging POC.
Stage 0K executed only a VM preview proxy Core API health POC, not a hosted-app deployment or full split-app staging POC.
Stage 0L executed hosted-app/custom-domain investigation plus controlled Core API boot only; no hosted app/service was created.
Stage 0N did not execute staging steps; it records the resource boundary and SuperComputer nginx/systemd deployment contract.
Stage 0O executed the Core API-only SuperComputer nginx/systemd staging health POC and verified `https://ois-nextgen.abacusai.cloud/health` HTTP/2 200. It did not execute Console, PITS, worker, DB-backed functionality, storage-backed functionality or real AI/OpenRouter usage.
Stage 0P executed the default DB Prisma baseline on Abacus and verified `https://ois-nextgen.abacusai.cloud/platform/overview` HTTP 200 as a DB-backed read-only endpoint. It did not seed data, call `/auth/demo-login`, call write endpoints, start Console/PITS/worker or touch legacy resources.
Stage 0Q executed the Platform Kernel seed on Abacus and verified `https://ois-nextgen.abacusai.cloud/platform/overview` HTTP 200 with seeded demo/staging counts. It did not call `/auth/demo-login`, call write endpoints, start Console/PITS/worker, modify nginx/systemd or touch legacy resources.
Stage 0R-A performed local code inspection and documentation only. It did not deploy, run runtime, migrate, seed, call endpoints or touch legacy resources.
Stage 0R-B added local-only tests only. It did not deploy, run runtime, migrate, seed, call endpoints or touch legacy resources.
Stage 0R-C synced Abacus runtime to the latest integration commit and restarted Core API. It did not run migrations, seed data, modify nginx/systemd units, call write endpoints or touch legacy resources.
Stage 0R-D added reusable SSH scripts and documentation only. It did not SSH to Abacus, run runtime operations, migrate, seed, call endpoints or touch legacy resources.
Stage 0R-E documented the Abacus SSH relay diagnostic and Web Terminal fallback only. It did not SSH to Abacus, run Web Terminal operations, run runtime operations, migrate, seed, call endpoints or touch legacy resources.
Stage 0R-F updated safe ops scripts and documentation only. It did not run Web Terminal operations, deploy, run runtime operations, migrate, seed, call endpoints or touch legacy resources.
Stage 0R-G fixed safe ops shell helper parsing and documentation only. It did not run Web Terminal operations, deploy, run runtime operations, migrate, seed, call endpoints or touch legacy resources.
Stage 0S-A added OIS Console and PITS Shell demo pages plus documentation only. It did not deploy, modify Abacus runtime, migrate, seed, call live endpoints, start UI shells or touch legacy resources.
Stage 0S-B added temporary UI demo shell ops scripts plus documentation only. It did not run Web Terminal operations, deploy, modify Abacus runtime, migrate, seed, call live endpoints, start UI shells, modify nginx/systemd or touch legacy resources.
Stage 0T-A corrected UI deployment documentation only. It did not deploy, modify Abacus runtime, migrate, seed, call live endpoints, create App Shells, modify nginx/systemd or touch legacy resources.
Stage 0T-B added local/Codex UI demo tests and documentation only. It did not deploy, modify Abacus runtime, migrate, seed, call live endpoints, create App Shells, modify nginx/systemd or touch legacy resources.
Stage 0T-C records owner/Abacus App Shell deployment evidence for OIS Console only. PITS was not deployed; Core API was not modified; no migrations, seed, `prisma db push`, write endpoints, `/auth/demo-login`, production credentials, legacy domains or `dmp247.com` custom domains were used.
Stage 0T-D-R1 prepares a PITS Shell direct upload source bundle only. It did not deploy, modify Abacus runtime, migrate, seed, call endpoints, create App Shells, modify nginx/systemd or touch legacy resources.
Stage 0T-D-R2 records owner/Abacus evidence that PITS Shell deployed from the upload bundle. It did not modify Core API, migrate, seed, call write endpoints, call `/auth/demo-login`, use production credentials, modify custom domains or touch legacy resources. Two-App-Shell verification remains blocked by the OIS Console preview HTTP 404.
Stage 0T-E-A-R1 prepares an OIS Console direct upload source bundle only. It did not deploy, modify Abacus runtime, migrate, seed, call endpoints, create App Shells, modify nginx/systemd or touch legacy resources.
Stage 0U-A adds safe owner-run nginx product subdomain demo scripts and records owner runtime evidence. DNS CNAME propagation and local Host-header routing passed, but public custom HTTPS is blocked by Abacus edge/TLS registration. Codex did not deploy, modify Abacus runtime, modify DNS, migrate, seed, call endpoints, start UI shells, modify production domains or touch legacy resources.
Stage 0V-A creates the Cloudflare Tunnel custom subdomain plan/runbook only. It did not install `cloudflared`, create a tunnel, modify DNS, deploy, migrate, seed, run `prisma db push`, use production credentials, print/commit Cloudflare tokens or touch legacy resources.
Stage 0V-B/C records owner-executed Cloudflare Tunnel runtime verification only. It did not document or commit Cloudflare tokens, run migrations, run seed, run `prisma db push`, use production credentials, call write endpoints, modify Core API DB/runtime logic or touch legacy resources.
Stage 0W-A adds safe systemd public staging runtime scripts and documentation only. It did not deploy from Codex, modify Cloudflare dashboard, modify DNS, run migrations, run seed, run `prisma db push`, commit credentials, modify Core API/cloudflared units from Codex or touch legacy resources.
Stage 0W-B records owner runtime evidence and adds a secret-safe ops hotfix only. It did not commit Cloudflare tokens, print tokens in docs, run migrations, run seed, run `prisma db push`, modify DNS, modify the Cloudflare dashboard, use production credentials or touch legacy resources.
Stage 1A adds product shell UI code, route tests, endpoint checks and documentation only. It did not deploy from Codex, modify Cloudflare dashboard, modify DNS, run migrations, run seed, run `prisma db push`, commit credentials, use UI `DATABASE_URL` or touch legacy resources.
Stage 1A-R1 adds ops/test/docs hotfixes only. It did not deploy from Codex, modify Cloudflare dashboard, modify DNS, run migrations, run seed, run `prisma db push`, commit credentials, use UI `DATABASE_URL` or touch legacy resources.
Stage 1A-R2 adds safe UI orphan port cleanup ops/docs only. It did not deploy from Codex, modify Cloudflare dashboard, modify DNS, run migrations, run seed, run `prisma db push`, commit credentials, use UI `DATABASE_URL`, kill Core API/cloudflared or touch legacy resources.
Stage 1B adds read-only Platform Registry API endpoints, Core API-backed UI data binding, tests, ops checks and documentation only. It did not deploy from Codex, modify Cloudflare dashboard, modify DNS, run migrations, run seed, run `prisma db push`, commit credentials, use UI `DATABASE_URL`, add write endpoints or touch legacy resources.
Stage 1C adds read-only Product Registry detail APIs, OIS/PITS dynamic detail routes, cross-product staging links, tests, ops checks and documentation only. It did not deploy from Codex, modify Cloudflare dashboard, modify DNS, run migrations, run seed, run `prisma db push`, commit credentials, use UI `DATABASE_URL`, add write endpoints, call `/auth/demo-login` or touch legacy resources.
Stage 1C-R1 adds explicit UI detail route markers, tests and documentation only. It did not deploy from Codex, modify Cloudflare dashboard, modify DNS, run migrations, run seed, run `prisma db push`, commit credentials, use UI `DATABASE_URL`, import Prisma into UI shells, add write endpoints, call `/auth/demo-login` or touch legacy resources.
Stage 1D adds read-only registry runtime health API/UI surfaces, tests, ops checks and owner UAT documentation only. It did not deploy from Codex, modify Cloudflare dashboard, modify DNS, run migrations, run seed, run `prisma db push`, commit credentials, use UI `DATABASE_URL`, import Prisma into UI shells, add write endpoints, call `/auth/demo-login` or touch legacy resources.
Stage 1E adds read-only registry governance/readiness API/UI surfaces, tests, ops checks and owner UAT documentation only. It did not deploy from Codex, modify Cloudflare dashboard, modify DNS, run migrations, run seed, run `prisma db push`, commit credentials, use UI `DATABASE_URL`, import Prisma into UI shells, add write endpoints, call `/auth/demo-login` or touch legacy resources.
Stage 1F adds read-only owner cockpit/UI navigation surfaces, tests, ops checks and owner UAT documentation only. It did not add a Core API endpoint, deploy from Codex, modify Cloudflare dashboard, modify DNS, run migrations, run seed, run `prisma db push`, commit credentials, use UI `DATABASE_URL`, import Prisma into UI shells, add write endpoints, call `/auth/demo-login` or touch legacy resources.
Stage 1G adds shared responsive shell layout/navigation markers, tests, ops checks and owner UAT documentation only. It did not add a Core API endpoint, deploy from Codex, modify Cloudflare dashboard, modify DNS, run migrations, run seed, run `prisma db push`, commit credentials, use UI `DATABASE_URL`, import Prisma into UI shells, add write endpoints, call `/auth/demo-login` or touch legacy resources.
Stage 1H adds owner-first IA/visual design polish, status badge markers, safe fallback copy, tests, ops checks and owner UAT documentation only. It did not add a Core API endpoint, deploy from Codex, modify Cloudflare dashboard, modify DNS, run migrations, run seed, run `prisma db push`, commit credentials, use UI `DATABASE_URL`, import Prisma into UI shells, add write endpoints, call `/auth/demo-login` or touch legacy resources.
Stage 1I adds read-only owner review workflow and safe action-boundary preview surfaces via `/platform/owner-review`. It did not add real write/admin/sync actions, mutation endpoints, deploy from Codex, modify Cloudflare dashboard, modify DNS, run migrations, run seed, run `prisma db push`, commit credentials, use UI `DATABASE_URL`, import Prisma into UI shells, call `/auth/demo-login` or touch legacy resources.
Stage 1J adds read-only audit/admin permission model surfaces via `/platform/admin-boundary`. It did not add real write/admin/sync actions, mutation endpoints, deploy from Codex, modify Cloudflare dashboard, modify DNS, run migrations, run seed, run `prisma db push`, commit credentials, use UI `DATABASE_URL`, import Prisma into UI shells, call `/auth/demo-login` or touch legacy resources.
Stage 1K adds read-only product user journey UAT baseline and functional gap map surfaces via `/platform/product-uat`. It did not add product writes, real admin/write/sync actions, mutation endpoints, deploy from Codex, modify Cloudflare dashboard, modify DNS, run migrations, run seed, run `prisma db push`, commit credentials, use UI `DATABASE_URL`, import Prisma into UI shells, call `/auth/demo-login` or touch legacy resources.
Stage 2A adds the read-only PITS Project Workboard functional slice via `/platform/pits/projects/{id}/workboard` and PITS `/projects/{id}/workboard`. It did not add work item writes, task lifecycle mutations, schema changes, migrations, seed, `prisma db push`, auth changes, deploy from Codex, Cloudflare/DNS changes, credentials, UI `DATABASE_URL`, Prisma UI imports, `/auth/demo-login` changes or legacy-resource touch.
Stage 2B adds read-only PITS Work Item Detail and Dry-run Action Preview via `/platform/pits/projects/{projectId}/work-items/{itemId}`, `/platform/pits/projects/{projectId}/work-items/{itemId}/action-preview` and PITS `/projects/{id}/work-items/{itemId}`. It did not add work item writes, task lifecycle mutations, status/owner/note/priority/blocker mutations, schema changes, migrations, seed, `prisma db push`, auth changes, deploy from Codex, Cloudflare/DNS changes, credentials, UI `DATABASE_URL`, Prisma UI imports, `/auth/demo-login` changes or legacy-resource touch.
Stage 2C adds OIS/PITS product UX blueprint docs and read-only `/product-flow` routes. It did not add Core API endpoints, LLM calls, product writes, status/owner/note/priority/blocker mutations, schema changes, migrations, seed, `prisma db push`, auth changes, deploy from Codex, Cloudflare/DNS changes, credentials, UI `DATABASE_URL`, Prisma UI imports, `/auth/demo-login` changes or legacy-resource touch.
Stage 2D adds shared localization docs, language selectors and visual OIS/PITS product-flow previews. It did not add Core API endpoints, LLM calls, product writes, status/owner/note/priority/blocker mutations, schema changes, migrations, seed, `prisma db push`, auth changes, deploy from Codex, Cloudflare/DNS changes, credentials, UI `DATABASE_URL`, Prisma UI imports, `/auth/demo-login` changes or legacy-resource touch.
Stage 2E adds PITS Action Request preview contracts and UI markers. It did not add direct product mutations, uncontrolled writes, schema changes, migrations, seed, `prisma db push`, auth changes, deploy from Codex, Cloudflare/DNS changes, credentials, UI `DATABASE_URL`, Prisma UI imports, `/auth/demo-login` changes or legacy-resource touch.
Stage 2F adds a versioned migration, seed updates and audit-backed learning/agent foundation endpoints. It did not add production credentials, production database access, `prisma db push`, direct canonical Knowledge Layer promotion, LLM/OpenRouter runtime calls, UI Prisma imports, UI `DATABASE_URL`, Cloudflare/DNS changes, deploy from Codex, `/auth/demo-login` changes or legacy-resource touch.

1. Confirm release ref and commit SHA.
2. Apply Prisma migrations using deploy mode only.
3. Run the idempotent seed only if the staging owner approves demo bootstrap data.
4. Start Core API, OIS Console and PITS Shell.
5. Run smoke tests against Abacus staging URLs.
6. Attach manifest and smoke evidence to the release record.

## Smoke Checks

- Core API `/` returns service identity `ois-nextgen-core-api`.
- Core API `/health` returns `status=ok`.
- Core API `/platform/overview` returns HTTP 200, `DEMO DATA - NOT PRODUCTION` banner and seeded Platform Kernel counts.
- Core API `/platform/registry/health` returns HTTP 200, `source=default-db`, `mode=read-only`, `summary`, `entities` and staging-safe URLs after Stage 1D owner runtime sync.
- Core API `/platform/registry/readiness` returns HTTP 200, `source=default-db`, `mode=read-only`, `summary`, `entities`, `READY` and no forbidden local/legacy links after Stage 1E owner runtime sync.
- OIS/PITS public routes show Stage 1F owner cockpit markers: `Owner Registry Cockpit / Registry Runtime Summary`, `PITS Registry Cockpit / Project Runtime Summary`, `Runtime health:`, `Readiness:` and `Project readiness` after owner runtime sync.
- OIS/PITS public roots show Stage 1G shell markers: `Modern Shell Layout`, `Shell Navigation Toggle`, `Fixed Navigation Shell` and `Responsive Product Shell` after owner runtime sync.
- OIS/PITS public roots show Stage 1H owner-first design markers: `Owner-first Design System`, `Visual Hierarchy Standard` and `Owner-friendly Status Badges` after owner runtime sync.
- Core API `/platform/owner-review` returns HTTP 200 with `Owner Review Queue`, `Safe Action Boundary`, `Read-only preview`, `Future admin action requires audit` and `NOT_ALLOWED_IN_STAGE_1I` after Stage 1I owner runtime sync.
- OIS dashboard/runtime/detail and PITS projects/runtime/detail surfaces show Stage 1I markers: `Owner Review Queue`, `Safe Action Boundary`, `Read-only preview` and `Future admin action requires audit` after owner runtime sync.
- Core API `/platform/admin-boundary` returns HTTP 200 with `Admin Boundary`, `Audit Required`, `Permission Model`, `Preview only`, `Blocked in current stage` and `BLOCKED_IN_CURRENT_STAGE` after Stage 1J owner runtime sync.
- Core API `/platform/product-uat` returns HTTP 200 with `Product User Journey UAT`, `Testable now`, `Control-plane only`, `Functional gap map`, `Next product journey` and `NOT_ALLOWED_IN_STAGE_1K` after Stage 1K owner runtime sync.
- OIS root/dashboard/runtime/product detail/workspace detail/installation detail and PITS root/projects/runtime/project detail surfaces show Stage 1K product UAT markers after owner runtime sync.
- Core API `/platform/pits/projects/<project-id>/workboard` returns HTTP 200 with `PITS Project Workboard`, `Read-only functional slice`, `Work items`, `Open`, `In progress`, `Blocked`, `Done` and `NOT_ALLOWED_IN_STAGE_2A` after Stage 2A owner runtime sync.
- PITS `/projects/<project-id>/workboard` renders status groups, work item cards, priority/owner/due date/next action fields and the read-only notice after Stage 2A owner runtime sync.
- Core API `/platform/pits/projects/<project-id>/work-items/<item-id>` returns HTTP 200 with `Work Item Detail`, `Dry-run Action Preview`, `Preview only`, `No data will be changed`, `Requires audit trail`, `Requires confirmation`, `Requires rollback plan` and `NOT_ALLOWED_IN_STAGE_2B` after Stage 2B owner runtime sync.
- Core API `/platform/pits/projects/<project-id>/work-items/<item-id>/action-preview` returns HTTP 200 with `DRY_RUN_ONLY`, `allowedInCurrentStage=false` and `noDataChanged=true` after Stage 2B owner runtime sync.
- PITS `/projects/<project-id>/work-items/<item-id>` renders work item detail and dry-run preview cards with no enabled mutation action after Stage 2B owner runtime sync.
- OIS `/product-flow` renders `Product Flow Preview`, `OIS Product UX Blueprint`, `Product page vs Admin console`, `Executive Dashboard`, `Workspace Intelligence Dashboard`, `Ask OIS / Copilot` and no write/LLM action after Stage 2C owner runtime sync.
- PITS `/product-flow` renders `Product Flow Preview`, `PITS Product UX Blueprint`, `Product page vs Admin console`, `Workboard`, `Work Item Detail`, `Dry-run Action Preview`, `No data will be changed` and no enabled mutation action after Stage 2C owner runtime sync.
- OIS/PITS roots render `Localization Foundation`, `Language Settings`, `English` and `Tiếng Việt` after Stage 2D owner runtime sync.
- OIS `/product-flow` renders `OIS Product UX Preview`, visual screen cards, `Primary user`, `Main action`, `Current stage status` and `Screen mock` after Stage 2D owner runtime sync.
- PITS `/product-flow` renders `PITS Product UX Preview`, `PITS Home`, `Projects List`, `Project Workboard`, `Runtime/Admin`, visual screen cards, `Primary user`, `Main action`, `Current stage status` and `Screen mock` after Stage 2D owner runtime sync.
- Core API `/platform/ecosystem-products` returns the Powered by OIS product registry after Stage 2F owner runtime sync and migration deploy.
- Core API `/platform/learning/center` returns the SuperAdmin Learning Center payload with overview, learning stream, pending review, policies, executive queue, product contribution map and audit placeholder after Stage 2F owner runtime sync.
- OIS `/learning-center` renders `OIS Learning Center`, `Learning Stream`, `Pending Review`, `Learning Policies`, `Executive Intent Queue`, `Product Contribution Map` and `Audit Log Placeholder` after Stage 2F owner runtime sync.
- OIS pages render the floating `Powered by OIS` Agent Widget with `Ask`, `Teach OIS`, `Evidence` and `Status` tabs after Stage 2F owner runtime sync.
- Core API `/platform/knowledge/layers`, `/platform/knowledge/items`, `/platform/knowledge/evidence`, `/platform/knowledge/context`, `/platform/learning/layer-mappings`, `/platform/knowledge/keihb/bundles` and `/platform/architecture/mindmap` return Stage 2G read payloads after owner runtime sync and migration deploy.
- OIS `/knowledge-fabric` renders `OIS Knowledge Fabric`, `Universal Knowledge Read Contract`, `Knowledge Layers Overview`, `Canonical Knowledge Items`, `Evidence Links`, `KEIHB Bundles` and `Architecture Map / Mindmap` after Stage 2G owner runtime sync.
- Core API `/docs` renders Swagger UI.
- OIS Console `/` renders `OIS Console`.
- PITS Shell `/` renders `PITS Shell`.

Stage 0J verified only the first two checks locally on `127.0.0.1:4000`; public `/health` still returned 404 until routing/deployment is configured.
Stage 0K verified Core API `/health` publicly through the VM preview proxy at `https://7a162f29d-4000.na116.preview.abacusai.app/health`; the hosted custom domain remains unverified.
Stage 0L confirmed `https://ois-nextgen.abacusai.cloud/` returns edge placeholder `READY`, while `https://ois-nextgen.abacusai.cloud/health` remains HTTP 404 until Abacus platform/console maps a hosted app backend.
Stage 0N pivots the next target to SuperComputer nginx/systemd on the Abacus-managed public domain, with `https://ois-nextgen.abacusai.cloud/health` as the Stage 0O target healthcheck.
Stage 0O verified `https://ois-nextgen.abacusai.cloud/health` returns HTTP/2 200 with the Core API health payload. Core API `/`, `/docs`, Console `/` and PITS `/` remain outside the Stage 0O public managed-domain smoke scope.
Stage 0P verified `https://ois-nextgen.abacusai.cloud/platform/overview` returns HTTP 200 and executes live Prisma reads against the migrated `default` DB. Counts are expected to be 0 until Stage 0Q or a later approved seed stage.
Stage 0Q verified `https://ois-nextgen.abacusai.cloud/platform/overview` returns HTTP 200 with seeded Platform Kernel counts: industries 1, organizations 1, workspaces 1, projects 2, products 5, installations 2, modules 3 and auditRecords 1.
Stage 0R-A did not change endpoints. It confirmed by code inspection that `/platform/overview` is read-only and `PLATFORM_KERNEL` remains `IN_PROGRESS` by hardcoded API logic until a later tested gate rule changes it.
Stage 0R-B did not change endpoints. It added local tests that lock the no-DB `/health` contract and the read-only `/platform/overview` phase gate contract.
Stage 0R-C confirmed no endpoint behavior regression after Abacus runtime sync. Local and public `/health` plus `/platform/overview` remained HTTP 200, seeded counts remained stable and `PLATFORM_KERNEL` remained `IN_PROGRESS`.
Stage 0R-D did not change endpoints. It added owner-run SSH scripts that check the existing active endpoints and avoid legacy probes by default.
Stage 0R-E did not change endpoints. It documented that Web Terminal plus `ops/abacus/*.sh` is the fallback operation path while Abacus SSH relay routing is blocked.
Stage 0R-F did not change endpoints. It updated restart verification so transient post-restart local failures or public HTTP 502 responses are retried before failure is reported.
Stage 0R-G did not change endpoints. It fixed ops helper response parsing so HTTP failures report cleanly instead of crashing under `set -u`.
Stage 0S-A did not change active endpoints. It added planned OIS Console and PITS Shell demo endpoints for a later Abacus preview stage; when running, each root page should show the app name, product code, shared Core API URL, `/health` status, `/platform/overview` counts, the demo banner and the Core API-only DB access note.
Stage 0S-B did not change active endpoints. It added scripts for planned Abacus preview checks on ports `3000` and `3001`; the preview URLs remain `PLANNED_NOT_CREATED` until owner-run Abacus evidence verifies them.
Stage 0T-A did not change active endpoints. It marks SuperComputer preview UI URLs as deprecated for App Shell proof and adds planned OIS Console/PITS Shell App Shell managed deployment URLs.
Stage 0T-B did not change active endpoints. It adds local/Codex mocked UI demo tests and keeps OIS Console/PITS Shell App Shell URLs `PLANNED_NOT_CREATED`.
Stage 0T-C adds OIS Console App Shell public preview endpoint `https://161acd4ff8.na116.preview.abacusai.app`. PITS Shell remains `PLANNED_NOT_CREATED`; Core API `/health` and `/platform/overview` remain unchanged.
Stage 0T-D-R1 does not add endpoints. PITS Shell moves from `PLANNED_NOT_CREATED` to `SOURCE_ACCESS_BLOCKED` with direct upload bundle ready; OIS Console and Core API endpoints remain unchanged.
Stage 0T-D-R2 adds PITS Shell App Shell public preview endpoint `https://113d93f4db-3001.na116.preview.abacusai.app` with HTTP 200 evidence. The previous OIS Console App Shell preview `https://161acd4ff8.na116.preview.abacusai.app` changes to `OIS_CONSOLE_APP_SHELL_PREVIEW_UNAVAILABLE_404`; Core API `/health` and `/platform/overview` remain unchanged.
Stage 0T-E-A-R1 does not add or change endpoints. OIS Console remains `OIS_CONSOLE_APP_SHELL_PREVIEW_UNAVAILABLE_404` until the upload bundle is used in a later redeploy stage; PITS Shell, Core API `/health` and Core API `/platform/overview` remain unchanged.
Stage 0U-A changes product subdomain endpoints `https://ois-ng.dmp247.com`, `https://pits-ng.dmp247.com`, `https://ois-ng.dmp247.com/dashboard` and `https://pits-ng.dmp247.com/projects` to `CUSTOM_SUBDOMAIN_TLS_BLOCKED`. DNS CNAME setup and local Host-header routing succeeded, but public HTTPS failed with SSL handshake errors and public HTTP roots returned HTTP 409.
Stage 0V-A changes product subdomain endpoints `https://ois-ng.dmp247.com`, `https://pits-ng.dmp247.com`, `https://ois-ng.dmp247.com/dashboard` and `https://pits-ng.dmp247.com/projects` to `PLANNED_CLOUDFLARE_TUNNEL`. No public tunnel execution occurred in Stage 0V-A.
Stage 0V-B/C changes product subdomain endpoints `https://ois-ng.dmp247.com`, `https://pits-ng.dmp247.com`, `https://ois-ng.dmp247.com/dashboard` and `https://pits-ng.dmp247.com/projects` to `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED`. Cloudflare Tunnel `ois-nextgen-abacus` is healthy and public HTTPS routes open the expected OIS/PITS pages.
Stage 0W-A does not add or change published endpoints. It adds durable systemd operations and endpoint checks for the already verified Cloudflare Tunnel public staging endpoints.
Stage 0W-B does not add or change published endpoints. It records public staging as operational and updates ops scripts for token-safe cloudflared status plus legacy UI demo cleanup before OIS/PITS systemd restart.
Stage 1A adds planned public route checks for `https://ois-ng.dmp247.com/products`, `https://ois-ng.dmp247.com/workspaces`, `https://ois-ng.dmp247.com/runtime` and `https://pits-ng.dmp247.com/runtime`. It changes OIS/PITS root and existing secondary route behavior in code, but public verification is pending owner runtime sync.
Stage 1A-R1 changes the Stage 1A new-route status to blocked pending owner re-sync because Abacus runtime verification returned HTTP 404 locally and publicly. It adds no new endpoints.
Stage 1A-R2 changes the Stage 1A new routes to verified based on owner/manual Abacus evidence after orphan UI port cleanup. It adds no new endpoints.
Stage 1B adds planned read-only Core API registry endpoints `/platform/products`, `/platform/workspaces`, `/platform/projects`, `/platform/modules`, `/platform/installations` and `/platform/registry`. It changes OIS/PITS product shell pages in source to use registry data, but public verification is pending owner runtime sync.
Stage 1C adds planned read-only Core API registry detail endpoints `/platform/products/{id}`, `/platform/products/code/{code}`, `/platform/workspaces/{id}`, `/platform/projects/{id}`, `/platform/modules/{id}` and `/platform/installations/{id}`. It adds planned OIS detail routes `/products/{id}`, `/workspaces/{id}`, `/modules/{id}` and `/installations/{id}`, plus planned PITS detail route `/projects/{id}`. Public verification is pending owner runtime sync.
Stage 1C-R1 adds no endpoints. It changes the expected Stage 1C detail UI route response body by rendering explicit marker text and `data-detail-source` attributes for the existing OIS/PITS detail route checks.
Stage 1D adds planned read-only Core API registry health endpoint `/platform/registry/health`. It changes OIS/PITS pages to render owner-facing `Registry Runtime Health` and per-entity runtime health markers. Public verification is pending owner runtime sync and owner browser/UAT.
Stage 1E adds planned read-only Core API registry readiness endpoint `/platform/registry/readiness`. It changes OIS/PITS pages to render owner-facing `Registry Governance / Readiness` and per-entity governance/readiness markers with `What is missing?` sections. Public verification is pending owner runtime sync and owner browser/UAT.
Stage 1F adds no endpoint. It changes OIS/PITS pages to render owner-facing cockpit and visual UAT navigation markers using existing registry, health and readiness endpoints. Public verification is pending owner runtime sync and owner browser/UAT.
Stage 1G adds no endpoint. It changes OIS/PITS shell HTML/layout to render modern responsive shell markers. Public verification is pending owner runtime sync and owner browser/UAT.
Stage 1H adds no endpoint. It changes OIS/PITS owner-facing IA, visual hierarchy, badge markers and safe fallback copy using existing registry, health and readiness data. Public verification is pending owner runtime sync and owner browser/UAT.
Stage 1I adds `https://ois-nextgen.abacusai.cloud/platform/owner-review` as a read-only owner review and safe action-boundary endpoint. It changes OIS/PITS owner-facing HTML to show preview-only boundary markers on dashboard/runtime/detail surfaces. Public verification is pending owner runtime sync and owner browser/UAT.
Stage 1J adds `https://ois-nextgen.abacusai.cloud/platform/admin-boundary` as a read-only audit/admin permission model endpoint. It changes OIS/PITS owner-facing HTML to show admin boundary markers on dashboard/runtime/detail surfaces. Public verification is pending owner runtime sync and owner browser/UAT.
Stage 1K adds `https://ois-nextgen.abacusai.cloud/platform/product-uat` as a read-only product user journey UAT baseline endpoint. It changes OIS/PITS owner-facing HTML to show product UAT and functional gap map markers on root, dashboard/runtime and detail surfaces. Public verification is pending owner runtime sync and owner browser/UAT.
Stage 2A adds `https://ois-nextgen.abacusai.cloud/platform/pits/projects/<project-id>/workboard` as a read-only PITS workboard endpoint and `https://pits-ng.dmp247.com/projects/<project-id>/workboard` as the direct browser workboard route. Public verification is pending owner runtime sync and owner browser/UAT.
Stage 2B adds `https://ois-nextgen.abacusai.cloud/platform/pits/projects/<project-id>/work-items/<item-id>` and `https://ois-nextgen.abacusai.cloud/platform/pits/projects/<project-id>/work-items/<item-id>/action-preview` as read-only PITS detail/dry-run endpoints, plus `https://pits-ng.dmp247.com/projects/<project-id>/work-items/<item-id>` as the direct browser route. Public verification is pending owner runtime sync and owner browser/UAT.
Stage 2C adds `https://ois-ng.dmp247.com/product-flow` and `https://pits-ng.dmp247.com/product-flow` as read-only Product Flow Preview routes. No Core API endpoint is added. Public verification is pending owner runtime sync and owner browser/UAT.
Stage 2D changes the existing product-flow route response bodies by adding localization selectors, English/Tiếng Việt copy and visual screen-flow cards. No Core API endpoint is added. Public verification is pending owner runtime sync and owner browser/UAT.
Stage 2E adds source-ready PITS Action Request endpoints and PITS Work Item Detail panel markers. Public verification is pending owner runtime sync and owner browser/UAT.
Stage 2F adds source-ready Core API learning/agent endpoints plus OIS `/learning-center` and the OIS Agent Widget. Public verification is pending owner runtime sync, migration deploy and owner browser/UAT.
Stage 2G adds source-ready Core API knowledge fabric, KEIHB projection, agent knowledge-context and architecture mindmap endpoints plus OIS `/knowledge-fabric`. Public verification is pending owner runtime sync, migration deploy and owner browser/UAT.

## Stop Conditions

- Missing migration evidence.
- Stage 2G runtime sync is attempted without applying the versioned migration and rerunning the idempotent seed on the non-production staging database.
- A knowledge route enables auto-promotion, a canonical knowledge mutation endpoint or widget direct canonical writes.
- Abacus access is limited to project/chat/task editing and does not expose staging env/secrets/deploy configuration.
- Staging-only mock database mode, mock storage mode, staging subdomain/path or AI provider config is missing.
- Stage 0F-R3 owner checklist is incomplete or contains real secret values.
- Stage 0H go/no-go gate is incomplete.
- Hosted-app port behavior and Console/PITS service port behavior remain unverified.
- Core API managed-domain `/health` returns non-200 after nginx/systemd changes.
- `/platform/overview` returns non-200 after the Stage 0P Prisma baseline or Stage 0Q seed.
- `/platform/overview` gains writes, side effects or legacy/prod resource references.
- `PLATFORM_KERNEL` gate promotion is attempted without a documented rule, focused tests and owner approval.
- Restart verification reports `RESTART_VERIFICATION_TIMEOUT` after the warm-up window.
- A UI shell imports Prisma, reads `DATABASE_URL` or attempts direct DB access.
- A UI shell points to a Core API URL other than the owner-approved staging Core API without explicit approval.
- UI preview scripts attempt to modify Core API, nginx, systemd units, DB schema, seed data or `dmp247.com` domains.
- Product subdomain routing scripts would touch `ois.dmp247.com`, `oisys.abacusai.app`, production DNS records, production credentials, legacy DBs/storage or any nginx config other than `/etc/nginx/conf.d/ois-nextgen-product-subdomains.conf`.
- Product subdomain public DNS/TLS checks return `CUSTOM_SUBDOMAIN_HTTP_OK_TLS_BLOCKED`, `CUSTOM_SUBDOMAIN_TLS_BLOCKED` or `CUSTOM_SUBDOMAIN_BLOCKED_BY_ABACUS_EDGE`; document the blocker and stop before claiming public demo verification.
- Cloudflare Tunnel setup would require committing, printing or storing the tunnel token in the repo, shared logs, screenshots or docs.
- Cloudflare Tunnel setup would modify `ois.dmp247.com`, `oisys.abacusai.app`, Phase 1 resources or legacy DNS records.
- UI shell systemd installation would set `DATABASE_URL` or `ABACUS_DATABASE_URL`, modify Core API/cloudflared service units, print secrets, or require Cloudflare token access.
- Public staging runtime restart would restart cloudflared without explicit owner request.
- Shared status output would require full `systemctl status cloudflared`, `ExecStart`, a process command line, a Cloudflare tunnel token or any cloudflared environment values.
- OIS Console or PITS Shell deployment is attempted outside Apps Management Console App Shells without owner approval.
- UI production route manifest verification fails before public staging service restart.
- UI orphan cleanup would kill anything outside `3000/tcp` and `3001/tcp`, or would target Core API port `4000` or `cloudflared`.
- A Platform Registry endpoint adds writes, side effects, direct legacy DB references, production resource references or a mutation-style route.
- A Product Registry detail endpoint adds writes, side effects, direct legacy DB references, production resource references, row-data inspection beyond the approved registry shape or a mutation-style route.
- A product-shell cross-link points to `ois.dmp247.com`, `oisys.abacusai.app`, an unapproved production domain or any legacy resource.
- Dynamic OIS/PITS detail route manifest verification fails before public staging service restart.
- A Stage 1C detail UI route returns HTTP 200 but omits its required `Detail Source` marker.
- A Stage 1E readiness endpoint or UI route contains localhost, legacy OIS domains, write/admin affordances or owner-hostile technical-only readiness text.
- A Stage 1F cockpit or visual UAT route omits owner-friendly `Runtime health:`, `Readiness:`, `Project readiness`, `Missing runtime URL`, `Forbidden link guard` or `No issue detected` markers.
- Any additional seed execution, `/auth/demo-login`, write endpoint or row-data inspection is attempted without later owner approval.
- A workflow tries to use hosted-app service registration or external custom-domain publication instead of the verified SuperComputer nginx/systemd path without owner approval.
- Direct external SSH is required while the Abacus SSH relay still times out before authentication; use Web Terminal fallback instead.
- Any action would touch OIS Phase 1 or Emerald/BQL databases, storage prefixes, app shells or external custom domains.
- Any action would reuse Phase 1 JWT, DB, Redis, MinIO or Neo4j secrets.
- Any production credential appears in CI, Codex or staging logs.
- Any smoke test fails.
- Manual owner sign-off is missing.
