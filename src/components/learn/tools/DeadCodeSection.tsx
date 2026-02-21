"use client";

import { useState } from "react";

const DEAD_CODE_EXAMPLES = [
  {
    label: "Unused Variable",
    code: `x = 5\ny = 10    // y is assigned but never read\nresult = x + 1`,
    finding: "Variable 'y' is assigned on line 2 but never used (Low)",
    explanation: "Live variable analysis shows y is dead after assignment — no path from line 2 to any read of y.",
  },
  {
    label: "Unreachable Code",
    code: `if false then\n  x = 42    // never executes\nreturn 0`,
    finding: "Line 2 is unreachable — inside 'if false' branch (Medium)",
    explanation: "Constant propagation determines the condition is always false, so the then-branch is dead code.",
  },
  {
    label: "Dead Store",
    code: `x = compute()\nx = 10        // overwrites without reading\nuse(x)`,
    finding: "Dead store: 'x = compute()' on line 1 is overwritten on line 2 without being read (Low)",
    explanation: "Reaching definitions shows the definition on line 1 never reaches any use — it's killed by line 2.",
  },
];

export default function DeadCodeSection() {
  const [activeExample, setActiveExample] = useState(0);
  const ex = DEAD_CODE_EXAMPLES[activeExample];

  return (
    <section id="dead-code" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">Dead Code Detection</h2>
      <p className="mb-4 text-slate-600">
        Dead code detection combines multiple analyses into a single pass: <strong>live variables</strong> finds
        unused assignments, <strong>reachability</strong> finds unreachable statements, and{" "}
        <strong>reaching definitions</strong> finds dead stores. It&apos;s a perfect example of multi-analysis integration.
      </p>

      <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-sm font-medium text-navy">Dead Code Examples</span>
        </div>
        <div className="p-6">
          {/* Example picker */}
          <div className="mb-4 flex gap-2">
            {DEAD_CODE_EXAMPLES.map((e, i) => (
              <button
                key={i}
                onClick={() => setActiveExample(i)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  activeExample === i ? "bg-purple-100 text-purple-700 ring-1 ring-purple-300" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {e.label}
              </button>
            ))}
          </div>

          <div className="mb-3 rounded-lg bg-slate-900 p-4 font-mono text-sm text-slate-300">
            <pre>{ex.code}</pre>
          </div>

          <div className="mb-3 rounded-lg border border-purple-200 bg-purple-50 p-3">
            <div className="text-xs font-semibold text-purple-800">Finding</div>
            <div className="mt-1 text-xs text-purple-700">{ex.finding}</div>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
            <div className="text-xs font-semibold text-blue-800">How It&apos;s Detected</div>
            <div className="mt-1 text-xs text-blue-700">{ex.explanation}</div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <h3 className="text-sm font-semibold text-amber-800">Why Dead Code Matters</h3>
        <p className="mt-1 text-xs text-amber-700">
          Dead code isn&apos;t just messy — it can hide bugs. An unused variable might indicate a missing operation.
          Unreachable code might be a guard that was supposed to execute. Dead stores waste computation. Flagging
          these issues helps developers maintain cleaner, more correct codebases.
        </p>
      </div>
    </section>
  );
}
