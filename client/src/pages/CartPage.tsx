import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSite } from '../context/SiteContext';
import { formatPrice } from '../lib/format';
import { ProductImage } from '../components/ui/ProductImage';

export function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const { site } = useSite();
  const delivery = site.deliveryFee;
  const total = subtotal + (items.length ? delivery : 0);

  if (!items.length) {
    return (
      <div className="pt-32 pb-20 container-page text-center bg-bg min-h-screen">
        <h1 className="text-3xl font-semibold text-text mb-3">Your cart</h1>
        <p className="text-text-muted mb-8">No fragrances yet.</p>
        <Link to="/shop" className="btn-primary">Shop now</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-bg min-h-screen">
      <div className="container-page">
        <h1 className="section-title">Your cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.slug} className="card p-4 flex gap-4">
                <Link to={`/product/${item.slug}`} className="w-20 h-24 shrink-0 overflow-hidden rounded-md bg-surface-muted">
                  <ProductImage src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-4">
                    <div>
                      <Link to={`/product/${item.slug}`} className="font-semibold text-text hover:text-accent">
                        {item.name}
                      </Link>
                      <p className="text-xs text-text-muted mt-1">{item.size}</p>
                    </div>
                    <p className="font-semibold text-text">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="flex items-center border border-border rounded-md overflow-hidden">
                      <button type="button" className="px-3 py-1 text-text-muted hover:text-text" onClick={() => updateQuantity(item.slug, item.quantity - 1)}>−</button>
                      <span className="px-3 text-sm">{item.quantity}</span>
                      <button type="button" className="px-3 py-1 text-text-muted hover:text-text" onClick={() => updateQuantity(item.slug, item.quantity + 1)}>+</button>
                    </div>
                    <button type="button" className="text-sm text-text-muted hover:text-text" onClick={() => removeItem(item.slug)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="card p-6 h-fit space-y-4">
            <h2 className="font-semibold text-text">Summary</h2>
            <div className="flex justify-between text-sm text-text-muted">
              <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-text-muted">
              <span>Delivery</span><span>{formatPrice(delivery)}</span>
            </div>
            <div className="flex justify-between font-semibold text-text border-t border-border pt-4">
              <span>Total</span><span>{formatPrice(total)}</span>
            </div>
            <Link to="/checkout" className="btn-primary w-full">Checkout</Link>
            <Link to="/shop" className="btn-outline w-full">Continue shopping</Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
