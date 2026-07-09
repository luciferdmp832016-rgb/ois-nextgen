# Stage 2E - PITS Work Item Action Request and Audit-safe Write Boundary

Decision label: `PITS_ACTION_REQUEST_AUDIT_SAFE_WRITE_BOUNDARY_READY`

Expected runtime label after GitHub CI, Abacus runtime sync and Owner UAT: `PITS_ACTION_REQUEST_AUDIT_SAFE_WRITE_BOUNDARY_RUNTIME_VERIFIED`

## Scope

Stage 2E introduces the first PITS work item action request boundary without enabling work item mutation.

The stage adds deterministic read-only action request payloads for the existing Stage 2B work item detail flow. A request can describe intended action type, current value, proposed value, owner or admin confirmation requirements, audit requirements, rollback plan, safety gates and unchanged source item evidence. It does not execute the action.

## Core API

New read-only endpoints:

- `GET /platform/pits/projects/{projectId}/work-items/{itemId}/action-requests`
- `GET /platform/pits/projects/{projectId}/work-items/{itemId}/action-requests/{requestId}`
- `GET /platform/pits/projects/{projectId}/work-items/{itemId}/action-request-preview?actionType=...`

Each action request includes:

- `requestId`
- `projectId`
- `workItemId`
- `actionType`
- `requestedBy`
- `requestedAt`
- `currentValue`
- `proposedValue`
- `status`
- `auditRequired`
- `confirmationRequired`
- `rollbackRequired`
- `permissionRequired`
- `safetyGates`
- `expectedImpact`
- `rollbackPlan`
- `noDirectMutation: true`

Supported action types remain `CHANGE_STATUS`, `ASSIGN_OWNER`, `ADD_NOTE`, `SET_PRIORITY` and `RESOLVE_BLOCKER`.

## PITS Shell

The existing PITS work item detail route now renders an action request panel with these stable owner/runtime markers:

- `PITS Action Request`
- `Action request only`
- `No direct mutation`
- `Pending review`
- `Requires audit trail`
- `Requires confirmation`
- `Requires rollback plan`

The panel uses preview-only controls such as `Preview request` and `Stage for review`; it does not render executable mutation buttons.

## Safety Boundary

Stage 2E adds no POST, PUT, PATCH or DELETE endpoint under PITS project routes. It does not mutate source work items, add schema changes, add migrations, run seed, run `prisma db push`, change auth, add credentials, add UI `DATABASE_URL`, import Prisma into UI shells, touch DNS/Cloudflare or touch legacy resources.

## Owner UAT

1. Open `https://pits-ng.dmp247.com` and confirm PITS loads and language selector works.
2. Open `https://pits-ng.dmp247.com/projects` and confirm project list and workboard path still works.
3. Click one project and confirm detail/workboard loads and work item cards appear.
4. Click one work item and confirm Work Item Detail and Dry-run Action Preview still appear.
5. Inspect Action Request section: available actions, action-request-only/no-direct-mutation copy, audit/confirmation/rollback/permission gates and Draft/Pending review/Blocked by safety gate status.
6. If Create Action Request appears, confirm it is staged/read-only only and source work item values do not change.
7. Switch language EN/VI and confirm labels translate or fallback safely without layout breakage.
8. Open `https://pits-ng.dmp247.com/localization` and confirm catalog works.
9. Open `https://ois-ng.dmp247.com` and confirm OIS still loads without localization/product-flow/cockpit regression.
10. Confirm no localhost links, no legacy production links, no secret/env/internal output, no uncontrolled mutation/write/admin action and safe owner testing.
