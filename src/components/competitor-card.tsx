"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  RefreshCw,
  Trash2,
  Loader2,
  DollarSign,
  Heading,
  Clock,
} from "lucide-react";
import type { SavedCompetitor } from "@/lib/types";

interface Props {
  competitor: SavedCompetitor;
  onRefresh: (url: string) => void;
  onRemove: (url: string) => void;
  refreshing?: boolean;
}

export function CompetitorCard({
  competitor,
  onRefresh,
  onRemove,
  refreshing,
}: Props) {
  const [showAllHeadings, setShowAllHeadings] = useState(false);
  const { data } = competitor;

  const headingsToShow =
    data && showAllHeadings ? data.headings : data?.headings.slice(0, 4);

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate text-base">
              {data?.title ?? competitor.url}
            </CardTitle>
            <CardDescription className="mt-1 line-clamp-2 text-xs">
              {data?.description ?? "Not yet fetched"}
            </CardDescription>
          </div>
          <div className="flex shrink-0 gap-1">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onRefresh(competitor.url)}
              disabled={refreshing}
            >
              {refreshing ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <RefreshCw className="size-3" />
              )}
            </Button>
            <a
              href={data?.url ?? competitor.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon-xs">
                <ExternalLink className="size-3" />
              </Button>
            </a>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onRemove(competitor.url)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="size-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {data && (
        <CardContent className="space-y-4 pt-0">
          {/* Pricing */}
          {data.pricingInfo && (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
              <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-amber-400">
                <DollarSign className="size-3" />
                Pricing Detected
              </div>
              <p className="text-sm">{data.pricingInfo}</p>
            </div>
          )}

          {/* Headings */}
          {headingsToShow && headingsToShow.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Heading className="size-3" />
                Key Headings
              </div>
              <div className="flex flex-wrap gap-1.5">
                {headingsToShow.map((h, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="text-xs font-normal"
                  >
                    {h.length > 50 ? h.slice(0, 50) + "..." : h}
                  </Badge>
                ))}
                {!showAllHeadings && data.headings.length > 4 && (
                  <button
                    onClick={() => setShowAllHeadings(true)}
                    className="text-xs text-amber-400 hover:underline"
                  >
                    +{data.headings.length - 4} more
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Last fetched */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3" />
            Fetched {new Date(data.fetchedAt).toLocaleString()}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
