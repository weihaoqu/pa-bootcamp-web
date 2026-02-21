"use client";

import { useState } from "react";

const SQLI_CODE = `username = req.body.username   // attacker controls this!
query = "SELECT * FROM users WHERE name='" + username + "'"
db.exec(query)  // 💥 SQL Injection`;

export default function WhyTaintSection() {
  const [showAttack, setShowAttack] = useState(false);

  return (
    <section id="why-taint" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">Why Taint Analysis?</h2>
      <p className="mb-4 text-slate-600">
        Many security vulnerabilities share a common pattern: <strong>untrusted data</strong> from an external source
        (user input, database, network) flows into a <strong>sensitive operation</strong> (SQL query, HTML output,
        command execution) without being properly sanitized. Taint analysis tracks this flow automatically.
      </p>

      <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-sm font-medium text-navy">The Classic SQL Injection</span>
        </div>
        <div className="p-6">
          <p className="mb-4 text-sm text-slate-600">
            What happens when the attacker enters <code className="rounded bg-red-50 px-1 text-red-600">&apos; OR 1=1 --</code> as their username?
          </p>

          <div className="mb-4 rounded-lg bg-slate-900 p-4 font-mono text-sm text-slate-300">
            <pre>{SQLI_CODE}</pre>
          </div>

          <button
            onClick={() => setShowAttack(!showAttack)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              showAttack
                ? "bg-red-100 text-red-700 ring-1 ring-red-300"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {showAttack ? "Hide attack" : "Show the attack"}
          </button>

          {showAttack && (
            <div className="mt-4 space-y-3">
              <div className="rounded-lg bg-slate-900 p-4 font-mono text-sm">
                <div className="text-slate-400">// Attacker inputs: <span className="text-red-400">&apos; OR 1=1 --</span></div>
                <div className="mt-1 text-slate-400">// Resulting query:</div>
                <div className="text-amber-300">SELECT * FROM users WHERE name=&apos;<span className="text-red-400">&apos; OR 1=1 --</span>&apos;</div>
                <div className="mt-2 text-slate-500">// The -- comments out the rest of the query</div>
                <div className="text-slate-500">// OR 1=1 makes the WHERE clause always true</div>
                <div className="text-red-400 mt-1">// Result: returns ALL users from the database!</div>
              </div>
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-xs font-medium text-red-800">How Taint Analysis Catches This</p>
                <p className="mt-1 text-xs text-red-700">
                  Taint analysis marks <code className="rounded bg-red-100 px-1">req.body.username</code> as <strong>Tainted</strong> (source).
                  It tracks the taint through string concatenation into <code className="rounded bg-red-100 px-1">query</code>.
                  When <code className="rounded bg-red-100 px-1">db.exec(query)</code> is reached (sink), it flags:
                  &quot;Tainted value reaches SQL execution — possible SQL injection!&quot;
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h3 className="text-sm font-semibold text-red-800">Sources</h3>
          <p className="mt-1 text-xs text-red-700">
            Where untrusted data enters: user input, URL params, request body, database reads, environment variables.
          </p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <h3 className="text-sm font-semibold text-amber-800">Sinks</h3>
          <p className="mt-1 text-xs text-amber-700">
            Where tainted data is dangerous: SQL queries, HTML output, command execution, file paths.
          </p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <h3 className="text-sm font-semibold text-emerald-800">Sanitizers</h3>
          <p className="mt-1 text-xs text-emerald-700">
            Functions that clean data: parameterized queries, HTML escaping, input validation. They convert Tainted &rarr; Untainted.
          </p>
        </div>
      </div>
    </section>
  );
}
