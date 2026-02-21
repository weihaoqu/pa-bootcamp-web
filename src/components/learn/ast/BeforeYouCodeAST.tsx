"use client";

import SectionNav, { Section } from "../SectionNav";
import WhyASTSection from "./WhyASTSection";
import CodeToTreeSection from "./CodeToTreeSection";
import TraversalsSection from "./TraversalsSection";
import SymbolTablesSection from "./SymbolTablesSection";
import TransformationsSection from "./TransformationsSection";
import TryItSectionAST from "./TryItSectionAST";

const SECTIONS: Section[] = [
  { id: "why-ast", label: "Why ASTs?" },
  { id: "code-to-tree", label: "Code to Tree" },
  { id: "traversals", label: "Traversals" },
  { id: "symbol-tables", label: "Symbol Tables" },
  { id: "transforms", label: "Transformations" },
  { id: "try-it", label: "Try It Yourself" },
];

interface BeforeYouCodeASTProps {
  moduleSlug: string;
}

export default function BeforeYouCodeAST({ moduleSlug }: BeforeYouCodeASTProps) {
  return (
    <div className="relative">
      <SectionNav sections={SECTIONS} />

      {/* Header */}
      <div className="mb-8">
        <div className="mb-1 text-sm font-medium text-amber-600">Before You Code</div>
        <h1 className="text-3xl font-bold text-navy">
          Understanding Abstract Syntax Trees
        </h1>
        <p className="mt-2 text-slate-600">
          Before building AST analyzers in OCaml, let&apos;s develop intuition for <em>how</em> code becomes
          trees, <em>why</em> tree structure matters, and the key operations (traversals, symbol tables,
          transformations) you&apos;ll implement in the exercises.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-12 xl:mr-56">
        <WhyASTSection />
        <CodeToTreeSection />
        <TraversalsSection />
        <SymbolTablesSection />
        <TransformationsSection />
        <TryItSectionAST moduleSlug={moduleSlug} />
      </div>
    </div>
  );
}
