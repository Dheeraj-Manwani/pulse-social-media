import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { Bookmark, Home, Mail, Bell } from "lucide-react";
import MenuItem from "./MenuItem";

interface MenuBarProps {
  className?: string;
}

export default async function MenuBar({ className }: MenuBarProps) {
  const { user } = await validateRequest();

  if (!user) return null;

  const [unreadNotificationsCount, unreadMessagesCount] = await Promise.all([
    prisma.notification.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    }),
    (await streamServerClient.getUnreadCount(user.id)).total_unread_count,
  ]);

  return (
    <div className={className}>
      <MenuItem href="/" icon={<Home className="h-5 w-5" />} label="Home" />
      <MenuItem
        href="/notifications"
        icon={<Bell className="h-5 w-5" />}
        label="Notifications"
        badgeCount={unreadNotificationsCount}
      />
      <MenuItem
        href="/messages"
        icon={<Mail className="h-5 w-5" />}
        label="Messages"
        badgeCount={unreadMessagesCount}
      />
      <MenuItem
        href="/bookmarks"
        icon={<Bookmark className="h-5 w-5" />}
        label="Bookmarks"
      />
    </div>
  );
}
