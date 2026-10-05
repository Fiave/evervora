import { guardAdminPage } from "@/lib/auth";
import { getShopData } from "@/lib/data";
import { ProductForm } from "@/components/admin/product-form";
export default async function NewProduct() {
  await guardAdminPage();
  const data = await getShopData(true);
  return <ProductForm categories={data.categories} demo={data.demo} />;
}
