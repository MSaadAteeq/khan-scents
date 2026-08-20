import { site } from '../../data/site';
import { instagramImages } from '../../data/images';
import { ProductImage } from '../ui/ProductImage';

export function Instagram() {
  return (
    <section className="py-20 md:py-28 bg-surface">
      <div className="container-page">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <span className="section-label">Social</span>
            <h2 className="section-title !mb-0">Follow us</h2>
          </div>
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-accent hover:text-text transition-colors"
          >
            @khanscents →
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {instagramImages.map((src, i) => (
            <a
              key={src}
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              className="aspect-square overflow-hidden rounded-lg group"
            >
              <ProductImage
                src={src}
                alt={`Instagram ${i + 1}`}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
