import { getPlatformRegistrySnapshot } from "@ois/shared-ui";
import { PlannedSurfacePage } from "../shell";

export const dynamic = "force-dynamic";

export default async function OimaDashboardPage() {
  const snapshot = await getPlatformRegistrySnapshot();

  return (
    <PlannedSurfacePage
      active="dashboard"
      capability="MEETING_DASHBOARD"
      snapshot={snapshot}
      stage="OIMA-5"
      title="Dashboard"
    />
  );
}
