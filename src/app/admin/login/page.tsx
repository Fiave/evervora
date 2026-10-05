import { AuthShell } from "@/components/admin/auth-shell";
import { LoginForm } from "@/components/admin/login-form";
import { authConfigured } from "@/lib/auth";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Shop owner login",
  robots: { index: false, follow: false },
};
export default function Login() {
  return (
    <AuthShell>
      <LoginForm configured={authConfigured()} />
    </AuthShell>
  );
}
