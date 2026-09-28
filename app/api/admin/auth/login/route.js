import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { createAdminSession } from "@/lib/admin-auth";

const loginSchema = z.object({
  username: z.string().trim().min(3).max(64),
  password: z.string().min(1).max(256),
});

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid username and password." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { username: parsed.data.username.toLowerCase() },
  });
  const passwordMatches = user && await bcrypt.compare(parsed.data.password, user.passwordHash);

  if (!user || !user.isActive || !passwordMatches) {
    return NextResponse.json({ error: "Username or password is incorrect." }, { status: 401 });
  }

  await createAdminSession(user.id);
  return NextResponse.json({
    user: { id: user.id, username: user.username, name: user.name, role: user.role },
  });
}