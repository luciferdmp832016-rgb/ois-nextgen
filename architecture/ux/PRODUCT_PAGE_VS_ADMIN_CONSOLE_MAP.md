# Product Page vs Admin Console Map

Stage: Stage 2C - Product UX Blueprint and Screen Flow Draft Gate

Decision label: `PRODUCT_UX_BLUEPRINT_SCREEN_FLOW_DRAFT_READY`

## Why This Exists

Owner feedback after Stage 2A and Stage 2B: the current UI still feels too much like console/debug pages. Stage 2C separates daily product workflows from admin, runtime and diagnostics before deeper coding continues.

## Classification Rules

Product pages:

- Used daily by normal product users.
- Show business workflow first.
- Use simple language.
- Are action-oriented.
- Hide registry/runtime/debug details unless needed.
- Current Stage 2C state may be read-only or draft-only.

Admin/control-plane pages:

- Used by owner/admin/operators.
- Show registry, lifecycle, runtime, readiness, audit and permission status.
- Can remain technical but must be clean and safe.
- Never become the primary product home experience.

Debug/diagnostic pages:

- Used for troubleshooting.
- Must not dominate product landing pages.
- Belong under runtime/admin/diagnostics.
- Must never expose secrets, production credentials or legacy unsafe links.

## PITS Page Map

| Page | Product/Admin Classification | Intended user | Current state | Future action |
|---|---|---|---|---|
| PITS Home | Product page | Project operator | Root shell plus Stage 2C preview | Productize as daily attention dashboard |
| Projects List | Product page | Project operator/manager | Read-only selector | Add search/filter/sort after approval |
| Project Detail | Product page with admin panels present | Project operator/manager | Read-only registry-backed detail | Move technical panels lower or to admin area |
| Project Workboard | Product page | Project operator | Stage 2A read-only functional slice | Add board/list/filter before writes |
| Work Item Detail | Product page | Project operator | Stage 2B read-only detail | Add timeline/doc/comment concepts after data model |
| Dry-run Action Preview | Product safety page | Project operator/owner | Stage 2B non-mutating preview | Promote only after audit/confirmation/rollback gates |
| Runtime | Admin/control-plane | Owner/admin/operator | Existing runtime/readiness view | Keep outside daily product path |
| Owner Review/Admin Boundary | Admin/control-plane | Owner/admin/operator | Preview only | Keep as safety gate for future writes |

## OIS Page Map

| Page | Product/Admin Classification | Intended user | Current state | Future action |
|---|---|---|---|---|
| OIS Home / Executive Dashboard | Product page | CEO/manager | Stage 2C blueprint preview | Productize as intelligence overview after approval |
| Workspace List | Product page | CEO/manager | Registry-backed list today | Add data freshness and coverage after ingestion telemetry |
| Workspace Intelligence Dashboard | Product page | CEO/manager | Blueprint only | Add evidence-backed intelligence cards |
| Meeting/Document Knowledge Feed | Product page | Manager | Blueprint only | Add after ingestion/source model |
| Knowledge Detail | Product page | Manager | Blueprint only | Add evidence/provenance detail |
| Copilot / Ask OIS | Product page | CEO/manager | Blueprint only | Requires AI gateway ADR and no-hallucination tests |
| Dashboard | Admin/control-plane today | Owner/admin/operator | Registry/runtime/admin cockpit | Keep available, not final product home |
| Products/Modules/Installations | Admin/control-plane | Owner/admin/operator | Registry detail | Keep in console/admin area |
| Runtime | Admin/control-plane | Owner/admin/operator | Runtime diagnostics | Keep outside daily product path |

## UX Approval Gate

Before Stage 2D or deeper implementation:

- Owner approves or edits the PITS daily workflow.
- Owner approves or edits the OIS daily workflow.
- Owner confirms which product pages should be implemented first.
- Owner confirms admin/runtime/debug surfaces are secondary.
- Owner confirms no future write is enabled before audit, confirmation and rollback.
- Owner confirms OIS intelligence claims require evidence/provenance.

## Stage 2C Safety Boundary

Stage 2C does not add:

- Migrations.
- Seed data.
- `prisma db push`.
- Write endpoints.
- Enabled admin actions.
- Status, owner, note, priority or blocker mutations.
- Auth changes.
- `/auth/demo-login` changes.
- DNS or Cloudflare changes.
- Credentials.
- UI `DATABASE_URL`.
- UI Prisma imports.
- Legacy resource changes.
