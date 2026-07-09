"use client";

import { useState } from "react";

export type OisAgentWidgetShellProps = {
  coreApiUrl: string;
  productKey: string;
  organizationId: string;
  workspaceId?: string | undefined;
  currentRoute: string;
  locale?: string | undefined;
};

type WidgetTab = "ask" | "teach" | "evidence" | "status";

export function OisAgentWidgetShell({
  coreApiUrl,
  productKey,
  organizationId,
  workspaceId,
  currentRoute,
  locale = "en"
}: OisAgentWidgetShellProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<WidgetTab>("ask");
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("Ready");
  const [answer, setAnswer] = useState("Evidence-aware response placeholder");

  async function askOis() {
    if (!input.trim()) return;
    setStatus("Sending");
    const response = await fetch(`${coreApiUrl}/platform/agent/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        organizationId,
        workspaceId,
        productKey,
        currentRoute,
        screen: currentRoute,
        question: input,
        locale
      })
    });
    const body = (await response.json()) as { response?: { answer?: string } };
    setAnswer(body.response?.answer ?? "Agent response unavailable");
    setStatus(response.ok ? "Answered" : "Needs review");
  }

  async function submitTeaching() {
    if (!input.trim()) return;
    setStatus("Submitting");
    const response = await fetch(`${coreApiUrl}/platform/agent/learning-submissions`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        organizationId,
        workspaceId,
        productKey,
        sourceType: "WIDGET",
        sourceAuthority: "END_USER",
        learningScope: "ORGANIZATION",
        signalType: "USER_CORRECTION",
        rawText: input,
        contextJson: {
          route: currentRoute,
          widget: "OIS_AGENT_WIDGET"
        },
        relatedEntityRefs: [],
        submittedBy: "OIS Agent Widget"
      })
    });
    setStatus(response.ok ? "Learning Signal received" : "Submission needs review");
  }

  return (
    <aside className={`ois-agent-widget ${open ? "open" : ""}`} data-ois-agent-widget="Powered by OIS">
      <button className="ois-agent-launcher" onClick={() => setOpen((current) => !current)} type="button">
        OIS
      </button>
      {open ? (
        <section className="ois-agent-panel" aria-label="Powered by OIS">
          <header>
            <div>
              <span className="eyebrow">Powered by OIS</span>
              <h3>OIS Agent</h3>
            </div>
            <span className="status status-neutral">{productKey}</span>
          </header>
          <nav className="ois-agent-tabs" aria-label="OIS Agent tabs">
            <button className={tab === "ask" ? "active" : ""} onClick={() => setTab("ask")} type="button">
              Ask
            </button>
            <button className={tab === "teach" ? "active" : ""} onClick={() => setTab("teach")} type="button">
              Teach OIS
            </button>
            <button className={tab === "evidence" ? "active" : ""} onClick={() => setTab("evidence")} type="button">
              Evidence
            </button>
            <button className={tab === "status" ? "active" : ""} onClick={() => setTab("status")} type="button">
              Status
            </button>
          </nav>
          {tab === "ask" || tab === "teach" ? (
            <div className="ois-agent-compose">
              <textarea
                aria-label={tab === "ask" ? "Ask OIS" : "Teach OIS correction"}
                onChange={(event) => setInput(event.target.value)}
                placeholder={tab === "ask" ? "Ask about this screen" : "Submit correction or new knowledge"}
                value={input}
              />
              <button onClick={tab === "ask" ? askOis : submitTeaching} type="button">
                {tab === "ask" ? "Ask" : "Submit"}
              </button>
            </div>
          ) : null}
          {tab === "ask" ? <p className="muted">{answer}</p> : null}
          {tab === "evidence" ? <p className="muted">Evidence placeholder: governed learning candidate provenance appears here in later stages.</p> : null}
          {tab === "status" ? <p className="muted">Learning status placeholder: Signal - Candidate - Policy - Review.</p> : null}
          <footer>
            <span>{status}</span>
            <span>{currentRoute}</span>
          </footer>
        </section>
      ) : null}
    </aside>
  );
}
