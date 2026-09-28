import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { AdminDataError, authorizeAdmin, apiError, parseJson } from "@/lib/admin-api";

const updateSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  password: z.string().min(12).max(256).optional(),
  role: z.nativeEnum(UserRole).optional(),
  isActive: z.boolean().optional(),
}).refine((value) => Object.keys(value).length > 0);

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

export async function PATCH(request, { params }) {
  const { user: actor, response } = await authorizeAdmin(true);
  if (response) return response;

  try {
    const { id } = await params;
    const values = await parseJson(request, updateSchema);
    if (id === actor.id && (values.isActive === false || values.role === UserRole.STAFF)) {
      throw new AdminDataError("You cannot deactivate or demote your own account.", 409);
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) throw new AdminDataError("User not found.", 404);
    const removesSuperuser = existing.role === UserRole.SUPERUSER &&
      (values.role === UserRole.STAFF || values.isActive === false);
    if (removesSuperuser && existing.isActive) {
      const activeSuperusers = await prisma.user.count({ where: { role: UserRole.SUPERUSER, isActive: true } });
      if (activeSuperusers <= 1) throw new AdminDataError("At least one active superuser must remain.", 409);
    }

    const data = { name: values.name, role: values.role, isActive: values.isActive };
    if (values.password) data.passwordHash = await bcrypt.hash(values.password, 12);
    Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);
    const updated = await prisma.user.update({ where: { id }, data });
    if (values.password || values.isActive === false || values.role) {
      await prisma.session.deleteMany({ where: { userId: id } });
    }
    return NextResponse.json(publicUser(updated));
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_request, { params }) {
  const { user: actor, response } = await authorizeAdmin(true);
  if (response) return response;

  try {
    const { id } = await params;
    if (id === actor.id) throw new AdminDataError("You cannot deactivate your own account.", 409);
    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) throw new AdminDataError("User not found.", 404);
    if (target.role === UserRole.SUPERUSER && target.isActive) {
      const activeSuperusers = await prisma.user.count({ where: { role: UserRole.SUPERUSER, isActive: true } });
      if (activeSuperusers <= 1) throw new AdminDataError("At least one active superuser must remain.", 409);
    }

    const updated = await prisma.user.update({ where: { id }, data: { isActive: false } });
    await prisma.session.deleteMany({ where: { userId: id } });
    return NextResponse.json(publicUser(updated));
  } catch (error) {
    return apiError(error);
  }
}