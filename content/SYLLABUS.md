# Program Analysis Bootcamp - Detailed Syllabus

## Course Information

**Course Title:** Program Analysis for Beginners
**Format:** Bootcamp (7 weeks)
**Prerequisites:** Basic programming experience
**Meeting Time:** [Schedule]
**Location:** [Location/Virtual]

## Instructor Information

**Name:** Dr. Weihao Qu
**Email:** wqu@monmouth.edu
**Office Hours:** By appointment
**Response Time:** Within 24 hours on weekdays

## Course Description

This bootcamp provides hands-on experience with program analysis techniques used in modern software development. Students learn to build tools that automatically analyze code for bugs, security vulnerabilities, and performance issues. The course covers foundational theory, AST-based code representation, static analysis with dataflow frameworks, abstract interpretation, taint-based security analysis, and tool integration -- all implemented in OCaml using algebraic data types, pattern matching, and functors.

## Learning Outcomes

Upon completion, students will be able to:

1. **Write** OCaml programs using algebraic data types, pattern matching, modules, and functors
2. **Analyze** the fundamental concepts of static and dynamic program analysis
3. **Design** and implement AST traversal and transformation algorithms
4. **Construct** control flow graphs and apply the dataflow analysis framework
5. **Implement** reaching definitions, live variables, and available expressions analyses
6. **Build** abstract domains (sign, constant, interval) satisfying the ABSTRACT_DOMAIN signature
7. **Apply** taint analysis to detect security vulnerabilities (SQL injection, XSS, command injection)
8. **Compose** multiple analysis passes into a configurable, reporting-capable tool pipeline
9. **Evaluate** trade-offs between soundness, completeness, precision, and scalability

## Course Schedule

### Week 0: OCaml Warm-Up (~2 hours)
**Module 0: OCaml Warm-Up** (99 tests)
- OCaml basics: let bindings, functions, tuples, Printf
- Algebraic data types and recursive pattern matching
- Collections: List, Map, Set, records, ref cells
- Module system: signatures, structures, functors
- Parsing with ocamllex and Menhir

### Week 1: Foundations (~3 hours)
**Module 1: Foundations of Program Analysis**
- What is program analysis? Static vs dynamic approaches
- Soundness, completeness, and decidability (Rice's theorem)
- Analysis scope: intraprocedural, interprocedural, whole-program
- SDLC integration and real-world tooling
- Exercise: Calculator bugs analysis
- Exercise: Analysis comparison classification
- Lab 1: Tool setup

### Week 2: Code Representation (~6 hours)
**Module 2: Code Representation and ASTs** (63 tests)
- Abstract Syntax Trees and the shared_ast library
- AST traversal algorithms (pre-order, post-order, BFS)
- Symbol tables with nested scope resolution
- AST transformations: constant folding, renaming, dead code elimination
- Lab 2: Build an AST parser

### Week 3: Static Analysis (~6 hours)
**Module 3: Static Analysis Fundamentals** (116 tests)
- Control flow graphs: basic blocks, edges, predecessors/successors
- The dataflow analysis framework: lattices, transfer functions, fixpoint
- Reaching definitions analysis (forward, may)
- Live variables analysis (backward, may)
- Available expressions analysis (forward, must)
- Interprocedural analysis and context sensitivity
- Lab 3: Build a static checker

### Week 4: Abstract Interpretation (~6 hours)
**Module 4: Abstract Interpretation** (128 tests)
- Abstract interpretation framework and Galois connections
- Sign domain: flat lattice, abstract arithmetic
- Constant propagation: flat constant lattice
- Interval domain: ranges, widening for termination
- Division-by-zero detection and safety analysis
- The ABSTRACT_DOMAIN module type and MakeEnv functor
- Lab 4: Build an abstract interpreter

### Week 5: Security Analysis (~6 hours)
**Module 5: Security Analysis** (100 tests)
- Taint lattice: {Bot, Untainted, Tainted, Top}
- Forward taint propagation using abstract transfer functions
- Security configuration: sources, sinks, sanitizers
- Implicit information flows via program-counter taint
- OWASP vulnerability detection: SQL injection, XSS, command injection, path traversal
- Sanitizer effectiveness and limitations
- Lab 5: Build a security analyzer

### Week 6: Tools Integration (~6 hours)
**Module 6: Tools Integration -- Capstone** (96 tests)
- Unified finding types across analysis passes
- Dead code detection (AST-level analysis)
- Multi-pass analyzer with record-based architecture
- Configurable pipelines with pass selection and filtering
- Structured reporting in text and JSON formats
- Lab 6: Build an integrated analyzer

## Assessment Structure

| Component | Weight | Description |
|-----------|--------|-------------|
| Module Quizzes | 18% | 6 quizzes (3% each) |
| Labs | 36% | 6 graded labs (6% each) |
| Exercises | 18% | 24 exercises across all modules |
| Participation | 28% | Engagement and discussion |

### Grading Scale
- A: 90-100% | B: 80-89% | C: 70-79% | D: 60-69% | F: <60%

### Test Summary

| Module | Exercises | Tests | Lab Tests |
|--------|-----------|-------|-----------|
| M0: OCaml Warm-Up | 5 | 99 | -- |
| M1: Foundations | 2 | 0 | 0 |
| M2: ASTs | 4 | 63 | 9 |
| M3: Static Analysis | 5 | 116 | 10 |
| M4: Abstract Interpretation | 5 | 128 | 10 |
| M5: Security Analysis | 5 | 100 | 10 |
| M6: Tools Integration | 5 | 96 | 40 |
| **Total** | **31** | **602** | **79** |

## Course Policies

### Attendance
- Synchronous sessions are mandatory
- Recordings available for asynchronous review
- Notify instructor of planned absences

### Late Work
- Lab exercises: 10% penalty per day late
- Projects: 15% penalty per day late
- Extensions granted for documented emergencies

### Academic Integrity
- Collaboration encouraged on exercises
- Individual work required for assessments
- Cite all external resources and tools used

## Required Materials

### Software
- Git and GitHub account
- OCaml 4.14+ with opam package manager
- Dune 3.0+ build system
- OUnit2 testing framework (`opam install ounit2`)
- Menhir parser generator (`opam install menhir`)
- Node.js 16+ (Module 1 only)
- VS Code with OCaml Platform extension (recommended)

### Hardware
- Computer with 8GB+ RAM
- Internet connection

## Course Resources

### Primary References
- [Static Program Analysis Book](https://cs.au.dk/~amoeller/spa/) (Free online) -- Moeller & Schwartzbach
- Course GitHub repository with all materials
- Rival & Yi, *Introduction to Static Analysis* (MIT Press)

### Supplementary Materials
- Cousot & Cousot, *Abstract Interpretation: A Unified Lattice Model* (1977)
- OCaml manual and standard library documentation
- OWASP Top 10 vulnerability reference

## Communication

### Primary Channels
- **GitHub Issues:** Technical questions and bugs
- **Email:** wqu@monmouth.edu for private concerns and administrative issues

### Response Expectations
- Instructor: 24 hours (weekdays)

## Accessibility

We are committed to providing equal access to all students. Please contact Dr. Qu to discuss any accommodations needed.

---

**Note:** This syllabus is subject to change with advance notice.
