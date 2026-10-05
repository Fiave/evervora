import { AuthShell } from "@/components/admin/auth-shell";
import { PasswordReset } from "@/components/admin/password-reset";
import { authConfigured } from "@/lib/auth";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Password recovery",
  robots: { index: false, follow: false },
};
export default async function Reset({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <AuthShell>
      <PasswordReset token={token} configured={authConfigured()} />
    </AuthShell>
  );
}
