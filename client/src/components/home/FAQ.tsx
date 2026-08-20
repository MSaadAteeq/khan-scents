import { faqs } from '../../data/site';
import { Accordion } from '../ui/Accordion';

export function FAQ() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-page max-w-3xl">
        <p className="text-xs uppercase tracking-widest-plus text-gold mb-3">Help</p>
        <h2 className="font-display text-4xl md:text-5xl text-ivory mb-10">FAQ</h2>
        <Accordion items={faqs} />
      </div>
    </section>
  );
}
