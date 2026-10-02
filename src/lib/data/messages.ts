import { DB } from "@/lib/mock-data";
import { makeId } from "@/lib/mock-data/rng";
import { Role } from "@/lib/types";

export function getConversationForLead(leadId: string) {
  return DB.conversations.find((c) => c.leadId === leadId);
}

export function getConversationsForUser(userId: string) {
  return DB.conversations.filter((c) => c.userId === userId || c.operatorId === userId);
}

export function getMessages(conversationId: string) {
  return DB.messages
    .filter((m) => m.conversationId === conversationId)
    .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
}

export function sendMessage(conversationId: string, senderRole: Role, senderName: string, body: string) {
  const message = {
    id: makeId("msg"),
    conversationId,
    senderRole,
    senderName,
    body,
    readAt: null,
    createdAt: new Date().toISOString(),
  };
  DB.messages.push(message);
  return message;
}
