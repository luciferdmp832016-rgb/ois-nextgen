# Stage 2C - Product UX Blueprint and Screen Flow Draft Gate

## Decision

Stage 2C is source-ready under decision label `PRODUCT_UX_BLUEPRINT_SCREEN_FLOW_DRAFT_READY`.

Expected final label after GitHub CI, Abacus runtime sync and Owner Browser/UAT:

`PRODUCT_UX_BLUEPRINT_SCREEN_FLOW_DRAFT_RUNTIME_VERIFIED`

## Objective

Create a product-level UX blueprint and screen-flow draft gate for OIS and PITS before additional implementation. The stage lets the owner review the intended product experience before Stage 2D or deeper coding.

## Deliverables

- `architecture/ux/PITS_PRODUCT_UX_BLUEPRINT.md`
- `architecture/ux/OIS_PRODUCT_UX_BLUEPRINT.md`
- `architecture/ux/PRODUCT_PAGE_VS_ADMIN_CONSOLE_MAP.md`
- Read-only OIS `/product-flow` route.
- Read-only PITS `/product-flow` route.
- Route manifest and public staging checks for the new preview routes.
- Tests for blueprint docs, product-flow rendering and no write-boundary regression.

## Product Flow Preview Routes

OIS:

- `/product-flow`
- Shows `Product Flow Preview`, `OIS Product UX Blueprint` and `Product page vs Admin console`.
- Drafts Executive Dashboard, Workspace List, Workspace Intelligence Dashboard, Meeting/Document Knowledge Feed, Knowledge Detail, Ask OIS/Copilot and Runtime/Admin.

PITS:

- `/product-flow`
- Shows `Product Flow Preview`, `PITS Product UX Blueprint` and `Product page vs Admin console`.
- Drafts Home, Projects, Project Detail, Workboard, Work Item Detail, Dry-run Action Preview and Runtime/Admin.

## Product vs Admin Boundary

Product pages are daily user workflows. Admin/control-plane pages are owner/operator surfaces for registry, runtime, health, readiness, audit and permission status. Debug/diagnostic pages must not dominate product home experiences.

## What Stage 2C Does Not Do

- Does not add migrations.
- Does not seed.
- Does not run `prisma db push`.
- Does not add write endpoints.
- Does not enable admin actions.
- Does not mutate status, owner, note, priority or blocker data.
- Does not change auth or `/auth/demo-login`.
- Does not touch DNS or Cloudflare.
- Does not add credentials.
- Does not add UI `DATABASE_URL`.
- Does not import Prisma into UI shells.
- Does not touch legacy resources.
- Does not implement Stage 2D.

## Owner Approval Checklist

1. PITS daily workflow starts from project attention and work items, not diagnostics.
2. PITS Projects, Project Detail, Workboard and Work Item Detail drafts are understandable to normal project users.
3. PITS Dry-run Action Preview is clearly non-mutating.
4. OIS daily workflow starts from organizational intelligence, not registry diagnostics.
5. OIS Executive Dashboard, Workspace Intelligence, Knowledge Feed, Knowledge Detail and Ask OIS drafts are understandable to managers.
6. Product pages are clearly separated from admin/control-plane pages.
7. Runtime/debug pages remain available but secondary.
8. Owner approves or comments before Stage 2D starts.

## Proposed Next Implementation Stages

- Stage 2D: Owner-approved product home/list productization, read-only.
- Stage 2E: Product detail/workboard UX polish, read-only.
- Stage 2F: Activity, timeline and evidence/detail concepts, read-only.
- Stage 2G: Write-boundary and intelligence ADRs before mutating or LLM-backed behavior.

## Validation

Required validation for Stage 2C:

- `bash -n ops/abacus/*.sh`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm -r --if-present build`
- `REPO_DIR=$(pwd) bash ops/abacus/verify-ui-route-manifests.sh`
