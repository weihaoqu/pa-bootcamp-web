"use client";

import { useState } from "react";
import type { PipelineScenario, Severity } from "@/lib/tools-explorer-data";
import { SEVERITY_COLORS } from "@/lib/tools-explorer-data";

interface FindingsTabProps {
  scenario: PipelineScenario;
}

type GroupBy = "severity" | "pass" | "line";

export default function FindingsTab({ scenario }: FindingsTabProps) {
  const [groupBy, setGroupBy] = useState<GroupBy>("severity");

  const allFindings = scenario.passes.flatMap((p) => p.findings);
  const hasFindings = allFindings.length > 0;

  const severityOrder: Severity[] = ["Critical", "High", "Medium", "Low", "Info"];

  const grouped = (() => {
    if (groupBy === "severity") {
      return severityOrder
        .map((sev) => ({ label: sev, findings: allFindings.filter((f) => f.severity === sev) }))
        .filter((g) => g.findings.length > 0);
    }
    if (groupBy === "pass") {
      return scenario.passes
        .map((p) => ({ label: p.name, findings: p.findings }))
        .filter((g) => g.findings.length > 0);
    }
    // by line
    const lines = [...new Set(allFindings.map((f) => f.line))].sort((a, b) => a - b);
    return lines.map((line) => ({ label: `Line ${line}`, findings: allFindings.filter((f) => f.line === line) }));
  })();

  return (
    <div className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-navy">Analysis Findings</h3>
          <p className="text-xs text-slate-500">
            {hasFindings
              ? `${allFindings.length} finding${allFindings.length !== 1 ? "s" : ""} from ${scenario.passes.length} passes`
              : "No findings — clean code!"}
          </p>
        </div>
        {hasFindings && (
          <div className="flex gap-1">
            {(["severity", "pass", "line"] as GroupBy[]).map((g) => (
              <button
                key={g}
                onClick={() => setGroupBy(g)}
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${
                  groupBy === g ? "bg-navy text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                By {g}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Summary bar */}
      {hasFindings && (
        <div className="mb-4 flex gap-2">
          {severityOrder.map((sev) => {
            const count = scenario.report.bySeverity[sev];
            if (count === 0) return null;
            const colors = SEVERITY_COLORS[sev];
            return (
              <div key={sev} className={`rounded-lg border ${colors.border} ${colors.bg} px-2.5 py-1`}>
                <span className={`text-lg font-bold ${colors.text}`}>{count}</span>
                <span className={`ml-1 text-[10px] ${colors.text}`}>{sev}</span>
              </div>
            );
          })}
        </div>
      )}

      {!hasFindings && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <div className="text-2xl">&#10003;</div>
          <div className="mt-1 text-sm font-semibold text-emerald-800">All Clear</div>
          <p className="mt-1 text-xs text-emerald-600">{scenario.teachingPoint}</p>
        </div>
      )}

      {/* Grouped findings */}
      {grouped.map((group) => (
        <div key={group.label} className="mb-3">
          <div className="mb-1.5 text-xs font-semibold text-navy">{group.label}</div>
          <div className="space-y-1.5">
            {group.findings.map((f) => {
              const colors = SEVERITY_COLORS[f.severity];
              return (
                <div key={f.id} className={`rounded-lg border ${colors.border} ${colors.bg} p-2.5`}>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${colors.text} bg-white/60`}>
                      {f.severity}
                    </span>
                    <span className="text-xs font-medium text-navy">Line {f.line}</span>
                    <span className="rounded bg-white/60 px-1 text-[9px] text-slate-500">{f.pass}</span>
                    <span className="rounded bg-white/60 px-1 text-[9px] text-slate-500">{f.category}</span>
                  </div>
                  <p className={`mt-1 text-xs ${colors.text}`}>{f.message}</p>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Teaching point */}
      {hasFindings && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-[10px] font-medium text-amber-800">Key Insight</p>
          <p className="mt-1 text-xs text-amber-700">{scenario.teachingPoint}</p>
        </div>
      )}
    </div>
  );
}
