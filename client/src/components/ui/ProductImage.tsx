import { useState } from 'react';
import { imageFallback } from '../../data/images';

type ProductImageProps = {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
};

export function ProductImage({ src, alt, className, loading = 'lazy' }: ProductImageProps) {
  const [current, setCurrent] = useState(src);

  return (
    <img
      src={current}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      onError={() => {
        if (current !== imageFallback) setCurrent(imageFallback);
      }}
    />
  );
}
