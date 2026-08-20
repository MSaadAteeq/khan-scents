import { Link } from 'react-router-dom';
import { site } from '../../data/site';
import { whatsappChatUrl } from '../../lib/whatsapp';

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-line)] mt-auto">
      <div className="container-page py-16 md:py-20 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <p className="font-display text-2xl text-ivory italic mb-3">Khan Scents</p>
          <p className="text-ivory-dim text-sm max-w-xs leading-relaxed">
            Luxury-inspired fragrances, delivered across Pakistan.
          </p>
        </div>
        <div>
          <p className="section-label mb-4">Pages</p>
          <ul className="space-y-2.5 text-sm text-ivory-dim">
            <li><Link to="/shop" className="hover:text-ivory transition-colors">Shop</Link></li>
            <li><Link to="/about" className="hover:text-ivory transition-colors">About</Link></li>
            <li><Link to="/shipping-returns" className="hover:text-ivory transition-colors">Shipping</Link></li>
            <li><Link to="/contact" className="hover:text-ivory transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="section-label mb-4">Contact</p>
          <ul className="space-y-2.5 text-sm text-ivory-dim">
            <li>
              <a href={whatsappChatUrl()} target="_blank" rel="noreferrer" className="hover:text-ivory transition-colors">
                {site.whatsappDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-ivory transition-colors">
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--color-line)] py-6 text-center text-xs text-ivory-dim">
        © {new Date().getFullYear()} Khan Scents
      </div>
    </footer>
  );
}
