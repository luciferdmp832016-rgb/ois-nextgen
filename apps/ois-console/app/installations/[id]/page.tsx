import {
  buildCrossProductLinkTargets,
  findRegistryHealthItem,
  getInstallationRegistryDetail,
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
  RelatedLinksPanel
} from "../../shell";

export const dynamic = "force-dynamic";

type InstallationDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function InstallationDetailPage({ params }: InstallationDetailPageProps) {
  const { id } = await params;
  const snapshot = await getPlatformRegistrySnapshot();
  const detail = await getInstallationRegistryDetail(id, snapshot.coreApiUrl);
  const installation = detail.item;

  if (!installation) {
    return (
      <OisConsoleShell active="products" snapshot={snapshot}>
        <PageHeading title="Installation Not Found" eyebrow="Installation Registry Detail">
          The requested installation was not returned by the read-only Core API registry.
        </PageHeading>
        <DetailSourceMarker label="Installation Detail Source" />
        <section className="dashboard-grid">
          <DetailStatusPanel detail={detail} label="Installation Detail" />
          <DetailFallbackPanel
            title="Installation not linked yet"
            message={detail.errorMessage ?? "Core API returned no installation detail."}
          />
          <DataBoundaryPanel />
        </section>
      </OisConsoleShell>
    );
  }

  const targets = buildCrossProductLinkTargets({
    productId: installation.productId,
    workspaceId: installation.workspaceId,
    installationId: installation.id,
    projectId: installation.projectId
  });
  const installationHealth = findRegistryHealthItem(snapshot, "installations", installation.id);

  return (
    <OisConsoleShell active="products" snapshot={snapshot}>
      <PageHeading title={`${installation.productCode} Installation`} eyebrow={installation.id}>
        Read-only installation detail with product, workspace, project and module relationships.
      </PageHeading>
      <DetailSourceMarker label="Installation Detail Source" />

      <section className="panel">
        <DetailFacts
          facts={[
            ["Installation ID", installation.id],
            ["Product", installation.product?.name ?? installation.productCode],
            ["Organization", installation.organization?.name],
            ["Workspace", installation.workspace?.name],
            ["Project", installation.project?.name],
            ["Lifecycle", installation.lifecycle]
          ]}
        />
      </section>

      <RegistryHealthItemPanel title="Installation Runtime Health" item={installationHealth} />

      <RelatedLinksPanel
        title="Related Registry Links"
        description="Installation context can navigate within OIS Console or open the related PITS project."
        links={[
          {
            href: targets.oisProduct,
            label: `OIS product ${installation.product?.name ?? installation.productCode}`,
            detail: installation.productCode
          },
          {
            href: targets.oisWorkspace,
            label: `OIS workspace ${installation.workspace?.name ?? installation.workspaceId}`,
            detail: installation.workspace?.code
          },
          {
            href: targets.pitsProject,
            label: `Open PITS project ${installation.project?.name ?? installation.projectId}`,
            detail: "Cross-product staging link",
            external: true
          },
          ...(installation.relationships?.modules ?? []).map((module) => ({
            href: `/modules/${module.id}`,
            label: module.code,
            detail: module.moduleType
          }))
        ]}
      />

      <section className="dashboard-grid">
        <DetailStatusPanel detail={detail} label="Installation Detail" />
        <DataBoundaryPanel />
      </section>
    </OisConsoleShell>
  );
}
