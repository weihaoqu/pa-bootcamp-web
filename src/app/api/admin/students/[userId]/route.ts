import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getStudentDetail, updateUserNotes, deleteUser } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "instructor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { userId } = await params;
  const detail = getStudentDetail(Number(userId));
  if (!detail) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(detail);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "instructor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { userId } = await params;
  const body = await req.json();
  if (typeof body.notes === "string") {
    updateUserNotes(Number(userId), body.notes);
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "instructor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { userId } = await params;
  deleteUser(Number(userId));
  return NextResponse.json({ ok: true });
}
