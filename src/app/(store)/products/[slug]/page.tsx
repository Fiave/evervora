import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getShopData } from "@/lib/data";
import { ProductDetail } from "@/components/shop/product-detail";
import { ProductCard } from "@/components/shop/product-card";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getShopData();
  const p = data.products.find((p) => p.slug === slug);
  if (!p) return { title: "Product not found" };
  return {
    title: p.name,
    description: p.description.slice(0, 160),
    openGraph: {
      title: `${p.name} | Evervora Market GH`,
      description: p.description.slice(0, 160),
      images: p.images[0] ? [p.images[0].url] : [],
    },
  };
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { products, categories, settings } = await getShopData();
  const p = products.find((p) => p.slug === slug);
  if (!p) notFound();
  const related = products
    .filter((x) => x.categoryId === p.categoryId && x.id !== p.id)
    .slice(0, 4);
  return (
    <div className="mx-auto max-w-7xl px-5 pt-8 lg:px-8">
      <nav
        aria-label="Breadcrumb"
        className="mb-8 flex flex-wrap gap-2 text-sm text-muted-foreground"
      >
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/shop">Shop</Link>
        <span>/</span>
        <span className="text-foreground">{p.name}</span>
      </nav>
      <ProductDetail
        product={p}
        category={categories.find((c) => c.id === p.categoryId)}
        settings={settings}
      />
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight">
            A few more you might like
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {related.map((x) => (
              <ProductCard
                key={x.id}
                product={x}
                whatsapp={settings.whatsapp}
                category={categories.find((c) => c.id === x.categoryId)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
