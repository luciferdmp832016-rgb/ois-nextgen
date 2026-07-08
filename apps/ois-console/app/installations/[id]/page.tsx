import {
  buildCrossProductLinkTargets,
  findRegistryHealthItem,
  findRegistryReadinessItem,
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
  OwnerEntityUatSummary,
  OwnerReviewQueuePanel,
  PageHeading,
  RegistryHealthItemPanel,
  RegistryReadinessItemPanel,
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
            message={detail.errorMessage ?? "No installation detail is available in the current registry view."}
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
  const installationReadiness = findRegistryReadinessItem(snapshot, "installations", installation.id);
  const modules = installation.relationships?.modules ?? [];

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

      <OwnerEntityUatSummary
        title="Owner-facing UAT summary"
        health={installationHealth}
        readiness={installationReadiness}
        linkedFacts={[
          `Linked product ${installation.product?.name ?? installation.productCode}`,
          `Linked workspace ${installation.workspace?.name ?? installation.workspaceId}`,
          `Linked project ${installation.project?.name ?? installation.projectId}`,
          `${modules.length} module link(s)`
        ]}
        links={[
          {
            href: targets.oisProduct,
            label: `Open product ${installation.product?.name ?? installation.productCode}`,
            detail: installation.productCode
          },
          {
            href: targets.oisWorkspace,
            label: `Open workspace ${installation.workspace?.name ?? installation.workspaceId}`,
            detail: installation.workspace?.code
          },
          {
            href: targets.pitsProject,
            label: `Linked to PITS ${installation.project?.name ?? installation.projectId}`,
            detail: "Cross-product staging link",
            external: true
          }
        ]}
      />

      <OwnerReviewQueuePanel snapshot={snapshot} entityType="installation" entityId={installation.id} />

      <RegistryReadinessItemPanel title="Installation Governance / Readiness" item={installationReadiness} />

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
          ...modules.map((module) => ({
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
