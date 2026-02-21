"use client";

import { useState } from "react";

export default function InfoFlowSection() {
  const [showImplicit, setShowImplicit] = useState(false);

  return (
    <section id="info-flow" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">Information Flow</h2>
      <p className="mb-4 text-slate-600">
        Taint analysis tracks <strong>explicit flows</strong> (data assignments). But information can also leak
        through <strong>implicit flows</strong> — where the control structure reveals secrets even without
        direct data copying.
      </p>

      {/* Explicit vs Implicit */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-blue-200 bg-blue-50">
          <div className="border-b border-blue-200 bg-blue-100 px-4 py-2">
            <span className="text-xs font-semibold text-blue-800">Explicit Flow</span>
          </div>
          <div className="p-4">
            <div className="mb-3 rounded-lg bg-slate-900 p-3 font-mono text-xs text-slate-300">
              <pre>{`secret = get_password()
leak = secret  // direct copy!`}</pre>
            </div>
            <p className="text-xs text-blue-700">
              Data flows directly from <code className="bg-blue-100 px-1 rounded">secret</code> to{" "}
              <code className="bg-blue-100 px-1 rounded">leak</code> via assignment. Easy to track — just follow
              the data dependencies.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-purple-200 bg-purple-50">
          <div className="border-b border-purple-200 bg-purple-100 px-4 py-2">
            <span className="text-xs font-semibold text-purple-800">Implicit Flow</span>
          </div>
          <div className="p-4">
            <div className="mb-3 rounded-lg bg-slate-900 p-3 font-mono text-xs text-slate-300">
              <pre>{`secret = get_password()
leak = 0
if secret > 0 then
  leak = 1`}</pre>
            </div>
            <p className="text-xs text-purple-700">
              No direct copy! But <code className="bg-purple-100 px-1 rounded">leak</code>&apos;s value reveals whether{" "}
              <code className="bg-purple-100 px-1 rounded">secret &gt; 0</code>. Information leaks through the branch.
            </p>
          </div>
        </div>
      </div>

      {/* Deep dive into implicit */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-medium text-navy">How Implicit Flows Leak Secrets</span>
          <button
            onClick={() => setShowImplicit(!showImplicit)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              showImplicit ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {showImplicit ? "Hide" : "Show example"}
          </button>
        </div>
        {showImplicit && (
          <div className="p-6">
            <div className="mb-4 rounded-lg bg-slate-900 p-4 font-mono text-sm text-slate-300">
              <pre>{`// Bit-by-bit extraction attack
secret = get_pin()      // e.g., 1234
result = ""

if (secret / 1000) % 10 == 1 then
  result = result + "1"
else if (secret / 1000) % 10 == 2 then
  result = result + "2"
// ... one branch per digit

// After enough branches, result = "1234"
// Even though secret was never directly copied!`}</pre>
            </div>

            <div className="mb-3 space-y-2">
              <div className="rounded-lg border border-purple-200 bg-purple-50 p-3">
                <p className="text-xs font-medium text-purple-800">The Attack Pattern</p>
                <p className="mt-1 text-xs text-purple-700">
                  An attacker can reconstruct the secret one bit at a time using only branch decisions.
                  Each <code className="bg-purple-100 px-1 rounded">if</code> reveals partial information.
                  After enough branches, the entire secret is reconstructed in{" "}
                  <code className="bg-purple-100 px-1 rounded">result</code>.
                </p>
              </div>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                <p className="text-xs font-medium text-blue-800">How Taint Analysis Handles This</p>
                <p className="mt-1 text-xs text-blue-700">
                  When a branch condition is <strong className="text-red-600">Tainted</strong>, all assignments
                  inside that branch are treated as implicitly tainted. This is tracked via a{" "}
                  <strong>program counter taint</strong> (pc_taint): the taint level of the current control context.
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-slate-900 p-3 font-mono text-xs text-slate-300">
              <pre>{`Transfer rule for assignment inside tainted branch:
  taint(x) = join(expr_taint, pc_taint)

If pc_taint = Tainted (inside a tainted branch):
  Even "x = 0" → taint(x) = join(Untainted, Tainted) = Tainted`}</pre>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
