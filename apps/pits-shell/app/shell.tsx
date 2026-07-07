import Link from "next/link";
import type { ReactNode } from "react";
import {
  kernelFields,
  type KernelField,
  type PlatformRegistrySnapshot,
  type PlatformSnapshot,
  type RegistryDetailSnapshot
} from "@ois/shared-ui";

const navItems = [
  { id: "overview", href: "/", label: "Overview" },
  { id: "projects", href: "/projects", label: "Projects" },
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

export function ProjectSelector({ snapshot }: { snapshot: PlatformRegistrySnapshot }) {
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
        {snapshot.projects.length > 0 ? (
          snapshot.projects.map((project) => (
            <article className="project-card" key={project.id}>
              <span className="eyebrow">{project.code}</span>
              <h3>
                <Link href={`/projects/${project.id}`}>{project.name}</Link>
              </h3>
              <p className="muted">
                {project.organization?.name ?? "Unknown organization"} / {project.workspace?.name ?? "Unknown workspace"}
              </p>
              <strong>{project.installations.length} installation(s)</strong>
            </article>
          ))
        ) : (
          <article className="project-card">
            <span className="eyebrow">Registry fallback</span>
            <h3>No projects returned</h3>
            <p className="muted">Core API returned an empty project registry array.</p>
            <strong>Read-only</strong>
          </article>
        )}
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

export function InstallationRegistryPanel({ snapshot }: { snapshot: PlatformRegistrySnapshot }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h3>Project Installation Registry</h3>
          <p className="muted">PITS installation mapping read from Core API /platform/registry.</p>
        </div>
        <span className="pill">Installations: {snapshot.installations.length}</span>
      </div>
      <div className="project-grid">
        {snapshot.installations.length > 0 ? (
          snapshot.installations.map((installation) => (
            <article className="project-card" key={installation.id}>
              <span className="eyebrow">{installation.productCode}</span>
              <h3>{installation.project?.name ?? installation.projectId}</h3>
              <p className="muted">
                {installation.workspace?.name ?? "Unknown workspace"} / {installation.organization?.name ?? "Unknown organization"}
              </p>
              <strong>{installation.lifecycle}</strong>
            </article>
          ))
        ) : (
          <article className="project-card">
            <span className="eyebrow">Registry fallback</span>
            <h3>No installations returned</h3>
            <p className="muted">Core API returned an empty installation registry array.</p>
            <strong>Read-only</strong>
          </article>
        )}
      </div>
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
      <div className="project-grid">
        {availableLinks.length > 0 ? (
          availableLinks.map((link) => (
            <article className="project-card" key={`${link.href}-${link.label}`}>
              <span className="eyebrow">{link.external ? "Cross-product" : "PITS Shell"}</span>
              {link.external ? (
                <a href={link.href ?? "#"}>{link.label}</a>
              ) : (
                <Link href={link.href ?? "#"}>{link.label}</Link>
              )}
              {link.detail ? <p className="muted">{link.detail}</p> : null}
            </article>
          ))
        ) : (
          <article className="project-card">
            <span className="eyebrow">Not linked yet</span>
            <h3>No registry relationship link</h3>
            <p className="muted">This project has no related registry link in the current read-only payload.</p>
          </article>
        )}
      </div>
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
