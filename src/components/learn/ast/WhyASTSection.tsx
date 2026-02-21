"use client";

import { useState } from "react";

export default function WhyASTSection() {
  const [showCorrect, setShowCorrect] = useState(false);

  return (
    <section id="why-ast" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">Why Do We Need ASTs?</h2>
      <p className="mb-4 text-slate-600">
        Source code is just a string of characters. To analyze or transform it, we need a structured
        representation that captures the <em>meaning</em> — not just the syntax. Consider this expression:
      </p>

      <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-sm font-medium text-navy">The Precedence Problem</span>
        </div>
        <div className="p-6">
          <div className="mb-4 text-center">
            <code className="rounded bg-slate-100 px-4 py-2 text-lg font-mono font-bold text-slate-800">
              3 + 4 * 2
            </code>
          </div>

          <p className="mb-4 text-sm text-slate-600">
            Does this equal <strong>14</strong> (evaluating left-to-right: 7*2) or <strong>11</strong> (respecting
            precedence: 3+8)? A flat string can&apos;t tell us. But a tree makes the structure explicit:
          </p>

          <div className="flex items-center justify-center gap-2 mb-4">
            <button
              onClick={() => setShowCorrect(false)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                !showCorrect ? "bg-red-100 text-red-700 ring-1 ring-red-300" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Wrong: left-to-right
            </button>
            <button
              onClick={() => setShowCorrect(true)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                showCorrect ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Correct: precedence
            </button>
          </div>

          {/* ASCII tree diagrams */}
          <div className="rounded-lg bg-slate-900 p-4 font-mono text-sm text-slate-300">
            {!showCorrect ? (
              <pre className="text-center">{`      *          ← evaluates last
     / \\
    +   2        ← 3+4=7, then 7*2=14
   / \\
  3   4

  Result: 14  ← WRONG!`}</pre>
            ) : (
              <pre className="text-center">{`      +          ← evaluates last
     / \\
    3   *        ← 4*2=8, then 3+8=11
       / \\
      4   2

  Result: 11  ← CORRECT!`}</pre>
            )}
          </div>

          <div className={`mt-4 rounded-lg border p-3 ${showCorrect ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}>
            <p className={`text-xs font-medium ${showCorrect ? "text-emerald-800" : "text-red-800"}`}>
              {showCorrect ? "Key Insight" : "The Problem"}
            </p>
            <p className={`mt-1 text-xs ${showCorrect ? "text-emerald-700" : "text-red-700"}`}>
              {showCorrect
                ? "The AST encodes operator precedence in its structure. Multiplication is deeper in the tree, so it evaluates first. The tree IS the semantics."
                : "Reading left-to-right ignores precedence. Without tree structure, a flat scan of \"3 + 4 * 2\" would compute (3+4)*2 = 14 instead of 3+(4*2) = 11."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-2 text-lg">
            <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-navy">Structure over Syntax</h3>
          <p className="mt-1 text-xs text-slate-600">
            ASTs strip away irrelevant details (whitespace, parentheses, semicolons) and keep the semantic structure.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-2 text-lg">
            <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-navy">Foundation for Analysis</h3>
          <p className="mt-1 text-xs text-slate-600">
            Every analysis tool — linters, type checkers, optimizers — works on ASTs. It&apos;s the universal intermediate representation.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-2 text-lg">
            <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-navy">Enable Transformations</h3>
          <p className="mt-1 text-xs text-slate-600">
            Refactoring, optimization, and code generation all work by transforming one AST into another.
          </p>
        </div>
      </div>
    </section>
  );
}
