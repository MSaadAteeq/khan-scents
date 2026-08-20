import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../lib/format';
import type { Product } from '../../types/product';
import { ProductImage } from './ProductImage';

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <article className="group card overflow-hidden flex flex-col">
      <Link
        to={`/product/${product.slug}`}
        className="relative block aspect-[4/5] bg-surface-muted overflow-hidden"
      >
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="p-5 flex flex-col flex-1 gap-1.5">
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-base font-semibold text-text group-hover:text-accent transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-text-muted">Inspired by {product.inspiredBy}</p>
        <p className="text-xs text-text-muted">{product.size}</p>
        <div className="mt-auto pt-4 flex items-center justify-between gap-3">
          <span className="text-base font-semibold text-text">{formatPrice(product.price)}</span>
          <button
            type="button"
            className="text-sm font-medium text-accent hover:text-text transition-colors"
            onClick={() => addItem(product)}
          >
            + Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
