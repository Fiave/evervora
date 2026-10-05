import { z } from "zod";
const text = (min: number, max: number) => z.string().trim().min(min).max(max);
export const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: text(2, 120),
  description: text(5, 5000),
  categoryId: z.string().uuid(),
  featured: z.boolean(),
  published: z.boolean(),
  available: z.boolean(),
  images: z
    .array(
      z.object({
        fileId: text(1, 300),
        url: z.string().url(),
        position: z.number().int().min(0).max(4),
      }),
    )
    .min(1, "Add at least one product photo.")
    .max(5),
});
export const categorySchema = z.object({
  id: z.string().uuid().optional(),
  name: text(2, 60),
  position: z.number().int().min(0).max(999),
});
const socialUrl = z.union([
  z.literal(""),
  z
    .string()
    .url()
    .max(500)
    .refine((s) => s.startsWith("https://"), "Use an https:// link."),
]);
export const settingsSchema = z.object({
  whatsapp: z
    .string()
    .trim()
    .transform((s) => s.replace(/[\s()+-]/g, ""))
    .refine(
      (s) => s === "" || /^[1-9]\d{7,14}$/.test(s),
      "Use the full international number, for example +233…",
    ),
  instagram: socialUrl,
  facebook: socialUrl,
  tiktok: socialUrl,
  delivery: z.string().trim().max(500),
  contact: z.string().trim().max(300),
});
export function validationMessage(error: unknown) {
  return error instanceof z.ZodError
    ? (error.issues[0]?.message ?? "Check the form fields.")
    : "Unable to save. Please try again.";
}
