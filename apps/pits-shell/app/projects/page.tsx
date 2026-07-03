import Link from "next/link";
import { demoBannerText } from "@ois/shared-ui";

export default function ProjectsPage() {
  return (
    <main className="runtime">
      <header className="top">
        <div>
          <div className="brand">PITS</div>
          <div className="demo">{demoBannerText}</div>
        </div>
        <span className="chip">PMC Org Demo</span>
      </header>
      <section className="content">
        <h1>Project Selector</h1>
        <div className="grid">
          <Link className="tile" href="/home">
            <h2>Emerald Precinct Demo</h2>
            <p className="muted">PITS installation active</p>
          </Link>
          <Link className="tile" href="/home">
            <h2>Second Project Demo</h2>
            <p className="muted">PITS installation active</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
