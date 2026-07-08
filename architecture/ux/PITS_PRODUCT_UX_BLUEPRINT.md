# PITS Product UX Blueprint

Stage: Stage 2C - Product UX Blueprint and Screen Flow Draft Gate

Decision label: `PRODUCT_UX_BLUEPRINT_SCREEN_FLOW_DRAFT_READY`

## Purpose

PITS should become the daily project execution product for project operators, managers and owners. Stage 2A and Stage 2B proved the first read-only slices, but the owner feedback is clear: the product must feel like a workflow tool, not a registry/debug console.

This blueprint defines the intended PITS product workflow before deeper implementation. It is a draft gate for owner review and approval. It does not enable writes.

## Product Promise

PITS helps a project user answer:

- Which projects need attention today?
- Which work items are open, in progress, blocked or done?
- What is the next action?
- Who owns it?
- What is due soon?
- What is blocked?
- What would happen if I changed status, owner, note, priority or blocker state in a future audited stage?

## Primary Users

- Project operator: works daily from project and work item queues.
- Project manager: reviews blockers, due work and project health.
- Owner/admin: reviews readiness, runtime health and future write controls.

## Current Stage Boundary

Stage 2C is read-only and draft-only.

- Existing Stage 2A workboard remains read-only.
- Existing Stage 2B work item detail and dry-run preview remain read-only.
- Future quick actions are shown only as preview concepts.
- No task/status/owner/note/priority/blocker mutation is enabled.
- No new API endpoint, migration, seed, auth change or database write is required for this blueprint.

## Daily Product Workflow

1. User opens PITS Home.
2. User sees active projects, work needing attention, blocked work and due-soon items.
3. User opens Projects List to find or filter a project.
4. User opens Project Detail to understand project status and context.
5. User opens Project Workboard for execution flow.
6. User opens Work Item Detail to inspect one item.
7. User reviews Dry-run Action Preview for future write behavior without changing data.
8. Admin/runtime diagnostics remain available but are not the daily workflow path.

## Screen Flow

`PITS Home -> Projects List -> Project Detail -> Project Workboard -> Work Item Detail -> Dry-run Action Preview`

Admin path:

`Runtime/Admin -> Registry readiness -> Runtime health -> Admin boundary -> Owner review`

## Screen Drafts

### 1. PITS Home

Purpose:

- Give project operators a clear starting point.
- Show today's project health, tasks, blockers and what needs attention.

Draft sections:

- My active projects.
- Work needing attention.
- Blocked work items.
- Due soon.
- Recent updates.
- Quick actions, marked preview-only until future write stages.

Current Stage 2C behavior:

- Can be represented by the existing root page plus product-flow preview.
- No quick action executes.

Future implementation notes:

- Add user-scoped project queue after auth/user scope rules are approved.
- Add evidence-backed recent updates when activity/timeline data exists.

### 2. Projects List

Purpose:

- Let a user find and select a project.

Draft sections:

- Search/filter/sort concept.
- Project cards or table.
- Project health/status.
- Open, in-progress and blocked counts.
- Next action.
- Owner/person in charge.
- Last updated.

Current Stage 2C behavior:

- Existing `/projects` remains the project selector.
- Stage 2C product-flow preview explains the intended product list layout.

Future implementation notes:

- Add filters after project workflow data model is approved.
- Add user role and workspace scoping before personalized lists.

### 3. Project Detail

Purpose:

- Show project overview and operational status.

Draft sections:

- Project summary.
- Health/readiness.
- Current blockers.
- Milestones/sections.
- Linked workspace/product/OIS context.
- Workboard entry.
- Activity summary.

Current Stage 2C behavior:

- Existing project detail stays read-only and registry-backed.
- Product-flow preview separates the future product page from registry/readiness panels.

Future implementation notes:

- Move technical readiness details into admin/runtime panels.
- Keep project summary and operational signals first.

### 4. Project Workboard

Purpose:

- Main workflow page for project execution.

Draft sections:

- Columns: Open, In progress, Blocked, Done.
- Work item cards.
- Priority, owner, due date and blocker indicators.
- Board/list view mode.
- Filter/sort concept.
- Clear read-only vs future edit boundary.

Current Stage 2C behavior:

- Stage 2A workboard remains read-only.
- No drag/drop, status change, assignment or editing is enabled.

Future implementation notes:

- Add board/list mode and filters before writes.
- Add audited writes only after owner approval, ADR and tests.

### 5. Work Item Detail

Purpose:

- Let a user inspect one task, issue, risk or follow-up.

Draft sections:

- Item title.
- Status.
- Priority.
- Owner.
- Due date.
- Description.
- Blockers.
- Next action.
- Activity/timeline concept.
- Related documents/comments concept.
- Dry-run action preview.

Current Stage 2C behavior:

- Stage 2B work item detail remains read-only.
- Related documents/comments and activity timeline are concepts only.

Future implementation notes:

- Add activity timeline after audit/event model is approved.
- Add comments/documents only after data model and provenance rules are approved.

### 6. Dry-run Action Preview

Purpose:

- Preview future write actions without changing data.

Draft sections:

- Proposed action.
- Expected impact.
- Audit requirement.
- Confirmation requirement.
- Rollback plan.
- Permission requirement.
- Not executable yet.

Current Stage 2C behavior:

- Stage 2B dry-run preview remains non-mutating.
- All actions are marked preview-only.

Future implementation notes:

- Promote individual action types only after write-boundary acceptance.
- Each future write must have audit, confirmation and rollback tests.

### 7. PITS Runtime/Admin Area

Purpose:

- Move diagnostics and control-plane views away from daily user workflow.

Draft sections:

- Runtime status.
- Registry readiness.
- Admin boundary.
- Owner review queue.
- Product UAT status.

Current Stage 2C behavior:

- Existing runtime/admin diagnostics remain available.
- They should not dominate the product home experience.

## Product vs Admin Boundary

Product pages:

- PITS Home.
- Projects List.
- Project Detail.
- Project Workboard.
- Work Item Detail.
- Dry-run Action Preview.

Admin/control-plane pages:

- Runtime status.
- Registry readiness.
- Registry health.
- Owner review queue.
- Admin boundary.
- Product UAT/gap map.

Debug/diagnostic pages:

- Should remain under runtime/admin/diagnostics style surfaces.
- Must not be the primary PITS home experience.

## Owner Approval Checklist

- Daily workflow starts from product tasks and project attention, not diagnostics.
- Projects List makes it obvious which project to open.
- Project Detail explains the project before showing registry details.
- Workboard feels like the main work page.
- Work Item Detail is understandable to a project user.
- Dry-run preview clearly says no data will be changed.
- Admin/runtime/debug pages are separated from product pages.
- Future writes remain blocked until audit, confirmation and rollback gates are approved.

## Proposed Next Stages After UX Approval

- Stage 2D: PITS product home and project list productization, read-only.
- Stage 2E: PITS workboard product UX polish, board/list/filter draft, read-only.
- Stage 2F: PITS activity/timeline and related-document concept, read-only.
- Stage 2G: PITS write-boundary ADR and audited mutation design, no implementation until approved.
