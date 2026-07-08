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
| `safe-restart-core-api.sh` | Restarts `ois-nextgen-core-api`, waits for local `/health`, then verifies public `/health` and local/public `/platform/overview`. | Yes, service restart only. |
| `runtime-sync.sh` | Fetches/pulls the integration branch, runs install/lint/typecheck/test, cleans generated OIS/PITS `.next` folders before build, verifies UI route manifests, then restarts Core API or all public staging services. | Yes, source sync and service restart only. |
| `start-ui-demo-shells.sh` | Builds and starts OIS Console on port 3000 and PITS Shell on port 3001 as temporary `nohup` demo processes. | Yes, temporary UI demo processes only. |
| `status-ui-demo-shells.sh` | Checks temporary OIS Console/PITS demo PIDs, local HTTP 200 pages, expected shell markers and seeded Core API data; checks preview URLs when `PREVIEW_URL` or `APP_ORIGIN` is available. | No. Read-only. |
| `stop-ui-demo-shells.sh` | Stops only the temporary OIS Console and PITS Shell demo processes recorded by PID files. | Yes, stops UI demo processes only. |
| `restart-ui-demo-shells.sh` | Stops, starts and verifies both temporary UI demo shell processes. | Yes, temporary UI demo processes only. |
| `install-ui-shell-systemd-services.sh` | Installs and starts durable systemd services for OIS Console and PITS Shell public staging shells. | Yes, UI systemd units only. |
| `uninstall-ui-shell-systemd-services.sh` | Stops, disables and removes only the OIS Console/PITS Shell public staging systemd units. Requires `--confirm`. | Yes, UI systemd units only. |
| `restart-public-staging-runtime.sh` | Restarts Core API, stops OIS/PITS UI services, stops legacy temporary UI demo processes, removes only orphan listeners on `3000/tcp` and `3001/tcp`, starts UI services, then verifies local/public staging endpoints. Does not restart `cloudflared` unless `--include-cloudflared` is passed. | Yes, service restart and UI port cleanup only. |
| `status-public-staging-runtime.sh` | Checks Core API, OIS/PITS UI services, token-safe `cloudflared` status, local loopback URLs, public staging URLs, Stage 1B registry endpoints, Stage 1C registry detail routes, Stage 1D health markers, Stage 1E readiness markers, Stage 1F cockpit/UAT markers, Stage 1G shell markers, Stage 1H owner-first design markers, Stage 1I owner-review safe action-boundary markers, Stage 1J audit/admin permission model markers, Stage 1K product UAT/gap-map markers, Stage 2A/2B PITS workboard/detail markers and Stage 2C product-flow markers. | No. Read-only. |
| `check-public-staging-endpoints.sh` | Checks public Core API, registry, registry health, registry readiness, owner review, admin boundary, product UAT, PITS workboard/detail, OIS/PITS product-flow and OIS/PITS staging endpoints for HTTP 200, product markers, Core API URL, seeded counts, Stage 1F cockpit/UAT markers, Stage 1G shell markers, Stage 1H owner-first design markers, Stage 1I safe action-boundary markers, Stage 1J admin/audit permission markers, Stage 1K product journey/gap-map markers, Stage 2A/2B workboard/detail markers, Stage 2C product-flow markers and forbidden localhost/legacy links on read-only surfaces. | No. Read-only. |
| `verify-ui-route-manifests.sh` | Checks production `.next` route manifests and server entries for every Stage 1A route plus Stage 1C dynamic detail routes, Stage 2A/2B PITS routes and Stage 2C product-flow routes. | No. Read-only build artifact check. |
| `enable-product-subdomain-demo-routes.sh` | Adds a dedicated nginx host-routing config for `ois-ng.dmp247.com` -> port 3000 and `pits-ng.dmp247.com` -> port 3001. | Yes, nginx config only. |
| `status-product-subdomain-demo-routes.sh` | Checks local Host-header product subdomain routing and optional public DNS/TLS routes. | No. Read-only. |
| `disable-product-subdomain-demo-routes.sh` | Removes only the Stage 0U-A managed nginx product-subdomain config. | Yes, nginx config only. |
| `package-pits-shell-upload-bundle.sh` | Creates `artifacts/abacus/pits-shell-abacus-upload-bundle.zip` for direct PITS Shell App Shell source upload. | No. Local packaging only. |
| `rollback-core-api-nginx-poc.sh` | Prints the Stage 0O rollback plan by default. Requires `--confirm-rollback` to stop/disable service and remove nginx/systemd POC files. | Yes, destructive only with explicit confirmation. |
| `lib-core-api-checks.sh` | Shared helper for health/overview validation and restart readiness retry logic. | No direct use; sourced by scripts. |
| `lib-ui-demo-shells.sh` | Shared helper for temporary UI demo shell start/stop/status, preview URL inference and page marker/count validation. | No direct use; sourced by scripts. |
| `lib-public-staging-runtime.sh` | Shared helper for durable public staging runtime service and endpoint checks. | No direct use; sourced by scripts. |
| `self-test-core-api-checks.sh` | No-network self-test for `lib-core-api-checks.sh` response parsing under `set -u`. | No. Local parser test only. |

## UI Demo Shells

Stage 0S-B adds temporary preview operations for two separate UI shells:

| Shell | Package | Port | Required Core API URL |
|---|---|---:|---|
| OIS Console | `@ois/ois-console` | 3000 | `https://ois-nextgen.abacusai.cloud` |
| PITS Shell | `@ois/pits-shell` | 3001 | `https://ois-nextgen.abacusai.cloud` |

The UI demo scripts intentionally use `nohup` plus PID files under `.abacus-ui-demo/` instead of systemd. This is temporary preview/demo operation only and does not modify nginx, the Core API systemd service, DB schema, seed data or legacy resources.

Safe environment passed to both UI shells:

- `CORE_API_URL=https://ois-nextgen.abacusai.cloud`
- `NEXT_PUBLIC_CORE_API_URL=https://ois-nextgen.abacusai.cloud`
- `NEXT_TELEMETRY_DISABLED=1`
- `PORT=3000` for OIS Console
- `PORT=3001` for PITS Shell

The scripts explicitly unset `DATABASE_URL` and `ABACUS_DATABASE_URL` for UI shell build/start commands.

Start and verify both UI demo shells:

```sh
bash ops/abacus/start-ui-demo-shells.sh
```

Check status:

```sh
bash ops/abacus/status-ui-demo-shells.sh
```

Stop only the UI demo shells:

```sh
bash ops/abacus/stop-ui-demo-shells.sh
```

Restart and verify:

```sh
bash ops/abacus/restart-ui-demo-shells.sh
```

Expected local URLs:

- `http://127.0.0.1:3000/` for OIS Console.
- `http://127.0.0.1:3001/` for PITS Shell.

Expected Abacus preview URLs, when `PREVIEW_URL` or `APP_ORIGIN` is available:

- `<preview-base>-3000.../` for OIS Console.
- `<preview-base>-3001.../` for PITS Shell.

The status script verifies HTTP 200, product markers and seeded Platform Kernel counts in each UI page. It does not probe legacy endpoints.

## Product Subdomain Routing Demo

Stage 0U-A adds a SuperComputer nginx host-routing demo for owner-approved staging subdomains:

| Host | Nginx upstream | Product |
|---|---|---|
| `ois-ng.dmp247.com` | `http://127.0.0.1:3000` | OIS Console |
| `pits-ng.dmp247.com` | `http://127.0.0.1:3001` | PITS Shell |

DNS principle:

- DNS CNAME maps hostnames only, not URL paths.
- `ois-ng.dmp247.com` may CNAME to `ois-nextgen.abacusai.cloud`.
- `pits-ng.dmp247.com` may CNAME to `ois-nextgen.abacusai.cloud`.
- DNS cannot map `ois-ng.dmp247.com` to `ois-nextgen.abacusai.cloud/ois`.
- Path and product routing are nginx/app concerns.

Owner Web Terminal sequence:

```sh
cd /home/ubuntu/ois-nextgen
bash ops/abacus/start-ui-demo-shells.sh
bash ops/abacus/enable-product-subdomain-demo-routes.sh
bash ops/abacus/status-product-subdomain-demo-routes.sh
```

Expected local Host-header success label:

```text
SUPERCOMPUTER_PRODUCT_SUBDOMAIN_LOCAL_ROUTING_READY
```

After owner-controlled DNS CNAME records are configured:

```sh
bash ops/abacus/status-product-subdomain-demo-routes.sh --include-public
```

Public outcome labels:

- `SUPERCOMPUTER_PRODUCT_SUBDOMAIN_PUBLIC_DEMO_VERIFIED`
- `CUSTOM_SUBDOMAIN_HTTP_OK_TLS_BLOCKED`
- `CUSTOM_SUBDOMAIN_TLS_BLOCKED`
- `CUSTOM_SUBDOMAIN_BLOCKED_BY_ABACUS_EDGE`

Disable only these demo routes:

```sh
bash ops/abacus/disable-product-subdomain-demo-routes.sh
```

These scripts do not modify DNS, `ois.dmp247.com`, `oisys.abacusai.app`, Core API service files, DB schema, seed data, production credentials or legacy resources.

## Cloudflare Tunnel Custom Subdomain Plan

Stage 0V-A documents the Cloudflare Tunnel path for public custom staging subdomains after Abacus confirmed SuperComputer custom hostnames are not supported directly.

Stage 0V-B/C verifies tunnel `ois-nextgen-abacus` is healthy with 1 active replica, 2 routes and `cloudflared` version `2026.6.1`.

Verified routes:

| Public hostname | Tunnel target |
|---|---|
| `https://ois-ng.dmp247.com` | `http://127.0.0.1:3000` |
| `https://pits-ng.dmp247.com` | `http://127.0.0.1:3001` |
| `https://api-ng.dmp247.com` | Optional later `http://127.0.0.1:4000` route. |

`https://ois-ng.dmp247.com/dashboard` opens OIS Platform Overview, and `https://pits-ng.dmp247.com/projects` opens PITS Project Selector.

Do not paste tunnel tokens, print tunnel tokens, commit connector credentials or recreate DNS records from this README. Cloudflare connector/runtime state lives on the Abacus VM and Cloudflare dashboard only. Use `docs/deployment/CLOUDFLARE_TUNNEL_CUSTOM_SUBDOMAINS.md` for verification and rollback notes.

## Public Staging Runtime Hardening

Stage 0W-A promotes the OIS Console and PITS Shell public staging shells from temporary `nohup` demo processes into durable systemd services. This keeps the already verified Cloudflare Tunnel topology intact while making the app processes restartable and observable.

| Service | Working directory | Port | Public route |
|---|---|---:|---|
| `ois-nextgen-core-api` | Existing Core API service | 4000 | `https://ois-nextgen.abacusai.cloud` |
| `ois-nextgen-ois-console` | `/home/ubuntu/ois-nextgen/apps/ois-console` | 3000 | `https://ois-ng.dmp247.com` |
| `ois-nextgen-pits-shell` | `/home/ubuntu/ois-nextgen/apps/pits-shell` | 3001 | `https://pits-ng.dmp247.com` |
| `cloudflared` | Existing Cloudflare connector | n/a | Tunnel for OIS/PITS public hostnames |

Safe UI service environment:

- `CORE_API_URL=https://ois-nextgen.abacusai.cloud`
- `NEXT_PUBLIC_CORE_API_URL=https://ois-nextgen.abacusai.cloud`
- `NEXT_TELEMETRY_DISABLED=1`
- `PORT=3000` for OIS Console.
- `PORT=3001` for PITS Shell.

The UI systemd units intentionally do not set `DATABASE_URL` or `ABACUS_DATABASE_URL`. They do not modify the Core API service, nginx, DNS or Cloudflare tunnel credentials.

Install and verify durable UI shell services:

```sh
cd /home/ubuntu/ois-nextgen
bash ops/abacus/install-ui-shell-systemd-services.sh
bash ops/abacus/status-public-staging-runtime.sh
bash ops/abacus/check-public-staging-endpoints.sh
```

Restart the public staging runtime after a safe source sync:

```sh
bash ops/abacus/restart-public-staging-runtime.sh
```

This restarts Core API, OIS Console and PITS Shell. It does not restart `cloudflared`.

Restart `cloudflared` only when the owner explicitly asks for it:

```sh
bash ops/abacus/restart-public-staging-runtime.sh --include-cloudflared
```

Remove only the OIS/PITS UI systemd services:

```sh
bash ops/abacus/uninstall-ui-shell-systemd-services.sh --confirm
```

`runtime-sync.sh` remains Core API only by default. To restart all three app services after a pull/build, set:

```sh
PUBLIC_STAGING_RESTART_SCOPE=all bash ops/abacus/runtime-sync.sh
```

To include `cloudflared`, both an all-service restart and the explicit cloudflared flag are required:

```sh
PUBLIC_STAGING_RESTART_SCOPE=all RESTART_CLOUDFLARED=true bash ops/abacus/runtime-sync.sh
```

Stage 0W-B hotfix note:

- Public staging runtime is verified operational after owner execution of Stage 0W-A.
- `status-public-staging-runtime.sh` must not print full `systemctl status cloudflared`; it uses `systemctl is-active` and selected `systemctl show` properties only.
- `restart-public-staging-runtime.sh` stops legacy temporary UI demo processes before restarting OIS/PITS systemd services.
- Port diagnostics for `3000` and `3001` intentionally avoid process command lines and environment values.

Stage 1A product shell route checks:

- OIS Console root, `/dashboard`, `/products`, `/workspaces` and `/runtime`.
- PITS Shell root, `/projects` and `/runtime`.
- New Stage 1A routes are expected to pass after the owner pulls the Stage 1A branch and restarts the public staging runtime.

Stage 1A-R1 route 404 hotfix:

- Stage 1A Abacus verification found HTTP 404 on OIS `/products`, `/workspaces`, `/runtime` and PITS `/runtime` even though root/dashboard/projects passed.
- `runtime-sync.sh` and `install-ui-shell-systemd-services.sh` clean only generated UI `.next` folders before production builds by default.
- `verify-ui-route-manifests.sh` proves the Stage 1A routes exist in `.next/routes-manifest.json` and `.next/server/app/**/page.js`.
- `restart-public-staging-runtime.sh` blocks service restart if route manifest verification fails.

Run the guard directly after a build:

```sh
bash ops/abacus/verify-ui-route-manifests.sh
```

Stage 1A-R2 UI orphan port cleanup:

- Owner/manual Abacus recovery showed Stage 1A-R1 route artifacts were correct, but orphan Next.js processes held ports `3000` and `3001`.
- `restart-public-staging-runtime.sh` now stops `ois-nextgen-ois-console` and `ois-nextgen-pits-shell` before UI start.
- It prints listeners before cleanup, after cleanup and after systemd start.
- If a listener remains while the service is inactive, it prints `ORPHAN_UI_PROCESS_SUSPECTED`.
- It runs `sudo fuser -k 3000/tcp 3001/tcp` only for UI ports `3000` and `3001`.
- It does not kill Core API on port `4000`, does not kill `cloudflared`, and does not print secrets or process command lines.

Restart and verify public staging runtime:

```sh
bash ops/abacus/restart-public-staging-runtime.sh
```

Stage 1B read-only Platform Registry checks:

- Core API adds `/platform/products`, `/platform/workspaces`, `/platform/projects`, `/platform/modules`, `/platform/installations` and `/platform/registry`.
- Each registry endpoint must return HTTP 200 with `source=default-db` and `mode=read-only` after owner runtime sync.
- OIS `/products` should render product/module registry data, including `PITS_RUNTIME_SHELL`.
- OIS `/workspaces` should render organization/workspace/project registry data, including `PMC Org Demo`.
- PITS `/projects` should render project/installation registry data, including `EMERALD_PRECINCT_DEMO`.
- UI shells still use Core API only and do not set or read `DATABASE_URL`.

Verify Stage 1B after source sync:

```sh
bash ops/abacus/status-public-staging-runtime.sh
bash ops/abacus/check-public-staging-endpoints.sh
```

Stage 1C read-only Product Registry detail checks:

- Core API adds read-only detail endpoints for product IDs, product codes, workspaces, projects, modules and installations.
- OIS Console adds `/products/[id]`, `/workspaces/[id]`, `/modules/[id]` and `/installations/[id]`.
- PITS Shell adds `/projects/[id]`.
- Cross-product links use staging defaults `https://ois-ng.dmp247.com` and `https://pits-ng.dmp247.com`.
- `status-public-staging-runtime.sh` and `check-public-staging-endpoints.sh` discover seeded IDs from `/platform/registry` before checking detail routes.
- Detail checks must remain read-only and must not call `/auth/demo-login`, write endpoints, legacy domains or direct DB connections.

Verify Stage 1C after source sync:

```sh
bash ops/abacus/status-public-staging-runtime.sh
bash ops/abacus/check-public-staging-endpoints.sh
```

Stage 1C-R1 detail UI marker hotfix:

- Abacus runtime verification found Stage 1C Core API detail endpoints and route manifests passing, but detail UI checks failed because HTML responses did not include the marker strings expected by the ops scripts.
- Detail routes now render explicit server-rendered marker text plus `data-detail-source`.
- Required markers:
  - OIS `/products/[id]`: `Product Detail Source`
  - OIS `/workspaces/[id]`: `Workspace Detail Source`
  - OIS `/modules/[id]`: `Module Detail Source`
  - OIS `/installations/[id]`: `Installation Detail Source`
- PITS `/projects/[id]`: `Project Detail Source`
- `status-public-staging-runtime.sh` and `check-public-staging-endpoints.sh` continue to use those exact marker strings.

Stage 1D registry runtime health checks:

- Core API adds read-only `/platform/registry/health`.
- OIS Console shows `Registry Runtime Health` on dashboard/products/workspaces/runtime pages.
- OIS Console detail pages show `Product Runtime Health`, `Workspace Runtime Health`, `Module Runtime Health` and `Installation Runtime Health`.
- PITS Shell shows `Registry Runtime Health` on overview/projects/runtime pages.
- PITS Shell project details show `Project Runtime Health`.
- `check-public-staging-endpoints.sh` also verifies the Stage 1D public health surfaces do not contain `localhost`, `127.0.0.1`, `ois.dmp247.com` or `oisys.abacusai.app`.
- Health status is deterministic from registry data. `Reachable` means a staging-safe public URL is configured; the Core API does not probe external UI routes while building the health payload.

Verify Stage 1D after source sync:

```sh
bash ops/abacus/status-public-staging-runtime.sh
bash ops/abacus/check-public-staging-endpoints.sh
```

Stage 1E registry governance/readiness checks:

- Core API adds read-only `/platform/registry/readiness`.
- OIS Console shows `Registry Governance / Readiness` on dashboard/products/workspaces/runtime pages.
- OIS Console detail pages show `Product Governance / Readiness`, `Workspace Governance / Readiness`, `Module Governance / Readiness` and `Installation Governance / Readiness`, each with `What is missing?`.
- PITS Shell shows `Registry Governance / Readiness` on overview/projects/runtime pages.
- PITS Shell project details show `Project Governance / Readiness` with `What is missing?`.
- `status-public-staging-runtime.sh` and `check-public-staging-endpoints.sh` verify the readiness endpoint, UI markers and forbidden local/legacy link absence while preserving Stage 1B/1C/1D checks.
- Readiness status is deterministic from registry data and staging-safe runtime config. The endpoint does not probe external routes, call LLMs, write data, seed data or run migrations.

Verify Stage 1E after source sync:

```sh
bash ops/abacus/status-public-staging-runtime.sh
bash ops/abacus/check-public-staging-endpoints.sh
```

Stage 1F owner registry cockpit visual UAT checks:

- No Core API endpoint is added; the UI reuses `/platform/registry`, `/platform/registry/health` and `/platform/registry/readiness`.
- OIS Console root/dashboard/products/workspaces/runtime pages show `Owner Registry Cockpit / Registry Runtime Summary`, card-level `Runtime health:` and `Readiness:` markers, missing runtime URL guard status and forbidden link guard status.
- OIS Console detail pages show `Owner-facing UAT summary`.
- PITS Shell root/projects/runtime pages show `PITS Registry Cockpit / Project Runtime Summary`, `Project readiness` and card-level `Runtime health:` markers.
- PITS Shell project details show `Owner-facing project UAT summary`.
- `status-public-staging-runtime.sh` and `check-public-staging-endpoints.sh` verify these markers while preserving Stage 1B/1C/1D/1E checks and forbidden local/legacy link absence.

Verify Stage 1F after source sync:

```sh
bash ops/abacus/status-public-staging-runtime.sh
bash ops/abacus/check-public-staging-endpoints.sh
```

Stage 1G modern responsive shell layout checks:

- No Core API endpoint is added; the UI reuses existing registry, health and readiness data.
- OIS Console and PITS Shell roots render `Modern Shell Layout`, `Shell Navigation Toggle`, `Fixed Navigation Shell` and `Responsive Product Shell`.
- OIS Console and PITS Shell share fixed navigation/header behavior, independent content scrolling and responsive hide/show navigation controls.
- Existing Stage 1B/1C/1D/1E/1F markers remain checked separately.
- `status-public-staging-runtime.sh` checks local and public shell markers; `check-public-staging-endpoints.sh` checks public shell markers.

Verify Stage 1G after source sync:

```sh
bash ops/abacus/status-public-staging-runtime.sh
bash ops/abacus/check-public-staging-endpoints.sh
```

Stage 1H owner-first information architecture and visual design system checks:

- No Core API endpoint is added; the UI reuses existing registry, health and readiness data.
- OIS Console and PITS Shell roots render `Owner-first Design System`, `Visual Hierarchy Standard` and `Owner-friendly Status Badges`.
- Status labels use owner-operable language such as `Ready`, `Ready to operate`, `Needs owner review`, `Incomplete`, `Blocked`, `Healthy`, `No issue detected`, `Missing link` and `Missing runtime URL`.
- Empty/fallback states avoid secrets, environment values, stack traces and internal paths while preserving read-only ops markers.
- `status-public-staging-runtime.sh` checks local and public design markers; `check-public-staging-endpoints.sh` checks public design markers.

Verify Stage 1H after source sync:

```sh
bash ops/abacus/status-public-staging-runtime.sh
bash ops/abacus/check-public-staging-endpoints.sh
```

Stage 1I owner review workflow boundary and safe admin action design checks:

- Core API adds read-only `/platform/owner-review`.
- The endpoint derives deterministic review items from existing registry health/readiness data.
- OIS Console dashboard, runtime, product detail, workspace detail and installation detail render `Owner Review Queue`, `Safe Action Boundary`, `Read-only preview` and `Future admin action requires audit`.
- PITS Shell projects, runtime and project detail render the same project-level safe boundary markers.
- No admin/write action is executable in Stage 1I; UI action affordances are disabled preview labels only.
- `status-public-staging-runtime.sh` checks local/public endpoint and UI markers; `check-public-staging-endpoints.sh` checks public endpoint and UI markers.

Verify Stage 1I after source sync:

```sh
bash ops/abacus/status-public-staging-runtime.sh
bash ops/abacus/check-public-staging-endpoints.sh
```

Stage 1J audit trail and admin permission model checks:

- Core API adds read-only `/platform/admin-boundary`.
- The endpoint exposes deterministic roles, permission states, action categories, safety gates, audit requirements, confirmation requirements, rollback requirements, blocked actions, preview-only actions and future admin action plans.
- OIS Console dashboard, runtime, product detail, workspace detail and installation detail render `Admin Boundary`, `Audit Required`, `Permission Model`, `Preview only` and `Blocked in current stage`.
- PITS Shell projects, runtime and project detail render the same project-level admin/audit boundary markers.
- No admin/write action is executable in Stage 1J; UI affordances remain preview-only labels.
- `status-public-staging-runtime.sh` checks local/public endpoint and UI markers; `check-public-staging-endpoints.sh` checks public endpoint and UI markers.

Verify Stage 1J after source sync:

```sh
bash ops/abacus/status-public-staging-runtime.sh
bash ops/abacus/check-public-staging-endpoints.sh
```

Stage 1K product user journey UAT baseline checks:

- Core API adds read-only `/platform/product-uat`.
- The endpoint exposes deterministic OIS/PITS product UAT categories, testable-now surfaces, platform/control-plane-only surfaces, missing product functions, blockers and recommended next journeys.
- OIS Console root, dashboard, runtime, product detail, workspace detail and installation detail render `Product User Journey UAT`, `Testable now`, `Control-plane only`, `Functional gap map` and `Next product journey`.
- PITS Shell root, projects, runtime and project detail render the same product UAT markers while clarifying that current PITS is a project registry/readiness shell, not a true workflow app yet.
- No product write, admin/write action, mutation endpoint, schema change, migration, seed, `prisma db push`, UI `DATABASE_URL`, Prisma UI import or legacy resource touch is allowed.
- `status-public-staging-runtime.sh` checks local/public endpoint and UI markers; `check-public-staging-endpoints.sh` checks public endpoint and UI markers.

Verify Stage 1K after source sync:

```sh
bash ops/abacus/status-public-staging-runtime.sh
bash ops/abacus/check-public-staging-endpoints.sh
```

Stage 2A PITS Project Workboard read-only functional slice checks:

- Core API adds read-only `/platform/pits/projects/<project-id>/workboard`.
- PITS Shell adds `/projects/<project-id>/workboard` and also renders the workboard from project detail.
- Checks verify `PITS Project Workboard`, `Read-only functional slice`, `Work items`, `Open`, `In progress`, `Blocked`, `Done`, `NOT_ALLOWED_IN_STAGE_2A` and forbidden-link boundaries.
- No work item create/edit/delete/status mutation, schema change, migration, seed, `prisma db push`, UI `DATABASE_URL`, Prisma UI import, `/auth/demo-login` change or legacy resource touch is allowed.

Verify Stage 2A after source sync:

```sh
bash ops/abacus/status-public-staging-runtime.sh
bash ops/abacus/check-public-staging-endpoints.sh
```

Stage 2B PITS Work Item Detail and Dry-run Action Preview checks:

- Core API adds read-only `/platform/pits/projects/<project-id>/work-items/<item-id>`.
- Core API adds read-only `/platform/pits/projects/<project-id>/work-items/<item-id>/action-preview`.
- PITS Shell adds `/projects/<project-id>/work-items/<item-id>`.
- Checks verify `Work Item Detail`, `Dry-run Action Preview`, `Preview only`, `No data will be changed`, `Requires audit trail`, `Requires confirmation`, `Requires rollback plan`, `DRY_RUN_ONLY`, `noDataChanged=true` and `NOT_ALLOWED_IN_STAGE_2B`.
- No status/owner/note/priority/blocker mutation, write endpoint, schema change, migration, seed, `prisma db push`, UI `DATABASE_URL`, Prisma UI import, `/auth/demo-login` change or legacy resource touch is allowed.

Verify Stage 2B after source sync:

```sh
bash ops/abacus/status-public-staging-runtime.sh
bash ops/abacus/check-public-staging-endpoints.sh
```

Stage 2C Product UX Blueprint and Screen Flow Draft Gate checks:

- OIS Shell adds read-only `/product-flow`.
- PITS Shell adds read-only `/product-flow`.
- Checks verify `Product Flow Preview`, `OIS Product UX Blueprint`, `PITS Product UX Blueprint`, `Product page vs Admin console`, `Owner approval checklist` and `No write endpoints added`.
- The route manifest guard verifies both product-flow routes in production build artifacts.
- No Core API endpoint, LLM call, status/owner/note/priority/blocker mutation, write endpoint, schema change, migration, seed, `prisma db push`, UI `DATABASE_URL`, Prisma UI import, `/auth/demo-login` change or legacy resource touch is allowed.

Verify Stage 2C after source sync:

```sh
bash ops/abacus/status-public-staging-runtime.sh
bash ops/abacus/check-public-staging-endpoints.sh
```

## PITS Shell Upload Bundle

Stage 0T-D-R1 adds a direct source upload bundle path for PITS Shell because Abacus App Shell deployment reported that external GitHub clone is blocked.

Create the bundle from the repo root:

```sh
bash ops/abacus/package-pits-shell-upload-bundle.sh
```

Output:

```text
artifacts/abacus/pits-shell-abacus-upload-bundle.zip
```

The script packages only `apps/pits-shell`, `packages/shared-ui`, root package/lock/workspace metadata and `tsconfig.base.json`. It refuses env files and excludes generated output, `.git`, secrets, runtime files and unrelated apps/domains/Prisma assets. Do not commit the generated ZIP.

## Restart Grace Window

After `systemctl restart`, systemd can report the service as active before `tsx src/server.ts` has bound port `4000`. During that warm-up gap, local requests can fail and public nginx/Cloudflare can briefly return HTTP 502.

`safe-restart-core-api.sh` now waits up to 30 seconds and retries every 2 seconds:

1. Wait for local `/health` to return HTTP 200.
2. Check public `/health`.
3. Check local `/platform/overview`.
4. Check public `/platform/overview`.

Transient connection failures or HTTP 502 responses during this window are printed as warm-up progress, not immediate failure. A restart is failed only after `RESTART_VERIFICATION_TIMEOUT`.

Output labels:

- `WARMING_UP`
- `LOCAL_HEALTH_READY`
- `PUBLIC_HEALTH_READY`
- `PLATFORM_OVERVIEW_READY`
- `RESTART_VERIFICATION_PASSED`
- `RESTART_VERIFICATION_TIMEOUT`

Optional tuning:

```sh
RESTART_VERIFY_TIMEOUT=30 RESTART_VERIFY_INTERVAL=2 bash ops/abacus/safe-restart-core-api.sh
```

## Helper Self-Test

Run this after changing `lib-core-api-checks.sh`:

```sh
bash ops/abacus/self-test-core-api-checks.sh
```

The self-test stubs `curl` and does not call live endpoints. It verifies:

- Health HTTP 200 body parsing.
- Empty-body HTTP 502 clean failure.
- Curl timeout clean failure.
- Platform overview HTTP 200 body parsing.
- No unbound variables under `set -u`.

## Security Rules

- Do not `cat .env`.
- Do not print `DATABASE_URL`.
- Do not print secrets.
- Do not run `printenv`, `env` or `set -x`.
- Do not print full `systemctl status cloudflared` in shared logs.
- Do not print cloudflared `ExecStart`, process command lines or tunnel token values.
- Do not run `prisma db push`.
- Do not run `prisma migrate dev`.
- Do not run migrations or seed unless a future owner-approved stage explicitly calls for it.
- Do not call write endpoints.
- Do not call `/auth/demo-login`.
- Do not use `DATABASE_URL` in UI shells.
- Do not modify Core API DB/runtime logic from UI demo scripts.
- Do not deploy to `dmp247.com`.
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

Start temporary UI demo shells:

```sh
bash ops/abacus/start-ui-demo-shells.sh
```

Check temporary UI demo shells:

```sh
bash ops/abacus/status-ui-demo-shells.sh
```

Stop temporary UI demo shells:

```sh
bash ops/abacus/stop-ui-demo-shells.sh
```

Install durable OIS/PITS public staging services:

```sh
bash ops/abacus/install-ui-shell-systemd-services.sh
```

Read-only public staging runtime status:

```sh
bash ops/abacus/status-public-staging-runtime.sh
```

Read-only public staging endpoint check:

```sh
bash ops/abacus/check-public-staging-endpoints.sh
```

Restart Core API plus OIS/PITS public staging services:

```sh
bash ops/abacus/restart-public-staging-runtime.sh
```

Uninstall only the OIS/PITS public staging services:

```sh
bash ops/abacus/uninstall-ui-shell-systemd-services.sh --confirm
```

Rollback plan only:

```sh
bash ops/abacus/rollback-core-api-nginx-poc.sh
```

Execute rollback after owner approval:

```sh
bash ops/abacus/rollback-core-api-nginx-poc.sh --confirm-rollback
```
