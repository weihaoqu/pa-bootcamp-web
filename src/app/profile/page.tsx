"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState("");
  const [savedUrl, setSavedUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status !== "authenticated") return;
    if (session?.user?.role === "instructor") {
      router.push("/admin");
      return;
    }

    Promise.all([
      fetch("/api/profile").then((r) => r.json()),
      fetch("/api/progress").then((r) => r.json()),
    ]).then(([profile, prog]) => {
      setRepoUrl(profile.repo_url || "");
      setSavedUrl(profile.repo_url || "");
      setProgress(prog.keys || []);
      setLoading(false);
    });
  }, [status, session, router]);

  async function saveRepo(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repo_url: repoUrl }),
    });
    setSaving(false);
    if (res.ok) {
      setSavedUrl(repoUrl);
      setMessage("Saved!");
      setTimeout(() => setMessage(""), 2000);
    } else {
      setMessage("Failed to save");
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="mb-1 text-2xl font-bold text-slate-900">My Profile</h1>
      <p className="mb-8 text-sm text-slate-500">
        {session?.user?.name} &middot; {session?.user?.login}
      </p>

      {/* Repo URL */}
      <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="mb-3 text-lg font-semibold text-slate-800">
          Fork Repository URL
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          Submit the URL of your forked bootcamp repository so the instructor
          can review your work.
        </p>
        <form onSubmit={saveRepo} className="flex gap-2">
          <input
            type="url"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/you/program-analysis-bootcamp-student"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={saving || repoUrl === savedUrl}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </form>
        {message && (
          <p className={`mt-2 text-sm ${message === "Saved!" ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>

      {/* Progress */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="mb-3 text-lg font-semibold text-slate-800">
          Exercise Progress
        </h2>
        {progress.length === 0 ? (
          <p className="text-sm text-slate-400">
            No exercises completed yet. Check off exercises as you work through
            the modules!
          </p>
        ) : (
          <div className="space-y-1">
            <p className="mb-2 text-sm text-slate-500">
              {progress.length} exercise{progress.length !== 1 && "s"} completed
            </p>
            <div className="flex flex-wrap gap-2">
              {progress.sort().map((key) => (
                <span
                  key={key}
                  className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
                >
                  {key}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
