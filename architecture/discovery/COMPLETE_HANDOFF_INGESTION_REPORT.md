# Complete Handoff Ingestion Report

Generated: 2026-07-04T07:42:05.119Z

## Actual Handoff Paths

| Phase | Path | Exists | Files | Extra Top-Level Directory |
| --- | --- | --- | --- | --- |
| index | handoff/index | true | 27 |  |
| phase1 | handoff/phase1 | true | 688 | OIS_NEXTGEN_HANDOFF_V1 |
| phase2 | handoff/phase2 | true | 23 |  |
| phase2c | handoff/phase2c | true | 20 |  |
| phase3-pass1 | handoff/phase3-pass1 | true | 15 |  |
| phase3-pass2 | handoff/phase3-pass2 | true | 49 |  |
| phase3-pass3-batch-a | handoff/phase3-pass3-batch-a | true | 21 |  |
| phase3-pass3-batch-b | handoff/phase3-pass3-batch-b | true | 64 |  |
| phase3-pass3-batch-c | handoff/phase3-pass3-batch-c | true | 30 |  |
| handoff-phase1-reference | handoff-phase1 | true | 688 |  |

## Source Pointer Imports

| Input | Source Path |
| --- | --- |
| approvedADRs | handoff/phase3-pass1/owner-decisions/owner_decision_closure_v1.json |
| verifiedRuntimeRules | handoff/phase2c/business-logic/CRITICAL_RUNTIME_RULES_VERIFIED.json |
| verifiedStateMachines | handoff/phase2c/business-logic/VERIFIED_STATE_MACHINES.json |
| verifiedCriticalApis | handoff/phase2c/api-contracts/CRITICAL_WRITE_API_CONTRACTS_VERIFIED.json |
| unverifiedCriticalApis | handoff/phase3-pass1/unverified-apis/unverified_api_register.json |
| migrationManifest | handoff/phase3-pass1/migration/legacy_data_migration_manifest.json |
| canonicalFixtures | handoff/phase3-pass2/starter-data/manifest.json |
| formalScenarios | handoff/phase3-pass3-batch-a/tests/VERIFIED_SCENARIO_CATALOG.json |
| traceabilityCatalog | handoff/phase3-pass3-batch-a/tests/TRACEABILITY_CATALOG.json |
| regressionRequirements | handoff/phase3-pass3-batch-b/tests/NEXTGEN_REQUIRED_REGRESSION_SUITE.json |
| portableBlueprints | handoff/phase3-pass3-batch-b/tests/blueprints/BLUEPRINT_INDEX.json |
| historicalHotfixes | handoff/phase3-pass3-batch-b/tests/HISTORICAL_HOTFIX_REGRESSION_MAP.json |
| coverageGaps | handoff/phase3-pass3-batch-c/final-readiness/FINAL_COVERAGE_GAP_RECONCILIATION.json |
| ownerDecisions | handoff/phase3-pass3-batch-c/final-readiness/FINAL_OWNER_DECISION_BACKLOG.json |
| implementationBlockers | handoff/phase3-pass3-batch-c/final-readiness/CODEX_IMPLEMENTATION_BLOCKERS.json |

## Count Validation

| Metric | Expected | Actual | Comparator | Status |
| --- | --- | --- | --- | --- |
| uiPages | 90 | 90 | EQUAL | PASS |
| apiRoutes | 273 | 273 | EQUAL | PASS |
| legacyPrismaModels | 135 | 135 | EQUAL | PASS |
| serviceFiles | 84 | 84 | EQUAL | PASS |
| executableComponents | 90 | 90 | EQUAL | PASS |
| extractedBusinessRules | 2962 | 2962 | EQUAL | PASS |
| verifiedTier1Rules | 78 | 78 | EQUAL | PASS |
| verifiedStateMachines | 7 | 7 | EQUAL | PASS |
| verifiedTransitions | 33 | 33 | EQUAL | PASS |
| verifiedCriticalWriteAPIs | 13 | 13 | EQUAL | PASS |
| unverifiedCriticalWriteAPIs | 10 | 10 | EQUAL | PASS |
| approvedADRs | 9 | 9 | EQUAL | PASS |
| knownIssues | 20 | 20 | EQUAL | PASS |
| canonicalFixtures | 220 | 220 | EQUAL | PASS |
| runtimeSeedFixtures | 216 | 216 | EQUAL | PASS |
| negativeTestFixtures | 4 | 4 | EQUAL | PASS |
| formalScenarios | 70 | 70 | EQUAL | PASS |
| regressionRequirementsMinimum | 81 | 135 | AT_LEAST | PASS |
| portableBlueprints | 81 | 81 | EQUAL | PASS |
| historicalHotfixes | 27 | 26 | EQUAL | DISCREPANCY |
| coverageGaps | 18 | 18 | EQUAL | PASS |
| ownerDecisionsPending | 22 | 23 | EQUAL | DISCREPANCY |
| implementationBlockers | 29 | 29 | EQUAL | PASS |

## JSON And Archive Validation

- JSON files parsed: 168/168
- Archive hash checks with expected values: 7
- Archives without expected hash in the Batch C archive index: 6
- Final handoff verdict: GO_WITH_CONDITIONS

## Stage 0B Disposition

Complete handoff ingestion is recorded with discrepancies visible in `architecture/discovery/HANDOFF_DISCREPANCIES.md`. No PITS Field Report, Case, Task, Knowledge or Intelligence vertical slice was started.
