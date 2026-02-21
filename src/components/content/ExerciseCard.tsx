import Link from "next/link";
import { Exercise } from "@/lib/types";

interface ExerciseCardProps {
  exercise: Exercise;
  moduleSlug: string;
  completed?: boolean;
  onToggle?: () => void;
}

export default function ExerciseCard({
  exercise,
  moduleSlug,
  completed,
  onToggle,
}: ExerciseCardProps) {
  return (
    <div className="group relative rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:border-accent-red/30 hover:shadow-md">
      <Link
        href={`/modules/${moduleSlug}/exercises/${exercise.slug}`}
        className="block p-4"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2">
            {completed !== undefined && (
              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${
                completed ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-300"
              }`}>
                {completed ? "\u2713" : ""}
              </span>
            )}
            <div>
              <h4 className="font-semibold text-navy group-hover:text-accent-red">
                {exercise.name}
              </h4>
              <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                <span>Exercise {exercise.order}</span>
                {exercise.difficulty && (
                  <span className="flex gap-0.5" title={exercise.difficulty === 1 ? "Introductory" : exercise.difficulty === 2 ? "Intermediate" : "Challenging"}>
                    {Array.from({ length: 3 }, (_, i) => (
                      <span key={i} className={i < exercise.difficulty! ? "text-amber-400" : "text-slate-200"}>&#9733;</span>
                    ))}
                  </span>
                )}
                {exercise.estimatedMinutes && (
                  <span className="text-xs text-slate-400">~{exercise.estimatedMinutes}m</span>
                )}
              </div>
            </div>
          </div>
          {exercise.testCount > 0 && (
            <span className="rounded-full bg-navy/10 px-2.5 py-0.5 text-xs font-medium text-navy">
              {exercise.testCount} tests
            </span>
          )}
        </div>
      </Link>
      {onToggle && (
        <button
          onClick={(e) => { e.preventDefault(); onToggle(); }}
          className={`absolute bottom-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${
            completed
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          }`}
        >
          {completed ? "Done" : "Mark done"}
        </button>
      )}
    </div>
  );
}
