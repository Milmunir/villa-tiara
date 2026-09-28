import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";

export async function authorizeAdmin(superuserOnly = false) {
  const user = await getCurrentAdmin();
  if (!user) {
    return {
      user: null,
      response: NextResponse.json({ error: "Authentication required." }, { status: 401 }),
    };
  }
  if (superuserOnly && user.role !== "SUPERUSER") {
    return {
      user: null,
      response: NextResponse.json({ error: "Superuser access required." }, { status: 403 }),
    };
  }
  return { user, response: null };
}

export function apiError(error) {
  if (error?.name === "ZodError") {
    return NextResponse.json({ error: "Some submitted values are invalid." }, { status: 400 });
  }
  if (error instanceof AdminDataError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  if (error?.code === "P2002") {
    return NextResponse.json({ error: "That value is already in use." }, { status: 409 });
  }
  console.error("Admin API error:", error);
  return NextResponse.json({ error: "The request could not be completed." }, { status: 500 });
}

export class AdminDataError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "AdminDataError";
    this.status = status;
  }
}

export async function parseJson(request, schema) {
  let body;
  try {
    body = await request.json();
  } catch {
    throw new AdminDataError("Invalid JSON request body.");
  }
  const result = schema.safeParse(body);
  if (!result.success) throw result.error;
  return result.data;
}