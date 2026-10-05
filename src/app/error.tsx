"use client";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main-content" className="mx-auto max-w-lg px-6 py-24 text-center">
      <h1 className="text-3xl font-bold">We couldn’t load the shop.</h1>
      <p className="mt-4 text-muted-foreground">
        Please try again in a moment.
      </p>
      <Button onClick={reset} className="mt-6">
        Try again
      </Button>
    </main>
  );
}
