"use client";

import type { AbstractInterpProgram } from "@/lib/abstract-interp-explorer-data";

interface DomainComparisonTabProps {
  program: AbstractInterpProgram;
}

export default function DomainComparisonTab({ program }: DomainComparisonTabProps) {
  return (
    <div className="p-3">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-navy">Domain Comparison</h3>
        <p className="text-xs text-slate-500">
          Same program analyzed under all three domains simultaneously. See where each domain shines — and where it loses precision.
        </p>
      </div>

      {/* Teaching point */}
      <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
        <p className="text-[10px] font-medium text-amber-800">Key Insight</p>
        <p className="mt-1 text-xs text-amber-700">{program.teachingPoint}</p>
      </div>

      {/* Step-by-step comparison table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b-2 border-slate-200 bg-slate-50">
              <th className="px-2 py-2 text-left font-medium text-slate-600">Statement</th>
              <th className="px-2 py-2 text-left font-medium text-slate-600">Var</th>
              <th className="px-2 py-2 text-left font-medium text-purple-700">Sign</th>
              <th className="px-2 py-2 text-left font-medium text-blue-700">Constant</th>
              <th className="px-2 py-2 text-left font-medium text-emerald-700">Interval</th>
            </tr>
          </thead>
          <tbody>
            {program.steps.map((step, si) => (
              step.env.map((v, vi) => (
                <tr
                  key={`${si}-${vi}`}
                  className={`border-b border-slate-100 ${step.warning ? "bg-red-50/50" : step.widened ? "bg-amber-50/50" : ""}`}
                >
                  {vi === 0 && (
                    <td
                      className="px-2 py-1.5 align-top font-mono text-navy"
                      rowSpan={step.env.length}
                    >
                      <div className="flex items-start gap-1">
                        <span className="shrink-0 text-[10px] text-slate-400">L{step.line}</span>
                        <span className="text-[11px]">{step.statement}</span>
                      </div>
                      {step.warning && (
                        <div className="mt-1 rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700">
                          {step.warning}
                        </div>
                      )}
                      {step.widened && (
                        <div className="mt-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                          Widening applied
                        </div>
                      )}
                    </td>
                  )}
                  <td className="px-2 py-1.5 font-mono font-medium text-navy">{v.variable}</td>
                  <td className="px-2 py-1.5 font-mono text-purple-700">{v.sign}</td>
                  <td className="px-2 py-1.5 font-mono text-blue-700">{v.constant}</td>
                  <td className="px-2 py-1.5 font-mono text-emerald-700">{v.interval}</td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-purple-200 bg-purple-50 p-2 text-center">
          <div className="text-[10px] font-semibold text-purple-800">Sign</div>
          <div className="text-[9px] text-purple-600">Coarse but fast</div>
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-center">
          <div className="text-[10px] font-semibold text-blue-800">Constant</div>
          <div className="text-[9px] text-blue-600">Exact constants, loses at merges</div>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-center">
          <div className="text-[10px] font-semibold text-emerald-800">Interval</div>
          <div className="text-[9px] text-emerald-600">Best ranges, needs widening</div>
        </div>
      </div>
    </div>
  );
}
