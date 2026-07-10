import { buildOimaAppUrl, getPlatformRegistrySnapshot } from "@ois/shared-ui";
import { OisConsoleShell, PageHeading, StatusBadge } from "../shell";
import { OimaConsoleLauncher } from "./launcher";

export const dynamic = "force-dynamic";

export default async function OimaPage() {
  const snapshot = await getPlatformRegistrySnapshot();

  return (
    <OisConsoleShell active="oima" snapshot={snapshot}>
      <PageHeading eyebrow="OIMA product launcher" title="Open OIMA standalone app">
        OIS Console remains Product Administration. OIMA is now a standalone Product Runtime app powered by OIS.
      </PageHeading>

      <section className="panel" data-oima="OIMA Console Launcher">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Stage 2L / OIMA-A0</span>
            <h3>OIMA - Organizational Intelligence Meeting Agent</h3>
            <p className="muted">OIS is the organizational intelligence backbone. OIMA is the meeting intelligence product powered by OIS.</p>
          </div>
          <StatusBadge ok label="Standalone app ready" />
        </div>
        <dl className="owner-fact-grid">
          <div>
            <dt>Standalone app</dt>
            <dd>{buildOimaAppUrl("/")}</dd>
          </div>
          <div>
            <dt>Service</dt>
            <dd>ois-nextgen-oima-staging</dd>
          </div>
          <div>
            <dt>Port</dt>
            <dd>3002</dd>
          </div>
          <div>
            <dt>Console role</dt>
            <dd>Launcher / compatibility route</dd>
          </div>
        </dl>
        <div className="owner-review-marker-row" aria-label="OIMA launcher markers">
          <span>OIMA Console Launcher</span>
          <span>OIMA_STANDALONE_APP_SHELL</span>
          <span>STAGE_2L_STANDALONE_OIMA_APP_SHELL</span>
          <span>Powered by OIS Product</span>
          <span>OIMA-0</span>
          <span>OIMA-1</span>
          <span>OIMA-2</span>
          <span>OIMA-9</span>
        </div>
      </section>

      <OimaConsoleLauncher targetPath="/" title="Open OIMA app" />
    </OisConsoleShell>
  );
}
