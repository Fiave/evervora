import "server-only";
import { createNeonAuth } from "@neondatabase/auth/next/server";
import { redirect } from "next/navigation";
export function authConfigured() {
  return Boolean(
    process.env.NEON_AUTH_BASE_URL &&
    process.env.NEON_AUTH_COOKIE_SECRET &&
    process.env.ADMIN_USER_ID,
  );
}
export function getAuth() {
  if (!authConfigured())
    throw new Error("Admin login has not been configured.");
  return createNeonAuth({
    baseUrl: process.env.NEON_AUTH_BASE_URL!,
    cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET! },
  });
}
export async function requireAdmin() {
  if (!authConfigured())
    throw new Error(
      "Admin login has not been configured. This preview is read-only.",
    );
  const { data: session } = await getAuth().getSession();
  if (!session?.user || session.user.id !== process.env.ADMIN_USER_ID)
    throw new Error("Please sign in with the shop owner account.");
  return session.user;
}
export async function guardAdminPage() {
  if (!process.env.DATABASE_URL) return; // Only public sample data is shown; mutations still require authentication.
  if (!authConfigured()) redirect("/admin/login");
  const { data: session } = await getAuth().getSession();
  if (!session?.user || session.user.id !== process.env.ADMIN_USER_ID)
    redirect("/admin/login");
}
