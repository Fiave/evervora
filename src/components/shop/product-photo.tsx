"use client";
import Image, { type ImageLoaderProps } from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";
function imageKitLoader({ src, width, quality }: ImageLoaderProps) {
  const url = new URL(src);
  url.searchParams.set("tr", `w-${width},q-${quality ?? 80},f-auto`);
  return url.toString();
}
export function ProductPhoto({
  src,
  alt,
  className = "",
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  priority = false,
}: {
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const endpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
  const imagekit = Boolean(src && endpoint && src.startsWith(endpoint + "/"));
  return (
    <div className={`relative overflow-hidden bg-[#f2f2f0] ${className}`}>
      {src && !failed ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          preload={priority}
          loader={imagekit ? imageKitLoader : undefined}
          unoptimized={Boolean(src?.startsWith("https://") && !imagekit)}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          <ImageOff aria-label="Photo unavailable" size={32} />
        </div>
      )}
    </div>
  );
}
