"use client";

import { useState } from "react";

const PATHS_CODE = `let x = input()
if x > 0 then
  if x > 10 then
    y = "big"
  else
    y = "small"
else
  y = "negative"
print(y)`;

export default function WhyCFGSection() {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <section id="why-cfg" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">Why Control Flow Graphs?</h2>
      <p className="mb-4 text-slate-600">
        An AST tells you <em>what</em> the code says. But to analyze <em>how</em> the code runs — which
        statements execute, in what order, along which paths — you need a <strong>control flow graph</strong> (CFG).
      </p>

      <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-sm font-medium text-navy">The Path Counting Problem</span>
        </div>
        <div className="p-6">
          <p className="mb-4 text-sm text-slate-600">
            How many distinct execution paths exist through this code?
          </p>

          <div className="mb-4 rounded-lg bg-slate-900 p-4 font-mono text-sm text-slate-300">
            <pre>{PATHS_CODE}</pre>
          </div>

          <div className="mb-4 flex items-center gap-2">
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                showAnswer
                  ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {showAnswer ? "Hide answer" : "Reveal answer"}
            </button>
          </div>

          {showAnswer && (
            <div className="space-y-4">
              <div className="rounded-lg bg-slate-900 p-4 font-mono text-sm text-slate-300">
                <pre className="text-center">{`    ENTRY
      |
     [B1: x = input()]
      |
     [B2: if x > 0]
    /          \\
  true        false
  /              \\
[B3: if x>10]   [B5: y="negative"]
 /       \\            |
true    false          |
/         \\            |
[B4a]   [B4b]         |
y="big"  y="small"    |
 \\       /            |
  \\     /             |
   [B6: print(y)] ←───┘

 Paths: 3 (big, small, negative)`}</pre>
              </div>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <p className="text-xs font-medium text-emerald-800">Key Insight</p>
                <p className="mt-1 text-xs text-emerald-700">
                  The CFG makes every execution path explicit. Each path from ENTRY to EXIT is a possible
                  runtime execution. With <em>n</em> nested if-else blocks, you can have up to 2<sup>n</sup> paths —
                  the CFG structure shows exactly which branches connect where.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-2">
            <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-navy">Explicit Flow</h3>
          <p className="mt-1 text-xs text-slate-600">
            CFGs make every possible execution path visible — branches, loops, and fallthrough are all edges.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-2">
            <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-navy">Foundation for Dataflow</h3>
          <p className="mt-1 text-xs text-slate-600">
            Reaching definitions, live variables, and all dataflow analyses operate on CFGs — they propagate facts along edges.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-2">
            <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-navy">Bug Detection</h3>
          <p className="mt-1 text-xs text-slate-600">
            Unreachable code, uninitialized variables, and dead stores all become visible through CFG-based analysis.
          </p>
        </div>
      </div>
    </section>
  );
}
