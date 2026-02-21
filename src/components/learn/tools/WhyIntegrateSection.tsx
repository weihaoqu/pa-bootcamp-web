"use client";

import { useState } from "react";

export default function WhyIntegrateSection() {
  const [showComparison, setShowComparison] = useState(false);

  return (
    <section id="why-integrate" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">Why Tools Integration?</h2>
      <p className="mb-4 text-slate-600">
        You&apos;ve built individual analyses — CFGs, dataflow, abstract interpretation, taint tracking.
        But real-world tools like ESLint, Semgrep, and Coverity don&apos;t run just one analysis. They
        combine <strong>multiple passes</strong> into a unified pipeline, aggregate findings, and produce
        actionable reports. This module is about building that integration layer.
      </p>

      <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-sm font-medium text-navy">Single Pass vs. Multi-Pass</span>
        </div>
        <div className="p-6">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              showComparison ? "bg-navy text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {showComparison ? "Hide comparison" : "What does a single pass miss?"}
          </button>

          {showComparison && (
            <div className="mt-4">
              <div className="mb-4 rounded-lg bg-slate-900 p-4 font-mono text-sm text-slate-300">
                <pre>{`username = req.body.user      // taint source
count = 0
divisor = count               // will be 0
query = "SELECT..." + username // SQL injection
result = db.exec(query)       // sink!
ratio = 100 / divisor         // div by zero!
unused = 42                   // dead code`}</pre>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <div className="text-xs font-semibold text-red-800">Taint Analysis Alone</div>
                  <div className="mt-1 text-xs text-red-700">Catches: SQL injection (L5)</div>
                  <div className="text-xs text-red-600">Misses: div-by-zero, dead code</div>
                </div>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <div className="text-xs font-semibold text-blue-800">Sign Analysis Alone</div>
                  <div className="mt-1 text-xs text-blue-700">Catches: div-by-zero (L6)</div>
                  <div className="text-xs text-blue-600">Misses: SQL injection, dead code</div>
                </div>
                <div className="rounded-lg border border-purple-200 bg-purple-50 p-3">
                  <div className="text-xs font-semibold text-purple-800">All Passes Combined</div>
                  <div className="mt-1 text-xs text-purple-700">Catches: ALL 3 issues</div>
                  <div className="text-xs text-emerald-600 font-medium">Complete coverage!</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
            <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-navy">Multi-Pass Pipeline</h3>
          <p className="mt-1 text-xs text-slate-600">
            Chain multiple analyses together. Each pass produces findings. The pipeline orchestrates execution and collects results.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
            <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-navy">Unified Findings</h3>
          <p className="mt-1 text-xs text-slate-600">
            A common finding format: severity, location, message, category. Different passes produce the same type of output.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
            <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-navy">Actionable Reports</h3>
          <p className="mt-1 text-xs text-slate-600">
            Group by severity, by pass, or by location. Format for developers (inline) or security teams (summary). The same data, different views.
          </p>
        </div>
      </div>
    </section>
  );
}
