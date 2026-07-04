# Hotfix Preservation Register

Generated: 2026-07-04T07:42:05.119Z

Frozen expected hotfix count: 27
Actual mapped hotfix count: 26

| ID | Area | Severity | Must Survive | Summary |
| --- | --- | --- | --- | --- |
| HF-001 | PitsCase State Machine | HIGH | true | CaseStatus enum has 8 states (NEW, OPEN, IN_PROGRESS, WAITING, RESOLVED, CLOSED, REOPENED, CANCELLED) but no explicit transition map like PitsTask. Case status changes happen via auto-close logic and  |
| HF-002 | RuleLifecycleStage State Machine | MEDIUM | true | RuleLifecycleStage has 10 states but only APPROVED→PUBLISHED transition has explicit guard. States SIMULATED, OBSERVED, TRUSTED, DEGRADED, DEPRECATED have no verified transition logic. |
| HF-003 | FieldReportStatus DRAFT state | LOW | true | FieldReportStatus.DRAFT exists in enum but no route creates reports in DRAFT status (default is SUBMITTED). No transitions FROM DRAFT found. |
| HF-004 | Optimistic Concurrency | HIGH | true | Force Edit operations require expectedUpdatedAt (optimistic concurrency). Standard PITS operations (createTask, performTaskAction, etc.) do NOT have concurrency guards. Concurrent updates to the same  |
| HF-005 | Idempotency | HIGH | true | No explicit idempotency keys or deduplication for PITS write operations. Duplicate POST requests may create duplicate records. |
| HF-006 | Wisdom/OI Status Updates | MEDIUM | true | WisdomRootCauseStatus, GoldenCaseStatus, IntelligenceStatus, PolicyRecommendationStatus — all allow free-form status updates with no transition guards. A CONFIRMED root cause can be reverted to DRAFT  |
| HF-007 | Field Report Approval side effects | MEDIUM | true | FR approval creates both a PitsCase (status OPEN) and a PitsTask. The initial task status depends on dispatch logic which may or may not auto-assign. If dispatch fails, the case exists without a task. |
| HF-008 | Dual Authentication Context | MEDIUM | true | OIS has two auth contexts: main app (loginContext undefined/null) and PITS (loginContext='pits'). Middleware routes by loginContext JWT claim, not hostname. PITS users have separate credentials and ca |
| HF-009 | SLA Enforcement | LOW | true | SLA is advisory only — slaDueAt is set during dispatch and used for dashboard overdue queries, but there is no enforcement (no auto-escalation, no blocking of actions when SLA breached). |
| HF-010 | PitsCase State Machine | HIGH | false | CaseStatus enum has 8 states (NEW, OPEN, IN_PROGRESS, WAITING, RESOLVED, CLOSED, REOPENED, CANCELLED) but no explicit transition map like PitsTask. Case status changes happen via auto-close logic and  |
| HF-011 | RuleLifecycleStage State Machine | MEDIUM | false | RuleLifecycleStage has 10 states but only APPROVED→PUBLISHED transition has explicit guard. States SIMULATED, OBSERVED, TRUSTED, DEGRADED, DEPRECATED have no verified transition logic. |
| HF-012 | Optimistic Concurrency | HIGH | true | Force Edit operations require expectedUpdatedAt (optimistic concurrency). Standard PITS operations (createTask, performTaskAction, etc.) do NOT have concurrency guards. Concurrent updates to the same  |
| HF-013 | Idempotency | HIGH | true | No explicit idempotency keys or deduplication for PITS write operations. Duplicate POST requests may create duplicate records. |
| HF-014 | Wisdom/OI Status Updates | MEDIUM | false | WisdomRootCauseStatus, GoldenCaseStatus, IntelligenceStatus, PolicyRecommendationStatus — all allow free-form status updates with no transition guards. A CONFIRMED root cause can be reverted to DRAFT  |
| HF-015 | Field Report Approval side effects | MEDIUM | false | FR approval creates both a PitsCase (status OPEN) and a PitsTask. The initial task status depends on dispatch logic which may or may not auto-assign. If dispatch fails, the case exists without a task. |
| HF-016 | Dual Authentication Context | MEDIUM | false | OIS has two auth contexts: main app (loginContext undefined/null) and PITS (loginContext='pits'). Middleware routes by loginContext JWT claim, not hostname. PITS users have separate credentials and ca |
| HF-017 | State Machines | MEDIUM | false | 6 enum states have no verified transition logic: PitsFieldReport.DRAFT → no transition FROM DRAFT found in routes (may be UI-only or unused), PitsFieldReport.CANCELLED → no route transitions TO cancel |
| HF-018 | PitsFieldReport Lifecycle | MEDIUM | false | Porting decision 'PORT_WITH_ADAPTER' requires owner review: Core approve/reject/mark-duplicate flow is verified. DRAFT and CANCELLED states need clarification.  |
| HF-019 | PitsCase Lifecycle | MEDIUM | false | Porting decision 'REIMPLEMENT_FROM_VERIFIED_SPEC' requires owner review: No explicit transition map. Status changes via auto-close and Force only. Codex should implement CAS |
| HF-020 | Knowledge Bundle Import System | MEDIUM | false | Porting decision 'PORT_WITH_ADAPTER' requires owner review: Complex import pipeline with seed/official guardrails, layer aliases, card type normalization. Core  |
| HF-021 | Unified LLM Gateway | MEDIUM | false | Porting decision 'REIMPLEMENT_FROM_VERIFIED_SPEC' requires owner review: Gateway pattern (feature-code routing, model chain, prompt templates) is well-verified but tightly c |
| HF-022 | AutoPilot Execution System | MEDIUM | false | Porting decision 'PORT_WITH_ADAPTER' requires owner review: AutoPilot runner, snapshot, and seed services verified. Permission checks verified. RuleLifecycleSta |
| HF-023 | Dual Auth Context (OIS + PITS) | MEDIUM | false | Porting decision 'OWNER_REVIEW' requires owner review: Dual auth with loginContext JWT claim. Works but adds complexity. Owner must decide: unify to single |
| HF-024 | SLA/Overdue System | MEDIUM | false | Porting decision 'ARCHIVE_REFERENCE_ONLY' requires owner review: SLA is advisory only (no enforcement). Owner must decide if NextGen should have enforcement. Current |
| HF-025 | Field Report Approval | MEDIUM | false | FR approval creates Case + Task but dispatch is separate. If dispatch fails, case exists without task. NextGen must ensure atomic case+task creation. |
| HF-026 | Wisdom/Intelligence Status | MEDIUM | false | Status enums (WisdomRootCauseStatus, GoldenCaseStatus, etc.) allow arbitrary changes including regression from confirmed states. NextGen must add transition guards. |

The mapped file contains 26 entries while the frozen baseline says 27. This is tracked as a handoff discrepancy, not silently resolved.
