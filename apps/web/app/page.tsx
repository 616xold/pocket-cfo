import Link from "next/link";
import { getControlPlaneHealth } from "../lib/api";

export default async function HomePage() {
  const health = await getControlPlaneHealth();

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Pocket CTO</p>
        <h1>Engineering mission control, built for the phone.</h1>
        <p className="lede">
          The goal is not another chat bot. The goal is a system that compiles
          operator intent into typed missions, executes inside isolated
          workspaces, and returns evidence you can approve from mobile.
        </p>
        <div className="actions">
          <Link href="/missions/demo-mission" className="button primary">
            Open mission detail shell
          </Link>
        </div>
      </section>

      <section className="grid two-up">
        <article className="card">
          <h2>Current starting point</h2>
          <ul>
            <li>M0 mission spine</li>
            <li>GitHub-first architecture</li>
            <li>Codex App Server runtime contract</li>
            <li>Proof bundle as the trust layer</li>
          </ul>
        </article>

        <article className="card status-card">
          <h2>Control-plane health</h2>
          {health.ok ? (
            <dl className="status-list">
              <div>
                <dt>Status</dt>
                <dd>reachable</dd>
              </div>
              <div>
                <dt>Service</dt>
                <dd>{health.service}</dd>
              </div>
              <div>
                <dt>Observed</dt>
                <dd>{health.now}</dd>
              </div>
            </dl>
          ) : (
            <p className="muted">
              The control plane is not reachable yet. Start it with <code>pnpm
              dev</code> after bootstrapping dependencies.
            </p>
          )}
        </article>
      </section>

      <section className="card">
        <h2>V1 boundaries</h2>
        <p className="muted">
          Single operator. Single trust boundary. No deploy automation. No
          automatic merges. PWA first. OpenClaw and multi-channel surfaces come
          later.
        </p>
      </section>
    </main>
  );
}
