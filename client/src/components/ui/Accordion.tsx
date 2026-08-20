import { useState } from 'react';

export function Accordion({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-border border-y border-border">
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
              <span className="text-base font-medium text-text">{item.question}</span>
              <span className="text-accent text-xl shrink-0 w-6 text-center">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <p className="pb-5 text-sm text-text-muted leading-relaxed max-w-2xl">{item.answer}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
