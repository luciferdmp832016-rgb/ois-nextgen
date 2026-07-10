# OIMA Shell Agent Rules

This app is the OIMA Product Experience Plane.

- OIMA Shell is a standalone product runtime surface powered by OIS.
- Do not import Prisma, database clients or OIS Console modules.
- Read and write only through Core API contracts.
- Do not create a separate OIMA data silo or duplicate Core API domain logic.
- Do not implement listener mode, audio processing, voice clone, meeting analytics or LLM/OpenRouter calls unless a later approved stage explicitly adds them.
- Transcript-first intake and deterministic transcript processing remain the only current runtime workflows.
