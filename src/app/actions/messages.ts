"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { sendMessage } from "@/lib/data/messages";
import { Message } from "@/lib/types";

export async function sendMessageAction(conversationId: string, body: string): Promise<Message | null> {
  const user = await getCurrentUser();
  if (!user || !body.trim()) return null;

  const message = sendMessage(conversationId, user.role, user.fullName, body.trim());
  revalidatePath("/dashboard/inquiries");
  revalidatePath("/operator/leads");
  return message;
}
