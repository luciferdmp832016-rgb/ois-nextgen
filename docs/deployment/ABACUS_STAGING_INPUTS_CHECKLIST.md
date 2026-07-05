# Abacus Staging Inputs Checklist

This is the Stage 0F-R3 owner handoff package for unblocking the Abacus staging runtime POC.

Do not commit real secret values to this file. Fill this checklist with staging-only confirmations, secret names, private secret-manager paths, redacted identifiers and owner approval evidence only. If real values are needed, enter them directly into Abacus or an approved private secret manager outside the repository.

## Current Decision

Stage 0F-R2 blocked safely because staging-only inputs were missing or unknown. Stage 0F-R3 does not deploy and does not run the runtime POC. The runtime POC remains blocked until every required item below is confirmed as staging-only.

## Required Readiness Summary

| Area | Required for POC | Optional for first POC | Safe handoff format |
|---|---|---|---|
| DB | Staging-only `DATABASE_URL`, or confirmed mock DB mode. | Demo seed approval. | Secret name/private path and redacted evidence only. |
| Storage | `STORAGE_PROVIDER=mock` confirmed in Abacus. | Staging storage credentials after tests are approved. | Mode checkbox or secret names/private paths only. |
| AI | `AI_PROVIDER=mock` and `AI_PROVIDER_MODE=mock`. | Non-production OpenRouter key. | Non-secret env values or secret name/private path only. |
| Abacus identifiers | Staging project and split service/app/task IDs. | Owner-private screenshots or links. | IDs/names that are clearly staging-only. |
| Env/secrets injection | Verified Abacus staging UI/agent path. | Separate owner runbook link. | Path description, not values. |
| Staging URLs | Core API, Console and PITS staging URLs. | Preview aliases. | Public staging URL or redacted placeholder. |
| Runtime entrypoint | Build/start commands and port behavior confirmed. | Dynamic port adaptation decision. | Checkbox plus notes. |
| DB operations approval | `pnpm db:migrate` approval for staging only. | Demo-only `pnpm db:seed` approval. | Owner/date checkbox. |

## 1. Staging Database

Required decision:

- [ ] Staging DB is provisioned and is not production.
- [ ] Staging DB is not connected to production data.
- [ ] Secret value will be entered only in Abacus or an approved private secret manager.
- [ ] `DATABASE_URL` will be available to the Core API runtime.
- [ ] If `ABACUS_DATABASE_URL` is used, the owner confirms it is mapped to `DATABASE_URL` before Prisma commands run.
- [ ] No `prisma db push` will be used.

Safe fields:

| Field | Required | Redacted owner value |
|---|---|---|
| DB mode | Yes | `<staging-postgres | mock-db-mode>` |
| Secret name exposed to runtime | Yes | `DATABASE_URL` |
| Private secret-manager path | Yes if managed outside Abacus | `<private-secret-path-without-value>` |
| Redacted DB identifier | Yes | `<staging-db-host-or-db-name-without-credentials>` |
| Schema | Yes | `public` or `<staging-schema>` |
| Staging-only proof | Yes | `<private-evidence-reference>` |
| Migration approval owner | Yes | `<owner-name-or-role>` |
| Migration approval date | Yes | `<YYYY-MM-DD>` |
| Seed approval | Optional | `<approved | denied | deferred>` |

Approval:

- [ ] Owner approves `pnpm db:migrate` against the staging DB only.
- [ ] Owner approves demo-only `pnpm db:seed` against the staging DB.
- [ ] Owner defers `pnpm db:seed`; POC must not seed data.

## 2. Storage Or Mock Mode

Required decision:

- [ ] First POC uses `STORAGE_PROVIDER=mock`.
- [ ] No production storage bucket, endpoint, access key or secret key is used.

Safe fields:

| Field | Required | Redacted owner value |
|---|---|---|
| Storage mode | Yes | `mock` |
| `STORAGE_PROVIDER` | Yes | `mock` |
| Storage credential use | Yes | `none for first POC` |
| Staging-only proof | Yes | `<private-evidence-reference>` |

Optional future storage fields, only after storage tests are approved:

| Field | Required | Redacted owner value |
|---|---|---|
| `ABACUS_STORAGE_BUCKET` secret name/path | Optional | `<private-secret-path-without-value>` |
| `ABACUS_STORAGE_ENDPOINT` secret name/path | Optional | `<private-secret-path-without-value>` |
| `ABACUS_STORAGE_ACCESS_KEY` secret name/path | Optional | `<private-secret-path-without-value>` |
| `ABACUS_STORAGE_SECRET_KEY` secret name/path | Optional | `<private-secret-path-without-value>` |

## 3. AI / OpenRouter Or Mock Mode

Required decision:

- [ ] First POC uses `AI_PROVIDER=mock`.
- [ ] First POC uses `AI_PROVIDER_MODE=mock`.
- [ ] `OPENROUTER_API_KEY` is unset for the first POC.
- [ ] No production or paid OpenRouter key is used.

Safe fields:

| Field | Required | Redacted owner value |
|---|---|---|
| `AI_PROVIDER` | Yes | `mock` |
| `AI_PROVIDER_MODE` | Yes | `mock` |
| `OPENROUTER_API_KEY` | Required to be unset for first POC | `<unset>` |
| Non-production key proof | Optional | `<private-evidence-reference>` |

Optional future AI key fields:

| Field | Required | Redacted owner value |
|---|---|---|
| Non-production AI key secret name/path | Optional | `<private-secret-path-without-value>` |
| Budget cap | Optional | `<non-production-budget-cap>` |
| Approved model names | Optional | `<non-production-model-list>` |

## 4. Abacus Staging Identifiers

Required decision:

- [ ] Project is `OIS NextGen Staging`.
- [ ] Core API staging app/service ID is known.
- [ ] OIS Console staging app/service ID is known.
- [ ] PITS Shell staging app/service ID is known.
- [ ] Deployment task/chat/agent identifiers are staging-only if Abacus requires them.
- [ ] No production Abacus app, project or task is mutated.

Safe fields:

| Field | Required | Redacted owner value |
|---|---|---|
| Abacus staging project name | Yes | `OIS NextGen Staging` |
| Abacus staging project ID | Yes | `<staging-project-id>` |
| Core API app/service name | Yes | `ois-nextgen-core-api-staging` |
| Core API app/service ID | Yes | `<staging-core-api-service-id>` |
| OIS Console app/service name | Yes | `ois-nextgen-console-staging` |
| OIS Console app/service ID | Yes | `<staging-console-service-id>` |
| PITS Shell app/service name | Yes | `ois-nextgen-pits-staging` |
| PITS Shell app/service ID | Yes | `<staging-pits-service-id>` |
| Abacus AI Agent task/chat ID | Required if used for deploy config | `<staging-agent-task-or-chat-id>` |
| Staging-only proof | Yes | `<private-evidence-reference>` |

## 5. Env / Secrets Injection Path

Required decision:

- [ ] Owner can configure non-secret environment variables for each staging service.
- [ ] Owner can configure secrets for the Core API staging service.
- [ ] The path is staging-only and does not expose values in repository, Codex, GitHub logs or public screenshots.

Safe fields:

| Field | Required | Redacted owner value |
|---|---|---|
| Injection method | Yes | `<Abacus UI | Abacus AI Agent | approved owner-run path>` |
| UI/agent path description | Yes | `<staging-only-path-description>` |
| Owner role with access | Yes | `<owner-role>` |
| Secrets visibility policy | Yes | `<masked | write-only | private-manager>` |
| Audit/evidence reference | Yes | `<private-evidence-reference>` |

Required non-secret values:

| Variable | Required value |
|---|---|
| `APP_ENV` | `staging` |
| `DEPLOY_TARGET` | `abacus-staging` |
| `ABACUS_ENV` | `staging` |
| `AI_PROVIDER` | `mock` |
| `AI_PROVIDER_MODE` | `mock` |
| `STORAGE_PROVIDER` | `mock` |
| `DEPLOYMENT_VERSION_ENABLED` | `false` |
| `NEXT_TELEMETRY_DISABLED` | `1` |

Required secret names:

| Variable | Required for | Value handling |
|---|---|---|
| `DATABASE_URL` | Core API | Enter value in Abacus/private manager only. |
| `JWT_SECRET` | Core API if auth/session code requires it | Enter value in Abacus/private manager only. |
| `SESSION_SECRET` | Core API/frontend if session code requires it | Enter value in Abacus/private manager only. |
| `ABACUS_APP_ID` | Service identification if Abacus requires it | Enter value in Abacus/private manager only. |
| `ABACUS_PUBLIC_APP_URL` | Public staging URL mapping if Abacus requires it | Public URL or private manager path. |

## 6. Staging URLs

Required decision:

- [ ] Core API staging URL exists.
- [ ] OIS Console staging URL exists.
- [ ] PITS Shell staging URL exists.
- [ ] URLs are staging-only and do not route to production.

Safe fields:

| Service | Required | Redacted owner value |
|---|---|---|
| Core API URL | Yes | `https://<abacus-core-api-staging>` |
| OIS Console URL | Yes | `https://<abacus-console-staging>` |
| PITS Shell URL | Yes | `https://<abacus-pits-staging>` |
| Shared public app URL | Optional | `https://<abacus-public-staging>` |
| Staging-only proof | Yes | `<private-evidence-reference>` |

## 7. Runtime Entrypoint And Port Behavior

Required split-app commands:

| Service | Build command | Start command | Health check |
|---|---|---|---|
| Core API | `pnpm install --frozen-lockfile && pnpm db:generate && pnpm --filter @ois/core-api build` | `pnpm --filter @ois/core-api start` | `/health` |
| OIS Console | `pnpm install --frozen-lockfile && pnpm --filter @ois/ois-console build` | `pnpm --filter @ois/ois-console start` | `/` |
| PITS Shell | `pnpm install --frozen-lockfile && pnpm --filter @ois/pits-shell build` | `pnpm --filter @ois/pits-shell start` | `/` |

Required decision:

- [ ] Abacus accepts the split-app topology.
- [ ] Abacus supports the listed build/start commands.
- [ ] Abacus supports Core API `CORE_API_HOST` and `CORE_API_PORT`, or provides a documented dynamic port behavior.
- [ ] Abacus supports the current Next.js start commands for Console and PITS, or a future config-only port adaptation is approved before POC.

Safe fields:

| Field | Required | Redacted owner value |
|---|---|---|
| Runtime model | Yes | `<three services | one project with three services>` |
| Dynamic `PORT` provided by Abacus | Yes | `<yes | no | unknown>` |
| Core API port setting | Yes | `<CORE_API_PORT value or dynamic PORT mapping>` |
| Console port behavior | Yes | `<fixed 3000 | dynamic PORT mapping | needs future change>` |
| PITS port behavior | Yes | `<fixed 3001 | dynamic PORT mapping | needs future change>` |
| Build command support proof | Yes | `<private-evidence-reference>` |
| Start command support proof | Yes | `<private-evidence-reference>` |

If dynamic `PORT` is required and the current scripts cannot consume it, stop. A future config-only branch must adapt runtime start scripts before any staging POC.

## 8. Final Owner Approval

All required checkboxes below must be checked before a future stage can run the minimum safe staging runtime POC.

- [ ] I reviewed the Stage 0H Abacus staging runtime handoff package.
- [ ] I confirm the first Abacus POC scope excludes DB-backed endpoints unless staging DB approval is separately granted.
- [ ] I confirm every provided input is staging-only.
- [ ] I confirm no production database, storage bucket, OpenRouter key, Abacus app, Abacus project or Abacus task is used.
- [ ] I confirm all secret values are stored only in Abacus or an approved private secret manager.
- [ ] I confirm no real secret values are committed to this repository.
- [ ] I approve `pnpm db:migrate` only against the confirmed staging DB.
- [ ] I approve demo-only `pnpm db:seed`, or I explicitly marked seed as deferred above.
- [ ] I approve a future Stage 0F runtime POC only after this checklist is reviewed and all required rows are complete.

Owner signoff:

| Field | Redacted owner value |
|---|---|
| Owner name or role | `<owner-name-or-role>` |
| Approval date | `<YYYY-MM-DD>` |
| Private evidence location | `<private-evidence-reference>` |
| Notes | `<redacted-notes>` |

## Stop Conditions

Do not deploy if any of these are true:

- Any required checkbox is incomplete.
- Any secret value appears in a document, pull request, issue, chat transcript or log.
- Any input points to production or cannot be proven staging-only.
- Abacus env/secrets/deploy configuration remains inaccessible.
- The staging database is missing or not approved for migrations.
- `STORAGE_PROVIDER=mock` is not confirmed and staging storage tests are not approved.
- `AI_PROVIDER=mock` and `AI_PROVIDER_MODE=mock` are not confirmed and no non-production AI key is approved.
- Abacus runtime requires dynamic `PORT` behavior that the current scripts do not support.
- Owner signoff is missing.
