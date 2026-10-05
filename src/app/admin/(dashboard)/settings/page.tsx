import { guardAdminPage } from "@/lib/auth";
import { getShopData } from "@/lib/data";
import { SettingsForm } from "@/components/admin/settings-form";
export default async function Settings() {
  await guardAdminPage();
  const data = await getShopData(true);
  return <SettingsForm settings={data.settings} demo={data.demo} />;
}
