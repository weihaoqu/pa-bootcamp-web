export interface StaticFinding {
  line: number;
  severity: "error" | "warning" | "info";
  rule: string;
  message: string;
  explanation: string;
}

export interface DynamicTestResult {
  name: string;
  status: "pass" | "fail" | "error";
  input?: string;
  expected?: string;
  actual?: string;
  executedLines: number[];
}

export interface ComparisonItem {
  description: string;
  category: "static-only" | "dynamic-only" | "both";
}

export interface Snippet {
  id: string;
  name: string;
  shortName: string;
  code: string;
  staticFindings: StaticFinding[];
  dynamicResults: DynamicTestResult[];
  coveragePercent: number;
  comparison: ComparisonItem[];
}

export const SNIPPETS: Snippet[] = [
  {
    id: "division-by-zero",
    name: "Division by Zero",
    shortName: "Div/0",
    code: `function average(numbers) {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }
  return sum / numbers.length;  // Bug: no check for empty array
}

function weightedAverage(values, weights) {
  let totalWeight = 0;
  let weightedSum = 0;
  for (let i = 0; i < values.length; i++) {
    weightedSum += values[i] * weights[i];
    totalWeight += weights[i];
  }
  return weightedSum / totalWeight;  // Bug: weights could sum to 0
}

// Usage
console.log(average([10, 20, 30]));   // Works fine: 20
console.log(average([]));              // Runtime: NaN (0/0)
console.log(weightedAverage([5], [0])); // Runtime: Infinity (5/0)`,
    staticFindings: [
      {
        line: 6,
        severity: "error",
        rule: "possible-division-by-zero",
        message: "Division by `numbers.length` may be zero when array is empty",
        explanation: "Static analysis traces that `numbers.length` can be 0 if an empty array is passed. Since there's no guard, this division could produce NaN or Infinity at runtime.",
      },
      {
        line: 17,
        severity: "error",
        rule: "possible-division-by-zero",
        message: "Division by `totalWeight` may be zero if all weights are 0",
        explanation: "The accumulator `totalWeight` starts at 0 and only grows if weights contain non-zero values. Static analysis cannot prove this will always be non-zero.",
      },
      {
        line: 14,
        severity: "warning",
        rule: "unchecked-array-access",
        message: "`weights[i]` may be out of bounds if `weights` is shorter than `values`",
        explanation: "The loop iterates over `values.length` but accesses `weights[i]` without checking that both arrays have the same length.",
      },
    ],
    dynamicResults: [
      { name: "Normal case: [10,20,30]", status: "pass", input: "[10, 20, 30]", expected: "20", actual: "20", executedLines: [1, 2, 3, 4, 5, 6] },
      { name: "Empty array: []", status: "fail", input: "[]", expected: "0 (or error)", actual: "NaN", executedLines: [1, 2, 6] },
      { name: "Zero weights: [5], [0]", status: "fail", input: "[5], [0]", expected: "error", actual: "Infinity", executedLines: [10, 11, 12, 13, 14, 15, 16, 17] },
    ],
    coveragePercent: 100,
    comparison: [
      { description: "Detects `weights` shorter than `values` (out-of-bounds access)", category: "static-only" },
      { description: "Division by zero on empty array", category: "both" },
      { description: "Division by zero on zero-sum weights", category: "both" },
      { description: "Confirms NaN vs Infinity behavior difference", category: "dynamic-only" },
    ],
  },
  {
    id: "sql-injection",
    name: "SQL Injection",
    shortName: "SQLi",
    code: `function findUser(db, username) {
  // Vulnerable: string concatenation in query
  const query = "SELECT * FROM users WHERE name = '" + username + "'";
  return db.execute(query);
}

function findUserSafe(db, username) {
  // Safe: parameterized query
  const query = "SELECT * FROM users WHERE name = ?";
  return db.execute(query, [username]);
}

function deleteUser(db, userId) {
  // Vulnerable: template literal injection
  const query = \`DELETE FROM users WHERE id = \${userId}\`;
  return db.execute(query);
}

// Usage
findUser(db, "alice");                    // OK
findUser(db, "'; DROP TABLE users; --"); // SQL injection!
findUserSafe(db, "'; DROP TABLE users; --"); // Safe
deleteUser(db, "1 OR 1=1");              // Deletes all users!`,
    staticFindings: [
      {
        line: 3,
        severity: "error",
        rule: "sql-injection",
        message: "Tainted input `username` concatenated into SQL query string",
        explanation: "Taint analysis tracks the `username` parameter (user input → taint source) flowing into a string concatenation that builds a SQL query. This is the classic SQL injection pattern.",
      },
      {
        line: 15,
        severity: "error",
        rule: "sql-injection",
        message: "Tainted input `userId` interpolated into SQL query via template literal",
        explanation: "Template literals with `${}` are just as dangerous as `+` concatenation when building SQL. The `userId` parameter flows directly into the query without sanitization.",
      },
      {
        line: 9,
        severity: "info",
        rule: "parameterized-query",
        message: "Good: parameterized query used — input is safely escaped by the driver",
        explanation: "Using `?` placeholders with a separate values array lets the database driver handle escaping. This is the correct way to prevent SQL injection.",
      },
    ],
    dynamicResults: [
      { name: "Normal lookup: 'alice'", status: "pass", input: "alice", expected: "Alice's record", actual: "Alice's record", executedLines: [1, 2, 3, 4] },
      { name: "Injection attempt (unsafe)", status: "error", input: "'; DROP TABLE users; --", expected: "error or empty", actual: "TABLE DROPPED", executedLines: [1, 2, 3, 4] },
      { name: "Injection attempt (safe)", status: "pass", input: "'; DROP TABLE users; --", expected: "empty result", actual: "empty result", executedLines: [7, 8, 9, 10] },
      { name: "Delete injection: '1 OR 1=1'", status: "error", input: "1 OR 1=1", expected: "1 row deleted", actual: "ALL rows deleted", executedLines: [13, 14, 15, 16] },
    ],
    coveragePercent: 87,
    comparison: [
      { description: "Detects taint flow from parameter to SQL string (no execution needed)", category: "static-only" },
      { description: "Identifies parameterized query as safe pattern", category: "static-only" },
      { description: "Confirms actual data loss from injection", category: "dynamic-only" },
      { description: "Both identify the vulnerable concatenation pattern", category: "both" },
    ],
  },
  {
    id: "dead-code",
    name: "Dead Code",
    shortName: "Dead",
    code: `function processOrder(order) {
  if (order.total < 0) {
    return { error: "Invalid total" };
  }

  let discount = 0;
  if (order.total > 100) {
    discount = 0.1;
  } else if (order.total > 50) {
    discount = 0.05;
  }

  const finalPrice = order.total * (1 - discount);

  if (discount > 0.2) {  // Bug: discount is never > 0.2
    console.log("Big spender alert!");
    notifyManager(order);
  }

  return { price: finalPrice, discount: discount };
}

function legacyValidator(order) {
  // This function is never called anywhere
  if (order.items.length === 0) {
    return false;
  }
  return order.items.every(item => item.price > 0);
}

function unusedHelper() {
  // Also never called
  return 42;
}`,
    staticFindings: [
      {
        line: 15,
        severity: "warning",
        rule: "unreachable-branch",
        message: "Condition `discount > 0.2` is always false — max possible value is 0.1",
        explanation: "Static analysis traces all possible values of `discount`: it's assigned 0, 0.1, or 0.05. None of these exceed 0.2, so lines 16-18 can never execute. This is dead code hiding a potential logic bug.",
      },
      {
        line: 24,
        severity: "info",
        rule: "unused-function",
        message: "`legacyValidator` is defined but never called",
        explanation: "Call graph analysis found no call site for this function. It may be leftover from a previous version and safe to remove.",
      },
      {
        line: 32,
        severity: "info",
        rule: "unused-function",
        message: "`unusedHelper` is defined but never called",
        explanation: "No caller found in the entire program. Dead code increases maintenance burden.",
      },
    ],
    dynamicResults: [
      { name: "Order total = 150", status: "pass", input: "{total: 150}", expected: "{price: 135, discount: 0.1}", actual: "{price: 135, discount: 0.1}", executedLines: [1, 2, 6, 7, 8, 13, 15, 20] },
      { name: "Order total = 75", status: "pass", input: "{total: 75}", expected: "{price: 71.25, discount: 0.05}", actual: "{price: 71.25, discount: 0.05}", executedLines: [1, 2, 6, 7, 9, 10, 13, 15, 20] },
      { name: "Order total = -5", status: "pass", input: "{total: -5}", expected: "{error: 'Invalid total'}", actual: "{error: 'Invalid total'}", executedLines: [1, 2, 3] },
    ],
    coveragePercent: 61,
    comparison: [
      { description: "Detects `discount > 0.2` is always false (unreachable branch)", category: "static-only" },
      { description: "Finds `legacyValidator` and `unusedHelper` are never called", category: "static-only" },
      { description: "Coverage report shows lines 16-18 as uncovered (but can't explain why)", category: "dynamic-only" },
      { description: "Lines 24-34 show 0% coverage, hinting they're dead", category: "dynamic-only" },
    ],
  },
  {
    id: "infinite-recursion",
    name: "Infinite Recursion",
    shortName: "Loop",
    code: `function fibonacci(n) {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

function flatten(arr) {
  let result = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      result = result.concat(flatten(item));
    } else {
      result.push(item);
    }
  }
  return result;
}

function badFlatten(obj) {
  // Bug: circular references cause infinite recursion
  let result = [];
  for (const key in obj) {
    if (typeof obj[key] === "object") {
      result = result.concat(badFlatten(obj[key]));
    } else {
      result.push(obj[key]);
    }
  }
  return result;
}

// Usage
console.log(fibonacci(10));  // 55 (but exponential time!)
const nested = [1, [2, [3, [4]]]];
console.log(flatten(nested)); // [1, 2, 3, 4]

const circular = { a: 1 };
circular.self = circular;    // Creates circular reference
// badFlatten(circular);     // Stack overflow!`,
    staticFindings: [
      {
        line: 4,
        severity: "warning",
        rule: "exponential-recursion",
        message: "`fibonacci` has two recursive calls — O(2^n) time complexity",
        explanation: "Each call spawns two more calls. For n=40, this makes ~2 billion calls. Static analysis detects the branching recursion pattern and flags it as a performance concern.",
      },
      {
        line: 24,
        severity: "error",
        rule: "possible-infinite-recursion",
        message: "`badFlatten` recurses on `obj[key]` without cycle detection",
        explanation: "If the input object contains circular references (obj.self = obj), this recursion never terminates. Static analysis sees that the recursion has no decreasing measure or visited-set guard.",
      },
    ],
    dynamicResults: [
      { name: "fibonacci(10)", status: "pass", input: "10", expected: "55", actual: "55", executedLines: [1, 2, 3, 4] },
      { name: "fibonacci(40) — slow!", status: "pass", input: "40", expected: "102334155", actual: "102334155 (took 8.2s)", executedLines: [1, 2, 3, 4] },
      { name: "flatten nested array", status: "pass", input: "[1,[2,[3,[4]]]]", expected: "[1,2,3,4]", actual: "[1,2,3,4]", executedLines: [7, 8, 9, 10, 11, 13, 16] },
      { name: "badFlatten with circular ref", status: "error", input: "{a:1, self:circular}", expected: "error", actual: "RangeError: Maximum call stack size exceeded", executedLines: [19, 20, 21, 22, 23, 24] },
    ],
    coveragePercent: 95,
    comparison: [
      { description: "Detects exponential complexity pattern without running code", category: "static-only" },
      { description: "Flags missing cycle-detection guard in recursive traversal", category: "static-only" },
      { description: "Reveals actual performance cost (8.2s for fib(40))", category: "dynamic-only" },
      { description: "Stack overflow on circular input crashes the program", category: "dynamic-only" },
      { description: "Both identify badFlatten as problematic with circular input", category: "both" },
    ],
  },
  {
    id: "type-coercion",
    name: "Type Coercion",
    shortName: "Types",
    code: `function addToCart(cart, item, quantity) {
  // Bug: quantity might be a string from form input
  const newTotal = cart.total + (item.price * quantity);
  cart.items.push({ ...item, quantity: quantity });
  cart.total = newTotal;
  return cart;
}

function applyDiscount(price, discount) {
  // Bug: string comparison instead of numeric
  if (discount > 100) {
    return 0;
  }
  return price - (price * discount / 100);
}

function formatPrice(amount) {
  // Bug: toFixed returns a string, not a number
  return amount.toFixed(2);
}

// Usage
let cart = { items: [], total: 0 };
cart = addToCart(cart, { name: "Book", price: 25 }, "2");
// cart.total is now "050" (string concat!) not 50

const discounted = applyDiscount(100, "50");
// "50" > 100 is false (string comparison), returns 50 not 0

const price = formatPrice(19.999);
// price is "20.00" (string), price + 1 is "20.001" not 21`,
    staticFindings: [
      {
        line: 3,
        severity: "error",
        rule: "type-mismatch",
        message: "`quantity` may be string — `price * quantity` performs implicit coercion",
        explanation: "If `quantity` comes from user input (e.g., form field), it's a string. `price * '2'` coerces to number (giving 50), but `0 + 50` then `cart.total + (...)` may concatenate if total became a string elsewhere. Type analysis flags this mixed-type arithmetic.",
      },
      {
        line: 11,
        severity: "warning",
        rule: "mixed-type-comparison",
        message: "`discount > 100` — if `discount` is a string, comparison uses lexicographic order",
        explanation: "String '50' > 100 is false because '50' is compared as a string against the number 100 (coerced to '100'). Lexicographically, '5' > '1' so '50' > '100' is true in some engines, but the intent is clearly a numeric comparison.",
      },
      {
        line: 19,
        severity: "warning",
        rule: "return-type-mismatch",
        message: "`toFixed()` returns string, but function name implies numeric result",
        explanation: "The `toFixed(2)` method always returns a string. Downstream code using this value in arithmetic will get string concatenation instead of addition.",
      },
    ],
    dynamicResults: [
      { name: "addToCart with number quantity", status: "pass", input: "quantity=2 (number)", expected: "total: 50", actual: "total: 50", executedLines: [1, 2, 3, 4, 5, 6] },
      { name: "addToCart with string quantity", status: "fail", input: "quantity='2' (string)", expected: "total: 50", actual: "total: '050'", executedLines: [1, 2, 3, 4, 5, 6] },
      { name: "applyDiscount with string", status: "fail", input: "price=100, discount='50'", expected: "50", actual: "50 (but > 100 check broken)", executedLines: [9, 10, 11, 14] },
      { name: "formatPrice arithmetic", status: "fail", input: "19.999", expected: "20.00 + 1 = 21", actual: "'20.00' + 1 = '20.001'", executedLines: [17, 18, 19] },
    ],
    coveragePercent: 91,
    comparison: [
      { description: "Detects potential type mismatch without needing test inputs", category: "static-only" },
      { description: "Identifies `toFixed()` return type issue at definition", category: "static-only" },
      { description: "Reveals actual '050' concatenation behavior", category: "dynamic-only" },
      { description: "Both flag the string quantity multiplication issue", category: "both" },
    ],
  },
  {
    id: "null-pointer",
    name: "Null Pointer",
    shortName: "Null",
    code: `function getUserName(user) {
  return user.name.toUpperCase();  // Bug: user or user.name could be null
}

function getFirstItem(list) {
  return list[0].value;  // Bug: list could be empty
}

function processConfig(config) {
  const timeout = config.settings.timeout;  // Bug: settings could be undefined
  const retries = config.settings.retries || 3;
  return { timeout, retries };
}

function safeGetName(user) {
  // Safe: optional chaining + nullish coalescing
  return user?.name?.toUpperCase() ?? "Anonymous";
}

// Usage
getUserName({ name: "Alice" });       // "ALICE" — works
getUserName(null);                     // TypeError: Cannot read properties of null
getUserName({ name: null });           // TypeError: Cannot read 'toUpperCase' of null

getFirstItem([{ value: 42 }]);        // 42 — works
getFirstItem([]);                      // TypeError: Cannot read 'value' of undefined

processConfig({ settings: { timeout: 5000 } }); // Works
processConfig({});                     // TypeError: Cannot read 'timeout' of undefined`,
    staticFindings: [
      {
        line: 2,
        severity: "error",
        rule: "possible-null-deref",
        message: "`user` may be null — accessing `.name` would throw TypeError",
        explanation: "Without a null check on `user`, calling `user.name` when user is null/undefined will crash. Static analysis tracks that function parameters can receive any value including null.",
      },
      {
        line: 2,
        severity: "error",
        rule: "possible-null-deref",
        message: "`user.name` may be null — calling `.toUpperCase()` would throw TypeError",
        explanation: "Even if `user` is non-null, `user.name` could be null or undefined. Chained property access requires checking each step.",
      },
      {
        line: 6,
        severity: "error",
        rule: "possible-null-deref",
        message: "`list[0]` may be undefined if list is empty",
        explanation: "Accessing index 0 of an empty array returns `undefined`. Then `.value` on `undefined` throws TypeError.",
      },
      {
        line: 10,
        severity: "error",
        rule: "possible-null-deref",
        message: "`config.settings` may be undefined",
        explanation: "If the config object doesn't have a `settings` property, accessing `.timeout` on undefined throws TypeError.",
      },
      {
        line: 16,
        severity: "info",
        rule: "safe-access-pattern",
        message: "Good: optional chaining `?.` and nullish coalescing `??` provide safe access",
        explanation: "This is the recommended pattern. `user?.name?.toUpperCase()` returns undefined (not TypeError) if any part is null, and `?? 'Anonymous'` provides a default.",
      },
    ],
    dynamicResults: [
      { name: "getUserName with valid user", status: "pass", input: "{name: 'Alice'}", expected: "ALICE", actual: "ALICE", executedLines: [1, 2] },
      { name: "getUserName with null", status: "error", input: "null", expected: "error handled", actual: "TypeError: Cannot read properties of null", executedLines: [1, 2] },
      { name: "getFirstItem with empty list", status: "error", input: "[]", expected: "undefined", actual: "TypeError: Cannot read 'value' of undefined", executedLines: [5, 6] },
      { name: "processConfig missing settings", status: "error", input: "{}", expected: "defaults", actual: "TypeError: Cannot read 'timeout' of undefined", executedLines: [9, 10] },
      { name: "safeGetName with null", status: "pass", input: "null", expected: "Anonymous", actual: "Anonymous", executedLines: [15, 16] },
    ],
    coveragePercent: 78,
    comparison: [
      { description: "Finds ALL null paths without writing test cases", category: "static-only" },
      { description: "Identifies the safe `?.` pattern as correct", category: "static-only" },
      { description: "Confirms exact TypeError messages at each crash point", category: "dynamic-only" },
      { description: "Both identify null dereference on `user.name.toUpperCase()`", category: "both" },
    ],
  },
];

export function getSnippet(id: string): Snippet | undefined {
  return SNIPPETS.find((s) => s.id === id);
}
