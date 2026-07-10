import { getPlatformRegistrySnapshot } from "@ois/shared-ui";
import { OisConsoleShell, PageHeading } from "../../shell";
import { OimaConsoleLauncher } from "../launcher";

export const dynamic = "force-dynamic";

export default async function OimaMeetingLibraryPage() {
  const snapshot = await getPlatformRegistrySnapshot();

  return (
    <OisConsoleShell active="oima" snapshot={snapshot}>
      <PageHeading eyebrow="OIMA compatibility route" title="Meeting Library moved to OIMA app">
        Use the standalone OIMA app for meeting runtime workflows. This Console route remains as a safe launcher.
      </PageHeading>
      <OimaConsoleLauncher targetPath="/meetings" title="Open OIMA Meeting Library" />
    </OisConsoleShell>
  );
}
