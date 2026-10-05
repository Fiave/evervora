"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, KeyRound, LoaderCircle } from "lucide-react";
import { PasswordInput } from "@/components/admin/password-input";
import { createAuthClient } from "@neondatabase/auth/next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export function PasswordReset({
  token,
  configured,
}: {
  token?: string;
  configured: boolean;
}) {
  const [pending, setPending] = useState(false),
    [error, setError] = useState(""),
    [success, setSuccess] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const client = createAuthClient();
      const result = token
        ? await client.resetPassword({
            token,
            newPassword: String(form.get("password")),
          })
        : await client.requestPasswordReset({
            email: String(form.get("email")),
            redirectTo: `${window.location.origin}/admin/reset-password`,
          });
      if (result.error)
        setError(result.error.message || "Unable to reset your password.");
      else
        setSuccess(
          token
            ? "Password updated. You can now sign in."
            : "If an account matches this email, a reset link will be sent. Check your inbox.",
        );
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setPending(false);
    }
  }
  return (
    <div className="w-full max-w-[400px]">
      <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50 text-[#b95500]">
        <KeyRound size={24} aria-hidden="true" />
      </span>
      <p className="eyebrow">LET’S GET YOU BACK IN</p>
      <h1 className="mt-3 text-3xl font-bold tracking-[-0.05em] sm:text-4xl">
        {token ? "Choose a new password" : "Reset your password"}
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {token
          ? "Use at least 8 characters."
          : "We’ll email you a link to get back into your shop."}
      </p>
      {success ? (
        <div role="status" className="mt-6 flex gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm leading-6 text-green-800">
          <CheckCircle2 size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
          <p>{success}</p>
        </div>
      ) : (
        <form onSubmit={submit} aria-busy={pending} className="mt-8 grid gap-4">
          <Label htmlFor={token ? "password" : "email"}>
            {token ? "New password" : "Email address"}
          </Label>
          {token ? <PasswordInput autoComplete="new-password" /> : (
            <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" className="h-13 rounded-xl bg-[#faf9f6] px-4 text-base md:text-base" />
          )}
          {error && (
            <p role="alert" className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" disabled={!configured || pending} className="mt-2 h-13 justify-between rounded-xl px-5">
            {pending
              ? "Please wait…"
              : token
                ? "Update password"
                : "Send reset link"}
            {pending ? <LoaderCircle size={18} className="animate-spin" aria-hidden="true" /> : <ArrowRight size={18} aria-hidden="true" />}
          </Button>
          {!configured && (
            <p className="text-xs text-muted-foreground">
              Password recovery is awaiting admin authentication setup.
            </p>
          )}
        </form>
      )}
      <Link
        className="mt-7 inline-flex items-center gap-2 rounded-sm text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        href="/admin/login"
      >
        <ArrowLeft size={16} aria-hidden="true" /> Back to sign in
      </Link>
    </div>
  );
}
