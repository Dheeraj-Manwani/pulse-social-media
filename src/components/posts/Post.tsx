"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { PostData } from "@/lib/types";
import { cn, formatRelativeDate } from "@/lib/utils";
import { Media } from "@prisma/client";
import { MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Comments from "../comments/Comments";
import Linkify from "../Linkify";
import UserAvatar from "../UserAvatar";
import UserTooltip from "../UserTooltip";
import BookmarkButton from "./BookmarkButton";
import LikeButton from "./LikeButton";
import PostMoreButton from "./PostMoreButton";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  const { user } = useSession();
  const [showComments, setShowComments] = useState(false);

  return (
    <article
      className={cn(
        "group/post space-y-4 rounded-2xl bg-card/90 p-5 shadow-sm transition hover:bg-card",
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <UserTooltip user={post.user}>
            <Link href={`/users/${post.user.username}`}>
              <UserAvatar avatarUrl={post.user.avatarUrl} />
            </Link>
          </UserTooltip>
          <div className="flex flex-col">
            <UserTooltip user={post.user}>
              <Link
                href={`/users/${post.user.username}`}
                className="font-semibold hover:underline"
              >
                {post.user.displayName}
              </Link>
            </UserTooltip>
            <Link
              href={`/posts/${post.id}`}
              className="text-xs text-muted-foreground hover:underline"
              suppressHydrationWarning
            >
              {formatRelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>

        {post.user.id === user.id && (
          <PostMoreButton
            post={post}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        )}
      </div>

      {/* Content */}
      {post.content && (
        <Linkify>
          <div className="whitespace-pre-line break-words text-sm leading-relaxed">
            {post.content}
          </div>
        </Linkify>
      )}

      {/* Media */}
      {!!post.attachments.length && (
        <MediaPreviews attachments={post.attachments} />
      )}

      {/* Actions */}
      <div className="flex items-center justify-between border-t pt-3">
        <div className="flex items-center gap-5">
          <LikeButton
            postId={post.id}
            initialState={{
              likes: post._count.likes,
              isLikedByUser: post.likes.some((like) => like.userId === user.id),
            }}
          />
          <CommentButton
            post={post}
            onClick={() => setShowComments((s) => !s)}
          />
        </div>
        <BookmarkButton
          postId={post.id}
          initialState={{
            isBookmarkedByUser: post.bookmarks.some(
              (b) => b.userId === user.id,
            ),
          }}
        />
      </div>

      {/* Comments */}
      {showComments && (
        <div className="mt-3 rounded-xl border bg-muted/40 p-3">
          <Comments post={post} />
        </div>
      )}
    </article>
  );
}

function MediaPreviews({ attachments }: { attachments: Media[] }) {
  return (
    <div
      className={cn(
        "grid gap-3",
        attachments.length === 1 ? "grid-cols-1" : "sm:grid-cols-2",
      )}
    >
      {attachments.map((m) => (
        <MediaPreview key={m.id} media={m} />
      ))}
    </div>
  );
}

function MediaPreview({ media }: { media: Media }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  if (media.type === "IMAGE") {
    // Fallback to regular img tag if Next.js Image fails
    if (imageError) {
      return (
        <img
          src={media.url}
          alt="Attachment"
          className="mx-auto max-h-[28rem] w-full rounded-xl object-cover"
          onError={(e) => {
            // If even the regular img fails, show error message
            e.currentTarget.style.display = "none";
          }}
        />
      );
    }

    return (
      <div className="relative mx-auto w-full">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-muted">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}
        <Image
          src={media.url}
          alt="Attachment"
          width={600}
          height={600}
          className={cn(
            "mx-auto max-h-[28rem] w-full rounded-xl object-cover transition-opacity",
            imageLoading ? "opacity-0" : "opacity-100",
          )}
          onError={() => {
            setImageError(true);
            setImageLoading(false);
          }}
          onLoad={() => setImageLoading(false)}
          unoptimized={media.url.includes("uploadthing.com")}
          priority={false}
        />
      </div>
    );
  }

  if (media.type === "VIDEO") {
    return (
      <video
        src={media.url}
        controls
        className="mx-auto max-h-[28rem] w-full rounded-xl object-cover"
        onError={(e) => {
          console.error("Video load error:", e);
        }}
      />
    );
  }

  return <p className="text-destructive">Unsupported media type</p>;
}

function CommentButton({
  post,
  onClick,
}: {
  post: PostData;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-muted-foreground transition hover:text-foreground"
    >
      <MessageSquare className="h-5 w-5" />
      <span className="text-sm tabular-nums">
        {post._count.comments}
        <span className="hidden sm:inline"> comments</span>
      </span>
    </button>
  );
}
