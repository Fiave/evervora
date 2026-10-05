import Link from "next/link";
import { ProductPhoto } from "./product-photo";
import { WhatsAppIcon } from "./whatsapp-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/whatsapp";
import type { Product, Category } from "@/lib/types";

export function ProductCard({
  product,
  category,
  whatsapp,
}: {
  product: Product;
  category?: Category;
  whatsapp: string;
}) {
  const href = `/products/${product.slug}`;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}${href}`;
  const chat = whatsappLink(
    whatsapp,
    product.name,
    url,
    product.available
      ? "Is this available?"
      : "When will this be back in stock?",
  );
  const contactClass =
    "mt-3 h-11 w-full rounded-full bg-[#167347] px-2 text-xs text-white hover:bg-[#115c39] sm:ml-2 sm:w-auto sm:px-4 sm:text-sm";
  return (
    <article className="product-tile min-w-0">
      <Link
        href={href}
        className="group block rounded-2xl outline-offset-4 focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="relative">
          <ProductPhoto
            src={product.images[0]?.url}
            alt={product.name}
            className="aspect-[1.06] rounded-2xl"
          />
          {!product.available ? (
            <Badge className="absolute left-3 top-3 bg-white text-foreground">
              Sold out
            </Badge>
          ) : (
            product.featured && (
              <Badge className="absolute left-3 top-3 bg-white text-foreground">
                Popular pick
              </Badge>
            )
          )}
        </div>
        <div className="product-content pt-4">
          <p className="break-words text-[10px] font-semibold uppercase sm:text-[12px] tracking-[0.13em] text-muted-foreground">
            {category?.name}
          </p>
          <h3 className="mt-1 break-words text-sm font-semibold sm:text-base tracking-tight group-hover:text-primary">
            {product.name}
          </h3>
        </div>
      </Link>
      {chat ? (
        <Button asChild className={contactClass}>
          <a
            href={chat}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Contact on WhatsApp about ${product.name}`}
          >
            <WhatsAppIcon /> Contact
          </a>
        </Button>
      ) : (
        <Button
          disabled
          className={contactClass}
          aria-label={`Contact on WhatsApp about ${product.name}`}
        >
          <WhatsAppIcon /> Contact
        </Button>
      )}

    </article>
  );
}
