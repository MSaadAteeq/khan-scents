import { AboutTeaser } from '../components/home/AboutTeaser';
import { BestSellers } from '../components/home/BestSellers';
import { FAQ } from '../components/home/FAQ';
import { Hero } from '../components/home/Hero';
import { Instagram } from '../components/home/Instagram';
import { Reviews } from '../components/home/Reviews';
import { ShopByCategory } from '../components/home/ShopByCategory';
import { WhyKhanScents } from '../components/home/WhyKhanScents';

export function HomePage() {
  return (
    <>
      <Hero />
      <BestSellers />
      <WhyKhanScents />
      <ShopByCategory />
      <Reviews />
      <AboutTeaser />
      <Instagram />
      <FAQ />
    </>
  );
}
