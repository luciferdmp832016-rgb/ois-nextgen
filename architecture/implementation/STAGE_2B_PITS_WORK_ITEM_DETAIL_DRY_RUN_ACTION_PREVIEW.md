# Stage 2B - PITS Work Item Detail and Dry-run Action Preview

## Decision

Stage 2B is source-ready under decision label `PITS_WORK_ITEM_DETAIL_DRY_RUN_ACTION_PREVIEW_READY`.

The stage extends the Stage 2A read-only workboard into a project-scoped work item detail and dry-run action preview flow. It remains non-mutating. No task/status/owner/note/priority/blocker change is executed or persisted.

## Scope

- Core API adds `GET /platform/pits/projects/{projectId}/work-items/{itemId}`.
- Core API adds `GET /platform/pits/projects/{projectId}/work-items/{itemId}/action-preview`.
- PITS Shell adds `/projects/{id}/work-items/{itemId}`.
- PITS workboard cards link to work item detail.
- PITS projects and runtime surfaces expose owner-testable Stage 2B paths and markers.
- Ops checks verify the new endpoint markers, UI route markers and forbidden-link boundary.

## Contract

The work item detail endpoint returns deterministic demo/runtime data:

- `metadata.source=default-db`
- `metadata.mode=read-only`
- `runtime.workItemDetailMode=read-only-dry-run-preview`
- `workItemDetail.markers` including `Work Item Detail`, `Dry-run Action Preview`, `Preview only`, `No data will be changed`, `Requires audit trail`, `Requires confirmation`, `Requires rollback plan`
- item fields for title, type, status, priority, owner, due date, source, summary, description, next action, blockers and related entities
- `availableDryRunActions` for `CHANGE_STATUS`, `ASSIGN_OWNER`, `ADD_NOTE`, `SET_PRIORITY` and `RESOLVE_BLOCKER`
- `readOnlyBoundary.writePermission=NOT_ALLOWED_IN_STAGE_2B`

The action preview endpoint returns deterministic dry-run data:

- `runtime.dryRunMode=DRY_RUN_ONLY`
- `allowedInCurrentStage=false`
- `mode=DRY_RUN_ONLY`
- `auditRequired=true`
- `confirmationRequired=true`
- `rollbackRequired=true`
- `noDataChanged=true`

## Safety

Stage 2B does not:

- add migrations
- run seed
- run `prisma db push`
- add write endpoints
- add enabled create/edit/delete/status-change controls
- mutate status, owner, note, priority or blocker data
- change auth or `/auth/demo-login`
- touch DNS or Cloudflare
- add credentials
- add UI `DATABASE_URL`
- import Prisma into UI shells
- touch legacy resources

## Owner UAT

1. Open `https://pits-ng.dmp247.com`.
2. Open `https://pits-ng.dmp247.com/projects`.
3. Click one project, for example Emerald Precinct Demo.
4. Open a work item detail route such as `https://pits-ng.dmp247.com/projects/<project-id>/work-items/<item-id>`.
5. Confirm `Work Item Detail` shows title, status, priority, owner, due date, summary, blockers and next action.
6. Confirm `Dry-run Action Preview` shows preview-only actions.
7. Confirm `No data will be changed`, audit, confirmation and rollback requirements are visible.
8. Confirm no enabled create/edit/delete/status-change action exists.
9. Open `https://pits-ng.dmp247.com/runtime` and confirm Stage 2A/2B status remains visible.
10. Open `https://ois-ng.dmp247.com/dashboard` and confirm OIS Console still loads.

## Published Endpoint Delta

| Endpoint | Status | Expected owner/runtime check |
|---|---|---|
| `https://ois-nextgen.abacusai.cloud/platform/pits/projects/{projectId}/work-items/{itemId}` | Source-ready | HTTP 200 read-only work item detail payload with Stage 2B markers after owner runtime sync. |
| `https://ois-nextgen.abacusai.cloud/platform/pits/projects/{projectId}/work-items/{itemId}/action-preview` | Source-ready | HTTP 200 dry-run preview payload with `noDataChanged=true` after owner runtime sync. |
| `https://pits-ng.dmp247.com/projects/{projectId}/work-items/{itemId}` | Source-ready | HTTP 200 work item detail UI with dry-run preview markers after owner runtime sync. |

## Validation

Required validation for Stage 2B:

- `bash -n ops/abacus/*.sh`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm -r --if-present build`
- `REPO_DIR=$(pwd) bash ops/abacus/verify-ui-route-manifests.sh`
