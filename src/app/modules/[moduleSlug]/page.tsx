import { notFound } from "next/navigation";
import Link from "next/link";
import { MODULES } from "@/lib/modules";
import { getModuleReadme } from "@/lib/content";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import MarkdownRenderer from "@/components/content/MarkdownRenderer";
import ExerciseCard from "@/components/content/ExerciseCard";

export function generateStaticParams() {
  return MODULES.map((m) => ({ moduleSlug: m.slug }));
}

interface Props {
  params: Promise<{ moduleSlug: string }>;
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

      {/* Exercise cards */}
      <div className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-navy">Exercises</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {mod.exercises.map((ex) => (
            <ExerciseCard
              key={ex.slug}
              exercise={ex}
              moduleSlug={moduleSlug}
            />
          ))}
        </div>
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
