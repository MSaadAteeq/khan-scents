import { site } from '../data/site';
import { whatsappChatUrl } from '../lib/whatsapp';

const contacts = [
  {
    label: 'WhatsApp',
    value: site.whatsappDisplay,
    href: whatsappChatUrl('Hi Khan Scents — I have a question.'),
  },
  { label: 'Phone', value: site.phone, href: `tel:${site.phone.replace(/\s/g, '')}` },
  { label: 'Email', value: site.email, href: `mailto:${site.email}` },
  { label: 'Instagram', value: '@khanscents', href: site.instagram },
  { label: 'Facebook', value: 'Khan Scents', href: site.facebook },
];

export function ContactPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="container-page max-w-3xl">
        <p className="text-xs uppercase tracking-widest-plus text-gold mb-3">Reach us</p>
        <h1 className="font-display text-5xl md:text-6xl text-ivory mb-4">Contact Us</h1>
        <p className="text-ivory-dim mb-12 leading-relaxed">
          Questions about an order, a fragrance, or delivery? Message us anytime — we typically
          reply within a few hours.
        </p>
        <ul className="space-y-0 divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
          {contacts.map((c) => (
            <li key={c.label} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-5">
              <span className="text-xs uppercase tracking-widest text-ivory-dim">{c.label}</span>
              <a
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noreferrer' : undefined}
                className="text-xl font-display text-ivory hover:text-gold"
              >
                {c.value}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={whatsappChatUrl('Hi Khan Scents!')}
          target="_blank"
          rel="noreferrer"
          className="btn-gold mt-10 inline-flex"
        >
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}
