"use client";

import { useState } from "react";
import WatchOutCallout from "../WatchOutCallout";

export default function PipelineSection() {
  const [showConfig, setShowConfig] = useState(false);

  return (
    <section id="pipeline" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">Configurable Pipelines</h2>
      <p className="mb-4 text-slate-600">
        A pipeline defines <em>which</em> passes to run, in <em>what order</em>, with <em>what options</em>.
        Think of it like a build system for analysis: each pass is a task, and the pipeline orchestrates them.
      </p>

      <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-sm font-medium text-navy">Pipeline Architecture</span>
        </div>
        <div className="p-6">
          <div className="mb-4 rounded-lg bg-slate-900 p-4 font-mono text-sm text-slate-300">
            <pre className="text-center">{`┌──────────────┐
│  Source Code  │
└──────┬───────┘
       │
       ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Pass 1:     │    │  Pass 2:     │    │  Pass 3:     │
│  Taint       │───▶│  Sign        │───▶│  Dead Code   │
│  Analysis    │    │  Analysis    │    │  Detector    │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────┐
│              Finding Aggregator                      │
│  Collect, deduplicate, sort by severity              │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
              ┌──────────────┐
              │    Report    │
              └──────────────┘`}</pre>
          </div>

          <button
            onClick={() => setShowConfig(!showConfig)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              showConfig ? "bg-navy text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {showConfig ? "Hide config" : "Show pipeline configuration"}
          </button>

          {showConfig && (
            <div className="mt-4">
              <div className="rounded-lg bg-slate-900 p-4 font-mono text-sm text-slate-300">
                <pre>{`type pipeline_config = {
  passes         : pass list;       (* ordered list of passes *)
  parallel       : bool;            (* run passes in parallel? *)
  stop_on_critical : bool;          (* halt on Critical finding? *)
}

(* Example configurations *)
let quick_scan = {
  passes = [taint_pass; sign_pass];
  parallel = true;
  stop_on_critical = true;
}

let full_audit = {
  passes = [taint_pass; sign_pass; constant_pass;
            dead_code_pass; interval_pass];
  parallel = true;
  stop_on_critical = false;
}`}</pre>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <h3 className="text-sm font-semibold text-emerald-800">Parallel Execution</h3>
          <p className="mt-1 text-xs text-emerald-700">
            Independent passes (taint vs sign) can run in parallel for speed. Dependent passes (e.g., inlining
            before interprocedural) must run sequentially. The pipeline respects these constraints.
          </p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <h3 className="text-sm font-semibold text-amber-800">Stop on Critical</h3>
          <p className="mt-1 text-xs text-amber-700">
            In CI/CD, you might want to stop the pipeline immediately when a Critical finding is detected —
            no point running more passes if deployment is already blocked. This is a configurable option.
          </p>
        </div>
      </div>

      <WatchOutCallout items={[
        "Finding deduplication matters — if both taint and constant propagation flag the same line, report it once, not twice. Use (line, category) as a dedup key.",
        "Severity comparison should use a defined ordering (Critical > High > Medium > Low > Info), not string comparison — alphabetically 'Critical' < 'High' which is wrong.",
        "When implementing stop_on_critical, check AFTER each pass completes, not mid-pass. Stopping mid-analysis can leave findings in an inconsistent state.",
      ]} />
    </section>
  );
}
