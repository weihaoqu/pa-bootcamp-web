// ── AST Explorer Data ──────────────────────────────────────────────────────
// Pre-computed AST snippets with tree structures, traversals, symbol tables,
// and transformations for the Module 2 AST Explorer.

export interface ASTNode {
  id: string;
  type: string;
  label: string;
  children: ASTNode[];
  sourceLine?: number;
  /** Extra info shown in the tree view tooltip */
  detail?: string;
}

export type TraversalOrder = "pre-order" | "post-order" | "bfs";

export interface TraversalStep {
  nodeId: string;
  order: number;
}

export interface SymbolEntry {
  name: string;
  kind: "variable" | "parameter" | "function";
  scope: string;
  declarationLine: number;
  type?: string;
}

export interface TransformExample {
  name: string;
  description: string;
  before: string;
  after: string;
  changedLines: number[];
}

export interface ASTSnippet {
  id: string;
  name: string;
  shortName: string;
  code: string;
  ast: ASTNode;
  traversals: Record<TraversalOrder, TraversalStep[]>;
  symbols: SymbolEntry[];
  scopes: { name: string; parent: string | null; symbols: string[] }[];
  transforms: TransformExample[];
}

// ── Snippet 1: Simple Arithmetic ──────────────────────────────────────────

const simpleArithmeticAST: ASTNode = {
  id: "prog",
  type: "Program",
  label: "Program",
  children: [
    {
      id: "let-x",
      type: "LetStmt",
      label: "let x = 3 + 4 * 2",
      sourceLine: 1,
      children: [
        { id: "var-x", type: "Var", label: "x", children: [], sourceLine: 1, detail: "binding" },
        {
          id: "add",
          type: "BinOp",
          label: "+",
          sourceLine: 1,
          children: [
            { id: "lit-3", type: "IntLit", label: "3", children: [], sourceLine: 1 },
            {
              id: "mul",
              type: "BinOp",
              label: "*",
              sourceLine: 1,
              children: [
                { id: "lit-4", type: "IntLit", label: "4", children: [], sourceLine: 1 },
                { id: "lit-2", type: "IntLit", label: "2", children: [], sourceLine: 1 },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "let-y",
      type: "LetStmt",
      label: "let y = x + 1",
      sourceLine: 2,
      children: [
        { id: "var-y", type: "Var", label: "y", children: [], sourceLine: 2, detail: "binding" },
        {
          id: "add2",
          type: "BinOp",
          label: "+",
          sourceLine: 2,
          children: [
            { id: "ref-x", type: "Var", label: "x", children: [], sourceLine: 2, detail: "reference" },
            { id: "lit-1", type: "IntLit", label: "1", children: [], sourceLine: 2 },
          ],
        },
      ],
    },
  ],
};

const simpleArithmeticTraversals: Record<TraversalOrder, TraversalStep[]> = {
  "pre-order": [
    { nodeId: "prog", order: 0 },
    { nodeId: "let-x", order: 1 },
    { nodeId: "var-x", order: 2 },
    { nodeId: "add", order: 3 },
    { nodeId: "lit-3", order: 4 },
    { nodeId: "mul", order: 5 },
    { nodeId: "lit-4", order: 6 },
    { nodeId: "lit-2", order: 7 },
    { nodeId: "let-y", order: 8 },
    { nodeId: "var-y", order: 9 },
    { nodeId: "add2", order: 10 },
    { nodeId: "ref-x", order: 11 },
    { nodeId: "lit-1", order: 12 },
  ],
  "post-order": [
    { nodeId: "var-x", order: 0 },
    { nodeId: "lit-3", order: 1 },
    { nodeId: "lit-4", order: 2 },
    { nodeId: "lit-2", order: 3 },
    { nodeId: "mul", order: 4 },
    { nodeId: "add", order: 5 },
    { nodeId: "let-x", order: 6 },
    { nodeId: "var-y", order: 7 },
    { nodeId: "ref-x", order: 8 },
    { nodeId: "lit-1", order: 9 },
    { nodeId: "add2", order: 10 },
    { nodeId: "let-y", order: 11 },
    { nodeId: "prog", order: 12 },
  ],
  "bfs": [
    { nodeId: "prog", order: 0 },
    { nodeId: "let-x", order: 1 },
    { nodeId: "let-y", order: 2 },
    { nodeId: "var-x", order: 3 },
    { nodeId: "add", order: 4 },
    { nodeId: "var-y", order: 5 },
    { nodeId: "add2", order: 6 },
    { nodeId: "lit-3", order: 7 },
    { nodeId: "mul", order: 8 },
    { nodeId: "ref-x", order: 9 },
    { nodeId: "lit-1", order: 10 },
    { nodeId: "lit-4", order: 11 },
    { nodeId: "lit-2", order: 12 },
  ],
};

// ── Snippet 2: Branching ──────────────────────────────────────────────────

const branchingAST: ASTNode = {
  id: "prog",
  type: "Program",
  label: "Program",
  children: [
    {
      id: "let-score",
      type: "LetStmt",
      label: "let score = 85",
      sourceLine: 1,
      children: [
        { id: "var-score", type: "Var", label: "score", children: [], sourceLine: 1, detail: "binding" },
        { id: "lit-85", type: "IntLit", label: "85", children: [], sourceLine: 1 },
      ],
    },
    {
      id: "if-stmt",
      type: "IfStmt",
      label: "if score >= 90",
      sourceLine: 2,
      children: [
        {
          id: "cond",
          type: "BinOp",
          label: ">=",
          sourceLine: 2,
          children: [
            { id: "ref-score1", type: "Var", label: "score", children: [], sourceLine: 2, detail: "reference" },
            { id: "lit-90", type: "IntLit", label: "90", children: [], sourceLine: 2 },
          ],
        },
        {
          id: "then-block",
          type: "Block",
          label: "then",
          sourceLine: 3,
          children: [
            {
              id: "let-grade-a",
              type: "LetStmt",
              label: 'let grade = "A"',
              sourceLine: 3,
              children: [
                { id: "var-grade-a", type: "Var", label: "grade", children: [], sourceLine: 3, detail: "binding" },
                { id: "str-a", type: "StrLit", label: '"A"', children: [], sourceLine: 3 },
              ],
            },
          ],
        },
        {
          id: "else-block",
          type: "Block",
          label: "else",
          sourceLine: 5,
          children: [
            {
              id: "let-grade-b",
              type: "LetStmt",
              label: 'let grade = "B"',
              sourceLine: 5,
              children: [
                { id: "var-grade-b", type: "Var", label: "grade", children: [], sourceLine: 5, detail: "binding" },
                { id: "str-b", type: "StrLit", label: '"B"', children: [], sourceLine: 5 },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const branchingTraversals: Record<TraversalOrder, TraversalStep[]> = {
  "pre-order": [
    { nodeId: "prog", order: 0 },
    { nodeId: "let-score", order: 1 },
    { nodeId: "var-score", order: 2 },
    { nodeId: "lit-85", order: 3 },
    { nodeId: "if-stmt", order: 4 },
    { nodeId: "cond", order: 5 },
    { nodeId: "ref-score1", order: 6 },
    { nodeId: "lit-90", order: 7 },
    { nodeId: "then-block", order: 8 },
    { nodeId: "let-grade-a", order: 9 },
    { nodeId: "var-grade-a", order: 10 },
    { nodeId: "str-a", order: 11 },
    { nodeId: "else-block", order: 12 },
    { nodeId: "let-grade-b", order: 13 },
    { nodeId: "var-grade-b", order: 14 },
    { nodeId: "str-b", order: 15 },
  ],
  "post-order": [
    { nodeId: "var-score", order: 0 },
    { nodeId: "lit-85", order: 1 },
    { nodeId: "let-score", order: 2 },
    { nodeId: "ref-score1", order: 3 },
    { nodeId: "lit-90", order: 4 },
    { nodeId: "cond", order: 5 },
    { nodeId: "var-grade-a", order: 6 },
    { nodeId: "str-a", order: 7 },
    { nodeId: "let-grade-a", order: 8 },
    { nodeId: "then-block", order: 9 },
    { nodeId: "var-grade-b", order: 10 },
    { nodeId: "str-b", order: 11 },
    { nodeId: "let-grade-b", order: 12 },
    { nodeId: "else-block", order: 13 },
    { nodeId: "if-stmt", order: 14 },
    { nodeId: "prog", order: 15 },
  ],
  "bfs": [
    { nodeId: "prog", order: 0 },
    { nodeId: "let-score", order: 1 },
    { nodeId: "if-stmt", order: 2 },
    { nodeId: "var-score", order: 3 },
    { nodeId: "lit-85", order: 4 },
    { nodeId: "cond", order: 5 },
    { nodeId: "then-block", order: 6 },
    { nodeId: "else-block", order: 7 },
    { nodeId: "ref-score1", order: 8 },
    { nodeId: "lit-90", order: 9 },
    { nodeId: "let-grade-a", order: 10 },
    { nodeId: "let-grade-b", order: 11 },
    { nodeId: "var-grade-a", order: 12 },
    { nodeId: "str-a", order: 13 },
    { nodeId: "var-grade-b", order: 14 },
    { nodeId: "str-b", order: 15 },
  ],
};

// ── Snippet 3: Constant Folding ───────────────────────────────────────────

const constantFoldAST: ASTNode = {
  id: "prog",
  type: "Program",
  label: "Program",
  children: [
    {
      id: "let-a",
      type: "LetStmt",
      label: "let a = (2 + 3) * (10 - 4)",
      sourceLine: 1,
      children: [
        { id: "var-a", type: "Var", label: "a", children: [], sourceLine: 1, detail: "binding" },
        {
          id: "mul-top",
          type: "BinOp",
          label: "*",
          sourceLine: 1,
          children: [
            {
              id: "add-left",
              type: "BinOp",
              label: "+",
              sourceLine: 1,
              children: [
                { id: "lit-2a", type: "IntLit", label: "2", children: [], sourceLine: 1 },
                { id: "lit-3a", type: "IntLit", label: "3", children: [], sourceLine: 1 },
              ],
            },
            {
              id: "sub-right",
              type: "BinOp",
              label: "-",
              sourceLine: 1,
              children: [
                { id: "lit-10", type: "IntLit", label: "10", children: [], sourceLine: 1 },
                { id: "lit-4a", type: "IntLit", label: "4", children: [], sourceLine: 1 },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "let-b",
      type: "LetStmt",
      label: "let b = a + 0",
      sourceLine: 2,
      children: [
        { id: "var-b", type: "Var", label: "b", children: [], sourceLine: 2, detail: "binding" },
        {
          id: "add-b",
          type: "BinOp",
          label: "+",
          sourceLine: 2,
          children: [
            { id: "ref-a", type: "Var", label: "a", children: [], sourceLine: 2, detail: "reference" },
            { id: "lit-0", type: "IntLit", label: "0", children: [], sourceLine: 2 },
          ],
        },
      ],
    },
    {
      id: "let-c",
      type: "LetStmt",
      label: "let c = b * 1",
      sourceLine: 3,
      children: [
        { id: "var-c", type: "Var", label: "c", children: [], sourceLine: 3, detail: "binding" },
        {
          id: "mul-c",
          type: "BinOp",
          label: "*",
          sourceLine: 3,
          children: [
            { id: "ref-b", type: "Var", label: "b", children: [], sourceLine: 3, detail: "reference" },
            { id: "lit-1c", type: "IntLit", label: "1", children: [], sourceLine: 3 },
          ],
        },
      ],
    },
  ],
};

const constantFoldTraversals: Record<TraversalOrder, TraversalStep[]> = {
  "pre-order": [
    { nodeId: "prog", order: 0 },
    { nodeId: "let-a", order: 1 },
    { nodeId: "var-a", order: 2 },
    { nodeId: "mul-top", order: 3 },
    { nodeId: "add-left", order: 4 },
    { nodeId: "lit-2a", order: 5 },
    { nodeId: "lit-3a", order: 6 },
    { nodeId: "sub-right", order: 7 },
    { nodeId: "lit-10", order: 8 },
    { nodeId: "lit-4a", order: 9 },
    { nodeId: "let-b", order: 10 },
    { nodeId: "var-b", order: 11 },
    { nodeId: "add-b", order: 12 },
    { nodeId: "ref-a", order: 13 },
    { nodeId: "lit-0", order: 14 },
    { nodeId: "let-c", order: 15 },
    { nodeId: "var-c", order: 16 },
    { nodeId: "mul-c", order: 17 },
    { nodeId: "ref-b", order: 18 },
    { nodeId: "lit-1c", order: 19 },
  ],
  "post-order": [
    { nodeId: "var-a", order: 0 },
    { nodeId: "lit-2a", order: 1 },
    { nodeId: "lit-3a", order: 2 },
    { nodeId: "add-left", order: 3 },
    { nodeId: "lit-10", order: 4 },
    { nodeId: "lit-4a", order: 5 },
    { nodeId: "sub-right", order: 6 },
    { nodeId: "mul-top", order: 7 },
    { nodeId: "let-a", order: 8 },
    { nodeId: "var-b", order: 9 },
    { nodeId: "ref-a", order: 10 },
    { nodeId: "lit-0", order: 11 },
    { nodeId: "add-b", order: 12 },
    { nodeId: "let-b", order: 13 },
    { nodeId: "var-c", order: 14 },
    { nodeId: "ref-b", order: 15 },
    { nodeId: "lit-1c", order: 16 },
    { nodeId: "mul-c", order: 17 },
    { nodeId: "let-c", order: 18 },
    { nodeId: "prog", order: 19 },
  ],
  "bfs": [
    { nodeId: "prog", order: 0 },
    { nodeId: "let-a", order: 1 },
    { nodeId: "let-b", order: 2 },
    { nodeId: "let-c", order: 3 },
    { nodeId: "var-a", order: 4 },
    { nodeId: "mul-top", order: 5 },
    { nodeId: "var-b", order: 6 },
    { nodeId: "add-b", order: 7 },
    { nodeId: "var-c", order: 8 },
    { nodeId: "mul-c", order: 9 },
    { nodeId: "add-left", order: 10 },
    { nodeId: "sub-right", order: 11 },
    { nodeId: "ref-a", order: 12 },
    { nodeId: "lit-0", order: 13 },
    { nodeId: "ref-b", order: 14 },
    { nodeId: "lit-1c", order: 15 },
    { nodeId: "lit-2a", order: 16 },
    { nodeId: "lit-3a", order: 17 },
    { nodeId: "lit-10", order: 18 },
    { nodeId: "lit-4a", order: 19 },
  ],
};

// ── Snippet 4: Dead Code ──────────────────────────────────────────────────

const deadCodeAST: ASTNode = {
  id: "prog",
  type: "Program",
  label: "Program",
  children: [
    {
      id: "func-abs",
      type: "FuncDef",
      label: "function abs(n)",
      sourceLine: 1,
      children: [
        { id: "param-n", type: "Param", label: "n", children: [], sourceLine: 1, detail: "parameter" },
        {
          id: "if-abs",
          type: "IfStmt",
          label: "if n < 0",
          sourceLine: 2,
          children: [
            {
              id: "cond-abs",
              type: "BinOp",
              label: "<",
              sourceLine: 2,
              children: [
                { id: "ref-n1", type: "Var", label: "n", children: [], sourceLine: 2, detail: "reference" },
                { id: "lit-0d", type: "IntLit", label: "0", children: [], sourceLine: 2 },
              ],
            },
            {
              id: "then-abs",
              type: "Block",
              label: "then",
              sourceLine: 3,
              children: [
                {
                  id: "ret-neg",
                  type: "ReturnStmt",
                  label: "return -n",
                  sourceLine: 3,
                  children: [
                    {
                      id: "neg-n",
                      type: "UnaryOp",
                      label: "-",
                      sourceLine: 3,
                      children: [
                        { id: "ref-n2", type: "Var", label: "n", children: [], sourceLine: 3, detail: "reference" },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: "else-abs",
              type: "Block",
              label: "else",
              sourceLine: 5,
              children: [
                {
                  id: "ret-pos",
                  type: "ReturnStmt",
                  label: "return n",
                  sourceLine: 5,
                  children: [
                    { id: "ref-n3", type: "Var", label: "n", children: [], sourceLine: 5, detail: "reference" },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "dead-stmt",
          type: "LetStmt",
          label: "let result = 0  // DEAD",
          sourceLine: 7,
          detail: "unreachable",
          children: [
            { id: "var-result", type: "Var", label: "result", children: [], sourceLine: 7, detail: "binding" },
            { id: "lit-0dead", type: "IntLit", label: "0", children: [], sourceLine: 7 },
          ],
        },
      ],
    },
  ],
};

const deadCodeTraversals: Record<TraversalOrder, TraversalStep[]> = {
  "pre-order": [
    { nodeId: "prog", order: 0 },
    { nodeId: "func-abs", order: 1 },
    { nodeId: "param-n", order: 2 },
    { nodeId: "if-abs", order: 3 },
    { nodeId: "cond-abs", order: 4 },
    { nodeId: "ref-n1", order: 5 },
    { nodeId: "lit-0d", order: 6 },
    { nodeId: "then-abs", order: 7 },
    { nodeId: "ret-neg", order: 8 },
    { nodeId: "neg-n", order: 9 },
    { nodeId: "ref-n2", order: 10 },
    { nodeId: "else-abs", order: 11 },
    { nodeId: "ret-pos", order: 12 },
    { nodeId: "ref-n3", order: 13 },
    { nodeId: "dead-stmt", order: 14 },
    { nodeId: "var-result", order: 15 },
    { nodeId: "lit-0dead", order: 16 },
  ],
  "post-order": [
    { nodeId: "param-n", order: 0 },
    { nodeId: "ref-n1", order: 1 },
    { nodeId: "lit-0d", order: 2 },
    { nodeId: "cond-abs", order: 3 },
    { nodeId: "ref-n2", order: 4 },
    { nodeId: "neg-n", order: 5 },
    { nodeId: "ret-neg", order: 6 },
    { nodeId: "then-abs", order: 7 },
    { nodeId: "ref-n3", order: 8 },
    { nodeId: "ret-pos", order: 9 },
    { nodeId: "else-abs", order: 10 },
    { nodeId: "if-abs", order: 11 },
    { nodeId: "var-result", order: 12 },
    { nodeId: "lit-0dead", order: 13 },
    { nodeId: "dead-stmt", order: 14 },
    { nodeId: "func-abs", order: 15 },
    { nodeId: "prog", order: 16 },
  ],
  "bfs": [
    { nodeId: "prog", order: 0 },
    { nodeId: "func-abs", order: 1 },
    { nodeId: "param-n", order: 2 },
    { nodeId: "if-abs", order: 3 },
    { nodeId: "dead-stmt", order: 4 },
    { nodeId: "cond-abs", order: 5 },
    { nodeId: "then-abs", order: 6 },
    { nodeId: "else-abs", order: 7 },
    { nodeId: "var-result", order: 8 },
    { nodeId: "lit-0dead", order: 9 },
    { nodeId: "ref-n1", order: 10 },
    { nodeId: "lit-0d", order: 11 },
    { nodeId: "ret-neg", order: 12 },
    { nodeId: "ret-pos", order: 13 },
    { nodeId: "neg-n", order: 14 },
    { nodeId: "ref-n3", order: 15 },
    { nodeId: "ref-n2", order: 16 },
  ],
};

// ── Snippet 5: Variable Shadowing ─────────────────────────────────────────

const shadowAST: ASTNode = {
  id: "prog",
  type: "Program",
  label: "Program",
  children: [
    {
      id: "let-x-outer",
      type: "LetStmt",
      label: "let x = 10",
      sourceLine: 1,
      children: [
        { id: "var-x-outer", type: "Var", label: "x", children: [], sourceLine: 1, detail: "binding" },
        { id: "lit-10s", type: "IntLit", label: "10", children: [], sourceLine: 1 },
      ],
    },
    {
      id: "let-y-outer",
      type: "LetStmt",
      label: "let y = x + 1",
      sourceLine: 2,
      children: [
        { id: "var-y-outer", type: "Var", label: "y", children: [], sourceLine: 2, detail: "binding" },
        {
          id: "add-y",
          type: "BinOp",
          label: "+",
          sourceLine: 2,
          children: [
            { id: "ref-x-outer1", type: "Var", label: "x", children: [], sourceLine: 2, detail: "reference → outer x" },
            { id: "lit-1s", type: "IntLit", label: "1", children: [], sourceLine: 2 },
          ],
        },
      ],
    },
    {
      id: "inner-block",
      type: "Block",
      label: "{ inner scope }",
      sourceLine: 3,
      children: [
        {
          id: "let-x-inner",
          type: "LetStmt",
          label: "let x = 20  // shadows outer x",
          sourceLine: 4,
          children: [
            { id: "var-x-inner", type: "Var", label: "x", children: [], sourceLine: 4, detail: "binding (shadows)" },
            { id: "lit-20s", type: "IntLit", label: "20", children: [], sourceLine: 4 },
          ],
        },
        {
          id: "let-z",
          type: "LetStmt",
          label: "let z = x + y",
          sourceLine: 5,
          children: [
            { id: "var-z", type: "Var", label: "z", children: [], sourceLine: 5, detail: "binding" },
            {
              id: "add-z",
              type: "BinOp",
              label: "+",
              sourceLine: 5,
              children: [
                { id: "ref-x-inner", type: "Var", label: "x", children: [], sourceLine: 5, detail: "reference → inner x" },
                { id: "ref-y-inner", type: "Var", label: "y", children: [], sourceLine: 5, detail: "reference → outer y" },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "let-w",
      type: "LetStmt",
      label: "let w = x + 2",
      sourceLine: 7,
      children: [
        { id: "var-w", type: "Var", label: "w", children: [], sourceLine: 7, detail: "binding" },
        {
          id: "add-w",
          type: "BinOp",
          label: "+",
          sourceLine: 7,
          children: [
            { id: "ref-x-outer2", type: "Var", label: "x", children: [], sourceLine: 7, detail: "reference → outer x" },
            { id: "lit-2s", type: "IntLit", label: "2", children: [], sourceLine: 7 },
          ],
        },
      ],
    },
  ],
};

const shadowTraversals: Record<TraversalOrder, TraversalStep[]> = {
  "pre-order": [
    { nodeId: "prog", order: 0 },
    { nodeId: "let-x-outer", order: 1 },
    { nodeId: "var-x-outer", order: 2 },
    { nodeId: "lit-10s", order: 3 },
    { nodeId: "let-y-outer", order: 4 },
    { nodeId: "var-y-outer", order: 5 },
    { nodeId: "add-y", order: 6 },
    { nodeId: "ref-x-outer1", order: 7 },
    { nodeId: "lit-1s", order: 8 },
    { nodeId: "inner-block", order: 9 },
    { nodeId: "let-x-inner", order: 10 },
    { nodeId: "var-x-inner", order: 11 },
    { nodeId: "lit-20s", order: 12 },
    { nodeId: "let-z", order: 13 },
    { nodeId: "var-z", order: 14 },
    { nodeId: "add-z", order: 15 },
    { nodeId: "ref-x-inner", order: 16 },
    { nodeId: "ref-y-inner", order: 17 },
    { nodeId: "let-w", order: 18 },
    { nodeId: "var-w", order: 19 },
    { nodeId: "add-w", order: 20 },
    { nodeId: "ref-x-outer2", order: 21 },
    { nodeId: "lit-2s", order: 22 },
  ],
  "post-order": [
    { nodeId: "var-x-outer", order: 0 },
    { nodeId: "lit-10s", order: 1 },
    { nodeId: "let-x-outer", order: 2 },
    { nodeId: "var-y-outer", order: 3 },
    { nodeId: "ref-x-outer1", order: 4 },
    { nodeId: "lit-1s", order: 5 },
    { nodeId: "add-y", order: 6 },
    { nodeId: "let-y-outer", order: 7 },
    { nodeId: "var-x-inner", order: 8 },
    { nodeId: "lit-20s", order: 9 },
    { nodeId: "let-x-inner", order: 10 },
    { nodeId: "var-z", order: 11 },
    { nodeId: "ref-x-inner", order: 12 },
    { nodeId: "ref-y-inner", order: 13 },
    { nodeId: "add-z", order: 14 },
    { nodeId: "let-z", order: 15 },
    { nodeId: "inner-block", order: 16 },
    { nodeId: "var-w", order: 17 },
    { nodeId: "ref-x-outer2", order: 18 },
    { nodeId: "lit-2s", order: 19 },
    { nodeId: "add-w", order: 20 },
    { nodeId: "let-w", order: 21 },
    { nodeId: "prog", order: 22 },
  ],
  "bfs": [
    { nodeId: "prog", order: 0 },
    { nodeId: "let-x-outer", order: 1 },
    { nodeId: "let-y-outer", order: 2 },
    { nodeId: "inner-block", order: 3 },
    { nodeId: "let-w", order: 4 },
    { nodeId: "var-x-outer", order: 5 },
    { nodeId: "lit-10s", order: 6 },
    { nodeId: "var-y-outer", order: 7 },
    { nodeId: "add-y", order: 8 },
    { nodeId: "let-x-inner", order: 9 },
    { nodeId: "let-z", order: 10 },
    { nodeId: "var-w", order: 11 },
    { nodeId: "add-w", order: 12 },
    { nodeId: "ref-x-outer1", order: 13 },
    { nodeId: "lit-1s", order: 14 },
    { nodeId: "var-x-inner", order: 15 },
    { nodeId: "lit-20s", order: 16 },
    { nodeId: "var-z", order: 17 },
    { nodeId: "add-z", order: 18 },
    { nodeId: "ref-x-outer2", order: 19 },
    { nodeId: "lit-2s", order: 20 },
    { nodeId: "ref-x-inner", order: 21 },
    { nodeId: "ref-y-inner", order: 22 },
  ],
};

// ── Assembled Snippets ────────────────────────────────────────────────────

export const AST_SNIPPETS: ASTSnippet[] = [
  {
    id: "simple-arithmetic",
    name: "Simple Arithmetic",
    shortName: "Arith",
    code: `let x = 3 + 4 * 2
let y = x + 1`,
    ast: simpleArithmeticAST,
    traversals: simpleArithmeticTraversals,
    symbols: [
      { name: "x", kind: "variable", scope: "global", declarationLine: 1, type: "int" },
      { name: "y", kind: "variable", scope: "global", declarationLine: 2, type: "int" },
    ],
    scopes: [
      { name: "global", parent: null, symbols: ["x", "y"] },
    ],
    transforms: [
      {
        name: "Constant Folding",
        description: "Evaluate 4 * 2 at compile time since both operands are literals.",
        before: `let x = 3 + 4 * 2
let y = x + 1`,
        after: `let x = 3 + 8
let y = x + 1`,
        changedLines: [1],
      },
      {
        name: "Full Constant Folding",
        description: "Evaluate all constant sub-expressions: 3 + 8 = 11.",
        before: `let x = 3 + 8
let y = x + 1`,
        after: `let x = 11
let y = x + 1`,
        changedLines: [1],
      },
    ],
  },
  {
    id: "branching",
    name: "If/Else Branching",
    shortName: "Branch",
    code: `let score = 85
if score >= 90 then
  let grade = "A"
else
  let grade = "B"`,
    ast: branchingAST,
    traversals: branchingTraversals,
    symbols: [
      { name: "score", kind: "variable", scope: "global", declarationLine: 1, type: "int" },
      { name: "grade", kind: "variable", scope: "then-branch", declarationLine: 3, type: "string" },
      { name: "grade", kind: "variable", scope: "else-branch", declarationLine: 5, type: "string" },
    ],
    scopes: [
      { name: "global", parent: null, symbols: ["score"] },
      { name: "then-branch", parent: "global", symbols: ["grade"] },
      { name: "else-branch", parent: "global", symbols: ["grade"] },
    ],
    transforms: [
      {
        name: "Constant Condition Folding",
        description: "Since score = 85 and 85 >= 90 is false, eliminate the dead then-branch.",
        before: `let score = 85
if score >= 90 then
  let grade = "A"
else
  let grade = "B"`,
        after: `let score = 85
let grade = "B"`,
        changedLines: [2],
      },
    ],
  },
  {
    id: "constant-fold",
    name: "Constant Folding",
    shortName: "Fold",
    code: `let a = (2 + 3) * (10 - 4)
let b = a + 0
let c = b * 1`,
    ast: constantFoldAST,
    traversals: constantFoldTraversals,
    symbols: [
      { name: "a", kind: "variable", scope: "global", declarationLine: 1, type: "int" },
      { name: "b", kind: "variable", scope: "global", declarationLine: 2, type: "int" },
      { name: "c", kind: "variable", scope: "global", declarationLine: 3, type: "int" },
    ],
    scopes: [
      { name: "global", parent: null, symbols: ["a", "b", "c"] },
    ],
    transforms: [
      {
        name: "Constant Folding",
        description: "Evaluate (2+3)=5 and (10-4)=6, then 5*6=30.",
        before: `let a = (2 + 3) * (10 - 4)
let b = a + 0
let c = b * 1`,
        after: `let a = 30
let b = a + 0
let c = b * 1`,
        changedLines: [1],
      },
      {
        name: "Identity Elimination",
        description: "Remove +0 and *1 since they are identity operations.",
        before: `let a = 30
let b = a + 0
let c = b * 1`,
        after: `let a = 30
let b = a
let c = b`,
        changedLines: [2, 3],
      },
      {
        name: "Copy Propagation",
        description: "b is just a copy of a, and c is just a copy of b (which is a). Replace all.",
        before: `let a = 30
let b = a
let c = b`,
        after: `let a = 30
let b = 30
let c = 30`,
        changedLines: [2, 3],
      },
    ],
  },
  {
    id: "dead-code",
    name: "Dead Code Elimination",
    shortName: "Dead",
    code: `function abs(n)
  if n < 0 then
    return -n
  else
    return n
  end
  let result = 0`,
    ast: deadCodeAST,
    traversals: deadCodeTraversals,
    symbols: [
      { name: "abs", kind: "function", scope: "global", declarationLine: 1 },
      { name: "n", kind: "parameter", scope: "abs", declarationLine: 1, type: "int" },
      { name: "result", kind: "variable", scope: "abs", declarationLine: 7, type: "int" },
    ],
    scopes: [
      { name: "global", parent: null, symbols: ["abs"] },
      { name: "abs", parent: "global", symbols: ["n", "result"] },
    ],
    transforms: [
      {
        name: "Dead Code Elimination",
        description: "Both branches of the if/else return, so line 7 is unreachable. Remove it.",
        before: `function abs(n)
  if n < 0 then
    return -n
  else
    return n
  end
  let result = 0`,
        after: `function abs(n)
  if n < 0 then
    return -n
  else
    return n
  end`,
        changedLines: [7],
      },
    ],
  },
  {
    id: "shadow-example",
    name: "Variable Shadowing",
    shortName: "Shadow",
    code: `let x = 10
let y = x + 1
{
  let x = 20
  let z = x + y
}
let w = x + 2`,
    ast: shadowAST,
    traversals: shadowTraversals,
    symbols: [
      { name: "x", kind: "variable", scope: "global", declarationLine: 1, type: "int" },
      { name: "y", kind: "variable", scope: "global", declarationLine: 2, type: "int" },
      { name: "x", kind: "variable", scope: "inner", declarationLine: 4, type: "int" },
      { name: "z", kind: "variable", scope: "inner", declarationLine: 5, type: "int" },
      { name: "w", kind: "variable", scope: "global", declarationLine: 7, type: "int" },
    ],
    scopes: [
      { name: "global", parent: null, symbols: ["x", "y", "w"] },
      { name: "inner", parent: "global", symbols: ["x", "z"] },
    ],
    transforms: [
      {
        name: "Variable Renaming (Alpha Conversion)",
        description: "Give inner x a unique name to make scoping explicit and eliminate shadowing.",
        before: `let x = 10
let y = x + 1
{
  let x = 20
  let z = x + y
}
let w = x + 2`,
        after: `let x = 10
let y = x + 1
{
  let x_1 = 20
  let z = x_1 + y
}
let w = x + 2`,
        changedLines: [4, 5],
      },
    ],
  },
];

export function getASTSnippet(id: string): ASTSnippet | undefined {
  return AST_SNIPPETS.find((s) => s.id === id);
}
