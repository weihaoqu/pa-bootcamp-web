import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MODULES } from "@/lib/modules";
import { getModuleReadme } from "@/lib/content";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import MarkdownRenderer from "@/components/content/MarkdownRenderer";
import ExerciseGrid from "@/components/content/ExerciseGrid";

export function generateStaticParams() {
  return MODULES.map((m) => ({ moduleSlug: m.slug }));
}

interface Props {
  params: Promise<{ moduleSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { moduleSlug } = await params;
  const mod = MODULES.find((m) => m.slug === moduleSlug);
  return { title: mod ? `${mod.name} — PA Bootcamp` : "Module — PA Bootcamp" };
}

export default async function ModulePage({ params }: Props) {
  const { moduleSlug } = await params;
  const mod = MODULES.find((m) => m.slug === moduleSlug);
  if (!mod) notFound();

  const readme = getModuleReadme(moduleSlug);

  return (
    <div className="mx-auto max-w-4xl">
      <Breadcrumbs
        items={[
          { label: "Modules", href: "/modules" },
          { label: mod.name },
        ]}
      />

      {/* Module header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="mb-1 text-sm font-medium text-accent-red">
            Module {mod.index}
          </div>
          <h1 className="text-3xl font-bold text-navy">{mod.name}</h1>
        </div>
        <Link
          href={`/modules/${moduleSlug}/slides`}
          className="rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-navy-dark"
        >
          View Slides
        </Link>
      </div>

      {/* Feature cards for Learn / Explore pages */}
      {(mod.hasLearn || mod.hasExplore) && (
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          {mod.hasLearn && (
            <Link
              href={`/modules/${moduleSlug}/learn`}
              className="group rounded-xl border-2 border-amber-200 bg-amber-50 p-5 transition-all hover:border-amber-300 hover:shadow-md"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-200 text-lg">
                  <svg className="h-5 w-5 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </span>
                <h3 className="text-lg font-semibold text-amber-900">
                  {moduleSlug === "module6-tools-integration"
                    ? "Building Analysis Tools"
                    : moduleSlug === "module5-security-analysis"
                      ? "Understanding Security Analysis"
                      : moduleSlug === "module4-abstract-interpretation"
                        ? "Understanding Abstract Interpretation"
                        : moduleSlug === "module3-static-analysis"
                          ? "Understanding Static Analysis"
                          : moduleSlug === "module2-ast"
                            ? "Understanding ASTs"
                            : moduleSlug === "module0-warmup"
                              ? "OCaml Crash Course"
                              : "Before You Code"}
                </h3>
              </div>
              <p className="text-sm text-amber-800">
                {moduleSlug === "module6-tools-integration"
                  ? "Interactive walkthrough of analysis findings, multi-pass pipelines, dead code detection, and reporting."
                  : moduleSlug === "module5-security-analysis"
                    ? "Interactive walkthrough of taint analysis, information flow, sources/sinks/sanitizers, and vulnerability detection."
                    : moduleSlug === "module4-abstract-interpretation"
                      ? "Interactive walkthrough of sign domains, constant propagation, intervals, widening, and Galois connections."
                      : moduleSlug === "module3-static-analysis"
                        ? "Interactive walkthrough of CFGs, dataflow analysis, reaching definitions, and live variables."
                        : moduleSlug === "module2-ast"
                          ? "Interactive walkthrough of AST construction, traversals, symbol tables, and transformations."
                          : moduleSlug === "module0-warmup"
                            ? "Interactive crash course on OCaml pattern matching, algebraic types, and functors — the building blocks for every exercise."
                            : "Worked examples, real-world case studies, and interactive diagrams to build intuition before diving into exercises."}
              </p>
              <span className="mt-3 inline-block text-xs font-medium text-amber-700 group-hover:underline">
                Start learning &rarr;
              </span>
            </Link>
          )}
          {mod.hasExplore && (
            <Link
              href={`/modules/${moduleSlug}/explore`}
              className="group rounded-xl border-2 border-emerald-200 bg-emerald-50 p-5 transition-all hover:border-emerald-300 hover:shadow-md"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-200 text-lg">
                  <svg className="h-5 w-5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <h3 className="text-lg font-semibold text-emerald-900">
                  {moduleSlug === "module6-tools-integration"
                    ? "Pipeline Explorer"
                    : moduleSlug === "module5-security-analysis"
                      ? "Security Analysis Explorer"
                      : moduleSlug === "module4-abstract-interpretation"
                        ? "Abstract Interpreter Explorer"
                        : moduleSlug === "module3-static-analysis"
                          ? "CFG Explorer"
                          : moduleSlug === "module2-ast"
                            ? "AST Explorer"
                            : "Analysis Playground"}
                </h3>
              </div>
              <p className="text-sm text-emerald-800">
                {moduleSlug === "module6-tools-integration"
                  ? "Configure multi-pass analysis pipelines, view findings by severity, and explore how passes combine into a complete tool."
                  : moduleSlug === "module5-security-analysis"
                    ? "Trace taint propagation through code, inspect sources/sinks/sanitizers, and discover vulnerabilities interactively."
                    : moduleSlug === "module4-abstract-interpretation"
                      ? "Step through abstract execution under Sign, Constant, and Interval domains. Compare precision and see widening in action."
                      : moduleSlug === "module3-static-analysis"
                        ? "Visualize control flow graphs, step through dataflow iterations, and compare reaching definitions with live variables."
                        : moduleSlug === "module2-ast"
                          ? "Explore AST trees, step through traversals, inspect symbol tables, and see transformations on real code snippets."
                          : "Compare static vs dynamic analysis side-by-side on real code snippets. See what each approach catches — and misses."}
              </p>
              <span className="mt-3 inline-block text-xs font-medium text-emerald-700 group-hover:underline">
                Open playground &rarr;
              </span>
            </Link>
          )}
        </div>
      )}

      {/* Exercise cards */}
      <div className="mb-8">
        <ExerciseGrid exercises={mod.exercises} moduleSlug={moduleSlug} />
        {mod.labSlug && (
          <Link
            href={`/labs/${mod.labSlug}`}
            className="mt-3 inline-block rounded-lg border-2 border-accent-red/20 bg-accent-red/5 px-4 py-2 text-sm font-medium text-accent-red transition-colors hover:bg-accent-red/10"
          >
            Lab: {mod.labSlug.replace(/-/g, " ").replace(/^lab/, "Lab")}
          </Link>
        )}
      </div>

      {/* Student README */}
      {readme && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <MarkdownRenderer content={readme} />
        </div>
      )}
    </div>
  );
}
