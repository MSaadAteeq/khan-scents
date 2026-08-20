import { useEffect, useState } from 'react';
import { imageFallback } from '../../data/images';
import { assetUrl } from '../../lib/assets';

type ProductImageProps = {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
};

export function ProductImage({ src, alt, className, loading = 'lazy' }: ProductImageProps) {
  const resolved = assetUrl(src);
  const fallback = assetUrl(imageFallback);
  const [current, setCurrent] = useState(resolved);

  useEffect(() => {
    setCurrent(assetUrl(src));
  }, [src]);

  return (
    <img
      src={current}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      onError={() => {
        if (current !== fallback) setCurrent(fallback);
      }}
    />
  );
}
