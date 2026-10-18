export default function Brand() {
  return (
    <svg className="brand-mark" viewBox="0 0 360 206" role="img" aria-label="SAK Nexora">
      <defs>
        <linearGradient id="brand-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe9a8" />
          <stop offset=".45" stopColor="#f4b945" />
          <stop offset="1" stopColor="#a6762a" />
        </linearGradient>
        <linearGradient id="brand-rule" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#a6762a" />
          <stop offset=".5" stopColor="#ffe9a8" />
          <stop offset="1" stopColor="#a6762a" />
        </linearGradient>
      </defs>
      <path d="M180 6 225 32v52l-45 26-45-26V32z" fill="none" stroke="url(#brand-gold)" strokeWidth="4.5" />
      <text x="180" y="70" textAnchor="middle" fill="url(#brand-gold)" fontFamily="Cinzel, Georgia, serif" fontWeight="700" fontSize="30" letterSpacing="1">SAK</text>
      <g fill="url(#brand-rule)">
        <rect x="14" y="118" width="332" height="2.4" />
        <rect x="14" y="192" width="332" height="2.4" />
        <path d="m6 119 6-6 6 6-6 6zm336 0 6-6 6 6-6 6zm-336 74 6-6 6 6-6 6zm336 0 6-6 6 6-6 6z" />
      </g>
      <text x="180" y="177" textAnchor="middle" fill="url(#brand-gold)" fontFamily="Cinzel, Georgia, serif" fontWeight="600" fontSize="58" letterSpacing="5" textLength="300" lengthAdjust="spacingAndGlyphs">NEXORA</text>
    </svg>
  );
}
