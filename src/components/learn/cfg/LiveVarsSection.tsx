"use client";

import { useState } from "react";

// Same program as reaching defs for side-by-side comparison
const CODE = `[B1] x = 5
[B1] y = 1
[B2] if x > 3
[B3]   y = x + 1   (then)
[B4]   y = x - 1   (else)
[B5] z = y          (join)`;

interface IterRow {
  block: string;
  use: string;
  def: string;
  inSet: string;
  outSet: string;
}

const ITERATIONS: { label: string; rows: IterRow[]; note: string }[] = [
  {
    label: "Init (all ∅)",
    rows: [
      { block: "B5", use: "{y}", def: "{z}", inSet: "∅", outSet: "∅" },
      { block: "B4", use: "{x}", def: "{y}", inSet: "∅", outSet: "∅" },
      { block: "B3", use: "{x}", def: "{y}", inSet: "∅", outSet: "∅" },
      { block: "B2", use: "{x}", def: "{}", inSet: "∅", outSet: "∅" },
      { block: "B1", use: "{}", def: "{x,y}", inSet: "∅", outSet: "∅" },
    ],
    note: "All IN/OUT start empty. Note: we process backward (B5 first, B1 last). use = vars read before redefined. def = vars assigned.",
  },
  {
    label: "Iteration 1 (backward)",
    rows: [
      { block: "B5", use: "{y}", def: "{z}", inSet: "{y}", outSet: "∅" },
      { block: "B4", use: "{x}", def: "{y}", inSet: "{x}", outSet: "{y}" },
      { block: "B3", use: "{x}", def: "{y}", inSet: "{x}", outSet: "{y}" },
      { block: "B2", use: "{x}", def: "{}", inSet: "{x}", outSet: "{x}" },
      { block: "B1", use: "{}", def: "{x,y}", inSet: "∅", outSet: "{x}" },
    ],
    note: "Apply IN = use ∪ (OUT − def). At B2: OUT = IN[B3] ∪ IN[B4] = {x} ∪ {x} = {x}. Only x is live at B2 — y is about to be overwritten in both branches!",
  },
  {
    label: "Iteration 2 — Fixpoint!",
    rows: [
      { block: "B5", use: "{y}", def: "{z}", inSet: "{y}", outSet: "∅" },
      { block: "B4", use: "{x}", def: "{y}", inSet: "{x}", outSet: "{y}" },
      { block: "B3", use: "{x}", def: "{y}", inSet: "{x}", outSet: "{y}" },
      { block: "B2", use: "{x}", def: "{}", inSet: "{x}", outSet: "{x}" },
      { block: "B1", use: "{}", def: "{x,y}", inSet: "∅", outSet: "{x}" },
    ],
    note: "No changes → fixpoint! Key insight: y is NOT live at B1's exit because both branches redefine y before using it.",
  },
];

export default function LiveVarsSection() {
  const [step, setStep] = useState(0);
  const iter = ITERATIONS[step];

  return (
    <section id="live-vars" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">Live Variables</h2>
      <p className="mb-4 text-slate-600">
        A variable is <strong>live</strong> at a point if its current value <em>may</em> be read before
        being overwritten. This is a <strong>backward may-analysis</strong> — information flows from uses back
        to definitions.
      </p>

      <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-sm font-medium text-navy">Step-Through: Same Diamond, Backward</span>
        </div>
        <div className="p-4">
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
            <span className="min-w-[180px] text-center text-sm font-medium text-navy">
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

          {/* Backward iteration table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-2 py-1.5 text-left font-medium text-slate-600">Block</th>
                  <th className="px-2 py-1.5 text-left font-medium text-emerald-700">use</th>
                  <th className="px-2 py-1.5 text-left font-medium text-red-700">def</th>
                  <th className="px-2 py-1.5 text-left font-medium text-blue-700">IN</th>
                  <th className="px-2 py-1.5 text-left font-medium text-purple-700">OUT</th>
                </tr>
              </thead>
              <tbody>
                {iter.rows.map((r) => (
                  <tr key={r.block} className="border-b border-slate-100">
                    <td className="px-2 py-1.5 font-medium text-navy">{r.block}</td>
                    <td className="px-2 py-1.5 text-emerald-700">{r.use}</td>
                    <td className="px-2 py-1.5 text-red-700">{r.def}</td>
                    <td className="px-2 py-1.5 text-blue-700">{r.inSet}</td>
                    <td className="px-2 py-1.5 text-purple-700">{r.outSet}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 rounded-lg border border-amber-100 bg-amber-50 p-2">
            <p className="text-xs text-amber-800">{iter.note}</p>
          </div>
        </div>
      </div>

      {/* Side-by-side duality comparison */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-sm font-medium text-navy">The Duality</span>
        </div>
        <div className="p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <h4 className="mb-2 text-xs font-semibold text-blue-800">Reaching Definitions</h4>
              <ul className="space-y-1 text-[11px] text-blue-700">
                <li><strong>Direction:</strong> Forward (ENTRY → EXIT)</li>
                <li><strong>Domain:</strong> Sets of definitions</li>
                <li><strong>gen/kill:</strong> Definitions created / overwritten</li>
                <li><strong>Transfer:</strong> OUT = gen ∪ (IN − kill)</li>
                <li><strong>Meet:</strong> ∪ (may analysis)</li>
                <li><strong>Answers:</strong> &quot;Where did this value come from?&quot;</li>
              </ul>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <h4 className="mb-2 text-xs font-semibold text-amber-800">Live Variables</h4>
              <ul className="space-y-1 text-[11px] text-amber-700">
                <li><strong>Direction:</strong> Backward (EXIT → ENTRY)</li>
                <li><strong>Domain:</strong> Sets of variables</li>
                <li><strong>use/def:</strong> Vars read / overwritten</li>
                <li><strong>Transfer:</strong> IN = use ∪ (OUT − def)</li>
                <li><strong>Meet:</strong> ∪ (may analysis)</li>
                <li><strong>Answers:</strong> &quot;Will this value be used later?&quot;</li>
              </ul>
            </div>
          </div>
          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-600">
              <strong>Same framework, different direction.</strong> Both analyses use the powerset lattice with union
              as join. The transfer functions are structurally identical — just with &quot;gen&quot; renamed to &quot;use&quot;
              and &quot;kill&quot; renamed to &quot;def&quot;, flowing in the opposite direction.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
