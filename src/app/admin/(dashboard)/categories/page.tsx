import { guardAdminPage } from "@/lib/auth";
import { getShopData } from "@/lib/data";
import { CategoryManager } from "@/components/admin/category-manager";
export default async function Categories() {
  await guardAdminPage();
  const data = await getShopData(true);
  return <CategoryManager data={data} />;
}
