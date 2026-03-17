"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Loader2 } from "lucide-react";

interface Props {
  onAdd: (url: string) => void;
  disabled?: boolean;
  loading?: boolean;
}

export function AddCompetitorForm({ onAdd, disabled, loading }: Props) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onAdd(url.trim());
    setUrl("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Input
        type="text"
        placeholder="Enter competitor URL (e.g., stripe.com)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="flex-1 border-border bg-muted/50 placeholder:text-muted-foreground/50"
        disabled={disabled || loading}
      />
      <Button
        type="submit"
        disabled={!url.trim() || disabled || loading}
        className="bg-amber-600 text-white hover:bg-amber-500"
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Plus className="size-4" />
        )}
        Add
      </Button>
    </form>
  );
}
