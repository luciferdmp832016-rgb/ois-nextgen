import { getPlatformRegistrySnapshot } from "@ois/shared-ui";
import { PlannedSurfacePage } from "../shell";

export const dynamic = "force-dynamic";

export default async function OimaAnalysisPage() {
  const snapshot = await getPlatformRegistrySnapshot();

  return (
    <PlannedSurfacePage
      active="analysis"
      capability="OFFLINE_AGENT_ANALYSIS"
      snapshot={snapshot}
      stage="OIMA-3"
      title="Agent Analysis"
    />
  );
}
