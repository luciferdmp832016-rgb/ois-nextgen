import { getPlatformRegistrySnapshot } from "@ois/shared-ui";
import { PlannedSurfacePage } from "../shell";

export const dynamic = "force-dynamic";

export default async function OimaListenerPage() {
  const snapshot = await getPlatformRegistrySnapshot();

  return (
    <PlannedSurfacePage
      active="listener"
      capability="LISTENER_MODE"
      snapshot={snapshot}
      stage="OIMA-9"
      title="Listener Mode"
    />
  );
}
