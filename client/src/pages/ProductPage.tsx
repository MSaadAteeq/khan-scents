import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { TrustStrip } from '../components/ui/TrustStrip';
import { ProductImage } from '../components/ui/ProductImage';
import { useCart } from '../context/CartContext';
import { useProduct } from '../hooks/useProducts';
import { formatPrice, genderLabel } from '../lib/format';

export function ProductPage() {
  const { slug } = useParams();
  const { product, loading, error } = useProduct(slug);
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);

  if (loading) {
    return (
      <div className="pt-32 pb-20 container-page text-ivory-dim">Loading fragrance...</div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-32 pb-20 container-page text-center">
        <h1 className="font-display text-4xl text-ivory mb-4">Fragrance not found</h1>
        <Link to="/shop" className="btn-gold">
          Back to Shop
        </Link>
      </div>
    );
  }

  const image = product.images[activeImage] || product.images[0];

  const handleAdd = () => addItem(product);
  const handleBuyNow = () => {
    addItem(product);
    navigate('/checkout');
  };

  return (
    <div className="pt-28 pb-20">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <div className="aspect-[3/4] overflow-hidden bg-charcoal-lift mb-3">
              <ProductImage src={image} alt={product.name} className="h-full w-full object-cover" loading="eager" />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-24 overflow-hidden border ${
                      i === activeImage ? 'border-gold' : 'border-transparent opacity-70'
                    }`}
                  >
                    <ProductImage src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-gold mb-3">
              Inspired by {product.inspiredBy}
            </p>
            <h1 className="font-display text-5xl md:text-6xl text-ivory mb-4">{product.name}</h1>
            <p className="text-2xl text-gold mb-6">{formatPrice(product.price)}</p>
            <p className="text-ivory-dim leading-relaxed mb-8">{product.description}</p>

            <dl className="grid grid-cols-2 gap-4 mb-8 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-widest text-ivory-dim mb-1">Size</dt>
                <dd className="text-ivory">{product.size}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-ivory-dim mb-1">Longevity</dt>
                <dd className="text-ivory">{product.longevity}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-ivory-dim mb-1">Gender</dt>
                <dd className="text-ivory">{genderLabel(product.gender)}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-ivory-dim mb-1">Notes</dt>
                <dd className="text-ivory capitalize">{product.notes.join(', ')}</dd>
              </div>
            </dl>

            <div className="mb-8">
              <h2 className="text-xs uppercase tracking-widest text-ivory-dim mb-2">How to use</h2>
              <p className="text-ivory-dim leading-relaxed">{product.howToUse}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button type="button" className="btn-gold flex-1" onClick={handleAdd}>
                Add to Cart
              </button>
              <button type="button" className="btn-outline flex-1" onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>

            <TrustStrip />

            <div className="mt-6 space-y-2 text-sm text-ivory-dim border border-[var(--color-line)] p-4">
              <p>🚚 Nationwide Delivery — PKR 300</p>
              <p>💵 Cash on Delivery Available</p>
              <p>📦 Dispatch within 1–2 Working Days</p>
              <p>🔄 Exchange Available for Damaged/Wrong Products</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
