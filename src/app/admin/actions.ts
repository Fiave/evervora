"use server";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import {
  products,
  productImages,
  categories,
  shopSettings,
} from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth";
import {
  productSchema,
  categorySchema,
  settingsSchema,
  validationMessage,
} from "@/lib/validation";
import { slugify } from "@/lib/whatsapp";
import { removeImage, validImageUrl } from "@/lib/imagekit";
import type { ActionResult } from "@/lib/types";
function refreshShop() {
  revalidatePath("/", "layout");
}
async function authorized(): Promise<ActionResult | null> {
  try {
    await requireAdmin();
    return null;
  } catch {
    return {
      error:
        "Please sign in with the shop owner account. The preview is read-only.",
    };
  }
}
export async function saveProduct(input: unknown): Promise<ActionResult> {
  const denied = await authorized();
  if (denied) return denied;
  try {
    const p = productSchema.parse(input);
    if (p.images.some((i) => !validImageUrl(i.url)))
      return { error: "Upload your product photos through ImageKit." };
    const db = getDb();
    const id = p.id ?? randomUUID();
    const category = await db
      .select()
      .from(categories)
      .where(eq(categories.id, p.categoryId));
    if (!category.length) return { error: "Choose an existing category." };
    const oldImages = await db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, id));
    const { images, ...fields } = p;
    const values = {
      ...fields,
      id,
      slug: `${slugify(p.name) || "product"}-${id.slice(0, 8)}`,
    };
    await db.batch([
      db
        .insert(products)
        .values(values)
        .onConflictDoUpdate({
          target: products.id,
          set: {
            name: p.name,
            description: p.description,
            categoryId: p.categoryId,
            featured: p.featured,
            published: p.published,
            available: p.available,
          },
        }),
      db.delete(productImages).where(eq(productImages.productId, id)),
      db
        .insert(productImages)
        .values(
          images.map((i, index) => ({ ...i, position: index, productId: id })),
        ),
    ]);
    await Promise.allSettled(
      oldImages
        .filter((i) => !images.some((n) => n.fileId === i.fileId))
        .map((i) => removeImage(i.fileId)),
    );
    refreshShop();
    return { success: "Product saved.", id };
  } catch (error) {
    console.error("Product save failed");
    return { error: validationMessage(error) };
  }
}
export async function deleteProduct(id: string): Promise<ActionResult> {
  const denied = await authorized();
  if (denied) return denied;
  try {
    const db = getDb();
    const images = await db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, id));
    await db.delete(products).where(eq(products.id, id));
    await Promise.allSettled(images.map((i) => removeImage(i.fileId)));
    refreshShop();
    return { success: "Product deleted." };
  } catch {
    return { error: "Could not delete this product. Please try again." };
  }
}
export async function saveCategory(input: unknown): Promise<ActionResult> {
  const denied = await authorized();
  if (denied) return denied;
  try {
    const c = categorySchema.parse(input);
    const slug = slugify(c.name);
    if (!slug) return { error: "Use a category name with letters or numbers." };
    await getDb()
      .insert(categories)
      .values({ ...c, id: c.id ?? randomUUID(), slug })
      .onConflictDoUpdate({
        target: categories.id,
        set: { name: c.name, slug, position: c.position },
      });
    refreshShop();
    return { success: "Category saved." };
  } catch {
    return {
      error:
        "Could not save. Check the name is unique and the position is valid.",
    };
  }
}
export async function deleteCategory(id: string): Promise<ActionResult> {
  const denied = await authorized();
  if (denied) return denied;
  try {
    const db = getDb();
    const attached = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.categoryId, id))
      .limit(1);
    if (attached.length)
      return {
        error: "Move products to another category before deleting this one.",
      };
    await db.delete(categories).where(eq(categories.id, id));
    refreshShop();
    return { success: "Category deleted." };
  } catch {
    return {
      error: "Could not delete this category. Move any products first.",
    };
  }
}
export async function saveSettings(input: unknown): Promise<ActionResult> {
  const denied = await authorized();
  if (denied) return denied;
  try {
    const s = settingsSchema.parse(input);
    await getDb()
      .insert(shopSettings)
      .values({ ...s, id: 1 })
      .onConflictDoUpdate({ target: shopSettings.id, set: s });
    refreshShop();
    return { success: "Shop settings saved." };
  } catch (error) {
    return { error: validationMessage(error) };
  }
}
