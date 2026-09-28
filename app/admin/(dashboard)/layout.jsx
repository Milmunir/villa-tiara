import AdminTemplate from "@/app/(templates)/(Admin)/AdminTemplate";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin-auth";

export default async function AdminDashboardLayout({ children }) {
  const user = await getCurrentAdmin();
  if (!user) redirect("/admin/login");

  return <AdminTemplate currentUser={user}>{children}</AdminTemplate>;
}
