"use client";

import { useState } from "react";

interface GaloisExample {
  label: string;
  concreteSet: string;
  alpha: string;
  explanation: string;
}

const CONCRETE_TO_ABSTRACT: GaloisExample[] = [
  { label: "{5, 10, 42}", concreteSet: "{5, 10, 42}", alpha: "Pos", explanation: "All positive integers → Pos" },
  { label: "{-3, -1}", concreteSet: "{-3, -1}", alpha: "Neg", explanation: "All negative integers → Neg" },
  { label: "{0}", concreteSet: "{0}", alpha: "Zero", explanation: "Just zero → Zero" },
  { label: "{-2, 0, 3}", concreteSet: "{-2, 0, 3}", alpha: "Top", explanation: "Mixed signs → Top (least upper bound)" },
  { label: "∅", concreteSet: "∅", alpha: "Bot", explanation: "Empty set (unreachable code) → Bot" },
];

interface GammaExample {
  abstract: string;
  gamma: string;
  explanation: string;
}

const ABSTRACT_TO_CONCRETE: GammaExample[] = [
  { abstract: "Pos", gamma: "{1, 2, 3, 4, ...}", explanation: "All positive integers" },
  { abstract: "Neg", gamma: "{..., -3, -2, -1}", explanation: "All negative integers" },
  { abstract: "Zero", gamma: "{0}", explanation: "Just zero" },
  { abstract: "Top", gamma: "{..., -1, 0, 1, ...}", explanation: "All integers (no information)" },
  { abstract: "Bot", gamma: "∅", explanation: "No integers (unreachable)" },
];

export default function GaloisSection() {
  const [selectedConcrete, setSelectedConcrete] = useState<number | null>(null);
  const [selectedAbstract, setSelectedAbstract] = useState<number | null>(null);

  return (
    <section id="galois" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">Galois Connections</h2>
      <p className="mb-4 text-slate-600">
        A Galois connection is the formal bridge between <strong>concrete</strong> (sets of actual values)
        and <strong>abstract</strong> (domain elements) worlds. Two functions — <em>alpha</em> (&alpha;)
        and <em>gamma</em> (&gamma;) — form this bridge.
      </p>

      {/* Diagram */}
      <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-sm font-medium text-navy">The Alpha-Gamma Adjunction</span>
        </div>
        <div className="p-6">
          <div className="mb-4 rounded-lg bg-slate-900 p-4 font-mono text-sm text-slate-300">
            <pre className="text-center">{`  Concrete World           Abstract World
  (sets of integers)       (domain elements)
                     α
  ┌─────────────┐  ──────→  ┌──────────────┐
  │  {5, 10}    │           │    Pos        │
  │  {-1, 0, 1} │           │    Top        │
  │  {0}        │           │    Zero       │
  └─────────────┘  ←──────  └──────────────┘
                     γ

  Key Property (adjunction):
    α(S) ⊑ a  ⟺  S ⊆ γ(a)

  "Abstracting then checking ⊑ is the same
   as checking ⊆ then concretizing"`}</pre>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Alpha direction */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-purple-800">
                &alpha; : Concrete &rarr; Abstract
              </h3>
              <p className="mb-3 text-xs text-slate-500">Click a concrete set to see its abstraction</p>
              <div className="space-y-1.5">
                {CONCRETE_TO_ABSTRACT.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedConcrete(selectedConcrete === i ? null : i)}
                    className={`w-full rounded-lg border p-2 text-left text-xs transition-all ${
                      selectedConcrete === i
                        ? "border-purple-300 bg-purple-50"
                        : "border-slate-200 bg-slate-50 hover:border-purple-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-navy">{ex.concreteSet}</span>
                      {selectedConcrete === i && (
                        <span className="flex items-center gap-1">
                          <span className="text-purple-400">&rarr; &alpha; &rarr;</span>
                          <span className="rounded bg-purple-100 px-1.5 py-0.5 font-bold text-purple-800">{ex.alpha}</span>
                        </span>
                      )}
                    </div>
                    {selectedConcrete === i && (
                      <p className="mt-1 text-[10px] text-purple-600">{ex.explanation}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Gamma direction */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-emerald-800">
                &gamma; : Abstract &rarr; Concrete
              </h3>
              <p className="mb-3 text-xs text-slate-500">Click an abstract value to see its concretization</p>
              <div className="space-y-1.5">
                {ABSTRACT_TO_CONCRETE.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedAbstract(selectedAbstract === i ? null : i)}
                    className={`w-full rounded-lg border p-2 text-left text-xs transition-all ${
                      selectedAbstract === i
                        ? "border-emerald-300 bg-emerald-50"
                        : "border-slate-200 bg-slate-50 hover:border-emerald-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-medium text-navy">{ex.abstract}</span>
                      {selectedAbstract === i && (
                        <span className="flex items-center gap-1">
                          <span className="text-emerald-400">&rarr; &gamma; &rarr;</span>
                          <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono text-emerald-800">{ex.gamma}</span>
                        </span>
                      )}
                    </div>
                    {selectedAbstract === i && (
                      <p className="mt-1 text-[10px] text-emerald-600">{ex.explanation}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h3 className="text-sm font-semibold text-blue-800">Why Does This Matter?</h3>
        <p className="mt-1 text-xs text-blue-700">
          The Galois connection guarantees <strong>soundness</strong>: if the abstract analysis says a property holds,
          it truly holds for all concrete executions. The key property is:{" "}
          <code className="rounded bg-blue-100 px-1">&alpha;(S) &sqsube; a &hArr; S &sube; &gamma;(a)</code>.
          This means abstracting and then checking the ordering is equivalent to checking set inclusion in the concrete
          world. Your abstract interpreter is sound precisely because its transfer functions respect this connection.
        </p>
      </div>
    </section>
  );
}
