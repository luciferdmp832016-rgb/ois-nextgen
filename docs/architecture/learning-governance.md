# Learning Governance

Learning Governance controls what OIS does with Learning Candidates before any future canonical promotion.

## Policy Modes

| Mode | Stage 2F behavior |
|---|---|
| ALWAYS_ASK | Candidate requires review. |
| AUTO_IF_CONFIDENCE | Candidate becomes `AUTO_LEARNED` only when confidence is at or above threshold and no sensitivity/conflict gate blocks it. |
| FULL_AUTO_PILOT | Candidate can become `AUTO_LEARNED`, but still logs/audits and cannot promote to canonical knowledge in Stage 2F. |
| LOG_ONLY | Candidate/signal is logged for analysis without canonical promotion. |

## Default Rules

- CEO/BOD strategic intent: `ALWAYS_ASK`
- Executive/personnel/finance/legal-sensitive knowledge: forced review
- Entity alias/correction with strong evidence: `AUTO_IF_CONFIDENCE`
- Low-risk product feedback/query pattern: `LOG_ONLY` or later `FULL_AUTO_PILOT`
- Unknown or low-authority correction: `ALWAYS_ASK` or `LOG_ONLY`

## Confidence V0

Inputs:

- source authority
- signal type
- evidence count
- entity match availability
- conflict flag
- sensitivity flag

Conflict or insufficient evidence prevents AUTO_LEARN. Sensitive items force ASK_REVIEW unless a future explicit policy allows otherwise.

## Promotion Boundary

Stage 2F stops at review/auto-log. It intentionally does not implement knowledge promotion or rollback execution. Promotion and rollback remain governed future stages.
