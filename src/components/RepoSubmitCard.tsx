"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function RepoSubmitCard() {
  const { data: session, status } = useSession();
  const [repoUrl, setRepoUrl] = useState("");
  const [savedUrl, setSavedUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const isStudent =
    status === "authenticated" &&
    session?.user?.role === "student";

  useEffect(() => {
    if (!isStudent) return;
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        setRepoUrl(data.repo_url || "");
        setSavedUrl(data.repo_url || "");
      })
      .catch(() => {});
  }, [isStudent]);

  if (!isStudent) return null;

  async function handleSubmit(e: React.FormEvent) {
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
      setMessage("Submitted!");
      setTimeout(() => setMessage(""), 3000);
    } else {
      setMessage("Failed to save");
    }
  }

  return (
    <div className="mb-10 rounded-xl border-2 border-accent-red/30 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent-red/10">
          <svg className="h-5 w-5 text-accent-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-navy">Submit Your Fork</h3>
          <p className="mb-3 text-sm text-slate-500">
            Paste the URL of your forked repository so the instructor can review your work.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/you/program-analysis-bootcamp-student"
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-accent-red focus:outline-none focus:ring-1 focus:ring-accent-red"
            />
            <button
              type="submit"
              disabled={saving || !repoUrl || repoUrl === savedUrl}
              className="rounded-lg bg-accent-red px-5 py-2 text-sm font-medium text-white hover:bg-accent-red/90 disabled:opacity-50"
            >
              {saving ? "Saving..." : savedUrl ? "Update" : "Submit"}
            </button>
          </form>
          {message && (
            <p className={`mt-2 text-sm ${message === "Submitted!" ? "text-green-600" : "text-red-600"}`}>
              {message}
            </p>
          )}
          {savedUrl && !message && (
            <p className="mt-2 text-sm text-green-600">
              Submitted: <a href={savedUrl} target="_blank" rel="noopener noreferrer" className="underline">{savedUrl}</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
