# Handoff Discrepancies

Generated: 2026-07-04T07:42:05.119Z

| ID | Category | Source A | Source B | Detail | Disposition |
| --- | --- | --- | --- | --- | --- |
| COUNT-historicalHotfixes | COUNT_DISCREPANCY | AUTHORITATIVE_BASELINE_COUNTS.json / Stage 0B request | Extracted handoff JSON | historicalHotfixes: expected 27, actual 26 | Recorded; not silently altered. |
| COUNT-ownerDecisionsPending | COUNT_DISCREPANCY | AUTHORITATIVE_BASELINE_COUNTS.json / Stage 0B request | Extracted handoff JSON | ownerDecisionsPending: expected 22, actual 23 | Recorded; not silently altered. |
| ARCHIVE-INDEX-BATCH-C | ARCHIVE_INDEX_DISCREPANCY | handoff/phase3-pass3-batch-c/manifests/OIS_NEXTGEN_HANDOFF_ARCHIVE_INDEX.json | archives/OIS_NEXTGEN_HANDOFF_V1_PHASE3_PASS3_BATCH_C.tar.gz | Archive index has totalArchives=8 but lists 7 archives and marks Batch C pending; the Batch C archive is present locally with no expected hash in the index. | Actual hash captured; portable archive index discrepancy recorded. |
| FINAL-VERDICT-BLOCKER-COUNT | COUNT_DISCREPANCY | handoff/phase3-pass3-batch-c/final-validation/FINAL_HANDOFF_VERDICT.json | handoff/phase3-pass3-batch-c/final-readiness/CODEX_IMPLEMENTATION_BLOCKERS.json | Final verdict text says 34 implementation blockers; blocker register totalBlockers is 29, matching the Stage 0B request. | Use blocker register as the implementation queue source; keep verdict text as a noted discrepancy. |
| BATCH-B-REGRESSION-MINIMUM | VALIDATION_NOTE | handoff/phase3-pass3-batch-c/verification/batch_b_input_revalidation.json | handoff/phase3-pass3-batch-b/tests/NEXTGEN_REQUIRED_REGRESSION_SUITE.json | Batch B revalidation says expected regressionRequirements=81 and actual=135 while overallResult remains PASS. Interpreted as 135 >= minimum 81. | Treat as minimum-count pass, not a blocking mismatch. |
