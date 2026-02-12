#!/bin/bash
# Sync content from the student bootcamp repo into the web app's content/ directory.
# Usage: ./scripts/sync-content.sh [source_dir]
#
# The source directory defaults to CONTENT_SOURCE_DIR env var, or the sibling
# student repo at ../program-analysis-bootcamp-student.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CONTENT_DIR="$PROJECT_ROOT/content"

SOURCE="${1:-${CONTENT_SOURCE_DIR:-$(dirname "$PROJECT_ROOT")/program-analysis-bootcamp-student}}"

if [ ! -d "$SOURCE" ]; then
  echo "Error: source directory not found: $SOURCE"
  echo "Set CONTENT_SOURCE_DIR or pass the path as an argument."
  exit 1
fi

echo "Syncing content from: $SOURCE"
echo "             to: $CONTENT_DIR"

# Clean and recreate
rm -rf "$CONTENT_DIR"
mkdir -p "$CONTENT_DIR/modules" "$CONTENT_DIR/labs"

# Copy modules (exercises, STUDENT_README, README)
rsync -a \
  --include='*/' \
  --include='*.md' \
  --include='*.ml' \
  --include='*.mli' \
  --include='*.mll' \
  --include='*.mly' \
  --include='dune' \
  --include='dune-project' \
  --exclude='*' \
  "$SOURCE/modules/" "$CONTENT_DIR/modules/"

# Copy labs
rsync -a \
  --include='*/' \
  --include='*.md' \
  --include='*.ml' \
  --include='*.mli' \
  --include='*.mll' \
  --include='*.mly' \
  --include='dune' \
  --include='dune-project' \
  --exclude='*' \
  "$SOURCE/labs/" "$CONTENT_DIR/labs/"

# Copy top-level files
cp "$SOURCE/SYLLABUS.md" "$CONTENT_DIR/SYLLABUS.md" 2>/dev/null || true
cp "$SOURCE/README.md" "$CONTENT_DIR/README.md" 2>/dev/null || true

# Copy HTML slide decks to public/slides/ for iframe serving
SLIDES_DIR="$PROJECT_ROOT/public/slides"
rm -rf "$SLIDES_DIR"
mkdir -p "$SLIDES_DIR"

# Copy lecture slide markdown files into content/slides/
CONTENT_SLIDES_DIR="$CONTENT_DIR/slides"
mkdir -p "$CONTENT_SLIDES_DIR"

# Look for slides in both student and instructor repos
INSTRUCTOR_REPO="$(dirname "$PROJECT_ROOT")/program-analysis-bootcamp"
MD_SLIDE_COUNT=0
for REPO in "$SOURCE" "$INSTRUCTOR_REPO"; do
  if [ -d "$REPO" ]; then
    find "$REPO/modules" -path '*/slides/*.html' -exec cp {} "$SLIDES_DIR/" \; 2>/dev/null || true
    # Copy lecture slide markdown files (named by module slug)
    for MOD_DIR in "$REPO"/modules/module*/; do
      MOD_NAME=$(basename "$MOD_DIR")
      for MD_FILE in "$MOD_DIR"/slides/*.md; do
        if [ -f "$MD_FILE" ] && [ "$(wc -l < "$MD_FILE" | tr -d ' ')" -gt 10 ]; then
          cp "$MD_FILE" "$CONTENT_SLIDES_DIR/${MOD_NAME}.md"
          MD_SLIDE_COUNT=$((MD_SLIDE_COUNT + 1))
        fi
      done
    done
  fi
done

echo ""
echo "Content sync complete!"
echo "  Modules: $(ls "$CONTENT_DIR/modules/" | wc -l | tr -d ' ')"
echo "  Labs:    $(ls "$CONTENT_DIR/labs/" | wc -l | tr -d ' ')"
echo "  Slides:  $(ls "$SLIDES_DIR/"*.html 2>/dev/null | wc -l | tr -d ' ') HTML decks, $MD_SLIDE_COUNT markdown decks"
