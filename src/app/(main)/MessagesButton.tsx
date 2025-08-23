"use client";

import { Button } from "@/components/ui/button";
import kyInstance from "@/lib/ky";
import { MessageCountInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import Link from "next/link";

interface MessagesButtonProps {
  initialState: MessageCountInfo;
}

export default function MessagesButton({ initialState }: MessagesButtonProps) {
  const { data } = useQuery({
    queryKey: ["unread-messages-count"],
    queryFn: () =>
      kyInstance.get("/api/messages/unread-count").json<MessageCountInfo>(),
    initialData: initialState,
    refetchInterval: 60 * 1000,
  });

  return (
    <Button
      variant="ghost"
      size="sm"
      className="hover:text-brand flex items-center justify-start gap-3 text-foreground transition-colors"
      title="Messages"
      asChild
    >
      <Link href="/messages">
        <div className="relative">
          <Mail className="h-5 w-5" />
          {!!data.unreadCount && (
            <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1.5 text-[10px] font-medium tabular-nums text-primary-foreground shadow-sm">
              {data.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden font-medium lg:inline">Messages</span>
      </Link>
    </Button>
  );
}
