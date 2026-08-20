import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { site } from '../../data/site';
import { assetUrl } from '../../lib/assets';

export function Hero() {
  const [videoFailed, setVideoFailed] = useState(false);
  const poster = assetUrl(site.heroPoster);

  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-dark text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${poster}')` }}
        aria-hidden
      />
      {!videoFailed && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={poster}
          onError={() => setVideoFailed(true)}
        >
          <source src={site.heroVideo} type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />

      <div className="relative container-page w-full pt-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl"
        >
          <p className="font-sans text-white text-sm font-medium tracking-[0.2em] uppercase mb-4">
            Khan Scents
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-semibold text-white leading-tight mb-5">
            {site.tagline}
          </h1>
          <p className="font-sans text-base md:text-lg text-white/90 leading-relaxed mb-8 max-w-md">
            Premium fragrances inspired by iconic scents. Crafted for those who leave an
            impression.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/shop" className="btn-primary !bg-white !text-text hover:!bg-white/90">
              Shop now
            </Link>
            <Link to="/about" className="btn-outline-light">
              Our story
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
