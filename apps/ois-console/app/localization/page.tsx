import { getPlatformRegistrySnapshot, LocalizationCatalogPanel } from "@ois/shared-ui";
import { OisConsoleShell, PageHeading } from "../shell";

export const dynamic = "force-dynamic";

export default async function LocalizationPage() {
  const snapshot = await getPlatformRegistrySnapshot();

  return (
    <OisConsoleShell active="localization" snapshot={snapshot}>
      <PageHeading eyebrow="Localization" title="Localization Catalog">
        Read-only catalog for reviewing language packs, namespace coverage and fallback counts before owner UAT.
      </PageHeading>
      <LocalizationCatalogPanel productName="OIS Console" />
    </OisConsoleShell>
  );
}
