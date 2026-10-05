"use client";
import { useState } from "react";
import { Truck, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WhatsAppIcon } from "./whatsapp-icon";
import { ProductPhoto } from "./product-photo";
import { enquiryMessages, whatsappLink } from "@/lib/whatsapp";
import type { Product, Category, ShopSettings } from "@/lib/types";
export function ProductDetail({
  product,
  category,
  settings,
}: {
  product: Product;
  category?: Category;
  settings: ShopSettings;
}) {
  const [image, setImage] = useState(0),
    [message, setMessage] = useState<string>(
      product.available
        ? enquiryMessages[0]
        : "When will this be back in stock?",
    ),
    [copied, setCopied] = useState(false);
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/products/${product.slug}`;
  const chat = whatsappLink(settings.whatsapp, product.name, url, message);
  const choices = product.available
    ? enquiryMessages
    : ["When will this be back in stock?", "Do you have something similar?"];
  async function share() {
    try {
      const link = window.location.href;
      if (navigator.share)
        await navigator.share({ title: product.name, url: link });
      else {
        await navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {}
  }
  return (
    <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
      <div>
        <ProductPhoto
          src={product.images[image]?.url}
          alt={product.name}
          className="aspect-square rounded-3xl"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
        {product.images.length > 1 && (
          <div className="mt-4 flex gap-3">
            {product.images.map((photo, i) => (
              <button
                key={photo.fileId}
                onClick={() => setImage(i)}
                aria-label={`View photo ${i + 1}`}
                aria-pressed={image === i}
                className={`w-20 overflow-hidden rounded-xl border-2 ${image === i ? "border-primary" : "border-transparent"}`}
              >
                <ProductPhoto
                  src={photo.url}
                  alt={`${product.name}, photo ${i + 1}`}
                  className="aspect-square"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="py-3">
        <p className="eyebrow">{category?.name}</p>
        <h1 className="mt-3 break-words text-3xl font-bold sm:text-4xl tracking-[-0.04em]">
          {product.name}
        </h1>
        <div className="mt-5 flex items-center gap-3">
          <Badge
            variant="secondary"
            className={
              product.available
                ? "bg-green-50 text-green-800"
                : "bg-neutral-100"
            }
          >
            {product.available ? "Available" : "Sold out"}
          </Badge>
        </div>
        <p className="mt-7 whitespace-pre-wrap break-words text-base leading-8 text-muted-foreground">
          {product.description}
        </p>
        <div className="mt-8 border-t pt-7">
          <h2 className="text-base font-semibold">Have a question?</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {choices.map((q) => (
              <Button
                key={q}
                variant={message === q ? "default" : "outline"}
                size="sm"
                className="h-auto min-h-11 max-w-full whitespace-normal rounded-full py-2 text-left"
                aria-pressed={message === q}
                onClick={() => setMessage(q)}
              >
                {q}
              </Button>
            ))}
          </div>
          {chat ? (
            <Button
              size="lg"
              asChild
              className="mt-5 h-12 w-full rounded-xl bg-[#167347] text-white hover:bg-[#115c39]"
            >
              <a
                href={chat}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Contact on WhatsApp about ${product.name}`}
              >
                <WhatsAppIcon />
                Contact
              </a>
            </Button>
          ) : (
            <Button
              disabled
              size="lg"
              className="mt-5 h-12 w-full rounded-xl bg-[#167347] text-white"
              aria-label={`Contact on WhatsApp about ${product.name}`}
            >
              <WhatsAppIcon /> Contact
            </Button>
          )}

        </div>
        {settings.delivery && (
          <p className="mt-5 flex items-start gap-2 text-sm text-muted-foreground">
            <Truck size={16} className="mt-0.5 shrink-0" />
            {settings.delivery}
          </p>
        )}
        <Button variant="ghost" className="mt-4" onClick={share}>
          {copied ? <Check size={17} /> : <Share2 size={17} />}{" "}
          {copied ? "Link copied" : "Share this find"}
        </Button>
      </div>
    </div>
  );
}
