import { getPlatformRegistrySnapshot, getPitsWorkItemActionPreview, getPitsWorkItemActionRequests, getPitsWorkItemDetail } from "@ois/shared-ui";
import {
  DataBoundaryPanel,
  DetailFallbackPanel,
  DetailStatusPanel,
  DryRunActionPreviewPanel,
  PageHeading,
  PitsActionRequestPanel,
  PitsShell,
  RuntimeStatusCard,
  WorkItemDetailPanel
} from "../../../../shell";

export const dynamic = "force-dynamic";

type WorkItemDetailPageProps = {
  params: Promise<{ id: string; itemId: string }>;
};

export default async function WorkItemDetailPage({ params }: WorkItemDetailPageProps) {
  const { id, itemId } = await params;
  const snapshot = await getPlatformRegistrySnapshot();
  const [detail, actionPreview, actionRequests] = await Promise.all([
    getPitsWorkItemDetail(id, itemId, snapshot.coreApiUrl),
    getPitsWorkItemActionPreview(id, itemId, snapshot.coreApiUrl),
    getPitsWorkItemActionRequests(id, itemId, snapshot.coreApiUrl)
  ]);
  const payload = detail.payload;

  if (!payload) {
    return (
      <PitsShell active="projects" snapshot={snapshot}>
        <PageHeading title="Work Item Detail Unavailable" eyebrow="Work Item Detail">
          The requested read-only PITS work item detail was not returned by Core API.
        </PageHeading>
        <section className="dashboard-grid">
          <DetailStatusPanel detail={{ coreApiUrl: detail.coreApiUrl, detail: detail.detail, metadata: null, item: null, notFound: detail.notFound, errorMessage: detail.errorMessage }} label="Work Item Detail" />
          <DetailFallbackPanel title="Work item not linked yet" message={detail.errorMessage ?? "No work item detail is available in the current runtime view."} />
          <DataBoundaryPanel />
        </section>
      </PitsShell>
    );
  }

  return (
    <PitsShell active="projects" snapshot={snapshot}>
      <PageHeading title={payload.item.title} eyebrow="Work Item Detail">
        Read-only PITS work item detail with dry-run action preview. Preview only; no data will be changed.
      </PageHeading>
      <WorkItemDetailPanel payload={payload} />
      <DryRunActionPreviewPanel detailPayload={payload} payload={actionPreview.payload} />
      <PitsActionRequestPanel detailPayload={payload} payload={actionRequests.payload} />
      <section className="dashboard-grid">
        <RuntimeStatusCard snapshot={snapshot} />
        <DataBoundaryPanel />
      </section>
    </PitsShell>
  );
}
