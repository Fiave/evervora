import "server-only";
import { cache } from "react";
import { asc, desc, eq } from "drizzle-orm";
import { getDb } from "./db";
import { products, categories, productImages, shopSettings } from "./db/schema";
import { defaultCategories, defaultSettings, demoProducts } from "./demo";
import { previewProducts, sampleCatalogueEnabled } from "./catalogue-preview";
import type { ShopData } from "./types";
export const getShopData = cache(async (admin = false): Promise<ShopData> => {
  if (!process.env.DATABASE_URL)
    return {
      products: demoProducts,
      categories: defaultCategories,
      settings: {
        ...defaultSettings,
        whatsapp: process.env.SHOP_WHATSAPP || defaultSettings.whatsapp,
      },
      demo: true,
    };
  const db = getDb();
  const queryShop = () =>
    Promise.all([
      db
        .select()
        .from(products)
        .where(admin ? undefined : eq(products.published, true))
        .orderBy(desc(products.createdAt)),
      db
        .select()
        .from(categories)
        .orderBy(asc(categories.position), asc(categories.name)),
      db.select().from(productImages).orderBy(asc(productImages.position)),
      db.select().from(shopSettings).where(eq(shopSettings.id, 1)),
      db.select({ id: products.id }).from(products).limit(1),
    ]);
  // Retry only transient connection failures, and only these read queries.
  // Persistent errors still show the error page instead of sample inventory.
  const load = async () => {
    for (let attempt = 0; ; attempt++) {
      try {
        return await queryShop();
      } catch (error) {
        const cause = error instanceof Error ? error.cause : undefined;
        const networkError =
          cause instanceof Error &&
          cause.message.includes("Error connecting to database");
        if (!networkError || attempt >= 2) throw error;
        await new Promise((resolve) =>
          setTimeout(resolve, 250 * (attempt + 1)),
        );
      }
    }
  };
  const [rows, categoryRows, imageRows, settingsRows, inventory] = await load();
  const sampleCatalogue = sampleCatalogueEnabled(
    process.env.SHOW_SAMPLE_PRODUCTS === "true",
    inventory.length > 0,
  );
  return {
    products:
      !admin && sampleCatalogue
        ? previewProducts(categoryRows)
        : rows.map((p) => ({
            ...p,
            createdAt: p.createdAt.toISOString(),
            images: imageRows
              .filter((i) => i.productId === p.id)
              .map((i) => ({
                fileId: i.fileId,
                url: i.url,
                position: i.position,
              })),
          })),
    categories: categoryRows,
    settings: settingsRows[0] ?? defaultSettings,
    sampleCatalogue,
    demo: false,
  };
});
