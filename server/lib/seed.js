import { readJson, writeJson, dataPath } from "./jsonStore.js";
import fs from "fs";
import { products as seedProducts } from "../data/products.js";
import { productImages, imageFallback } from "../data/images.js";

const DEFAULT_SITE = {
  site: {
    name: "Khan Scents",
    tagline: "Find Your Signature Scent",
    whatsapp: "923482232129",
    whatsappDisplay: "+92 348 2232129",
    email: "saadateeq456@gmail.com",
    phone: "+92 348 2232129",
    instagram: "https://instagram.com/khanscents",
    facebook: "https://facebook.com/khanscents",
    deliveryFee: 300,
    address: "Pakistan — Nationwide Delivery",
    heroVideo: "https://assets.mixkit.co/videos/48729/48729-720.mp4",
    heroPoster: "/images/hero-poster.jpg",
  },
  faqs: [
    {
      id: "faq-1",
      question: "How long does delivery take?",
      answer:
        "Orders are dispatched within 1–2 working days and typically arrive within 3–5 working days depending on your city.",
    },
    {
      id: "faq-2",
      question: "Do you offer Cash on Delivery?",
      answer:
        "Yes. Cash on Delivery (COD) is available nationwide on every order, so you only pay when your fragrance arrives.",
    },
    {
      id: "faq-3",
      question: "Where do you deliver?",
      answer:
        "We deliver across all major cities and towns in Pakistan for a flat rate of PKR 300.",
    },
    {
      id: "faq-4",
      question: "What size bottles do you offer?",
      answer:
        "Every Khan Scents fragrance comes in a 50 mL / 1.7 FL. OZ. bottle, designed for everyday carry and long-term use.",
    },
    {
      id: "faq-5",
      question: "Are your perfumes original or inspired fragrances?",
      answer:
        "Our fragrances are luxury-inspired compositions, carefully developed to capture the character of iconic scents at a fraction of the price.",
    },
    {
      id: "faq-6",
      question: "Can I return or exchange my perfume?",
      answer:
        "Yes, we offer exchanges for damaged or incorrect products. Please contact us within 48 hours of delivery with your order details.",
    },
    {
      id: "faq-7",
      question: "How should I store my perfume?",
      answer:
        "Keep your bottle away from direct sunlight and extreme heat. Store it upright in a cool, dry place to preserve the fragrance.",
    },
    {
      id: "faq-8",
      question: "How can I contact you?",
      answer:
        "Reach us anytime on WhatsApp or by email — our team typically responds within a few hours.",
    },
  ],
  reviews: [
    {
      id: "rev-1",
      name: "Ayesha K.",
      city: "Lahore",
      rating: 5,
      text: "Velvet Noir smells incredibly close to the original and lasts all evening. Packaging felt premium too.",
    },
    {
      id: "rev-2",
      name: "Bilal R.",
      city: "Karachi",
      rating: 5,
      text: "Ordered Blue Intense — compliments everywhere I go. COD made it an easy first order.",
    },
    {
      id: "rev-3",
      name: "Sana M.",
      city: "Islamabad",
      rating: 4,
      text: "Rose Absolu is gorgeous, soft and elegant. Delivery took 3 days, well packed and safe.",
    },
    {
      id: "rev-4",
      name: "Hamza T.",
      city: "Faisalabad",
      rating: 5,
      text: "Amber Dusk has incredible longevity — genuinely lasted over 10 hours. Will be reordering.",
    },
    {
      id: "rev-5",
      name: "Zara N.",
      city: "Multan",
      rating: 5,
      text: "Best value for luxury-inspired scents in Pakistan. Soft Petal is now my everyday signature.",
    },
  ],
};

function mergeProductImages(product) {
  return {
    ...product,
    images: productImages[product.slug] ?? product.images ?? [imageFallback, imageFallback],
  };
}

export function ensureDataFiles() {
  if (!fs.existsSync(dataPath("products.json"))) {
    const products = seedProducts.map(mergeProductImages);
    writeJson("products.json", products);
  }

  if (!fs.existsSync(dataPath("site.json"))) {
    writeJson("site.json", DEFAULT_SITE);
  }

  if (!fs.existsSync(dataPath("orders.json"))) {
    writeJson("orders.json", []);
  }
}

export function getProducts() {
  ensureDataFiles();
  return readJson("products.json", []);
}

export function saveProducts(products) {
  writeJson("products.json", products);
}

export function getSiteData() {
  ensureDataFiles();
  return readJson("site.json", DEFAULT_SITE);
}

export function saveSiteData(data) {
  writeJson("site.json", data);
}

export function getOrders() {
  ensureDataFiles();
  return readJson("orders.json", []);
}

export function saveOrders(orders) {
  writeJson("orders.json", orders);
}

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function nextId(items, prefix = "item") {
  const nums = items
    .map((item) => item.id)
    .filter(Boolean)
    .map((id) => {
      const match = String(id).match(/(\d+)$/);
      return match ? Number(match[1]) : 0;
    });
  const max = nums.length ? Math.max(...nums) : 0;
  return `${prefix}-${max + 1}`;
}
