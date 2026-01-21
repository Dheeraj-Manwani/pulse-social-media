'use client';

import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface UserAvatarProps {
  avatarUrl: string | null | undefined;
  size?: number;
  className?: string;
}

export default function UserAvatar({
  avatarUrl,
  size,
  className,
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const imageSrc = avatarUrl || avatarPlaceholder;
  const isUploadThingUrl = typeof imageSrc === "string" && imageSrc.includes("uploadthing.com");

  // Fallback to regular img tag if Next.js Image fails
  if (imageError) {
    return (
      <img
        src={typeof imageSrc === "string" ? imageSrc : imageSrc.src}
        alt="User avatar"
        width={size ?? 48}
        height={size ?? 48}
        className={cn(
          "aspect-square h-fit flex-none rounded-full bg-secondary object-cover",
          className,
        )}
        onError={(e) => {
          // If even the regular img fails, show placeholder
          e.currentTarget.src = avatarPlaceholder.src;
        }}
      />
    );
  }

  return (
    <div className="relative">
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-muted">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
      <Image
        src={imageSrc}
        alt="User avatar"
        width={size ?? 48}
        height={size ?? 48}
        className={cn(
          "aspect-square h-fit flex-none rounded-full bg-secondary object-cover transition-opacity",
          imageLoading ? "opacity-0" : "opacity-100",
          className,
        )}
        onError={() => {
          setImageError(true);
          setImageLoading(false);
        }}
        onLoad={() => setImageLoading(false)}
        unoptimized={isUploadThingUrl}
        priority={false}
      />
    </div>
  );
}
