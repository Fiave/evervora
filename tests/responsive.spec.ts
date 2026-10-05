import { test, expect } from "@playwright/test";

const routes = [
  "/", "/shop", "/products/headphones", "/admin/login",
  "/admin/reset-password", "/admin/reset-password?token=preview",
  "/admin", "/admin/products/new",
  "/admin/products/20000000-0000-4000-8000-000000000001",
  "/admin/categories", "/admin/settings",
];

for (const width of [320, 390, 640, 768, 1024, 1280, 1920]) {
  test(`pages fit a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await expect(page.locator("h1").first()).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth), route).toBeLessThanOrEqual(width);
      // The WhatsApp target must stay within each product card, not spill into its neighbour.
      for (const card of await page.locator(".product-tile").all()) {
        const bounds = await card.boundingBox();
        const contact = await card.getByRole("link", { name: /Contact on WhatsApp/ }).boundingBox();
        expect(contact).not.toBeNull();
        expect(contact!.x + contact!.width, route).toBeLessThanOrEqual(bounds!.x + bounds!.width + 1);
      }
      if (route === "/admin" && width < 768) {
        await expect(page.getByRole("link", { name: "Edit Wireless headphones", exact: true })).toBeVisible();
        await expect(page.getByRole("link", { name: "Shop settings", exact: true })).toBeVisible();
      }
    }
  });
}

test("mobile menu scrolls in landscape and closes after navigation", async ({ page }) => {
  await page.setViewportSize({ width: 667, height: 375 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("dialog");
  await expect(menu).toBeVisible();
  await menu.getByRole("link", { name: "Everyday Essentials", exact: true }).click();
  await expect(menu).not.toBeVisible();
  await expect(page).toHaveURL(/category=everyday-essentials/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(667);
});

test("pages remain usable with doubled text size", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  for (const route of ["/", "/shop", "/products/headphones", "/admin/login", "/admin/products/new", "/admin/settings"]) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1").first()).toBeVisible();
    await page.addStyleTag({ content: "html { font-size: 34px !important; }" });
    expect(await page.evaluate(() => document.documentElement.scrollWidth), route).toBeLessThanOrEqual(1280);
  }
});

test("phone product form supports category selection and publishing controls", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/admin/products/new");
  await page.getByLabel("Product name").fill("A new everyday find");
  await page.getByRole("combobox", { name: "Category" }).click();
  await page.getByRole("option", { name: "Phone Accessories", exact: true }).click();
  await expect(page.getByRole("combobox", { name: "Category" })).toContainText("Phone Accessories");
  await page.getByRole("switch", { name: "Publish in shop", exact: true }).click();
  await expect(page.getByRole("switch", { name: "Publish in shop", exact: true })).toBeChecked();
  expect(await page.getByLabel("Product name").evaluate((element) => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(16);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await expect(page.getByRole("button", { name: "Save product", exact: true })).toBeDisabled();
});
