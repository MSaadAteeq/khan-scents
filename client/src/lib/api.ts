import { apiUrl } from './config';
import type { OrderPayload, Product } from '../types/product';

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(apiUrl('/api/products'));
  if (!res.ok) throw new Error('Failed to load products');
  return res.json();
}

export async function fetchProduct(slug: string): Promise<Product> {
  const res = await fetch(apiUrl(`/api/products/${slug}`));
  if (!res.ok) throw new Error('Product not found');
  return res.json();
}

export async function submitOrder(payload: OrderPayload): Promise<{ id: string }> {
  const res = await fetch(apiUrl('/api/orders'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to place order');
  }
  return res.json();
}
