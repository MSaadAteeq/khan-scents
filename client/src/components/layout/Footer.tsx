import { Link } from 'react-router-dom';
import { site } from '../../data/site';
import { whatsappChatUrl } from '../../lib/whatsapp';

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="container-page py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <p className="text-lg font-semibold text-text mb-2">Khan Scents</p>
          <p className="text-sm text-text-muted leading-relaxed max-w-xs">
            Luxury-inspired fragrances, delivered across Pakistan with cash on delivery.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">Pages</p>
          <ul className="space-y-2.5 text-sm text-text-muted">
            <li><Link to="/shop" className="hover:text-text transition-colors">Shop</Link></li>
            <li><Link to="/about" className="hover:text-text transition-colors">About</Link></li>
            <li><Link to="/shipping-returns" className="hover:text-text transition-colors">Shipping</Link></li>
            <li><Link to="/contact" className="hover:text-text transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">Contact</p>
          <ul className="space-y-2.5 text-sm text-text-muted">
            <li>
              <a href={whatsappChatUrl()} target="_blank" rel="noreferrer" className="hover:text-text transition-colors">
                {site.whatsappDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-text transition-colors">
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-text-muted">
        © {new Date().getFullYear()} Khan Scents
      </div>
    </footer>
  );
}
