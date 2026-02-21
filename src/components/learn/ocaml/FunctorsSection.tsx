"use client";

import { useState } from "react";

export default function FunctorsSection() {
  const [showUsage, setShowUsage] = useState(false);

  return (
    <section id="functors" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">Modules &amp; Functors</h2>
      <p className="mb-4 text-slate-600">
        OCaml modules are like interfaces on steroids. A <strong>module type</strong> defines a contract
        (what types and functions must exist), and a <strong>functor</strong> is a module parameterized by
        another module — essentially a &ldquo;function from module to module.&rdquo; This is how we build
        domain-generic analyzers in M4-M6.
      </p>

      <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-sm font-medium text-navy">The Lattice Pattern (Preview)</span>
        </div>
        <div className="p-6">
          <div className="mb-4 rounded-lg bg-slate-900 p-4 font-mono text-sm text-slate-300">
            <pre>{`(* 1. Define the contract *)
module type LATTICE = sig
  type t
  val bottom : t
  val top    : t
  val join   : t -> t -> t
  val meet   : t -> t -> t
end

(* 2. Implement it for signs *)
module SignLattice : LATTICE = struct
  type t = Bot | Neg | Zero | Pos | Top
  let bottom = Bot
  let top = Top
  let join a b = match a, b with
    | Bot, x | x, Bot -> x
    | x, y when x = y -> x
    | _ -> Top
  let meet a b = match a, b with
    | Top, x | x, Top -> x
    | x, y when x = y -> x
    | _ -> Bot
end

(* 3. Build a generic analyzer *)
module MakeAnalyzer (L : LATTICE) = struct
  let analyze env = (* works with ANY lattice! *)
    L.join env L.bottom
end`}</pre>
          </div>

          <button
            onClick={() => setShowUsage(!showUsage)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              showUsage ? "bg-navy text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {showUsage ? "Hide usage" : "Show how functors enable code reuse"}
          </button>

          {showUsage && (
            <div className="mt-4 rounded-lg bg-slate-900 p-4 font-mono text-sm text-slate-300">
              <pre>{`(* Same analyzer, different domains! *)
module SignAnalyzer = MakeAnalyzer(SignLattice)
module TaintAnalyzer = MakeAnalyzer(TaintLattice)
module IntervalAnalyzer = MakeAnalyzer(IntervalLattice)

(* One implementation, three analyzers.
   Add a new domain? Just implement LATTICE. *)`}</pre>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        <h3 className="text-sm font-semibold text-emerald-800">Why This Matters</h3>
        <p className="mt-1 text-xs text-emerald-700">
          In Module 4, you&apos;ll implement the <code className="bg-emerald-100 px-1 rounded">ABSTRACT_DOMAIN</code> module type
          and use the <code className="bg-emerald-100 px-1 rounded">MakeEnv</code> functor to build environments for any domain.
          In Module 5, the taint lattice plugs into the same framework. The functor pattern means you write the
          analysis engine once and reuse it for every domain — exactly how real tools work.
        </p>
      </div>
    </section>
  );
}
