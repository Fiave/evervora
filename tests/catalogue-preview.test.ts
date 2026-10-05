import test from "node:test";
import assert from "node:assert/strict";
import {
  previewProducts,
  sampleCatalogueEnabled,
} from "../src/lib/catalogue-preview";
import { defaultCategories } from "../src/lib/demo";

test("sample catalogue is enabled only when explicitly requested and real inventory is empty", () => {
  assert.equal(sampleCatalogueEnabled(true, false), true);
  assert.equal(sampleCatalogueEnabled(true, true), false);
  assert.equal(sampleCatalogueEnabled(false, false), false);
  assert.equal(sampleCatalogueEnabled(false, true), false);
});

test("sample products use the actual category IDs", () => {
  const categories = defaultCategories.map((category, i) => ({
    ...category,
    id: `real-category-${i}`,
  }));
  const products = previewProducts(categories);
  assert.equal(products.length, 8);
  assert.ok(
    products.every((product) =>
      categories.some((category) => category.id === product.categoryId),
    ),
  );
});

test("samples for removed categories do not appear", () => {
  const products = previewProducts(
    defaultCategories.filter((category) => category.slug === "electronics"),
  );
  assert.equal(products.length, 2);
  assert.deepEqual(
    products.map((product) => product.slug),
    ["headphones", "speaker"],
  );
  assert.deepEqual(previewProducts([]), []);
});
