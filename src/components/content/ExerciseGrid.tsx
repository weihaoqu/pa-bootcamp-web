"use client";

import { Exercise } from "@/lib/types";
import { useProgress } from "@/lib/useProgress";
import ExerciseCard from "./ExerciseCard";

interface ExerciseGridProps {
  exercises: Exercise[];
  moduleSlug: string;
}

export default function ExerciseGrid({ exercises, moduleSlug }: ExerciseGridProps) {
  const { isComplete, toggle, countComplete } = useProgress();
  const done = countComplete(moduleSlug, exercises.map((e) => e.slug));
  const total = exercises.length;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-navy">Exercises</h2>
        {total > 0 && (
          <span className="text-xs text-slate-500">
            {done}/{total} complete
            {done === total && done > 0 && (
              <span className="ml-1.5 rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700 font-medium">All done</span>
            )}
          </span>
        )}
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-400 transition-all duration-300"
            style={{ width: `${(done / total) * 100}%` }}
          />
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {exercises.map((ex) => (
          <ExerciseCard
            key={ex.slug}
            exercise={ex}
            moduleSlug={moduleSlug}
            completed={isComplete(moduleSlug, ex.slug)}
            onToggle={() => toggle(moduleSlug, ex.slug)}
          />
        ))}
      </div>
    </div>
  );
}
