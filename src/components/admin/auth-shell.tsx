import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Package, Plus, ShoppingBag, Sparkles, Tag } from "lucide-react";
import { Brand } from "@/components/shop/brand";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main id="main-content" className="min-h-svh bg-[#faf9f6] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100svh-2rem)] max-w-[1440px] overflow-hidden rounded-[1.75rem] border border-black/5 bg-white sm:min-h-[calc(100svh-3rem)] lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[1fr_1fr]">
        <aside className="auth-story relative flex flex-col justify-between overflow-hidden px-7 py-7 sm:px-10 lg:p-12">
          <Brand />
          <div className="relative z-10 hidden py-8 sm:block lg:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#805126]">THE SHOP OWNER’S CORNER</p>
            <h2 className="mt-4 max-w-lg text-[clamp(2.3rem,4vw,3.9rem)] font-extrabold leading-[1.08] tracking-[-0.06em]">
              Your shop.<br />Your next chapter.
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-[#755438]">
              A little care behind the scenes. A world of everyday finds out front.
            </p>
            <div aria-hidden="true" className="relative mx-auto mt-10 hidden h-[245px] max-w-[390px] sm:block">
              <div className="absolute inset-x-8 top-5 h-[205px] rotate-[-7deg] rounded-2xl border border-[#e8bd90] bg-[#ffd5a7]" />
              <div className="absolute inset-x-3 top-0 rounded-2xl border border-black/10 bg-white p-5 shadow-[0_20px_45px_-20px_#98633766]">
                <div className="flex items-center justify-between border-b pb-4">
                  <span className="flex items-center gap-2 text-sm font-bold"><ShoppingBag size={18} className="text-[#c65c00]" /> Your collection</span>
                  <span className="rounded-full bg-[#fff1e2] p-1.5 text-[#c65c00]"><Plus size={16} /></span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[{ icon: ShoppingBag, color: "bg-[#fff0df]", label: "Fashion" }, { icon: Package, color: "bg-[#edf0ff]", label: "Essentials" }, { icon: Tag, color: "bg-[#eaf5ef]", label: "Good finds" }].map(({ icon: Icon, color, label }) => (
                    <div key={label}>
                      <div className={`flex h-20 items-center justify-center rounded-xl ${color}`}><Icon size={30} strokeWidth={1.5} /></div>
                      <p className="mt-3 text-[10px] font-semibold">{label}</p>
                      <div className="mt-2 h-1.5 w-8 rounded-full bg-black/10" />
                    </div>
                  ))}
                </div>
              </div>
              <span className="absolute -bottom-1 right-0 flex rotate-[6deg] items-center gap-2 rounded-full border-2 border-[#171717] bg-[#171717] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_4px_0_#f5871f]"><Sparkles size={15} className="text-primary" /> Make it yours.</span>
            </div>
          </div>
          <p className="hidden items-center gap-2 text-xs font-medium text-[#755438] lg:flex">Everything you need, every day. <ArrowUpRight size={15} /></p>
        </aside>
        <section className="flex flex-col px-6 py-7 sm:px-10 lg:px-14 lg:py-10">
          <Link href="/shop" className="mb-10 inline-flex w-fit items-center gap-2 rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
            <ArrowLeft size={16} aria-hidden="true" /> Back to shop
          </Link>
          <div className="flex flex-1 items-center justify-center py-3 lg:py-8">
            {children}
          </div>
          <p className="mt-10 text-center text-xs leading-5 text-muted-foreground">Evervora Market GH · Shop owner access</p>
        </section>
      </div>
    </main>
  );
}
