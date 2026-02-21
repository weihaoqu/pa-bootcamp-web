// ---------------------------------------------------------------------------
// Tools Integration Explorer data — interfaces + 5 pipeline scenarios
// ---------------------------------------------------------------------------

/** Severity levels for analysis findings */
export type Severity = "Critical" | "High" | "Medium" | "Low" | "Info";

/** An individual analysis finding */
export interface AnalysisFinding {
  id: string;
  pass: string;
  severity: Severity;
  line: number;
  message: string;
  category: string;
}

/** A single analysis pass in a pipeline */
export interface AnalysisPass {
  id: string;
  name: string;
  kind: "dead-code" | "sign" | "taint" | "constant" | "interval" | "live-vars" | "reaching-defs";
  description: string;
  findings: AnalysisFinding[];
  /** Time estimate (ms) — for visualization only */
  timeMs: number;
}

/** Pipeline configuration */
export interface PipelineConfig {
  passes: string[];
  parallel: boolean;
  stopOnCritical: boolean;
}

/** A complete pipeline scenario */
export interface PipelineScenario {
  id: string;
  name: string;
  shortName: string;
  description: string;
  code: string;
  passes: AnalysisPass[];
  defaultConfig: PipelineConfig;
  teachingPoint: string;
  /** The combined report from all passes */
  report: {
    totalFindings: number;
    bySeverity: Record<Severity, number>;
    byPass: { pass: string; count: number }[];
  };
}

// ===========================================================================
// Scenario 1: dead-code-simple
// ===========================================================================

const deadCodeSimple: PipelineScenario = {
  id: "dead-code-simple",
  name: "Dead Code Detection",
  shortName: "DeadCode",
  description: "Find unreachable code and unused variables in a simple program.",
  teachingPoint: "Dead code detection combines live variable analysis (unused assignments) with reachability analysis (unreachable statements). Running both passes together catches more issues than either alone.",
  code: `x = 5
y = 10
z = x + 1        // y is never used after this
if false then
  w = 99          // unreachable!
result = z`,
  passes: [
    {
      id: "live-vars",
      name: "Live Variables",
      kind: "live-vars",
      description: "Backward analysis to find variables that are never read after assignment.",
      timeMs: 12,
      findings: [
        { id: "LV1", pass: "Live Variables", severity: "Low", line: 2, message: "Variable 'y' is assigned but never used", category: "unused-variable" },
      ],
    },
    {
      id: "dead-code",
      name: "Dead Code Detector",
      kind: "dead-code",
      description: "Detects unreachable statements using control flow analysis.",
      timeMs: 8,
      findings: [
        { id: "DC1", pass: "Dead Code Detector", severity: "Medium", line: 5, message: "Unreachable code: 'w = 99' inside 'if false' branch", category: "unreachable" },
      ],
    },
  ],
  defaultConfig: { passes: ["live-vars", "dead-code"], parallel: true, stopOnCritical: false },
  report: {
    totalFindings: 2,
    bySeverity: { Critical: 0, High: 0, Medium: 1, Low: 1, Info: 0 },
    byPass: [{ pass: "Live Variables", count: 1 }, { pass: "Dead Code Detector", count: 1 }],
  },
};

// ===========================================================================
// Scenario 2: multi-vuln
// ===========================================================================

const multiVuln: PipelineScenario = {
  id: "multi-vuln",
  name: "Multi-Vulnerability Scan",
  shortName: "MultiVuln",
  description: "Multiple analysis passes catch different types of bugs in the same program.",
  teachingPoint: "No single analysis catches everything. Sign analysis finds the division-by-zero, taint analysis finds the injection, and dead code finds the unused variable. This is why multi-pass analysis matters.",
  code: `username = req.body.user
count = 0
divisor = count        // will be 0!
query = "SELECT * FROM t WHERE u='" + username + "'"
result = db.exec(query)
ratio = 100 / divisor
unused = 42`,
  passes: [
    {
      id: "taint",
      name: "Taint Analysis",
      kind: "taint",
      description: "Tracks untrusted data from sources to sinks.",
      timeMs: 15,
      findings: [
        { id: "T1", pass: "Taint Analysis", severity: "Critical", line: 5, message: "SQL Injection: tainted 'query' (from req.body) reaches db.exec() sink", category: "sql-injection" },
      ],
    },
    {
      id: "sign",
      name: "Sign Analysis",
      kind: "sign",
      description: "Tracks sign of numeric values to detect division by zero.",
      timeMs: 10,
      findings: [
        { id: "S1", pass: "Sign Analysis", severity: "High", line: 6, message: "Division by zero: 'divisor' is Zero (assigned from 'count' = 0)", category: "div-by-zero" },
      ],
    },
    {
      id: "live-vars",
      name: "Live Variables",
      kind: "live-vars",
      description: "Finds unused assignments.",
      timeMs: 8,
      findings: [
        { id: "LV1", pass: "Live Variables", severity: "Low", line: 7, message: "Variable 'unused' is assigned but never used", category: "unused-variable" },
      ],
    },
  ],
  defaultConfig: { passes: ["taint", "sign", "live-vars"], parallel: true, stopOnCritical: false },
  report: {
    totalFindings: 3,
    bySeverity: { Critical: 1, High: 1, Medium: 0, Low: 1, Info: 0 },
    byPass: [
      { pass: "Taint Analysis", count: 1 },
      { pass: "Sign Analysis", count: 1 },
      { pass: "Live Variables", count: 1 },
    ],
  },
};

// ===========================================================================
// Scenario 3: pipeline-config
// ===========================================================================

const pipelineConfig: PipelineScenario = {
  id: "pipeline-config",
  name: "Configurable Pipeline",
  shortName: "Pipeline",
  description: "Same code, different pipeline configurations — see how pass order and options affect results.",
  teachingPoint: "Pipeline configuration matters: running passes in parallel is faster, but 'stop on critical' can save time when a showstopper is found early. The order of passes doesn't affect findings (they're independent) but affects reporting order.",
  code: `input = read_file(req.query.path)
data = parse(input)
result = transform(data)
output = format(result)
write_file("/tmp/out", output)
log = "Processed: " + req.query.path
db.exec("INSERT INTO log VALUES('" + log + "')")`,
  passes: [
    {
      id: "taint",
      name: "Taint Analysis",
      kind: "taint",
      description: "Tracks data from user input through processing.",
      timeMs: 18,
      findings: [
        { id: "T1", pass: "Taint Analysis", severity: "Critical", line: 1, message: "Path Traversal: tainted req.query.path reaches read_file() sink", category: "path-traversal" },
        { id: "T2", pass: "Taint Analysis", severity: "Critical", line: 7, message: "SQL Injection: tainted 'log' (from req.query) reaches db.exec() sink", category: "sql-injection" },
      ],
    },
    {
      id: "constant",
      name: "Constant Propagation",
      kind: "constant",
      description: "Tracks constant values through the program.",
      timeMs: 12,
      findings: [
        { id: "C1", pass: "Constant Propagation", severity: "Info", line: 5, message: "Output path '/tmp/out' is a constant — consider making it configurable", category: "hardcoded-path" },
      ],
    },
    {
      id: "dead-code",
      name: "Dead Code Detector",
      kind: "dead-code",
      description: "Checks for unreachable or redundant code.",
      timeMs: 6,
      findings: [],
    },
  ],
  defaultConfig: { passes: ["taint", "constant", "dead-code"], parallel: false, stopOnCritical: true },
  report: {
    totalFindings: 3,
    bySeverity: { Critical: 2, High: 0, Medium: 0, Low: 0, Info: 1 },
    byPass: [
      { pass: "Taint Analysis", count: 2 },
      { pass: "Constant Propagation", count: 1 },
      { pass: "Dead Code Detector", count: 0 },
    ],
  },
};

// ===========================================================================
// Scenario 4: clean-code
// ===========================================================================

const cleanCode: PipelineScenario = {
  id: "clean-code",
  name: "Clean Code (No Findings)",
  shortName: "Clean",
  description: "A well-written program with no issues — all passes run, zero findings.",
  teachingPoint: "A clean analysis report is the goal. This program uses parameterized queries (no injection), checks for zero before dividing (no crash), and has no dead code. The pipeline confirms: no issues found.",
  code: `x = 5
y = x + 1
if y != 0 then
  z = 100 / y
else
  z = 0
query = parameterize("SELECT * FROM t WHERE id=?", z)
result = db.exec(query)`,
  passes: [
    {
      id: "taint",
      name: "Taint Analysis",
      kind: "taint",
      description: "Checks for unsanitized data flows.",
      timeMs: 14,
      findings: [],
    },
    {
      id: "sign",
      name: "Sign Analysis",
      kind: "sign",
      description: "Checks for potential division by zero.",
      timeMs: 10,
      findings: [],
    },
    {
      id: "dead-code",
      name: "Dead Code Detector",
      kind: "dead-code",
      description: "Looks for unused code.",
      timeMs: 5,
      findings: [],
    },
  ],
  defaultConfig: { passes: ["taint", "sign", "dead-code"], parallel: true, stopOnCritical: false },
  report: {
    totalFindings: 0,
    bySeverity: { Critical: 0, High: 0, Medium: 0, Low: 0, Info: 0 },
    byPass: [
      { pass: "Taint Analysis", count: 0 },
      { pass: "Sign Analysis", count: 0 },
      { pass: "Dead Code Detector", count: 0 },
    ],
  },
};

// ===========================================================================
// Scenario 5: reporting-formats
// ===========================================================================

const reportingFormats: PipelineScenario = {
  id: "reporting-formats",
  name: "Rich Reporting",
  shortName: "Report",
  description: "Multiple findings from multiple passes — see how they're aggregated, sorted, and reported.",
  teachingPoint: "Reporting is the user-facing layer of the tool. Grouping by severity (Critical first), by pass, or by file location — the same findings, presented differently for different audiences (developers vs security teams).",
  code: `password = req.body.pw
admin = req.body.admin
hash = md5(password)
db.exec("UPDATE users SET pw='" + hash + "' WHERE admin=" + admin)
unused_flag = true
result = 0 / 0
log(result)`,
  passes: [
    {
      id: "taint",
      name: "Taint Analysis",
      kind: "taint",
      description: "Injection vulnerability detection.",
      timeMs: 16,
      findings: [
        { id: "T1", pass: "Taint Analysis", severity: "Critical", line: 4, message: "SQL Injection: tainted 'hash' and 'admin' reach db.exec() without parameterization", category: "sql-injection" },
      ],
    },
    {
      id: "sign",
      name: "Sign Analysis",
      kind: "sign",
      description: "Numeric safety checks.",
      timeMs: 9,
      findings: [
        { id: "S1", pass: "Sign Analysis", severity: "High", line: 6, message: "Division by zero: literal 0 / 0", category: "div-by-zero" },
      ],
    },
    {
      id: "constant",
      name: "Constant Propagation",
      kind: "constant",
      description: "Tracks constant values.",
      timeMs: 11,
      findings: [
        { id: "CP1", pass: "Constant Propagation", severity: "Medium", line: 3, message: "Weak hash: md5() is deprecated for password hashing", category: "weak-crypto" },
      ],
    },
    {
      id: "live-vars",
      name: "Live Variables",
      kind: "live-vars",
      description: "Unused variable detection.",
      timeMs: 7,
      findings: [
        { id: "LV1", pass: "Live Variables", severity: "Low", line: 5, message: "Variable 'unused_flag' is assigned but never used", category: "unused-variable" },
      ],
    },
  ],
  defaultConfig: { passes: ["taint", "sign", "constant", "live-vars"], parallel: true, stopOnCritical: false },
  report: {
    totalFindings: 4,
    bySeverity: { Critical: 1, High: 1, Medium: 1, Low: 1, Info: 0 },
    byPass: [
      { pass: "Taint Analysis", count: 1 },
      { pass: "Sign Analysis", count: 1 },
      { pass: "Constant Propagation", count: 1 },
      { pass: "Live Variables", count: 1 },
    ],
  },
};

// ===========================================================================
// Export
// ===========================================================================

export const PIPELINE_SCENARIOS: PipelineScenario[] = [
  deadCodeSimple,
  multiVuln,
  pipelineConfig,
  cleanCode,
  reportingFormats,
];

export function getPipelineScenario(id: string): PipelineScenario | undefined {
  return PIPELINE_SCENARIOS.find((s) => s.id === id);
}

/** Severity color mapping for consistent styling */
export const SEVERITY_COLORS: Record<Severity, { bg: string; text: string; border: string }> = {
  Critical: { bg: "bg-red-100", text: "text-red-800", border: "border-red-200" },
  High: { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-200" },
  Medium: { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-200" },
  Low: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200" },
  Info: { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" },
};

/** Pass kind to color mapping */
export const PASS_COLORS: Record<string, string> = {
  "dead-code": "text-purple-700 bg-purple-50 border-purple-200",
  "sign": "text-blue-700 bg-blue-50 border-blue-200",
  "taint": "text-red-700 bg-red-50 border-red-200",
  "constant": "text-emerald-700 bg-emerald-50 border-emerald-200",
  "interval": "text-cyan-700 bg-cyan-50 border-cyan-200",
  "live-vars": "text-amber-700 bg-amber-50 border-amber-200",
  "reaching-defs": "text-indigo-700 bg-indigo-50 border-indigo-200",
};
