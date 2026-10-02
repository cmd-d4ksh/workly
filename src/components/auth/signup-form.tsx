"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signupAction, AuthActionState } from "@/app/actions/auth";
import { Role } from "@/lib/types";

const initialState: AuthActionState = {};

export function SignupForm() {
  const searchParams = useSearchParams();
  const [role, setRole] = useState<Role>((searchParams.get("role") as Role) === "operator" ? "operator" : "seeker");
  const [state, formAction, pending] = useActionState(signupAction, initialState);

  return (
    <div>
      <h1 className="font-heading text-xl font-medium">Create your account</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {role === "operator" ? "List your space and start receiving leads." : "Find a workspace that fits your team."}
      </p>

      <Tabs value={role} onValueChange={(v) => setRole(v as Role)} className="mt-5">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="seeker">Looking for space</TabsTrigger>
          <TabsTrigger value="operator">Have space to list</TabsTrigger>
        </TabsList>
      </Tabs>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <input type="hidden" name="role" value={role} />
        <div>
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" name="fullName" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required className="mt-1.5" />
        </div>
        {state.error && <p className="text-sm text-destructive">{state.error}</p>}
        <Button type="submit" disabled={pending} className="bg-brand text-brand-foreground hover:bg-brand/90">
          {pending ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-foreground hover:underline">Log in</Link>
      </p>
    </div>
  );
}
