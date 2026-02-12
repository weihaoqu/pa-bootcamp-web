import { notFound } from "next/navigation";
import { MODULES } from "@/lib/modules";
import {
  getModuleReadme,
  getExerciseFiles,
  getExerciseTestFiles,
} from "@/lib/content";
import { getHints } from "@/lib/hints";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import WorkspaceLayout from "@/components/workspace/WorkspaceLayout";

export function generateStaticParams() {
  const params: { moduleSlug: string; exerciseSlug: string }[] = [];
  for (const mod of MODULES) {
    for (const ex of mod.exercises) {
      params.push({ moduleSlug: mod.slug, exerciseSlug: ex.slug });
    }
  }
  return params;
}

interface Props {
  params: Promise<{ moduleSlug: string; exerciseSlug: string }>;
}

export default async function ExercisePage({ params }: Props) {
  const { moduleSlug, exerciseSlug } = await params;
  const mod = MODULES.find((m) => m.slug === moduleSlug);
  if (!mod) notFound();

  const exercise = mod.exercises.find((e) => e.slug === exerciseSlug);
  if (!exercise) notFound();

  const files = getExerciseFiles(moduleSlug, exerciseSlug);
  const testFiles = getExerciseTestFiles(moduleSlug, exerciseSlug);
  const readme = getModuleReadme(moduleSlug);

  // Try to extract the relevant section for this exercise from the README
  const instructions = extractExerciseSection(readme, exercise.name, exercise.order);
  const hints = getHints(moduleSlug, exerciseSlug);
  const exercisePath = `modules/${moduleSlug}/exercises/${exerciseSlug}`;

  return (
    <div className="-m-6">
      <div className="border-b border-slate-200 bg-white px-6 py-3">
        <Breadcrumbs
          items={[
            { label: "Modules", href: "/modules" },
            { label: mod.name, href: `/modules/${moduleSlug}` },
            { label: exercise.name },
          ]}
        />
      </div>
      <WorkspaceLayout
        files={files}
        testFiles={testFiles}
        instructions={instructions}
        title={exercise.name}
        exercisePath={exercisePath}
        hints={hints}
      />
    </div>
  );
}

/** Extract the section of the README relevant to a specific exercise. */
function extractExerciseSection(
  readme: string,
  exerciseName: string,
  exerciseOrder: number
): string {
  if (!readme) return "";

  // Try to find section by exercise name or "Exercise N"
  const patterns = [
    new RegExp(
      `(^#{1,3}\\s+.*?${escapeRegex(exerciseName)}.*?$)`,
      "im"
    ),
    new RegExp(
      `(^#{1,3}\\s+.*?Exercise\\s+${exerciseOrder}.*?$)`,
      "im"
    ),
  ];

  for (const pattern of patterns) {
    const match = readme.match(pattern);
    if (match && match.index !== undefined) {
      // Find the heading level
      const headingLine = match[1];
      const level = (headingLine.match(/^#+/) || ["##"])[0].length;

      // Extract from this heading to the next heading of same or higher level
      const rest = readme.slice(match.index);
      const nextHeading = rest.match(
        new RegExp(`\n#{1,${level}}\\s+`, "m")
      );
      const endIndex = nextHeading?.index
        ? match.index + nextHeading.index
        : readme.length;

      return readme.slice(match.index, endIndex).trim();
    }
  }

  // Fallback: return the full README
  return readme;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
