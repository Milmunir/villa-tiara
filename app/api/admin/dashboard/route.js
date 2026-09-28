import { NextResponse } from "next/server";
import { authorizeAdmin, apiError } from "@/lib/admin-api";
import { getDashboardData } from "@/lib/admin-data";

export async function GET(request) {
  const { response } = await authorizeAdmin();
  if (response) return response;

  try {
    const date = new URL(request.url).searchParams.get("date");
    return NextResponse.json(await getDashboardData(date || undefined));
  } catch (error) {
    return apiError(error);
  }
}