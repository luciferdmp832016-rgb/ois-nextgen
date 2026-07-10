import { getPlatformRegistrySnapshot } from "@ois/shared-ui";
import { PlannedSurfacePage } from "../shell";

export const dynamic = "force-dynamic";

export default async function OimaSelfImprovementPage() {
  const snapshot = await getPlatformRegistrySnapshot();

  return (
    <PlannedSurfacePage
      active="self-improvement"
      capability="SELF_IMPROVEMENT"
      snapshot={snapshot}
      stage="OIMA-6"
      title="Self-Improvement Center"
    />
  );
}
