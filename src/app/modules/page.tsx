import Link from "next/link";
import { MODULES } from "@/lib/modules";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export default function ModulesPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <Breadcrumbs items={[{ label: "Modules" }]} />
      <h1 className="mb-2 text-3xl font-bold text-navy">Course Modules</h1>
      <p className="mb-8 text-slate-500">
        7 modules covering program analysis from foundations to capstone.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {MODULES.map((mod) => (
          <Link
            key={mod.slug}
            href={`/modules/${mod.slug}`}
            className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-accent-red/30 hover:shadow-md"
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy text-lg font-bold text-white">
                {mod.index}
              </span>
              <h3 className="text-lg font-semibold text-navy group-hover:text-accent-red">
                {mod.name}
              </h3>
            </div>
            <p className="mb-4 text-sm text-slate-500">{mod.description}</p>
            <div className="flex gap-3 text-xs text-slate-400">
              <span className="rounded-full bg-slate-100 px-2 py-0.5">
                {mod.exercises.length} exercises
              </span>
              {mod.testCount > 0 && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5">
                  {mod.testCount} tests
                </span>
              )}
              {mod.labSlug && (
                <span className="rounded-full bg-accent-red/10 px-2 py-0.5 text-accent-red">
                  + Lab
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
