import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getProgress, toggleProgress } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || session.user.id === "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const keys = getProgress(Number(session.user.id));
  return NextResponse.json({ keys });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.id === "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { exercise_key } = body;
  if (typeof exercise_key !== "string") {
    return NextResponse.json({ error: "exercise_key is required" }, { status: 400 });
  }
  const completed = toggleProgress(Number(session.user.id), exercise_key);
  return NextResponse.json({ completed });
}
