"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { markAllRead, markNotificationRead } from "@/lib/data/notifications";

export async function markAllNotificationsReadAction() {
  const user = await getCurrentUser();
  if (!user) return;
  markAllRead(user.id);
  revalidatePath("/", "layout");
}

export async function markNotificationReadAction(id: string) {
  const user = await getCurrentUser();
  if (!user) return;
  markNotificationRead(id);
  revalidatePath("/", "layout");
}
