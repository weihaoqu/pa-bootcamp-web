import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserByEmail, updateRepoUrl } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || session.user.id === "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = getUserByEmail(session.user.login);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json({
    name: user.name,
    email: user.email,
    repo_url: user.repo_url,
    created_at: user.created_at,
  });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.id === "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { repo_url } = body;
  if (typeof repo_url !== "string") {
    return NextResponse.json({ error: "repo_url is required" }, { status: 400 });
  }
  updateRepoUrl(Number(session.user.id), repo_url);
  return NextResponse.json({ ok: true });
}
