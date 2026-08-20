import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { site } from '../../data/site';

export function Hero() {
  return (
    <section className="relative min-h-[92svh] flex items-end md:items-center overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover scale-105"
        autoPlay
        muted
        loop
        playsInline
        poster={site.heroPoster}
      >
        <source src={site.heroVideo} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-charcoal/60" />

      <div className="relative container-page pb-16 pt-28 md:py-0 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <p className="section-label">Khan Scents</p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold text-ivory mb-5">
            {site.tagline}
          </h1>
          <p className="text-base md:text-lg text-ivory-dim max-w-md leading-relaxed mb-10 font-light">
            Premium fragrances inspired by iconic scents, crafted for those who want to leave an
            impression.
          </p>
          <Link to="/shop" className="btn-gold">
            Shop now
          </Link>
        </motion.div>
      </div>
    </section>
