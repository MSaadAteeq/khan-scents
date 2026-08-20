const items = [
  { icon: '🚚', title: 'Nationwide Delivery', detail: 'PKR 300 flat across Pakistan' },
  { icon: '💵', title: 'Cash on Delivery', detail: 'Pay when your order arrives' },
  { icon: '📦', title: 'Secure Packaging', detail: 'Dispatch within 1–2 working days' },
  { icon: '🔄', title: 'Easy Exchange', detail: 'For damaged or wrong products' },
];

export function TrustStrip({ compact = false }: { compact?: boolean }) {
  return (
    <ul
      className={`grid gap-3 ${
        compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      }`}
    >
      {items.map((item) => (
        <li
          key={item.title}
          className="flex items-start gap-3 border border-[var(--color-line)] bg-charcoal-soft/60 px-4 py-3"
        >
          <span className="text-lg leading-none mt-0.5" aria-hidden>
            {item.icon}
          </span>
          <div>
            <p className="text-sm text-ivory font-medium">{item.title}</p>
            <p className="text-xs text-ivory-dim mt-0.5">{item.detail}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
