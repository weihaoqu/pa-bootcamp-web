"use client";

import type { PipelineScenario } from "@/lib/tools-explorer-data";
import { PASS_COLORS, SEVERITY_COLORS } from "@/lib/tools-explorer-data";

interface PassComparisonTabProps {
  scenario: PipelineScenario;
}

export default function PassComparisonTab({ scenario }: PassComparisonTabProps) {
  const totalTime = scenario.passes.reduce((sum, p) => sum + p.timeMs, 0);
  const parallelTime = Math.max(...scenario.passes.map((p) => p.timeMs));

  return (
    <div className="p-4">
      <h3 className="mb-1 text-sm font-semibold text-navy">Pass Comparison</h3>
      <p className="mb-4 text-xs text-slate-500">
        Compare what each analysis pass contributes to the overall picture. See time costs and findings per pass.
      </p>

      {/* Time comparison */}
      <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3">
        <div className="mb-2 text-[10px] font-medium text-slate-400">Execution Time</div>
        <div className="space-y-2">
          {scenario.passes.map((pass) => {
            const pct = (pass.timeMs / totalTime) * 100;
            const colorClass = PASS_COLORS[pass.kind] ?? "text-slate-700 bg-slate-200";
            const bgColor = colorClass.split(" ").find((c) => c.startsWith("bg-")) ?? "bg-slate-200";
            return (
              <div key={pass.id} className="flex items-center gap-2">
                <span className="w-28 shrink-0 text-[10px] font-medium text-navy">{pass.name}</span>
                <div className="flex-1 rounded-full bg-slate-100 h-4 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${bgColor} transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-12 shrink-0 text-right text-[10px] font-mono text-slate-500">{pass.timeMs}ms</span>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex gap-4 text-[10px] text-slate-500">
          <span>Sequential: <strong className="text-navy">{totalTime}ms</strong></span>
          <span>Parallel: <strong className="text-navy">{parallelTime}ms</strong></span>
          <span>Speedup: <strong className="text-emerald-700">{(totalTime / parallelTime).toFixed(1)}x</strong></span>
        </div>
      </div>

      {/* Per-pass breakdown */}
      <div className="space-y-3">
        {scenario.passes.map((pass) => {
          const colorClass = PASS_COLORS[pass.kind] ?? "text-slate-700 bg-slate-50 border-slate-200";
          return (
            <div key={pass.id} className={`rounded-xl border p-3 ${colorClass}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold">{pass.name}</div>
                  <div className="text-[10px] opacity-75">{pass.description}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{pass.findings.length}</div>
                  <div className="text-[9px]">findings</div>
                </div>
              </div>
              {pass.findings.length > 0 && (
                <div className="mt-2 space-y-1">
                  {pass.findings.map((f) => {
                    const sevColors = SEVERITY_COLORS[f.severity];
                    return (
                      <div key={f.id} className="flex items-center gap-1.5 rounded bg-white/60 px-2 py-1">
                        <span className={`rounded-full px-1.5 py-0.5 text-[8px] font-bold ${sevColors.bg} ${sevColors.text}`}>
                          {f.severity}
                        </span>
                        <span className="text-[10px]">L{f.line}: {f.message}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              {pass.findings.length === 0 && (
                <div className="mt-2 rounded bg-white/60 px-2 py-1 text-[10px] text-emerald-700">
                  No issues found
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary insight */}
      <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
        <p className="text-[10px] font-medium text-blue-800">Why Multiple Passes?</p>
        <p className="mt-1 text-xs text-blue-700">
          Each pass is a specialist: taint analysis finds injections, sign analysis finds numeric errors,
          live variables finds dead code. No single pass catches everything. A real analysis tool
          composes multiple passes into a unified pipeline — exactly what you&apos;ll build in this module.
        </p>
      </div>
    </div>
  );
}
