import Link from "next/link";
import { findRegistryHealthItem, findRegistryReadinessItem, getPlatformRegistrySnapshot } from "@ois/shared-ui";
import {
  CountGrid,
  DataBoundaryPanel,
  OisConsoleShell,
  OwnerRegistryCockpit,
  PageHeading,
  RegistryCardUatSummary,
  RegistryGovernancePanel,
  RegistryHealthPanel,
  RegistryStatusPanel,
  RuntimeStatusCard
} from "../shell";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const snapshot = await getPlatformRegistrySnapshot();

  return (
    <OisConsoleShell active="products" snapshot={snapshot}>
      <PageHeading eyebrow="Product Catalog" title="Products & Modules">
        Product and module baseline for the current public staging runtime.
      </PageHeading>
      <OwnerRegistryCockpit snapshot={snapshot} />
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
          snapshot.products.map((product) => {
            const workspaceLinks = new Set(product.installations.map((installation) => installation.workspaceId).filter(Boolean)).size;
            const projectLinks = new Set(product.installations.map((installation) => installation.projectId).filter(Boolean)).size;

            return (
              <article className="panel compact-panel" key={product.id}>
                <span className="eyebrow">{product.code}</span>
                <h3>
                  <Link href={`/products/${product.id}`}>{product.name}</Link>
                </h3>
                <p className="muted">
                  {product.lifecycle} product with {product.modules.length} module(s) and {product.installations.length} installation(s).
                </p>
                <RegistryCardUatSummary
                  health={findRegistryHealthItem(snapshot, "products", product.id)}
                  readiness={findRegistryReadinessItem(snapshot, "products", product.id)}
                  linkedLabel={`${workspaceLinks} workspace link(s), ${projectLinks} project link(s), ${product.modules.length} module link(s), ${product.installations.length} installation link(s)`}
                />
                <strong>Version {product.version}</strong>
              </article>
            );
          })
        ) : (
          <article className="panel compact-panel owner-empty-state" data-owner-empty-state="Owner-safe empty state">
            <span className="eyebrow">Needs owner review</span>
            <h3>No products returned</h3>
            <p className="muted">No products are available in this registry view. Confirm registry data after owner runtime sync.</p>
            <p className="muted owner-safe-note">Safe empty state: only registry-safe summary copy is shown.</p>
          </article>
        )}
      </section>
      <section className="list-grid" aria-label="Module registry">
        {snapshot.modules.length > 0 ? (
          snapshot.modules.map((module) => (
            <article className="panel compact-panel" key={module.id}>
              <span className="eyebrow">{module.productCode}</span>
              <h3>
                <Link href={`/modules/${module.id}`}>{module.code}</Link>
              </h3>
              <p className="muted">
                {module.moduleType} in {module.layerCode}; scope {module.scope}; realm {module.realmCode}.
              </p>
              <RegistryCardUatSummary
                health={findRegistryHealthItem(snapshot, "modules", module.id)}
                readiness={findRegistryReadinessItem(snapshot, "modules", module.id)}
                linkedLabel={`Linked product ${module.product?.name ?? module.productCode}`}
              />
              <strong>{module.lifecycle}</strong>
            </article>
          ))
        ) : (
          <article className="panel compact-panel owner-empty-state" data-owner-empty-state="Owner-safe empty state">
            <span className="eyebrow">Needs owner review</span>
            <h3>No modules returned</h3>
            <p className="muted">No modules are available in this registry view. Confirm registry data after owner runtime sync.</p>
            <p className="muted owner-safe-note">Safe empty state: only registry-safe summary copy is shown.</p>
          </article>
        )}
      </section>
      <section className="dashboard-grid">
        <RegistryGovernancePanel snapshot={snapshot} />
        <RegistryHealthPanel snapshot={snapshot} />
        <RegistryStatusPanel snapshot={snapshot} />
        <RuntimeStatusCard snapshot={snapshot} />
        <DataBoundaryPanel />
      </section>
    </OisConsoleShell>
  );
}
