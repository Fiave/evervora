export type Category = { id: string; name: string; slug: string; position: number };
export type ProductImage = { fileId: string; url: string; position: number };
export type Product = { id: string; slug: string; name: string; description: string; categoryId: string; featured: boolean; published: boolean; available: boolean; images: ProductImage[]; createdAt: string };
export type ShopSettings = { whatsapp: string; instagram: string; facebook: string; tiktok: string; delivery: string; contact: string };
export type ShopData = { products: Product[]; categories: Category[]; settings: ShopSettings; demo: boolean };
export type ActionResult = { error?: string; success?: string; id?: string };
