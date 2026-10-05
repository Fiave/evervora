"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, LayoutGrid, Settings, ArrowUpRight } from "lucide-react";

export function AdminNav() {
  const path = usePathname();
  return (
    <aside className="admin-sidebar min-w-0 h-fit lg:sticky lg:top-6">
      <div className="hidden px-3 pb-6 pt-2 lg:block">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-primary">
          SHOP STUDIO
        </p>
        <h2 className="mt-2 text-xl font-bold tracking-tight text-white">
          Make it yours.
        </h2>
      </div>
      <nav
        aria-label="Shop management"
        className="grid grid-cols-3 gap-1 lg:grid-cols-1 lg:gap-2"
      >
        {[
          { href: "/admin", label: "Products", Icon: Package },
          { href: "/admin/categories", label: "Categories", Icon: LayoutGrid },
          { href: "/admin/settings", label: "Shop settings", Icon: Settings },
        ].map(({ href, label, Icon }) => {
          const active =
            href === "/admin"
              ? path === href || path.startsWith("/admin/products")
              : path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex min-w-0 flex-col items-center gap-2 rounded-xl px-1 py-3 text-xs sm:flex-row sm:justify-center sm:px-4 sm:text-sm lg:justify-start font-medium transition-colors ${active ? "bg-primary text-[#171717]" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-12 hidden border-t border-white/15 px-3 pt-5 lg:block">
        <p className="text-sm leading-6 text-white/55">
          Good products.
          <br />
          Great first impressions.
        </p>
        <Link
          href="/shop"
          className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary"
        >
          Visit storefront <ArrowUpRight size={17} />
        </Link>
      </div>
    </aside>
  );
}
