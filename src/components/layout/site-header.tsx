import { getCurrentUser } from "@/lib/auth";
import { getNotificationsForUser, getUnreadCount } from "@/lib/data/notifications";
import { Navbar } from "@/components/layout/navbar";

export async function SiteHeader() {
  const user = await getCurrentUser();
  const notifications = user ? getNotificationsForUser(user.id).slice(0, 8) : [];
  const unreadCount = user ? getUnreadCount(user.id) : 0;

  return <Navbar user={user} notifications={notifications} unreadCount={unreadCount} />;
}
