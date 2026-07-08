# Stage 2A - PITS Project Workboard Read-only Functional Slice

## Decision

Stage 2A is source-ready under decision label `PITS_PROJECT_WORKBOARD_READONLY_FUNCTIONAL_SLICE_READY`.

The stage adds the first real PITS user-level browser workflow: a read-only Project Workboard. It remains a functional slice only. It does not add persistence for work items, mutation endpoints, task lifecycle behavior, migrations, seed data, auth changes or admin actions.

## Scope

- Core API adds `GET /platform/pits/projects/{id}/workboard`.
- PITS Shell adds `/projects/{id}/workboard`.
- PITS project detail renders the same workboard panel so an owner can click a project and inspect work items immediately.
- PITS projects page now exposes a visible `Open PITS Project Workboard` path and states that PITS is no longer only a registry/readiness shell.
- PITS runtime shows Stage 2A read-only functional slice status.
- Ops checks verify the new endpoint, route, route manifest and forbidden-link boundary.

## Workboard Contract

The endpoint returns deterministic demo/runtime data derived from the selected project ID:

- `metadata.source=default-db`
- `metadata.mode=read-only`
- `runtime.workboardMode=read-only-functional-slice`
- `workboard.markers` including `PITS Project Workboard`, `Read-only functional slice`, `Work items`, `Open`, `In progress`, `Blocked`, `Done`
- summary counts for total/open/in-progress/blocked/done/high-priority/overdue
- status groups for `OPEN`, `IN_PROGRESS`, `BLOCKED`, `DONE`
- item cards with type, priority, owner, due date, summary, next action and blockers
- `readOnlyBoundary.writePermission=NOT_ALLOWED_IN_STAGE_2A`

## Safety

Stage 2A does not:

- add migrations
- run seed
- run `prisma db push`
- add write endpoints
- add enabled create/edit/delete/status-change controls
- change auth or `/auth/demo-login`
- touch DNS or Cloudflare
- add credentials
- add UI `DATABASE_URL`
- import Prisma into UI shells
- touch legacy resources

## Owner UAT

1. Open `https://pits-ng.dmp247.com`.
2. Open `https://pits-ng.dmp247.com/projects`.
3. Click a project, for example Emerald Precinct Demo.
4. Open `https://pits-ng.dmp247.com/projects/<project-id>/workboard`.
5. Confirm status groups: Open, In progress, Blocked, Done.
6. Confirm work item cards show priority, owner, due date and next action.
7. Confirm blocked items are easy to identify.
8. Confirm the page says `Read-only functional slice - editing is not enabled yet` or the equivalent rendered Stage 2A notice.
9. Confirm no enabled create/edit/delete/status-change action exists.
10. Open `https://pits-ng.dmp247.com/runtime` and confirm Stage 2A workboard status remains visible.

## Published Endpoint Delta

| Endpoint | Status | Expected owner/runtime check |
|---|---|---|
| `https://ois-nextgen.abacusai.cloud/platform/pits/projects/{id}/workboard` | Source-ready | HTTP 200 read-only workboard payload with Stage 2A markers after owner runtime sync. |
| `https://pits-ng.dmp247.com/projects/{id}/workboard` | Source-ready | HTTP 200 workboard UI with status columns, item cards and read-only notice after owner runtime sync. |

## Validation

Required validation for Stage 2A:

- `bash -n ops/abacus/*.sh`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm -r --if-present build`
- `REPO_DIR=$(pwd) bash ops/abacus/verify-ui-route-manifests.sh`
