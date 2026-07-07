import { getPlatformSnapshot } from "@ois/shared-ui";
import {
  DataBoundaryPanel,
  OisConsoleShell,
  PageHeading,
  PlatformOverviewCard,
  ProductModuleOverview,
  RuntimeStatusCard
} from "../shell";

export const dynamic = "force-dynamic";

const controlAreas = [
  ["Organizations", "Tenant-scoped organization control"],
  ["Workspaces", "Workspace and access surfaces"],
  ["Projects", "Project-level product placement"],
  ["Module Catalog", "Module readiness and lifecycle"],
  ["Architecture Status", "Phase gates and staging evidence"]
] as const;

export default async function DashboardPage() {
  const snapshot = await getPlatformSnapshot();

  return (
    <OisConsoleShell active="dashboard" snapshot={snapshot}>
      <PageHeading eyebrow="Dashboard" title="Platform Overview">
        Administration dashboard for the current staging Platform Kernel baseline.
      </PageHeading>
      <section className="dashboard-grid">
        <PlatformOverviewCard snapshot={snapshot} />
        <ProductModuleOverview snapshot={snapshot} />
        <RuntimeStatusCard snapshot={snapshot} />
        <DataBoundaryPanel />
      </section>
      <section className="list-grid" aria-label="Control plane areas">
        {controlAreas.map(([name, description]) => (
          <article className="panel compact-panel" key={name}>
            <h3>{name}</h3>
            <p className="muted">{description}</p>
          </article>
        ))}
      </section>
    </OisConsoleShell>
  );
}
