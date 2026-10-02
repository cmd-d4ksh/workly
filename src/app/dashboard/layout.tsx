import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getCurrentUser } from "@/lib/auth";

export default async function SeekerDashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "seeker") redirect(user.role === "operator" ? "/operator" : "/admin");

  return (
    <DashboardShell role="seeker" user={user} title="Dashboard">
      {children}
    </DashboardShell>
  );
}
