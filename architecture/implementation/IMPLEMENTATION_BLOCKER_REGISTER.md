# Implementation Blocker Register

Generated: 2026-07-04T07:42:05.119Z

Total blockers: 29

| Blocker | Domain | Type | Milestone | Status | Must Not |
| --- | --- | --- | --- | --- | --- |
| BLK-001 | PITS_FIELD_REPORT | DOMAIN_BLOCKER | STAGE_4_5_6 | OPEN | Do not assert backward compatibility with legacy Field Report Update API |
| BLK-002 | PITS_TASK | DOMAIN_BLOCKER | STAGE_4_5_6 | OPEN | Do not assert backward compatibility with legacy Task Action (assign/accept/resolve/close/reopen) API |
| BLK-003 | PITS_TASK | DOMAIN_BLOCKER | STAGE_4_5_6 | OPEN | Do not assert backward compatibility with legacy Task Update/Reassign API |
| BLK-004 | AUTOPILOT | DOMAIN_BLOCKER | STAGE_8_9 | OPEN | Do not assert backward compatibility with legacy AutoPilot Rule Create API |
| BLK-005 | AUTOPILOT | DOMAIN_BLOCKER | STAGE_8_9 | OPEN | Do not assert backward compatibility with legacy AutoPilot Snapshot API |
| BLK-006 | PITS_FIELD_REPORT | DOMAIN_BLOCKER | STAGE_4_5_6 | OPEN | Do not assert backward compatibility with legacy Force Create Field Report API |
| BLK-007 | PITS_FIELD_REPORT | DOMAIN_BLOCKER | STAGE_4_5_6 | OPEN | Do not assert backward compatibility with legacy Force Edit API |
| BLK-008 | KNOWLEDGE | DOMAIN_BLOCKER | STAGE_8_9 | OPEN | Do not assert backward compatibility with legacy Knowledge Bundle Import API |
| BLK-009 | ENTITY | DOMAIN_BLOCKER | STAGE_8_9 | OPEN | Do not assert backward compatibility with legacy Entity Correction API |
| BLK-010 | INTELLIGENCE | DOMAIN_BLOCKER | STAGE_8_9 | OPEN | Do not assert backward compatibility with legacy Operational Intelligence Create API |
| BLK-011 | PITS_FIELD_REPORT | TEST_BLOCKER | STAGE_4_5_6 | OPEN | Do not deploy without regression test covering this transition |
| BLK-012 | PITS_CASE | TEST_BLOCKER | STAGE_4_5_6 | OPEN | Do not deploy without regression test covering this transition |
| BLK-013 | PITS_TASK | TEST_BLOCKER | STAGE_4_5_6 | OPEN | Do not deploy without regression test covering this transition |
| BLK-014 | PITS_TASK | TEST_BLOCKER | STAGE_4_5_6 | OPEN | Do not deploy without regression test covering this transition |
| BLK-015 | PITS_TASK | TEST_BLOCKER | STAGE_4_5_6 | OPEN | Do not deploy without regression test covering this transition |
| BLK-016 | PITS_TASK | TEST_BLOCKER | STAGE_4_5_6 | OPEN | Do not deploy without regression test covering this transition |
| BLK-017 | PITS_TASK | TEST_BLOCKER | STAGE_4_5_6 | OPEN | Do not deploy without regression test covering this transition |
| BLK-018 | PITS_FIELD_REPORT | DOMAIN_BLOCKER | STAGE_4_5_6 | OPEN | Do not assume legacy porting strategy without owner confirmation |
| BLK-019 | PITS_CASE | DOMAIN_BLOCKER | STAGE_4_5_6 | OPEN | Do not assume legacy porting strategy without owner confirmation |
| BLK-020 | KNOWLEDGE | DOMAIN_BLOCKER | STAGE_4_5_6 | OPEN | Do not assume legacy porting strategy without owner confirmation |
| BLK-021 | LLM_GATEWAY | DOMAIN_BLOCKER | STAGE_4_5_6 | OPEN | Do not assume legacy porting strategy without owner confirmation |
| BLK-022 | AUTOPILOT | DOMAIN_BLOCKER | STAGE_4_5_6 | OPEN | Do not assume legacy porting strategy without owner confirmation |
| BLK-023 | IDENTITY | DOMAIN_BLOCKER | STAGE_4_5_6 | OPEN | Do not assume legacy porting strategy without owner confirmation |
| BLK-024 | SLA | DOMAIN_BLOCKER | STAGE_4_5_6 | OPEN | Do not assume legacy porting strategy without owner confirmation |
| BLK-025 | CSAGENT | DEFERRED_FEATURE | STAGE_11 | DEFERRED | Do not claim csagent resident isolation is production-ready |
| BLK-026 | ANALYTICS | DEFERRED_FEATURE | STAGE_7 | DEFERRED | Do not claim analytics dashboard is production-ready |
| BLK-027 | PLATFORM | NON_BLOCKING_WARNING | ALL_STAGES | ACKNOWLEDGED | Do not expect to port legacy tests — they don't exist |
| BLK-028 | MIGRATION | MIGRATION_BLOCKER | STAGE_12 | OPEN | Do not use db-push in NextGen; do not assume clean migration path from legacy |
| BLK-029 | CUTOVER | CUTOVER_BLOCKER | STAGE_13 | OPEN | Do not execute production cutover without UAT sign-off |
