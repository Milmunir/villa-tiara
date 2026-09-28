import { NextResponse } from "next/server";
import { authorizeAdmin, apiError, parseJson } from "@/lib/admin-api";
import prisma from "@/lib/prisma";
import { createGuestLog, guestInputSchema, serializeGuest } from "@/lib/admin-data";

export async function GET() {
  const { response } = await authorizeAdmin();
  if (response) return response;

  try {
    const guests = await prisma.guestLog.findMany({ orderBy: { visitedAt: "desc" } });
    return NextResponse.json(guests.map(serializeGuest));
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request) {
  const { user, response } = await authorizeAdmin();
  if (response) return response;

  try {
    const body = await parseJson(request, guestInputSchema);
    return NextResponse.json(serializeGuest(await createGuestLog(body, user.id)), { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE() {
  const { response } = await authorizeAdmin();
  if (response) return response;

  try {
    await prisma.guestLog.deleteMany();
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error);
  }
}