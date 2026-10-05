import Link from "next/link";
import { House } from "lucide-react";
export function Brand({ dark = false }: { dark?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Evervora Market GH home"
      className={`inline-flex items-center gap-2.5 ${dark ? "text-white" : "text-foreground"}`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <House size={24} strokeWidth={2.2} />
      </div>
      <div>
        <span className="block text-xl font-extrabold tracking-[-0.05em] leading-none">
          EVERVORA<span className="text-primary">.</span>
        </span>
        <span className="mt-1 block text-[11px] font-semibold tracking-[0.24em]">
          MARKET GH
        </span>
      </div>
    </Link>
  );
}
