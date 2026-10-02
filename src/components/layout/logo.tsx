import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, dark }: { className?: string; dark?: boolean }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 font-heading text-[1.35rem] font-semibold tracking-tight",
        dark ? "text-white" : "text-foreground",
        className
      )}
    >
      <span
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-[7px] text-sm font-bold",
          "bg-brand text-brand-foreground"
        )}
        aria-hidden
      >
        W
      </span>
      Workly
    </Link>
  );
}
