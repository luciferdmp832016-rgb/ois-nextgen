import Link from "next/link";
import type { ReactNode } from "react";
import { kernelFields, type KernelField, type PlatformSnapshot } from "@ois/shared-ui";

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
