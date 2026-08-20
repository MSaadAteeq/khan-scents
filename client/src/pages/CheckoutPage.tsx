import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrustStrip } from '../components/ui/TrustStrip';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useSite } from '../context/SiteContext';
import { submitOrder } from '../lib/api';
import { formatPrice } from '../lib/format';
import type { CustomerDetails } from '../types/product';

const empty: CustomerDetails = {
  fullName: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  postalCode: '',
};

export function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { site } = useSite();
  const navigate = useNavigate();
  const [form, setForm] = useState<CustomerDetails>(empty);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        fullName: f.fullName || user.name,
        email: f.email || user.email,
        phone: f.phone || user.phone || f.phone,
      }));
    }
  }, [user]);

  const delivery = site.deliveryFee;
  const total = subtotal + delivery;

  if (!items.length) {
    return (
      <div className="pt-32 pb-20 container-page text-center bg-bg min-h-screen">
        <h1 className="text-3xl font-semibold text-text mb-3">Checkout</h1>
        <p className="text-text-muted mb-8">Your cart is empty.</p>
        <Link to="/shop" className="btn-primary">Shop fragrances</Link>
      </div>
    );
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const order = await submitOrder({
        customer: form,
        items: items.map((i) => ({
          slug: i.slug,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
        deliveryFee: delivery,
        total,
        paymentMethod: 'Cash on Delivery',
      });

      clearCart();
      navigate('/checkout/success', { state: { orderId: order.id } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const field = (
    name: keyof CustomerDetails,
    label: string,
    opts?: { required?: boolean; type?: string; rows?: number },
  ) => (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-text">{label}</span>
      {opts?.rows ? (
        <textarea
          required={opts.required !== false}
          rows={opts.rows}
          value={form[name]}
          onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
          className="w-full px-4 py-3 text-sm resize-y"
        />
      ) : (
        <input
          required={opts?.required !== false}
          type={opts?.type || 'text'}
          value={form[name]}
          onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
          className="w-full px-4 py-3 text-sm"
        />
      )}
    </label>
  );

  return (
    <div className="pt-24 pb-20 bg-bg min-h-screen">
      <div className="container-page">
        <h1 className="section-title">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <form onSubmit={onSubmit} className="lg:col-span-3 space-y-5">
            {field('fullName', 'Full Name')}
            {field('phone', 'Phone Number', { type: 'tel' })}
            {field('email', 'Email', { type: 'email' })}
            {field('address', 'Complete Address', { rows: 3 })}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {field('city', 'City')}
              {field('postalCode', 'Postal Code', { required: false })}
            </div>

            <fieldset className="card p-5 space-y-2">
              <legend className="text-sm font-medium text-text px-1">Payment</legend>
              <label className="flex items-center gap-3 text-text">
                <input type="radio" checked readOnly className="accent-text" />
                <span>
                  <strong className="text-text">Cash on delivery</strong>
                  <span className="block text-sm text-text-muted">
                    Pay when your fragrance arrives.
                  </span>
                </span>
              </label>
            </fieldset>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button type="submit" className="btn-primary w-full" disabled={submitting}>
              {submitting ? 'Placing order...' : 'Place order'}
            </button>
            <p className="text-xs text-text-muted text-center">
              You will receive an email confirmation and updates about your order.
            </p>
          </form>

          <aside className="lg:col-span-2 space-y-6">
            <div className="card p-6 space-y-4">
              <h2 className="font-semibold text-text">Order summary</h2>
              {items.map((item) => (
                <div key={item.slug} className="flex justify-between text-sm text-text-muted gap-4">
                  <span>{item.name} × {item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm text-text-muted border-t border-border pt-4">
                <span>Delivery</span>
                <span>{formatPrice(delivery)}</span>
              </div>
              <div className="flex justify-between font-semibold text-text">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <TrustStrip compact />
          </aside>
        </div>
      </div>
    </div>
  );
}
