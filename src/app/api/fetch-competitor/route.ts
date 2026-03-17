import { NextRequest, NextResponse } from "next/server";
import type { CompetitorData } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
      normalizedUrl = "https://" + normalizedUrl;
    }

    try {
      new URL(normalizedUrl);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const response = await fetch(normalizedUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; CompetitorIQ/1.0; +https://competitoriq.com)",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch: HTTP ${response.status}` },
        { status: 502 }
      );
    }

    const html = await response.text();

    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "No title found";

    const descMatch = html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([\s\S]*?)["']/i
    ) || html.match(
      /<meta[^>]*content=["']([\s\S]*?)["'][^>]*name=["']description["']/i
    );
    const description = descMatch ? descMatch[1].trim() : "No description found";

    const headingRegex = /<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi;
    const headings: string[] = [];
    let match;
    while ((match = headingRegex.exec(html)) !== null && headings.length < 10) {
      const text = match[1].replace(/<[^>]*>/g, "").trim();
      if (text) headings.push(text);
    }

    const pricingPatterns = [
      /\$\d+[\d,.]*\s*(?:\/\s*(?:mo|month|yr|year|user))?/gi,
      /\d+[\d,.]*\s*(?:USD|EUR|GBP)\s*(?:\/\s*(?:mo|month|yr|year))?/gi,
      /(?:free|starter|pro|enterprise|business|team)\s*(?:plan|tier)?\s*[-–:]\s*\$?\d+/gi,
    ];

    let pricingInfo: string | null = null;
    for (const pattern of pricingPatterns) {
      const matches = html.replace(/<[^>]*>/g, " ").match(pattern);
      if (matches && matches.length > 0) {
        pricingInfo = [...new Set(matches.slice(0, 5))].join(", ");
        break;
      }
    }

    const data: CompetitorData = {
      url: normalizedUrl,
      title,
      description,
      headings,
      pricingInfo,
      fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
