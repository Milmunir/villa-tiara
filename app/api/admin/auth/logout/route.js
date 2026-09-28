import { NextResponse } from "next/server";
import { deleteCurrentAdminSession } from "@/lib/admin-auth";

export async function POST() {
  await deleteCurrentAdminSession();
  return NextResponse.json({ success: true });
}