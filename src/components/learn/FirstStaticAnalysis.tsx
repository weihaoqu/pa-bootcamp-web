"use client";

import { useState } from "react";

const STEPS = [
  {
    title: "Start: Read the function signature",
    highlightLines: [1],
    explanation: "We see `divide(a, b)` takes two parameters. We don't know their values yet — that's the point of static analysis. We reason about ALL possible inputs.",
  },
  {
    title: "Track the branch condition",
    highlightLines: [2],
    explanation: "There's an `if` that checks `b > 0`. This splits the world into two cases: b > 0 (true branch) and b <= 0 (false branch).",
  },
  {
    title: "True branch: b > 0",
    highlightLines: [3],
    explanation: "If b > 0, we compute a / b. Since b > 0, division is safe — no division by zero here. Static analysis proves this path is safe.",
  },
  {
    title: "False branch: b <= 0",
    highlightLines: [5],
    explanation: "If b <= 0, we return a / b. But wait — b could be exactly 0! The condition b <= 0 includes b = 0. This is a potential division by zero.",
  },
  {
    title: "Report the finding",
    highlightLines: [5],
    explanation: "Static analysis reports: \"Line 5: possible division by zero when b = 0.\" We found this without running the code, without test cases, by reasoning about all possible paths.",
  },
];

const CODE = `function divide(a, b) {
  if (b > 0) {
    return a / b;   // Safe: b is guaranteed > 0
  } else {
    return a / b;   // BUG: b could be 0!
  }
}

// These calls exist in the program:
divide(10, 5);    // OK: b=5 > 0, takes true branch
divide(10, 0);    // BUG: b=0 <= 0, takes false branch → 10/0!
divide(10, -3);   // OK: b=-3 <= 0, takes false branch → 10/(-3)`;

export default function FirstStaticAnalysis() {
  const [currentStep, setCurrentStep] = useState(0);
  const step = STEPS[currentStep];

  return (
    <section id="first-static" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">Your First Static Analysis</h2>
      <p className="mb-4 text-slate-600">
        Let&apos;s walk through how a static analyzer would examine this simple function — step by step,
        without ever running it.
      </p>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Step navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-xs font-medium text-slate-500">Step {currentStep + 1}/{STEPS.length}</span>
          <div className="flex gap-1">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === currentStep ? "bg-navy" : i < currentStep ? "bg-navy/40" : "bg-slate-200"
                }`}
              />
            ))}
          </div>
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="rounded px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-200 disabled:opacity-30"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))}
              disabled={currentStep === STEPS.length - 1}
              className="rounded bg-navy px-2 py-1 text-xs font-medium text-white hover:bg-navy-dark disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Code with line highlighting */}
          <div className="border-b border-slate-200 md:border-b-0 md:border-r">
            <pre className="overflow-x-auto p-4 text-sm">
              {CODE.split("\n").map((line, i) => {
                const lineNum = i + 1;
                const isHighlighted = step.highlightLines.includes(lineNum);
                return (
                  <div
                    key={i}
                    className={`flex transition-colors ${
                      isHighlighted ? "bg-amber-100 -mx-4 px-4" : ""
                    }`}
                  >
                    <span className="mr-4 inline-block w-6 text-right font-mono text-xs text-slate-300">
                      {lineNum}
                    </span>
                    <code className="font-mono text-slate-700">{line}</code>
                  </div>
                );
              })}
            </pre>
          </div>

          {/* Explanation */}
          <div className="p-6">
            <h3 className="mb-2 text-sm font-semibold text-navy">{step.title}</h3>
            <p className="text-sm text-slate-600">{step.explanation}</p>
            {currentStep === STEPS.length - 1 && (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-xs font-medium text-amber-800">Key Insight</p>
                <p className="mt-1 text-xs text-amber-700">
                  Static analysis examines every possible path through the code. It found the bug on line 5
                  even though the code also has safe calls — because it reasons about <em>all</em> inputs,
                  not just the ones in our test suite.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
