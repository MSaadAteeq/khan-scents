import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { ProductCard } from '../ui/ProductCard';

export function BestSellers() {
  const { products, loading } = useProducts();
  const bestsellers = products.filter((p) => p.bestSeller).slice(0, 4);

  return (
    <section className="py-24 md:py-32">
      <div className="container-page">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
          <div>
            <p className="section-label">Featured</p>
            <h2 className="font-display text-4xl md:text-5xl text-ivory italic">Best sellers</h2>
          </div>
          <Link to="/shop" className="text-sm text-ivory-dim hover:text-ivory transition-colors">
            View all →
          </Link>
        </div>
        {loading ? (
          <p className="text-ivory-dim text-sm">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
