import { getPlatformRegistrySnapshot } from "@ois/shared-ui";
import { PlannedSurfacePage } from "../shell";

export const dynamic = "force-dynamic";

export default async function OimaClarificationPage() {
  const snapshot = await getPlatformRegistrySnapshot();

  return (
    <PlannedSurfacePage
      active="clarification"
      capability="SUBJECT_CLARIFICATION"
      snapshot={snapshot}
      stage="OIMA-4"
      title="Clarification Review"
    />
  );
}
