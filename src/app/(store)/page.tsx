import Link from "next/link";
import type { CSSProperties } from "react";
import {
  Shirt,
  Smartphone,
  Headphones,
  ShoppingBag,
  ShieldCheck,
  MessagesSquare,
  Tag,
  Check,
  PackageCheck,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductPhoto } from "@/components/shop/product-photo";
import { ProductCard } from "@/components/shop/product-card";
import { getShopData } from "@/lib/data";
const icons = [Shirt, Headphones, Smartphone, ShoppingBag];
export default async function Home() {
  const { products, categories, settings } = await getShopData();
  const picks = products.filter((p) => p.featured).slice(0, 4);
  const latest = products.slice(0, 4);
  const heroFirst = products[0],
    heroSecond = products[1];
  return (
    <div className="mx-auto max-w-7xl px-5 lg:px-8">
      <section className="hero-grid grid items-center gap-10 py-12 md:grid-cols-2 md:py-16">
        <div className="max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-sm font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            YOUR EVERYDAY ONE-STOP SHOP
          </div>
          <h1 className="text-[clamp(2.9rem,5.5vw,5rem)] font-extrabold leading-[1.04] tracking-[-0.065em]">
            Everything
            <br />
            you need.
            <br />
            <span className="hero-highlight text-primary">Every day.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">
            Shop fashion, electronics, phone accessories and everyday
            essentials.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Button
              size="lg"
              asChild
              className="h-12 rounded-full px-7 shadow-[0_7px_20px_-8px_#f5871f] transition-transform hover:-translate-y-0.5"
            >
              <Link href="/shop">
                <ShoppingBag size={18} />
                Explore the shop
                <ArrowUpRight size={18} />
              </Link>
            </Button>
            <Link
              href="#how-it-works"
              className="text-sm font-medium underline decoration-border underline-offset-4"
            >
              How to order
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
            <MessagesSquare size={17} className="text-foreground" />
            Find it here. Order on WhatsApp.
          </div>
        </div>
        <div className="hero-art relative isolate h-[380px] overflow-hidden rounded-[2rem] sm:h-[440px] md:h-[500px]">
          <div className="absolute left-6 top-6 text-[12px] font-semibold tracking-[0.18em]">
            THE EVERYDAY EDIT
          </div>
          <div className="hero-orbit" aria-hidden="true" />
          <div
            className="absolute bottom-[-110px] left-[-90px] h-80 w-80 rounded-full bg-[#ffbc70]/40"
            aria-hidden="true"
          />
          <Link
            href={heroFirst ? `/products/${heroFirst.slug}` : "/shop"}
            className={`hero-card hero-card-first absolute rounded-2xl bg-white p-2.5 ${heroSecond ? "left-[8%] top-[20%] w-[48%] -rotate-[9deg]" : "left-[19%] top-[17%] w-[60%] -rotate-[6deg]"}`}
          >
            <ProductPhoto
              src={heroFirst?.images[0]?.url || "/brand-flyer.jpg"}
              alt={heroFirst?.name || "Evervora Market GH"}
              className="aspect-square rounded-xl"
              sizes="(max-width: 640px) 60vw, 320px"
              priority
            />
            <div className="flex items-center justify-between gap-2 px-2 py-3 text-sm font-semibold">
              <span>{heroFirst?.name || "Find your thing."}</span>
              <ArrowUpRight size={18} className="shrink-0 text-primary" />
            </div>
          </Link>
          {heroSecond && (
            <Link
              href={`/products/${heroSecond.slug}`}
              className="hero-card hero-card-second absolute right-[5%] top-[37%] w-[43%] rotate-[9deg] rounded-2xl bg-white p-2.5"
            >
              <ProductPhoto
                src={heroSecond.images[0]?.url}
                alt={heroSecond.name}
                className="aspect-square rounded-xl"
                sizes="(max-width: 640px) 43vw, 260px"
                priority
              />
              <div className="flex items-center justify-between gap-2 px-2 py-3 text-sm font-semibold">
                <span>{heroSecond.name}</span>
                <ArrowUpRight size={18} className="shrink-0 text-primary" />
              </div>
            </Link>
          )}
          <div className="hero-sticker absolute right-4 top-14 flex h-24 w-24 rotate-12 flex-col items-center justify-center rounded-full bg-primary text-center text-[#171717] sm:right-6">
            <ShoppingBag size={24} aria-hidden="true" />
            <span className="mt-1 text-[11px] font-extrabold leading-tight tracking-wide">
              GOOD FINDS.
              <br />
              GREAT VALUE.
            </span>
          </div>
          <div className="absolute bottom-6 left-6 flex items-center gap-2 rounded-full bg-[#171717] px-4 py-2 text-sm font-semibold text-white">
            <Tag size={17} className="text-primary" /> A little bit of
            everything.
          </div>
        </div>
      </section>
      <section className="grid grid-cols-2 gap-6 rounded-2xl border bg-white p-5 md:grid-cols-4 md:p-7">
        {[
          {
            icon: ShieldCheck,
            title: "Quality you can trust",
            text: "Selected with care",
          },
          {
            icon: Tag,
            title: "Everyday value",
            text: "Find your next favourite",
          },
          {
            icon: MessagesSquare,
            title: "A real conversation",
            text: "Order directly on WhatsApp",
          },
          {
            icon: PackageCheck,
            title: "Made simple",
            text: "Ask us about delivery",
          },
        ].map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="flex flex-col items-start gap-3 sm:flex-row"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50">
              <Icon className="text-primary" size={22} />
            </span>
            <div>
              <p className="text-sm font-semibold">{title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </div>
          </div>
        ))}
      </section>
      <section id="categories" className="scroll-mt-6 py-12">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FIND YOUR THING</p>
            <h2>Shop by category</h2>
          </div>
          <Link
            href="/shop"
            className="text-sm font-medium underline underline-offset-4"
          >
            View all products
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {categories.map((c, i) => {
            const Icon = icons[i % icons.length];
            const colors = ["#fff0e0", "#edf0ff", "#eaf5ef", "#fff5d9"];
            return (
              <Link
                key={c.id}
                href={`/shop?category=${c.slug}`}
                className="category-tile group"
                style={
                  { "--tile-color": colors[i % colors.length] } as CSSProperties
                }
              >
                <Icon
                  className="category-art"
                  aria-hidden="true"
                  strokeWidth={1}
                />
                <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white/80">
                  <Icon size={23} />
                </span>
                <div className="relative mt-7 flex items-end justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold tracking-tight">
                      {c.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {products.filter((p) => p.categoryId === c.id).length}{" "}
                      products
                    </p>
                  </div>
                  <span className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/80 transition-transform group-hover:-rotate-45 sm:flex">
                    <ArrowRight size={17} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="pb-12">
        <div className="section-heading">
          <div>
            <p className="eyebrow">WORTH A LOOK</p>
            <h2>Hot Picks</h2>
          </div>
          <span className="hidden text-sm text-muted-foreground sm:block">
            A few picks to get you started.
          </span>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-x-3 sm:gap-x-5 gap-y-8 lg:grid-cols-4">
          {(picks.length ? picks : latest).map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              whatsapp={settings.whatsapp}
              category={categories.find((c) => c.id === p.categoryId)}
            />
          ))}
        </div>
        {!products.length && (
          <div className="mt-6 flex flex-col items-center rounded-3xl border border-dashed border-orange-200 bg-white px-6 py-12 text-center">
            <span className="mb-4 flex h-16 w-16 -rotate-6 items-center justify-center rounded-2xl bg-orange-50 text-primary">
              <ShoppingBag size={30} />
            </span>
            <h3 className="text-xl font-bold">Good finds are on their way.</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Check back soon for our latest arrivals.
            </p>
          </div>
        )}
      </section>
      <section
        id="how-it-works"
        className="shop-story scroll-mt-6 rounded-3xl bg-[#171717] px-6 py-10 text-white md:px-10"
      >
        <div className="grid gap-8 md:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow text-primary">NO COMPLICATED CHECKOUT</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              See it. Love it.
              <br />
              Let’s talk.
            </h2>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/60">
              A personal shopping experience, just a message away.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "Find your favourite",
                text: "Browse the shop and open a product you like.",
              },
              {
                title: "Start a conversation",
                text: "Tap Contact and send a message on WhatsApp.",
              },
              {
                title: "Make it yours",
                text: "Confirm the price, payment and delivery with us.",
              },
            ].map((s, i) => (
              <div key={s.title}>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-sm font-semibold text-primary">
                  0{i + 1}
                </span>
                <h3 className="mt-4 text-sm font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {latest.length > 0 && (
        <section className="pt-12">
          <div className="section-heading">
            <div>
              <p className="eyebrow">SOMETHING NEW</p>
              <h2>Latest additions</h2>
            </div>
            <Button variant="outline" asChild className="rounded-full">
              <Link href="/shop">Browse everything</Link>
            </Button>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-x-3 sm:gap-x-5 gap-y-8 lg:grid-cols-4">
            {latest.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                whatsapp={settings.whatsapp}
                category={categories.find((c) => c.id === p.categoryId)}
              />
            ))}
          </div>
        </section>
      )}
      <p className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Check size={16} className="text-primary" />
        Everything you need, every day.
      </p>
    </div>
  );
}
