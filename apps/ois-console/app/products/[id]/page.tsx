import Link from "next/link";
import {
  buildCrossProductLinkTargets,
  findRegistryHealthItem,
  findRegistryReadinessItem,
  getPlatformRegistrySnapshot,
  getProductRegistryDetail
} from "@ois/shared-ui";
import {
  DataBoundaryPanel,
  DetailFacts,
  DetailFallbackPanel,
  DetailSourceMarker,
  DetailStatusPanel,
  OisConsoleShell,
  PageHeading,
  RegistryHealthItemPanel,
  RegistryReadinessItemPanel,
  RelatedLinksPanel
} from "../../shell";

export const dynamic = "force-dynamic";

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const snapshot = await getPlatformRegistrySnapshot();
  const detail = await getProductRegistryDetail(id, snapshot.coreApiUrl);
  const product = detail.item;

  if (!product) {
    return (
      <OisConsoleShell active="products" snapshot={snapshot}>
        <PageHeading title="Product Not Found" eyebrow="Product Registry Detail">
          The requested product was not returned by the read-only Core API registry.
        </PageHeading>
        <DetailSourceMarker label="Product Detail Source" />
        <section className="dashboard-grid">
          <DetailStatusPanel detail={detail} label="Product Detail" />
          <DetailFallbackPanel title="Product not linked yet" message={detail.errorMessage ?? "Core API returned no product detail."} />
          <DataBoundaryPanel />
        </section>
      </OisConsoleShell>
    );
  }

  const productHealth = findRegistryHealthItem(snapshot, "products", product.id);
  const productReadiness = findRegistryReadinessItem(snapshot, "products", product.id);

  return (
    <OisConsoleShell active="products" snapshot={snapshot}>
      <PageHeading title={product.name} eyebrow={product.code}>
        Read-only product detail with module, installation, workspace and PITS project relationships.
      </PageHeading>
      <DetailSourceMarker label="Product Detail Source" />

      <section className="panel">
        <DetailFacts
          facts={[
            ["Product ID", product.id],
            ["Code", product.code],
            ["Lifecycle", product.lifecycle],
            ["Version", product.version],
            ["Modules", product.relationships?.modules.length ?? product.modules.length],
            ["Installations", product.relationships?.installations.length ?? product.installations.length]
          ]}
        />
      </section>

      <RegistryReadinessItemPanel title="Product Governance / Readiness" item={productReadiness} />

      <RegistryHealthItemPanel title="Product Runtime Health" item={productHealth} />

      <section className="list-grid" aria-label="Product modules">
        {(product.relationships?.modules ?? product.modules).map((module) => (
          <article className="panel compact-panel" key={module.id}>
            <span className="eyebrow">{module.layerCode}</span>
            <h3>
              <Link href={`/modules/${module.id}`}>{module.code}</Link>
            </h3>
            <p className="muted">
              {module.moduleType}; scope {module.scope}; realm {module.realmCode}.
            </p>
            <strong>{module.lifecycle}</strong>
          </article>
        ))}
      </section>

      <RelatedLinksPanel
        title="Related Installation Links"
        description="OIS Console installation details and cross-product PITS project links from registry relationships."
        links={(product.relationships?.installations ?? product.installations).flatMap((installation) => {
          const targets = buildCrossProductLinkTargets({
            installationId: installation.id,
            workspaceId: installation.workspaceId,
            projectId: installation.projectId
          });

          return [
            {
              href: targets.oisInstallation,
              label: `OIS installation ${installation.productCode}`,
              detail: installation.project?.name ?? installation.projectId
            },
            {
              href: targets.pitsProject,
              label: `Open PITS project ${installation.project?.name ?? installation.projectId}`,
              detail: "Cross-product staging link",
              external: true
            }
          ];
        })}
      />

      <section className="dashboard-grid">
        <DetailStatusPanel detail={detail} label="Product Detail" />
        <DataBoundaryPanel />
      </section>
    </OisConsoleShell>
  );
}
