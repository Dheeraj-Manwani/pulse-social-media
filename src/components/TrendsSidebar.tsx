import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";
import FollowButton from "./FollowButton";
import UserAvatar from "./UserAvatar";
import UserTooltip from "./UserTooltip";

export default function TrendsSidebar() {
  return (
    <aside className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-6 md:block lg:w-80">
      <Suspense
        fallback={
          <div className="flex justify-center p-6">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        }
      >
        <WhoToFollow />
        <TrendingTopics />
      </Suspense>
    </aside>
  );
}

async function WhoToFollow() {
  const { user } = await validateRequest();
  if (!user) return null;

  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: { id: user.id },
      followers: { none: { followerId: user.id } },
    },
    select: getUserDataSelect(user.id),
    take: 5,
  });

  return (
    <div className="space-y-4 rounded-2xl bg-card p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Who to follow</h2>
      <div className="space-y-4">
        {usersToFollow.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between gap-3"
          >
            <UserTooltip user={user}>
              <Link
                href={`/users/${user.username}`}
                className="flex items-center gap-3"
              >
                <UserAvatar
                  avatarUrl={user.avatarUrl}
                  className="size-10 flex-none"
                />
                <div className="min-w-0 max-w-[9rem] overflow-ellipsis">
                  <p className="truncate font-medium hover:underline">
                    {user.displayName}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    @{user.username}
                  </p>
                </div>
              </Link>
            </UserTooltip>
            <FollowButton
              userId={user.id}
              initialState={{
                followers: user._count.followers,
                isFollowedByUser: user.followers.some(
                  ({ followerId }) => followerId === user.id,
                ),
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const getTrendingTopics = unstable_cache(
  async () => {
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
      SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
      FROM posts
      GROUP BY (hashtag)
      ORDER BY count DESC, hashtag ASC
      LIMIT 5
    `;

    return result.map((row) => ({
      hashtag: row.hashtag,
      count: Number(row.count),
    }));
  },
  ["trending_topics"],
  { revalidate: 3 * 60 * 60 },
);

async function TrendingTopics() {
  const trendingTopics = await getTrendingTopics();

  return (
    <div className="space-y-4 rounded-2xl bg-card p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Trending topics</h2>
      <div className="space-y-3">
        {trendingTopics.map(({ hashtag, count }) => {
          const title = hashtag.slice(1); // remove `#`
          return (
            <Link
              key={title}
              href={`/hashtag/${title}`}
              className="group block"
            >
              <p
                className="truncate font-medium text-primary group-hover:underline"
                title={hashtag}
              >
                {hashtag}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatNumber(count)} {count === 1 ? "post" : "posts"}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
