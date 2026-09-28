import { NextResponse } from "next/server";
import { authorizeAdmin, apiError } from "@/lib/admin-api";
import { listRooms } from "@/lib/admin-data";

export async function GET(request) {
  const { response } = await authorizeAdmin();
  if (response) return response;

  try {
    const date = new URL(request.url).searchParams.get("date");
    return NextResponse.json(await listRooms(date || undefined));
  } catch (error) {
    return apiError(error);
  }
}