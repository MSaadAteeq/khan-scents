import { site } from '../data/site';
import { whatsappChatUrl } from '../lib/whatsapp';

const contacts = [
  { label: 'WhatsApp', value: site.whatsappDisplay, href: whatsappChatUrl('Hi Khan Scents — I have a question.') },
  { label: 'Phone', value: site.phone, href: `tel:${site.phone.replace(/\s/g, '')}` },
  { label: 'Email', value: site.email, href: `mailto:${site.email}` },
  { label: 'Instagram', value: '@khanscents', href: site.instagram },
  { label: 'Facebook', value: 'Khan Scents', href: site.facebook },
];

export function ContactPage() {
  return (
    <div className="pt-24 pb-20 bg-bg min-h-screen">
      <div className="container-page max-w-2xl">
        <span className="section-label">Reach us</span>
        <h1 className="section-title">Contact</h1>
        <p className="text-text-muted mb-10 -mt-12 leading-relaxed">
          Questions about an order or delivery? We typically reply within a few hours.
        </p>
        <ul className="card divide-y divide-border">
          {contacts.map((c) => (
            <li key={c.label} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 px-5 py-4">
              <span className="text-sm text-text-muted">{c.label}</span>
              <a
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noreferrer' : undefined}
                className="font-medium text-text hover:text-accent transition-colors"
              >
                {c.value}
              </a>
            </li>
          ))}
        </ul>
        <a href={whatsappChatUrl('Hi Khan Scents!')} target="_blank" rel="noreferrer" className="btn-primary mt-8 inline-flex">
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}
