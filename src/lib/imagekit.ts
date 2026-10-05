import "server-only";
export async function removeImage(fileId: string) {
  if (!process.env.IMAGEKIT_PRIVATE_KEY || fileId.startsWith("demo-")) return;
  const result = await fetch(
    `https://api.imagekit.io/v1/files/${encodeURIComponent(fileId)}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${Buffer.from(process.env.IMAGEKIT_PRIVATE_KEY + ":").toString("base64")}`,
      },
    },
  );
  if (!result.ok && result.status !== 404)
    console.error("Image cleanup failed", result.status);
}
export function validImageUrl(url: string) {
  const endpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT?.replace(
    /\/$/,
    "",
  );
  return Boolean(endpoint && url.startsWith(endpoint + "/"));
}
