# Stage 0R-E SSH Relay Diagnostic

Stage 0R-E result: `ABACUS_SSH_RELAY_BLOCKED_WEB_TERMINAL_FALLBACK_READY`.

## Baseline

| Item | Result |
|---|---|
| Branch | `stage-0r-e-ssh-relay-diagnostic` |
| Prior stage | Stage 0R-D `SAFE_SSH_OPERATIONS_READY` |
| Objective | Document Abacus SSH relay diagnostics and define the Web Terminal fallback operation path. |
| Local task type | Documentation and evidence update only. |

Stage 0R-E did not deploy, start runtime, modify Abacus runtime, run migrations, run seed, call `prisma db push`, touch production/legacy resources, print secrets, change endpoints or run SSH from this local workspace.

## External SSH Evidence

Owner attempted direct SSH from Windows using the Abacus SSH tile endpoint:

```powershell
ssh ubuntu@ois-nextgen.ssh4.abacusai.cloud -p 22469
```

| Check | Result |
|---|---|
| SSH key generation | Completed. |
| SSH key added to Abacus | Completed. |
| External network 1 | Failed from Wi-Fi. |
| External network 2 | Failed from 5G. |
| `Test-NetConnection` | `TcpTestSucceeded False`. |
| `ssh -vvv` | Timed out before authentication. |

The timeout happened before key authentication, so the failure is not explained by the local private key, Abacus authorized key contents or UNIX file permissions.

## Internal VM Diagnostics

Abacus internal diagnostics confirmed:

| Area | Evidence |
|---|---|
| `sshd` service | Active and healthy inside the VM. |
| SSH listener | `0.0.0.0:22` and `[::]:22`. |
| `authorized_keys` | Exists with correct permissions. |
| ED25519 key | One key present: `SHA256:majzUhvYdiEw8IRkimxA5RXJXgiHF6bmi5CP1pey+5A ois-nextgen-abacus`. |
| Local VM SSH TCP path | Works. |
| In-VM tunnel agent | None found. |
| VM metadata | Exposes HTTP ingress only, not SSH relay details. |
| External SSH endpoint | Platform-managed by Abacus edge/relay. |

## Conclusion

The SSH failure is a platform-side Abacus edge/relay routing issue, not a local key issue and not an in-VM `sshd` issue.

The OIS NextGen VM has a healthy SSH daemon and a valid authorized key, but the external SSH relay endpoint does not currently expose a working TCP path to the owner before authentication. Until Abacus fixes the relay, direct owner SSH should be treated as blocked.

## Web Terminal Fallback

Use the Abacus Web Terminal to run the Stage 0R-D safe scripts from the VM repo root:

```sh
cd /home/ubuntu/ois-nextgen
bash ops/abacus/status.sh
bash ops/abacus/check-live-endpoints.sh
bash ops/abacus/safe-restart-core-api.sh
bash ops/abacus/runtime-sync.sh
```

Rollback remains guarded and must only be executed after owner approval:

```sh
cd /home/ubuntu/ois-nextgen
bash ops/abacus/rollback-core-api-nginx-poc.sh
bash ops/abacus/rollback-core-api-nginx-poc.sh --confirm-rollback
```

The Web Terminal fallback still runs on Abacus VM resources. It does not authorize migrations, seed operations, production access, secret printing, `prisma db push`, legacy resource probes or destructive rollback without explicit owner approval.

## Support Escalation Text

Use this text when opening an Abacus support request:

```text
OIS NextGen SuperComputer SSH relay appears blocked at the Abacus edge/relay layer.

External endpoint attempted:
ssh ubuntu@ois-nextgen.ssh4.abacusai.cloud -p 22469

Owner generated an ED25519 key and added it to the Abacus SSH tile. External SSH failed from both Wi-Fi and 5G. Windows Test-NetConnection returned TcpTestSucceeded False, and ssh -vvv timed out before authentication.

Internal VM diagnostics show sshd is active and healthy, listening on 0.0.0.0:22 and [::]:22. authorized_keys exists with correct permissions and includes one ED25519 key fingerprint:
SHA256:majzUhvYdiEw8IRkimxA5RXJXgiHF6bmi5CP1pey+5A ois-nextgen-abacus

The local VM SSH TCP path works. No in-VM tunnel agent was found, and VM metadata exposes HTTP ingress only, not SSH relay details. Please inspect or refresh the platform-managed SSH edge/relay route for this SuperComputer.
```

## Published Endpoint Delta

### Added

| Endpoint | Status | Expected result | Evidence |
|---|---|---|---|
| None. | N/A | N/A | N/A |

### Changed

| Endpoint | Previous status/result | New status/result | Evidence |
|---|---|---|---|
| None. | N/A | N/A | N/A |

### Unchanged

| Endpoint | Status | Expected result |
|---|---|---|
| `https://ois-nextgen.abacusai.cloud/health` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200 Core API health. |
| `https://ois-nextgen.abacusai.cloud/platform/overview` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200 DB-backed read-only platform overview with seeded counts. |
| `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 live App Shell; do not touch. |
| `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 custom domain; do not touch. |

### Deprecated / stopped

| Endpoint | Status | Reason |
|---|---|---|
| None. | N/A | N/A |

### Do Not Touch

| Endpoint/resource | Status | Reason |
|---|---|---|
| `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 live App Shell. |
| `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 custom domain. |
| `ois_phase1_dev` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 production-equivalent DB. |
| `emerald_bql_web_dev` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Emerald/BQL legacy DB. |
| Storage prefixes `49816/` and `52067/` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Legacy storage boundaries. |

### Current Test Checklist

No endpoint checks were run from this local documentation task. The current owner-run checklist remains:

| Check | Command | Expected |
|---|---|---|
| Core API staging health | `curl -i https://ois-nextgen.abacusai.cloud/health` | HTTP 200 and Core API health payload. |
| Seeded DB-backed platform overview | `curl -i https://ois-nextgen.abacusai.cloud/platform/overview` | HTTP 200, demo-data banner, seeded Platform Kernel counts and `phaseGates.PLATFORM_KERNEL=IN_PROGRESS`. |

## Decision

Stage 0R-E is marked `ABACUS_SSH_RELAY_BLOCKED_WEB_TERMINAL_FALLBACK_READY`.

The safe scripts created in Stage 0R-D remain valid. Direct owner SSH is blocked by Abacus platform relay routing, so the current supported operation path is Abacus Web Terminal plus `ops/abacus/*.sh` until the relay is fixed.

Recommended next stage: Stage 0S-A - Platform Kernel Gate Advancement Plan, or an owner/support follow-up stage to retest the Abacus SSH relay after support remediation.

## Validation

| Command | Result |
|---|---|
| `pnpm lint` | PASS; architecture guard passed. |
| `pnpm typecheck` | PASS; `tsc -p tsconfig.check.json --noEmit`. |
| `pnpm test` | PASS; 2 files, 20 tests. Expected mocked HTTP 500 log line came from deliberate DB-error-path test. |
| `pnpm -r --if-present build` | PASS; Core API TypeScript build and OIS Console/PITS Shell Next.js static builds completed. |
| `git status -sb` | PASS; Stage 0R-E documentation/status changes pending commit. |
