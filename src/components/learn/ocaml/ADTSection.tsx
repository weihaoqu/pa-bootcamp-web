"use client";

import { useState } from "react";

export default function ADTSection() {
  const [showTree, setShowTree] = useState(false);

  return (
    <section id="adt" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">Algebraic Data Types</h2>
      <p className="mb-4 text-slate-600">
        Algebraic data types (ADTs) let you define types with <em>variants</em> — each variant can carry
        different data. This is exactly how ASTs, lattice elements, and analysis results are modeled throughout
        this course.
      </p>

      <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-sm font-medium text-navy">Building an Expression Tree</span>
        </div>
        <div className="p-6">
          <div className="mb-4 rounded-lg bg-slate-900 p-4 font-mono text-sm text-slate-300">
            <pre>{`(* Define the type *)
type expr =
  | Num of int
  | Add of expr * expr
  | Mul of expr * expr

(* Build a tree: (2 + 3) * 4 *)
let tree = Mul (Add (Num 2, Num 3), Num 4)

(* Evaluate recursively *)
let rec eval = function
  | Num n -> n
  | Add (a, b) -> eval a + eval b
  | Mul (a, b) -> eval a * eval b`}</pre>
          </div>

          <button
            onClick={() => setShowTree(!showTree)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              showTree ? "bg-navy text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {showTree ? "Hide tree" : "Show tree structure"}
          </button>

          {showTree && (
            <div className="mt-4 rounded-lg bg-slate-900 p-4 font-mono text-sm text-center text-slate-300">
              <pre>{`    Mul
   /   \\
 Add    Num 4
 / \\
Num 2  Num 3

eval tree = (2 + 3) * 4 = 20`}</pre>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
          <h3 className="text-sm font-semibold text-purple-800">This Pattern Is Everywhere</h3>
          <p className="mt-1 text-xs text-purple-700">
            The same ADT + recursive function pattern appears in every module: AST nodes (M2),
            CFG blocks (M3), lattice elements (M4), taint values (M5), and finding types (M6).
            Master it here and it unlocks the entire course.
          </p>
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h3 className="text-sm font-semibold text-blue-800">Exhaustiveness Checking</h3>
          <p className="mt-1 text-xs text-blue-700">
            If you add a <code className="bg-blue-100 px-1 rounded">Sub</code> variant to <code className="bg-blue-100 px-1 rounded">expr</code> but forget
            to handle it in <code className="bg-blue-100 px-1 rounded">eval</code>, OCaml gives a compile-time warning. This catches bugs
            that would be silent runtime errors in Python or JavaScript.
          </p>
        </div>
      </div>
    </section>
  );
}
