import Link from "next/link";
import { X } from "lucide-react";
import { Logo } from "@/components/layout/logo";

export default function GetStartedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between border-b border-border px-5 sm:px-10">
        <Logo />
        <Link href="/" aria-label="Close" className="text-muted-foreground hover:text-foreground">
          <X className="size-5" />
        </Link>
      </header>
      <main className="flex-1 px-5 sm:px-10">{children}</main>
    </div>
  );
}
