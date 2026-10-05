"use server";
import { getAuth, authConfigured } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { ActionResult } from "@/lib/types";
export async function signIn(
  _: ActionResult,
  form: FormData,
): Promise<ActionResult> {
  if (!authConfigured())
    return {
      error:
        "Admin login will be available once Neon authentication is connected.",
    };
  const email = String(form.get("email") || ""),
    password = String(form.get("password") || "");
  if (!email || !password) return { error: "Enter your email and password." };
  try {
    const auth = getAuth();
    const { data, error } = await auth.signIn.email({ email, password });
    if (error) return { error: "The email or password wasn’t accepted." };
    // The SDK reads incoming request cookies; the new session cookie is
    // available on the next request. Authorize this result directly.
    if (!data?.user || data.user.id !== process.env.ADMIN_USER_ID) {
      await auth.signOut();
      return { error: "This account doesn’t have access to the shop." };
    }
  } catch {
    return { error: "Unable to sign in right now. Please try again." };
  }
  redirect("/admin");
}
export async function signOut() {
  if (authConfigured()) await getAuth().signOut();
  redirect("/admin/login");
}
