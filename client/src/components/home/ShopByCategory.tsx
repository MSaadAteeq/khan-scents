import { Link } from 'react-router-dom';
import { categoryImages } from '../../data/images';
import { ProductImage } from '../ui/ProductImage';

const categories = [
  { label: 'For him', to: '/shop?gender=him', image: categoryImages.him },
  { label: 'For her', to: '/shop?gender=her', image: categoryImages.her },
  { label: 'Unisex', to: '/shop?gender=unisex', image: categoryImages.unisex },
];

export function ShopByCategory() {
  return (
    <section className="py-24 md:py-32 border-t border-[var(--color-line)]">
      <div className="container-page">
        <p className="section-label">Categories</p>
        <h2 className="font-display text-4xl md:text-5xl text-ivory mb-14 italic">Shop by mood</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              to={cat.to}
              className="relative group aspect-[4/5] overflow-hidden rounded-sm"
            >
              <ProductImage
                src={cat.image}
                alt={cat.label}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-charcoal/40 group-hover:bg-charcoal/30 transition" />
              <div className="absolute inset-0 flex items-end p-7">
                <span className="font-display text-2xl md:text-3xl text-ivory italic">{cat.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
