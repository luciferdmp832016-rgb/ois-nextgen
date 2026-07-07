import Link from "next/link";
import type { ReactNode } from "react";
import {
  kernelFields,
  type KernelField,
  type RegistryDetailSnapshot,
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
