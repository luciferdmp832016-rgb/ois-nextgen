# OIS Agent Runtime

The OIS Agent Runtime is a shared assistant and learning intake gateway for OIS-powered products.

## Runtime Contract

Every agent request should carry:

- product key
- organization/workspace context
- current route or screen
- current entity references
- user role and permission context
- question or teaching input
- locale when available

## Capabilities

Stage 2F declares these shared capabilities:

- ASK
- EXPLAIN_SCREEN
- SHOW_EVIDENCE
- SUGGEST_NEXT_ACTION
- TEACH_OIS
- SUBMIT_CORRECTION
- REPORT_WRONG_ANSWER
- CONFIRM_AS_TRUE
- ESCALATE_TO_SUPERADMIN
- VIEW_LEARNING_STATUS

## Widget Shell

The reusable widget shell is mounted in OIS Console with `OIS_PLATFORM` context. It includes:

- `Powered by OIS` header
- Ask tab
- Teach OIS / correction tab
- Evidence placeholder
- Learning status placeholder
- product context indicator
- Core API learning submission action

The widget submits learning input to governed Learning Signal intake. It does not write directly to Master Knowledge, the Entity Registry, Decisions, Commitments or Risks.

## Chat Stub

`POST /platform/agent/chat` returns a deterministic response contract:

- answer text
- evidence placeholder
- suggested actions
- `canTeachOis=true`
- `noLlmCall=true`

Streaming chat and model-router integration are future work.
