import { Link } from 'react-router-dom';
import { aboutBackground } from '../../data/images';
import { assetUrl } from '../../lib/assets';

export function AboutTeaser() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${assetUrl(aboutBackground)}')` }}
      />
      <div className="absolute inset-0 bg-dark/75" />
      <div className="relative container-page max-w-lg">
        <span className="text-white/70 text-xs font-sans font-medium uppercase tracking-wider mb-4 block">Our story</span>
        <h2 className="font-heading text-3xl md:text-4xl font-semibold text-white mb-8">About Khan Scents</h2>
        <p className="font-sans text-white/85 leading-relaxed mb-10 text-sm md:text-base">
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
