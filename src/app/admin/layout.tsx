import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect(user.role === "operator" ? "/operator" : "/dashboard");

  return (
    <DashboardShell role="admin" user={user} title="Admin">
      {children}
    </DashboardShell>
  );
}
