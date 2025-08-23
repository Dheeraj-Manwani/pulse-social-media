import { validateRequest } from "@/auth";
import FollowButton from "@/components/FollowButton";
import FollowerCount from "@/components/FollowerCount";
import Linkify from "@/components/Linkify";
import TrendsSidebar from "@/components/TrendsSidebar";
import UserAvatar from "@/components/UserAvatar";
import prisma from "@/lib/prisma";
import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import EditProfileButton from "./EditProfileButton";
import UserPosts from "./UserPosts";

interface PageProps {
  params: { username: string };
}

const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedInUserId),
  });

  if (!user) notFound();

  return user;
});

export async function generateMetadata({
  params: { username },
}: PageProps): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return {};

  const user = await getUser(username, loggedInUser.id);

  return {
    title: `${user.displayName} (@${user.username})`,
  };
}

export default async function Page({ params: { username } }: PageProps) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return (
      <p className="text-destructive">
        You&apos;re not authorized to view this page.
      </p>
    );
  }

  const user = await getUser(username, loggedInUser.id);

  return (
    <main className="flex w-full min-w-0 gap-5 lg:gap-8">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        <div className="border-b pb-3">
          <h2 className="text-lg font-semibold">
            {user.displayName}&apos;s Posts
          </h2>
        </div>

        <UserPosts userId={user.id} />
      </div>
      <TrendsSidebar />
    </main>
  );
}

interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

async function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId,
    ),
  };

  return (
    <div className="h-fit w-full space-y-6 rounded-2xl bg-card p-6 shadow-sm">
      {/* Avatar + Actions */}
      <div className="flex flex-col items-center gap-4">
        <UserAvatar
          avatarUrl={user.avatarUrl}
          size={160}
          className="rounded-full border shadow-sm"
        />
        {user.id === loggedInUserId ? (
          <EditProfileButton user={user} />
        ) : (
          <FollowButton userId={user.id} initialState={followerInfo} />
        )}
      </div>

      {/* User Info */}
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">{user.displayName}</h1>
        <p className="text-muted-foreground">@{user.username}</p>
        <p className="text-sm text-muted-foreground">
          Member since {formatDate(user.createdAt, "MMM d, yyyy")}
        </p>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-6 text-sm">
        <span>
          <span className="font-semibold">
            {formatNumber(user._count.posts)}
          </span>{" "}
          Posts
        </span>
        <FollowerCount userId={user.id} initialState={followerInfo} />
      </div>

      {/* Bio */}
      {user.bio && (
        <div className="border-t pt-4">
          <Linkify>
            <p className="whitespace-pre-line break-words text-sm leading-relaxed">
              {user.bio}
            </p>
          </Linkify>
        </div>
      )}
    </div>
  );
}
