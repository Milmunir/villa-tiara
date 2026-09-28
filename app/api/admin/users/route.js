import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { AdminDataError, authorizeAdmin, apiError, parseJson } from "@/lib/admin-api";

const userSchema = z.object({
  username: z.string().trim().toLowerCase().regex(/^[a-z0-9._-]{3,64}$/),
  name: z.string().trim().min(2).max(120),
  password: z.string().min(12).max(256),
  role: z.nativeEnum(UserRole).default(UserRole.STAFF),
});

function publicUser(user) {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
}

export async function GET() {
  const { response } = await authorizeAdmin(true);
  if (response) return response;

  try {
    const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });
    return NextResponse.json(users.map(publicUser));
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request) {
  const { response } = await authorizeAdmin(true);
  if (response) return response;

  try {
    const values = await parseJson(request, userSchema);
    const passwordHash = await bcrypt.hash(values.password, 12);
    const user = await prisma.user.create({
      data: {
        username: values.username,
        name: values.name,
        passwordHash,
        role: values.role,
      },
    });
    return NextResponse.json(publicUser(user), { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}

export { AdminDataError };