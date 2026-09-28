import { NextResponse } from "next/server";
import { authorizeAdmin, apiError, parseJson } from "@/lib/admin-api";
import { roomUpdateSchema, saveRoom } from "@/lib/admin-data";

export async function PATCH(request, { params }) {
  const { response } = await authorizeAdmin();
  if (response) return response;

  try {
    const { code } = await params;
    const values = await parseJson(request, roomUpdateSchema);
    const room = await saveRoom(code, values);
    return NextResponse.json({ success: true, code: room.code });
  } catch (error) {
    return apiError(error);
  }
}