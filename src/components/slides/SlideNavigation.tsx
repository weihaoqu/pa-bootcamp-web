"use client";

interface SlideNavigationProps {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (index: number) => void;
}

export default function SlideNavigation({
  current,
  total,
  onPrev,
  onNext,
  onGoTo,
}: SlideNavigationProps) {
  const progress = total > 1 ? ((current + 1) / total) * 100 : 100;

  return (
    <div className="flex items-center gap-4 border-t border-slate-200 bg-white px-6 py-3">
      {/* Prev/Next */}
      <button
        onClick={onPrev}
        disabled={current <= 0}
        className="rounded-md bg-navy px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-navy-dark disabled:opacity-30"
      >
        Prev
      </button>

      {/* Progress bar */}
      <div className="flex flex-1 items-center gap-3">
        <div className="h-1.5 flex-1 rounded-full bg-slate-100">
          <div
            className="h-1.5 rounded-full bg-accent-red transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="min-w-[60px] text-center text-sm text-slate-500">
          {current + 1} / {total}
        </span>
      </div>

      {/* Slide jump */}
      <select
        value={current}
        onChange={(e) => onGoTo(Number(e.target.value))}
        className="rounded-md border border-slate-200 px-2 py-1 text-sm text-slate-600"
      >
        {Array.from({ length: total }, (_, i) => (
          <option key={i} value={i}>
            Slide {i + 1}
          </option>
        ))}
      </select>

      <button
        onClick={onNext}
        disabled={current >= total - 1}
        className="rounded-md bg-navy px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-navy-dark disabled:opacity-30"
      >
        Next
      </button>
    </div>
  );
}
