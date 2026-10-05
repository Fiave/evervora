import { notFound } from "next/navigation";
import { guardAdminPage } from "@/lib/auth";
import { getShopData } from "@/lib/data";
import { ProductForm } from "@/components/admin/product-form";
export default async function EditProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await guardAdminPage();
  const { id } = await params;
  const data = await getShopData(true);
  const product = data.products.find((p) => p.id === id);
  if (!product) notFound();
  return (
    <ProductForm
      categories={data.categories}
      demo={data.demo}
      product={product}
    />
  );
}
