import { buildOimaAppUrl } from "@ois/shared-ui";
import { StatusBadge } from "../shell";

const launcherLinks = [
  { label: "OIMA Overview", path: "/", availability: "Available now" },
  { label: "Meeting Library", path: "/meetings", availability: "Available now" },
  { label: "Upload Meeting", path: "/meetings/new", availability: "Available now" },
  { label: "Agent Analysis", path: "/analysis", availability: "Planned / not runtime" },
  { label: "Clarification Review", path: "/clarification", availability: "Planned / not runtime" },
  { label: "Dashboard", path: "/dashboard", availability: "Planned / not runtime" },
  { label: "Self-Improvement Center", path: "/self-improvement", availability: "Planned / not runtime" },
  { label: "Listener Mode", path: "/listener", availability: "Planned / not runtime" }
];

export function OimaConsoleLauncher({ targetPath, title }: { targetPath: string; title: string }) {
  const targetUrl = buildOimaAppUrl(targetPath);

  return (
    <section className="panel" data-oima="OIMA Console Launcher">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Product Runtime Link</span>
          <h3>{title}</h3>
          <p className="muted">Open the standalone OIMA app for meeting intake and transcript processing. Console keeps this route for compatibility.</p>
        </div>
        <StatusBadge ok label="Launcher / compatibility route" />
      </div>
      <div className="owner-review-marker-row" aria-label="OIMA compatibility markers">
        <span>OIMA_APP_SHELL</span>
        <span>OIMA_STANDALONE_APP_SHELL</span>
        <span>STAGE_2L_STANDALONE_OIMA_APP_SHELL</span>
        <span>Powered by OIS Product</span>
        <span>Product Runtime separate from Product Administration</span>
        <span>No fake meeting data</span>
        <span>No LLM/OpenRouter calls</span>
      </div>
      <div className="owner-link-list">
        <a href={targetUrl}>
          Open standalone OIMA app
          <span>{targetUrl}</span>
        </a>
      </div>
      <div className="owner-review-grid">
        {launcherLinks.map((link) => (
          <article className="owner-review-card" key={link.path}>
            <div className="panel-heading">
              <div>
                <span className="eyebrow">{link.availability}</span>
                <h4>{link.label}</h4>
              </div>
              <StatusBadge ok={link.availability === "Available now"} label={link.availability} />
            </div>
            <a href={buildOimaAppUrl(link.path)}>Open in OIMA app</a>
          </article>
        ))}
      </div>
    </section>
  );
}
