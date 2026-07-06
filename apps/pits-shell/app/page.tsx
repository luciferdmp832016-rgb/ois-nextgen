export const dynamic = "force-dynamic";

const DEFAULT_CORE_API_URL = "https://ois-nextgen.abacusai.cloud";
const productCode = "PITS_SHELL";
const appShellName = "PITS Shell";

const kernelFields = [
  "industries",
  "organizations",
  "workspaces",
  "projects",
  "products",
  "installations",
  "modules",
  "auditRecords"
] as const;

type KernelField = (typeof kernelFields)[number];

type ApiResult = {
  ok: boolean;
  status: number | null;
  data: unknown;
  error: string | null;
};

function getCoreApiUrl() {
  const configured = process.env.CORE_API_URL ?? process.env.NEXT_PUBLIC_CORE_API_URL ?? DEFAULT_CORE_API_URL;
  return configured.replace(/\/+$/, "");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getString(source: unknown, key: string) {
  if (!isRecord(source)) {
    return null;
  }

  const value = source[key];
  return typeof value === "string" ? value : null;
}

function getKernelCount(source: unknown, key: KernelField) {
  if (!isRecord(source)) {
    return null;
  }

  const kernel = source.kernel;
  if (!isRecord(kernel)) {
    return null;
  }

  const value = kernel[key];
  return typeof value === "number" ? value : null;
}

async function fetchCoreApi(path: string, coreApiUrl: string): Promise<ApiResult> {
  try {
    const response = await fetch(`${coreApiUrl}${path}`, { cache: "no-store" });
    const body = await response.text();
    let data: unknown = null;

    if (body.trim().length > 0) {
      try {
        data = JSON.parse(body) as unknown;
      } catch {
        data = null;
      }
    }

    return {
      ok: response.ok,
      status: response.status,
      data,
      error: response.ok ? null : `HTTP ${response.status}`
    };
  } catch (error) {
    return {
      ok: false,
      status: null,
      data: null,
      error: error instanceof Error ? error.message : "Core API request failed"
    };
  }
}

function StatusBadge({ ok, label }: { ok: boolean; label: string }) {
  return <span className={ok ? "status status-ok" : "status status-warn"}>{label}</span>;
}

export default async function Page() {
  const coreApiUrl = getCoreApiUrl();
  const [health, overview] = await Promise.all([
    fetchCoreApi("/health", coreApiUrl),
    fetchCoreApi("/platform/overview", coreApiUrl)
  ]);

  const healthStatus = getString(health.data, "status") ?? "unavailable";
  const healthService = getString(health.data, "service") ?? "unknown";
  const healthStage = getString(health.data, "stage") ?? "unknown";
  const overviewBanner = getString(overview.data, "banner") ?? "DEMO DATA - NOT PRODUCTION";

  return (
    <main className="demo-shell">
      <section className="hero-panel">
        <div>
          <div className="demo">{overviewBanner}</div>
          <h1>{appShellName}</h1>
          <p className="muted">
            Product runtime shell demo reading seeded Platform Kernel status through the shared Core API.
          </p>
        </div>
        <StatusBadge ok={health.ok && healthStatus === "ok"} label={health.ok ? "Core API healthy" : "Core API unavailable"} />
      </section>

      <section className="detail-grid" aria-label="PITS Shell demo status">
        <div className="tile">
          <h2>App Shell</h2>
          <dl className="facts">
            <div>
              <dt>Name</dt>
              <dd>{appShellName}</dd>
            </div>
            <div>
              <dt>Product code</dt>
              <dd>{productCode}</dd>
            </div>
            <div>
              <dt>Core API URL</dt>
              <dd>{coreApiUrl}</dd>
            </div>
          </dl>
        </div>

        <div className="tile">
          <h2>Core API Health</h2>
          <dl className="facts">
            <div>
              <dt>Status</dt>
              <dd>{healthStatus}</dd>
            </div>
            <div>
              <dt>Service</dt>
              <dd>{healthService}</dd>
            </div>
            <div>
              <dt>Stage</dt>
              <dd>{healthStage}</dd>
            </div>
            <div>
              <dt>HTTP</dt>
              <dd>{health.status ?? health.error ?? "unavailable"}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="tile" aria-label="Platform overview counts">
        <div className="panel-heading">
          <div>
            <h2>Platform Overview Counts</h2>
            <p className="muted">Seeded demo counts from Core API `/platform/overview`.</p>
          </div>
          <StatusBadge ok={overview.ok} label={overview.ok ? "Overview ready" : "Overview unavailable"} />
        </div>
        <div className="count-grid">
          {kernelFields.map((field) => (
            <div className="count-tile" key={field}>
              <span>{field}</span>
              <strong>{getKernelCount(overview.data, field) ?? "-"}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="tile">
        <h2>Data Access Boundary</h2>
        <p className="muted">
          This UI shell does not import Prisma and does not use `DATABASE_URL`. DB-backed demo data is accessed only
          through the Core API.
        </p>
      </section>
    </main>
  );
}
