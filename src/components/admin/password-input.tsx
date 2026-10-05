"use client";

import { useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { Input } from "@/components/ui/input";

export function PasswordInput({ autoComplete = "current-password" }: { autoComplete?: "current-password" | "new-password" }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <LockKeyhole size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Input id="password" name="password" type={visible ? "text" : "password"} autoComplete={autoComplete} required minLength={8} placeholder={autoComplete === "new-password" ? "At least 8 characters" : "Enter your password"} className="h-13 rounded-xl bg-[#faf9f6] pl-11 pr-14 text-base md:text-base" />
      <button type="button" aria-label={visible ? "Hide password" : "Show password"} aria-controls="password" aria-pressed={visible} onClick={() => setVisible((value) => !value)} className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring">
        {visible ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
      </button>
    </div>
  );
}
