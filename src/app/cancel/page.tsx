import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
          <XCircle className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold">Checkout canceled</h1>
        <p className="mt-3 text-muted-foreground">
          No worries — you weren&apos;t charged. You can pick a plan whenever
          you&apos;re ready.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href="/pricing">
            <Button variant="outline">View Plans</Button>
          </Link>
          <Link href="/dashboard">
            <Button className="bg-amber-600 text-white hover:bg-amber-500">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
