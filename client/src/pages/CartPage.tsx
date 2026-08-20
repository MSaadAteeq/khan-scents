import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { site } from '../data/site';
import { formatPrice } from '../lib/format';
import { ProductImage } from '../components/ui/ProductImage';

export function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const delivery = site.deliveryFee;
  const total = subtotal + (items.length ? delivery : 0);

  if (!items.length) {
    return (
      <div className="pt-32 pb-20 container-page text-center">
        <h1 className="font-display text-5xl text-ivory mb-4">Your Cart</h1>
        <p className="text-ivory-dim mb-8">No fragrances yet — find your signature scent.</p>
        <Link to="/shop" className="btn-gold">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20">
      <div className="container-page">
        <h1 className="font-display text-5xl text-ivory mb-10">Your Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div
                key={item.slug}
                className="flex gap-4 border-b border-[var(--color-line)] pb-6"
              >
                <Link to={`/product/${item.slug}`} className="w-24 h-32 shrink-0 overflow-hidden bg-charcoal-lift">
                  <ProductImage src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-4">
                    <div>
                      <Link
                        to={`/product/${item.slug}`}
                        className="font-display text-2xl text-ivory hover:text-gold"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-ivory-dim mt-1">{item.size}</p>
                    </div>
                    <p className="text-gold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center border border-[var(--color-line)]">
                      <button
                        type="button"
                        className="px-3 py-1.5 text-ivory-dim hover:text-gold"
                        onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="px-3 text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        className="px-3 py-1.5 text-ivory-dim hover:text-gold"
                        onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className="text-xs uppercase tracking-widest text-ivory-dim hover:text-gold"
                      onClick={() => removeItem(item.slug)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="border border-[var(--color-line)] bg-charcoal-soft p-6 h-fit space-y-4">
            <h2 className="font-display text-2xl text-ivory">Summary</h2>
            <div className="flex justify-between text-sm text-ivory-dim">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-ivory-dim">
              <span>Delivery</span>
              <span>{formatPrice(delivery)}</span>
            </div>
            <div className="flex justify-between text-lg border-t border-[var(--color-line)] pt-4">
              <span>Total</span>
              <span className="text-gold">{formatPrice(total)}</span>
            </div>
            <Link to="/checkout" className="btn-gold w-full">
              Checkout
            </Link>
            <Link to="/shop" className="btn-outline w-full">
              Continue Shopping
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
