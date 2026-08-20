import { Link } from 'react-router-dom';
import { aboutBackground } from '../../data/images';

export function AboutTeaser() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${aboutBackground}')` }}
      />
      <div className="absolute inset-0 bg-charcoal/80" />
      <div className="relative container-page max-w-3xl">
        <p className="text-xs uppercase tracking-widest-plus text-gold mb-3">Our story</p>
        <h2 className="font-display text-4xl md:text-5xl text-ivory mb-6">About Khan Scents</h2>
        <p className="text-ivory-dim text-lg leading-relaxed mb-8">
          Khan Scents was created with a simple idea — premium fragrances shouldn't have to come
          with a premium price tag. We bring carefully crafted, luxury-inspired fragrances to
          customers across Pakistan.
        </p>
        <Link to="/about" className="btn-outline">
          Read Our Story
        </Link>
      </div>
    </section>
  );
}
