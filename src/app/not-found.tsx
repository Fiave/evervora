import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  return (
    <main id="main-content" className="mx-auto max-w-lg px-6 py-24 text-center">
      <p className="eyebrow">NOT FOUND</p>
      <h1 className="mt-3 text-3xl font-bold">This find has moved on.</h1>
      <p className="mt-4 text-muted-foreground">
        The product may have been removed. There’s more to discover in the shop.
      </p>
      <Button asChild className="mt-6">
        <Link href="/shop">Back to the shop</Link>
      </Button>
    </main>
  );
}
