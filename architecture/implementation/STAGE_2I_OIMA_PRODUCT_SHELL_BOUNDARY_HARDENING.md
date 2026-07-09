# Stage 2I / OIMA-0 OIMA Product Shell & Boundary Hardening

Verdict: `STAGE_2I_OIMA_PRODUCT_SHELL_BOUNDARY_HARDENING_READY`

## Summary

Stage 2I / OIMA-0 hardens OIMA as a distinct Powered by OIS product surface without adding meeting runtime behavior.

OIS is the organizational intelligence backbone. OIMA is the meeting intelligence product powered by OIS.

## Product Contract

The OIMA API/product contract now exposes:

- `productCode: "OIMA"`
- `productName: "Organizational Intelligence Meeting Agent"`
- `poweredBy: "OIS"`
- `sourceModes`: `TRANSCRIPT_ONLY`, `AUDIO_ONLY`, `TRANSCRIPT_AND_AUDIO`, `LISTENER_CAPTURED`
- `currentRuntimeCapabilities`: `OVERVIEW`, `PRODUCT_BOUNDARY`, `KNOWLEDGE_API_LINKAGE`
- `plannedRuntimeCapabilities`: `MEETING_INTAKE`, `TRANSCRIPT_PROCESSING`, `AUDIO_PROCESSING`, `OFFLINE_AGENT_ANALYSIS`, `SUBJECT_CLARIFICATION`, `SELF_IMPROVEMENT`, `LISTENER_MODE`

Transcript remains the primary input path. Audio is optional future enrichment and does not block transcript-first OIMA stages.

## UI Shell

OIS Console `/oima` now renders:

- OIMA product overview.
- OIS-powered positioning.
- Current runtime capabilities.
- Planned runtime capability roadmap.
- Empty-state cards for Meeting Library, Upload Meeting, Agent Analysis, Clarification Review, Dashboard, Self-Improvement Center and Listener Mode.

Each empty-state card is marked planned/not runtime and states that no fake meeting data is created.

## Safety Boundary

Stage 2I / OIMA-0 does not add:

- Meeting upload runtime.
- Meeting records or fake meeting data.
- Transcript persistence or processing.
- Audio processing.
- Listener Mode runtime.
- Live speaking agent behavior.
- Voice clone or impersonation.
- LLM/OpenRouter calls.
- Canonical knowledge writes or auto-promotion.

Future OIMA Listener Mode may record meetings only with permission. Live speaking and voice clone remain explicitly out of scope.

## Next Recommended Stage

Next recommended stage: `OIMA-1 Meeting Intake`.
