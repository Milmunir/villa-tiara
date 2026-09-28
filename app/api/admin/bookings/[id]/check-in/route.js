import { NextResponse } from "next/server";
import { authorizeAdmin, apiError } from "@/lib/admin-api";
import { serializeReservation, transitionReservation } from "@/lib/admin-data";

export async function POST(_request, { params }) {
  const { user, response } = await authorizeAdmin();
  if (response) return response;

  try {
    const { id } = await params;
    const reservation = await transitionReservation(id, "CHECKED_IN", user.id);
    return NextResponse.json(serializeReservation(reservation));
  } catch (error) {
    return apiError(error);
  }
}