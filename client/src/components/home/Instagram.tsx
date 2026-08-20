import { site } from '../../data/site';
import { instagramImages } from '../../data/images';
import { ProductImage } from '../ui/ProductImage';

export function Instagram() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-page">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs uppercase tracking-widest-plus text-gold mb-3">Follow along</p>
            <h2 className="font-display text-4xl md:text-5xl text-ivory">Instagram</h2>
          </div>
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            className="text-xs uppercase tracking-widest text-ivory-dim hover:text-gold"
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
              className="aspect-square overflow-hidden group"
            >
              <ProductImage
                src={src}
                alt={`Khan Scents Instagram placeholder ${i + 1}`}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
