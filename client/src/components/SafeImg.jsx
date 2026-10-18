import { useState } from 'react';

export default function SafeImg({ src, alt = '', className = '', ...rest }) {
  const [bad, setBad] = useState(false);
  if (!src || bad) return <div className={`img-fallback ${className}`} role="img" aria-label={alt || 'Image unavailable'}><span>SAK</span></div>;
  return <img src={src} alt={alt} className={className} loading="lazy" decoding="async" onError={() => setBad(true)} {...rest} />;
}
