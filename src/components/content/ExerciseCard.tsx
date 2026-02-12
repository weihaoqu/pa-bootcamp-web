import Link from "next/link";
import { Exercise } from "@/lib/types";

interface ExerciseCardProps {
  exercise: Exercise;
  moduleSlug: string;
}

export default function ExerciseCard({
  exercise,
  moduleSlug,
}: ExerciseCardProps) {
  return (
    <Link
      href={`/modules/${moduleSlug}/exercises/${exercise.slug}`}
      className="group block rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-accent-red/30 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-navy group-hover:text-accent-red">
            {exercise.name}
          </h4>
          <p className="mt-1 text-sm text-slate-500">
            Exercise {exercise.order}
          </p>
        </div>
        {exercise.testCount > 0 && (
          <span className="rounded-full bg-navy/10 px-2.5 py-0.5 text-xs font-medium text-navy">
            {exercise.testCount} tests
          </span>
        )}
      </div>
    </Link>
  );
}
