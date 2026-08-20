import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { site as defaultSite, faqs as defaultFaqs, reviews as defaultReviews } from '../data/site';
import { fetchSiteData } from '../lib/api';
import type { Faq, Review, SiteSettings } from '../types/product';

interface SiteContextValue {
  site: SiteSettings;
  reviews: Review[];
  faqs: Faq[];
  loading: boolean;
  refresh: () => Promise<void>;
}

const fallbackReviews: Review[] = defaultReviews.map((r, i) => ({
  ...r,
  id: `rev-${i + 1}`,
}));

const fallbackFaqs: Faq[] = defaultFaqs.map((f, i) => ({
  ...f,
  id: `faq-${i + 1}`,
}));

const SiteContext = createContext<SiteContextValue>({
  site: defaultSite,
  reviews: fallbackReviews,
  faqs: fallbackFaqs,
  loading: false,
  refresh: async () => {},
});

export function SiteProvider({ children }: { children: ReactNode }) {
  const [site, setSite] = useState<SiteSettings>(defaultSite);
  const [reviews, setReviews] = useState<Review[]>(fallbackReviews);
  const [faqs, setFaqs] = useState<Faq[]>(fallbackFaqs);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const data = await fetchSiteData();
      setSite(data.site);
      setReviews(data.reviews);
      setFaqs(data.faqs);
    } catch {
      // keep fallback defaults
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <SiteContext.Provider value={{ site, reviews, faqs, loading, refresh }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  return useContext(SiteContext);
}
