import Link from "next/link";
import { WhatsAppIcon } from "./whatsapp-icon";
import { Brand } from "./brand";
import type { ShopSettings } from "@/lib/types";
import { whatsappLink } from "@/lib/whatsapp";
export function Footer({ settings }: { settings: ShopSettings }) {
  const chat = whatsappLink(settings.whatsapp);
  return (
    <footer className="mt-20 border-t bg-[#171717] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-[2fr_1fr_1fr] lg:px-8">
        <div>
          <Brand dark />
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">
            Fashion, electronics, phone accessories and everyday essentials.
            Everything you need, every day.
          </p>
          <div className="mt-5 flex gap-4">
            {settings.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <span className="text-sm">Instagram</span>
              </a>
            )}
            {settings.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <span className="text-sm">Facebook</span>
              </a>
            )}
            {settings.tiktok && (
              <a
                href={settings.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm"
              >
                TikTok
              </a>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Explore</h3>
          <div className="mt-4 grid gap-3 text-sm text-white/60">
            <Link href="/shop">Shop all products</Link>
            <Link href="/#categories">Our categories</Link>
            <Link href="/#how-it-works">How to order</Link>
            <a
              href="/brand-flyer.jpg"
              target="_blank"
              rel="noopener noreferrer"
            >
              Our business flyer
            </a>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Let’s talk</h3>
          <p className="mt-4 text-sm leading-6 text-white/60">
            Got a question? We’ll help you find what you need.
          </p>
          {chat && (
            <a
              className="mt-4 inline-flex items-center gap-2 text-sm text-primary"
              href={chat}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon width={17} height={17} />
              Message on WhatsApp
            </a>
          )}
          {settings.contact && (
            <p className="mt-3 text-sm text-white/60">{settings.contact}</p>
          )}
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 border-t border-white/10 px-5 py-5 text-sm text-white/45 lg:px-8">
        <p>© {new Date().getFullYear()} Evervora Market GH</p>
        <Link href="/admin">Shop owner login</Link>
      </div>
    </footer>
  );
}
