import { getPlatformRegistrySnapshot } from "@ois/shared-ui";
import { CountGrid, DataBoundaryPanel, OisConsoleShell, PageHeading, RegistryStatusPanel, RuntimeStatusCard } from "../shell";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const snapshot = await getPlatformRegistrySnapshot();

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
        {snapshot.products.length > 0 ? (
          snapshot.products.map((product) => (
            <article className="panel compact-panel" key={product.id}>
              <span className="eyebrow">{product.code}</span>
              <h3>{product.name}</h3>
              <p className="muted">
                {product.lifecycle} product with {product.modules.length} module(s) and {product.installations.length} installation(s).
              </p>
              <strong>Version {product.version}</strong>
            </article>
          ))
        ) : (
          <article className="panel compact-panel">
            <span className="eyebrow">Registry fallback</span>
            <h3>No products returned</h3>
            <p className="muted">Core API returned an empty product registry array.</p>
          </article>
        )}
      </section>
      <section className="list-grid" aria-label="Module registry">
        {snapshot.modules.length > 0 ? (
          snapshot.modules.map((module) => (
            <article className="panel compact-panel" key={module.id}>
              <span className="eyebrow">{module.productCode}</span>
              <h3>{module.code}</h3>
              <p className="muted">
                {module.moduleType} in {module.layerCode}; scope {module.scope}; realm {module.realmCode}.
              </p>
              <strong>{module.lifecycle}</strong>
            </article>
          ))
        ) : (
          <article className="panel compact-panel">
            <span className="eyebrow">Registry fallback</span>
            <h3>No modules returned</h3>
            <p className="muted">Core API returned an empty module registry array.</p>
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
