import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MODULES } from "@/lib/modules";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import AnalysisPlayground from "@/components/explore/AnalysisPlayground";
import ASTExplorer from "@/components/explore/ast/ASTExplorer";
import CFGExplorer from "@/components/explore/cfg/CFGExplorer";
import AbstractInterpExplorer from "@/components/explore/absinterp/AbstractInterpExplorer";
import SecurityExplorer from "@/components/explore/security/SecurityExplorer";
import ToolsExplorer from "@/components/explore/tools/ToolsExplorer";

export function generateStaticParams() {
  return MODULES.filter((m) => m.hasExplore).map((m) => ({ moduleSlug: m.slug }));
}

interface Props {
  params: Promise<{ moduleSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { moduleSlug } = await params;
  const mod = MODULES.find((m) => m.slug === moduleSlug);
  return { title: mod ? `Explore: ${mod.name} — PA Bootcamp` : "Explore — PA Bootcamp" };
}

export default async function ExplorePage({ params }: Props) {
  const { moduleSlug } = await params;
  const mod = MODULES.find((m) => m.slug === moduleSlug && m.hasExplore);
  if (!mod) notFound();

  const exploreLabel =
    moduleSlug === "module6-tools-integration"
      ? "Pipeline Explorer"
      : moduleSlug === "module5-security-analysis"
        ? "Security Analysis Explorer"
        : moduleSlug === "module4-abstract-interpretation"
          ? "Abstract Interpreter Explorer"
          : moduleSlug === "module3-static-analysis"
            ? "CFG Explorer"
            : moduleSlug === "module2-ast"
              ? "AST Explorer"
              : "Analysis Playground";

  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumbs
        items={[
          { label: "Modules", href: "/modules" },
          { label: mod.name, href: `/modules/${moduleSlug}` },
          { label: exploreLabel },
        ]}
      />
      {moduleSlug === "module6-tools-integration" ? (
        <ToolsExplorer />
      ) : moduleSlug === "module5-security-analysis" ? (
        <SecurityExplorer />
      ) : moduleSlug === "module4-abstract-interpretation" ? (
        <AbstractInterpExplorer />
      ) : moduleSlug === "module3-static-analysis" ? (
        <CFGExplorer />
      ) : moduleSlug === "module2-ast" ? (
        <ASTExplorer />
      ) : (
        <AnalysisPlayground />
      )}
    </div>
  );
}
