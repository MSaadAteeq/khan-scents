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
