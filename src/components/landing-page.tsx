"use client";

import Link from "next/link";
import { Nav } from "./nav";
import {
  Eye,
  Zap,
  TrendingUp,
  Bell,
  Shield,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Eye,
    title: "Real-Time Monitoring",
    description:
      "Track competitor websites 24/7. Get alerted the moment they change pricing, launch features, or update messaging.",
  },
  {
    icon: Zap,
    title: "AI-Powered Analysis",
    description:
      "Claude AI analyzes competitor pages and generates actionable intelligence briefs — strengths, weaknesses, and opportunities.",
  },
  {
    icon: TrendingUp,
    title: "Pricing Intelligence",
    description:
      "Automatically detect and track competitor pricing changes. Never be caught off guard by a price move.",
  },
  {
    icon: Bell,
    title: "Change Alerts",
    description:
      "Instant notifications when competitors update their websites. Know about changes before their own customers do.",
  },
  {
    icon: Shield,
    title: "Competitive Moat",
    description:
      "Build a data-driven competitive strategy. Understand positioning gaps and find whitespace opportunities.",
  },
  {
    icon: BarChart3,
    title: "Weekly Briefs",
    description:
      "Automated weekly intelligence reports delivered to your inbox with key changes and strategic insights.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <Nav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-background to-background" />
        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm text-amber-400">
            <Eye className="size-4" />
            AI-Powered Competitive Intelligence
          </div>
          <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
            Know What Your Competitors Are Doing{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Before They Do
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Track competitor websites, detect pricing changes, and get
            AI-generated intelligence briefs. Stay one step ahead — always.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/dashboard">
              <Button className="h-12 bg-amber-600 px-8 text-base font-semibold text-white hover:bg-amber-500">
                Start Monitoring Free
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                variant="outline"
                className="h-12 px-8 text-base"
              >
                View Pricing
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Free tier — monitor up to 3 competitors. No credit card required.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-card/50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Everything You Need to{" "}
              <span className="text-amber-400">Win</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Comprehensive competitive intelligence, powered by AI
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5"
              >
                <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
                  <feature.icon className="size-5 text-amber-500" />
                </div>
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to Outsmart Your Competition?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join hundreds of companies using CompetitorIQ to stay ahead.
            Start free, upgrade when you need more.
          </p>
          <Link href="/dashboard" className="mt-8 inline-block">
            <Button className="h-12 bg-amber-600 px-8 text-base font-semibold text-white hover:bg-amber-500">
              Get Started Now
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Eye className="size-4 text-amber-500" />
            <span>CompetitorIQ</span>
          </div>
          <p>&copy; {new Date().getFullYear()} CompetitorIQ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
