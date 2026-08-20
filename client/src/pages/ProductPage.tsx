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
    return <div className="pt-32 pb-20 container-page text-text-muted">Loading...</div>;
  }

  if (error || !product) {
    return (
      <div className="pt-32 pb-20 container-page text-center bg-bg min-h-screen">
        <h1 className="text-2xl font-semibold text-text mb-4">Fragrance not found</h1>
        <Link to="/shop" className="btn-primary">Back to shop</Link>
      </div>
    );
  }

  const image = product.images[activeImage] || product.images[0];

  return (
    <div className="pt-24 pb-20 bg-bg min-h-screen">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <div className="aspect-[4/5] overflow-hidden rounded-xl bg-surface-muted mb-3">
              <ProductImage src={image} alt={product.name} className="h-full w-full object-cover" loading="eager" />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-20 overflow-hidden rounded-md border-2 ${
                      i === activeImage ? 'border-text' : 'border-transparent opacity-60'
                    }`}
                  >
                    <ProductImage src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-sm text-accent font-medium mb-2">Inspired by {product.inspiredBy}</p>
            <h1 className="text-3xl md:text-4xl font-semibold text-text mb-3">{product.name}</h1>
            <p className="text-2xl font-semibold text-text mb-6">{formatPrice(product.price)}</p>
            <p className="text-text-muted leading-relaxed mb-8">{product.description}</p>

            <dl className="grid grid-cols-2 gap-4 mb-8 text-sm card p-5">
              <div>
                <dt className="text-text-muted mb-1">Size</dt>
                <dd className="font-medium text-text">{product.size}</dd>
              </div>
              <div>
                <dt className="text-text-muted mb-1">Longevity</dt>
                <dd className="font-medium text-text">{product.longevity}</dd>
              </div>
              <div>
                <dt className="text-text-muted mb-1">Gender</dt>
                <dd className="font-medium text-text">{genderLabel(product.gender)}</dd>
              </div>
              <div>
                <dt className="text-text-muted mb-1">Notes</dt>
                <dd className="font-medium text-text capitalize">{product.notes.join(', ')}</dd>
              </div>
            </dl>

            <div className="mb-8">
              <h2 className="text-sm font-medium text-text mb-2">How to use</h2>
              <p className="text-sm text-text-muted leading-relaxed">{product.howToUse}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button type="button" className="btn-primary flex-1" onClick={() => addItem(product)}>
                Add to cart
              </button>
              <button
                type="button"
                className="btn-outline flex-1"
                onClick={() => { addItem(product); navigate('/checkout'); }}
              >
                Buy now
              </button>
            </div>

            <TrustStrip compact />

            <div className="mt-6 card p-5 space-y-2 text-sm text-text-muted">
              <p>🚚 Nationwide delivery — PKR 300</p>
              <p>💵 Cash on delivery available</p>
              <p>📦 Dispatch within 1–2 working days</p>
              <p>🔄 Exchange for damaged/wrong products</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
