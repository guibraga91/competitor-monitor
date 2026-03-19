"use client";

import { useState } from "react";
import Link from "next/link";
import { Nav } from "./nav";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "$39",
    period: "/mo",
    description: "For solopreneurs and small teams getting started.",
    competitors: "3 competitors",
    features: [
      "3 competitor monitors",
      "Weekly intelligence briefs",
      "AI-powered analysis",
      "Pricing change detection",
      "Email alerts",
      "5 AI analyses per hour",
    ],
    cta: "Start Free Trial",
    highlighted: false,
    checkout: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$99",
    period: "/mo",
    description: "For growing teams that need deeper intelligence.",
    competitors: "10 competitors",
    features: [
      "10 competitor monitors",
      "Daily intelligence briefs",
      "Advanced AI analysis",
      "Full pricing intelligence",
      "Slack & email alerts",
      "25 AI analyses per hour",
      "Historical change tracking",
      "Custom report templates",
    ],
    cta: "Start Free Trial",
    highlighted: true,
    checkout: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$249",
    period: "/mo",
    description: "For organizations with serious competitive needs.",
    competitors: "Unlimited",
    features: [
      "Unlimited competitor monitors",
      "Real-time intelligence briefs",
      "Custom AI analysis prompts",
      "Full pricing intelligence",
      "All integrations",
      "Unlimited AI analyses",
      "API access",
      "Dedicated account manager",
      "Custom onboarding",
      "SSO & team management",
    ],
    cta: "Contact Sales",
    highlighted: false,
    checkout: true,
  },
];

export function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleCheckout(planId: string) {
    setLoading(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Something went wrong");
        setLoading(null);
      }
    } catch {
      alert("Failed to start checkout. Please try again.");
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen">
      <Nav />

      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">
            Simple, Transparent{" "}
            <span className="text-amber-400">Pricing</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free. Upgrade as your competitive intelligence needs grow.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-xl border p-8",
                plan.highlighted
                  ? "border-amber-500 bg-amber-500/5 shadow-lg shadow-amber-500/10"
                  : "border-border bg-card"
              )}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-4 py-1 text-xs font-semibold text-black">
                  Most Popular
                </div>
              )}
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {plan.description}
              </p>
              <div className="mt-4 inline-flex w-fit items-center rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
                {plan.competitors}
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-amber-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button
                  className={cn(
                    "w-full",
                    plan.highlighted
                      ? "bg-amber-600 text-white hover:bg-amber-500"
                      : ""
                  )}
                  variant={plan.highlighted ? "default" : "outline"}
                  size="lg"
                  disabled={loading !== null}
                  onClick={() => handleCheckout(plan.id)}
                >
                  {loading === plan.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Redirecting…
                    </>
                  ) : (
                    plan.cta
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
