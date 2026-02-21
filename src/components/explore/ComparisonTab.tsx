"use client";

import { ComparisonItem } from "@/lib/explorer-data";

interface ComparisonTabProps {
  items: ComparisonItem[];
}

export default function ComparisonTab({ items }: ComparisonTabProps) {
  const staticOnly = items.filter((i) => i.category === "static-only");
  const both = items.filter((i) => i.category === "both");
  const dynamicOnly = items.filter((i) => i.category === "dynamic-only");

  return (
    <div className="p-4">
      <h3 className="mb-3 text-sm font-semibold text-navy">Static vs Dynamic Comparison</h3>
      <p className="mb-4 text-xs text-slate-500">
        What each approach catches on this snippet — and what it misses.
      </p>

      {/* Venn diagram */}
      <div className="mb-6 flex justify-center">
        <svg viewBox="0 0 400 200" className="h-40 w-full max-w-md">
          {/* Static circle */}
          <circle cx="150" cy="100" r="80" fill="rgba(99, 102, 241, 0.15)" stroke="rgb(99, 102, 241)" strokeWidth="2" />
          {/* Dynamic circle */}
          <circle cx="250" cy="100" r="80" fill="rgba(16, 185, 129, 0.15)" stroke="rgb(16, 185, 129)" strokeWidth="2" />
          {/* Labels */}
          <text x="100" y="55" textAnchor="middle" className="text-xs font-semibold" fill="rgb(79, 70, 229)">Static Only</text>
          <text x="200" y="55" textAnchor="middle" className="text-xs font-semibold" fill="rgb(71, 85, 105)">Both</text>
          <text x="300" y="55" textAnchor="middle" className="text-xs font-semibold" fill="rgb(5, 150, 105)">Dynamic Only</text>
          {/* Counts */}
          <text x="110" y="105" textAnchor="middle" className="text-2xl font-bold" fill="rgb(79, 70, 229)">{staticOnly.length}</text>
          <text x="200" y="105" textAnchor="middle" className="text-2xl font-bold" fill="rgb(71, 85, 105)">{both.length}</text>
          <text x="290" y="105" textAnchor="middle" className="text-2xl font-bold" fill="rgb(5, 150, 105)">{dynamicOnly.length}</text>
        </svg>
      </div>

      {/* Three columns */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-indigo-700">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-indigo-400" />
            Only Static Catches
          </h4>
          <ul className="space-y-1.5">
            {staticOnly.map((item, i) => (
              <li key={i} className="rounded border border-indigo-100 bg-indigo-50 p-2 text-xs text-indigo-800">
                {item.description}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-slate-400" />
            Both Catch
          </h4>
          <ul className="space-y-1.5">
            {both.map((item, i) => (
              <li key={i} className="rounded border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700">
                {item.description}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" />
            Only Dynamic Catches
          </h4>
          <ul className="space-y-1.5">
            {dynamicOnly.map((item, i) => (
              <li key={i} className="rounded border border-emerald-100 bg-emerald-50 p-2 text-xs text-emerald-700">
                {item.description}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Takeaway */}
      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-medium text-slate-700">Key Takeaway</p>
        <p className="mt-1 text-xs text-slate-600">
          Neither approach alone catches everything. Static analysis finds bugs without running code
          (including in untested paths), while dynamic analysis reveals actual runtime behavior
          and exact error messages. Real-world tools combine both.
        </p>
      </div>
    </div>
  );
}
