import { ModuleInfo, LabInfo } from "./types";

export const MODULES: ModuleInfo[] = [
  {
    slug: "module0-warmup",
    index: 0,
    name: "OCaml Warm-up",
    description:
      "Get up to speed with OCaml fundamentals: syntax, types, recursion, collections, modules, and a calculator parser.",
    testCount: 99,
    labSlug: null,
    exercises: [
      { slug: "ocaml-basics", name: "OCaml Basics", testCount: 17, order: 1 },
      { slug: "types-and-recursion", name: "Types and Recursion", testCount: 20, order: 2 },
      { slug: "collections-and-records", name: "Collections and Records", testCount: 22, order: 3 },
      { slug: "modules-and-functors", name: "Modules and Functors", testCount: 22, order: 4 },
      { slug: "calculator-parser", name: "Calculator Parser", testCount: 18, order: 5 },
    ],
  },
  {
    slug: "module1-foundations",
    index: 1,
    name: "Foundations of Program Analysis",
    description:
      "Learn what program analysis is, compare static vs dynamic approaches, and explore soundness, completeness, and decidability.",
    testCount: 0,
    labSlug: "lab1-tool-setup",
    exercises: [
      { slug: "analysis-comparison", name: "Analysis Comparison", testCount: 0, order: 1 },
      { slug: "calculator-bugs", name: "Calculator Bugs", testCount: 0, order: 2 },
    ],
  },
  {
    slug: "module2-ast",
    index: 2,
    name: "Code Representation & ASTs",
    description:
      "Explore how compilers represent code as Abstract Syntax Trees. Build visualizers, traversals, symbol tables, and transformations.",
    testCount: 63,
    labSlug: "lab2-ast-parser",
    exercises: [
      { slug: "ast-structure-mapping", name: "AST Structure Mapping", testCount: 0, order: 1 },
      { slug: "traversal-algorithms", name: "Traversal Algorithms", testCount: 27, order: 2 },
      { slug: "symbol-table", name: "Symbol Table", testCount: 6, order: 3 },
      { slug: "ast-transformations", name: "AST Transformations", testCount: 30, order: 4 },
    ],
  },
  {
    slug: "module3-static-analysis",
    index: 3,
    name: "Static Analysis Fundamentals",
    description:
      "Build control flow graphs, implement the dataflow analysis framework, and apply reaching definitions and live variable analyses.",
    testCount: 116,
    labSlug: "lab3-static-checker",
    exercises: [
      { slug: "cfg-construction", name: "CFG Construction", testCount: 23, order: 1 },
      { slug: "dataflow-framework", name: "Dataflow Framework", testCount: 20, order: 2 },
      { slug: "reaching-definitions", name: "Reaching Definitions", testCount: 24, order: 3 },
      { slug: "live-variables", name: "Live Variables", testCount: 24, order: 4 },
      { slug: "interprocedural-analysis", name: "Interprocedural Analysis", testCount: 25, order: 5 },
    ],
  },
  {
    slug: "module4-abstract-interpretation",
    index: 4,
    name: "Abstract Interpretation",
    description:
      "Learn abstract interpretation theory: lattices, Galois connections, and widening. Implement sign, constant propagation, and interval analyses.",
    testCount: 128,
    labSlug: "lab4-abstract-interpreter",
    exercises: [
      { slug: "sign-lattice", name: "Sign Lattice", testCount: 27, order: 1 },
      { slug: "constant-propagation", name: "Constant Propagation", testCount: 22, order: 2 },
      { slug: "interval-domain", name: "Interval Domain", testCount: 27, order: 3 },
      { slug: "galois-connections", name: "Galois Connections", testCount: 25, order: 4 },
      { slug: "abstract-interpreter", name: "Abstract Interpreter", testCount: 27, order: 5 },
    ],
  },
  {
    slug: "module5-security-analysis",
    index: 5,
    name: "Security Analysis",
    description:
      "Apply program analysis to security: taint analysis, information flow tracking, and automatic vulnerability detection.",
    testCount: 100,
    labSlug: "lab5-security-analyzer",
    exercises: [
      { slug: "taint-lattice", name: "Taint Lattice", testCount: 22, order: 1 },
      { slug: "taint-propagation", name: "Taint Propagation", testCount: 20, order: 2 },
      { slug: "security-config", name: "Security Config", testCount: 20, order: 3 },
      { slug: "information-flow", name: "Information Flow", testCount: 18, order: 4 },
      { slug: "vulnerability-detection", name: "Vulnerability Detection", testCount: 20, order: 5 },
    ],
  },
  {
    slug: "module6-tools-integration",
    index: 6,
    name: "Tools Integration",
    description:
      "Capstone module: combine all analyses into a real tool. Build a multi-pass analyzer with configurable pipelines and reporting.",
    testCount: 96,
    labSlug: "lab6-integrated-analyzer",
    exercises: [
      { slug: "analysis-finding", name: "Analysis Finding", testCount: 20, order: 1 },
      { slug: "dead-code-detector", name: "Dead Code Detector", testCount: 20, order: 2 },
      { slug: "multi-pass-analyzer", name: "Multi-Pass Analyzer", testCount: 20, order: 3 },
      { slug: "configurable-pipeline", name: "Configurable Pipeline", testCount: 18, order: 4 },
      { slug: "analysis-reporter", name: "Analysis Reporter", testCount: 18, order: 5 },
    ],
  },
];

export const LABS: LabInfo[] = [
  {
    slug: "lab1-tool-setup",
    name: "Lab 1: Tool Setup",
    moduleIndex: 1,
    description: "Set up your OCaml development environment with opam, dune, and OUnit2.",
    testCount: 0,
  },
  {
    slug: "lab2-ast-parser",
    name: "Lab 2: AST Parser",
    moduleIndex: 2,
    description: "Build a parser that converts source code into an AST and run analyses on it.",
    testCount: 9,
  },
  {
    slug: "lab3-static-checker",
    name: "Lab 3: Static Checker",
    moduleIndex: 3,
    description: "Implement a static checker that uses CFGs and dataflow analysis to find bugs.",
    testCount: 10,
  },
  {
    slug: "lab4-abstract-interpreter",
    name: "Lab 4: Abstract Interpreter",
    moduleIndex: 4,
    description: "Build an abstract interpreter that tracks value ranges and detects runtime errors.",
    testCount: 10,
  },
  {
    slug: "lab5-security-analyzer",
    name: "Lab 5: Security Analyzer",
    moduleIndex: 5,
    description: "Implement a taint-based security analyzer that finds injection vulnerabilities.",
    testCount: 10,
  },
  {
    slug: "lab6-integrated-analyzer",
    name: "Lab 6: Integrated Analyzer",
    moduleIndex: 6,
    description: "Capstone: build a full analysis tool combining multiple passes into a unified pipeline.",
    testCount: 40,
  },
];

export function getModule(slug: string): ModuleInfo | undefined {
  return MODULES.find((m) => m.slug === slug);
}

export function getLab(slug: string): LabInfo | undefined {
  return LABS.find((l) => l.slug === slug);
}

export function getModuleForLab(labSlug: string): ModuleInfo | undefined {
  return MODULES.find((m) => m.labSlug === labSlug);
}

/** Map of slide deck HTML filenames to module slugs */
export const SLIDE_DECKS: Record<string, string> = {
  "module0-warmup": "warmup.html",
  "module1-foundations": "foundations.html",
  "module2-ast": "ast.html",
  "module3-static-analysis": "static-analysis.html",
  "module4-abstract-interpretation": "abstract-interpretation.html",
  "module5-security-analysis": "security-analysis.html",
  "module6-tools-integration": "tools-integration.html",
};
