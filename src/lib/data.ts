import "server-only";
import { cache } from "react";
import { asc, desc, eq } from "drizzle-orm";
import { getDb } from "./db";
import { products, categories, productImages, shopSettings } from "./db/schema";
import { defaultCategories, defaultSettings, demoProducts } from "./demo";
import type { ShopData } from "./types";
export const getShopData = cache(async (admin = false): Promise<ShopData> => {
 if (!process.env.DATABASE_URL) return { products: demoProducts, categories: defaultCategories, settings: { ...defaultSettings, whatsapp: process.env.SHOP_WHATSAPP || "" }, demo: true };
 const db = getDb();
 const [rows, categoryRows, imageRows, settingsRows] = await Promise.all([
  db.select().from(products).where(admin ? undefined : eq(products.published, true)).orderBy(desc(products.createdAt)),
  db.select().from(categories).orderBy(asc(categories.position), asc(categories.name)),
  db.select().from(productImages).orderBy(asc(productImages.position)),
  db.select().from(shopSettings).where(eq(shopSettings.id, 1)),
 ]);
 return { products: rows.map(p => ({ ...p, createdAt: p.createdAt.toISOString(), images: imageRows.filter(i => i.productId === p.id).map(i => ({ fileId: i.fileId, url: i.url, position: i.position })) })), categories: categoryRows, settings: settingsRows[0] ?? defaultSettings, demo: false };
});
