import { getPlatformSnapshot } from "@ois/shared-ui";
import { CountGrid, DataBoundaryPanel, OisConsoleShell, PageHeading, RuntimeStatusCard } from "../shell";

export const dynamic = "force-dynamic";

const workspaceAreas = [
  ["PMC Org Demo", "Primary staging organization", "organizations"],
  ["Default Workspace", "Control-plane workspace baseline", "workspaces"],
  ["Emerald Precinct Demo", "PITS-enabled project", "projects"],
  ["Second Project Demo", "Secondary seeded project", "projects"]
] as const;

export default async function WorkspacesPage() {
  const snapshot = await getPlatformSnapshot();

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
        {workspaceAreas.map(([name, description, field], index) => (
          <article className="panel compact-panel" key={`${name}-${index}`}>
            <span className="eyebrow">{field}</span>
            <h3>{name}</h3>
            <p className="muted">{description}</p>
          </article>
        ))}
      </section>
      <section className="dashboard-grid">
        <RuntimeStatusCard snapshot={snapshot} />
        <DataBoundaryPanel />
      </section>
    </OisConsoleShell>
  );
}
