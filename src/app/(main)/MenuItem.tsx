"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReactNode } from "react";

interface MenuItemProps {
  href: string;
  icon: ReactNode;
  label: string;
  badgeCount?: number;
}

export default function MenuItem({
  href,
  icon,
  label,
  badgeCount,
}: MenuItemProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="hover:text-brand flex items-center justify-start gap-3 text-foreground transition-colors"
      asChild
    >
      <Link href={href}>
        <div className="relative">
          {icon}
          {!!badgeCount && (
            <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1.5 text-[10px] font-medium tabular-nums text-primary-foreground shadow-sm">
              {badgeCount}
            </span>
          )}
        </div>
        <span className="hidden font-medium lg:inline">{label}</span>
      </Link>
    </Button>
  );
}
