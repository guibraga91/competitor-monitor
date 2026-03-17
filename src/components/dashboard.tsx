"use client";

import { useEffect, useState, useCallback } from "react";
import { Nav } from "./nav";
import { AddCompetitorForm } from "./add-competitor-form";
import { CompetitorCard } from "./competitor-card";
import { AnalysisPanel } from "./analysis-panel";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Eye, Loader2, Sparkles, AlertCircle } from "lucide-react";
import type { SavedCompetitor, CompetitorData, AnalysisResult } from "@/lib/types";

const MAX_FREE_COMPETITORS = 3;
const STORAGE_KEY = "competitoriq_competitors";
const ANALYSIS_KEY = "competitoriq_analysis";

function loadCompetitors(): SavedCompetitor[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCompetitors(competitors: SavedCompetitor[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(competitors));
}

function loadAnalysis(): AnalysisResult | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(ANALYSIS_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveAnalysis(analysis: AnalysisResult | null) {
  if (analysis) {
    localStorage.setItem(ANALYSIS_KEY, JSON.stringify(analysis));
  } else {
    localStorage.removeItem(ANALYSIS_KEY);
  }
}

export function Dashboard() {
  const [competitors, setCompetitors] = useState<SavedCompetitor[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [fetchingUrl, setFetchingUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCompetitors(loadCompetitors());
    setAnalysis(loadAnalysis());
    setMounted(true);
  }, []);

  const fetchCompetitorData = useCallback(async (url: string): Promise<CompetitorData | null> => {
    const res = await fetch("/api/fetch-competitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? "Failed to fetch competitor");
    }
    return res.json();
  }, []);

  const handleAdd = useCallback(
    async (url: string) => {
      setError(null);

      if (competitors.length >= MAX_FREE_COMPETITORS) {
        setError(
          `Free tier limited to ${MAX_FREE_COMPETITORS} competitors. Upgrade to Pro for more.`
        );
        return;
      }

      const normalized = url.toLowerCase().replace(/^https?:\/\//, "").replace(/\/+$/, "");
      if (competitors.some((c) => c.url.toLowerCase().replace(/^https?:\/\//, "").replace(/\/+$/, "") === normalized)) {
        setError("This competitor is already being tracked.");
        return;
      }

      setFetchingUrl(url);
      try {
        const data = await fetchCompetitorData(url);
        const newCompetitor: SavedCompetitor = {
          url: data?.url ?? url,
          data,
          analysis: null,
          addedAt: new Date().toISOString(),
        };
        const updated = [...competitors, newCompetitor];
        setCompetitors(updated);
        saveCompetitors(updated);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch competitor");
      } finally {
        setFetchingUrl(null);
      }
    },
    [competitors, fetchCompetitorData]
  );

  const handleRefresh = useCallback(
    async (url: string) => {
      setError(null);
      setFetchingUrl(url);
      try {
        const data = await fetchCompetitorData(url);
        const updated = competitors.map((c) =>
          c.url === url ? { ...c, data } : c
        );
        setCompetitors(updated);
        saveCompetitors(updated);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to refresh");
      } finally {
        setFetchingUrl(null);
      }
    },
    [competitors, fetchCompetitorData]
  );

  const handleRemove = useCallback(
    (url: string) => {
      const updated = competitors.filter((c) => c.url !== url);
      setCompetitors(updated);
      saveCompetitors(updated);
      if (updated.length === 0) {
        setAnalysis(null);
        saveAnalysis(null);
      }
    },
    [competitors]
  );

  const handleAnalyze = useCallback(async () => {
    setError(null);
    setAnalyzing(true);

    const competitorsWithData = competitors.filter((c) => c.data);
    if (competitorsWithData.length === 0) {
      setError("Add competitors first before running analysis.");
      setAnalyzing(false);
      return;
    }

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          competitors: competitorsWithData.map((c) => c.data),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Analysis failed");
      }

      const { analysis: result, remaining } = await res.json();
      setAnalysis(result);
      saveAnalysis(result);

      if (remaining !== undefined && remaining <= 1) {
        setError(`Warning: ${remaining} analysis${remaining === 1 ? "" : "es"} remaining this hour.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  }, [competitors]);

  if (!mounted) {
    return (
      <div className="min-h-screen">
        <Nav />
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="size-6 animate-spin text-amber-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Nav />

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold">
              <Eye className="size-6 text-amber-500" />
              Competitor Dashboard
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Tracking {competitors.length}/{MAX_FREE_COMPETITORS} competitors
              (free tier)
            </p>
          </div>
          <Button
            onClick={handleAnalyze}
            disabled={analyzing || competitors.filter((c) => c.data).length === 0}
            className="bg-amber-600 text-white hover:bg-amber-500"
          >
            {analyzing ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 size-4" />
            )}
            Analyze Competitors
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Add Form */}
        <AddCompetitorForm
          onAdd={handleAdd}
          disabled={competitors.length >= MAX_FREE_COMPETITORS}
          loading={fetchingUrl !== null && !competitors.some((c) => c.url === fetchingUrl)}
        />

        <Separator className="my-6" />

        {/* Competitors Grid */}
        {competitors.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
            <Eye className="mb-4 size-10 text-muted-foreground/30" />
            <h3 className="font-semibold">No competitors yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Enter a competitor URL above to start monitoring. You can track up
              to {MAX_FREE_COMPETITORS} competitors on the free tier.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {competitors.map((c) => (
              <CompetitorCard
                key={c.url}
                competitor={c}
                onRefresh={handleRefresh}
                onRemove={handleRemove}
                refreshing={fetchingUrl === c.url}
              />
            ))}
          </div>
        )}

        {/* Analysis */}
        {analysis && (
          <>
            <Separator className="my-8" />
            <AnalysisPanel analysis={analysis} />
          </>
        )}
      </div>
    </div>
  );
}
