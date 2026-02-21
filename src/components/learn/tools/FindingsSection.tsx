"use client";

export default function FindingsSection() {
  return (
    <section id="findings" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">Analysis Findings</h2>
      <p className="mb-4 text-slate-600">
        Every analysis pass produces <strong>findings</strong> — structured records describing potential issues.
        A unified finding type lets the pipeline collect results from different passes into one stream.
      </p>

      <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-sm font-medium text-navy">Finding Record Structure</span>
        </div>
        <div className="p-6">
          <div className="rounded-lg bg-slate-900 p-4 font-mono text-sm text-slate-300">
            <pre>{`type finding = {
  id       : string;       (* unique identifier *)
  pass     : string;       (* which analysis pass *)
  severity : severity;     (* Critical|High|Medium|Low|Info *)
  line     : int;          (* source location *)
  message  : string;       (* human-readable description *)
  category : string;       (* e.g. "sql-injection", "div-by-zero" *)
}`}</pre>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-2 text-sm font-semibold text-navy">Severity Levels</h3>
          <div className="space-y-1.5">
            {[
              { level: "Critical", row: "border-red-200 bg-red-50", badge: "bg-red-200 text-red-800", desc: "Exploitable vulnerabilities (SQLi, RCE)" },
              { level: "High", row: "border-orange-200 bg-orange-50", badge: "bg-orange-200 text-orange-800", desc: "Likely crashes or security issues (div-by-zero)" },
              { level: "Medium", row: "border-amber-200 bg-amber-50", badge: "bg-amber-200 text-amber-800", desc: "Code quality issues (unreachable code, weak crypto)" },
              { level: "Low", row: "border-blue-200 bg-blue-50", badge: "bg-blue-200 text-blue-800", desc: "Style issues (unused variables)" },
              { level: "Info", row: "border-slate-200 bg-slate-50", badge: "bg-slate-200 text-slate-800", desc: "Informational notes (hardcoded values)" },
            ].map((s) => (
              <div key={s.level} className={`flex items-center gap-2 rounded border ${s.row} p-2`}>
                <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${s.badge}`}>
                  {s.level}
                </span>
                <span className="text-xs text-slate-600">{s.desc}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-2 text-sm font-semibold text-navy">Categories</h3>
          <p className="mb-3 text-xs text-slate-600">
            Categories group findings by <em>what kind</em> of issue they represent, regardless of which pass found them.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[
              "sql-injection", "div-by-zero", "xss", "unused-variable",
              "unreachable", "path-traversal", "weak-crypto", "null-deref",
            ].map((cat) => (
              <span key={cat} className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-mono text-slate-600">
                {cat}
              </span>
            ))}
          </div>
          <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-2">
            <p className="text-[10px] text-blue-700">
              Multiple passes can produce findings in the same category — e.g., both taint analysis and
              constant propagation might flag injection risks. Deduplication is part of the reporting layer.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
