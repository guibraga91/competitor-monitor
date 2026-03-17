import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { checkRateLimit } from "@/lib/rate-limit";
import type { CompetitorData } from "@/lib/types";

const anthropic = new Anthropic();

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const { allowed, remaining, resetIn } = checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      {
        error: `Rate limit exceeded. Try again in ${Math.ceil(resetIn / 60)} minutes.`,
        remaining: 0,
        resetIn,
      },
      { status: 429 }
    );
  }

  try {
    const { competitors } = (await req.json()) as {
      competitors: CompetitorData[];
    };

    if (!competitors || competitors.length === 0) {
      return NextResponse.json(
        { error: "No competitor data provided" },
        { status: 400 }
      );
    }

    const competitorSummaries = competitors
      .map(
        (c, i) =>
          `Competitor ${i + 1}: ${c.url}
Title: ${c.title}
Description: ${c.description}
Key Headings: ${c.headings.join(", ")}
Pricing: ${c.pricingInfo ?? "Not detected"}`
      )
      .join("\n\n");

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-20250414",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are a competitive intelligence analyst. Analyze these competitors and provide strategic insights.

${competitorSummaries}

Respond in this exact JSON format (no markdown, just raw JSON):
{
  "summary": "2-3 sentence overview of the competitive landscape",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "opportunities": ["opportunity 1", "opportunity 2", "opportunity 3"],
  "pricingInsights": "Analysis of their pricing strategy",
  "recommendation": "Key strategic recommendation based on this analysis"
}`,
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response from AI");
    }

    const analysis = JSON.parse(textBlock.text);

    return NextResponse.json({ analysis, remaining });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
