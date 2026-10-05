import { Header } from "@/components/shop/header";
import { Footer } from "@/components/shop/footer";
import { getShopData } from "@/lib/data";
export const dynamic = "force-dynamic";
export async function generateMetadata() {
  const data = await getShopData();
  return {
    robots:
      !data.demo && !data.sampleCatalogue
        ? { index: true, follow: true }
        : { index: false, follow: false },
  };
}
export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { categories, settings, demo, sampleCatalogue } = await getShopData();
  return (
    <>
      <Header categories={categories} whatsapp={settings.whatsapp} />
      {(demo || sampleCatalogue) && (
        <div className="border-b bg-orange-50 px-4 py-2 text-center text-sm text-orange-950">
          Preview catalogue · Sample products and photos, not confirmed stock.
        </div>
      )}
      <main id="main-content">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
