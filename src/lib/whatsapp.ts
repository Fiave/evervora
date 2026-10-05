export const enquiryMessages = ["Is this available?", "I’d like to buy this", "Do you offer delivery?"] as const;
export function whatsappLink(number: string, name?: string, url?: string, enquiry: string = enquiryMessages[0]) {
 const phone = number.replace(/[\s()+-]/g, "");
 if (!/^[1-9]\d{7,14}$/.test(phone)) return null;
 const message = name ? `Hi Evervora! ${enquiry}\nProduct: ${name}${url ? `\n${url}` : ""}` : "Hi Evervora! I’d like to ask about your products.";
 return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
export function slugify(text: string) { return text.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
