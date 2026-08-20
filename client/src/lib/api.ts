import { apiUrl } from './config';
import type { Order, OrderPayload, Product, Review, SiteData, SiteSettings } from '../types/product';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone: string;
}

const TOKEN_KEY = 'khan-auth-token';

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

/** @deprecated use getAuthToken */
export const getAdminToken = getAuthToken;
/** @deprecated use setAuthToken */
export const setAdminToken = setAuthToken;

function authHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function authFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(apiUrl(path), {
    ...options,
    headers: { ...authHeaders(), ...options.headers },
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
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to place order');
  }
  return res.json();
}

export async function fetchMyOrders(): Promise<Order[]> {
  return authFetch('/api/orders/mine') as Promise<Order[]>;
}

// ——— Auth ———

export async function login(email: string, password: string) {
  return authFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }) as Promise<{ token: string; user: AuthUser }>;
}

export async function register(name: string, email: string, password: string, phone?: string) {
  return authFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, phone }),
  }) as Promise<{ token: string; user: AuthUser }>;
}

export async function fetchMe() {
  return authFetch('/api/auth/me') as Promise<{ user: AuthUser }>;
}

// ——— Admin ———

export async function adminGetProducts() {
  return authFetch('/api/admin/products') as Promise<Product[]>;
}

export async function adminCreateProduct(product: Partial<Product>) {
  return authFetch('/api/admin/products', {
    method: 'POST',
    body: JSON.stringify(product),
  }) as Promise<Product>;
}

export async function adminUpdateProduct(id: string, product: Partial<Product>) {
  return authFetch(`/api/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  }) as Promise<Product>;
}

export async function adminDeleteProduct(id: string) {
  return authFetch(`/api/admin/products/${id}`, { method: 'DELETE' });
}

export async function adminGetSite() {
  return authFetch('/api/admin/site') as Promise<SiteData>;
}

export async function adminUpdateSite(site: Partial<SiteSettings>) {
  return authFetch('/api/admin/site', {
    method: 'PUT',
    body: JSON.stringify({ site }),
  }) as Promise<SiteData>;
}

export async function adminCreateReview(review: Omit<Review, 'id'>) {
  return authFetch('/api/admin/reviews', {
    method: 'POST',
    body: JSON.stringify(review),
  }) as Promise<Review>;
}

export async function adminUpdateReview(id: string, review: Partial<Review>) {
  return authFetch(`/api/admin/reviews/${id}`, {
    method: 'PUT',
    body: JSON.stringify(review),
  }) as Promise<Review>;
}

export async function adminDeleteReview(id: string) {
  return authFetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
}

export async function adminCreateFaq(faq: { question: string; answer: string }) {
  return authFetch('/api/admin/faqs', {
    method: 'POST',
    body: JSON.stringify(faq),
  });
}

export async function adminUpdateFaq(id: string, faq: { question: string; answer: string }) {
  return authFetch(`/api/admin/faqs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(faq),
  });
}

export async function adminDeleteFaq(id: string) {
  return authFetch(`/api/admin/faqs/${id}`, { method: 'DELETE' });
}

export async function adminGetOrders() {
  return authFetch('/api/admin/orders') as Promise<Order[]>;
}

export async function adminUpdateOrderStatus(id: string, status: string) {
  return authFetch(`/api/admin/orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }) as Promise<Order>;
}
