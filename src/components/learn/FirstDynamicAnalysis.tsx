"use client";

import { useState } from "react";

const CODE = `function divide(a, b) {
  if (b > 0) {
    return a / b;
  } else {
    return a / b;
  }
}`;

const TEST_CASES = [
  {
    name: "Test 1: divide(10, 5)",
    input: "a=10, b=5",
    result: "2",
    status: "pass" as const,
    executedLines: [1, 2, 3],
    coveragePercent: 50,
    explanation: "b=5 > 0, so we take the true branch (line 3). The false branch (line 5) is never executed. No error — but we only tested one path!",
  },
  {
    name: "Test 2: divide(10, -3)",
    input: "a=10, b=-3",
    result: "-3.33",
    status: "pass" as const,
    executedLines: [1, 2, 4, 5],
    coveragePercent: 83,
    explanation: "b=-3 ≤ 0, so we take the false branch (line 5). Division works (-3 ≠ 0). Now we've covered both branches, and all tests pass. But there's still a bug lurking...",
  },
  {
    name: "Test 3: divide(10, 0)",
    input: "a=10, b=0",
    result: "Infinity (or crash)",
    status: "fail" as const,
    executedLines: [1, 2, 4, 5],
    coveragePercent: 83,
    explanation: "b=0 ≤ 0, takes the false branch. 10/0 = Infinity! We found the bug — but only because we chose the right input. If we'd stopped at 100% branch coverage (tests 1+2), we'd have missed it.",
  },
];

export default function FirstDynamicAnalysis() {
  const [activeTest, setActiveTest] = useState(0);
  const test = TEST_CASES[activeTest];

  return (
    <section id="first-dynamic" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">Your First Dynamic Analysis</h2>
      <p className="mb-4 text-slate-600">
        Now let&apos;s analyze the <em>same program</em> dynamically — by actually running it with specific inputs
        and observing what happens.
      </p>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Test case selector */}
        <div className="flex gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
          {TEST_CASES.map((tc, i) => (
            <button
              key={i}
              onClick={() => setActiveTest(i)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                i === activeTest
                  ? tc.status === "fail"
                    ? "bg-red-500 text-white"
                    : "bg-emerald-500 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tc.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Code with executed lines */}
          <div className="border-b border-slate-200 md:border-b-0 md:border-r">
            <pre className="overflow-x-auto p-4 text-sm">
              {CODE.split("\n").map((line, i) => {
                const lineNum = i + 1;
                const isExecuted = test.executedLines.includes(lineNum);
                return (
                  <div
                    key={i}
                    className={`flex transition-colors ${
                      isExecuted ? "bg-emerald-50 -mx-4 px-4" : "opacity-40"
                    }`}
                  >
                    <span className="mr-4 inline-block w-6 text-right font-mono text-xs text-slate-300">
                      {lineNum}
                    </span>
                    <code className="font-mono text-slate-700">{line}</code>
                    {isExecuted && (
                      <span className="ml-2 text-xs text-emerald-400">&#x2713;</span>
                    )}
                  </div>
                );
              })}
            </pre>

            {/* Coverage bar */}
            <div className="border-t border-slate-200 px-4 py-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Line coverage</span>
                <span className="font-mono font-medium text-slate-700">{test.coveragePercent}%</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${test.coveragePercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Result + explanation */}
          <div className="p-6">
            <div className="mb-4">
              <span className="text-xs text-slate-400">Input</span>
              <p className="font-mono text-sm text-slate-700">{test.input}</p>
            </div>
            <div className="mb-4">
              <span className="text-xs text-slate-400">Result</span>
              <p className={`font-mono text-sm ${test.status === "fail" ? "text-red-600 font-medium" : "text-emerald-600"}`}>
                {test.result}
              </p>
            </div>
            <p className="text-sm text-slate-600">{test.explanation}</p>
            {activeTest === TEST_CASES.length - 1 && (
              <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
                <p className="text-xs font-medium text-blue-800">Key Insight</p>
                <p className="mt-1 text-xs text-blue-700">
                  Dynamic analysis (testing) can only find bugs on the paths you actually run.
                  100% branch coverage (tests 1+2) didn&apos;t find the division-by-zero because
                  b=0 is a specific <em>value</em> within the false branch. You need the right test inputs.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
