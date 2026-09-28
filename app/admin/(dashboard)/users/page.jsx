import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin-auth";
import UsersAdmin from "@/app/components/(Admin)/UsersAdmin";

export const metadata = {
  title: "Users - Villa Tiara Sarangan",
};

export default async function UsersPage() {
  const user = await getCurrentAdmin();
  if (!user) redirect("/admin/login");
  if (user.role !== "SUPERUSER") redirect("/admin/dashboard");
  return <UsersAdmin />;
}