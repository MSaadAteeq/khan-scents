import { socialImages } from '../../data/images';
import { ProductImage } from '../ui/ProductImage';

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
      <path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.6 1.6-1.6H17V4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.2v2.4H8v3.2h2.6V22h2.9Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
      <path d="M12 7.2A4.8 4.8 0 1 0 16.8 12 4.8 4.8 0 0 0 12 7.2Zm0 7.9A3.1 3.1 0 1 1 15.1 12 3.1 3.1 0 0 1 12 15.1Zm6.1-8.2a1.1 1.1 0 1 1-1.1-1.1 1.1 1.1 0 0 1 1.1 1.1ZM12 4.6c1.6 0 1.8 0 2.4.1a4 4 0 0 1 1.4.3 2.7 2.7 0 0 1 1.5 1.5 4 4 0 0 1 .3 1.4c0 .6.1.8.1 2.4s0 1.8-.1 2.4a4 4 0 0 1-.3 1.4 2.7 2.7 0 0 1-1.5 1.5 4 4 0 0 1-1.4.3c-.6 0-.8.1-2.4.1s-1.8 0-2.4-.1a4 4 0 0 1-1.4-.3 2.7 2.7 0 0 1-1.5-1.5 4 4 0 0 1-.3-1.4c0-.6-.1-.8-.1-2.4s0-1.8.1-2.4a4 4 0 0 1 .3-1.4 2.7 2.7 0 0 1 1.5-1.5 4 4 0 0 1 1.4-.3c.6 0 .8-.1 2.4-.1ZM12 3c-1.6 0-1.8 0-2.5.1a5.6 5.6 0 0 0-1.9.4 4.4 4.4 0 0 0-2.5 2.5 5.6 5.6 0 0 0-.4 1.9C4.6 8.6 4.6 8.8 4.6 12s0 3.4.1 4.6a5.6 5.6 0 0 0 .4 1.9 4.4 4.4 0 0 0 2.5 2.5 5.6 5.6 0 0 0 1.9.4c1.2.1 1.4.1 4.6.1s3.4 0 4.6-.1a5.6 5.6 0 0 0 1.9-.4 4.4 4.4 0 0 0 2.5-2.5 5.6 5.6 0 0 0 .4-1.9c.1-1.2.1-1.4.1-4.6s0-3.4-.1-4.6a5.6 5.6 0 0 0-.4-1.9 4.4 4.4 0 0 0-2.5-2.5 5.6 5.6 0 0 0-1.9-.4C13.8 3 13.6 3 12 3Z" />
    </svg>
  );
}

const FACEBOOK_URL = 'https://www.facebook.com/share/1DWz5E9X3G/';
const INSTAGRAM_URL = 'https://www.instagram.com/khanscents2026?avpt=c3UyNGJ6dmloZDV1';

export function Instagram() {
  const networks = [
    {
      label: 'Facebook',
      href: FACEBOOK_URL,
      image: socialImages.facebook,
      icon: <FacebookIcon />,
    },
    {
      label: 'Instagram',
      href: INSTAGRAM_URL,
      image: socialImages.instagram,
      icon: <InstagramIcon />,
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-surface">
      <div className="container-page">
        <span className="section-label">Social</span>
        <h2 className="section-title">Follow us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {networks.map((network) => (
            <a
              key={network.label}
              href={network.href}
              target="_blank"
              rel="noreferrer"
              className="relative group aspect-[4/3] overflow-hidden rounded-xl"
            >
              <ProductImage
                src={network.image}
                alt={network.label}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-dark/35 group-hover:bg-dark/25 transition" />
              <div className="absolute inset-0 flex items-end p-6">
                <span className="inline-flex items-center gap-2 text-xl font-semibold text-white">
                  {network.icon}
                  {network.label}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
