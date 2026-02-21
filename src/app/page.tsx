import Link from "next/link";
import { MODULES, LABS } from "@/lib/modules";
import ConceptMap from "@/components/content/ConceptMap";
import RepoSubmitCard from "@/components/RepoSubmitCard";

export default function Home() {
  const totalExercises = MODULES.reduce(
    (sum, m) => sum + m.exercises.length,
    0
  );
  const totalTests = MODULES.reduce((sum, m) => sum + m.testCount, 0);

  return (
    <div className="mx-auto max-w-4xl">
      {/* Hero */}
      <div className="mb-12 rounded-xl bg-gradient-to-br from-navy to-navy-dark p-10 text-white shadow-lg">
        <h1 className="mb-3 text-4xl font-bold tracking-tight">
          Program Analysis <span className="text-accent-red">Bootcamp</span>
        </h1>
        <p className="mb-6 max-w-2xl text-lg text-white/80">
          A hands-on bootcamp for learning program analysis techniques in OCaml:
          ASTs, control flow graphs, dataflow analysis, abstract interpretation,
          and security analysis.
        </p>
        <div className="flex gap-4">
          <Link
            href="/modules"
            className="rounded-lg bg-accent-red px-5 py-2.5 font-medium text-white transition-colors hover:bg-accent-red/90"
          >
            Start Learning
          </Link>
          <Link
            href="/syllabus"
            className="rounded-lg bg-white/10 px-5 py-2.5 font-medium text-white transition-colors hover:bg-white/20"
          >
            View Syllabus
          </Link>
        </div>
      </div>

      {/* Repo submit (students only) */}
      <RepoSubmitCard />

      {/* How it works */}
      <div className="mb-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-navy">How This Bootcamp Works</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-navy">Read &amp; Learn Here</h3>
              <p className="text-xs text-slate-500">
                Browse slides, instructions, starter code, and exercise hints in this web app.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-green-100">
              <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-navy">Code Locally</h3>
              <p className="text-xs text-slate-500">
                Clone the{" "}
                <a
                  href="https://github.com/weihaoqu/program-analysis-bootcamp-student"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-red underline"
                >
                  GitHub repo
                </a>
                {" "}and edit starter files in VS Code, Vim, or your preferred editor.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100">
              <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-navy">Test with Dune</h3>
              <p className="text-xs text-slate-500">
                Run <code className="rounded bg-slate-100 px-1 text-xs">dune runtest</code> in
                your terminal to check your solutions against the test suite.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-10 grid grid-cols-4 gap-4">
        {[
          { label: "Modules", value: MODULES.length },
          { label: "Exercises", value: totalExercises },
          { label: "Labs", value: LABS.length },
          { label: "Tests", value: `${totalTests}+` },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-slate-200 bg-white p-4 text-center shadow-sm"
          >
            <div className="text-2xl font-bold text-navy">{stat.value}</div>
            <div className="text-sm text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Concept Map */}
      <ConceptMap />

      {/* Module Preview */}
      <h2 className="mb-4 text-xl font-bold text-navy">Course Modules</h2>
      <div className="space-y-3">
        {MODULES.map((mod) => (
          <Link
            key={mod.slug}
            href={`/modules/${mod.slug}`}
            className="group flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-accent-red/30 hover:shadow-md"
          >
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-navy text-lg font-bold text-white">
              {mod.index}
            </span>
            <div className="flex-1">
              <h3 className="font-semibold text-navy group-hover:text-accent-red">
                {mod.name}
              </h3>
              <p className="text-sm text-slate-500">{mod.description}</p>
            </div>
            <div className="flex-shrink-0 text-right text-sm text-slate-400">
              <div>{mod.exercises.length} exercises</div>
              {mod.testCount > 0 && <div>{mod.testCount} tests</div>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
