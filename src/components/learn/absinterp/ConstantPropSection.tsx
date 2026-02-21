"use client";

import { useState } from "react";

interface EnvSnapshot {
  statement: string;
  env: Record<string, string>;
  note: string;
}

const STEPS: EnvSnapshot[] = [
  {
    statement: "x = 5",
    env: { x: "Const(5)" },
    note: "Literal 5 maps to Const(5).",
  },
  {
    statement: "y = x + 1",
    env: { x: "Const(5)", y: "Const(6)" },
    note: "Const(5) + Const(1) = Const(6). Constant folding at analysis time!",
  },
  {
    statement: "z = x + y",
    env: { x: "Const(5)", y: "Const(6)", z: "Const(11)" },
    note: "Const(5) + Const(6) = Const(11). All values fully tracked.",
  },
];

const MERGE_STEPS: EnvSnapshot[] = [
  {
    statement: "// then branch: a = 3",
    env: { a: "Const(3)" },
    note: "Then branch assigns a = 3.",
  },
  {
    statement: "// else branch: a = 5",
    env: { a: "Const(5)" },
    note: "Else branch assigns a = 5.",
  },
  {
    statement: "// merge point: join",
    env: { a: "Top" },
    note: "join(Const(3), Const(5)) = Top. Different constants → give up!",
  },
];

export default function ConstantPropSection() {
  const [step, setStep] = useState(0);
  const [showMerge, setShowMerge] = useState(false);
  const current = STEPS[step];

  return (
    <section id="constant-prop" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">Constant Propagation</h2>
      <p className="mb-4 text-slate-600">
        A flat lattice where each concrete constant gets its own element:{" "}
        <strong>Bot &lt; Const(n) &lt; Top</strong> for every integer n. Perfect when variables hold known
        constants — but <em>any</em> merge of different constants collapses to Top.
      </p>

      {/* Interactive stepper */}
      <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-sm font-medium text-navy">Step Through: Constant Evaluation</span>
        </div>
        <div className="p-6">
          <div className="mb-4 rounded-lg bg-slate-900 p-4 font-mono text-sm text-slate-300">
            <pre>{`x = 5
y = x + 1
z = x + y`}</pre>
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
            <span className="text-xs font-mono text-navy">
              Step {step + 1} / {STEPS.length}
            </span>
            <button
              onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}
              disabled={step >= STEPS.length - 1}
              className="rounded px-3 py-1 text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40"
            >
              Next &rarr;
            </button>
          </div>

          {/* Current statement */}
          <div className="mb-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
            <div className="font-mono text-sm font-medium text-navy">{current.statement}</div>
            <p className="mt-1 text-xs text-blue-700">{current.note}</p>
          </div>

          {/* Environment */}
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="mb-2 text-[10px] font-medium text-slate-400">Abstract Environment</p>
            <div className="flex flex-wrap gap-3">
              {Object.entries(current.env).map(([v, val]) => (
                <div key={v} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5">
                  <span className="font-mono text-xs font-medium text-navy">{v}</span>
                  <span className="text-xs text-slate-400"> &rarr; </span>
                  <span className="font-mono text-xs font-semibold text-blue-700">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Merge point example */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-medium text-navy">What Happens at Merge Points?</span>
          <button
            onClick={() => setShowMerge(!showMerge)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              showMerge ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {showMerge ? "Hide" : "Show example"}
          </button>
        </div>
        {showMerge && (
          <div className="p-6">
            <div className="mb-4 rounded-lg bg-slate-900 p-4 font-mono text-sm text-slate-300">
              <pre>{`if cond then
  a = 3
else
  a = 5
// merge: what is a?`}</pre>
            </div>
            <div className="space-y-2">
              {MERGE_STEPS.map((ms, i) => (
                <div
                  key={i}
                  className={`rounded-lg border p-3 ${
                    i === 2 ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div className="font-mono text-xs font-medium text-navy">{ms.statement}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-500">a =</span>
                    <span className={`font-mono text-xs font-bold ${i === 2 ? "text-amber-700" : "text-blue-700"}`}>
                      {ms.env.a}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">{ms.note}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs text-amber-700">
                This is the main weakness of constant propagation: <strong>any merge of different constants
                loses all information</strong>. The interval domain handles this much better by keeping the range [3, 5].
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
