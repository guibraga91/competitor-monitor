"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Lightbulb,
  DollarSign,
  Target,
} from "lucide-react";
import type { AnalysisResult } from "@/lib/types";

interface Props {
  analysis: AnalysisResult;
}

export function AnalysisPanel({ analysis }: Props) {
  return (
    <Card className="border-amber-500/20 bg-amber-500/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-amber-400">
          <Target className="size-4" />
          AI Intelligence Brief
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Summary */}
        <p className="text-sm leading-relaxed">{analysis.summary}</p>

        {/* Strengths */}
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-green-400">
            <TrendingUp className="size-3" />
            Competitor Strengths
          </div>
          <ul className="space-y-1.5">
            {analysis.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Badge
                  variant="secondary"
                  className="mt-0.5 shrink-0 bg-green-500/10 text-green-400"
                >
                  S{i + 1}
                </Badge>
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-red-400">
            <TrendingDown className="size-3" />
            Competitor Weaknesses
          </div>
          <ul className="space-y-1.5">
            {analysis.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Badge
                  variant="secondary"
                  className="mt-0.5 shrink-0 bg-red-500/10 text-red-400"
                >
                  W{i + 1}
                </Badge>
                {w}
              </li>
            ))}
          </ul>
        </div>

        {/* Opportunities */}
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-amber-400">
            <Lightbulb className="size-3" />
            Opportunities
          </div>
          <ul className="space-y-1.5">
            {analysis.opportunities.map((o, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Badge
                  variant="secondary"
                  className="mt-0.5 shrink-0 bg-amber-500/10 text-amber-400"
                >
                  O{i + 1}
                </Badge>
                {o}
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing Insights */}
        <div className="rounded-lg border border-border bg-card/50 p-3">
          <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <DollarSign className="size-3" />
            Pricing Insights
          </div>
          <p className="text-sm">{analysis.pricingInsights}</p>
        </div>

        {/* Recommendation */}
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="mb-1 text-xs font-medium text-amber-400">
            Key Recommendation
          </div>
          <p className="text-sm font-medium">{analysis.recommendation}</p>
        </div>
      </CardContent>
    </Card>
  );
}
