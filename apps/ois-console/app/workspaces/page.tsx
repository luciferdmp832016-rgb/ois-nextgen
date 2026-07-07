import Link from "next/link";
import { getPlatformRegistrySnapshot } from "@ois/shared-ui";
import { CountGrid, DataBoundaryPanel, OisConsoleShell, PageHeading, RegistryStatusPanel, RuntimeStatusCard } from "../shell";

export const dynamic = "force-dynamic";

export default async function WorkspacesPage() {
  const snapshot = await getPlatformRegistrySnapshot();

  return (
    <OisConsoleShell active="workspaces" snapshot={snapshot}>
      <PageHeading eyebrow="Workspace Control" title="Organizations, Workspaces & Projects">
        Tenant-scoped navigation baseline for the seeded staging organization.
      </PageHeading>
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h3>Workspace Overview</h3>
            <p className="muted">Organizational counts read through the shared Core API.</p>
          </div>
          <span className="pill">Core API only</span>
        </div>
        <CountGrid snapshot={snapshot} fields={["industries", "organizations", "workspaces", "projects"]} />
      </section>
      <section className="list-grid" aria-label="Workspace areas">
        {snapshot.organizations.map((organization) => (
          <article className="panel compact-panel" key={organization.id}>
            <span className="eyebrow">{organization.code}</span>
            <h3>{organization.name}</h3>
            <p className="muted">Industry: {organization.industry.name}</p>
            <strong>{organization.lifecycle}</strong>
          </article>
        ))}
        {snapshot.workspaces.map((workspace) => (
          <article className="panel compact-panel" key={workspace.id}>
            <span className="eyebrow">{workspace.organization.code}</span>
            <h3>
              <Link href={`/workspaces/${workspace.id}`}>{workspace.name}</Link>
            </h3>
            <p className="muted">
              {workspace.projects.length} project(s), {workspace.installations.length} installation(s).
            </p>
            <strong>{workspace.lifecycle}</strong>
          </article>
        ))}
        {snapshot.workspaces.length === 0 && snapshot.organizations.length === 0 ? (
          <article className="panel compact-panel">
            <span className="eyebrow">Registry fallback</span>
            <h3>No workspaces returned</h3>
            <p className="muted">Core API returned empty organization and workspace registry arrays.</p>
          </article>
        ) : null}
      </section>
      <section className="list-grid" aria-label="Project registry">
        {snapshot.projects.length > 0 ? (
          snapshot.projects.map((project) => (
            <article className="panel compact-panel" key={project.id}>
              <span className="eyebrow">{project.workspace?.code ?? project.workspaceId}</span>
              <h3>{project.name}</h3>
              <p className="muted">
                {project.installations.length} installation(s) in {project.organization?.name ?? "unknown organization"}.
              </p>
              <strong>{project.lifecycle}</strong>
            </article>
          ))
        ) : (
          <article className="panel compact-panel">
            <span className="eyebrow">Registry fallback</span>
            <h3>No projects returned</h3>
            <p className="muted">Core API returned an empty project registry array.</p>
          </article>
        )}
      </section>
      <section className="dashboard-grid">
        <RegistryStatusPanel snapshot={snapshot} />
        <RuntimeStatusCard snapshot={snapshot} />
        <DataBoundaryPanel />
      </section>
    </OisConsoleShell>
  );
}
