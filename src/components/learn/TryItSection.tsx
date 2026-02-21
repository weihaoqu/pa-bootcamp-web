"use client";

import Link from "next/link";

interface TryItSectionProps {
  moduleSlug: string;
}

export default function TryItSection({ moduleSlug }: TryItSectionProps) {
  return (
    <section id="try-it" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">Ready to Try It Yourself?</h2>
      <p className="mb-6 text-slate-600">
        You now understand the core ideas behind program analysis. Time to put them into practice.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href={`/modules/${moduleSlug}/explore`}
          className="group rounded-xl border-2 border-emerald-200 bg-emerald-50 p-6 transition-all hover:border-emerald-300 hover:shadow-md"
        >
          <div className="mb-2 text-2xl">
            <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-emerald-900">Analysis Playground</h3>
          <p className="mt-1 text-sm text-emerald-700">
            Compare static vs dynamic analysis on 6 different code snippets. See findings, coverage, and Venn diagrams side by side.
          </p>
          <span className="mt-3 inline-block text-xs font-medium text-emerald-600 group-hover:underline">
            Open playground &rarr;
          </span>
        </Link>

        <Link
          href={`/modules/${moduleSlug}/exercises/analysis-comparison`}
          className="group rounded-xl border-2 border-navy/20 bg-navy/5 p-6 transition-all hover:border-navy/30 hover:shadow-md"
        >
          <div className="mb-2 text-2xl">
            <svg className="h-8 w-8 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-navy">Exercise 1: Analysis Comparison</h3>
          <p className="mt-1 text-sm text-slate-600">
            Your first hands-on exercise. Classify analysis techniques, identify tradeoffs, and reason about what different approaches can detect.
          </p>
          <span className="mt-3 inline-block text-xs font-medium text-navy group-hover:underline">
            Start exercise &rarr;
          </span>
        </Link>
      </div>
    </section>
  );
}
