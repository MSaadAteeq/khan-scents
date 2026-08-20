import { site } from '../data/site';
import type { CartItem, CustomerDetails } from '../types/product';
import { formatPrice } from './format';

export function whatsappChatUrl(message?: string): string {
  const text = encodeURIComponent(message || 'Hi Khan Scents!');
  return `https://wa.me/${site.whatsapp}?text=${text}`;
}

export function buildWhatsAppOrderUrl(
  orderId: string,
  customer: CustomerDetails,
  items: CartItem[],
  deliveryFee: number,
  total: number,
): string {
  const lines = [
    `*New Order — Khan Scents*`,
    `Order ID: ${orderId}`,
    ``,
    `*Customer*`,
    `Name: ${customer.fullName}`,
    `Phone: ${customer.phone}`,
    customer.email ? `Email: ${customer.email}` : null,
    `Address: ${customer.address}`,
    `City: ${customer.city}`,
    customer.postalCode ? `Postal: ${customer.postalCode}` : null,
    ``,
    `*Items*`,
    ...items.map(
      (i) => `• ${i.name} × ${i.quantity} — ${formatPrice(i.price * i.quantity)}`,
    ),
    ``,
    `Delivery: ${formatPrice(deliveryFee)}`,
    `*Total: ${formatPrice(total)}*`,
    `Payment: Cash on Delivery`,
  ].filter(Boolean);

  return whatsappChatUrl(lines.join('\n'));
}
