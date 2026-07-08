import {
  buildCrossProductLinkTargets,
  findRegistryHealthItem,
  findRegistryReadinessItem,
  getPlatformRegistrySnapshot,
  getProjectRegistryDetail
} from "@ois/shared-ui";
import {
  DataBoundaryPanel,
  DetailFacts,
  DetailFallbackPanel,
  DetailSourceMarker,
  DetailStatusPanel,
  PageHeading,
  PitsAdminBoundaryPanel,
  PitsOwnerEntityUatSummary,
  PitsOwnerReviewQueuePanel,
  PitsShell,
  RegistryHealthItemPanel,
  RegistryReadinessItemPanel,
  RelatedLinksPanel,
  RuntimeStatusCard
} from "../../shell";

export const dynamic = "force-dynamic";

type ProjectDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const snapshot = await getPlatformRegistrySnapshot();
  const detail = await getProjectRegistryDetail(id, snapshot.coreApiUrl);
  const project = detail.item;

  if (!project) {
    return (
      <PitsShell active="projects" snapshot={snapshot}>
        <PageHeading title="Project Not Found" eyebrow="Project Registry Detail">
          The requested project was not returned by the read-only Core API registry.
        </PageHeading>
        <DetailSourceMarker label="Project Detail Source" />
        <section className="dashboard-grid">
          <DetailStatusPanel detail={detail} label="Project Detail" />
          <DetailFallbackPanel title="Project not linked yet" message={detail.errorMessage ?? "No project detail is available in the current registry view."} />
          <DataBoundaryPanel />
        </section>
      </PitsShell>
    );
  }

  const projectHealth = findRegistryHealthItem(snapshot, "projects", project.id);
  const projectReadiness = findRegistryReadinessItem(snapshot, "projects", project.id);
  const installations = project.relationships?.installations ?? project.installations;
  const products = project.relationships?.products ?? [];
  const modules = project.relationships?.modules ?? [];
  const firstInstallation = installations[0];
  const firstProduct = firstInstallation ? products.find((item) => item.code === firstInstallation.productCode) : null;
  const targets = buildCrossProductLinkTargets({
    productId: firstInstallation?.productId ?? firstProduct?.id,
    workspaceId: project.workspaceId,
    projectId: project.id
  });

  return (
    <PitsShell active="projects" snapshot={snapshot}>
      <PageHeading title={project.name} eyebrow={project.code}>
        Read-only PITS project detail with related platform products, installations and OIS Console links.
      </PageHeading>
      <DetailSourceMarker label="Project Detail Source" />

      <section className="panel">
        <DetailFacts
          facts={[
            ["Project ID", project.id],
            ["Workspace", project.workspace?.name ?? project.workspaceId],
            ["Organization", project.organization?.name],
            ["Lifecycle", project.lifecycle],
            ["Version", project.version],
            ["Installations", installations.length]
          ]}
        />
      </section>

      <PitsOwnerEntityUatSummary
        title="Owner-facing project UAT summary"
        health={projectHealth}
        readiness={projectReadiness}
        linkedFacts={[
          `Linked product(s): ${products.length}`,
          `Linked workspace ${project.workspace?.name ?? project.workspaceId}`,
          `${installations.length} installation link(s)`,
          `${modules.length} module link(s)`
        ]}
        links={[
          {
            href: targets.oisProduct,
            label: `Open OIS product ${firstInstallation?.productName ?? firstInstallation?.productCode ?? "product"}`,
            detail: firstInstallation?.productCode,
            external: true
          },
          {
            href: targets.oisWorkspace,
            label: `Open OIS workspace ${project.workspace?.name ?? project.workspaceId}`,
            detail: "Cross-product staging link",
            external: true
          }
        ]}
      />

      <PitsOwnerReviewQueuePanel snapshot={snapshot} entityType="project" entityId={project.id} />

      <PitsAdminBoundaryPanel snapshot={snapshot} entityType="project" entityId={project.id} />

      <RegistryReadinessItemPanel title="Project Governance / Readiness" item={projectReadiness} />

      <RegistryHealthItemPanel title="Project Runtime Health" item={projectHealth} />

      <RelatedLinksPanel
        title="Related OIS Console Links"
        description="Cross-product links use staging public base URLs and never legacy production domains."
        links={installations.flatMap((installation) => {
          const product = project.relationships?.products.find((item) => item.code === installation.productCode);
          const targets = buildCrossProductLinkTargets({
            productId: installation.productId ?? product?.id,
            workspaceId: project.workspaceId,
            projectId: project.id
          });

          return [
            {
              href: targets.oisProduct,
              label: `Open OIS product ${installation.productName ?? installation.productCode}`,
              detail: installation.productCode,
              external: true
            },
            {
              href: targets.oisWorkspace,
              label: `Open OIS workspace ${project.workspace?.name ?? project.workspaceId}`,
              detail: "Cross-product staging link",
              external: true
            }
          ];
        })}
      />

      <section className="project-grid" aria-label="Project modules">
        {modules.length > 0 ? (
          modules.map((module) => (
            <article className="project-card" key={module.id}>
              <span className="eyebrow">{module.productCode}</span>
              <h3>{module.code}</h3>
              <p className="muted">
                {module.moduleType}; scope {module.scope}; realm {module.realmCode}.
              </p>
              <strong>{module.lifecycle}</strong>
            </article>
          ))
        ) : (
          <article className="project-card owner-empty-state" data-owner-empty-state="Owner-safe empty state">
            <span className="eyebrow">Missing link</span>
            <h3>No modules returned</h3>
            <p className="muted">This project has no module relationship in the current registry payload.</p>
            <p className="muted owner-safe-note">Safe empty state: only registry-safe summary copy is shown.</p>
          </article>
        )}
      </section>

      <section className="dashboard-grid">
        <DetailStatusPanel detail={detail} label="Project Detail" />
        <RuntimeStatusCard snapshot={snapshot} />
        <DataBoundaryPanel />
      </section>
    </PitsShell>
  );
}
