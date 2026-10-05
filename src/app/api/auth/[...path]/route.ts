import { getAuth, authConfigured } from "@/lib/auth";
const allowed = new Set([
  "sign-in/email",
  "sign-out",
  "get-session",
  "request-password-reset",
  "reset-password",
]);
async function handle(
  request: Request,
  method: "GET" | "POST",
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const route = path.join("/");
  if (
    !allowed.has(route) &&
    !(method === "GET" && route.startsWith("reset-password/"))
  )
    return Response.json({ error: "Not found" }, { status: 404 });
  if (!authConfigured())
    return Response.json(
      { error: "Admin login is not configured." },
      { status: 503 },
    );
  return getAuth().handler()[method](request, context);
}
export async function GET(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  return handle(request, "GET", context);
}
export async function POST(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  return handle(request, "POST", context);
}
