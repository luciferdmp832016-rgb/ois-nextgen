import Link from "next/link";
import type { ReactNode } from "react";
import { kernelFields, type KernelField, type PlatformSnapshot } from "@ois/shared-ui";

const navItems = [
  { id: "overview", href: "/", label: "Overview" },
  { id: "projects", href: "/projects", label: "Projects" },
  { id: "runtime", href: "/runtime", label: "Runtime" }
];

const projects = [
  {
    name: "Emerald Precinct Demo",
    code: "PITS-EMERALD",
    status: "PITS installation active",
    summary: "Seeded project workspace for field-report runtime navigation."
  },
  {
    name: "Second Project Demo",
    code: "PITS-SECOND",
    status: "PITS installation active",
    summary: "Secondary project baseline for multi-project selector behavior."
  }
] as const;

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

export function PitsShell({
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
    <main className="runtime-shell">
      <header className="runtime-header">
        <div>
          <div className="demo">{snapshot.overviewBanner}</div>
          <h1>PITS Shell</h1>
          <p>PITS_SHELL</p>
        </div>
        <div className="header-status">
          <span className="source-line">Core API source: {snapshot.coreApiUrl}</span>
          <StatusBadge ok={healthOk} label={healthOk ? "Core API healthy" : "Core API unavailable"} />
        </div>
      </header>
      <nav className="runtime-nav" aria-label="PITS Shell navigation">
        {navItems.map((item) => (
          <Link className={active === item.id ? "active" : ""} href={item.href} key={item.id}>
            {item.label}
          </Link>
        ))}
      </nav>
      <section className="runtime-content">{children}</section>
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

export function ProjectSelector({ snapshot }: { snapshot: PlatformSnapshot }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h3>Project Selector</h3>
          <p className="muted">Project count from Core API /platform/overview: {snapshot.counts.projects ?? "-"}.</p>
        </div>
        <span className="pill">Installations: {snapshot.counts.installations ?? "-"}</span>
      </div>
      <div className="project-grid">
        {projects.map((project) => (
          <article className="project-card" key={project.code}>
            <span className="eyebrow">{project.code}</span>
            <h3>{project.name}</h3>
            <p className="muted">{project.summary}</p>
            <strong>{project.status}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

export function RuntimeStatusCard({ snapshot }: { snapshot: PlatformSnapshot }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h3>Runtime Status</h3>
          <p className="muted">PITS reads platform data through Core API only.</p>
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

export function ProjectOverviewCards({ snapshot }: { snapshot: PlatformSnapshot }) {
  return (
    <section className="metrics-grid" aria-label="PITS project overview">
      <Metric label="Projects" value={snapshot.counts.projects} />
      <Metric label="Products" value={snapshot.counts.products} />
      <Metric label="Installations" value={snapshot.counts.installations} />
      <Metric label="Modules" value={snapshot.counts.modules} />
    </section>
  );
}

export function PlatformCountsPanel({ snapshot }: { snapshot: PlatformSnapshot }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h3>Platform Overview Counts</h3>
          <p className="muted">Seeded staging counts from Core API /platform/overview.</p>
        </div>
        <span className="pill">PLATFORM_KERNEL: {snapshot.platformKernelStatus}</span>
      </div>
      <div className="metrics-grid">
        {kernelFields.map((field) => (
          <Metric field={field} label={countLabels[field]} value={snapshot.counts[field]} key={field} />
        ))}
      </div>
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

function Metric({ label, value, field }: { label: string; value: number | null; field?: KernelField }) {
  return (
    <section className="metric-tile" data-count-field={field}>
      <span>{label}</span>
      <strong>{value ?? "-"}</strong>
    </section>
  );
}
