"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { toggleSaved } from "@/lib/data/saved";

export async function toggleSavedAction(spaceId: string): Promise<{ saved: boolean } | { error: string }> {
  const user = await getCurrentUser();
  if (!user) return { error: "login_required" };

  const saved = toggleSaved(user.id, spaceId);
  revalidatePath("/dashboard/saved");
  revalidatePath("/search");
  return { saved };
}
