import { DB } from "@/lib/mock-data";

export function getNotificationsForUser(userId: string) {
  return DB.notifications
    .filter((n) => n.userId === userId)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export function getUnreadCount(userId: string) {
  return DB.notifications.filter((n) => n.userId === userId && !n.readAt).length;
}

export function markNotificationRead(id: string) {
  const notification = DB.notifications.find((n) => n.id === id);
  if (notification) notification.readAt = new Date().toISOString();
  return notification;
}

export function markAllRead(userId: string) {
  const now = new Date().toISOString();
  DB.notifications.filter((n) => n.userId === userId && !n.readAt).forEach((n) => (n.readAt = now));
}
