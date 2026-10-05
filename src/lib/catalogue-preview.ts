import { defaultCategories, demoProducts } from "./demo";
import type { Category, Product } from "./types";

export function previewProducts(categories: Category[]): Product[] {
  return demoProducts.flatMap((product) => {
    const slug = defaultCategories.find(
      (category) => category.id === product.categoryId,
    )?.slug;
    const category = categories.find((item) => item.slug === slug);
    return category ? [{ ...product, categoryId: category.id }] : [];
  });
}

export function sampleCatalogueEnabled(
  enabled: boolean,
  hasInventory: boolean,
) {
  return enabled && !hasInventory;
}
