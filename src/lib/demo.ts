import type { Category, Product, ShopSettings } from "./types";
export const defaultCategories: Category[] = [
  {
    id: "10000000-0000-4000-8000-000000000001",
    name: "Fashion",
    slug: "fashion",
    position: 0,
  },
  {
    id: "10000000-0000-4000-8000-000000000002",
    name: "Electronics",
    slug: "electronics",
    position: 1,
  },
  {
    id: "10000000-0000-4000-8000-000000000003",
    name: "Phone Accessories",
    slug: "phone-accessories",
    position: 2,
  },
  {
    id: "10000000-0000-4000-8000-000000000004",
    name: "Everyday Essentials",
    slug: "everyday-essentials",
    position: 3,
  },
];
export const defaultSettings: ShopSettings = {
  whatsapp: "+233208987183",
  instagram: "",
  facebook: "",
  tiktok: "",
  delivery: "",
  contact: "",
};
const samples = [
  [
    "Wireless headphones",
    "headphones",
    1,
    "Your everyday soundtrack, without the wires. A comfortable over-ear style for music, calls and a little quiet time. Ask us about available colours and specifications.",
  ],
  [
    "Everyday sneakers",
    "sneakers",
    0,
    "An easy addition to your everyday wardrobe. Ask us about available sizes, colours and current stock before ordering.",
  ],
  [
    "Classic wristwatch",
    "watch",
    0,
    "A simple finishing touch for workdays and weekends. Message us to confirm the available styles and colours.",
  ],
  [
    "Everyday backpack",
    "bag",
    3,
    "Keep your daily essentials together with a practical backpack.",
  ],
  [
    "Wireless speaker",
    "speaker",
    1,
    "Take your favourite music along. Message us for the available models, battery specifications and colours.",
  ],
  [
    "Statement sunglasses",
    "sunglasses",
    0,
    "A fresh accessory for your everyday outfits. Ask us about the available frames and colours.",
  ],
  [
    "Phone essentials",
    "phone",
    2,
    "Find accessories for your phone. Tell us your phone model on WhatsApp so we can help you choose a compatible option.",
  ],
  [
    "Reusable water bottle",
    "bottle",
    3,
    "A handy bottle for your desk, bag or daily routine. Ask us about available sizes and colours.",
  ],
] as const;
export const demoProducts: Product[] = samples.map(
  ([name, image, category, description], index) => ({
    id: `20000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
    slug: image,
    name,
    description,
    categoryId: defaultCategories[category].id,
    featured: index < 4,
    published: true,
    available: index !== 5,
    images: [
      { fileId: `demo-${image}`, url: `/products/${image}.jpg`, position: 0 },
    ],
    createdAt: new Date(Date.UTC(2026, 9, 5, 0, 0, 8 - index)).toISOString(),
  }),
);
