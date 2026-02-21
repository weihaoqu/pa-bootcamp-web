"use client";

import { useState } from "react";
import WatchOutCallout from "../WatchOutCallout";

interface Transform {
  name: string;
  tagline: string;
  description: string;
  before: string;
  after: string;
  changedLines: number[];
  insight: string;
}

const TRANSFORMS: Transform[] = [
  {
    name: "Constant Folding",
    tagline: "Evaluate compile-time constants",
    description: "When both operands of an operator are literals, the compiler can compute the result at compile time instead of at runtime.",
    before: `let x = 3 + 4 * 2
let y = x + 1`,
    after: `let x = 11
let y = x + 1`,
    changedLines: [1],
    insight: "The compiler walks the AST bottom-up (post-order). At `4 * 2`, both children are IntLit — so it folds to IntLit(8). Then `3 + 8` folds to IntLit(11). This is why post-order traversal matters for evaluation!",
  },
  {
    name: "Dead Code Elimination",
    tagline: "Remove unreachable code",
    description: "If every branch of an if/else returns, any code after it can never execute. The AST transformation removes these unreachable nodes.",
    before: `function abs(n)
  if n < 0 then
    return -n
  else
    return n
  end
  let result = 0
  return result`,
    after: `function abs(n)
  if n < 0 then
    return -n
  else
    return n
  end`,
    changedLines: [7, 8],
    insight: "Dead code elimination uses control flow analysis on the AST. Both branches of the if/else contain `return`, so execution never reaches line 7. Removing dead code reduces binary size and eliminates confusion for maintenance.",
  },
  {
    name: "Variable Renaming",
    tagline: "Eliminate variable shadowing",
    description: "When an inner scope re-declares a variable that exists in an outer scope, renaming the inner one to a unique name makes the program easier to analyze.",
    before: `let x = 10
{
  let x = 20
  print(x)
}
print(x)`,
    after: `let x = 10
{
  let x_1 = 20
  print(x_1)
}
print(x)`,
    changedLines: [3, 4],
    insight: "After renaming, every variable name is globally unique. This makes dataflow analysis simpler — you don't need to track scopes anymore, just names. Compilers call this \"alpha conversion\" or \"SSA renaming.\"",
  },
];

export default function TransformationsSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const transform = TRANSFORMS[activeIdx];

  return (
    <section id="transforms" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">AST Transformations</h2>
      <p className="mb-4 text-slate-600">
        Once you can build and traverse ASTs, you can <em>transform</em> them — rewriting the tree to optimize,
        simplify, or prepare code for further analysis. Here are three fundamental transforms you&apos;ll implement in the exercises.
      </p>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Transform selector */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          {TRANSFORMS.map((t, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`flex-1 px-4 py-2.5 text-xs font-medium transition-colors ${
                i === activeIdx
                  ? "border-b-2 border-navy bg-white text-navy"
                  : "text-slate-500 hover:text-navy"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Info */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-navy">{transform.name}</h3>
            <p className="text-xs text-slate-500">{transform.tagline}</p>
            <p className="mt-2 text-sm text-slate-600">{transform.description}</p>
          </div>

          {/* Before / After */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <span className="inline-block h-2 w-2 rounded-full bg-red-400" />
                Before
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs">
                {transform.before.split("\n").map((line, i) => {
                  const lineNum = i + 1;
                  const isChanged = transform.changedLines.includes(lineNum);
                  return (
                    <div key={i} className={`flex ${isChanged ? "bg-red-900/30" : ""}`}>
                      <span className="mr-3 inline-block w-3 text-right text-slate-500">{lineNum}</span>
                      <code className={isChanged ? "text-red-300 line-through decoration-red-500/40" : "text-slate-300"}>
                        {line || " "}
                      </code>
                    </div>
                  );
                })}
              </pre>
            </div>
            <div>
              <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                After
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs">
                {transform.after.split("\n").map((line, i) => {
                  const lineNum = i + 1;
                  const isChanged = transform.changedLines.includes(lineNum);
                  return (
                    <div key={i} className={`flex ${isChanged ? "bg-emerald-900/30" : ""}`}>
                      <span className="mr-3 inline-block w-3 text-right text-slate-500">{lineNum}</span>
                      <code className={isChanged ? "text-emerald-300" : "text-slate-300"}>
                        {line || " "}
                      </code>
                    </div>
                  );
                })}
              </pre>
            </div>
          </div>

          {/* Insight */}
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs font-medium text-amber-800">How It Works</p>
            <p className="mt-1 text-xs text-amber-700">{transform.insight}</p>
          </div>
        </div>
      </div>

      <WatchOutCallout items={[
        "Constant folding only works on literal expressions — don't fold variables even if you \"know\" their value (that's constant propagation, a different analysis).",
        "When eliminating dead code, make sure your liveness check is correct — removing a statement that has side effects (like a function call) is a bug, not an optimization.",
        "Variable renaming in nested scopes: always check the scope chain. Renaming 'x' in the outer scope should NOT rename 'x' references inside an inner scope that shadows it.",
      ]} />
    </section>
  );
}
