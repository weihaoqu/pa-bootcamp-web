"use client";

import { useState } from "react";

// Classic diamond example for reaching definitions
const CODE = `[B1] x = 5
[B1] y = 1
[B2] if x > 3
[B3]   y = x + 1   (then)
[B4]   y = x - 1   (else)
[B5] z = y          (join)`;

interface IterRow {
  block: string;
  gen: string;
  kill: string;
  inSet: string;
  outSet: string;
}

const ITERATIONS: { label: string; rows: IterRow[]; note: string }[] = [
  {
    label: "Init (all ∅)",
    rows: [
      { block: "B1", gen: "{d1,d2}", kill: "{}", inSet: "∅", outSet: "∅" },
      { block: "B2", gen: "{}", kill: "{}", inSet: "∅", outSet: "∅" },
      { block: "B3", gen: "{d3}", kill: "{d2,d4}", inSet: "∅", outSet: "∅" },
      { block: "B4", gen: "{d4}", kill: "{d2,d3}", inSet: "∅", outSet: "∅" },
      { block: "B5", gen: "{d5}", kill: "{}", inSet: "∅", outSet: "∅" },
    ],
    note: "All IN and OUT sets start empty. Definitions: d1:x=5, d2:y=1, d3:y=x+1, d4:y=x-1, d5:z=y.",
  },
  {
    label: "Iteration 1",
    rows: [
      { block: "B1", gen: "{d1,d2}", kill: "{}", inSet: "∅", outSet: "{d1,d2}" },
      { block: "B2", gen: "{}", kill: "{}", inSet: "{d1,d2}", outSet: "{d1,d2}" },
      { block: "B3", gen: "{d3}", kill: "{d2,d4}", inSet: "{d1,d2}", outSet: "{d1,d3}" },
      { block: "B4", gen: "{d4}", kill: "{d2,d3}", inSet: "{d1,d2}", outSet: "{d1,d4}" },
      { block: "B5", gen: "{d5}", kill: "{}", inSet: "{d1,d3,d4}", outSet: "{d1,d3,d4,d5}" },
    ],
    note: "Apply OUT = gen ∪ (IN − kill) for each block. At B5, IN merges both branches: {d1,d3} ∪ {d1,d4} = {d1,d3,d4}.",
  },
  {
    label: "Iteration 2 — Fixpoint!",
    rows: [
      { block: "B1", gen: "{d1,d2}", kill: "{}", inSet: "∅", outSet: "{d1,d2}" },
      { block: "B2", gen: "{}", kill: "{}", inSet: "{d1,d2}", outSet: "{d1,d2}" },
      { block: "B3", gen: "{d3}", kill: "{d2,d4}", inSet: "{d1,d2}", outSet: "{d1,d3}" },
      { block: "B4", gen: "{d4}", kill: "{d2,d3}", inSet: "{d1,d2}", outSet: "{d1,d4}" },
      { block: "B5", gen: "{d5}", kill: "{}", inSet: "{d1,d3,d4}", outSet: "{d1,d3,d4,d5}" },
    ],
    note: "No sets changed from Iteration 1 → fixpoint reached! Both d3 (y=x+1) and d4 (y=x-1) reach B5.",
  },
];

export default function ReachingDefsSection() {
  const [step, setStep] = useState(0);
  const iter = ITERATIONS[step];

  return (
    <section id="reaching-defs" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">Reaching Definitions</h2>
      <p className="mb-4 text-slate-600">
        A definition <strong>d: x = ...</strong> <em>reaches</em> a program point if there exists a path from the
        definition to that point on which <strong>x</strong> is not redefined. This is a <strong>forward
        may-analysis</strong> — we ask &quot;can this definition <em>possibly</em> reach here?&quot;
      </p>

      <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-sm font-medium text-navy">Step-Through: Diamond CFG</span>
        </div>
        <div className="p-4">
          {/* Code */}
          <div className="mb-4 rounded-lg bg-slate-900 p-3 font-mono text-sm text-slate-300">
            <pre>{CODE}</pre>
          </div>

          {/* Stepper */}
          <div className="mb-3 flex items-center gap-3">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="rounded px-3 py-1 text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40"
            >
              ← Prev
            </button>
            <span className="min-w-[140px] text-center text-sm font-medium text-navy">
              {iter.label}
            </span>
            <button
              onClick={() => setStep(Math.min(ITERATIONS.length - 1, step + 1))}
              disabled={step >= ITERATIONS.length - 1}
              className="rounded px-3 py-1 text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40"
            >
              Next →
            </button>
            {step >= ITERATIONS.length - 1 && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                Fixpoint!
              </span>
            )}
          </div>

          {/* Iteration table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-2 py-1.5 text-left font-medium text-slate-600">Block</th>
                  <th className="px-2 py-1.5 text-left font-medium text-emerald-700">gen</th>
                  <th className="px-2 py-1.5 text-left font-medium text-red-700">kill</th>
                  <th className="px-2 py-1.5 text-left font-medium text-blue-700">IN</th>
                  <th className="px-2 py-1.5 text-left font-medium text-purple-700">OUT</th>
                </tr>
              </thead>
              <tbody>
                {iter.rows.map((r) => (
                  <tr key={r.block} className="border-b border-slate-100">
                    <td className="px-2 py-1.5 font-medium text-navy">{r.block}</td>
                    <td className="px-2 py-1.5 text-emerald-700">{r.gen}</td>
                    <td className="px-2 py-1.5 text-red-700">{r.kill}</td>
                    <td className="px-2 py-1.5 text-blue-700">{r.inSet}</td>
                    <td className="px-2 py-1.5 text-purple-700">{r.outSet}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Note */}
          <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50 p-2">
            <p className="text-xs text-blue-800">{iter.note}</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="mb-2 text-sm font-semibold text-navy">Why Does This Matter?</h3>
        <p className="text-xs text-slate-600">
          Reaching definitions answer: &quot;where could this value have come from?&quot; This enables:
        </p>
        <ul className="mt-2 space-y-1 text-xs text-slate-600">
          <li><strong>Constant propagation:</strong> If only one definition reaches a use, and it&apos;s a constant, we can substitute it.</li>
          <li><strong>Dead store detection:</strong> If a definition reaches no use, the store is dead.</li>
          <li><strong>Use-def chains:</strong> The reaching definitions at each use point form the use-def chain.</li>
        </ul>
      </div>
    </section>
  );
}
