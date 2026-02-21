"use client";

import { useState } from "react";

const MOTIVATION_CODE = `a = 10
b = a - a     // b is always 0
c = 10 / b    // CRASH: division by zero!`;

export default function WhyAbstractSection() {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <section id="why-abstract" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">Why Abstract Interpretation?</h2>
      <p className="mb-4 text-slate-600">
        Testing runs your program on <em>some</em> inputs. Abstract interpretation analyzes <em>all possible</em> inputs
        at once — without ever running the code. It trades precision for <strong>coverage</strong>: instead of tracking
        exact values, it tracks <em>properties</em> of values (sign, range, constness).
      </p>

      <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-sm font-medium text-navy">The Motivating Example</span>
        </div>
        <div className="p-6">
          <p className="mb-4 text-sm text-slate-600">
            Can you spot the bug? This code compiles fine and <em>might</em> pass some tests:
          </p>

          <div className="mb-4 rounded-lg bg-slate-900 p-4 font-mono text-sm text-slate-300">
            <pre>{MOTIVATION_CODE}</pre>
          </div>

          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              showAnswer
                ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {showAnswer ? "Hide analysis" : "How does abstract interpretation catch this?"}
          </button>

          {showAnswer && (
            <div className="mt-4 space-y-3">
              <div className="rounded-lg bg-slate-900 p-4 font-mono text-sm text-slate-300">
                <pre>{`Step 1: a = 10
  Sign:     a → Pos
  Constant: a → Const(10)
  Interval: a → [10, 10]

Step 2: b = a - a
  Sign:     b → Zero  (any number minus itself)
  Constant: b → Const(0)
  Interval: b → [0, 0]

Step 3: c = 10 / b
  ⚠️  b includes Zero → DIVISION BY ZERO!
  All three domains catch this statically.`}</pre>
              </div>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <p className="text-xs font-medium text-emerald-800">Key Insight</p>
                <p className="mt-1 text-xs text-emerald-700">
                  Abstract interpretation doesn&apos;t run the code — it <em>reasons</em> about what values variables
                  can hold at each point. By tracking abstract properties (sign, exact constant, or range), it covers
                  every possible execution path simultaneously.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
            <span className="text-sm">1x</span>
          </div>
          <h3 className="text-sm font-semibold text-navy">Concrete Execution</h3>
          <p className="mt-1 text-xs text-slate-600">
            Runs the program on one input at a time. Fast, but misses bugs on untested paths.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
            <span className="text-sm">Nx</span>
          </div>
          <h3 className="text-sm font-semibold text-navy">Testing</h3>
          <p className="mt-1 text-xs text-slate-600">
            Runs many inputs. Better coverage, but still finite — can&apos;t guarantee absence of bugs.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
            <span className="text-sm">&infin;</span>
          </div>
          <h3 className="text-sm font-semibold text-navy">Abstract Interpretation</h3>
          <p className="mt-1 text-xs text-slate-600">
            Covers ALL inputs at once. May report false positives, but never misses a real bug (soundness).
          </p>
        </div>
      </div>
    </section>
  );
}
