"use client";

import Link from "next/link";

interface TryItSectionASTProps {
  moduleSlug: string;
}

export default function TryItSectionAST({ moduleSlug }: TryItSectionASTProps) {
  return (
    <section id="try-it" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">Ready to Build Your Own?</h2>
      <p className="mb-6 text-slate-600">
        You now understand how ASTs represent code, how to traverse them, how symbol tables resolve names,
        and how transformations rewrite trees. Time to implement these concepts in OCaml.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href={`/modules/${moduleSlug}/explore`}
          className="group rounded-xl border-2 border-emerald-200 bg-emerald-50 p-6 transition-all hover:border-emerald-300 hover:shadow-md"
        >
          <div className="mb-2">
            <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-emerald-900">AST Explorer</h3>
          <p className="mt-1 text-sm text-emerald-700">
            Interactively explore AST trees, step through traversals, inspect symbol tables, and see transformations on 5 code snippets.
          </p>
          <span className="mt-3 inline-block text-xs font-medium text-emerald-600 group-hover:underline">
            Open explorer &rarr;
          </span>
        </Link>

        <Link
          href={`/modules/${moduleSlug}/exercises/ast-structure-mapping`}
          className="group rounded-xl border-2 border-navy/20 bg-navy/5 p-6 transition-all hover:border-navy/30 hover:shadow-md"
        >
          <div className="mb-2">
            <svg className="h-8 w-8 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-navy">Exercise 1: AST Structure Mapping</h3>
          <p className="mt-1 text-sm text-slate-600">
            Map OCaml AST types to code constructs. Build the mental model for how each language feature becomes a tree node.
          </p>
          <span className="mt-3 inline-block text-xs font-medium text-navy group-hover:underline">
            Start exercise &rarr;
          </span>
        </Link>
      </div>
    </section>
  );
}
