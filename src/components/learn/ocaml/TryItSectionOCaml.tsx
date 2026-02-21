"use client";

import Link from "next/link";

interface TryItSectionOCamlProps {
  moduleSlug: string;
}

export default function TryItSectionOCaml({ moduleSlug }: TryItSectionOCamlProps) {
  return (
    <section id="try-it" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">Ready to Practice?</h2>
      <p className="mb-6 text-slate-600">
        You now have a mental model of the OCaml features you&apos;ll use throughout this course: pattern
        matching for AST traversal, algebraic types for modeling domains, and functors for building
        generic analysis frameworks. Time to practice.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href={`/modules/${moduleSlug}/exercises/ocaml-basics`}
          className="group rounded-xl border-2 border-navy/20 bg-navy/5 p-6 transition-all hover:border-navy/30 hover:shadow-md"
        >
          <div className="mb-2">
            <svg className="h-8 w-8 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-navy">Exercise 1: OCaml Basics</h3>
          <p className="mt-1 text-sm text-slate-600">
            Start with fundamentals: let bindings, tuples, string operations, and basic functions.
          </p>
          <span className="mt-3 inline-block text-xs font-medium text-navy group-hover:underline">
            Start exercise &rarr;
          </span>
        </Link>

        <Link
          href={`/modules/${moduleSlug}/exercises/types-and-recursion`}
          className="group rounded-xl border-2 border-purple-200 bg-purple-50 p-6 transition-all hover:border-purple-300 hover:shadow-md"
        >
          <div className="mb-2">
            <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-purple-900">Exercise 2: Types &amp; Recursion</h3>
          <p className="mt-1 text-sm text-purple-700">
            Build your first ADT (a tiny expression tree) and write recursive pattern-matching functions.
          </p>
          <span className="mt-3 inline-block text-xs font-medium text-purple-600 group-hover:underline">
            Start exercise &rarr;
          </span>
        </Link>
      </div>
    </section>
  );
}
