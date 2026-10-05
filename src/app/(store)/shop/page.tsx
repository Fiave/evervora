import { getShopData } from "@/lib/data";
import { Catalogue } from "@/components/shop/catalogue";
export const metadata = { title: "Shop all" };
export default async function Shop() {
  const data = await getShopData();
  return (
    <div className="mx-auto max-w-7xl px-5 pt-10 lg:px-8">
      <p className="eyebrow">THE EVERVORA EDIT</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight">
        Find your everyday favourites.
      </h1>
      <p className="mt-3 text-muted-foreground">
        Browse a little. Discover something you love.
      </p>
      <Catalogue
        products={data.products}
        categories={data.categories}
        whatsapp={data.settings.whatsapp}
      />
    </div>
  );
}
