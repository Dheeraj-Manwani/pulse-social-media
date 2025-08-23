"use client";

import { Button } from "@/components/ui/button";
import kyInstance from "@/lib/ky";
import { NotificationCountInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import Link from "next/link";

interface NotificationsButtonProps {
  initialState: NotificationCountInfo;
}

export default function NotificationsButton({
  initialState,
}: NotificationsButtonProps) {
  const { data } = useQuery({
    queryKey: ["unread-notification-count"],
    queryFn: () =>
      kyInstance
        .get("/api/notifications/unread-count")
        .json<NotificationCountInfo>(),
    initialData: initialState,
    refetchInterval: 60 * 1000,
  });

  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-3 px-3 py-2"
      title="Notifications"
      asChild
    >
      <Link href="/notifications">
        <div className="relative">
          <Bell className="h-5 w-5" />
          {!!data.unreadCount && (
            <span className="bg-brand absolute -right-1 -top-1 flex h-3 w-3 animate-pulse items-center justify-center rounded-full text-xs font-semibold text-primary-foreground">
              {data.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden font-medium tracking-tight lg:inline">
          Notifications
        </span>
      </Link>
    </Button>
  );
}
