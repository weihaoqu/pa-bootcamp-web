"use client";

import { useState } from "react";
import WatchOutCallout from "../WatchOutCallout";

interface PropStep {
  statement: string;
  env: { var: string; taint: "Tainted" | "Untainted"; reason: string }[];
  highlight: string;
}

const STEPS: PropStep[] = [
  {
    statement: 'name = req.query.name',
    env: [{ var: "name", taint: "Tainted", reason: "Source: user input" }],
    highlight: "name is Tainted — it comes from the URL query string.",
  },
  {
    statement: 'safe_name = escape_html(name)',
    env: [
      { var: "name", taint: "Tainted", reason: "Source: user input" },
      { var: "safe_name", taint: "Untainted", reason: "Sanitized by escape_html()" },
    ],
    highlight: "escape_html() is a sanitizer — it converts Tainted → Untainted.",
  },
  {
    statement: 'greeting = "Hello, " + safe_name',
    env: [
      { var: "name", taint: "Tainted", reason: "Source: user input" },
      { var: "safe_name", taint: "Untainted", reason: "Sanitized" },
      { var: "greeting", taint: "Untainted", reason: "Untainted + Untainted = Untainted" },
    ],
    highlight: "safe_name is Untainted, so the concatenation stays Untainted. Safe!",
  },
  {
    statement: 'res.send(greeting)',
    env: [
      { var: "name", taint: "Tainted", reason: "Source: user input" },
      { var: "safe_name", taint: "Untainted", reason: "Sanitized" },
      { var: "greeting", taint: "Untainted", reason: "All safe" },
    ],
    highlight: "greeting is Untainted at the HTML output sink — no vulnerability!",
  },
];

export default function TaintPropagationSection() {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  return (
    <section id="taint-propagation" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">Taint Propagation</h2>
      <p className="mb-4 text-slate-600">
        Taint flows through the program following <strong>data dependencies</strong>. When a tainted value
        is used in an expression, the result is tainted too. Sanitizers are the only way to break the chain.
      </p>

      <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-sm font-medium text-navy">Step Through: Safe Taint Flow</span>
        </div>
        <div className="p-6">
          <div className="mb-4 rounded-lg bg-slate-900 p-4 font-mono text-sm text-slate-300">
            <pre>{`name = req.query.name
safe_name = escape_html(name)
greeting = "Hello, " + safe_name
res.send(greeting)`}</pre>
          </div>

          {/* Stepper */}
          <div className="mb-4 flex items-center gap-3">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="rounded px-3 py-1 text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40"
            >
              &larr; Prev
            </button>
            <span className="text-xs font-mono text-navy">Step {step + 1} / {STEPS.length}</span>
            <button
              onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}
              disabled={step >= STEPS.length - 1}
              className="rounded px-3 py-1 text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40"
            >
              Next &rarr;
            </button>
          </div>

          {/* Current */}
          <div className="mb-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
            <div className="font-mono text-sm font-medium text-navy">{current.statement}</div>
            <p className="mt-1 text-xs text-blue-700">{current.highlight}</p>
          </div>

          {/* Environment */}
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="mb-2 text-[10px] font-medium text-slate-400">Taint Environment</p>
            <div className="flex flex-wrap gap-2">
              {current.env.map((v) => (
                <div key={v.var} className={`rounded-lg border px-3 py-1.5 ${
                  v.taint === "Tainted" ? "border-red-200 bg-red-50" : "border-emerald-200 bg-emerald-50"
                }`}>
                  <span className="font-mono text-xs font-medium text-navy">{v.var}</span>
                  <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                    v.taint === "Tainted" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {v.taint}
                  </span>
                  <div className="mt-0.5 text-[9px] text-slate-500">{v.reason}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h3 className="text-sm font-semibold text-blue-800">Propagation Rules Summary</h3>
        <div className="mt-2 space-y-1 text-xs text-blue-700">
          <div><strong>Assignment:</strong> <code className="bg-blue-100 px-1 rounded">x = tainted_value</code> &rarr; x becomes Tainted</div>
          <div><strong>Operations:</strong> <code className="bg-blue-100 px-1 rounded">tainted + anything</code> &rarr; result is Tainted</div>
          <div><strong>Sanitizer:</strong> <code className="bg-blue-100 px-1 rounded">sanitize(tainted)</code> &rarr; result is Untainted</div>
          <div><strong>Literals:</strong> <code className="bg-blue-100 px-1 rounded">&quot;hello&quot;</code>, <code className="bg-blue-100 px-1 rounded">42</code> &rarr; Untainted</div>
        </div>
      </div>

      <WatchOutCallout items={[
        "Forgetting to taint the LHS when the RHS is tainted in an assignment is the #1 implementation bug — the whole point of propagation is that taint flows through assignments.",
        "Sanitizers are context-specific: html_encode() fixes XSS but NOT SQL injection. Using the wrong sanitizer gives a false sense of security.",
        "String concatenation propagates taint: \"safe\" + tainted = tainted. Students often forget this and only check direct assignments.",
        "Don't confuse Untainted (known safe) with Bot (unreachable / no info). Bot means the variable hasn't been encountered yet; Untainted means it was explicitly set to a safe value.",
      ]} />
    </section>
  );
}
