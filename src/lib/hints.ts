/**
 * Exercise hints — keyed by "moduleSlug/exerciseSlug".
 * Each entry is an array of progressive hints (shown one at a time).
 */
const HINTS: Record<string, string[]> = {

  // ── Module 0: OCaml Warm-up ──────────────────────────────────────

  "module0-warmup/ocaml-basics": [
    "For is_digit and is_alpha, use OCaml character comparison: c >= '0' && c <= '9'.",
    "classify_char can be built by composing is_digit and is_alpha with if/else.",
    "String.length s gives the length; s.[0] gives the first character — check length before indexing.",
  ],

  "module0-warmup/types-and-recursion": [
    "Remember to mark recursive functions with \"let rec\". Without it, the function can't call itself.",
    "For eval with BinOp, pattern match on both sub-results at once: match eval l, eval r with Some a, Some b -> ...",
    "For simplify, work bottom-up: simplify children first, then check if both are Num before folding constants.",
  ],

  "module0-warmup/collections-and-records": [
    "List.fold_left is your workhorse — it threads an accumulator through a list: List.fold_left f init lst.",
    "For Map operations, use StringMap.find_opt (returns Some v or None) instead of StringMap.find (raises Not_found).",
    "For make_counter, create a ref inside the returned closure: let count = ref 0 in fun () -> incr count; !count.",
  ],

  "module0-warmup/modules-and-functors": [
    "In ThreeValueLattice.join: Bot joined with anything gives the other element. Same values join to themselves. Everything else → Unknown.",
    "For MakeEnv.join, use StringMap.union with a merge function that calls L.join on overlapping keys.",
    "Widening is identical to join for finite lattices — you can reuse your join implementation.",
  ],

  "module0-warmup/calculator-parser": [
    "The Menhir-generated parser is provided — your job is just the AST operations (string_of_expr, eval).",
    "For eval with Div, check if the divisor is 0 first and return None to signal division by zero.",
    "Handle Neg expressions as unary negation: negate the result of evaluating the inner expression.",
  ],

  // ── Module 1: Foundations ─────────────────────────────────────────

  "module1-foundations/analysis-comparison": [
    "This is a conceptual exercise — classify each technique as static or dynamic based on whether it runs the code.",
    "Static analyses work on source code without executing it; dynamic analyses observe runtime behavior.",
  ],

  "module1-foundations/calculator-bugs": [
    "This is a conceptual exercise — trace through the calculator code manually to find the bugs.",
    "Look for: division by zero, operator precedence issues, and edge cases with negative numbers.",
  ],

  // ── Module 2: ASTs ────────────────────────────────────────────────

  "module2-ast/ast-structure-mapping": [
    "For dump_* functions, use the indent helper to build padding, then recurse at depth + 1 for children.",
    "inc updates an association list: if the key exists, increment its count; if not, add it with count 1.",
    "For pp_stmt with If, check if the else branch is empty ([] list) and omit the else clause if so.",
  ],

  "module2-ast/traversal-algorithms": [
    "Labels follow this format: IntLit(5), Var(x), BinOp(+), Assign, If, While, Return, etc.",
    "Pre-order: visit the node first, then recurse into children. Post-order: children first, then node.",
    "For BFS, use a queue (list as FIFO). Dequeue a node, emit its label, enqueue its children — repeat.",
  ],

  "module2-ast/symbol-table": [
    "The internal representation is a list of StringMaps — the head is the innermost (current) scope.",
    "lookup should search from innermost scope outward — try each map in the list until found.",
    "exit_scope pops the head map off the list. Return None if only one scope remains (can't exit global scope).",
  ],

  "module2-ast/ast-transformations": [
    "For constant_fold, recurse into children first (bottom-up), then check if BinOp has two IntLit operands.",
    "For rename_variable, walk both expressions (Var references) and statement targets (Assign lhs).",
    "For eliminate_dead_code, look for Return statements — everything after a Return is dead. Also handle If(BoolLit true/false).",
  ],

  // ── Module 3: Static Analysis ─────────────────────────────────────

  "module3-static-analysis/cfg-construction": [
    "add_edge needs to update both the source block's successors and the target block's predecessors.",
    "Blocks are mutable records — modify them in place, then return a new CFG with the updated blocks map.",
    "For to_string, fold over cfg.blocks and format: \"label: [stmts...] -> succs: [...] preds: [...]\".",
  ],

  "module3-static-analysis/dataflow-framework": [
    "The worklist algorithm: initialize all IN/OUT to init, then iterate until no values change (fixpoint).",
    "For forward analysis: IN[B] = merge(OUT[predecessors of B]), OUT[B] = transfer(B, IN[B]).",
    "For backward analysis: swap the roles — OUT[B] = merge(IN[successors]), IN[B] = transfer(B, OUT[B]).",
  ],

  "module3-static-analysis/reaching-definitions": [
    "gen[B] = for each variable defined in B, keep only the LAST definition (earlier ones are killed locally).",
    "kill[B] = for each variable defined in B, include ALL OTHER definitions of that same variable across the program.",
    "Iterate: IN[B] = union of OUT[predecessors], OUT[B] = gen[B] union (IN[B] \\ kill[B]).",
  ],

  "module3-static-analysis/live-variables": [
    "This is a BACKWARD analysis: start from exit, flow information against the control flow direction.",
    "OUT[B] = union of IN[successors], IN[B] = use[B] union (OUT[B] \\ def[B]).",
    "A variable is \"used\" if it's read before being defined in the block. It's \"defined\" if it's assigned.",
  ],

  "module3-static-analysis/interprocedural-analysis": [
    "For calls_in_expr, recursively walk the expression tree. Call(name, args) is a call — but also recurse into each arg.",
    "build_call_graph: for each function, collect all calls in its body, then map caller → set of callees.",
    "A function is recursive if it appears in its own reachability set (BFS/DFS from itself includes itself).",
  ],

  // ── Module 4: Abstract Interpretation ──────────────────────────────

  "module4-abstract-interpretation/sign-lattice": [
    "The lattice has 5 elements: Bot < {Neg, Zero, Pos} < Top. Neg, Zero, Pos are pairwise incomparable.",
    "alpha_int: n < 0 → Neg, n = 0 → Zero, n > 0 → Pos.",
    "For abstract arithmetic: Neg + Neg = Neg, Pos + Pos = Pos, Neg + Pos = Top (could be anything).",
    "Division by Zero → Bot (impossible). Division by anything that might be zero → Top (conservative).",
  ],

  "module4-abstract-interpretation/constant-propagation": [
    "This is a flat lattice: Bot < Const(n) for all n < Top. All Const values are pairwise incomparable.",
    "join: if both are the same Const, return it. If either is Bot, return the other. Otherwise Top.",
    "For abstract ops: if both args are Const, compute the result exactly. If either is Bot → Bot. Else Top.",
  ],

  "module4-abstract-interpretation/interval-domain": [
    "Intervals are [lo, hi] where lo/hi can be NegInf, Finite(n), or PosInf. Bottom is the empty interval.",
    "join of two intervals: take min of lower bounds and max of upper bounds (smallest containing interval).",
    "Widening: if the lower bound shrank, jump to -inf. If the upper bound grew, jump to +inf. This ensures termination.",
    "For abstract multiplication, compute all four corner products and take the min/max.",
  ],

  "module4-abstract-interpretation/galois-connections": [
    "alpha over a set of ints: fold the set, joining individual signs. Empty set → Bot.",
    "in_gamma checks: does this concrete integer fall within the meaning of the abstract value? E.g., -3 is in gamma(Neg).",
    "Adjunction property: alpha(C) <= a if and only if every element of C is in gamma(a).",
  ],

  "module4-abstract-interpretation/abstract-interpreter": [
    "eval_expr: for Var, look up in the environment (Env.lookup returns D.top if not found).",
    "transfer_stmt for Assign: evaluate the RHS, update the env with the new binding.",
    "For While loops, iterate the body with widening until the environment stabilizes (fixpoint).",
    "check_div_by_zero: walk expressions looking for Div nodes. If the divisor's abstract value might include zero, report it.",
  ],

  // ── Module 5: Security Analysis ───────────────────────────────────

  "module5-security-analysis/taint-lattice": [
    "Four elements: Bot < {Untainted, Tainted} < Top. Untainted and Tainted are incomparable.",
    "propagate: if either operand is potentially tainted (Tainted or Top), the result is Tainted. If either is Bot, result is Bot.",
    "is_potentially_tainted returns true for Tainted and Top (both might carry user-controlled data).",
  ],

  "module5-security-analysis/taint-propagation": [
    "IntLit and BoolLit are always Untainted. For Var, look up its taint status in the environment.",
    "A Call to a known source function → Tainted. A Call to a sanitizer → Untainted. Unknown calls → Top.",
    "BinOp and UnaryOp: use Taint_domain.propagate to combine the taint of operands.",
    "While loops need fixpoint iteration with widening — limit to ~100 iterations to prevent infinite loops.",
  ],

  "module5-security-analysis/security-config": [
    "Default web sources include: get_param, read_cookie, read_input, get_header, read_file.",
    "Use List.find_opt with a predicate matching the function name to implement lookup helpers.",
    "add_source/add_sink/add_sanitizer append to the existing list and return an updated config record.",
  ],

  "module5-security-analysis/information-flow": [
    "pc_taint tracks whether execution is inside a branch controlled by tainted data (implicit flow).",
    "In Assign: the RHS taint is propagate(eval_result, pc_taint) — assignments in tainted branches taint the LHS.",
    "In If/While: if the condition is potentially tainted, pass pc_taint = Tainted for the branches/body.",
    "Explicit flows come from direct data dependencies. Implicit flows come from control-flow dependencies.",
  ],

  "module5-security-analysis/vulnerability-detection": [
    "Severity mapping: sql-injection/command-injection → Critical, xss/path-traversal → High.",
    "check_call: if a call is to a known sink, evaluate the checked argument — if it's potentially tainted, report a vulnerability.",
    "transfer_and_check: process statements sequentially, accumulating vulnerabilities as a side list.",
    "Use the config's is_source/find_sink/find_sanitizer helpers to classify function calls.",
  ],

  // ── Module 6: Tools Integration ───────────────────────────────────

  "module6-tools-integration/analysis-finding": [
    "Severity int mapping for sorting: Critical=4, High=3, Medium=2, Low=1, Info=0.",
    "compare_by_severity returns negative if the first arg has higher severity (sort descending).",
    "deduplicate: fold left, tracking seen (message, location) pairs. Skip duplicates.",
    "Use Printf.sprintf for format_finding — include severity, category, location, and message.",
  ],

  "module6-tools-integration/dead-code-detector": [
    "stmts_after_return: fold left through statements. Once you see a Return, everything after is dead code.",
    "collect_used_vars: walk expressions recursively, collecting all Var nodes into a StringSet.",
    "Unused parameters: compare the function's parameter list against variables actually used in the body. Skip params starting with _.",
  ],

  "module6-tools-integration/multi-pass-analyzer": [
    "Safety pass: use MakeEnv(Sign_domain) to build a sign environment. Evaluate expressions to signs. Flag Div where divisor might be Zero or Top.",
    "Taint pass: use MakeEnv(Taint_domain). Hardcode source/sink lists. Flag sink calls where arguments are tainted.",
    "merge_findings: concatenate all pass results and sort by severity (highest first).",
    "partition_by_pass: fold left building an assoc list grouped by each finding's pass_name field.",
  ],

  "module6-tools-integration/configurable-pipeline": [
    "Default config: all passes enabled, no severity filter, no maximum cap, all categories included.",
    "Config builders return updated records: { config with field = new_value }.",
    "build_pipeline: map create_pass over the config's enabled_passes list.",
    "apply_filters: filter by severity, then by category, then sort, then cap at max_findings.",
  ],

  "module6-tools-integration/analysis-reporter": [
    "build_report: use Finding module functions to count by severity and category. Total is List.length.",
    "For text report: header line, total count, each finding formatted, then severity breakdown summary.",
    "For JSON: manually build JSON strings (no library) — findings as a JSON array, counts as objects.",
    "format_findings_table: use Printf.sprintf with fixed-width padding to align columns (Severity | Category | Location | Message).",
  ],
};

/**
 * Get hints for an exercise. Returns empty array if no hints available.
 */
export function getHints(moduleSlug: string, exerciseSlug: string): string[] {
  return HINTS[`${moduleSlug}/${exerciseSlug}`] || [];
}
