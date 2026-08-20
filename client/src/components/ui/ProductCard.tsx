import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../lib/format';
import type { Product } from '../../types/product';
import { ProductImage } from './ProductImage';

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <article className="group flex flex-col">
      <Link
        to={`/product/${product.slug}`}
        className="relative block overflow-hidden aspect-[3/4] bg-charcoal-lift rounded-sm mb-4"
      >
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
        />
      </Link>
      <div className="flex flex-col flex-1 gap-1">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-display text-xl text-ivory group-hover:text-gold-soft transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-ivory-dim">Inspired by {product.inspiredBy}</p>
        <p className="text-xs text-ivory-dim mt-0.5">{product.size}</p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-sm text-ivory">{formatPrice(product.price)}</span>
          <button
            type="button"
            className="text-xs text-ivory-dim hover:text-ivory transition-colors underline-offset-4 hover:underline"
            onClick={() => addItem(product)}
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
