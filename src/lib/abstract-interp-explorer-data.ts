// ---------------------------------------------------------------------------
// Abstract Interpretation Explorer data — interfaces + 5 pre-computed programs
// ---------------------------------------------------------------------------

/** The three abstract domains we demonstrate */
export type DomainId = "sign" | "constant" | "interval";

export const DOMAIN_LABELS: Record<DomainId, string> = {
  sign: "Sign",
  constant: "Constant",
  interval: "Interval",
};

// --- Sign Domain -----------------------------------------------------------

export type SignValue = "Bot" | "Neg" | "Zero" | "Pos" | "Top";

/** Hasse diagram edges for the Sign lattice (from lower to upper) */
export const SIGN_HASSE: { from: SignValue; to: SignValue }[] = [
  { from: "Bot", to: "Neg" },
  { from: "Bot", to: "Zero" },
  { from: "Bot", to: "Pos" },
  { from: "Neg", to: "Top" },
  { from: "Zero", to: "Top" },
  { from: "Pos", to: "Top" },
];

export const SIGN_JOIN: Record<string, SignValue> = {
  "Bot,Bot": "Bot", "Bot,Neg": "Neg", "Bot,Zero": "Zero", "Bot,Pos": "Pos", "Bot,Top": "Top",
  "Neg,Bot": "Neg", "Neg,Neg": "Neg", "Neg,Zero": "Top", "Neg,Pos": "Top", "Neg,Top": "Top",
  "Zero,Bot": "Zero", "Zero,Neg": "Top", "Zero,Zero": "Zero", "Zero,Pos": "Top", "Zero,Top": "Top",
  "Pos,Bot": "Pos", "Pos,Neg": "Top", "Pos,Zero": "Top", "Pos,Pos": "Pos", "Pos,Top": "Top",
  "Top,Bot": "Top", "Top,Neg": "Top", "Top,Zero": "Top", "Top,Pos": "Top", "Top,Top": "Top",
};

export const SIGN_MEET: Record<string, SignValue> = {
  "Bot,Bot": "Bot", "Bot,Neg": "Bot", "Bot,Zero": "Bot", "Bot,Pos": "Bot", "Bot,Top": "Bot",
  "Neg,Bot": "Bot", "Neg,Neg": "Neg", "Neg,Zero": "Bot", "Neg,Pos": "Bot", "Neg,Top": "Neg",
  "Zero,Bot": "Bot", "Zero,Neg": "Bot", "Zero,Zero": "Zero", "Zero,Pos": "Bot", "Zero,Top": "Zero",
  "Pos,Bot": "Bot", "Pos,Neg": "Bot", "Pos,Zero": "Bot", "Pos,Pos": "Pos", "Pos,Top": "Pos",
  "Top,Bot": "Bot", "Top,Neg": "Neg", "Top,Zero": "Zero", "Top,Pos": "Pos", "Top,Top": "Top",
};

// --- Domain Properties -----------------------------------------------------

export interface DomainProperties {
  name: string;
  height: string;
  width: string;
  needsWidening: boolean;
  description: string;
}

export const DOMAIN_PROPERTIES: Record<DomainId, DomainProperties> = {
  sign: {
    name: "Sign",
    height: "3 (finite)",
    width: "3",
    needsWidening: false,
    description: "5-element flat lattice: Bot < {Neg, Zero, Pos} < Top. Captures the sign of integers. Finite height guarantees termination without widening.",
  },
  constant: {
    name: "Constant Propagation",
    height: "2 (finite)",
    width: "Infinite",
    needsWidening: false,
    description: "Flat lattice: Bot < Const(n) < Top, for all integers n. Infinite width but finite height (2), so fixpoint terminates without widening.",
  },
  interval: {
    name: "Interval",
    height: "Infinite",
    width: "Infinite",
    needsWidening: true,
    description: "Intervals [lo, hi] with -Inf/+Inf bounds. Both infinite height and width. REQUIRES widening to guarantee termination on loops.",
  },
};

// --- Abstract environment (per-statement snapshot) -------------------------

/** A single variable's abstract value in a given domain */
export interface AbstractValue {
  variable: string;
  sign: string;      // e.g. "Pos", "Zero", "Top"
  constant: string;   // e.g. "Const(5)", "Top", "Bot"
  interval: string;   // e.g. "[5,5]", "[0,+Inf]", "Bot"
}

/** One step in the abstract execution */
export interface AbstractStep {
  /** The statement being executed */
  statement: string;
  /** Line number (1-indexed) */
  line: number;
  /** Environment after this statement executes */
  env: AbstractValue[];
  /** Optional warning (e.g., div-by-zero) */
  warning?: string;
  /** Whether widening was applied in this step */
  widened?: boolean;
  /** Explanation of what happened */
  explanation: string;
}

// --- Top-level program -----------------------------------------------------

export interface AbstractInterpProgram {
  id: string;
  name: string;
  shortName: string;
  description: string;
  code: string;
  /** Step-by-step abstract execution */
  steps: AbstractStep[];
  /** Key teaching point for this program */
  teachingPoint: string;
}

// ===========================================================================
// Program 1: constant-assign
// ===========================================================================

const constantAssign: AbstractInterpProgram = {
  id: "constant-assign",
  name: "Simple Assignment",
  shortName: "Assign",
  description: "All three domains agree on a simple linear program — the best case for abstract interpretation.",
  teachingPoint: "When code is purely linear with known constants, all domains produce precise results. This is the ideal case.",
  code: `x = 5
y = 3
z = x + y`,
  steps: [
    {
      statement: "x = 5",
      line: 1,
      env: [
        { variable: "x", sign: "Pos", constant: "Const(5)", interval: "[5, 5]" },
      ],
      explanation: "Assign literal 5 to x. All domains capture this precisely.",
    },
    {
      statement: "y = 3",
      line: 2,
      env: [
        { variable: "x", sign: "Pos", constant: "Const(5)", interval: "[5, 5]" },
        { variable: "y", sign: "Pos", constant: "Const(3)", interval: "[3, 3]" },
      ],
      explanation: "Assign literal 3 to y. Still fully precise in all domains.",
    },
    {
      statement: "z = x + y",
      line: 3,
      env: [
        { variable: "x", sign: "Pos", constant: "Const(5)", interval: "[5, 5]" },
        { variable: "y", sign: "Pos", constant: "Const(3)", interval: "[3, 3]" },
        { variable: "z", sign: "Pos", constant: "Const(8)", interval: "[8, 8]" },
      ],
      explanation: "Pos + Pos = Pos. Const(5) + Const(3) = Const(8). [5,5] + [3,3] = [8,8]. All domains agree: z = 8.",
    },
  ],
};

// ===========================================================================
// Program 2: div-by-zero
// ===========================================================================

const divByZero: AbstractInterpProgram = {
  id: "div-by-zero",
  name: "Division by Zero",
  shortName: "DivZero",
  description: "Abstract interpretation catches a division by zero that testing might miss.",
  teachingPoint: "This is the motivating example: b = a - a is always Zero. 10/Zero is always a crash. Static analysis catches this without running the code.",
  code: `a = 10
b = a - a
c = 10 / b`,
  steps: [
    {
      statement: "a = 10",
      line: 1,
      env: [
        { variable: "a", sign: "Pos", constant: "Const(10)", interval: "[10, 10]" },
      ],
      explanation: "Assign literal 10 to a.",
    },
    {
      statement: "b = a - a",
      line: 2,
      env: [
        { variable: "a", sign: "Pos", constant: "Const(10)", interval: "[10, 10]" },
        { variable: "b", sign: "Zero", constant: "Const(0)", interval: "[0, 0]" },
      ],
      explanation: "a - a = 0 always. Sign: Pos - Pos = Top normally, but the constant domain computes Const(10) - Const(10) = Const(0), and interval gives [10,10] - [10,10] = [0,0]. Sign also knows x - x = Zero.",
    },
    {
      statement: "c = 10 / b",
      line: 3,
      env: [
        { variable: "a", sign: "Pos", constant: "Const(10)", interval: "[10, 10]" },
        { variable: "b", sign: "Zero", constant: "Const(0)", interval: "[0, 0]" },
        { variable: "c", sign: "Top", constant: "Top", interval: "Top" },
      ],
      warning: "Division by zero! b is Zero/Const(0)/[0,0] — dividing by zero always crashes.",
      explanation: "All three domains detect that b contains zero. Division by a value that includes zero triggers a warning. This is the power of abstract interpretation: catching runtime errors statically.",
    },
  ],
};

// ===========================================================================
// Program 3: branch-merge
// ===========================================================================

const branchMerge: AbstractInterpProgram = {
  id: "branch-merge",
  name: "Branch & Merge",
  shortName: "Branch",
  description: "After an if-else, domains differ in precision at the merge point.",
  teachingPoint: "At merge points, the constant domain loses all precision (Top), but the interval domain keeps the tight range [11, 21]. This is where domain choice matters.",
  code: `a = input()  // assume > 0
if a == 10 then
  a = 10
else
  a = 20
b = a + 1`,
  steps: [
    {
      statement: "a = input()  // assume > 0",
      line: 1,
      env: [
        { variable: "a", sign: "Pos", constant: "Top", interval: "[1, +Inf]" },
      ],
      explanation: "Input is unknown. Sign: assume Pos. Constant: Top (unknown). Interval: [1, +Inf] (assume positive).",
    },
    {
      statement: "if a == 10: then branch: a = 10",
      line: 3,
      env: [
        { variable: "a", sign: "Pos", constant: "Const(10)", interval: "[10, 10]" },
      ],
      explanation: "Then branch: a is exactly 10. All domains capture this.",
    },
    {
      statement: "else branch: a = 20",
      line: 5,
      env: [
        { variable: "a", sign: "Pos", constant: "Const(20)", interval: "[20, 20]" },
      ],
      explanation: "Else branch: a is exactly 20. All domains capture this.",
    },
    {
      statement: "Merge point (join then/else)",
      line: 6,
      env: [
        { variable: "a", sign: "Pos", constant: "Top", interval: "[10, 20]" },
      ],
      explanation: "JOIN: Sign: join(Pos, Pos) = Pos. Constant: join(Const(10), Const(20)) = Top (lost precision!). Interval: join([10,10], [20,20]) = [10, 20] (precise range!).",
    },
    {
      statement: "b = a + 1",
      line: 6,
      env: [
        { variable: "a", sign: "Pos", constant: "Top", interval: "[10, 20]" },
        { variable: "b", sign: "Pos", constant: "Top", interval: "[11, 21]" },
      ],
      explanation: "Sign: Pos + Pos = Pos. Constant: Top + Const(1) = Top. Interval: [10,20] + [1,1] = [11, 21]. The interval domain preserves the useful range.",
    },
  ],
};

// ===========================================================================
// Program 4: loop-counter
// ===========================================================================

const loopCounter: AbstractInterpProgram = {
  id: "loop-counter",
  name: "Loop Counter",
  shortName: "Loop",
  description: "Demonstrates why widening is essential for loops in the interval domain.",
  teachingPoint: "Without widening, the interval domain would compute [0,0] → [0,1] → [0,2] → ... forever. Widening jumps to [0, +Inf] in one step, guaranteeing termination.",
  code: `i = 0
while i < 10:
  i = i + 1
// after loop`,
  steps: [
    {
      statement: "i = 0",
      line: 1,
      env: [
        { variable: "i", sign: "Zero", constant: "Const(0)", interval: "[0, 0]" },
      ],
      explanation: "Initialize loop counter to 0. All domains precise.",
    },
    {
      statement: "Loop iteration 1: i = i + 1",
      line: 3,
      env: [
        { variable: "i", sign: "Pos", constant: "Top", interval: "[0, 1]" },
      ],
      explanation: "After first iteration: Sign join(Zero, Pos) = Top, but we know i >= 0 so Pos. Constant: join(Const(0), Const(1)) = Top. Interval (no widening): join([0,0], [1,1]) = [0, 1].",
    },
    {
      statement: "Loop iteration 2: i = i + 1 (without widening)",
      line: 3,
      env: [
        { variable: "i", sign: "Pos", constant: "Top", interval: "[0, 2]" },
      ],
      explanation: "Without widening: [0,1] + [1,1] = [1,2], join with [0,0] gives [0, 2]. The upper bound keeps growing: [0,1] → [0,2] → [0,3] → ... This never converges!",
    },
    {
      statement: "WIDENING applied: i = i + 1",
      line: 3,
      widened: true,
      env: [
        { variable: "i", sign: "Pos", constant: "Top", interval: "[0, +Inf]" },
      ],
      explanation: "Widening detects the upper bound is increasing (0 → 1 → 2 → ...) and jumps to +Inf. Result: [0, +Inf]. Now the interval is stable — the fixpoint has been reached in just 2 widening steps!",
    },
    {
      statement: "After loop (all domains)",
      line: 4,
      env: [
        { variable: "i", sign: "Pos", constant: "Top", interval: "[0, +Inf]" },
      ],
      explanation: "After the loop: Sign knows i is Pos (non-negative). Constant lost all info (Top). Interval says [0, +Inf] — overapproximation due to widening, but sound. The actual value is 10, but soundness > precision.",
    },
  ],
};

// ===========================================================================
// Program 5: safe-division
// ===========================================================================

const safeDivision: AbstractInterpProgram = {
  id: "safe-division",
  name: "Safe Division",
  shortName: "SafeDiv",
  description: "All domains confirm this division is safe — y can never be zero.",
  teachingPoint: "Abstract interpretation doesn't just find bugs — it also proves their absence. Here, all domains confirm y is strictly positive, so the division is safe.",
  code: `x = 5
y = x + 1
z = 100 / y`,
  steps: [
    {
      statement: "x = 5",
      line: 1,
      env: [
        { variable: "x", sign: "Pos", constant: "Const(5)", interval: "[5, 5]" },
      ],
      explanation: "Assign literal 5 to x.",
    },
    {
      statement: "y = x + 1",
      line: 2,
      env: [
        { variable: "x", sign: "Pos", constant: "Const(5)", interval: "[5, 5]" },
        { variable: "y", sign: "Pos", constant: "Const(6)", interval: "[6, 6]" },
      ],
      explanation: "y = 5 + 1 = 6. All domains: Pos / Const(6) / [6, 6].",
    },
    {
      statement: "z = 100 / y",
      line: 3,
      env: [
        { variable: "x", sign: "Pos", constant: "Const(5)", interval: "[5, 5]" },
        { variable: "y", sign: "Pos", constant: "Const(6)", interval: "[6, 6]" },
        { variable: "z", sign: "Pos", constant: "Const(16)", interval: "[16, 16]" },
      ],
      explanation: "y is Pos / Const(6) / [6,6] — never zero! Division is safe. Result: 100/6 = 16 (integer division). No warning needed.",
    },
  ],
};

// ===========================================================================
// Export
// ===========================================================================

export const ABSINTERP_PROGRAMS: AbstractInterpProgram[] = [
  constantAssign,
  divByZero,
  branchMerge,
  loopCounter,
  safeDivision,
];

export function getAbsInterpProgram(id: string): AbstractInterpProgram | undefined {
  return ABSINTERP_PROGRAMS.find((p) => p.id === id);
}
