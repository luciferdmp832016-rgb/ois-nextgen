import { getPlatformRegistrySnapshot } from "@ois/shared-ui";
import { OisConsoleShell, PageHeading } from "../../../shell";
import { OimaConsoleLauncher } from "../../launcher";

export const dynamic = "force-dynamic";

export default async function NewOimaMeetingPage() {
  const snapshot = await getPlatformRegistrySnapshot();

  return (
    <OisConsoleShell active="oima" snapshot={snapshot}>
      <PageHeading eyebrow="OIMA compatibility route" title="Upload Meeting moved to OIMA app">
        Transcript-first meeting registration now runs in the standalone OIMA app. No meeting data is created from OIS Console.
      </PageHeading>
      <OimaConsoleLauncher targetPath="/meetings/new" title="Open OIMA Upload / Register Meeting" />
    </OisConsoleShell>
  );
}
