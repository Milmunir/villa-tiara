import { NextResponse } from "next/server";
import { authorizeAdmin, apiError, parseJson } from "@/lib/admin-api";
import { reservationInputSchema, serializeReservation, transitionReservation, updateReservation } from "@/lib/admin-data";

export async function PATCH(request, { params }) {
  const { response } = await authorizeAdmin();
  if (response) return response;

  try {
    const { id } = await params;
    const body = await parseJson(request, reservationInputSchema);
    const reservation = await updateReservation(id, body);
    return NextResponse.json(serializeReservation(reservation));
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_request, { params }) {
  const { response } = await authorizeAdmin();
  if (response) return response;

  try {
    const { id } = await params;
    const reservation = await transitionReservation(id, "CANCELLED");
    return NextResponse.json(serializeReservation(reservation));
  } catch (error) {
    return apiError(error);
  }
}