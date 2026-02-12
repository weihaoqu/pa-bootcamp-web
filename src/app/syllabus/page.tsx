import { getSyllabus } from "@/lib/content";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import MarkdownRenderer from "@/components/content/MarkdownRenderer";

export default function SyllabusPage() {
  const content = getSyllabus();

  return (
    <div className="mx-auto max-w-4xl">
      <Breadcrumbs items={[{ label: "Syllabus" }]} />
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        {content ? (
          <MarkdownRenderer content={content} />
        ) : (
          <p className="text-slate-500">
            Syllabus not found. Run{" "}
            <code className="text-sm">./scripts/sync-content.sh</code> to
            populate content.
          </p>
        )}
      </div>
    </div>
  );
}
