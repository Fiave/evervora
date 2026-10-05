"use client";
import Link from "next/link";
import { Menu, Search, ShoppingBag } from "lucide-react";
import { WhatsAppIcon } from "./whatsapp-icon";
import { Brand } from "./brand";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { whatsappLink } from "@/lib/whatsapp";
import type { Category } from "@/lib/types";
export function Header({
  categories,
  whatsapp,
}: {
  categories: Category[];
  whatsapp: string;
}) {
  const chat = whatsappLink(whatsapp);
  return (
    <>
      <header className="relative z-10 border-b border-white/10 bg-[#171717] text-white shadow-[0_8px_24px_-16px_#17171780]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 sm:gap-6 sm:px-5 py-5 lg:px-8">
          <Brand dark />
          <nav className="hidden items-center gap-7 text-sm font-medium text-white/75 md:flex">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <Link href="/shop" className="hover:text-white">
              Shop all
            </Link>
            <Link href="/#how-it-works" className="hover:text-white">
              How to order
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hidden text-white hover:bg-white/10 hover:text-white min-[375px]:inline-flex"
            >
              <Link href="/shop#catalogue-search" aria-label="Search products">
                <Search size={20} />
              </Link>
            </Button>
            {chat && (
              <Button asChild className="h-10 w-10 px-0 sm:w-auto sm:px-4">
                <a href={chat} target="_blank" rel="noopener noreferrer" aria-label="Contact on WhatsApp">
                  <WhatsAppIcon width={17} height={17} />
                  <span className="hidden sm:inline">Contact</span>
                </a>
              </Button>
            )}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-white hover:bg-white/10 hover:text-white"
                  aria-label="Open menu"
                >
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetTitle className="px-6 pt-6">
                  Evervora Market GH
                </SheetTitle>
                <nav className="grid gap-5 p-6">
                  <SheetClose asChild>
                    <Link href="/shop" className="flex min-h-11 items-center gap-2">
                      <ShoppingBag size={18} />
                      Shop all
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/shop#catalogue-search" className="flex min-h-11 items-center gap-2">
                      <Search size={18} /> Search products
                    </Link>
                  </SheetClose>
                  {categories.map((c) => (
                    <SheetClose key={c.id} asChild>
                      <Link href={`/shop?category=${c.slug}`} className="flex min-h-11 items-center">
                        {c.name}
                      </Link>
                    </SheetClose>
                  ))}
                  <SheetClose asChild>
                    <Link href="/#how-it-works" className="flex min-h-11 items-center">How to order</Link>
                  </SheetClose>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
