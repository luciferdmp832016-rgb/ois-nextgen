# Stage 1C-R1 Detail UI Marker Runtime Hotfix

Stage 1C-R1 result: `PRODUCT_REGISTRY_DETAIL_UI_MARKER_HOTFIX_READY`.

Expected owner runtime verification label after Abacus sync: `PRODUCT_REGISTRY_DETAIL_CROSS_LINKING_RUNTIME_VERIFIED`.

## Objective

Fix the Stage 1C UI detail route verification contract after owner/Abacus runtime evidence showed that Core API detail endpoints, route manifests, systemd services and Cloudflare Tunnel were healthy, but local/public UI detail route checks failed because the expected detail page markers were missing from HTML responses.

This is a UI marker/test/docs hotfix only. It does not deploy from Codex, modify Cloudflare dashboard, modify DNS, run migrations, run seed, run `prisma db push`, add write endpoints, use UI `DATABASE_URL`, import Prisma into UI shells, call `/auth/demo-login` or touch legacy resources.

## Runtime Evidence From Owner

Confirmed passing before this hotfix:

- `git pull --ff-only` succeeded on Abacus.
- `pnpm -r --if-present build` passed.
- `ops/abacus/verify-ui-route-manifests.sh` passed.
- Core API registry list endpoints passed.
- Core API detail endpoints passed for product, product code, workspace, project, module and installation.
- Controlled 404 passed.
- OIS/PITS root, list and runtime pages passed.
- systemd services were active.
- `cloudflared` was active.

Observed failures:

| Check | Missing marker |
|---|---|
| `OIS_CONSOLE_LOCAL_PRODUCT_DETAIL` | `Product Detail Source` |
| `OIS_CONSOLE_LOCAL_WORKSPACE_DETAIL` | `Workspace Detail Source` |
| `OIS_CONSOLE_LOCAL_MODULE_DETAIL` | `Module Detail Source` |
| `OIS_CONSOLE_LOCAL_INSTALLATION_DETAIL` | `Installation Detail Source` |
| `PITS_SHELL_LOCAL_PROJECT_DETAIL` | `Project Detail Source` |
| `OIS_CONSOLE_PUBLIC_PRODUCT_DETAIL` | `Product Detail Source` |
| `OIS_CONSOLE_PUBLIC_WORKSPACE_DETAIL` | `Workspace Detail Source` |
| `OIS_CONSOLE_PUBLIC_MODULE_DETAIL` | `Module Detail Source` |
| `OIS_CONSOLE_PUBLIC_INSTALLATION_DETAIL` | `Installation Detail Source` |
| `PITS_SHELL_PUBLIC_PROJECT_DETAIL` | `Project Detail Source` |

Because the ops checker reports `missing marker` only after HTTP 200, this was a UI response-body verification mismatch, not a Core API, route-manifest, service, DNS, Cloudflare or database failure.

## Hotfix

Added explicit server-rendered marker output to OIS Console and PITS Shell detail routes:

```html
<p class="muted detail-source-marker" data-detail-source="Product Detail Source">
  Product Detail Source
</p>
```

Equivalent markers are rendered for:

| Route | Required marker |
|---|---|
| OIS Console `/products/[id]` | `Product Detail Source` |
| OIS Console `/workspaces/[id]` | `Workspace Detail Source` |
| OIS Console `/modules/[id]` | `Module Detail Source` |
| OIS Console `/installations/[id]` | `Installation Detail Source` |
| PITS Shell `/projects/[id]` | `Project Detail Source` |

The marker is visible text and also has a `data-detail-source` attribute, so the existing ops grep contract remains unchanged and local tests lock the attribute contract.

## Published Endpoint Delta

### Added

| Endpoint | Status | Expected result | Evidence |
|---|---|---|---|
| None | N/A | N/A | Stage 1C-R1 changes marker output only. |

### Changed

| Endpoint | Previous status/result | New status/result | Evidence |
|---|---|---|---|
| `https://ois-ng.dmp247.com/products/{id}` | HTTP 200 but missing `Product Detail Source` marker. | Expected HTTP 200 with explicit `Product Detail Source` marker after owner runtime sync. | Stage 1C-R1 source/tests ready. |
| `https://ois-ng.dmp247.com/workspaces/{id}` | HTTP 200 but missing `Workspace Detail Source` marker. | Expected HTTP 200 with explicit `Workspace Detail Source` marker after owner runtime sync. | Stage 1C-R1 source/tests ready. |
| `https://ois-ng.dmp247.com/modules/{id}` | HTTP 200 but missing `Module Detail Source` marker. | Expected HTTP 200 with explicit `Module Detail Source` marker after owner runtime sync. | Stage 1C-R1 source/tests ready. |
| `https://ois-ng.dmp247.com/installations/{id}` | HTTP 200 but missing `Installation Detail Source` marker. | Expected HTTP 200 with explicit `Installation Detail Source` marker after owner runtime sync. | Stage 1C-R1 source/tests ready. |
| `https://pits-ng.dmp247.com/projects/{id}` | HTTP 200 but missing `Project Detail Source` marker. | Expected HTTP 200 with explicit `Project Detail Source` marker after owner runtime sync. | Stage 1C-R1 source/tests ready. |

### Unchanged

| Endpoint | Status | Expected result |
|---|---|---|
| `https://ois-nextgen.abacusai.cloud/health` | `ABACUS_MANAGED_PUBLIC_STAGING` | Core API health remains current. |
| `https://ois-nextgen.abacusai.cloud/platform/overview` | `ABACUS_MANAGED_PUBLIC_STAGING` | DB-backed read-only Platform Overview remains current. |
| Core API Stage 1C detail endpoints | Source-ready/read-only | Runtime already verified by owner before this marker hotfix. |
| `https://ois-ng.dmp247.com` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | OIS Console public staging root remains current. |
| `https://pits-ng.dmp247.com` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | PITS Shell public staging root remains current. |
| `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 live App Shell; do not touch. |
| `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 custom domain; do not touch. |

### Deprecated / Stopped

| Endpoint/process | Status | Reason |
|---|---|---|
| None | N/A | Stage 1C-R1 is a marker hotfix only. |

### Do Not Touch

| Endpoint/resource | Status | Reason |
|---|---|---|
| `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 custom domain. |
| `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 live App Shell. |
| `ois_phase1_dev` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 production-equivalent DB. |
| `emerald_bql_web_dev` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Emerald/BQL legacy DB. |
| Cloudflare tunnel token | Secret | Never document, print, store or commit. |

### Current Test Checklist

| Check | Command | Expected |
|---|---|---|
| UI route manifest guard | `REPO_DIR=$(pwd) bash ops/abacus/verify-ui-route-manifests.sh` | `UI_ROUTE_MANIFEST_CHECK_PASSED`. |
| Public staging status | `bash ops/abacus/status-public-staging-runtime.sh` | Local/public detail routes include the required marker strings. |
| Public staging endpoint smoke | `bash ops/abacus/check-public-staging-endpoints.sh` | Public detail routes include the required marker strings. |

## Safety Statement

- No Cloudflare dashboard change.
- No DNS change.
- No deploy from Codex.
- No migrations.
- No seed.
- No `prisma db push`.
- No credentials committed.
- No UI `DATABASE_URL`.
- No Prisma imports in UI shells.
- No write/mutation endpoints.
- No `/auth/demo-login` call or change.
- No `ois.dmp247.com` modification.
- No `oisys.abacusai.app` modification.
- No legacy DB/storage/resource touch.

## Validation

| Command | Result |
|---|---|
| `bash -n ops/abacus/*.sh` | PASS. |
| `pnpm lint` | PASS. |
| `pnpm typecheck` | PASS. |
| `pnpm test` | PASS. |
| `pnpm -r --if-present build` | PASS. |
| `REPO_DIR=$(pwd) bash ops/abacus/verify-ui-route-manifests.sh` | PASS. |
