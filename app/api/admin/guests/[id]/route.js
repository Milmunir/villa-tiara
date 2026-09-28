import { NextResponse } from "next/server";
import { authorizeAdmin, apiError } from "@/lib/admin-api";
import prisma from "@/lib/prisma";

export async function DELETE(_request, { params }) {
  const { response } = await authorizeAdmin();
  if (response) return response;

  try {
    const { id } = await params;
    await prisma.guestLog.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error);
  }
}