import kyInstance from "@/lib/ky";
import { CommentsPage, PostData } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import Comment from "./Comment";
import CommentInput from "./CommentInput";

interface CommentsProps {
  post: PostData;
}

export default function Comments({ post }: CommentsProps) {
  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["comments", post.id],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(
            `/api/posts/${post.id}/comments`,
            pageParam ? { searchParams: { cursor: pageParam } } : {},
          )
          .json<CommentsPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (firstPage) => firstPage.previousCursor,
      select: (data) => ({
        pages: [...data.pages].reverse(),
        pageParams: [...data.pageParams].reverse(),
      }),
    });

  const comments = data?.pages.flatMap((page) => page.comments) || [];

  return (
    <div className="space-y-4">
      {/* Input */}
      <div className="sticky top-0 z-10 border-b bg-card/80 pb-3 backdrop-blur">
        <CommentInput post={post} />
      </div>

      {/* Load previous */}
      {hasNextPage && (
        <div className="relative my-2 flex items-center">
          <div className="flex-grow border-t" />
          <Button
            variant="ghost"
            size="sm"
            className="mx-2 text-muted-foreground hover:text-foreground"
            disabled={isFetching}
            onClick={() => fetchNextPage()}
          >
            Load previous
          </Button>
          <div className="flex-grow border-t" />
        </div>
      )}

      {/* States */}
      {status === "pending" && (
        <Loader2 className="mx-auto my-5 h-5 w-5 animate-spin text-muted-foreground" />
      )}
      {status === "success" && !comments.length && (
        <p className="py-5 text-center text-sm text-muted-foreground">
          No comments yet. Be the first to reply!
        </p>
      )}
      {status === "error" && (
        <p className="py-5 text-center text-sm text-destructive">
          Failed to load comments. Try again later.
        </p>
      )}

      {/* Comment list */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
