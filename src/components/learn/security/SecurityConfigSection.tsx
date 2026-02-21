"use client";

import { useState } from "react";
import { DEFAULT_SOURCES, DEFAULT_SINKS, DEFAULT_SANITIZERS } from "@/lib/security-explorer-data";

export default function SecurityConfigSection() {
  const [activeTab, setActiveTab] = useState<"sources" | "sinks" | "sanitizers">("sources");

  return (
    <section id="security-config" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">Security Configuration</h2>
      <p className="mb-4 text-slate-600">
        A taint analyzer needs to know <em>what</em> to track. The <strong>security configuration</strong> defines
        three sets: which functions are <span className="font-semibold text-red-600">sources</span> of tainted data,
        which are <span className="font-semibold text-amber-600">sinks</span> where tainted data is dangerous,
        and which are <span className="font-semibold text-emerald-600">sanitizers</span> that make data safe.
      </p>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          {[
            { id: "sources" as const, label: "Sources", active: "border-b-2 border-red-500 bg-white text-red-700" },
            { id: "sinks" as const, label: "Sinks", active: "border-b-2 border-amber-500 bg-white text-amber-700" },
            { id: "sanitizers" as const, label: "Sanitizers", active: "border-b-2 border-emerald-500 bg-white text-emerald-700" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2.5 text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? tab.active
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "sources" && (
            <div>
              <p className="mb-4 text-sm text-slate-600">
                Sources are functions or locations where untrusted data enters the program.
                Any value returned from a source is marked <strong className="text-red-600">Tainted</strong>.
              </p>
              <div className="space-y-3">
                {DEFAULT_SOURCES.map((s) => (
                  <div key={s.name} className="rounded-lg border border-red-200 bg-red-50 p-3">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-red-200 px-2 py-0.5 text-xs font-bold text-red-800">{s.name}</span>
                    </div>
                    <p className="mt-1 text-xs text-red-700">{s.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {s.examples.map((ex) => (
                        <code key={ex} className="rounded bg-white px-1.5 py-0.5 text-[10px] font-mono text-red-600 ring-1 ring-red-200">{ex}</code>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "sinks" && (
            <div>
              <p className="mb-4 text-sm text-slate-600">
                Sinks are security-sensitive operations. If a <strong>Tainted</strong> value reaches a sink
                without sanitization, a vulnerability is reported.
              </p>
              <div className="space-y-3">
                {DEFAULT_SINKS.map((s) => (
                  <div key={s.name} className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-amber-200 px-2 py-0.5 text-xs font-bold text-amber-800">{s.name}</span>
                      <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-medium text-red-700">{s.vulnType}</span>
                    </div>
                    <p className="mt-1 text-xs text-amber-700">{s.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {s.examples.map((ex) => (
                        <code key={ex} className="rounded bg-white px-1.5 py-0.5 text-[10px] font-mono text-amber-600 ring-1 ring-amber-200">{ex}</code>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "sanitizers" && (
            <div>
              <p className="mb-4 text-sm text-slate-600">
                Sanitizers are functions that transform data to make it safe for a specific context.
                They convert <strong className="text-red-600">Tainted</strong> &rarr;{" "}
                <strong className="text-emerald-600">Untainted</strong>.
              </p>
              <div className="space-y-3">
                {DEFAULT_SANITIZERS.map((s) => (
                  <div key={s.name} className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-emerald-200 px-2 py-0.5 text-xs font-bold text-emerald-800">{s.name}</span>
                      <span className="text-[10px] text-emerald-600">fixes: {s.sanitizes}</span>
                    </div>
                    <p className="mt-1 text-xs text-emerald-700">{s.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-xs text-amber-700">
                  <strong>Important:</strong> Sanitizers are context-specific! <code className="bg-amber-100 px-1 rounded">escape_html()</code> fixes
                  XSS but NOT SQL injection. Using the wrong sanitizer gives a false sense of security.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
