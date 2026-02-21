import { NextResponse } from "next/server";
import { recordVisit } from "@/lib/db";

export async function POST(req: Request) {
  const { path, userId } = await req.json();
  if (typeof path !== "string") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const uid = typeof userId === "string" ? Number(userId) : undefined;
  recordVisit(path, uid && !isNaN(uid) ? uid : undefined);
  return NextResponse.json({ ok: true });
}
