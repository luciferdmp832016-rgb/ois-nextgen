import Link from "next/link";
import type { ReactNode } from "react";
import {
  kernelFields,
  type KernelField,
  type RegistryDetailSnapshot,
  type RegistryHealthItem,
  type RegistryHealthStatus,
  type PlatformRegistrySnapshot,
  type PlatformSnapshot
} from "@ois/shared-ui";

const navItems = [
  { id: "overview", href: "/", label: "Overview" },
  { id: "dashboard", href: "/dashboard", label: "Dashboard" },
  { id: "products", href: "/products", label: "Products" },
  { id: "workspaces", href: "/workspaces", label: "Workspaces" },
  { id: "runtime", href: "/runtime", label: "Runtime" }
];

const countLabels: Record<KernelField, string> = {
  industries: "Industries",
  organizations: "Organizations",
  workspaces: "Workspaces",
  projects: "Projects",
  products: "Products",
  installations: "Installations",
  modules: "Modules",
  auditRecords: "Audit Records"
};

export function OisConsoleShell({
  active,
  snapshot,
  children
}: {
  active: string;
  snapshot: PlatformSnapshot;
  children: ReactNode;
}) {
  const healthOk = snapshot.health.ok && snapshot.healthStatus === "ok";

  return (
    <main className="product-shell">
      <aside className="product-sidebar" aria-label="OIS Console navigation">
        <div className="brand-block">
          <span className="eyebrow">Product Administration</span>
          <h1>OIS Console</h1>
          <p>OIS_CONSOLE</p>
        </div>
        <nav className="product-nav">
          {navItems.map((item) => (
            <Link className={active === item.id ? "active" : ""} href={item.href} key={item.id}>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <section className="product-main">
        <header className="product-header">
          <div>
            <div className="demo">{snapshot.overviewBanner}</div>
            <p className="source-line">Core API source: {snapshot.coreApiUrl}</p>
          </div>
          <StatusBadge ok={healthOk} label={healthOk ? "Core API healthy" : "Core API unavailable"} />
        </header>
        {children}
      </section>
    </main>
  );
}

export function PageHeading({ title, eyebrow, children }: { title: string; eyebrow: string; children?: ReactNode }) {
  return (
    <section className="page-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {children ? <p>{children}</p> : null}
    </section>
  );
}

export function StatusBadge({ ok, label }: { ok: boolean; label: string }) {
  return <span className={ok ? "status status-ok" : "status status-warn"}>{label}</span>;
}

function HealthBadge({ status }: { status: RegistryHealthStatus }) {
  const className =
    status === "Healthy" || status === "Configured" || status === "Linked" || status === "Reachable"
      ? "status status-ok"
      : status === "Not applicable"
        ? "status status-neutral"
        : "status status-warn";

  return <span className={className}>{status}</span>;
}

function HealthBadgeRow({ badges }: { badges: RegistryHealthStatus[] }) {
  return (
    <div className="badge-row">
      {badges.map((badge) => (
        <HealthBadge status={badge} key={badge} />
      ))}
    </div>
  );
}

const healthLinkLabels: Record<string, string> = {
  coreApiDetail: "Core API detail",
  oisConsoleDetail: "OIS Console detail",
  pitsProjectDetail: "PITS Shell project",
  oisProduct: "OIS product",
  oisWorkspace: "OIS workspace",
  productRuntime: "Product runtime",
  pitsProject: "PITS project"
};

function HealthCheckList({ item }: { item: RegistryHealthItem }) {
  return (
    <div className="health-check-list">
      {item.checks.map((check) => (
        <div className="health-check" key={check.label}>
          <div>
            <strong>{check.label}</strong>
            <p className="muted">{check.detail}</p>
          </div>
          {check.url ? <a href={check.url}>Open</a> : <HealthBadge status={check.status} />}
        </div>
      ))}
    </div>
  );
}

function HealthLinks({ item }: { item: RegistryHealthItem }) {
  const links = Object.entries(item.links).filter((entry): entry is [string, string] => Boolean(entry[1]));

  if (links.length === 0) {
    return <p className="muted">No staging-safe links are configured for this health item.</p>;
  }

  return (
    <div className="link-list">
      {links.map(([key, href]) => (
        <a href={href} key={key}>
          {healthLinkLabels[key] ?? key}
        </a>
      ))}
    </div>
  );
}

export function RegistryHealthPanel({ snapshot }: { snapshot: PlatformRegistrySnapshot }) {
  const payload = snapshot.registryHealthPayload;
  const summary = payload?.summary;

  return (
    <section className="panel registry-health-panel" data-registry-health="Registry Runtime Health">
      <div className="panel-heading">
        <div>
          <h3>Registry Runtime Health</h3>
          <p className="muted">Owner-facing configured, linked and staging URL status from Core API /platform/registry/health.</p>
        </div>
        <StatusBadge
          ok={Boolean(payload && summary?.status === "Healthy")}
          label={payload ? `Registry health ${summary?.status}` : "Registry health unavailable"}
        />
      </div>
      {payload ? (
        <>
          <dl className="facts">
            <div>
              <dt>Total</dt>
              <dd>{summary?.total ?? 0}</dd>
            </div>
            <div>
              <dt>Healthy</dt>
              <dd>{summary?.healthy ?? 0}</dd>
            </div>
            <div>
              <dt>Degraded</dt>
              <dd>{summary?.degraded ?? 0}</dd>
            </div>
            <div>
              <dt>Missing URL</dt>
              <dd>{summary?.missingUrl ?? 0}</dd>
            </div>
            <div>
              <dt>OIS Console</dt>
              <dd>{payload.runtime.oisConsoleBaseUrl}</dd>
            </div>
            <div>
              <dt>PITS Shell</dt>
              <dd>{payload.runtime.pitsShellBaseUrl}</dd>
            </div>
            <div>
              <dt>Core API</dt>
              <dd>{payload.runtime.coreApiBaseUrl}</dd>
            </div>
          </dl>
          <p className="muted health-note">{payload.runtime.note}</p>
        </>
      ) : (
        <p className="muted">{snapshot.registryHealth.status ?? snapshot.registryHealth.error ?? "Health endpoint unavailable"}.</p>
      )}
    </section>
  );
}

export function RegistryHealthItemPanel({ title, item }: { title: string; item: RegistryHealthItem | null }) {
  return (
    <section className="panel registry-health-panel" data-registry-health={title}>
      <div className="panel-heading">
        <div>
          <h3>{title}</h3>
          <p className="muted">Configured, linked and runtime URL checks for this registry item.</p>
        </div>
        {item ? <HealthBadge status={item.status} /> : <StatusBadge ok={false} label="Health unavailable" />}
      </div>
      {item ? (
        <>
          <HealthBadgeRow badges={item.badges} />
          <HealthCheckList item={item} />
          <HealthLinks item={item} />
        </>
      ) : (
        <p className="muted">Core API did not return a health item for this registry entity.</p>
      )}
    </section>
  );
}

export function PlatformOverviewCard({ snapshot }: { snapshot: PlatformSnapshot }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h3>Platform Overview Counts</h3>
          <p className="muted">Seeded counts read from Core API /platform/overview.</p>
        </div>
        <StatusBadge ok={snapshot.overview.ok} label={snapshot.overview.ok ? "Overview ready" : "Overview unavailable"} />
      </div>
      <CountGrid snapshot={snapshot} fields={["industries", "organizations", "workspaces", "projects"]} />
    </section>
  );
}

export function ProductModuleOverview({ snapshot }: { snapshot: PlatformSnapshot }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h3>Product & Module Overview</h3>
          <p className="muted">Current product catalog baseline from the shared Core API.</p>
        </div>
        <span className="pill">PLATFORM_KERNEL: {snapshot.platformKernelStatus}</span>
      </div>
      <CountGrid snapshot={snapshot} fields={["products", "installations", "modules", "auditRecords"]} />
    </section>
  );
}

export function RuntimeStatusCard({ snapshot }: { snapshot: PlatformSnapshot }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h3>Runtime Status</h3>
          <p className="muted">Public staging shell status through Core API only.</p>
        </div>
        <StatusBadge
          ok={snapshot.health.ok && snapshot.healthStatus === "ok"}
          label={snapshot.health.ok ? "Health ready" : "Health unavailable"}
        />
      </div>
      <dl className="facts">
        <div>
          <dt>Status</dt>
          <dd>{snapshot.healthStatus}</dd>
        </div>
        <div>
          <dt>Service</dt>
          <dd>{snapshot.healthService}</dd>
        </div>
        <div>
          <dt>Stage</dt>
          <dd>{snapshot.healthStage}</dd>
        </div>
        <div>
          <dt>HTTP</dt>
          <dd>{snapshot.health.status ?? snapshot.health.error ?? "unavailable"}</dd>
        </div>
        <div>
          <dt>Core API</dt>
          <dd>{snapshot.coreApiUrl}</dd>
        </div>
      </dl>
    </section>
  );
}

export function DataBoundaryPanel() {
  return (
    <section className="panel">
      <h3>Data Access Boundary</h3>
      <p className="muted">
        UI shell reads product status through Core API only. DB-backed demo data is accessed only through the Core API.
      </p>
    </section>
  );
}

export function RegistryStatusPanel({ snapshot }: { snapshot: PlatformRegistrySnapshot }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h3>Platform Registry Source</h3>
          <p className="muted">Read-only registry data from Core API /platform/registry.</p>
        </div>
        <StatusBadge ok={snapshot.registry.ok} label={snapshot.registry.ok ? "Registry ready" : "Registry fallback"} />
      </div>
      <dl className="facts">
        <div>
          <dt>Source</dt>
          <dd>{snapshot.registryMetadata?.source ?? "unavailable"}</dd>
        </div>
        <div>
          <dt>Mode</dt>
          <dd>{snapshot.registryMetadata?.mode ?? "read-only"}</dd>
        </div>
        <div>
          <dt>Environment</dt>
          <dd>{snapshot.registryMetadata?.environment ?? "staging"}</dd>
        </div>
        <div>
          <dt>HTTP</dt>
          <dd>{snapshot.registry.status ?? snapshot.registry.error ?? "unavailable"}</dd>
        </div>
      </dl>
    </section>
  );
}

export function DetailStatusPanel<T>({ detail, label }: { detail: RegistryDetailSnapshot<T>; label: string }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h3>{label} Source</h3>
          <p className="muted">Read-only detail data from Core API.</p>
        </div>
        <StatusBadge ok={detail.detail.ok} label={detail.detail.ok ? "Detail ready" : detail.notFound ? "Not found" : "Detail fallback"} />
      </div>
      <dl className="facts">
        <div>
          <dt>Source</dt>
          <dd>{detail.metadata?.source ?? "unavailable"}</dd>
        </div>
        <div>
          <dt>Mode</dt>
          <dd>{detail.metadata?.mode ?? "read-only"}</dd>
        </div>
        <div>
          <dt>HTTP</dt>
          <dd>{detail.detail.status ?? detail.errorMessage ?? "unavailable"}</dd>
        </div>
        <div>
          <dt>Core API</dt>
          <dd>{detail.coreApiUrl}</dd>
        </div>
      </dl>
    </section>
  );
}

export function DetailSourceMarker({ label }: { label: string }) {
  return (
    <p className="muted detail-source-marker" data-detail-source={label}>
      {label}
    </p>
  );
}

export function DetailFallbackPanel({ title, message }: { title: string; message: string }) {
  return (
    <section className="panel">
      <span className="eyebrow">Read-only fallback</span>
      <h3>{title}</h3>
      <p className="muted">{message}</p>
    </section>
  );
}

export function DetailFacts({ facts }: { facts: Array<[string, string | number | null | undefined]> }) {
  return (
    <dl className="facts">
      {facts.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value ?? "unavailable"}</dd>
        </div>
      ))}
    </dl>
  );
}

export function RelatedLinksPanel({
  title,
  description,
  links
}: {
  title: string;
  description: string;
  links: Array<{ href: string | null; label: string; detail?: string | undefined; external?: boolean }>;
}) {
  const availableLinks = links.filter((link) => link.href);

  return (
    <section>
      <div className="panel-heading">
        <div>
          <h3>{title}</h3>
          <p className="muted">{description}</p>
        </div>
        <span className="pill">{availableLinks.length} link(s)</span>
      </div>
      <div className="list-grid">
        {availableLinks.length > 0 ? (
          availableLinks.map((link) => (
            <article className="panel compact-panel" key={`${link.href}-${link.label}`}>
              <span className="eyebrow">{link.external ? "Cross-product" : "OIS Console"}</span>
              {link.external ? (
                <a href={link.href ?? "#"}>{link.label}</a>
              ) : (
                <Link href={link.href ?? "#"}>{link.label}</Link>
              )}
              {link.detail ? <p className="muted">{link.detail}</p> : null}
            </article>
          ))
        ) : (
          <article className="panel compact-panel">
            <span className="eyebrow">Not linked yet</span>
            <h3>No registry relationship link</h3>
            <p className="muted">This entity has no related registry link in the current read-only payload.</p>
          </article>
        )}
      </div>
    </section>
  );
}

export function CountGrid({ snapshot, fields }: { snapshot: PlatformSnapshot; fields: KernelField[] }) {
  return (
    <div className="count-grid">
      {fields.map((field) => (
        <div className="count-tile" data-count-field={field} key={field}>
          <span>{countLabels[field]}</span>
          <strong>{snapshot.counts[field] ?? "-"}</strong>
        </div>
      ))}
    </div>
  );
}
