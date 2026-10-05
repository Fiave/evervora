import { test, expect } from "@playwright/test";
test("customer can search, open a product and select a message", async ({
  page,
}) => {
  await page.goto("/shop");
  await expect(
    page.getByRole("heading", { name: "Find your everyday favourites." }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Search products" })
    .fill("headphones");
  await expect(
    page.getByRole("heading", { name: "Wireless headphones" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Everyday sneakers" }),
  ).toHaveCount(0);
  await page.getByRole("heading", { name: "Wireless headphones" }).click();
  await expect(page).toHaveURL(/products\/headphones/);
  await page
    .getByRole("button", { name: "I’d like to buy this", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "I’d like to buy this", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("link", {
      name: "Contact on WhatsApp about Wireless headphones",
      exact: true,
    }),
  ).toHaveAttribute("href", /^https:\/\/wa\.me\/233208987183\?text=/);
});
test("category links filter products and sold-out items offer restock enquiries", async ({
  page,
}) => {
  await page.goto("/shop?category=fashion");
  await expect(
    page.getByRole("heading", { name: "Everyday sneakers" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Wireless headphones" }),
  ).toHaveCount(0);
  await page.getByRole("heading", { name: "Statement sunglasses" }).click();
  await expect(
    page.getByRole("button", { name: "When will this be back in stock?" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "I’d like to buy this", exact: true }),
  ).toHaveCount(0);
});
test("empty search can be cleared and unknown products show not-found", async ({
  page,
}) => {
  await page.goto("/shop");
  await page
    .getByRole("textbox", { name: "Search products" })
    .fill("unfindable-123");
  await expect(
    page.getByRole("heading", { name: "No finds just yet" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(
    page.getByRole("heading", { name: "Wireless headphones" }),
  ).toBeVisible();
  await page.goto("/products/no-such-product");
  await expect(
    page.getByRole("heading", { name: "This find has moved on." }),
  ).toBeVisible();
});
test("admin preview is read-only, uploads require authorization, signup is unavailable", async ({
  page,
  request,
}) => {
  await page.goto("/admin");
  await expect(
    page.getByText("Read-only preview.", { exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Add product", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Save product", exact: true }),
  ).toBeDisabled();
  const upload = await request.post("/api/imagekit/auth", {
    headers: { origin: "http://localhost:3000" },
  });
  expect(upload.status()).toBe(401);
  const wrongOrigin = await request.post("/api/imagekit/auth", {
    headers: { origin: "https://example.com" },
  });
  expect(wrongOrigin.status()).toBe(403);
  const signup = await request.post("/api/auth/sign-up/email", {
    data: { email: "visitor@example.com", password: "testpassword" },
  });
  expect(signup.status()).toBe(404);
});
test("home fits the viewport and product photos load", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Everything/ })).toBeVisible();
  await page.locator("img").evaluateAll((images) =>
    Promise.all(
      images.map((image) => {
        const img = image as HTMLImageElement;
        img.loading = "eager";
        return img.decode();
      }),
    ),
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  const name = test.info().project.name;
  await page.screenshot({
    path: `test-results/home-${name}.png`,
    fullPage: true,
  });
});
