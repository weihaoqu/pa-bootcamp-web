"use client";

import { DynamicTestResult } from "@/lib/explorer-data";

interface DynamicAnalysisTabProps {
  results: DynamicTestResult[];
  coveragePercent: number;
  onHighlightLine: (lines: number[]) => void;
}

const statusConfig = {
  pass: { bg: "bg-emerald-100", text: "text-emerald-700", label: "PASS" },
  fail: { bg: "bg-red-100", text: "text-red-700", label: "FAIL" },
  error: { bg: "bg-orange-100", text: "text-orange-700", label: "ERROR" },
};

export default function DynamicAnalysisTab({
  results,
  coveragePercent,
  onHighlightLine,
}: DynamicAnalysisTabProps) {
  const passCount = results.filter((r) => r.status === "pass").length;

  return (
    <div className="space-y-3 p-4">
      <div className="mb-2 flex items-center gap-2">
        <h3 className="text-sm font-semibold text-navy">Dynamic Analysis (Testing)</h3>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
          {passCount}/{results.length} passing
        </span>
      </div>

      {/* Coverage bar */}
      <div className="rounded-lg border border-slate-200 bg-white p-3">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-medium text-slate-700">Code Coverage</span>
          <span className="font-mono text-slate-600">{coveragePercent}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all ${
              coveragePercent >= 80 ? "bg-emerald-500" : coveragePercent >= 50 ? "bg-amber-500" : "bg-red-500"
            }`}
            style={{ width: `${coveragePercent}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-slate-400">
          {coveragePercent >= 80
            ? "Good coverage, but coverage alone doesn't guarantee correctness"
            : "Low coverage — many code paths untested"}
        </p>
      </div>

      <p className="text-xs text-slate-500">
        Results from running the code with specific inputs. Click a test to highlight the lines it executed.
      </p>

      {/* Test results table */}
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">Test</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">Status</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">Result</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, i) => {
              const config = statusConfig[result.status];
              return (
                <tr
                  key={i}
                  onClick={() => onHighlightLine(result.executedLines)}
                  className="cursor-pointer border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  <td className="px-3 py-2">
                    <div className="font-medium text-slate-700">{result.name}</div>
                    {result.input && (
                      <div className="font-mono text-xs text-slate-400">Input: {result.input}</div>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${config.bg} ${config.text}`}>
                      {config.label}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-600">
                    {result.actual}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
