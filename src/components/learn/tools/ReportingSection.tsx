"use client";

import { useState } from "react";

const SAMPLE_FINDINGS = [
  { severity: "Critical", line: 5, pass: "Taint", message: "SQL Injection: tainted query reaches db.exec()", category: "sql-injection" },
  { severity: "High", line: 6, pass: "Sign", message: "Division by zero: divisor is Zero", category: "div-by-zero" },
  { severity: "Medium", line: 3, pass: "Constant", message: "Weak hash: md5() is deprecated", category: "weak-crypto" },
  { severity: "Low", line: 7, pass: "LiveVars", message: "Unused variable: 'unused'", category: "unused-variable" },
];

type ViewMode = "severity" | "pass" | "json";

export default function ReportingSection() {
  const [viewMode, setViewMode] = useState<ViewMode>("severity");

  const severityColor: Record<string, string> = {
    Critical: "bg-red-100 text-red-800 border-red-200",
    High: "bg-orange-100 text-orange-800 border-orange-200",
    Medium: "bg-amber-100 text-amber-800 border-amber-200",
    Low: "bg-blue-100 text-blue-800 border-blue-200",
  };

  return (
    <section id="reporting" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">Analysis Reporting</h2>
      <p className="mb-4 text-slate-600">
        The report is the user-facing output of your tool. The same findings can be presented in multiple
        formats: grouped by severity for triage, by pass for understanding, or as structured data (JSON/SARIF)
        for integration with CI/CD tools.
      </p>

      <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-medium text-navy">Report Formats</span>
          <div className="flex gap-1">
            {(["severity", "pass", "json"] as ViewMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors ${
                  viewMode === m ? "bg-navy text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {m === "json" ? "JSON" : `By ${m}`}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6">
          {viewMode === "severity" && (
            <div className="space-y-2">
              {["Critical", "High", "Medium", "Low"].map((sev) => {
                const findings = SAMPLE_FINDINGS.filter((f) => f.severity === sev);
                if (findings.length === 0) return null;
                return (
                  <div key={sev}>
                    <div className="mb-1 text-xs font-semibold text-navy">{sev} ({findings.length})</div>
                    {findings.map((f, i) => (
                      <div key={i} className={`rounded-lg border ${severityColor[f.severity]} p-2 mb-1`}>
                        <span className="font-mono text-[10px]">L{f.line}</span>
                        <span className="ml-2 text-xs">{f.message}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {viewMode === "pass" && (
            <div className="space-y-2">
              {["Taint", "Sign", "Constant", "LiveVars"].map((pass) => {
                const findings = SAMPLE_FINDINGS.filter((f) => f.pass === pass);
                if (findings.length === 0) return null;
                return (
                  <div key={pass}>
                    <div className="mb-1 text-xs font-semibold text-navy">{pass} Analysis ({findings.length})</div>
                    {findings.map((f, i) => (
                      <div key={i} className={`rounded-lg border ${severityColor[f.severity]} p-2 mb-1`}>
                        <span className={`rounded-full px-1.5 py-0.5 text-[8px] font-bold ${severityColor[f.severity]}`}>
                          {f.severity}
                        </span>
                        <span className="ml-2 font-mono text-[10px]">L{f.line}</span>
                        <span className="ml-1 text-xs">{f.message}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {viewMode === "json" && (
            <div className="rounded-lg bg-slate-900 p-4 font-mono text-xs text-slate-300 overflow-x-auto">
              <pre>{JSON.stringify({
                summary: { total: 4, critical: 1, high: 1, medium: 1, low: 1 },
                findings: SAMPLE_FINDINGS.map((f) => ({
                  severity: f.severity.toLowerCase(),
                  line: f.line,
                  pass: f.pass.toLowerCase(),
                  category: f.category,
                  message: f.message,
                })),
              }, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h3 className="text-sm font-semibold text-blue-800">Real-World Integration</h3>
        <p className="mt-1 text-xs text-blue-700">
          Tools like GitHub Code Scanning use SARIF (Static Analysis Results Interchange Format) — a JSON
          standard for analysis results. Your reporter module converts internal findings into this kind of
          structured output, making your tool compatible with the broader ecosystem.
        </p>
      </div>
    </section>
  );
}
