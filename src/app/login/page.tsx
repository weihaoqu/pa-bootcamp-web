"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function LoginForm() {
  const [field1, setField1] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isInstructor, setIsInstructor] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      username: field1,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError(isInstructor ? "Invalid username or password" : "Invalid email or password");
    } else {
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      if (session?.user?.role === "instructor") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }

  function toggleMode() {
    setIsInstructor(!isInstructor);
    setField1("");
    setPassword("");
    setError("");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-xl font-bold text-slate-900">
          {isInstructor ? "Instructor Login" : "Student Sign In"}
        </h1>
        <p className="mb-6 text-sm text-slate-500">PA Bootcamp</p>

        {justRegistered && !isInstructor && (
          <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">
            Account created! Sign in with your email and password.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              {isInstructor ? "Username" : "Email"}
            </label>
            <input
              type={isInstructor ? "text" : "email"}
              value={field1}
              onChange={(e) => setField1(e.target.value)}
              placeholder={isInstructor ? "Username" : "s1234567@monmouth.edu"}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-slate-500">
          {isInstructor ? (
            <button onClick={toggleMode} className="text-blue-600 hover:underline">
              Student sign in
            </button>
          ) : (
            <>
              New student?{" "}
              <Link href="/join" className="text-blue-600 hover:underline">
                Join the class
              </Link>
              <span className="mx-2 text-slate-300">|</span>
              <button onClick={toggleMode} className="text-blue-600 hover:underline">
                Instructor
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
