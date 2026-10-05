import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="mx-auto max-w-7xl px-5 py-12"
    >
      <Skeleton className="h-12 w-2/3" />
      <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="aspect-square rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
