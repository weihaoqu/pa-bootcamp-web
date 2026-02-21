"use client";

import { useState } from "react";

const EXAMPLES = [
  {
    label: "Basic Match",
    code: `let describe x =
  match x with
  | 0 -> "zero"
  | 1 -> "one"
  | n when n > 0 -> "positive"
  | _ -> "negative"`,
    calls: [
      { input: "describe 0", output: '"zero"' },
      { input: "describe 42", output: '"positive"' },
      { input: "describe (-3)", output: '"negative"' },
    ],
  },
  {
    label: "Tuple Destructuring",
    code: `let swap (a, b) = (b, a)

let add_pairs (x1, y1) (x2, y2) =
  (x1 + x2, y1 + y2)`,
    calls: [
      { input: "swap (1, 2)", output: "(2, 1)" },
      { input: "add_pairs (1, 2) (3, 4)", output: "(4, 6)" },
    ],
  },
  {
    label: "List Patterns",
    code: `let rec sum lst =
  match lst with
  | [] -> 0
  | x :: rest -> x + sum rest

let head_or_default lst default_val =
  match lst with
  | x :: _ -> x
  | [] -> default_val`,
    calls: [
      { input: "sum [1; 2; 3]", output: "6" },
      { input: "head_or_default [] 99", output: "99" },
    ],
  },
];

export default function PatternMatchingSection() {
  const [active, setActive] = useState(0);
  const ex = EXAMPLES[active];

  return (
    <section id="pattern-matching" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">Pattern Matching</h2>
      <p className="mb-4 text-slate-600">
        Pattern matching is OCaml&apos;s superpower. Instead of chains of if-else or switch statements,
        you destructure values directly. The compiler checks that every case is covered — if you forget
        a variant, you get a warning.
      </p>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex gap-2">
            {EXAMPLES.map((e, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  active === i ? "bg-amber-100 text-amber-700 ring-1 ring-amber-300" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6">
          <div className="mb-4 rounded-lg bg-slate-900 p-4 font-mono text-sm text-slate-300">
            <pre>{ex.code}</pre>
          </div>
          <div className="space-y-1.5">
            {ex.calls.map((c, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-2">
                <code className="text-xs font-mono text-purple-700">{c.input}</code>
                <span className="text-slate-400">&rarr;</span>
                <code className="text-xs font-mono font-semibold text-emerald-700">{c.output}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
