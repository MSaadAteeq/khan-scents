import { apiUrl } from './config';
import type { Order, OrderPayload, Product, Review, SiteData, SiteSettings } from '../types/product';

const TOKEN_KEY = 'khan-admin-token';

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

function adminHeaders(): HeadersInit {
  const token = getAdminToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function adminFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(apiUrl(path), {
    ...options,
    headers: { ...adminHeaders(), ...options.headers },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

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

export async function fetchSiteData(): Promise<SiteData> {
  const res = await fetch(apiUrl('/api/site'));
  if (!res.ok) throw new Error('Failed to load site data');
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

// ——— Admin ———

export async function adminLogin(username: string, password: string) {
  return adminFetch('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  }) as Promise<{ token: string; username: string }>;
}

export async function adminMe() {
  return adminFetch('/api/admin/me') as Promise<{ username: string; role: string }>;
}

export async function adminGetProducts() {
  return adminFetch('/api/admin/products') as Promise<Product[]>;
}

export async function adminCreateProduct(product: Partial<Product>) {
  return adminFetch('/api/admin/products', {
    method: 'POST',
    body: JSON.stringify(product),
  }) as Promise<Product>;
}

export async function adminUpdateProduct(id: string, product: Partial<Product>) {
  return adminFetch(`/api/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  }) as Promise<Product>;
}

export async function adminDeleteProduct(id: string) {
  return adminFetch(`/api/admin/products/${id}`, { method: 'DELETE' });
}

export async function adminGetSite() {
  return adminFetch('/api/admin/site') as Promise<SiteData>;
}

export async function adminUpdateSite(site: Partial<SiteSettings>) {
  return adminFetch('/api/admin/site', {
    method: 'PUT',
    body: JSON.stringify({ site }),
  }) as Promise<SiteData>;
}

export async function adminCreateReview(review: Omit<Review, 'id'>) {
  return adminFetch('/api/admin/reviews', {
    method: 'POST',
    body: JSON.stringify(review),
  }) as Promise<Review>;
}

export async function adminUpdateReview(id: string, review: Partial<Review>) {
  return adminFetch(`/api/admin/reviews/${id}`, {
    method: 'PUT',
    body: JSON.stringify(review),
  }) as Promise<Review>;
}

export async function adminDeleteReview(id: string) {
  return adminFetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
}

export async function adminCreateFaq(faq: { question: string; answer: string }) {
  return adminFetch('/api/admin/faqs', {
    method: 'POST',
    body: JSON.stringify(faq),
  });
}

export async function adminUpdateFaq(id: string, faq: { question: string; answer: string }) {
  return adminFetch(`/api/admin/faqs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(faq),
  });
}

export async function adminDeleteFaq(id: string) {
  return adminFetch(`/api/admin/faqs/${id}`, { method: 'DELETE' });
}

export async function adminGetOrders() {
  return adminFetch('/api/admin/orders') as Promise<Order[]>;
}

export async function adminUpdateOrderStatus(id: string, status: string) {
  return adminFetch(`/api/admin/orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }) as Promise<Order>;
}
