import Link from "next/link";

export default function NotFound() {
  return (
    <main className="shell">
      <section className="card">
        <p className="eyebrow">Pocket CTO</p>
        <h1>Mission not found</h1>
        <p className="muted">
          The mission has not been created yet or the id is incorrect.
        </p>
        <div className="actions">
          <Link href="/" className="button primary">
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}
