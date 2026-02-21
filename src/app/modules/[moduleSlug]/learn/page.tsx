import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MODULES } from "@/lib/modules";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import BeforeYouCode from "@/components/learn/BeforeYouCode";
import BeforeYouCodeAST from "@/components/learn/ast/BeforeYouCodeAST";
import BeforeYouCodeCFG from "@/components/learn/cfg/BeforeYouCodeCFG";
import BeforeYouCodeAbsInterp from "@/components/learn/absinterp/BeforeYouCodeAbsInterp";
import BeforeYouCodeSecurity from "@/components/learn/security/BeforeYouCodeSecurity";
import BeforeYouCodeTools from "@/components/learn/tools/BeforeYouCodeTools";
import BeforeYouCodeOCaml from "@/components/learn/ocaml/BeforeYouCodeOCaml";

export function generateStaticParams() {
  return MODULES.filter((m) => m.hasLearn).map((m) => ({ moduleSlug: m.slug }));
}

interface Props {
  params: Promise<{ moduleSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { moduleSlug } = await params;
  const mod = MODULES.find((m) => m.slug === moduleSlug);
  return { title: mod ? `Learn: ${mod.name} — PA Bootcamp` : "Learn — PA Bootcamp" };
}

export default async function LearnPage({ params }: Props) {
  const { moduleSlug } = await params;
  const mod = MODULES.find((m) => m.slug === moduleSlug && m.hasLearn);
  if (!mod) notFound();

  const learnLabel =
    moduleSlug === "module6-tools-integration"
      ? "Building Analysis Tools"
      : moduleSlug === "module5-security-analysis"
        ? "Understanding Security Analysis"
        : moduleSlug === "module4-abstract-interpretation"
          ? "Understanding Abstract Interpretation"
          : moduleSlug === "module3-static-analysis"
            ? "Understanding Static Analysis"
            : moduleSlug === "module2-ast"
              ? "Understanding ASTs"
              : moduleSlug === "module0-warmup"
                ? "OCaml Crash Course"
                : "Before You Code";

  return (
    <div className="mx-auto max-w-5xl">
      <Breadcrumbs
        items={[
          { label: "Modules", href: "/modules" },
          { label: mod.name, href: `/modules/${moduleSlug}` },
          { label: learnLabel },
        ]}
      />
      {moduleSlug === "module6-tools-integration" ? (
        <BeforeYouCodeTools moduleSlug={moduleSlug} />
      ) : moduleSlug === "module5-security-analysis" ? (
        <BeforeYouCodeSecurity moduleSlug={moduleSlug} />
      ) : moduleSlug === "module4-abstract-interpretation" ? (
        <BeforeYouCodeAbsInterp moduleSlug={moduleSlug} />
      ) : moduleSlug === "module3-static-analysis" ? (
        <BeforeYouCodeCFG moduleSlug={moduleSlug} />
      ) : moduleSlug === "module2-ast" ? (
        <BeforeYouCodeAST moduleSlug={moduleSlug} />
      ) : moduleSlug === "module0-warmup" ? (
        <BeforeYouCodeOCaml moduleSlug={moduleSlug} />
      ) : (
        <BeforeYouCode moduleSlug={moduleSlug} />
      )}
    </div>
  );
}
