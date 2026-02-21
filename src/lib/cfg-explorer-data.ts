// ---------------------------------------------------------------------------
// CFG Explorer data — interfaces + 5 pre-computed snippets
// ---------------------------------------------------------------------------

/** A single basic block in a control-flow graph */
export interface CFGBlock {
  id: string;
  label: string; // short display name, e.g. "B1"
  kind: "entry" | "exit" | "stmt" | "cond" | "call";
  /** Lines of code in this block */
  code: string[];
  /** Source line numbers (1-indexed) contained in this block */
  sourceLines: number[];
}

/** A directed edge between blocks */
export interface CFGEdge {
  from: string;
  to: string;
  label?: string; // e.g. "true", "false", "fallthrough"
}

// --- Reaching Definitions ---------------------------------------------------

export interface ReachingDefBlockInfo {
  blockId: string;
  gen: string[]; // definitions generated, e.g. ["d1: x=3"]
  kill: string[]; // definitions killed
  /** Per-iteration IN/OUT sets — index 0 = initial, index 1 = iteration 1, ... */
  iterations: { in: string[]; out: string[] }[];
}

// --- Live Variables ---------------------------------------------------------

export interface LiveVarBlockInfo {
  blockId: string;
  use: string[]; // variables used before redefinition
  def: string[]; // variables defined
  /** Per-iteration IN/OUT — backward analysis, index 0 = initial */
  iterations: { in: string[]; out: string[] }[];
}

// --- Call Graph (for multi-function snippet) --------------------------------

export interface CallGraphNode {
  id: string;
  name: string;
  isRecursive: boolean;
}

export interface CallGraphEdge {
  from: string;
  to: string;
}

// --- Top-level snippet ------------------------------------------------------

export interface CFGSnippet {
  id: string;
  name: string;
  shortName: string;
  description: string;
  code: string;
  blocks: CFGBlock[];
  edges: CFGEdge[];
  reachingDefs: ReachingDefBlockInfo[];
  liveVars: LiveVarBlockInfo[];
  /** Only present for multi-function snippet */
  callGraph?: {
    nodes: CallGraphNode[];
    edges: CallGraphEdge[];
    reachableFrom: Record<string, string[]>; // fn → set of reachable fns
  };
}

// ===========================================================================
// Snippet 1: simple-sequence
// ===========================================================================
// let x = 3
// let y = x + 1
// let z = x + y
const simpleSequence: CFGSnippet = {
  id: "simple-sequence",
  name: "Simple Sequence",
  shortName: "Seq",
  description: "Linear ENTRY → B1 → EXIT. All definitions reach the end. All variables live at start.",
  code: `let x = 3
let y = x + 1
let z = x + y`,
  blocks: [
    { id: "ENTRY", label: "ENTRY", kind: "entry", code: [], sourceLines: [] },
    {
      id: "B1",
      label: "B1",
      kind: "stmt",
      code: ["x = 3", "y = x + 1", "z = x + y"],
      sourceLines: [1, 2, 3],
    },
    { id: "EXIT", label: "EXIT", kind: "exit", code: [], sourceLines: [] },
  ],
  edges: [
    { from: "ENTRY", to: "B1" },
    { from: "B1", to: "EXIT" },
  ],
  reachingDefs: [
    {
      blockId: "ENTRY",
      gen: [],
      kill: [],
      iterations: [
        { in: [], out: [] },
        { in: [], out: [] },
      ],
    },
    {
      blockId: "B1",
      gen: ["d1: x=3", "d2: y=x+1", "d3: z=x+y"],
      kill: [],
      iterations: [
        { in: [], out: [] },
        { in: [], out: ["d1: x=3", "d2: y=x+1", "d3: z=x+y"] },
      ],
    },
    {
      blockId: "EXIT",
      gen: [],
      kill: [],
      iterations: [
        { in: [], out: [] },
        { in: ["d1: x=3", "d2: y=x+1", "d3: z=x+y"], out: ["d1: x=3", "d2: y=x+1", "d3: z=x+y"] },
      ],
    },
  ],
  liveVars: [
    {
      blockId: "ENTRY",
      use: [],
      def: [],
      iterations: [
        { in: [], out: [] },
        { in: ["x"], out: ["x"] },
      ],
    },
    {
      blockId: "B1",
      use: ["x", "y"],
      def: ["x", "y", "z"],
      iterations: [
        { in: [], out: [] },
        { in: ["x"], out: [] },
      ],
    },
    {
      blockId: "EXIT",
      use: [],
      def: [],
      iterations: [
        { in: [], out: [] },
        { in: [], out: [] },
      ],
    },
  ],
};

// ===========================================================================
// Snippet 2: if-else-diamond
// ===========================================================================
// let x = 10
// let y = 0
// if x > 5 then
//   y = x + 1
// else
//   y = x - 1
// let z = y
const ifElseDiamond: CFGSnippet = {
  id: "if-else-diamond",
  name: "If-Else Diamond",
  shortName: "Diamond",
  description: "Classic diamond: ENTRY → cond → then/else → join → EXIT. Definitions from both branches merge at join.",
  code: `let x = 10
let y = 0
if x > 5 then
  y = x + 1
else
  y = x - 1
let z = y`,
  blocks: [
    { id: "ENTRY", label: "ENTRY", kind: "entry", code: [], sourceLines: [] },
    { id: "B1", label: "B1", kind: "stmt", code: ["x = 10", "y = 0"], sourceLines: [1, 2] },
    { id: "B2", label: "B2", kind: "cond", code: ["if x > 5"], sourceLines: [3] },
    { id: "B3", label: "B3 (then)", kind: "stmt", code: ["y = x + 1"], sourceLines: [4] },
    { id: "B4", label: "B4 (else)", kind: "stmt", code: ["y = x - 1"], sourceLines: [6] },
    { id: "B5", label: "B5 (join)", kind: "stmt", code: ["z = y"], sourceLines: [7] },
    { id: "EXIT", label: "EXIT", kind: "exit", code: [], sourceLines: [] },
  ],
  edges: [
    { from: "ENTRY", to: "B1" },
    { from: "B1", to: "B2" },
    { from: "B2", to: "B3", label: "true" },
    { from: "B2", to: "B4", label: "false" },
    { from: "B3", to: "B5" },
    { from: "B4", to: "B5" },
    { from: "B5", to: "EXIT" },
  ],
  reachingDefs: [
    {
      blockId: "ENTRY",
      gen: [],
      kill: [],
      iterations: [
        { in: [], out: [] },
        { in: [], out: [] },
      ],
    },
    {
      blockId: "B1",
      gen: ["d1: x=10", "d2: y=0"],
      kill: [],
      iterations: [
        { in: [], out: [] },
        { in: [], out: ["d1: x=10", "d2: y=0"] },
      ],
    },
    {
      blockId: "B2",
      gen: [],
      kill: [],
      iterations: [
        { in: [], out: [] },
        { in: ["d1: x=10", "d2: y=0"], out: ["d1: x=10", "d2: y=0"] },
      ],
    },
    {
      blockId: "B3",
      gen: ["d3: y=x+1"],
      kill: ["d2: y=0", "d4: y=x-1"],
      iterations: [
        { in: [], out: [] },
        { in: ["d1: x=10", "d2: y=0"], out: ["d1: x=10", "d3: y=x+1"] },
      ],
    },
    {
      blockId: "B4",
      gen: ["d4: y=x-1"],
      kill: ["d2: y=0", "d3: y=x+1"],
      iterations: [
        { in: [], out: [] },
        { in: ["d1: x=10", "d2: y=0"], out: ["d1: x=10", "d4: y=x-1"] },
      ],
    },
    {
      blockId: "B5",
      gen: ["d5: z=y"],
      kill: [],
      iterations: [
        { in: [], out: [] },
        {
          in: ["d1: x=10", "d3: y=x+1", "d4: y=x-1"],
          out: ["d1: x=10", "d3: y=x+1", "d4: y=x-1", "d5: z=y"],
        },
      ],
    },
    {
      blockId: "EXIT",
      gen: [],
      kill: [],
      iterations: [
        { in: [], out: [] },
        {
          in: ["d1: x=10", "d3: y=x+1", "d4: y=x-1", "d5: z=y"],
          out: ["d1: x=10", "d3: y=x+1", "d4: y=x-1", "d5: z=y"],
        },
      ],
    },
  ],
  liveVars: [
    {
      blockId: "ENTRY",
      use: [],
      def: [],
      iterations: [
        { in: [], out: [] },
        { in: [], out: [] },
      ],
    },
    {
      blockId: "B1",
      use: [],
      def: ["x", "y"],
      iterations: [
        { in: [], out: [] },
        { in: [], out: ["x"] },
      ],
    },
    {
      blockId: "B2",
      use: ["x"],
      def: [],
      iterations: [
        { in: [], out: [] },
        { in: ["x"], out: ["x"] },
      ],
    },
    {
      blockId: "B3",
      use: ["x"],
      def: ["y"],
      iterations: [
        { in: [], out: [] },
        { in: ["x"], out: ["y"] },
      ],
    },
    {
      blockId: "B4",
      use: ["x"],
      def: ["y"],
      iterations: [
        { in: [], out: [] },
        { in: ["x"], out: ["y"] },
      ],
    },
    {
      blockId: "B5",
      use: ["y"],
      def: ["z"],
      iterations: [
        { in: [], out: [] },
        { in: ["y"], out: [] },
      ],
    },
    {
      blockId: "EXIT",
      use: [],
      def: [],
      iterations: [
        { in: [], out: [] },
        { in: [], out: [] },
      ],
    },
  ],
};

// ===========================================================================
// Snippet 3: while-loop
// ===========================================================================
// let x = 0
// let y = 10
// while x < y do
//   x = x + 1
//   y = y - 1
// let result = x
const whileLoop: CFGSnippet = {
  id: "while-loop",
  name: "While Loop",
  shortName: "Loop",
  description: "Back edge: ENTRY → pre → cond → body → cond. Fixpoint requires 2+ iterations. Live vars flow backward through loop.",
  code: `let x = 0
let y = 10
while x < y do
  x = x + 1
  y = y - 1
let result = x`,
  blocks: [
    { id: "ENTRY", label: "ENTRY", kind: "entry", code: [], sourceLines: [] },
    { id: "B1", label: "B1 (pre)", kind: "stmt", code: ["x = 0", "y = 10"], sourceLines: [1, 2] },
    { id: "B2", label: "B2 (cond)", kind: "cond", code: ["while x < y"], sourceLines: [3] },
    { id: "B3", label: "B3 (body)", kind: "stmt", code: ["x = x + 1", "y = y - 1"], sourceLines: [4, 5] },
    { id: "B4", label: "B4 (after)", kind: "stmt", code: ["result = x"], sourceLines: [6] },
    { id: "EXIT", label: "EXIT", kind: "exit", code: [], sourceLines: [] },
  ],
  edges: [
    { from: "ENTRY", to: "B1" },
    { from: "B1", to: "B2" },
    { from: "B2", to: "B3", label: "true" },
    { from: "B2", to: "B4", label: "false" },
    { from: "B3", to: "B2", label: "back" },
    { from: "B4", to: "EXIT" },
  ],
  reachingDefs: [
    {
      blockId: "ENTRY",
      gen: [],
      kill: [],
      iterations: [
        { in: [], out: [] },
        { in: [], out: [] },
        { in: [], out: [] },
      ],
    },
    {
      blockId: "B1",
      gen: ["d1: x=0", "d2: y=10"],
      kill: ["d3: x=x+1", "d4: y=y-1"],
      iterations: [
        { in: [], out: [] },
        { in: [], out: ["d1: x=0", "d2: y=10"] },
        { in: [], out: ["d1: x=0", "d2: y=10"] },
      ],
    },
    {
      blockId: "B2",
      gen: [],
      kill: [],
      iterations: [
        { in: [], out: [] },
        { in: ["d1: x=0", "d2: y=10"], out: ["d1: x=0", "d2: y=10"] },
        {
          in: ["d1: x=0", "d2: y=10", "d3: x=x+1", "d4: y=y-1"],
          out: ["d1: x=0", "d2: y=10", "d3: x=x+1", "d4: y=y-1"],
        },
      ],
    },
    {
      blockId: "B3",
      gen: ["d3: x=x+1", "d4: y=y-1"],
      kill: ["d1: x=0", "d2: y=10"],
      iterations: [
        { in: [], out: [] },
        { in: ["d1: x=0", "d2: y=10"], out: ["d3: x=x+1", "d4: y=y-1"] },
        {
          in: ["d1: x=0", "d2: y=10", "d3: x=x+1", "d4: y=y-1"],
          out: ["d3: x=x+1", "d4: y=y-1"],
        },
      ],
    },
    {
      blockId: "B4",
      gen: ["d5: result=x"],
      kill: [],
      iterations: [
        { in: [], out: [] },
        { in: ["d1: x=0", "d2: y=10"], out: ["d1: x=0", "d2: y=10", "d5: result=x"] },
        {
          in: ["d1: x=0", "d2: y=10", "d3: x=x+1", "d4: y=y-1"],
          out: ["d1: x=0", "d2: y=10", "d3: x=x+1", "d4: y=y-1", "d5: result=x"],
        },
      ],
    },
    {
      blockId: "EXIT",
      gen: [],
      kill: [],
      iterations: [
        { in: [], out: [] },
        { in: ["d1: x=0", "d2: y=10", "d5: result=x"], out: ["d1: x=0", "d2: y=10", "d5: result=x"] },
        {
          in: ["d1: x=0", "d2: y=10", "d3: x=x+1", "d4: y=y-1", "d5: result=x"],
          out: ["d1: x=0", "d2: y=10", "d3: x=x+1", "d4: y=y-1", "d5: result=x"],
        },
      ],
    },
  ],
  liveVars: [
    {
      blockId: "ENTRY",
      use: [],
      def: [],
      iterations: [
        { in: [], out: [] },
        { in: [], out: [] },
        { in: [], out: [] },
      ],
    },
    {
      blockId: "B1",
      use: [],
      def: ["x", "y"],
      iterations: [
        { in: [], out: [] },
        { in: [], out: ["x", "y"] },
        { in: [], out: ["x", "y"] },
      ],
    },
    {
      blockId: "B2",
      use: ["x", "y"],
      def: [],
      iterations: [
        { in: [], out: [] },
        { in: ["x", "y"], out: ["x"] },
        { in: ["x", "y"], out: ["x", "y"] },
      ],
    },
    {
      blockId: "B3",
      use: ["x", "y"],
      def: ["x", "y"],
      iterations: [
        { in: [], out: [] },
        { in: ["x", "y"], out: ["x", "y"] },
        { in: ["x", "y"], out: ["x", "y"] },
      ],
    },
    {
      blockId: "B4",
      use: ["x"],
      def: ["result"],
      iterations: [
        { in: [], out: [] },
        { in: ["x"], out: [] },
        { in: ["x"], out: [] },
      ],
    },
    {
      blockId: "EXIT",
      use: [],
      def: [],
      iterations: [
        { in: [], out: [] },
        { in: [], out: [] },
        { in: [], out: [] },
      ],
    },
  ],
};

// ===========================================================================
// Snippet 4: nested-branches
// ===========================================================================
// let x = 5
// let y = 0
// let z = 0
// if x > 0 then
//   if x > 3 then
//     y = x * 2
//   else
//     y = x + 2
//   z = y + 1
// else
//   z = 0
// let w = z
const nestedBranches: CFGSnippet = {
  id: "nested-branches",
  name: "Nested Branches",
  shortName: "Nested",
  description: "Nested if inside if. Shows multiple merge points. Complex gen/kill interaction.",
  code: `let x = 5
let y = 0
let z = 0
if x > 0 then
  if x > 3 then
    y = x * 2
  else
    y = x + 2
  z = y + 1
else
  z = 0
let w = z`,
  blocks: [
    { id: "ENTRY", label: "ENTRY", kind: "entry", code: [], sourceLines: [] },
    { id: "B1", label: "B1", kind: "stmt", code: ["x = 5", "y = 0", "z = 0"], sourceLines: [1, 2, 3] },
    { id: "B2", label: "B2 (outer-if)", kind: "cond", code: ["if x > 0"], sourceLines: [4] },
    { id: "B3", label: "B3 (inner-if)", kind: "cond", code: ["if x > 3"], sourceLines: [5] },
    { id: "B4", label: "B4 (inner-then)", kind: "stmt", code: ["y = x * 2"], sourceLines: [6] },
    { id: "B5", label: "B5 (inner-else)", kind: "stmt", code: ["y = x + 2"], sourceLines: [8] },
    { id: "B6", label: "B6 (inner-join)", kind: "stmt", code: ["z = y + 1"], sourceLines: [9] },
    { id: "B7", label: "B7 (outer-else)", kind: "stmt", code: ["z = 0"], sourceLines: [11] },
    { id: "B8", label: "B8 (outer-join)", kind: "stmt", code: ["w = z"], sourceLines: [12] },
    { id: "EXIT", label: "EXIT", kind: "exit", code: [], sourceLines: [] },
  ],
  edges: [
    { from: "ENTRY", to: "B1" },
    { from: "B1", to: "B2" },
    { from: "B2", to: "B3", label: "true" },
    { from: "B2", to: "B7", label: "false" },
    { from: "B3", to: "B4", label: "true" },
    { from: "B3", to: "B5", label: "false" },
    { from: "B4", to: "B6" },
    { from: "B5", to: "B6" },
    { from: "B6", to: "B8" },
    { from: "B7", to: "B8" },
    { from: "B8", to: "EXIT" },
  ],
  reachingDefs: [
    {
      blockId: "ENTRY", gen: [], kill: [],
      iterations: [{ in: [], out: [] }, { in: [], out: [] }],
    },
    {
      blockId: "B1",
      gen: ["d1: x=5", "d2: y=0", "d3: z=0"],
      kill: [],
      iterations: [
        { in: [], out: [] },
        { in: [], out: ["d1: x=5", "d2: y=0", "d3: z=0"] },
      ],
    },
    {
      blockId: "B2", gen: [], kill: [],
      iterations: [
        { in: [], out: [] },
        { in: ["d1: x=5", "d2: y=0", "d3: z=0"], out: ["d1: x=5", "d2: y=0", "d3: z=0"] },
      ],
    },
    {
      blockId: "B3", gen: [], kill: [],
      iterations: [
        { in: [], out: [] },
        { in: ["d1: x=5", "d2: y=0", "d3: z=0"], out: ["d1: x=5", "d2: y=0", "d3: z=0"] },
      ],
    },
    {
      blockId: "B4",
      gen: ["d4: y=x*2"],
      kill: ["d2: y=0", "d5: y=x+2"],
      iterations: [
        { in: [], out: [] },
        { in: ["d1: x=5", "d2: y=0", "d3: z=0"], out: ["d1: x=5", "d3: z=0", "d4: y=x*2"] },
      ],
    },
    {
      blockId: "B5",
      gen: ["d5: y=x+2"],
      kill: ["d2: y=0", "d4: y=x*2"],
      iterations: [
        { in: [], out: [] },
        { in: ["d1: x=5", "d2: y=0", "d3: z=0"], out: ["d1: x=5", "d3: z=0", "d5: y=x+2"] },
      ],
    },
    {
      blockId: "B6",
      gen: ["d6: z=y+1"],
      kill: ["d3: z=0", "d7: z=0(else)"],
      iterations: [
        { in: [], out: [] },
        {
          in: ["d1: x=5", "d3: z=0", "d4: y=x*2", "d5: y=x+2"],
          out: ["d1: x=5", "d4: y=x*2", "d5: y=x+2", "d6: z=y+1"],
        },
      ],
    },
    {
      blockId: "B7",
      gen: ["d7: z=0(else)"],
      kill: ["d3: z=0", "d6: z=y+1"],
      iterations: [
        { in: [], out: [] },
        { in: ["d1: x=5", "d2: y=0", "d3: z=0"], out: ["d1: x=5", "d2: y=0", "d7: z=0(else)"] },
      ],
    },
    {
      blockId: "B8",
      gen: ["d8: w=z"],
      kill: [],
      iterations: [
        { in: [], out: [] },
        {
          in: ["d1: x=5", "d2: y=0", "d4: y=x*2", "d5: y=x+2", "d6: z=y+1", "d7: z=0(else)"],
          out: ["d1: x=5", "d2: y=0", "d4: y=x*2", "d5: y=x+2", "d6: z=y+1", "d7: z=0(else)", "d8: w=z"],
        },
      ],
    },
    {
      blockId: "EXIT", gen: [], kill: [],
      iterations: [
        { in: [], out: [] },
        {
          in: ["d1: x=5", "d2: y=0", "d4: y=x*2", "d5: y=x+2", "d6: z=y+1", "d7: z=0(else)", "d8: w=z"],
          out: ["d1: x=5", "d2: y=0", "d4: y=x*2", "d5: y=x+2", "d6: z=y+1", "d7: z=0(else)", "d8: w=z"],
        },
      ],
    },
  ],
  liveVars: [
    {
      blockId: "ENTRY", use: [], def: [],
      iterations: [{ in: [], out: [] }, { in: [], out: [] }],
    },
    {
      blockId: "B1", use: [], def: ["x", "y", "z"],
      iterations: [{ in: [], out: [] }, { in: [], out: ["x"] }],
    },
    {
      blockId: "B2", use: ["x"], def: [],
      iterations: [{ in: [], out: [] }, { in: ["x"], out: ["x", "y", "z"] }],
    },
    {
      blockId: "B3", use: ["x"], def: [],
      iterations: [{ in: [], out: [] }, { in: ["x"], out: ["x"] }],
    },
    {
      blockId: "B4", use: ["x"], def: ["y"],
      iterations: [{ in: [], out: [] }, { in: ["x"], out: ["y"] }],
    },
    {
      blockId: "B5", use: ["x"], def: ["y"],
      iterations: [{ in: [], out: [] }, { in: ["x"], out: ["y"] }],
    },
    {
      blockId: "B6", use: ["y"], def: ["z"],
      iterations: [{ in: [], out: [] }, { in: ["y"], out: ["z"] }],
    },
    {
      blockId: "B7", use: [], def: ["z"],
      iterations: [{ in: [], out: [] }, { in: [], out: ["z"] }],
    },
    {
      blockId: "B8", use: ["z"], def: ["w"],
      iterations: [{ in: [], out: [] }, { in: ["z"], out: [] }],
    },
    {
      blockId: "EXIT", use: [], def: [],
      iterations: [{ in: [], out: [] }, { in: [], out: [] }],
    },
  ],
};

// ===========================================================================
// Snippet 5: multi-function
// ===========================================================================
// def main():
//   let a = 1
//   let b = process(a)
//   return b
//
// def process(x):
//   let y = x + 1
//   let z = helper(y)
//   return z
//
// def helper(n):
//   return n * 2
const multiFunction: CFGSnippet = {
  id: "multi-function",
  name: "Multi-Function",
  shortName: "Multi",
  description: "3 functions with calls. Call graph: main → process → helper. Reachability + recursion detection.",
  code: `def main():
  let a = 1
  let b = process(a)
  return b

def process(x):
  let y = x + 1
  let z = helper(y)
  return z

def helper(n):
  return n * 2`,
  blocks: [
    // main's CFG
    { id: "main_ENTRY", label: "main:ENTRY", kind: "entry", code: [], sourceLines: [] },
    { id: "main_B1", label: "main:B1", kind: "stmt", code: ["a = 1"], sourceLines: [2] },
    { id: "main_B2", label: "main:B2", kind: "call", code: ["b = process(a)"], sourceLines: [3] },
    { id: "main_B3", label: "main:B3", kind: "stmt", code: ["return b"], sourceLines: [4] },
    { id: "main_EXIT", label: "main:EXIT", kind: "exit", code: [], sourceLines: [] },
    // process's CFG
    { id: "proc_ENTRY", label: "process:ENTRY", kind: "entry", code: [], sourceLines: [] },
    { id: "proc_B1", label: "process:B1", kind: "stmt", code: ["y = x + 1"], sourceLines: [7] },
    { id: "proc_B2", label: "process:B2", kind: "call", code: ["z = helper(y)"], sourceLines: [8] },
    { id: "proc_B3", label: "process:B3", kind: "stmt", code: ["return z"], sourceLines: [9] },
    { id: "proc_EXIT", label: "process:EXIT", kind: "exit", code: [], sourceLines: [] },
    // helper's CFG
    { id: "help_ENTRY", label: "helper:ENTRY", kind: "entry", code: [], sourceLines: [] },
    { id: "help_B1", label: "helper:B1", kind: "stmt", code: ["return n * 2"], sourceLines: [12] },
    { id: "help_EXIT", label: "helper:EXIT", kind: "exit", code: [], sourceLines: [] },
  ],
  edges: [
    // main
    { from: "main_ENTRY", to: "main_B1" },
    { from: "main_B1", to: "main_B2" },
    { from: "main_B2", to: "main_B3" },
    { from: "main_B3", to: "main_EXIT" },
    // process
    { from: "proc_ENTRY", to: "proc_B1" },
    { from: "proc_B1", to: "proc_B2" },
    { from: "proc_B2", to: "proc_B3" },
    { from: "proc_B3", to: "proc_EXIT" },
    // helper
    { from: "help_ENTRY", to: "help_B1" },
    { from: "help_B1", to: "help_EXIT" },
  ],
  reachingDefs: [
    // main
    { blockId: "main_ENTRY", gen: [], kill: [],
      iterations: [{ in: [], out: [] }, { in: [], out: [] }] },
    { blockId: "main_B1", gen: ["d1: a=1"], kill: [],
      iterations: [{ in: [], out: [] }, { in: [], out: ["d1: a=1"] }] },
    { blockId: "main_B2", gen: ["d2: b=process(a)"], kill: [],
      iterations: [{ in: [], out: [] }, { in: ["d1: a=1"], out: ["d1: a=1", "d2: b=process(a)"] }] },
    { blockId: "main_B3", gen: [], kill: [],
      iterations: [{ in: [], out: [] }, { in: ["d1: a=1", "d2: b=process(a)"], out: ["d1: a=1", "d2: b=process(a)"] }] },
    { blockId: "main_EXIT", gen: [], kill: [],
      iterations: [{ in: [], out: [] }, { in: ["d1: a=1", "d2: b=process(a)"], out: ["d1: a=1", "d2: b=process(a)"] }] },
    // process
    { blockId: "proc_ENTRY", gen: [], kill: [],
      iterations: [{ in: [], out: [] }, { in: [], out: [] }] },
    { blockId: "proc_B1", gen: ["d3: y=x+1"], kill: [],
      iterations: [{ in: [], out: [] }, { in: [], out: ["d3: y=x+1"] }] },
    { blockId: "proc_B2", gen: ["d4: z=helper(y)"], kill: [],
      iterations: [{ in: [], out: [] }, { in: ["d3: y=x+1"], out: ["d3: y=x+1", "d4: z=helper(y)"] }] },
    { blockId: "proc_B3", gen: [], kill: [],
      iterations: [{ in: [], out: [] }, { in: ["d3: y=x+1", "d4: z=helper(y)"], out: ["d3: y=x+1", "d4: z=helper(y)"] }] },
    { blockId: "proc_EXIT", gen: [], kill: [],
      iterations: [{ in: [], out: [] }, { in: ["d3: y=x+1", "d4: z=helper(y)"], out: ["d3: y=x+1", "d4: z=helper(y)"] }] },
    // helper
    { blockId: "help_ENTRY", gen: [], kill: [],
      iterations: [{ in: [], out: [] }, { in: [], out: [] }] },
    { blockId: "help_B1", gen: [], kill: [],
      iterations: [{ in: [], out: [] }, { in: [], out: [] }] },
    { blockId: "help_EXIT", gen: [], kill: [],
      iterations: [{ in: [], out: [] }, { in: [], out: [] }] },
  ],
  liveVars: [
    // main
    { blockId: "main_ENTRY", use: [], def: [],
      iterations: [{ in: [], out: [] }, { in: [], out: [] }] },
    { blockId: "main_B1", use: [], def: ["a"],
      iterations: [{ in: [], out: [] }, { in: [], out: ["a"] }] },
    { blockId: "main_B2", use: ["a"], def: ["b"],
      iterations: [{ in: [], out: [] }, { in: ["a"], out: ["b"] }] },
    { blockId: "main_B3", use: ["b"], def: [],
      iterations: [{ in: [], out: [] }, { in: ["b"], out: [] }] },
    { blockId: "main_EXIT", use: [], def: [],
      iterations: [{ in: [], out: [] }, { in: [], out: [] }] },
    // process
    { blockId: "proc_ENTRY", use: [], def: [],
      iterations: [{ in: [], out: [] }, { in: ["x"], out: ["x"] }] },
    { blockId: "proc_B1", use: ["x"], def: ["y"],
      iterations: [{ in: [], out: [] }, { in: ["x"], out: ["y"] }] },
    { blockId: "proc_B2", use: ["y"], def: ["z"],
      iterations: [{ in: [], out: [] }, { in: ["y"], out: ["z"] }] },
    { blockId: "proc_B3", use: ["z"], def: [],
      iterations: [{ in: [], out: [] }, { in: ["z"], out: [] }] },
    { blockId: "proc_EXIT", use: [], def: [],
      iterations: [{ in: [], out: [] }, { in: [], out: [] }] },
    // helper
    { blockId: "help_ENTRY", use: [], def: [],
      iterations: [{ in: [], out: [] }, { in: ["n"], out: ["n"] }] },
    { blockId: "help_B1", use: ["n"], def: [],
      iterations: [{ in: [], out: [] }, { in: ["n"], out: [] }] },
    { blockId: "help_EXIT", use: [], def: [],
      iterations: [{ in: [], out: [] }, { in: [], out: [] }] },
  ],
  callGraph: {
    nodes: [
      { id: "main", name: "main", isRecursive: false },
      { id: "process", name: "process", isRecursive: false },
      { id: "helper", name: "helper", isRecursive: false },
    ],
    edges: [
      { from: "main", to: "process" },
      { from: "process", to: "helper" },
    ],
    reachableFrom: {
      main: ["process", "helper"],
      process: ["helper"],
      helper: [],
    },
  },
};

// ===========================================================================
// Export
// ===========================================================================

export const CFG_SNIPPETS: CFGSnippet[] = [
  simpleSequence,
  ifElseDiamond,
  whileLoop,
  nestedBranches,
  multiFunction,
];

export function getCFGSnippet(id: string): CFGSnippet | undefined {
  return CFG_SNIPPETS.find((s) => s.id === id);
}
