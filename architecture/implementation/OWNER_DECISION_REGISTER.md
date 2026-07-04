# Owner Decision Register

Generated: 2026-07-04T07:42:05.119Z

Expected pending owner decisions per Stage 0B request/final verdict: 22
Actual owner backlog entries: 23

| Decision | Domain | Status | Blocks | Question |
| --- | --- | --- | --- | --- |
| OD-001 | PITS_FIELD_REPORT | OPEN | PITS_VERTICAL_SLICE | Which porting strategy for PitsFieldReport Lifecycle? Porting decision 'PORT_WITH_ADAPTER' requires owner review: Core approve/reject/mark-duplicate flow  |
| OD-002 | PITS_CASE | OPEN | PITS_VERTICAL_SLICE | Which porting strategy for PitsCase Lifecycle? Porting decision 'REIMPLEMENT_FROM_VERIFIED_SPEC' requires owner review: No explicit transition map. |
| OD-003 | KNOWLEDGE | OPEN | KNOWLEDGE_VERTICAL_SLICE | Which porting strategy for Knowledge Bundle Import System? Porting decision 'PORT_WITH_ADAPTER' requires owner review: Complex import pipeline with seed/offici |
| OD-004 | LLM_GATEWAY | OPEN | INTELLIGENCE | Which porting strategy for Unified LLM Gateway? Porting decision 'REIMPLEMENT_FROM_VERIFIED_SPEC' requires owner review: Gateway pattern (feature-co |
| OD-005 | AUTOPILOT | OPEN | PITS_VERTICAL_SLICE | Which porting strategy for AutoPilot Execution System? Porting decision 'PORT_WITH_ADAPTER' requires owner review: AutoPilot runner, snapshot, and seed ser |
| OD-006 | IDENTITY | OPEN | PLATFORM_KERNEL | Which porting strategy for Dual Auth Context (OIS + PITS)? Porting decision 'OWNER_REVIEW' requires owner review: Dual auth with loginContext JWT claim. Works  |
| OD-007 | SLA | OPEN | PITS_VERTICAL_SLICE | Which porting strategy for SLA/Overdue System? Porting decision 'ARCHIVE_REFERENCE_ONLY' requires owner review: SLA is advisory only (no enforcemen |
| OD-008 | KNOWLEDGE | OPEN | NONE | How should NextGen handle: Porting decision 'PORT_WITH_ADAPTER' requires owner review: Complex import pipeline with seed/offici? |
| OD-009 | PITS_FIELD_REPORT | OPEN | NONE | How should NextGen handle: FR approval creates Case + Task but dispatch is separate. If dispatch fails, case exists without tas? |
| OD-010 | WISDOM | OPEN | NONE | How should NextGen handle: Status enums (WisdomRootCauseStatus, GoldenCaseStatus, etc.) allow arbitrary changes including regre? |
| OD-011 | TASK | OPEN | NONE | How should NextGen handle: Two users simultaneously closing a task's last sibling could race on auto-close parent case. Version? |
| OD-012 | PITS_FIELD_REPORT | OPEN | PITS_VERTICAL_SLICE | What is the exact contract for Field Report Update? Route: app/api/pits/projects/[projectId]/field-reports/[reportId]/route.ts |
| OD-013 | PITS_TASK | OPEN | PITS_VERTICAL_SLICE | What is the exact contract for Task Action (assign/accept/resolve/close/reopen)? Route: app/api/pits/projects/[projectId]/tasks/[taskId]/action/route.ts |
| OD-014 | PITS_TASK | OPEN | PITS_VERTICAL_SLICE | What is the exact contract for Task Update/Reassign? Route: app/api/pits/projects/[projectId]/tasks/[taskId]/route.ts |
| OD-015 | AUTOPILOT | OPEN | PITS_VERTICAL_SLICE | What is the exact contract for AutoPilot Rule Create? Route: app/api/pits/projects/[projectId]/autopilot/rules/route.ts |
| OD-016 | AUTOPILOT | OPEN | PITS_VERTICAL_SLICE | What is the exact contract for AutoPilot Snapshot? Route: app/api/pits/projects/[projectId]/autopilot/snapshot/route.ts |
| OD-017 | PITS_FIELD_REPORT | OPEN | PITS_VERTICAL_SLICE | What is the exact contract for Force Create Field Report? Route: app/api/pits/projects/[projectId]/force/field-reports/route.ts |
| OD-018 | PITS_FIELD_REPORT | OPEN | PITS_VERTICAL_SLICE | What is the exact contract for Force Edit? Route: app/api/pits/projects/[projectId]/force/edit/route.ts |
| OD-019 | KNOWLEDGE | OPEN | KNOWLEDGE_VERTICAL_SLICE | What is the exact contract for Knowledge Bundle Import? Route: app/api/workspaces/[id]/knowledge-layers/bundles/import-zip/route.ts |
| OD-020 | ENTITY | OPEN | INTELLIGENCE | What is the exact contract for Entity Correction? Route: app/api/pits/projects/[projectId]/entity-correction/route.ts |
| OD-021 | INTELLIGENCE | OPEN | INTELLIGENCE | What is the exact contract for Operational Intelligence Create? Route: app/api/workspaces/[id]/operational-intelligence/route.ts |
| OD-022 | CSAGENT | DEFERRED | CSAGENT | When should CSAGENT_RESIDENT_ISOLATION scenarios be created and what is the scope? |
| OD-023 | ANALYTICS | DEFERRED | ANALYTICS | When should ANALYTICS_DASHBOARD scenarios be created and what is the scope? |

The actual backlog contains 23 entries, including the deferred CSAGENT_RESIDENT_ISOLATION and ANALYTICS_DASHBOARD scenario groups.
