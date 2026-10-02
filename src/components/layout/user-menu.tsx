"use client";

import Link from "next/link";
import { LayoutDashboard, LogOut, Settings, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Profile } from "@/lib/types";
import { logoutAction } from "@/app/actions/auth";

const ROLE_HOME: Record<Profile["role"], string> = {
  seeker: "/dashboard",
  operator: "/operator",
  admin: "/admin",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function UserMenu({ user, inline }: { user: Profile; inline?: boolean }) {
  const home = ROLE_HOME[user.role];

  if (inline) {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 px-3 py-2">
          <Avatar className="size-8">
            <AvatarFallback className="bg-brand-muted text-xs font-semibold text-brand">
              {initials(user.fullName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{user.fullName}</p>
            <p className="text-xs capitalize text-muted-foreground">{user.role}</p>
          </div>
        </div>
        <Link href={home} className="rounded-lg px-3 py-2.5 text-[15px] font-medium hover:bg-secondary">
          Dashboard
        </Link>
        <form action={logoutAction}>
          <button className="w-full rounded-lg px-3 py-2.5 text-left text-[15px] font-medium text-destructive hover:bg-secondary">
            Log out
          </button>
        </form>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" className="h-9 gap-2 rounded-full px-1.5 pr-3" />}>
        <Avatar className="size-7">
          <AvatarFallback className="bg-brand-muted text-[11px] font-semibold text-brand">
            {initials(user.fullName)}
          </AvatarFallback>
        </Avatar>
        <span className="hidden text-sm font-medium sm:inline">{user.fullName.split(" ")[0]}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <p className="text-sm font-medium">{user.fullName}</p>
            <p className="text-xs font-normal text-muted-foreground">{user.email}</p>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href={home} />}>
          <LayoutDashboard className="size-4" /> Dashboard
        </DropdownMenuItem>
        {user.role === "seeker" && (
          <DropdownMenuItem render={<Link href="/dashboard/profile" />}>
            <UserIcon className="size-4" /> Profile
          </DropdownMenuItem>
        )}
        {user.role === "operator" && (
          <DropdownMenuItem render={<Link href="/operator/settings" />}>
            <Settings className="size-4" /> Settings
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" render={<form action={logoutAction} className="w-full" />}>
          <button type="submit" className="flex w-full items-center gap-2">
            <LogOut className="size-4" /> Log out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
