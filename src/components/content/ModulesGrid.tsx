"use client";

import Link from "next/link";
import { ModuleInfo } from "@/lib/types";
import { useProgress } from "@/lib/useProgress";

interface ModulesGridProps {
  modules: ModuleInfo[];
}

export default function ModulesGrid({ modules }: ModulesGridProps) {
  const { countComplete } = useProgress();

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {modules.map((mod) => {
        const total = mod.exercises.length;
        const done = countComplete(mod.slug, mod.exercises.map((e) => e.slug));
        return (
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

            {/* Progress bar */}
            {total > 0 && done > 0 && (
              <div className="mb-3">
                <div className="mb-1 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{done}/{total} exercises</span>
                  {done === total && <span className="font-medium text-emerald-600">Complete</span>}
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-400 transition-all duration-300"
                    style={{ width: `${(done / total) * 100}%` }}
                  />
                </div>
              </div>
            )}

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
        );
      })}
    </div>
  );
}
