"use client";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  Eye,
  Star,
  PackageX,
  ArrowUpRight,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { ProductPhoto } from "@/components/shop/product-photo";
import { deleteProduct } from "@/app/admin/actions";
import { previewProducts } from "@/lib/catalogue-preview";
import type { Product, ShopData } from "@/lib/types";
function ProductActions({ product, demo, pending, onRemove }: {
  product: Product;
  demo: boolean;
  pending: boolean;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex justify-end gap-1">
      <Button variant="ghost" size="icon" asChild>
        <Link
          href={`/admin/products/${product.id}`}
          aria-label={`Edit ${product.name}`}
        >
          <Pencil size={16} />
        </Link>
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            disabled={demo || pending}
            variant="ghost"
            size="icon"
            aria-label={`Delete ${product.name}`}
          >
            <Trash2 size={16} />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {product.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the product from the shop and deletes
              its photos. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep product</AlertDialogCancel>
            <AlertDialogAction onClick={() => onRemove(product.id)}>
              Delete product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function Dashboard({ data }: { data: ShopData }) {
  const [query, setQuery] = useState(""),
    [pending, start] = useTransition();
  const router = useRouter();
  const visible = data.products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()),
  );
  function remove(id: string) {
    start(async () => {
      try {
        const result = await deleteProduct(id);
        if (result.error) toast.error(result.error);
        else {
          toast.success(result.success);
          router.refresh();
        }
      } catch {
        toast.error("Could not delete. Please try again.");
      }
    });
  }
  return (
    <>
      <div className="admin-welcome flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">YOUR SHOP STUDIO</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">Products</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Keep your latest finds up to date.
          </p>
        </div>
        <Button
          asChild
          className="h-11 rounded-full px-5 shadow-[0_6px_20px_-10px_#f5871f]"
        >
          <Link href="/admin/products/new">
            <Plus size={18} />
            Add product
          </Link>
        </Button>
      </div>
      <div className="my-7 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          {
            label: "Total products",
            value: data.products.length,
            Icon: Package,
          },
          {
            label: "Published",
            value: data.products.filter((p) => p.published).length,
            Icon: Eye,
          },
          {
            label: "Featured",
            value: data.products.filter((p) => p.featured).length,
            Icon: Star,
          },
          {
            label: "Sold out",
            value: data.products.filter((p) => !p.available).length,
            Icon: PackageX,
          },
        ].map(({ label, value, Icon }) => (
          <Card key={label} className="admin-stat gap-0 py-0 shadow-none">
            <CardContent className="flex flex-col items-start gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-2 text-3xl font-bold tracking-tight">
                  {value}
                </p>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                <Icon size={21} className="text-primary" />
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="admin-panel gap-0 overflow-hidden py-0 shadow-none">
        <div className="border-b p-5">
          <div className="relative max-w-sm">
            <Search
              size={17}
              className="absolute left-3 top-3 text-muted-foreground"
            />
            <Input
              aria-label="Search admin products"
              placeholder="Search your products…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-11 pl-9"
            />
          </div>
        </div>
        <div className="divide-y md:hidden">
          {visible.map((product) => (
            <div key={product.id} className="p-4">
              <div className="flex items-start gap-3">
                <ProductPhoto src={product.images[0]?.url} alt={product.name} className="h-14 w-14 shrink-0 rounded-lg" sizes="56px" />
                <div className="min-w-0">
                  <Link href={`/admin/products/${product.id}`} className="break-words text-sm font-semibold hover:underline">{product.name}</Link>
                  <p className="mt-1 text-xs text-muted-foreground">{data.categories.find((category) => category.id === product.categoryId)?.name}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <Badge variant="secondary">{!product.published ? "Draft" : !product.available ? "Sold out" : "Published"}</Badge>
                <ProductActions product={product} demo={data.demo} pending={pending} onRemove={remove} />
              </div>
            </div>
          ))}
        </div>
        <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-5 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="py-4 pl-5">
                  <div className="flex items-center gap-3">
                    <ProductPhoto
                      src={p.images[0]?.url}
                      alt={p.name}
                      className="h-12 w-12 shrink-0 rounded-lg"
                      sizes="48px"
                    />
                    <div>
                      <Link
                        className="font-medium hover:underline"
                        href={`/admin/products/${p.id}`}
                      >
                        {p.name}
                      </Link>
                      {p.featured && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Featured
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {data.categories.find((c) => c.id === p.categoryId)?.name}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {!p.published
                      ? "Draft"
                      : !p.available
                        ? "Sold out"
                        : "Published"}
                  </Badge>
                </TableCell>
                <TableCell className="pr-5 text-right">
                  <ProductActions product={p} demo={data.demo} pending={pending} onRemove={remove} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
        {!visible.length && (
          <p className="p-10 text-center text-sm text-muted-foreground">
            {query
              ? "No products match your search."
              : "Your shop is ready for its first product."}
          </p>
        )}
      </Card>
      {data.sampleCatalogue && (
        <section className="mt-8 rounded-3xl border border-orange-200 bg-white p-5 sm:p-7">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-primary">
              <Layers size={22} />
            </span>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Your preview catalogue
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Sample products fill the storefront until you add your first
                real product.
              </p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
            {previewProducts(data.categories)
              .slice(0, 4)
              .map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group min-w-0 rounded-2xl border p-2 transition-colors hover:border-primary"
                >
                  <ProductPhoto
                    src={product.images[0]?.url}
                    alt={product.name}
                    className="aspect-square rounded-xl"
                  />
                  <div className="px-1 py-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Sample
                    </span>
                    <h3 className="mt-1 text-sm font-semibold">
                      {product.name}
                    </h3>
                  </div>
                </Link>
              ))}
          </div>
          <Link
            href="/shop"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary"
          >
            View the preview <ArrowUpRight size={17} />
          </Link>
        </section>
      )}
    </>
  );
}
