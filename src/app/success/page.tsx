import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
          <CheckCircle className="h-8 w-8 text-amber-500" />
        </div>
        <h1 className="text-3xl font-bold">You&apos;re all set!</h1>
        <p className="mt-3 text-muted-foreground">
          Your subscription is active. Welcome to CompetitorIQ — let&apos;s start
          tracking your competitors.
        </p>
        <Link href="/dashboard" className="mt-8 inline-block">
          <Button className="bg-amber-600 text-white hover:bg-amber-500">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
