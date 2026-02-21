import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getPageVisitSummary } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "instructor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const visits = getPageVisitSummary();
  return NextResponse.json({ visits });
}
