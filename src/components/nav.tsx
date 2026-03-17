"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Eye className="size-5 text-amber-500" />
          <span>CompetitorIQ</span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link
            href="/pricing"
            className={cn(
              "transition-colors hover:text-amber-400",
              pathname === "/pricing"
                ? "text-amber-400"
                : "text-muted-foreground"
            )}
          >
            Pricing
          </Link>
          <Link
            href="/dashboard"
            className={cn(
              "rounded-lg bg-amber-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-amber-500",
              pathname === "/dashboard" && "bg-amber-500"
            )}
          >
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
