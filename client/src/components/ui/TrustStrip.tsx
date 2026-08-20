const items = [
  { icon: '🚚', title: 'Nationwide delivery', detail: 'PKR 300 flat across Pakistan' },
  { icon: '💵', title: 'Cash on delivery', detail: 'Pay when your order arrives' },
  { icon: '📦', title: 'Secure packaging', detail: 'Dispatch within 1–2 working days' },
  { icon: '🔄', title: 'Easy exchange', detail: 'For damaged or wrong products' },
];

export function TrustStrip({ compact = false }: { compact?: boolean }) {
  return (
    <ul className={`grid gap-3 ${compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
      {items.map((item) => (
        <li key={item.title} className="flex items-start gap-3 card px-4 py-3">
          <span className="text-base leading-none mt-0.5" aria-hidden>{item.icon}</span>
          <div>
            <p className="text-sm font-medium text-text">{item.title}</p>
            <p className="text-xs text-text-muted mt-0.5">{item.detail}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
