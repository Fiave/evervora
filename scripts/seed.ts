import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { categories, shopSettings } from "../src/lib/db/schema";
import { defaultCategories, defaultSettings } from "../src/lib/demo";
async function main() {
  if (!process.env.DATABASE_URL) throw new Error("Set DATABASE_URL first.");
  const db = drizzle(neon(process.env.DATABASE_URL));
  await db.insert(categories).values(defaultCategories).onConflictDoNothing();
  await db
    .insert(shopSettings)
    .values({ ...defaultSettings, id: 1 })
    .onConflictDoNothing();
  console.log(
    "The four starting categories and shop settings are ready. No sample products were inserted.",
  );
}

main().catch((error: unknown) => {
  console.error(
    "Could not seed the shop. Check the database connection and migrations.",
  );
  if (error instanceof Error)
    console.error(
      error.message.replace(/postgres(?:ql)?:\/\/\S+/g, "[redacted]"),
    );
  process.exitCode = 1;
});
