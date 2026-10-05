"use client";
import { useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { Search, SlidersHorizontal, PackageSearch } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./product-card";
import type { Product, Category } from "@/lib/types";
export function Catalogue({
  products,
  categories,
  whatsapp,
}: {
  products: Product[];
  categories: Category[];
  whatsapp: string;
}) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";
  const query = searchParams.get("q") || "";
  const [page, setPage] = useState(1);
  const pathname = usePathname();
  function update(cat: string, q: string) {
    const params = new URLSearchParams();
    if (cat) params.set("category", cat);
    if (q) params.set("q", q);
    window.history.replaceState(
      null,
      "",
      `${pathname}${params.size ? `?${params}` : ""}`,
    );
    setPage(1);
  }
  const categoryId = categories.find((c) => c.slug === category)?.id;
  const filtered = products.filter(
    (p) =>
      (!categoryId || p.categoryId === categoryId) &&
      `${p.name} ${p.description}`.toLowerCase().includes(query.toLowerCase()),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / 12));
  return (
    <>
      <div className="mt-8 flex flex-col justify-between gap-5 border-b pb-6 md:flex-row md:items-center">
        <div className="relative w-full md:max-w-sm">
          <Search
            className="absolute left-3 top-3 text-muted-foreground"
            size={18}
          />
          <Input
            id="catalogue-search"
            aria-label="Search products"
            placeholder="Find your next favourite…"
            className="h-11 bg-white pl-10"
            value={query}
            onChange={(e) => {
              update(category, e.target.value);
            }}
          />
        </div>
        <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <SlidersHorizontal size={16} />
          {filtered.length} {filtered.length === 1 ? "product" : "products"}
        </span>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <Button
          variant={!category ? "default" : "outline"}
          className="min-h-11 rounded-full"
          onClick={() => {
            update("", query);
          }}
        >
          All products
        </Button>
        {categories.map((c) => (
          <Button
            key={c.id}
            variant={category === c.slug ? "default" : "outline"}
            className="min-h-11 rounded-full"
            onClick={() => {
              update(c.slug, query);
            }}
          >
            {c.name}
          </Button>
        ))}
      </div>
      <div className="mt-8 grid grid-cols-2 gap-x-3 sm:gap-x-5 gap-y-9 md:grid-cols-3 lg:grid-cols-4">
        {filtered.slice((page - 1) * 12, page * 12).map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            whatsapp={whatsapp}
            category={categories.find((c) => c.id === p.categoryId)}
          />
        ))}
      </div>
      {!filtered.length && (
        <div className="py-24 text-center">
          <PackageSearch className="mx-auto text-muted-foreground" size={40} />
          <h2 className="mt-4 text-xl font-semibold">No finds just yet</h2>
          <p className="mt-2 text-muted-foreground">
            Try a different search or browse another category.
          </p>
          <Button
            className="mt-5"
            variant="outline"
            onClick={() => {
              update("", "");
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
      {pages > 1 && (
        <nav
          aria-label="Product pages"
          className="mt-10 flex items-center justify-center gap-4"
        >
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm">
            {page} of {pages}
          </span>
          <Button
            variant="outline"
            disabled={page === pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </nav>
      )}
    </>
  );
}
