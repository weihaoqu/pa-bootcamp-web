"use client";

import { useState } from "react";
import WatchOutCallout from "../WatchOutCallout";

// Powerset lattice of {d1, d2, d3}
const ELEMENTS = ["d1", "d2", "d3"];
const ALL_SUBSETS = [
  [],
  ["d1"],
  ["d2"],
  ["d3"],
  ["d1", "d2"],
  ["d1", "d3"],
  ["d2", "d3"],
  ["d1", "d2", "d3"],
];

function setStr(s: string[]): string {
  return s.length === 0 ? "∅" : `{${s.join(", ")}}`;
}

function joinSets(a: string[], b: string[]): string[] {
  const result = new Set([...a, ...b]);
  return ELEMENTS.filter((e) => result.has(e));
}

function meetSets(a: string[], b: string[]): string[] {
  const bSet = new Set(b);
  return a.filter((e) => bSet.has(e));
}

export default function DataflowFrameworkSection() {
  const [setA, setSetA] = useState<string[]>([]);
  const [setB, setSetB] = useState<string[]>([]);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  const joined = joinSets(setA, setB);
  const met = meetSets(setA, setB);

  const toggleElement = (target: "a" | "b", elem: string) => {
    const setter = target === "a" ? setSetA : setSetB;
    setter((prev) =>
      prev.includes(elem) ? prev.filter((e) => e !== elem) : [...prev, elem].sort(),
    );
  };

  return (
    <section id="dataflow-framework" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">The Dataflow Framework</h2>
      <p className="mb-4 text-slate-600">
        All dataflow analyses share a common framework: a <strong>lattice</strong> of abstract values,
        a <strong>transfer function</strong> per block, a <strong>join operator</strong> at merge points,
        and an <strong>iteration strategy</strong> that computes until fixpoint.
      </p>

      {/* Lattice explorer */}
      <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-sm font-medium text-navy">Powerset Lattice Explorer</span>
        </div>
        <div className="p-4">
          <p className="mb-4 text-xs text-slate-600">
            The powerset lattice of {`{d1, d2, d3}`} has 8 elements. Pick two sets to see their join (∪) and meet (∩).
          </p>

          {/* Hasse diagram */}
          <div className="mb-4 rounded-lg bg-slate-900 p-4 font-mono text-sm text-slate-300">
            <pre className="text-center">{`         {d1,d2,d3}        ← TOP (⊤)
        /     |     \\
    {d1,d2} {d1,d3} {d2,d3}
      |  \\  / |  \\  / |
      | {d1}  {d2}  {d3}
      |   \\    |    /
       \\   \\   |   /
          ∅              ← BOTTOM (⊥)`}</pre>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Set A picker */}
            <div>
              <p className="mb-2 text-xs font-medium text-blue-700">Set A: {setStr(setA)}</p>
              <div className="flex gap-2">
                {ELEMENTS.map((e) => (
                  <button
                    key={e}
                    onClick={() => toggleElement("a", e)}
                    className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                      setA.includes(e)
                        ? "bg-blue-100 text-blue-700 ring-1 ring-blue-300"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
            {/* Set B picker */}
            <div>
              <p className="mb-2 text-xs font-medium text-purple-700">Set B: {setStr(setB)}</p>
              <div className="flex gap-2">
                {ELEMENTS.map((e) => (
                  <button
                    key={e}
                    onClick={() => toggleElement("b", e)}
                    className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                      setB.includes(e)
                        ? "bg-purple-100 text-purple-700 ring-1 ring-purple-300"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
              <p className="text-xs font-medium text-emerald-800">
                Join (∪): A ∪ B = {setStr(joined)}
              </p>
              <p className="mt-1 text-[10px] text-emerald-700">
                Least upper bound — the smallest set containing both A and B. Used at merge points in may-analyses.
              </p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs font-medium text-amber-800">
                Meet (∩): A ∩ B = {setStr(met)}
              </p>
              <p className="mt-1 text-[10px] text-amber-700">
                Greatest lower bound — elements present in both A and B. Used at merge points in must-analyses.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Forward vs Backward */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-sm font-medium text-navy">Forward vs. Backward Analysis</span>
        </div>
        <div className="p-4">
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => setDirection("forward")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                direction === "forward"
                  ? "bg-blue-100 text-blue-700 ring-1 ring-blue-300"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Forward
            </button>
            <button
              onClick={() => setDirection("backward")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                direction === "backward"
                  ? "bg-amber-100 text-amber-700 ring-1 ring-amber-300"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Backward
            </button>
          </div>

          {direction === "forward" ? (
            <div className="rounded-lg bg-slate-900 p-4 font-mono text-sm text-blue-300">
              <pre>{`Forward Analysis (e.g., Reaching Definitions)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Direction:  ENTRY ──────────────► EXIT
  Merge at:   Block entry (IN)
  Compute:    Block exit  (OUT)

  IN[B]  = ∪ OUT[P]  for all predecessors P
  OUT[B] = transfer(IN[B])
         = gen[B] ∪ (IN[B] − kill[B])

  Initialize: OUT[ENTRY] = ∅`}</pre>
            </div>
          ) : (
            <div className="rounded-lg bg-slate-900 p-4 font-mono text-sm text-amber-300">
              <pre>{`Backward Analysis (e.g., Live Variables)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Direction:  ENTRY ◄──────────────  EXIT
  Merge at:   Block exit  (OUT)
  Compute:    Block entry (IN)

  OUT[B] = ∪ IN[S]  for all successors S
  IN[B]  = transfer(OUT[B])
         = use[B] ∪ (OUT[B] − def[B])

  Initialize: IN[EXIT] = ∅`}</pre>
            </div>
          )}

          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-600">
              <strong>Fixpoint:</strong> Iterate until no IN or OUT set changes. The lattice has finite height
              (2<sup>n</sup> for <em>n</em> definitions or variables), so iteration always terminates.
              For monotone transfer functions, this is guaranteed by the ascending chain condition.
            </p>
          </div>

          <WatchOutCallout items={[
            "Students often confuse gen and kill sets — gen is about THIS block's definitions, kill is about definitions ELSEWHERE that this block shadows.",
            "For reaching definitions, use union (may-analysis) at merge points. Using intersection would give \"must reach\" — a different (and much less useful) analysis.",
            "Backward analyses (like live variables) compute IN from OUT, not OUT from IN. Swapping the direction is the #1 implementation bug.",
            "The worklist should start with ALL blocks, not just the entry. Missing initial blocks can cause incomplete results.",
          ]} />
        </div>
      </div>
    </section>
  );
}
