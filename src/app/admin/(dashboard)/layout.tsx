import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";
import { Brand } from "@/components/shop/brand";
import { Button } from "@/components/ui/button";
import { guardAdminPage, authConfigured } from "@/lib/auth";
import { signOut } from "@/app/admin/login/actions";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Shop management",
  robots: { index: false, follow: false },
};
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await guardAdminPage();
  return (
    <div className="admin-studio min-h-screen">
      <header className="border-b border-white/10 bg-[#171717] text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 lg:px-8">
          <Brand dark />
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/shop">
                <ExternalLink size={15} />
                View shop
              </Link>
            </Button>
            {authConfigured() && (
              <form action={signOut}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-white/70 hover:bg-white/10 hover:text-white"
                >
                  Sign out
                </Button>
              </form>
            )}
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-7 px-5 py-8 lg:grid-cols-[220px_1fr] lg:px-8">
        <AdminNav />
        <main id="main-content" className="min-w-0">
          {!process.env.DATABASE_URL && (
            <div className="mb-6 rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-950">
              <strong>Read-only preview.</strong> These are sample products.
              Connect Neon, admin authentication and ImageKit to manage real
              stock.
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
