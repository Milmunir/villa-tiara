import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";

export async function GET() {
  const user = await getCurrentAdmin();
  if (!user) return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
  return NextResponse.json({ user });
}