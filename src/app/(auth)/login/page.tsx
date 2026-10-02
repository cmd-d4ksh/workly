import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { DEMO_ACCOUNTS } from "@/lib/auth";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  const demoAccounts = DEMO_ACCOUNTS
    ? [
        { label: "Seeker", userId: DEMO_ACCOUNTS.seeker.id, role: DEMO_ACCOUNTS.seeker.role },
        { label: "Operator", userId: DEMO_ACCOUNTS.operator.id, role: DEMO_ACCOUNTS.operator.role },
        { label: "Admin", userId: DEMO_ACCOUNTS.admin.id, role: DEMO_ACCOUNTS.admin.role },
      ]
    : null;

  return <LoginForm demoAccounts={demoAccounts} />;
}
