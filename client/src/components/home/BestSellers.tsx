import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { ProductCard } from '../ui/ProductCard';

export function BestSellers() {
  const { products, loading } = useProducts();
  const bestsellers = products.filter((p) => p.bestSeller).slice(0, 4);

  return (
    <section className="py-20 md:py-28 bg-bg">
      <div className="container-page">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <span className="section-label">Featured</span>
            <h2 className="section-title !mb-0">Best sellers</h2>
          </div>
          <Link to="/shop" className="text-sm font-medium text-accent hover:text-text transition-colors shrink-0">
            View all →
          </Link>
        </div>
        {loading ? (
          <p className="text-text-muted text-sm">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
