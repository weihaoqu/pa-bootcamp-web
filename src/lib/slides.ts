import { SlideData } from "./types";
import { readContentFile, getModuleReadme } from "./content";

/**
 * Parse a reveal.js-style markdown slide deck into individual slides.
 * Splits on `---` separators and strips YAML frontmatter.
 */
function parseMarkdownSlides(markdown: string): SlideData[] {
  if (!markdown) return [];

  // Split on horizontal rules (---) that are on their own line
  const parts = markdown.split(/\n\s*---\s*\n/);

  return parts
    .map((content, index) => ({
      content: content.trim(),
      index,
    }))
    .filter((slide) => {
      // Skip empty slides and YAML frontmatter blocks
      if (slide.content.length === 0) return false;
      // Skip if it looks like pure YAML frontmatter (key: value lines only)
      const lines = slide.content.split("\n");
      const isYaml = lines.every(
        (l) => /^\s*\w[\w\s]*:/.test(l) || l.trim() === ""
      );
      return !isYaml;
    })
    .map((slide, newIndex) => ({ ...slide, index: newIndex }));
}

/**
 * Get the lecture slides for a module (the real course slide deck).
 * Returns slides parsed from the lecture markdown file (modules 1-5),
 * or empty if no lecture slides exist.
 */
export function getLectureSlides(moduleSlug: string): SlideData[] {
  const markdown = readContentFile(`slides/${moduleSlug}.md`);
  return parseMarkdownSlides(markdown);
}

/**
 * Get the student guide split into slides (from STUDENT_README).
 * Used as a fallback or secondary view.
 */
export function getGuideSlides(moduleSlug: string): SlideData[] {
  const markdown = getModuleReadme(moduleSlug);
  return parseMarkdownSlides(markdown);
}
