import fs from "fs";
import path from "path";
import { FileEntry } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

/** Read a markdown file from the content directory. Returns empty string if not found. */
export function readContentFile(relativePath: string): string {
  const fullPath = path.join(CONTENT_DIR, relativePath);
  try {
    return fs.readFileSync(fullPath, "utf-8");
  } catch {
    return "";
  }
}

/** Get the STUDENT_README.md for a module */
export function getModuleReadme(moduleSlug: string): string {
  return readContentFile(`modules/${moduleSlug}/STUDENT_README.md`);
}

/** Get the README.md for a lab */
export function getLabReadme(labSlug: string): string {
  // Try STUDENT_README first, then README
  const studentReadme = readContentFile(`labs/${labSlug}/STUDENT_README.md`);
  if (studentReadme) return studentReadme;
  return readContentFile(`labs/${labSlug}/README.md`);
}

/** Get the SYLLABUS.md */
export function getSyllabus(): string {
  return readContentFile("SYLLABUS.md");
}

/** List all .ml/.mli files in an exercise's starter directory */
export function getExerciseFiles(
  moduleSlug: string,
  exerciseSlug: string
): FileEntry[] {
  const starterDir = path.join(
    CONTENT_DIR,
    "modules",
    moduleSlug,
    "exercises",
    exerciseSlug,
    "starter"
  );
  return readOCamlFiles(starterDir, "starter");
}

/** List all .ml/.mli files in a lab's starter directory */
export function getLabFiles(labSlug: string): FileEntry[] {
  const starterDir = path.join(CONTENT_DIR, "labs", labSlug, "starter");
  return readOCamlFiles(starterDir, "starter");
}

/** List all test files for an exercise */
export function getExerciseTestFiles(
  moduleSlug: string,
  exerciseSlug: string
): FileEntry[] {
  const testsDir = path.join(
    CONTENT_DIR,
    "modules",
    moduleSlug,
    "exercises",
    exerciseSlug,
    "tests"
  );
  return readOCamlFiles(testsDir, "tests");
}

/** List all test files for a lab */
export function getLabTestFiles(labSlug: string): FileEntry[] {
  const testsDir = path.join(CONTENT_DIR, "labs", labSlug, "starter", "tests");
  return readOCamlFiles(testsDir, "tests");
}

/** Recursively read OCaml source files from a directory */
function readOCamlFiles(dir: string, prefix: string): FileEntry[] {
  const files: FileEntry[] = [];
  if (!fs.existsSync(dir)) return files;

  const OCAML_EXTS = new Set([".ml", ".mli", ".mll", ".mly"]);

  function walk(currentDir: string, relPrefix: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relPath = relPrefix
        ? `${relPrefix}/${entry.name}`
        : entry.name;

      if (entry.isDirectory()) {
        walk(fullPath, relPath);
      } else if (OCAML_EXTS.has(path.extname(entry.name))) {
        files.push({
          name: entry.name,
          path: `${prefix}/${relPath}`,
          content: fs.readFileSync(fullPath, "utf-8"),
        });
      }
    }
  }

  walk(dir, "");
  return files;
}

/** Check if a directory exists in content */
export function contentDirExists(relativePath: string): boolean {
  return fs.existsSync(path.join(CONTENT_DIR, relativePath));
}
