"use client";

import { useState } from "react";

interface Tool {
  name: string;
  type: "static" | "dynamic" | "hybrid";
  description: string;
  output: string;
}

const TOOLS: Tool[] = [
  {
    name: "ESLint",
    type: "static",
    description: "JavaScript linter — pattern-based static analysis. Fast, unsound, but catches common mistakes.",
    output: `$ eslint app.js

  3:17  error    'password' is assigned a value but never used  no-unused-vars
  7:5   warning  Unexpected console statement                   no-console
  12:22 error    'getUserById' is not defined                   no-undef
  15:3  warning  'result' is already defined                    no-redeclare
  18:10 error    Expected '===' and instead saw '=='            eqeqeq

✖ 5 problems (3 errors, 2 warnings)
  2 errors and 1 warning potentially fixable with --fix`,
  },
  {
    name: "Valgrind (Memcheck)",
    type: "dynamic",
    description: "Memory error detector for C/C++. Runs the actual program and instruments memory accesses at runtime.",
    output: `$ valgrind --leak-check=full ./my_program

==12345== Invalid read of size 4
==12345==    at 0x4005F2: process_data (main.c:23)
==12345==    by 0x400637: main (main.c:31)
==12345==  Address 0x5204048 is 8 bytes after a block of size 40 alloc'd
==12345==    at 0x4C2AB80: malloc (vg_replace_malloc.c:339)
==12345==    by 0x4005C2: process_data (main.c:20)
==12345==
==12345== HEAP SUMMARY:
==12345==     in use at exit: 72 bytes in 2 blocks
==12345==   total heap usage: 5 allocs, 3 frees, 1,112 bytes allocated
==12345==
==12345== 40 bytes in 1 block are definitely lost
==12345==    at 0x4C2AB80: malloc (vg_replace_malloc.c:339)
==12345==    by 0x4005C2: process_data (main.c:20)`,
  },
  {
    name: "SonarQube",
    type: "hybrid",
    description: "Code quality platform combining static analysis rules, test coverage metrics, and security vulnerability detection.",
    output: `SonarQube Analysis Report
═══════════════════════════════════════

Quality Gate: FAILED ✗

  Bugs:          3  (A: 0, B: 1, C: 2)
  Vulnerabilities: 2  (Critical: 1, Major: 1)
  Code Smells:   12 (Major: 3, Minor: 9)
  Coverage:      62.4%  (target: 80%)
  Duplications:  4.2%

Critical Issues:
─────────────────
[VULNERABILITY] SQL Injection in UserDao.java:45
  String query = "SELECT * FROM users WHERE id = " + userId;
  → Use parameterized queries

[BUG] Null dereference in OrderService.java:78
  getOrder() may return null, .getTotal() would throw NPE
  → Add null check before access

[BUG] Resource leak in FileProcessor.java:23
  InputStream opened but not closed in all paths
  → Use try-with-resources`,
  },
];

const typeColors = {
  static: { bg: "bg-indigo-100", text: "text-indigo-700" },
  dynamic: { bg: "bg-emerald-100", text: "text-emerald-700" },
  hybrid: { bg: "bg-purple-100", text: "text-purple-700" },
};

export default function RealToolsSection() {
  const [activeTool, setActiveTool] = useState(0);
  const tool = TOOLS[activeTool];
  const colors = typeColors[tool.type];

  return (
    <section id="real-tools" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">Real-World Tools</h2>
      <p className="mb-4 text-slate-600">
        These tools use the concepts you&apos;re learning in this course. Here&apos;s what their output actually looks like.
      </p>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Tool selector */}
        <div className="flex gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
          {TOOLS.map((t, i) => (
            <button
              key={i}
              onClick={() => setActiveTool(i)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                i === activeTool
                  ? "bg-navy text-white"
                  : "bg-white text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        <div className="p-6">
          <div className="mb-3 flex items-center gap-2">
            <h3 className="text-lg font-semibold text-navy">{tool.name}</h3>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
              {tool.type}
            </span>
          </div>
          <p className="mb-4 text-sm text-slate-600">{tool.description}</p>

          {/* Terminal-style output */}
          <div className="overflow-x-auto rounded-lg bg-slate-900 p-4">
            <pre className="text-sm text-slate-100 whitespace-pre">
              <code>{tool.output}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
