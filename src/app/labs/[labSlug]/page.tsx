import { notFound } from "next/navigation";
import { LABS, getModuleForLab } from "@/lib/modules";
import { getLabReadme, getLabFiles, getLabTestFiles } from "@/lib/content";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import WorkspaceLayout from "@/components/workspace/WorkspaceLayout";

export function generateStaticParams() {
  return LABS.map((l) => ({ labSlug: l.slug }));
}

interface Props {
  params: Promise<{ labSlug: string }>;
}

export default async function LabPage({ params }: Props) {
  const { labSlug } = await params;
  const lab = LABS.find((l) => l.slug === labSlug);
  if (!lab) notFound();

  const mod = getModuleForLab(labSlug);
  const files = getLabFiles(labSlug);
  const testFiles = getLabTestFiles(labSlug);
  const readme = getLabReadme(labSlug);

  return (
    <div className="-m-6">
      <div className="border-b border-slate-200 bg-white px-6 py-3">
        <Breadcrumbs
          items={[
            { label: "Labs", href: "/labs" },
            ...(mod
              ? [{ label: `Module ${mod.index}`, href: `/modules/${mod.slug}` }]
              : []),
            { label: lab.name },
          ]}
        />
      </div>
      <WorkspaceLayout
        files={files}
        testFiles={testFiles}
        instructions={readme}
        title={lab.name}
        exercisePath={`labs/${labSlug}`}
      />
    </div>
  );
}
