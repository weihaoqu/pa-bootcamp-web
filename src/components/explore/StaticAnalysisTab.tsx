"use client";

import { StaticFinding } from "@/lib/explorer-data";

interface StaticAnalysisTabProps {
  findings: StaticFinding[];
  onHighlightLine: (lines: number[]) => void;
}

const severityConfig = {
  error: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", badge: "bg-red-100 text-red-700" },
  warning: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", badge: "bg-amber-100 text-amber-700" },
  info: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", badge: "bg-blue-100 text-blue-700" },
};

export default function StaticAnalysisTab({ findings, onHighlightLine }: StaticAnalysisTabProps) {
  return (
    <div className="space-y-3 p-4">
      <div className="mb-2 flex items-center gap-2">
        <h3 className="text-sm font-semibold text-navy">Static Analysis Findings</h3>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
          {findings.length} finding{findings.length !== 1 ? "s" : ""}
        </span>
      </div>
      <p className="text-xs text-slate-500">
        Found by analyzing the code without running it. Click a finding to highlight the relevant line.
      </p>
      {findings.map((finding, i) => {
        const config = severityConfig[finding.severity];
        return (
          <button
            key={i}
            onClick={() => onHighlightLine([finding.line])}
            className={`block w-full rounded-lg border ${config.border} ${config.bg} p-3 text-left transition-shadow hover:shadow-md`}
          >
            <div className="mb-1 flex items-center gap-2">
              <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${config.badge}`}>
                {finding.severity.toUpperCase()}
              </span>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-slate-600">
                {finding.rule}
              </span>
              <span className="ml-auto text-xs text-slate-400">Line {finding.line}</span>
            </div>
            <p className={`text-sm font-medium ${config.text}`}>{finding.message}</p>
            <p className="mt-1 text-xs text-slate-600">{finding.explanation}</p>
          </button>
        );
      })}
    </div>
  );
}
