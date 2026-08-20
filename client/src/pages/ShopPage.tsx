import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ui/ProductCard';
import { useProducts } from '../hooks/useProducts';
import type { Gender, Note } from '../types/product';

const genderFilters: { value: Gender | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'him', label: 'For Him' },
  { value: 'her', label: 'For Her' },
  { value: 'unisex', label: 'Unisex' },
];

const noteFilters: { value: Note; label: string }[] = [
  { value: 'fresh', label: 'Fresh' },
  { value: 'woody', label: 'Woody' },
  { value: 'sweet', label: 'Sweet' },
  { value: 'long-lasting', label: 'Long-lasting' },
];

export function ShopPage() {
  const { products, loading, error } = useProducts();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [under2500, setUnder2500] = useState(false);

  const gender = (params.get('gender') as Gender | null) || 'all';
  const note = params.get('note') as Note | null;

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (gender !== 'all' && p.gender !== gender) return false;
      if (note && !p.notes.includes(note)) return false;
      if (under2500 && p.price >= 2500) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const hay = `${p.name} ${p.inspiredBy} ${p.notes.join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [products, gender, note, under2500, search]);

  const setGender = (value: Gender | 'all') => {
    const next = new URLSearchParams(params);
    if (value === 'all') next.delete('gender');
    else next.set('gender', value);
    setParams(next);
  };

  const setNote = (value: Note | null) => {
    const next = new URLSearchParams(params);
    if (!value) next.delete('note');
    else next.set('note', value);
    setParams(next);
  };

  return (
    <div className="pt-28 pb-20">
      <div className="container-page">
        <p className="text-xs uppercase tracking-widest-plus text-gold mb-3">Catalog</p>
        <h1 className="font-display text-5xl md:text-6xl text-ivory mb-10">Shop</h1>

        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="lg:w-56 shrink-0 space-y-8">
            <div>
              <label className="block text-xs uppercase tracking-widest text-ivory-dim mb-2">
                Search
              </label>
              <input
                type="search"
                placeholder="Name or notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2.5 text-sm"
              />
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-ivory-dim mb-3">Gender</p>
              <div className="flex flex-wrap gap-2">
                {genderFilters.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setGender(f.value)}
                    className={`px-3 py-1.5 text-xs uppercase tracking-wider border transition ${
                      gender === f.value
                        ? 'border-gold text-gold'
                        : 'border-[var(--color-line)] text-ivory-dim hover:border-gold/50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-ivory-dim mb-3">Notes</p>
              <div className="flex flex-wrap gap-2">
                {noteFilters.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setNote(note === f.value ? null : f.value)}
                    className={`px-3 py-1.5 text-xs uppercase tracking-wider border transition ${
                      note === f.value
                        ? 'border-gold text-gold'
                        : 'border-[var(--color-line)] text-ivory-dim hover:border-gold/50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-3 text-sm text-ivory-dim cursor-pointer">
              <input
                type="checkbox"
                checked={under2500}
                onChange={(e) => setUnder2500(e.target.checked)}
                className="accent-[var(--color-gold)]"
              />
              Under Rs. 2,500
            </label>
          </aside>

          <div className="flex-1">
            {loading && <p className="text-ivory-dim">Loading catalog...</p>}
            {error && <p className="text-red-300">{error}</p>}
            {!loading && !error && (
              <>
                <p className="text-sm text-ivory-dim mb-6">
                  {filtered.length} fragrance{filtered.length === 1 ? '' : 's'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                {!filtered.length && (
                  <p className="text-ivory-dim mt-8">No fragrances match these filters.</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
