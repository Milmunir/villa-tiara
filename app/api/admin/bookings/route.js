import { NextResponse } from "next/server";
import { authorizeAdmin, apiError, parseJson } from "@/lib/admin-api";
import prisma from "@/lib/prisma";
import { createReservation, reservationInputSchema, serializeReservation } from "@/lib/admin-data";

const allowedStatuses = new Set(["BOOKED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"]);

export async function GET(request) {
  const { response } = await authorizeAdmin();
  if (response) return response;

  try {
    const requestedStatus = new URL(request.url).searchParams.get("status");
    if (!requestedStatus || !allowedStatuses.has(requestedStatus)) {
      return NextResponse.json({ error: "A valid reservation status is required." }, { status: 400 });
    }
    const reservations = await prisma.reservation.findMany({
      where: { status: requestedStatus },
      include: { room: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(reservations.map(serializeReservation));
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request) {
  const { user, response } = await authorizeAdmin();
  if (response) return response;

  try {
    const body = await parseJson(request, reservationInputSchema);
    const reservation = await createReservation(body, user.id);
    return NextResponse.json(serializeReservation(reservation), { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}