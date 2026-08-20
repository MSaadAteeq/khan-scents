import { Link, useLocation } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import { whatsappChatUrl } from '../lib/whatsapp';

export function SuccessPage() {
  const { site } = useSite();
  const location = useLocation();
  const orderId = (location.state as { orderId?: string } | null)?.orderId;

  return (
    <div className="pt-32 pb-24 container-page max-w-lg text-center bg-bg min-h-screen">
      <span className="section-label">Thank you</span>
      <h1 className="text-3xl font-semibold text-text mb-3">Order received</h1>
      {orderId && <p className="text-accent font-medium mb-4">Order {orderId}</p>}
      <p className="text-text-muted leading-relaxed mb-8 text-sm">
        Your order has been saved. Send the WhatsApp message so we can confirm and dispatch within 1–2 working days.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a href={whatsappChatUrl('Hi — confirming my Khan Scents order.', site.whatsapp)} target="_blank" rel="noreferrer" className="btn-primary">
          Open WhatsApp
        </a>
        <Link to="/shop" className="btn-outline">Continue shopping</Link>
      </div>
      <p className="mt-10 text-sm text-text-muted">
        Questions? <a href={`mailto:${site.email}`} className="text-accent hover:underline">{site.email}</a>
      </p>
    </div>
  );
}
