import Link from "next/link";
import { getPlatformRegistrySnapshot } from "@ois/shared-ui";
import {
  DataBoundaryPanel,
  OisConsoleShell,
  PageHeading,
  PlatformOverviewCard,
  RegistryGovernancePanel,
  ProductModuleOverview,
  RegistryHealthPanel,
  RegistryStatusPanel,
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
  const snapshot = await getPlatformRegistrySnapshot();
  const registryLinks = [
    snapshot.products[0]
      ? { href: `/products/${snapshot.products[0].id}`, label: snapshot.products[0].name, detail: "Product detail" }
      : null,
    snapshot.workspaces[0]
      ? { href: `/workspaces/${snapshot.workspaces[0].id}`, label: snapshot.workspaces[0].name, detail: "Workspace detail" }
      : null,
    snapshot.modules[0] ? { href: `/modules/${snapshot.modules[0].id}`, label: snapshot.modules[0].code, detail: "Module detail" } : null,
    snapshot.installations[0]
      ? {
          href: `/installations/${snapshot.installations[0].id}`,
          label: `${snapshot.installations[0].productCode} installation`,
          detail: "Installation detail"
        }
      : null
  ].filter((link): link is { href: string; label: string; detail: string } => Boolean(link));

  return (
    <OisConsoleShell active="dashboard" snapshot={snapshot}>
      <PageHeading eyebrow="Dashboard" title="Platform Overview">
        Administration dashboard for the current staging Platform Kernel baseline.
      </PageHeading>
      <section className="dashboard-grid">
        <PlatformOverviewCard snapshot={snapshot} />
        <ProductModuleOverview snapshot={snapshot} />
        <RegistryGovernancePanel snapshot={snapshot} />
        <RegistryHealthPanel snapshot={snapshot} />
        <RegistryStatusPanel snapshot={snapshot} />
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
      <section className="list-grid" aria-label="Registry detail links">
        {registryLinks.map((link) => (
          <article className="panel compact-panel" key={link.href}>
            <span className="eyebrow">{link.detail}</span>
            <h3>
              <Link href={link.href}>{link.label}</Link>
            </h3>
            <p className="muted">Read-only registry detail route.</p>
          </article>
        ))}
      </section>
    </OisConsoleShell>
  );
}
