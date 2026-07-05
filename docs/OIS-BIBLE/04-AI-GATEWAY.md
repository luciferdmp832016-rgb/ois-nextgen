# OIS Bible 04: AI Gateway

Stage 0D documents AI readiness but does not activate runtime AI calls.

## Current Status

- `AI_PROVIDER` and `AI_PROVIDER_MODE` default to `mock`.
- `OPENROUTER_API_KEY` is a secret placeholder only.
- No application code calls OpenRouter or any other LLM provider in Stage 0D.

## Future Activation Requirements

- Accepted ADR for AI gateway runtime behavior.
- Central gateway package or service boundary.
- Budget, timeout, retry and model routing policy.
- Evidence/provenance storage for every intelligence claim.
- Tests proving no direct provider calls bypass the gateway.

## Allowed Stage 0D Work

- Environment placeholders.
- Setup documentation.
- Deployment manifest fields for AI config hash.
- CI rules that keep provider mode mocked.
