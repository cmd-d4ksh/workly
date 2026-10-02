"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 className="size-10 text-brand" />
        <h1 className="mt-4 font-heading text-xl font-medium">Check your email</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          If an account exists for that address, we&rsquo;ve sent a password reset link.
        </p>
        <Button variant="outline" className="mt-6" render={<Link href="/login" />}>
          Back to log in
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-xl font-medium">Reset your password</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter your email and we&rsquo;ll send you a reset link.
      </p>
      <form
        className="mt-6 flex flex-col gap-4"
        onSubmit={(e) => { e.preventDefault(); setSent(true); }}
      >
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required className="mt-1.5" />
        </div>
        <Button type="submit" className="bg-brand text-brand-foreground hover:bg-brand/90">
          Send reset link
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/login" className="font-medium text-foreground hover:underline">Back to log in</Link>
      </p>
    </div>
  );
}
