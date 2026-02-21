"use client";

export default function WhyOCamlSection() {
  return (
    <section id="why-ocaml" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">Why OCaml for Program Analysis?</h2>
      <p className="mb-4 text-slate-600">
        OCaml is the language of choice for compiler and analysis tool development. Its type system catches
        bugs at compile time, pattern matching makes AST traversal concise, and algebraic data types let you
        model complex structures naturally. Many real-world tools — including parts of the Rust compiler,
        Flow (Facebook&apos;s JS type checker), and Infer (Facebook&apos;s static analyzer) — are written in OCaml.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
            <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-navy">Type Safety</h3>
          <p className="mt-1 text-xs text-slate-600">
            The compiler catches missing cases, type mismatches, and unhandled variants at compile time — not at runtime.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
            <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-navy">Pattern Matching</h3>
          <p className="mt-1 text-xs text-slate-600">
            Destructure complex data in one step. The compiler warns if you miss a case — essential for handling every AST node type.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
            <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-navy">Modules &amp; Functors</h3>
          <p className="mt-1 text-xs text-slate-600">
            Parameterize code over abstract types. Write one analyzer framework, plug in different domains — sign, interval, taint.
          </p>
        </div>
      </div>
    </section>
  );
}
