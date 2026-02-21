"use client";

import { useState } from "react";

const CODE = `let x = 3 + 4 * 2`;

const STEPS = [
  {
    title: "Start: identify the statement",
    tree: `Program
└── LetStmt ???`,
    explanation: "The parser sees `let x = ...` and creates a LetStmt node. But it hasn't parsed the right-hand side yet.",
    highlightRange: "let x = 3 + 4 * 2",
  },
  {
    title: "Parse the binding target",
    tree: `Program
└── LetStmt
    ├── Var "x"       ← binding
    └── ???`,
    explanation: "The variable name `x` becomes a Var node marked as a binding (it's being declared, not referenced).",
    highlightRange: "x",
  },
  {
    title: "Parse the expression: find the lowest-precedence operator",
    tree: `Program
└── LetStmt
    ├── Var "x"
    └── BinOp "+"
        ├── ???
        └── ???`,
    explanation: "The parser finds `+` has lower precedence than `*`, so `+` becomes the root of the expression tree. Its operands will be parsed recursively.",
    highlightRange: "+",
  },
  {
    title: "Left operand of +",
    tree: `Program
└── LetStmt
    ├── Var "x"
    └── BinOp "+"
        ├── IntLit 3     ← leaf
        └── ???`,
    explanation: "The left operand of `+` is just the integer literal `3`. Literals are always leaf nodes — they have no children.",
    highlightRange: "3",
  },
  {
    title: "Right operand of +: another operator",
    tree: `Program
└── LetStmt
    ├── Var "x"
    └── BinOp "+"
        ├── IntLit 3
        └── BinOp "*"
            ├── ???
            └── ???`,
    explanation: "The right operand of `+` is `4 * 2`. Since `*` has higher precedence, it becomes a child of `+`, not a sibling. This is how the tree encodes precedence!",
    highlightRange: "*",
  },
  {
    title: "Complete: all leaves filled in",
    tree: `Program
└── LetStmt
    ├── Var "x"
    └── BinOp "+"
        ├── IntLit 3
        └── BinOp "*"
            ├── IntLit 4
            └── IntLit 2`,
    explanation: "The tree is complete. Notice: `*` is deeper than `+`, so during evaluation it computes first (4*2=8), then the `+` node computes 3+8=11. The tree structure IS the evaluation order.",
    highlightRange: "4 * 2",
  },
];

export default function CodeToTreeSection() {
  const [currentStep, setCurrentStep] = useState(0);
  const step = STEPS[currentStep];

  return (
    <section id="code-to-tree" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">From Code to Tree</h2>
      <p className="mb-4 text-slate-600">
        Watch how a parser builds an AST from a single line of code, step by step.
        Notice how operator precedence is captured by tree depth.
      </p>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Step navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-xs font-medium text-slate-500">
            Step {currentStep + 1}/{STEPS.length}
          </span>
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
          {/* Left: Source code + tree */}
          <div className="border-b border-slate-200 md:border-b-0 md:border-r">
            {/* Source with highlighting */}
            <div className="border-b border-slate-100 px-4 py-3">
              <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-slate-400">Source</p>
              <code className="font-mono text-sm text-slate-700">
                {CODE.split("").map((char, i) => {
                  const idx = CODE.indexOf(step.highlightRange);
                  const isHighlighted = idx !== -1 && i >= idx && i < idx + step.highlightRange.length;
                  return (
                    <span key={i} className={isHighlighted ? "bg-amber-200 rounded" : ""}>
                      {char}
                    </span>
                  );
                })}
              </code>
            </div>
            {/* Tree visualization */}
            <div className="p-4">
              <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-slate-400">AST</p>
              <pre className="font-mono text-xs leading-relaxed text-slate-700">{step.tree}</pre>
            </div>
          </div>

          {/* Right: Explanation */}
          <div className="p-6">
            <h3 className="mb-2 text-sm font-semibold text-navy">{step.title}</h3>
            <p className="text-sm text-slate-600">{step.explanation}</p>
            {currentStep === STEPS.length - 1 && (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-xs font-medium text-amber-800">Key Insight</p>
                <p className="mt-1 text-xs text-amber-700">
                  The depth of an operator in the AST determines when it evaluates.
                  Deeper nodes evaluate first. This is why <code>*</code> (deeper) evaluates before <code>+</code> (shallower) — precedence
                  is encoded in tree structure, not in reading order.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
