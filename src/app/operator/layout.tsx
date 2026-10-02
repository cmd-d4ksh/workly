import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getCurrentUser } from "@/lib/auth";
import { getOperatorByUserId } from "@/lib/data/operators";

export default async function OperatorLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "operator") redirect(user.role === "seeker" ? "/dashboard" : "/admin");

  const operator = getOperatorByUserId(user.id);
  if (!operator) redirect("/login");

  return (
    <DashboardShell role="operator" user={user} title={operator.companyName}>
      {children}
    </DashboardShell>
  );
}
