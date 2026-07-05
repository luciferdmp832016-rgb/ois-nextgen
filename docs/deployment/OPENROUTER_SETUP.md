# OpenRouter Setup

Stage 0D adds OpenRouter placeholders only. It does not activate runtime LLM calls.

## Environment Variables

- `AI_PROVIDER`
- `AI_PROVIDER_MODE`
- `OPENROUTER_API_KEY`
- `AI_DEFAULT_MODEL`
- `AI_EXTRACT_MODEL`
- `AI_REASONING_MODEL`
- `AI_FALLBACK_MODEL`
- `AI_DAILY_BUDGET_USD`
- `AI_ENABLE_CACHE`
- `AI_ENABLE_TELEMETRY`
- `AI_REQUEST_TIMEOUT_MS`

## Safe Defaults

Local, Codex Cloud and GitHub Actions should use:

```bash
AI_PROVIDER=mock
AI_PROVIDER_MODE=mock
OPENROUTER_API_KEY=
```

## Activation Gate

Before OpenRouter is used at runtime, create an ADR for the OIS AI Gateway and add tests proving all provider calls go through that gateway with evidence and provenance.
