import { MODULES } from "@/lib/modules";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ModulesGrid from "@/components/content/ModulesGrid";

export default function ModulesPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <Breadcrumbs items={[{ label: "Modules" }]} />
      <h1 className="mb-2 text-3xl font-bold text-navy">Course Modules</h1>
      <p className="mb-8 text-slate-500">
        7 modules covering program analysis from foundations to capstone.
      </p>

      <ModulesGrid modules={MODULES} />
    </div>
  );
}
