import { getPlatformRegistrySnapshot } from "@ois/shared-ui";
import { OisConsoleShell, PageHeading } from "../../../shell";
import { OimaConsoleLauncher } from "../../launcher";

export const dynamic = "force-dynamic";

type OimaMeetingDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OimaMeetingDetailPage({ params }: OimaMeetingDetailPageProps) {
  const [{ id }, snapshot] = await Promise.all([params, getPlatformRegistrySnapshot()]);

  return (
    <OisConsoleShell active="oima" snapshot={snapshot}>
      <PageHeading eyebrow="OIMA compatibility route" title="Meeting Detail moved to OIMA app">
        Meeting detail and transcript processing now run in the standalone OIMA app. This route links to the same meeting id in OIMA.
      </PageHeading>
      <OimaConsoleLauncher targetPath={`/meetings/${encodeURIComponent(id)}`} title="Open OIMA Meeting Detail" />
    </OisConsoleShell>
  );
}
