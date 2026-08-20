import { faqs } from '../../data/site';
import { Accordion } from '../ui/Accordion';

export function FAQ() {
  return (
    <section className="py-20 md:py-28 bg-bg">
      <div className="container-page max-w-2xl">
        <span className="section-label">Help</span>
        <h2 className="section-title">FAQ</h2>
        <Accordion items={faqs} />
      </div>
    </section>
  );
}
