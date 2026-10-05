import { createHmac, randomUUID } from "node:crypto";
import { requireAdmin } from "@/lib/auth";
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (
    !origin ||
    origin !==
      new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
        .origin
  )
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  try {
    await requireAdmin();
  } catch {
    return Response.json(
      { error: "Sign in as the shop owner to upload photos." },
      { status: 401 },
    );
  }
  const key = process.env.IMAGEKIT_PRIVATE_KEY,
    publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  if (!key || !publicKey)
    return Response.json(
      { error: "ImageKit has not been configured." },
      { status: 503 },
    );
  const token = randomUUID(),
    expire = Math.floor(Date.now() / 1000) + 60;
  const signature = createHmac("sha1", key)
    .update(token + expire)
    .digest("hex");
  return Response.json(
    { token, expire, signature, publicKey },
    { headers: { "Cache-Control": "no-store" } },
  );
}
