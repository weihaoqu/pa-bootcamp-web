// ---------------------------------------------------------------------------
// Security Analysis Explorer data — interfaces + 5 pre-computed programs
// ---------------------------------------------------------------------------

/** Taint values in the 4-element lattice */
export type TaintValue = "Bot" | "Untainted" | "Tainted" | "Top";

/** Hasse diagram edges for the Taint lattice */
export const TAINT_HASSE: { from: TaintValue; to: TaintValue }[] = [
  { from: "Bot", to: "Untainted" },
  { from: "Bot", to: "Tainted" },
  { from: "Untainted", to: "Top" },
  { from: "Tainted", to: "Top" },
];

export const TAINT_JOIN: Record<string, TaintValue> = {
  "Bot,Bot": "Bot", "Bot,Untainted": "Untainted", "Bot,Tainted": "Tainted", "Bot,Top": "Top",
  "Untainted,Bot": "Untainted", "Untainted,Untainted": "Untainted", "Untainted,Tainted": "Top", "Untainted,Top": "Top",
  "Tainted,Bot": "Tainted", "Tainted,Untainted": "Top", "Tainted,Tainted": "Tainted", "Tainted,Top": "Top",
  "Top,Bot": "Top", "Top,Untainted": "Top", "Top,Tainted": "Top", "Top,Top": "Top",
};

export const TAINT_MEET: Record<string, TaintValue> = {
  "Bot,Bot": "Bot", "Bot,Untainted": "Bot", "Bot,Tainted": "Bot", "Bot,Top": "Bot",
  "Untainted,Bot": "Bot", "Untainted,Untainted": "Untainted", "Untainted,Tainted": "Bot", "Untainted,Top": "Untainted",
  "Tainted,Bot": "Bot", "Tainted,Untainted": "Bot", "Tainted,Tainted": "Tainted", "Tainted,Top": "Tainted",
  "Top,Bot": "Bot", "Top,Untainted": "Untainted", "Top,Tainted": "Tainted", "Top,Top": "Top",
};

// --- Source / Sink / Sanitizer config -------------------------------------

export interface SecuritySource {
  name: string;
  description: string;
  examples: string[];
}

export interface SecuritySink {
  name: string;
  description: string;
  vulnType: string;
  examples: string[];
}

export interface SecuritySanitizer {
  name: string;
  description: string;
  sanitizes: string;
}

export const DEFAULT_SOURCES: SecuritySource[] = [
  { name: "user_input", description: "Raw user input from forms, URL params, or request body", examples: ["req.body", "req.query", "req.params"] },
  { name: "database_read", description: "Data read from database (may contain previously-stored tainted data)", examples: ["db.query()", "Model.find()"] },
  { name: "environment", description: "Environment variables or config that could be manipulated", examples: ["process.env", "os.environ"] },
];

export const DEFAULT_SINKS: SecuritySink[] = [
  { name: "sql_query", description: "SQL query execution", vulnType: "SQL Injection", examples: ["db.exec(query)", "cursor.execute(sql)"] },
  { name: "html_output", description: "HTML rendered to browser", vulnType: "Cross-Site Scripting (XSS)", examples: ["res.send(html)", "document.innerHTML"] },
  { name: "command_exec", description: "OS command execution", vulnType: "Command Injection", examples: ["exec(cmd)", "os.system(cmd)"] },
  { name: "file_path", description: "File system path", vulnType: "Path Traversal", examples: ["fs.readFile(path)", "open(path)"] },
];

export const DEFAULT_SANITIZERS: SecuritySanitizer[] = [
  { name: "escape_html", description: "Escapes HTML special characters", sanitizes: "XSS" },
  { name: "parameterize", description: "Uses parameterized queries", sanitizes: "SQL Injection" },
  { name: "validate_path", description: "Validates and normalizes file paths", sanitizes: "Path Traversal" },
];

// --- Taint step (per-statement snapshot) -----------------------------------

export interface TaintStep {
  statement: string;
  line: number;
  env: { variable: string; taint: TaintValue; reason: string }[];
  /** Vulnerability detected at this step */
  vulnerability?: {
    type: string;
    severity: "Critical" | "High" | "Medium" | "Low";
    message: string;
  };
  /** Sanitizer applied */
  sanitized?: string;
  explanation: string;
}

// --- Top-level program -----------------------------------------------------

export interface SecurityProgram {
  id: string;
  name: string;
  shortName: string;
  description: string;
  code: string;
  steps: TaintStep[];
  teachingPoint: string;
}

// ===========================================================================
// Program 1: sql-injection
// ===========================================================================

const sqlInjection: SecurityProgram = {
  id: "sql-injection",
  name: "SQL Injection",
  shortName: "SQLi",
  description: "Classic SQL injection: user input flows directly into a SQL query without sanitization.",
  teachingPoint: "Tainted data from user_input reaches sql_query sink without passing through parameterize. This is the textbook taint analysis vulnerability.",
  code: `username = req.body.username
password = req.body.password
query = "SELECT * FROM users WHERE name='" + username + "'"
result = db.exec(query)`,
  steps: [
    {
      statement: "username = req.body.username",
      line: 1,
      env: [
        { variable: "username", taint: "Tainted", reason: "Source: user_input (req.body)" },
      ],
      explanation: "req.body.username is a taint source — raw user input. The variable becomes Tainted.",
    },
    {
      statement: "password = req.body.password",
      line: 2,
      env: [
        { variable: "username", taint: "Tainted", reason: "Source: user_input" },
        { variable: "password", taint: "Tainted", reason: "Source: user_input (req.body)" },
      ],
      explanation: "Another taint source. Both user-supplied values are now Tainted.",
    },
    {
      statement: 'query = "SELECT..." + username + "..."',
      line: 3,
      env: [
        { variable: "username", taint: "Tainted", reason: "Source: user_input" },
        { variable: "password", taint: "Tainted", reason: "Source: user_input" },
        { variable: "query", taint: "Tainted", reason: "Taint propagation: Untainted + Tainted = Tainted" },
      ],
      explanation: 'String concatenation with a Tainted value propagates taint. "safe string" + Tainted = Tainted. The query string is now tainted.',
    },
    {
      statement: "result = db.exec(query)",
      line: 4,
      env: [
        { variable: "username", taint: "Tainted", reason: "Source: user_input" },
        { variable: "password", taint: "Tainted", reason: "Source: user_input" },
        { variable: "query", taint: "Tainted", reason: "Propagated from username" },
        { variable: "result", taint: "Tainted", reason: "From tainted query" },
      ],
      vulnerability: {
        type: "SQL Injection",
        severity: "Critical",
        message: "Tainted value 'query' reaches sql_query sink db.exec() without sanitization!",
      },
      explanation: "db.exec() is a SQL sink. A Tainted value reaching this sink = SQL Injection vulnerability. The attacker can input: ' OR 1=1 --",
    },
  ],
};

// ===========================================================================
// Program 2: sanitized-query
// ===========================================================================

const sanitizedQuery: SecurityProgram = {
  id: "sanitized-query",
  name: "Sanitized Query",
  shortName: "Safe",
  description: "Same pattern as SQL injection, but with proper parameterized queries — no vulnerability.",
  teachingPoint: "Sanitizers (parameterize) convert Tainted values to Untainted before they reach sinks. This is the correct fix for injection vulnerabilities.",
  code: `username = req.body.username
query = parameterize("SELECT * FROM users WHERE name=?", username)
result = db.exec(query)`,
  steps: [
    {
      statement: "username = req.body.username",
      line: 1,
      env: [
        { variable: "username", taint: "Tainted", reason: "Source: user_input (req.body)" },
      ],
      explanation: "User input is still Tainted — that hasn't changed.",
    },
    {
      statement: "query = parameterize(..., username)",
      line: 2,
      env: [
        { variable: "username", taint: "Tainted", reason: "Source: user_input" },
        { variable: "query", taint: "Untainted", reason: "Sanitized by parameterize()" },
      ],
      sanitized: "parameterize() converts Tainted → Untainted for SQL context",
      explanation: "parameterize() is a sanitizer: it takes a Tainted value and produces an Untainted result. The query is now safe to execute.",
    },
    {
      statement: "result = db.exec(query)",
      line: 3,
      env: [
        { variable: "username", taint: "Tainted", reason: "Source: user_input" },
        { variable: "query", taint: "Untainted", reason: "Sanitized" },
        { variable: "result", taint: "Untainted", reason: "From untainted query" },
      ],
      explanation: "query is Untainted when it reaches the sql_query sink — no vulnerability! The sanitizer broke the taint flow.",
    },
  ],
};

// ===========================================================================
// Program 3: xss-reflected
// ===========================================================================

const xssReflected: SecurityProgram = {
  id: "xss-reflected",
  name: "Reflected XSS",
  shortName: "XSS",
  description: "User input reflected into HTML output without escaping — a cross-site scripting vulnerability.",
  teachingPoint: "XSS occurs when tainted user input reaches an HTML output sink. The fix is escape_html(), which converts special characters to HTML entities.",
  code: `name = req.query.name
greeting = "<h1>Hello, " + name + "!</h1>"
res.send(greeting)`,
  steps: [
    {
      statement: "name = req.query.name",
      line: 1,
      env: [
        { variable: "name", taint: "Tainted", reason: "Source: user_input (req.query)" },
      ],
      explanation: "URL query parameter is user-controlled input — Tainted.",
    },
    {
      statement: 'greeting = "<h1>Hello, " + name + "!</h1>"',
      line: 2,
      env: [
        { variable: "name", taint: "Tainted", reason: "Source: user_input" },
        { variable: "greeting", taint: "Tainted", reason: "Taint propagation: string concat with Tainted" },
      ],
      explanation: "Concatenating a Tainted value into an HTML string propagates the taint. The entire greeting is now Tainted.",
    },
    {
      statement: "res.send(greeting)",
      line: 3,
      env: [
        { variable: "name", taint: "Tainted", reason: "Source: user_input" },
        { variable: "greeting", taint: "Tainted", reason: "Propagated from name" },
      ],
      vulnerability: {
        type: "Cross-Site Scripting (XSS)",
        severity: "High",
        message: "Tainted value 'greeting' reaches html_output sink res.send() without escape_html!",
      },
      explanation: 'res.send() is an HTML output sink. Attacker can input: <script>steal_cookies()</script> as the name parameter, executing arbitrary JavaScript in the victim\'s browser.',
    },
  ],
};

// ===========================================================================
// Program 4: implicit-flow
// ===========================================================================

const implicitFlow: SecurityProgram = {
  id: "implicit-flow",
  name: "Implicit Information Flow",
  shortName: "Implicit",
  description: "Taint leaks through control flow — even without direct data assignment.",
  teachingPoint: "Implicit flows leak information through control structure decisions. If a branch condition is Tainted, all assignments inside the branch are tainted too — because the attacker controls which branch executes.",
  code: `secret = req.body.password
result = "no"
if secret == "admin123" then
  result = "yes"
output(result)`,
  steps: [
    {
      statement: "secret = req.body.password",
      line: 1,
      env: [
        { variable: "secret", taint: "Tainted", reason: "Source: user_input (req.body)" },
      ],
      explanation: "Password input is Tainted.",
    },
    {
      statement: 'result = "no"',
      line: 2,
      env: [
        { variable: "secret", taint: "Tainted", reason: "Source: user_input" },
        { variable: "result", taint: "Untainted", reason: "Literal string assignment" },
      ],
      explanation: 'Assigning a literal string — result starts Untainted.',
    },
    {
      statement: 'if secret == "admin123" then',
      line: 3,
      env: [
        { variable: "secret", taint: "Tainted", reason: "Source: user_input" },
        { variable: "result", taint: "Untainted", reason: "Not yet affected" },
      ],
      explanation: 'The branch condition depends on a Tainted value (secret). This means all assignments inside this branch carry an IMPLICIT taint — the attacker controls which branch runs.',
    },
    {
      statement: 'result = "yes"  (inside tainted branch)',
      line: 4,
      env: [
        { variable: "secret", taint: "Tainted", reason: "Source: user_input" },
        { variable: "result", taint: "Tainted", reason: "Implicit flow: assigned inside Tainted branch condition" },
      ],
      explanation: 'Even though "yes" is a literal, result becomes Tainted because the assignment is controlled by a Tainted condition. An attacker can deduce the secret by observing whether result is "yes" or "no".',
    },
    {
      statement: "output(result)  (after merge)",
      line: 5,
      env: [
        { variable: "secret", taint: "Tainted", reason: "Source: user_input" },
        { variable: "result", taint: "Tainted", reason: "Implicit flow (join of branches)" },
      ],
      vulnerability: {
        type: "Information Leak",
        severity: "Medium",
        message: "Variable 'result' carries implicit taint from secret — information leak via output channel.",
      },
      explanation: "At the merge point, join(Untainted, Tainted) = Top ≈ Tainted. Even though only one branch assigned result, the FACT that it was assigned reveals information about the secret condition.",
    },
  ],
};

// ===========================================================================
// Program 5: multi-source-sanitize
// ===========================================================================

const multiSourceSanitize: SecurityProgram = {
  id: "multi-source-sanitize",
  name: "Multiple Sources & Partial Sanitization",
  shortName: "Multi",
  description: "Two taint sources, only one sanitized — demonstrates how partial fixes leave vulnerabilities.",
  teachingPoint: "Sanitizing one source isn't enough if another tainted source also flows to the same sink. Taint analysis tracks ALL flows, not just the obvious ones.",
  code: `user_id = req.params.id
comment = req.body.text
safe_id = validate(user_id)
page = "<div id='" + safe_id + "'>" + comment + "</div>"
res.send(page)`,
  steps: [
    {
      statement: "user_id = req.params.id",
      line: 1,
      env: [
        { variable: "user_id", taint: "Tainted", reason: "Source: user_input (req.params)" },
      ],
      explanation: "URL parameter — Tainted.",
    },
    {
      statement: "comment = req.body.text",
      line: 2,
      env: [
        { variable: "user_id", taint: "Tainted", reason: "Source: user_input" },
        { variable: "comment", taint: "Tainted", reason: "Source: user_input (req.body)" },
      ],
      explanation: "Request body — also Tainted. Two independent taint sources.",
    },
    {
      statement: "safe_id = validate(user_id)",
      line: 3,
      env: [
        { variable: "user_id", taint: "Tainted", reason: "Source: user_input" },
        { variable: "comment", taint: "Tainted", reason: "Source: user_input" },
        { variable: "safe_id", taint: "Untainted", reason: "Sanitized by validate()" },
      ],
      sanitized: "validate() sanitizes user_id → Untainted",
      explanation: "user_id is sanitized by validate(). But comment is still Tainted — the developer forgot to sanitize it!",
    },
    {
      statement: "page = ... + safe_id + ... + comment + ...",
      line: 4,
      env: [
        { variable: "user_id", taint: "Tainted", reason: "Source: user_input" },
        { variable: "comment", taint: "Tainted", reason: "Source: user_input" },
        { variable: "safe_id", taint: "Untainted", reason: "Sanitized" },
        { variable: "page", taint: "Tainted", reason: "Taint propagation: Untainted + Tainted = Tainted (from comment)" },
      ],
      explanation: "Untainted + Tainted = Tainted. Even though safe_id is clean, concatenating it with the unsanitized comment taints the whole page string.",
    },
    {
      statement: "res.send(page)",
      line: 5,
      env: [
        { variable: "user_id", taint: "Tainted", reason: "Source: user_input" },
        { variable: "comment", taint: "Tainted", reason: "Source: user_input" },
        { variable: "safe_id", taint: "Untainted", reason: "Sanitized" },
        { variable: "page", taint: "Tainted", reason: "Propagated from comment" },
      ],
      vulnerability: {
        type: "Cross-Site Scripting (XSS)",
        severity: "High",
        message: "Tainted value 'page' reaches html_output sink — unsanitized 'comment' is the culprit!",
      },
      explanation: "Partial sanitization is insufficient. The developer sanitized user_id but forgot comment. Taint analysis tracks ALL flows and catches this — a manual review might miss it.",
    },
  ],
};

// ===========================================================================
// Export
// ===========================================================================

export const SECURITY_PROGRAMS: SecurityProgram[] = [
  sqlInjection,
  sanitizedQuery,
  xssReflected,
  implicitFlow,
  multiSourceSanitize,
];

export function getSecurityProgram(id: string): SecurityProgram | undefined {
  return SECURITY_PROGRAMS.find((p) => p.id === id);
}
