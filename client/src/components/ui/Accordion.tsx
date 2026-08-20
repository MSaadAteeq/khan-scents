import { useState } from 'react';

export function Accordion({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.question}>
            <button
              type="button"
              className="w-full flex items-center justify-between gap-4 py-5 text-left"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span className="font-display text-xl md:text-2xl text-ivory">{item.question}</span>
              <span className="text-gold text-xl shrink-0">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <p className="pb-6 text-ivory-dim leading-relaxed max-w-3xl">{item.answer}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
