import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
        <span className="text-4xl font-bold text-slate-300">404</span>
      </div>
      <h1 className="mb-2 text-2xl font-bold text-navy">Page Not Found</h1>
      <p className="mb-8 text-slate-500">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <div className="flex gap-3">
        <Link
          href="/modules"
          className="rounded-lg bg-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-navy-dark"
        >
          Browse Modules
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
