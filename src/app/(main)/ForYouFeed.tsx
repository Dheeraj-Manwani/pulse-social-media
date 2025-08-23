"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import { Button } from "@/components/ui/button";
import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FileText, Loader2 } from "lucide-react";

export default function ForYouFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "for-you"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/posts/for-you",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }
  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-10 text-center text-muted-foreground shadow-sm">
        <FileText className="mx-auto mb-3 h-8 w-8" />
        <p className="mb-2 font-medium">No posts yet</p>
        <p className="text-sm">
          Be the first one to share something with the community.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-destructive/20 bg-destructive/10 p-5 text-center">
        <p className="mb-3 font-medium text-destructive">
          An error occurred while loading posts.
        </p>
        <Button variant="destructive" size="sm" onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isFetchingNextPage && (
        <div className="flex justify-center py-5 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
    </InfiniteScrollContainer>
  );
}
