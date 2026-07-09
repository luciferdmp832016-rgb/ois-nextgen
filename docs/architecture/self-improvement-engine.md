# Self-Improvement Engine

Stage 2F creates the first governed Self-Improvement Engine foundation. It is deterministic and stubbed; no real LLM or OpenRouter call is required.

## Records

- `OisLearningSignal`: raw learning intake from widgets, meetings, documents, tickets, chat, email, calls, system events, imports or other sources.
- `OisLearningCandidate`: structured proposal generated from a signal.
- `OisLearningPolicy`: product/scope/signal/source policy controlling review, auto-log or log-only behavior.
- Existing `AuditRecord`: sensitive learning writes are audited.

Every signal and candidate is tenant-scoped with `organizationId` and optional workspace context.

## Learning Scopes

| Scope | Meaning |
|---|---|
| ORGANIZATION | Knowledge specific to one workspace/client/organization. |
| INDUSTRY | Anonymized or generalized knowledge for an industry. |
| PLATFORM | Reusable platform/product intelligence for all OIS-powered products. |

## Source Authority

CEO, Chairman, BOD and C-level sources receive higher confidence weight, especially for Executive Intent. High authority does not mean automatic truth. Sensitive and executive signals still pass through confidence, conflict, policy, review and audit.

## Stage 2F Extraction

Candidate extraction is deterministic:

- normalize raw text
- infer candidate type from signal type
- score initial confidence
- detect basic sensitivity/conflict flags
- evaluate policy
- create a candidate with provenance and `canonicalWriteAllowed=false`

Future packages may add real LLM extraction, OpenRouter model routing, streaming chat, knowledge promotion, rollback and deeper CEO/executive analytics.
