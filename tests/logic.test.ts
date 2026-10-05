import test from "node:test";
import assert from "node:assert/strict";
import { whatsappLink, slugify } from "../src/lib/whatsapp";
import { productSchema, settingsSchema } from "../src/lib/validation";
test("WhatsApp link includes the exact product and chosen message", () => {
  const url = whatsappLink(
    "+233 24 123 4567",
    "Headphones & speaker",
    "https://shop.example/products/headphones",
    "I’d like to buy this",
  );
  assert.ok(url);
  const parsed = new URL(url);
  assert.equal(parsed.pathname, "/233241234567");
  assert.equal(
    parsed.searchParams.get("text"),
    "Hi Evervora! I’d like to buy this\nProduct: Headphones & speaker\nhttps://shop.example/products/headphones",
  );
});
test("missing or malformed WhatsApp numbers never produce a link", () => {
  for (const number of ["", "0241234567", "abc", "+123", "23324?1234567"])
    assert.equal(whatsappLink(number), null);
});
test("product publishing requires photos and a real category ID", () => {
  assert.equal(
    productSchema.safeParse({
      name: "Headphones",
      description: "Comfortable headphones",
      categoryId: "invalid",
      featured: false,
      published: true,
      available: true,
      images: [],
    }).success,
    false,
  );
});
test("settings normalize phones and reject unsafe social URLs", () => {
  const good = settingsSchema.parse({
    whatsapp: "+233 24 123 4567",
    instagram: "",
    facebook: "",
    tiktok: "",
    delivery: "",
    contact: "",
  });
  assert.equal(good.whatsapp, "233241234567");
  assert.equal(
    settingsSchema.safeParse({ ...good, instagram: "javascript:alert(1)" })
      .success,
    false,
  );
  assert.equal(slugify("Everyday Essentials!"), "everyday-essentials");
});
