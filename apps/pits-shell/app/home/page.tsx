import { demoBannerText } from "@ois/shared-ui";

const runtimeAreas: Array<[string, string]> = [
  ["My Work", "Placeholder"],
  ["Report Issue", "Placeholder"],
  ["Dashboard", "Placeholder"],
  ["Notifications", "Placeholder"],
  ["Profile", "Placeholder"]
];

export default function HomePage() {
  return (
    <main className="runtime">
      <header className="top">
        <div>
          <div className="brand">PITS</div>
          <div className="demo">{demoBannerText}</div>
        </div>
        <span className="chip">Emerald Precinct Demo</span>
      </header>
      <section className="content">
        <h1>Home</h1>
        <div className="project-switcher">
          <span className="chip">Emerald Precinct Demo</span>
          <span className="chip">Second Project Demo</span>
        </div>
        <div className="grid">
          {runtimeAreas.map(([title, state]) => (
            <section className="tile" key={title}>
              <h2>{title}</h2>
              <p className="muted">{state}</p>
            </section>
          ))}
        </div>
      </section>
      <nav className="bottom" aria-label="PITS runtime">
        {runtimeAreas.map(([title]) => (
          <a href={`#${title.toLowerCase().replaceAll(" ", "-")}`} key={title}>
            {title}
          </a>
        ))}
      </nav>
    </main>
  );
}
