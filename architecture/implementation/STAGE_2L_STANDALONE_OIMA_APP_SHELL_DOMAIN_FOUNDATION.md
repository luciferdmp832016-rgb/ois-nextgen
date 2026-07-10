# Stage 2L / OIMA-A0 Standalone OIMA App Shell & Domain Foundation

Decision label: `STAGE_2L_STANDALONE_OIMA_APP_SHELL_DOMAIN_FOUNDATION_READY`

Stage 2L turns OIMA from an OIS Console-nested product surface into a standalone OIS-powered product app shell.

## Runtime Contract

| Item | Value |
|---|---|
| App path | `apps/oima-shell` |
| Package | `@ois/oima-shell` |
| Product code | `OIMA_APP_SHELL` |
| Product | `OIMA - Organizational Intelligence Meeting Agent` |
| Powered by | `OIS` |
| Port | `3002` |
| Service | `ois-nextgen-oima-staging` |
| Public hostname foundation | `https://oima.dmp247.com` |
| Core API | `https://ois-nextgen.abacusai.cloud` |

OIMA Shell uses the existing Stage 2J Meeting Intake and Stage 2K Transcript Processing APIs through Core API. It does not import Prisma, read `DATABASE_URL`, duplicate backend logic or create a data silo.

## Routes

Standalone OIMA routes:

- `/`
- `/meetings`
- `/meetings/new`
- `/meetings/[id]`
- `/analysis`
- `/clarification`
- `/dashboard`
- `/self-improvement`
- `/listener`

OIS Console compatibility routes:

- `/oima`
- `/oima/meetings`
- `/oima/meetings/new`
- `/oima/meetings/[id]`

The OIS Console routes are launcher/compatibility surfaces and should point to `https://oima.dmp247.com`.

## Cloudflare Contract

Use the existing `ois-nextgen-abacus` Cloudflare Tunnel. Do not create a second tunnel unless owner infrastructure later requires it.

Dashboard-managed Public Hostname fields:

| Field | Value |
|---|---|
| Subdomain | `oima` |
| Domain | `dmp247.com` |
| Service type | `HTTP` |
| Service URL | `http://127.0.0.1:3002` |

If locally managed tunnel config is introduced later, preserve the final catch-all rule:

```yaml
ingress:
  - hostname: ois-ng.dmp247.com
    service: http://127.0.0.1:3000
  - hostname: pits-ng.dmp247.com
    service: http://127.0.0.1:3001
  - hostname: oima.dmp247.com
    service: http://127.0.0.1:3002
  - service: http_status:404
```

Do not commit or print Cloudflare tokens, account IDs, tunnel credentials or production secrets.

## Abacus Runtime

OIMA joins the existing public staging scripts:

- `ops/abacus/install-ui-shell-systemd-services.sh`
- `ops/abacus/uninstall-ui-shell-systemd-services.sh`
- `ops/abacus/restart-public-staging-runtime.sh`
- `ops/abacus/status-public-staging-runtime.sh`
- `ops/abacus/check-public-staging-endpoints.sh`
- `ops/abacus/verify-ui-route-manifests.sh`

Local Host-header helper coverage includes:

- `oima.dmp247.com -> http://127.0.0.1:3002`

## Non-Goals

- No schema change or migration.
- No seed data.
- No separate OIMA DB or backend.
- No fake meeting data.
- No issue/decision/action/risk extraction.
- No audio processing.
- No speaker diarization.
- No Listener Mode runtime.
- No voice clone.
- No LLM/OpenRouter calls.
- No production secrets or `prisma db push`.

## Verification Commands

```sh
pnpm db:generate
pnpm lint
pnpm typecheck
pnpm test
pnpm e2e
pnpm -r --if-present build
bash ops/abacus/verify-ui-route-manifests.sh
bash -n ops/abacus/check-public-staging-endpoints.sh
bash -n ops/abacus/status-public-staging-runtime.sh
bash -n ops/abacus/restart-public-staging-runtime.sh
bash -n ops/abacus/install-ui-shell-systemd-services.sh
bash -n ops/abacus/uninstall-ui-shell-systemd-services.sh
bash -n ops/abacus/start-ui-demo-shells.sh
bash -n ops/abacus/status-ui-demo-shells.sh
bash -n ops/abacus/stop-ui-demo-shells.sh
bash -n ops/abacus/restart-ui-demo-shells.sh
bash -n ops/abacus/enable-product-subdomain-demo-routes.sh
bash -n ops/abacus/status-product-subdomain-demo-routes.sh
bash -n ops/abacus/disable-product-subdomain-demo-routes.sh
git diff --check
```

After Abacus redeploy and Cloudflare hostname configuration:

```sh
bash ops/abacus/status-public-staging-runtime.sh
bash ops/abacus/check-public-staging-endpoints.sh
bash ops/abacus/status-product-subdomain-demo-routes.sh --include-public
```

## Rollback

Rollback is code/runtime only:

1. Remove or disable the Cloudflare public hostname `oima.dmp247.com`.
2. Stop only `ois-nextgen-oima-staging`.
3. If needed, run `bash ops/abacus/uninstall-ui-shell-systemd-services.sh --confirm` to remove OIS/PITS/OIMA UI units together.
4. Revert Stage 2L source and redeploy the prior Stage 2K runtime.

Do not roll back by dropping OIMA Stage 2J/2K database tables; those migrations remain part of the product data model.

## Next Recommended Stage

`OIMA-3 - OIS Agent Offline Analysis Foundation`
