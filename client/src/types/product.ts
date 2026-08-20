export type Gender = "him" | "her" | "unisex";
export type Note = "fresh" | "woody" | "sweet" | "long-lasting";

export interface Product {
  id: string;
  slug: string;
  name: string;
  inspiredBy: string;
  size: string;
  price: number;
  gender: Gender;
  notes: Note[];
  longevity: string;
  howToUse: string;
  images: string[];
  bestSeller: boolean;
  description: string;
}

export interface CartItem {
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface OrderPayload {
  customer: CustomerDetails;
  items: {
    slug: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  deliveryFee: number;
  total: number;
  paymentMethod: string;
}

export interface SiteSettings {
  name: string;
  tagline: string;
  whatsapp: string;
  whatsappDisplay: string;
  email: string;
  phone: string;
  instagram: string;
  facebook: string;
  deliveryFee: number;
  address: string;
  heroVideo: string;
  heroPoster: string;
}

export interface Review {
  id: string;
  name: string;
  city: string;
  rating: number;
  text: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export interface SiteData {
  site: SiteSettings;
  reviews: Review[];
  faqs: Faq[];
}

export interface Order {
  id: string;
  customer: CustomerDetails;
  items: OrderPayload["items"];
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}
