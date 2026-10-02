"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction, demoLoginAction, AuthActionState } from "@/app/actions/auth";
import { Role } from "@/lib/types";

const initialState: AuthActionState = {};

export function LoginForm({
  demoAccounts,
}: {
  demoAccounts: { label: string; userId: string; role: Role }[] | null;
}) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div>
      <h1 className="font-heading text-xl font-medium">Welcome back</h1>
      <p className="mt-1 text-sm text-muted-foreground">Log in to manage your workspace search or leads.</p>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required className="mt-1.5" placeholder="you@company.com" />
        </div>
        {state.error && <p className="text-sm text-destructive">{state.error}</p>}
        <Button type="submit" disabled={pending} className="bg-brand text-brand-foreground hover:bg-brand/90">
          {pending ? "Logging in…" : "Log in"}
        </Button>
      </form>

      {demoAccounts && (
        <div className="mt-5 border-t border-border pt-5">
          <p className="mb-2 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Quick access
          </p>
          <div className="grid grid-cols-3 gap-2">
            {demoAccounts.map((a) => (
              <form key={a.label} action={demoLoginAction}>
                <input type="hidden" name="userId" value={a.userId} />
                <input type="hidden" name="role" value={a.role} />
                <Button type="submit" variant="outline" size="sm" className="w-full">
                  {a.label}
                </Button>
              </form>
            ))}
          </div>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&rsquo;t have an account?{" "}
        <Link href="/signup" className="font-medium text-foreground hover:underline">Sign up</Link>
      </p>
    </div>
  );
}
