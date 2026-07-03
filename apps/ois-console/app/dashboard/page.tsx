import { demoBannerText } from "@ois/shared-ui";

const sections = [
  "Platform Overview",
  "Organizations",
  "Workspaces",
  "Projects",
  "Product Catalog",
  "Product Installations",
  "Users & Identity",
  "Access Control",
  "Module Catalog",
  "Architecture Status"
];

const metrics = [
  ["Industries", "1"],
  ["Organizations", "1"],
  ["Workspaces", "1"],
  ["Projects", "2"],
  ["Products", "5"],
  ["PITS Installations", "2"]
];

export default function DashboardPage() {
  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">OIS Console</div>
        <div className="demo">{demoBannerText}</div>
        <nav className="nav" aria-label="Control Plane">
          {sections.map((section) => (
            <a key={section} href={`#${section.toLowerCase().replaceAll(" ", "-").replaceAll("&", "and")}`}>
              {section}
            </a>
          ))}
        </nav>
      </aside>
      <section className="main">
        <div className="topbar">
          <div>
            <h1>Platform Overview</h1>
            <p className="muted">PMC Demo / PMC Org Demo</p>
          </div>
          <span className="pill">PLATFORM_KERNEL: IN_PROGRESS</span>
        </div>

        <div className="grid">
          {metrics.map(([label, value]) => (
            <section className="panel" key={label}>
              <div className="muted">{label}</div>
              <div className="metric">{value}</div>
            </section>
          ))}
        </div>

        <div className="grid" style={{ marginTop: 16 }}>
          {sections.slice(1).map((section) => (
            <section className="panel" id={section.toLowerCase().replaceAll(" ", "-").replaceAll("&", "and")} key={section}>
              <h2>{section}</h2>
              <p className="muted">Stage A shell surface. Domain behavior waits for phase gates.</p>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
