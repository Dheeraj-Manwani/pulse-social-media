"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { FollowerInfo, UserData } from "@/lib/types";
import Link from "next/link";
import { PropsWithChildren } from "react";
import FollowButton from "./FollowButton";
import FollowerCount from "./FollowerCount";
import Linkify from "./Linkify";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import UserAvatar from "./UserAvatar";

interface UserTooltipProps extends PropsWithChildren {
  user: UserData;
}

export default function UserTooltip({ children, user }: UserTooltipProps) {
  const { user: loggedInUser } = useSession();

  const followerState: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: !!user.followers.some(
      ({ followerId }) => followerId === loggedInUser.id,
    ),
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={150}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side="right" className="p-0">
          <div className="flex w-72 max-w-80 flex-col gap-3 rounded-xl border bg-card p-4 shadow-md">
            {/* Top section: avatar + follow */}
            <div className="flex items-center justify-between gap-2">
              <Link href={`/users/${user.username}`}>
                <UserAvatar size={56} avatarUrl={user.avatarUrl} />
              </Link>
              {loggedInUser.id !== user.id && (
                <FollowButton userId={user.id} initialState={followerState} />
              )}
            </div>

            {/* Name + username */}
            <div>
              <Link href={`/users/${user.username}`}>
                <div className="truncate text-lg font-semibold hover:underline">
                  {user.displayName}
                </div>
                <div className="text-sm text-muted-foreground">
                  @{user.username}
                </div>
              </Link>
            </div>

            {/* Bio */}
            {user.bio && (
              <Linkify>
                <div className="line-clamp-4 whitespace-pre-line text-sm text-muted-foreground">
                  {user.bio}
                </div>
              </Linkify>
            )}

            {/* Follower count */}
            <FollowerCount userId={user.id} initialState={followerState} />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
