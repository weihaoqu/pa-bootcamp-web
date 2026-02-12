import Link from "next/link";
import { LABS, MODULES } from "@/lib/modules";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export default function LabsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <Breadcrumbs items={[{ label: "Labs" }]} />
      <h1 className="mb-2 text-3xl font-bold text-navy">Labs</h1>
      <p className="mb-8 text-slate-500">
        Hands-on lab projects that integrate concepts from each module.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {LABS.map((lab) => {
          const mod = MODULES.find((m) => m.index === lab.moduleIndex);
          return (
            <Link
              key={lab.slug}
              href={`/labs/${lab.slug}`}
              className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-accent-red/30 hover:shadow-md"
            >
              <div className="mb-2 text-xs font-medium text-accent-red">
                Module {lab.moduleIndex}
                {mod && ` \u2014 ${mod.name}`}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-navy group-hover:text-accent-red">
                {lab.name}
              </h3>
              <p className="mb-3 text-sm text-slate-500">{lab.description}</p>
              {lab.testCount > 0 && (
                <span className="rounded-full bg-navy/10 px-2.5 py-0.5 text-xs font-medium text-navy">
                  {lab.testCount} tests
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
