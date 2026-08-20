import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrustStrip } from '../components/ui/TrustStrip';
import { useCart } from '../context/CartContext';
import { site } from '../data/site';
import { submitOrder } from '../lib/api';
import { formatPrice } from '../lib/format';
import { buildWhatsAppOrderUrl } from '../lib/whatsapp';
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
  const navigate = useNavigate();
  const [form, setForm] = useState<CustomerDetails>(empty);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const delivery = site.deliveryFee;
  const total = subtotal + delivery;

  if (!items.length) {
    return (
      <div className="pt-32 pb-20 container-page text-center">
        <h1 className="font-display text-5xl text-ivory mb-4">Checkout</h1>
        <p className="text-ivory-dim mb-8">Your cart is empty.</p>
        <Link to="/shop" className="btn-gold">
          Shop Fragrances
        </Link>
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

      const waUrl = buildWhatsAppOrderUrl(order.id, form, items, delivery, total);
      clearCart();
      window.open(waUrl, '_blank');
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
    <label className="block space-y-2">
      <span className="text-xs uppercase tracking-widest text-ivory-dim">{label}</span>
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
    <div className="pt-28 pb-20">
      <div className="container-page">
        <h1 className="font-display text-5xl text-ivory mb-10">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <form onSubmit={onSubmit} className="lg:col-span-3 space-y-5">
            {field('fullName', 'Full Name')}
            {field('phone', 'Phone Number', { type: 'tel' })}
            {field('email', 'Email', { type: 'email', required: false })}
            {field('address', 'Complete Address', { rows: 3 })}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {field('city', 'City')}
              {field('postalCode', 'Postal Code', { required: false })}
            </div>

            <fieldset className="border border-gold/40 bg-charcoal-soft p-5 space-y-2">
              <legend className="px-2 text-xs uppercase tracking-widest text-gold">
                Payment
              </legend>
              <label className="flex items-center gap-3 text-ivory">
                <input type="radio" checked readOnly className="accent-[var(--color-gold)]" />
                <span>
                  <strong className="text-gold">Cash on Delivery</strong>
                  <span className="block text-sm text-ivory-dim">
                    Pay when your fragrance arrives. Online payments coming soon.
                  </span>
                </span>
              </label>
            </fieldset>

            {error && <p className="text-red-300 text-sm">{error}</p>}

            <button type="submit" className="btn-gold w-full" disabled={submitting}>
              {submitting ? 'Placing Order...' : 'Place Order & Open WhatsApp'}
            </button>
            <p className="text-xs text-ivory-dim text-center">
              Your order is saved with us and a WhatsApp message opens so we can confirm it.
            </p>
          </form>

          <aside className="lg:col-span-2 space-y-6">
            <div className="border border-[var(--color-line)] bg-charcoal-soft p-6 space-y-4">
              <h2 className="font-display text-2xl text-ivory">Order Summary</h2>
              {items.map((item) => (
                <div key={item.slug} className="flex justify-between text-sm text-ivory-dim gap-4">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm text-ivory-dim border-t border-[var(--color-line)] pt-4">
                <span>Delivery</span>
                <span>{formatPrice(delivery)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Total</span>
                <span className="text-gold">{formatPrice(total)}</span>
              </div>
            </div>
            <TrustStrip compact />
          </aside>
        </div>
      </div>
    </div>
  );
}
