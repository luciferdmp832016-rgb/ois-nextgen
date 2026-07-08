import {
  buildCrossProductLinkTargets,
  findRegistryHealthItem,
  findRegistryReadinessItem,
  getModuleRegistryDetail,
  getPlatformRegistrySnapshot
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

type ModuleDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ModuleDetailPage({ params }: ModuleDetailPageProps) {
  const { id } = await params;
  const snapshot = await getPlatformRegistrySnapshot();
  const detail = await getModuleRegistryDetail(id, snapshot.coreApiUrl);
  const module = detail.item;

  if (!module) {
    return (
      <OisConsoleShell active="products" snapshot={snapshot}>
        <PageHeading title="Module Not Found" eyebrow="Module Registry Detail">
          The requested module was not returned by the read-only Core API registry.
        </PageHeading>
        <DetailSourceMarker label="Module Detail Source" />
        <section className="dashboard-grid">
          <DetailStatusPanel detail={detail} label="Module Detail" />
          <DetailFallbackPanel title="Module not linked yet" message={detail.errorMessage ?? "Core API returned no module detail."} />
          <DataBoundaryPanel />
        </section>
      </OisConsoleShell>
    );
  }

  const moduleHealth = findRegistryHealthItem(snapshot, "modules", module.id);
  const moduleReadiness = findRegistryReadinessItem(snapshot, "modules", module.id);

  return (
    <OisConsoleShell active="products" snapshot={snapshot}>
      <PageHeading title={module.code} eyebrow={module.productCode}>
        Read-only module detail with product and installation relationships.
      </PageHeading>
      <DetailSourceMarker label="Module Detail Source" />

      <section className="panel">
        <DetailFacts
          facts={[
            ["Module ID", module.id],
            ["Layer", module.layerCode],
            ["Scope", module.scope],
            ["Realm", module.realmCode],
            ["Module Type", module.moduleType],
            ["Lifecycle", module.lifecycle]
          ]}
        />
      </section>

      <RegistryReadinessItemPanel title="Module Governance / Readiness" item={moduleReadiness} />

      <RegistryHealthItemPanel title="Module Runtime Health" item={moduleHealth} />

      <RelatedLinksPanel
        title="Related Product And Installations"
        description="Module relationships are derived from the owning product and current installations."
        links={[
          {
            href: module.relationships?.product ? `/products/${module.relationships.product.id}` : null,
            label: module.relationships?.product?.name ?? "Product not linked yet",
            detail: module.relationships?.product?.code
          },
          ...(module.relationships?.installations ?? []).map((installation) => {
            const targets = buildCrossProductLinkTargets({ installationId: installation.id, projectId: installation.projectId });
            return {
              href: targets.oisInstallation,
              label: `Installation ${installation.productCode}`,
              detail: installation.project?.name ?? installation.projectId
            };
          })
        ]}
      />

      <section className="dashboard-grid">
        <DetailStatusPanel detail={detail} label="Module Detail" />
        <DataBoundaryPanel />
      </section>
    </OisConsoleShell>
  );
}
