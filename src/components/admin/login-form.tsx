"use client";
import Link from "next/link";
import { useActionState } from "react";
import { ArrowRight, Info, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/admin/password-input";
import { signIn } from "@/app/admin/login/actions";
export function LoginForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(signIn, {});
  return (
    <div className="w-full max-w-[400px]">
      <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50 text-[#b95500]">
        <LockKeyhole size={24} aria-hidden="true" />
      </span>
      <p className="eyebrow">WELCOME TO YOUR WORKSPACE</p>
      <h1 className="mt-3 text-4xl font-bold tracking-[-0.05em] sm:text-[2.6rem]">Welcome back.</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">Sign in to manage your Evervora shop.</p>
      {!configured && (
        <div role="status" className="mt-6 flex gap-3 rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm leading-6 text-orange-950">
          <Info size={18} className="mt-1 shrink-0" aria-hidden="true" />
          <p>Admin login is awaiting setup. The catalogue preview is read-only.</p>
        </div>
      )}
      <form action={action} aria-busy={pending} className="mt-8 grid gap-6">
        <div className="grid gap-2.5">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <Mail size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input id="email" name="email" type="email" autoComplete="username" required placeholder="you@example.com" className="h-13 rounded-xl bg-[#faf9f6] pl-11 text-base md:text-base" />
          </div>
        </div>
        <div className="grid gap-2.5">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="password">Password</Label>
            <Link href="/admin/reset-password" className="rounded-sm text-xs font-medium text-[#a64b00] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">Forgot password?</Link>
          </div>
          <PasswordInput />
        </div>
        {state.error && <p role="alert" className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">{state.error}</p>}
        <Button type="submit" disabled={pending || !configured} className="h-13 w-full justify-between rounded-xl px-5 text-sm shadow-[0_6px_16px_-8px_#f5871f]">
          {pending ? "Signing in…" : "Sign in"}
          {pending ? <LoaderCircle className="animate-spin" size={18} aria-hidden="true" /> : <ArrowRight size={18} aria-hidden="true" />}
        </Button>
      </form>
      <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">Your next great find starts behind the scenes.</p>
    </div>
  );
}
