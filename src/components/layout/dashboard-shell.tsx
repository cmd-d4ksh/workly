"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LucideIcon, Menu, LayoutDashboard, User, Heart, MessagesSquare,
  Users, Building2, LineChart, CreditCard, Settings, Briefcase,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { UserMenu } from "@/components/layout/user-menu";
import { Profile, Role } from "@/lib/types";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

/**
 * Nav items live here (client-side) rather than being passed in as props —
 * Lucide icons are component references, which can't cross the Server ->
 * Client Component boundary. Layouts only pass a `role` string.
 */
const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  seeker: [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My inquiries", href: "/dashboard/inquiries", icon: MessagesSquare },
    { label: "Saved spaces", href: "/dashboard/saved", icon: Heart },
    { label: "Profile", href: "/dashboard/profile", icon: User },
  ],
  operator: [
    { label: "Overview", href: "/operator", icon: LayoutDashboard },
    { label: "Leads", href: "/operator/leads", icon: Users },
    { label: "Spaces", href: "/operator/spaces", icon: Building2 },
    { label: "Messages", href: "/operator/messages", icon: MessagesSquare },
    { label: "Analytics", href: "/operator/analytics", icon: LineChart },
    { label: "Billing", href: "/operator/settings", icon: CreditCard },
    { label: "Settings", href: "/operator/settings", icon: Settings },
  ],
  admin: [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Leads", href: "/admin/leads", icon: Briefcase },
    { label: "Operators", href: "/admin/operators", icon: Building2 },
    { label: "Spaces", href: "/admin/spaces", icon: Building2 },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Analytics", href: "/admin/analytics", icon: LineChart },
  ],
};

const ROOT_HREFS = new Set(["/dashboard", "/operator", "/admin"]);

function NavLinks({ items, pathname }: { items: NavItem[]; pathname: string }) {
  return (
    <nav className="flex flex-col gap-0.5">
      {items.map((item) => {
        const active = pathname === item.href || (!ROOT_HREFS.has(item.href) && pathname.startsWith(item.href));
        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardShell({
  role,
  user,
  title,
  actions,
  children,
}: {
  role: Role;
  user: Profile;
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const navItems = NAV_BY_ROLE[role];

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-secondary/20 px-4 py-5 lg:flex">
        <div className="px-2"><Logo /></div>
        <div className="mt-8 flex-1">
          <NavLinks items={navItems} pathname={pathname} />
        </div>
        <div className="border-t border-border pt-3">
          <UserMenu user={user} inline />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden" />}>
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-5">
                <SheetHeader className="px-0"><SheetTitle><Logo /></SheetTitle></SheetHeader>
                <div className="mt-6"><NavLinks items={navItems} pathname={pathname} /></div>
              </SheetContent>
            </Sheet>
            <h1 className="font-heading text-lg font-medium">{title}</h1>
          </div>
          <div className="flex items-center gap-2">{actions}</div>
        </header>
        <main className="flex-1 overflow-x-hidden p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
