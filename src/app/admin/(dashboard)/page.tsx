import { guardAdminPage } from "@/lib/auth";
import { getShopData } from "@/lib/data";
import { Dashboard } from "@/components/admin/dashboard";
export default async function Admin() {
  await guardAdminPage();
  return <Dashboard data={await getShopData(true)} />;
}
