"use client";

import { useState, useEffect, useCallback } from "react";
import { SlideData } from "@/lib/types";
import SlideNavigation from "./SlideNavigation";
import MarkdownRenderer from "@/components/content/MarkdownRenderer";

type ViewMode = "lecture" | "guide" | "html";

interface SlideViewerProps {
  lectureSlides: SlideData[];
  guideSlides: SlideData[];
  htmlDeckUrl?: string;
  moduleName: string;
}

export default function SlideViewer({
  lectureSlides,
  guideSlides,
  htmlDeckUrl,
  moduleName,
}: SlideViewerProps) {
  const hasLecture = lectureSlides.length > 0;
  const hasGuide = guideSlides.length > 0;
  const hasHtml = !!htmlDeckUrl;

  const defaultMode: ViewMode = hasLecture
    ? "lecture"
    : hasHtml
    ? "html"
    : "guide";

  const [viewMode, setViewMode] = useState<ViewMode>(defaultMode);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const activeSlides =
    viewMode === "lecture"
      ? lectureSlides
      : viewMode === "guide"
      ? guideSlides
      : [];

  // Reset slide index when switching modes
  useEffect(() => {
    setCurrentSlide(0);
  }, [viewMode]);

  const goTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < activeSlides.length) {
        setCurrentSlide(index);
      }
    },
    [activeSlides.length]
  );

  const goNext = useCallback(
    () => goTo(currentSlide + 1),
    [currentSlide, goTo]
  );
  const goPrev = useCallback(
    () => goTo(currentSlide - 1),
    [currentSlide, goTo]
  );

  // Keyboard navigation
  useEffect(() => {
    if (viewMode === "html") return;

    function handleKey(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLSelectElement ||
        e.target instanceof HTMLInputElement
      )
        return;

      switch (e.key) {
        case "ArrowRight":
        case " ":
          e.preventDefault();
          goNext();
          break;
        case "ArrowLeft":
          e.preventDefault();
          goPrev();
          break;
        case "Home":
          e.preventDefault();
          goTo(0);
          break;
        case "End":
          e.preventDefault();
          goTo(activeSlides.length - 1);
          break;
        case "Escape":
          if (isFullscreen) {
            e.preventDefault();
            setIsFullscreen(false);
          }
          break;
        case "f":
        case "F":
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            setIsFullscreen((f) => !f);
          }
          break;
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [viewMode, goNext, goPrev, goTo, activeSlides.length, isFullscreen]);

  // Build tab list
  const tabs: { mode: ViewMode; label: string; count?: number }[] = [];
  if (hasLecture)
    tabs.push({ mode: "lecture", label: "Lecture Slides", count: lectureSlides.length });
  if (hasHtml)
    tabs.push({ mode: "html", label: "Presentation" });
  if (hasGuide)
    tabs.push({ mode: "guide", label: "Student Guide", count: guideSlides.length });

  const currentSlideData = activeSlides[currentSlide];

  // ─── Fullscreen presentation mode ────────────────────────────────
  if (isFullscreen && currentSlideData) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col bg-white">
        {/* Fullscreen slide content — centered, large text */}
        <div
          className="flex flex-1 items-start justify-center overflow-y-auto px-16 py-12"
          onClick={(e) => {
            // Click left half = prev, right half = next
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const x = e.clientX - rect.left;
            if (x < rect.width / 3) goPrev();
            else goNext();
          }}
        >
          <div className="w-full max-w-5xl">
            <div className="slide-fullscreen prose prose-slate max-w-none">
              <MarkdownRenderer content={currentSlideData.content} />
            </div>
          </div>
        </div>

        {/* Fullscreen bottom bar */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-2">
          <div className="flex items-center gap-3">
            <button
              onClick={goPrev}
              disabled={currentSlide <= 0}
              className="rounded-md bg-navy px-3 py-1.5 text-sm font-medium text-white disabled:opacity-30"
            >
              Prev
            </button>
            <button
              onClick={goNext}
              disabled={currentSlide >= activeSlides.length - 1}
              className="rounded-md bg-navy px-3 py-1.5 text-sm font-medium text-white disabled:opacity-30"
            >
              Next
            </button>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-48 rounded-full bg-slate-200">
              <div
                className="h-1.5 rounded-full bg-accent-red transition-all duration-300"
                style={{
                  width: `${((currentSlide + 1) / activeSlides.length) * 100}%`,
                }}
              />
            </div>
            <span className="text-sm text-slate-500">
              {currentSlide + 1} / {activeSlides.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">
              Esc to exit &middot; F to toggle &middot; Arrows to navigate
            </span>
            <button
              onClick={() => setIsFullscreen(false)}
              className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
            >
              Exit Fullscreen
            </button>
          </div>
        </div>

        {/* Fullscreen-specific styles */}
        <style>{`
          .slide-fullscreen h1 {
            font-size: 2.8em;
            color: var(--navy);
            margin-bottom: 0.4em;
            font-weight: 700;
          }
          .slide-fullscreen h2 {
            font-size: 2em;
            color: var(--navy);
            border-bottom: 3px solid var(--accent-red);
            display: inline-block;
            padding-bottom: 4px;
            margin-bottom: 0.5em;
          }
          .slide-fullscreen h3 {
            font-size: 1.5em;
            color: #16213e;
            margin: 0.75em 0 0.3em;
          }
          .slide-fullscreen p,
          .slide-fullscreen li {
            font-size: 1.35em;
            line-height: 1.7;
          }
          .slide-fullscreen pre {
            font-size: 1.1em;
            padding: 1em 1.25em;
          }
          .slide-fullscreen code {
            font-size: 0.92em;
          }
          .slide-fullscreen table {
            font-size: 1.1em;
          }
          .slide-fullscreen strong {
            color: var(--navy);
          }
          .slide-fullscreen em {
            color: var(--accent-red);
            font-style: normal;
            font-weight: 600;
          }
        `}</style>
      </div>
    );
  }

  // ─── Normal (embedded) view ──────────────────────────────────────
  return (
    <div className="flex h-[calc(100vh-56px-24px)] flex-col">
      {/* Header with tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-0">
        <div className="flex items-center gap-6">
          <h2 className="text-lg font-semibold text-navy">{moduleName}</h2>
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.mode}
                onClick={() => setViewMode(tab.mode)}
                className={`border-b-2 px-3 py-3 text-sm font-medium transition-colors ${
                  viewMode === tab.mode
                    ? "border-accent-red text-accent-red"
                    : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-1.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {viewMode !== "html" && activeSlides.length > 0 && (
            <>
              <span className="text-xs text-slate-400">
                Arrows to navigate &middot; F for fullscreen
              </span>
              <button
                onClick={() => setIsFullscreen(true)}
                className="flex items-center gap-1.5 rounded-md bg-navy px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-navy-dark"
                title="Enter presentation mode (F)"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                </svg>
                Play
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === "html" && htmlDeckUrl ? (
          <iframe
            src={htmlDeckUrl}
            className="h-full w-full border-0"
            title={`${moduleName} presentation`}
          />
        ) : activeSlides.length > 0 && currentSlideData ? (
          <div className="h-full overflow-y-auto bg-white p-8 md:p-12">
            <div className="slide-content mx-auto max-w-4xl">
              <MarkdownRenderer content={currentSlideData.content} />
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-400">
            <svg
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5"
              />
            </svg>
            <p>No slides available for this module yet.</p>
            {hasGuide && viewMode !== "guide" && (
              <button
                onClick={() => setViewMode("guide")}
                className="text-sm text-accent-red underline"
              >
                View Student Guide instead
              </button>
            )}
          </div>
        )}
      </div>

      {/* Navigation (markdown modes only) */}
      {viewMode !== "html" && activeSlides.length > 0 && (
        <SlideNavigation
          current={currentSlide}
          total={activeSlides.length}
          onPrev={goPrev}
          onNext={goNext}
          onGoTo={goTo}
        />
      )}
    </div>
  );
}
