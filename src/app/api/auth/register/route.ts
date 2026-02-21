import { NextResponse } from "next/server";
import { createUser, getUserByEmail, hashPassword } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, password, join_code } = body;

  if (!name || !email || !password || !join_code) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const expectedCode = process.env.CLASS_JOIN_CODE;
  if (!expectedCode || join_code !== expectedCode) {
    return NextResponse.json({ error: "Invalid enrollment code" }, { status: 403 });
  }

  if (!email.endsWith("@monmouth.edu")) {
    return NextResponse.json({ error: "Please use your monmouth.edu email" }, { status: 400 });
  }

  if (password.length < 4) {
    return NextResponse.json({ error: "Password must be at least 4 characters" }, { status: 400 });
  }

  const existing = getUserByEmail(email);
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  }

  try {
    const passwordHash = hashPassword(password);
    const user = createUser(name, email, passwordHash);
    return NextResponse.json({ id: user.id, name: user.name, email: user.email }, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
