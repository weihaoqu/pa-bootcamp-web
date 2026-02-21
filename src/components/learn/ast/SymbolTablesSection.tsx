"use client";

import { useState } from "react";

const CODE_LINES = [
  'let x = 10           // line 1: global scope',
  'let y = x + 1        // line 2: global scope',
  '{                     // line 3: enter inner scope',
  '  let x = 20         // line 4: inner scope (shadows!)',
  '  let z = x + y      // line 5: inner scope',
  '}                     // line 6: exit inner scope',
  'let w = x + 2        // line 7: back in global scope',
];

interface LookupResult {
  variable: string;
  line: number;
  steps: { scope: string; found: boolean; value?: string }[];
  result: string;
  explanation: string;
}

const LOOKUPS: LookupResult[] = [
  {
    variable: "x",
    line: 2,
    steps: [
      { scope: "global", found: true, value: "10" },
    ],
    result: "x = 10 (from global)",
    explanation: "On line 2, `x` is referenced. The symbol table looks in the current scope (global) and immediately finds `x` declared on line 1 with value 10.",
  },
  {
    variable: "x",
    line: 5,
    steps: [
      { scope: "inner", found: true, value: "20" },
    ],
    result: "x = 20 (from inner — shadowed!)",
    explanation: "On line 5, `x` is referenced inside the inner block. The inner scope has its own `x` (line 4), which shadows the outer `x`. The lookup finds the inner one first and stops.",
  },
  {
    variable: "y",
    line: 5,
    steps: [
      { scope: "inner", found: false },
      { scope: "global", found: true, value: "11" },
    ],
    result: "y = 11 (walked up to global)",
    explanation: "On line 5, `y` is referenced. The inner scope doesn't have `y`, so the lookup walks up to the parent scope (global) and finds `y` declared on line 2.",
  },
  {
    variable: "x",
    line: 7,
    steps: [
      { scope: "global", found: true, value: "10" },
    ],
    result: "x = 10 (inner scope is gone)",
    explanation: "On line 7, we're back in the global scope. The inner scope (and its `x = 20`) no longer exists. The only `x` visible is the global one from line 1.",
  },
];

export default function SymbolTablesSection() {
  const [activeLookup, setActiveLookup] = useState(0);
  const lookup = LOOKUPS[activeLookup];

  return (
    <section id="symbol-tables" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">Symbol Tables &amp; Scope Lookup</h2>
      <p className="mb-4 text-slate-600">
        A <strong>symbol table</strong> maps variable names to their declarations. When code has nested scopes,
        the same name can refer to different things. Click a lookup scenario to see how the scope chain resolves variables.
      </p>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Lookup selector */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
          {LOOKUPS.map((l, i) => (
            <button
              key={i}
              onClick={() => setActiveLookup(i)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                i === activeLookup
                  ? "bg-navy text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <code>{l.variable}</code> on line {l.line}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Code with scope annotations */}
          <div className="border-b border-slate-200 md:border-b-0 md:border-r">
            <pre className="p-4 text-sm">
              {CODE_LINES.map((line, i) => {
                const lineNum = i + 1;
                const isLookupLine = lineNum === lookup.line;
                return (
                  <div
                    key={i}
                    className={`flex transition-colors ${
                      isLookupLine ? "bg-amber-100 -mx-4 px-4" : ""
                    }`}
                  >
                    <span className="mr-4 inline-block w-4 text-right font-mono text-xs text-slate-300">
                      {lineNum}
                    </span>
                    <code className="font-mono text-slate-700">{line}</code>
                  </div>
                );
              })}
            </pre>
          </div>

          {/* Lookup visualization */}
          <div className="p-6">
            <h3 className="mb-3 text-sm font-semibold text-navy">
              Looking up <code className="rounded bg-amber-100 px-1">{lookup.variable}</code> on line {lookup.line}
            </h3>

            {/* Scope chain walk */}
            <div className="mb-4 space-y-2">
              {lookup.steps.map((step, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 rounded-lg border p-2.5 ${
                    step.found
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <span className="text-xs font-medium text-slate-500">{i + 1}.</span>
                  <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-700">
                    {step.scope}
                  </span>
                  {step.found ? (
                    <>
                      <span className="text-xs text-emerald-600">Found!</span>
                      <code className="ml-auto rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-medium text-emerald-800">
                        {lookup.variable} = {step.value}
                      </code>
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-slate-400">Not found</span>
                      <span className="ml-auto text-xs text-slate-400">walk up to parent...</span>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Result */}
            <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3">
              <p className="text-xs font-medium text-indigo-800">Result</p>
              <p className="mt-1 text-xs text-indigo-700">{lookup.result}</p>
            </div>

            <p className="mt-3 text-xs text-slate-600">{lookup.explanation}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
