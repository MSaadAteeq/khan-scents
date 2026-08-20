import { Link } from 'react-router-dom';
import { aboutBackground } from '../../data/images';

export function AboutTeaser() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${aboutBackground}')` }}
      />
      <div className="absolute inset-0 bg-dark/75" />
      <div className="relative container-page max-w-lg">
        <span className="text-white/60 text-xs font-medium uppercase tracking-wider mb-3 block">Our story</span>
        <h2 className="text-3xl md:text-4xl font-semibold text-white mb-5">About Khan Scents</h2>
        <p className="text-white/75 leading-relaxed mb-8 text-sm md:text-base">
          Khan Scents was created with a simple idea — premium fragrances shouldn't have to come
          with a premium price tag. We bring carefully crafted, luxury-inspired fragrances to
          customers across Pakistan.
        </p>
        <Link to="/about" className="btn-primary !bg-white !text-text hover:!bg-white/90">
          Read our story
        </Link>
      </div>
    </section>
  );
}
