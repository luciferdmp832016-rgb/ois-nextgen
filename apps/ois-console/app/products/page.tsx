import { getPlatformSnapshot } from "@ois/shared-ui";
import { CountGrid, DataBoundaryPanel, OisConsoleShell, PageHeading, RuntimeStatusCard } from "../shell";

export const dynamic = "force-dynamic";

const productAreas = [
  ["OIS Console", "Product administration shell", "OIS_CONSOLE"],
  ["PITS Shell", "Product runtime shell", "PITS_SHELL"],
  ["Platform Kernel", "Tenant, product and module foundation", "PLATFORM_KERNEL"],
  ["Knowledge", "Deferred until Phase 2 rules", "BLOCKED_BY_PHASE2"],
  ["Regression Certification", "Deferred until Phase 3 tests", "BLOCKED_BY_PHASE3"]
] as const;

export default async function ProductsPage() {
  const snapshot = await getPlatformSnapshot();

  return (
    <OisConsoleShell active="products" snapshot={snapshot}>
      <PageHeading eyebrow="Product Catalog" title="Products & Modules">
        Product and module baseline for the current public staging runtime.
      </PageHeading>
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h3>Product & Module Overview</h3>
            <p className="muted">Catalog counts are read from Core API /platform/overview.</p>
          </div>
          <span className="pill">PLATFORM_KERNEL: {snapshot.platformKernelStatus}</span>
        </div>
        <CountGrid snapshot={snapshot} fields={["products", "installations", "modules", "auditRecords"]} />
      </section>
      <section className="list-grid" aria-label="Product areas">
        {productAreas.map(([name, description, code]) => (
          <article className="panel compact-panel" key={code}>
            <span className="eyebrow">{code}</span>
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
