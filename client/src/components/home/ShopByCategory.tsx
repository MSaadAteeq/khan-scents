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
    <section className="py-20 md:py-28 bg-bg">
      <div className="container-page">
        <span className="section-label">Browse</span>
        <h2 className="section-title">Shop by category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              to={cat.to}
              className="relative group aspect-[3/4] overflow-hidden rounded-xl"
            >
              <ProductImage
                src={cat.image}
                alt={cat.label}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-dark/30 group-hover:bg-dark/20 transition" />
              <div className="absolute inset-0 flex items-end p-6">
                <span className="text-xl font-semibold text-white">{cat.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
