import Link from "next/link";

export default function Page() {
  return (
    <main className="login">
      <form>
        <div className="demo">DEMO DATA - NOT PRODUCTION</div>
        <h1>PITS Shell</h1>
        <p className="muted">Project runtime shell for Stage A.</p>
        <Link className="button" href="/login">
          Open Login
        </Link>
      </form>
    </main>
  );
}
