import Link from "next/link";

export default function Page() {
  return (
    <main className="login">
      <form>
        <div className="demo">DEMO DATA - NOT PRODUCTION</div>
        <h1>OIS Console</h1>
        <p className="muted">Control Plane shell for Stage A platform administration.</p>
        <Link className="button" href="/login">
          Open Login
        </Link>
      </form>
    </main>
  );
}
