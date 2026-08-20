import { Link, useLocation } from 'react-router-dom';
import { site } from '../data/site';
import { whatsappChatUrl } from '../lib/whatsapp';

export function SuccessPage() {
  const location = useLocation();
  const orderId = (location.state as { orderId?: string } | null)?.orderId;

  return (
    <div className="pt-32 pb-24 container-page max-w-2xl text-center">
      <p className="text-xs uppercase tracking-widest-plus text-gold mb-4">Thank you</p>
      <h1 className="font-display text-5xl md:text-6xl text-ivory mb-4">Order Received</h1>
      {orderId && (
        <p className="text-gold mb-4 font-medium tracking-wide">Order {orderId}</p>
      )}
      <p className="text-ivory-dim leading-relaxed mb-8">
        Your order has been saved. A WhatsApp chat should have opened with your order details —
        send the message so we can confirm and dispatch within 1–2 working days.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={whatsappChatUrl('Hi — confirming my Khan Scents order.')}
          target="_blank"
          rel="noreferrer"
          className="btn-gold"
        >
          Open WhatsApp
        </a>
        <Link to="/shop" className="btn-outline">
          Continue Shopping
        </Link>
      </div>
      <p className="mt-10 text-sm text-ivory-dim">
        Questions? Email{' '}
        <a href={`mailto:${site.email}`} className="text-gold hover:underline">
          {site.email}
        </a>
      </p>
    </div>
  );
}
