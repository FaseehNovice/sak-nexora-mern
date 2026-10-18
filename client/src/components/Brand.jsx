export default function Brand({ className = 'logo--header', id = 'sakg' }) {
  const hId = `${id}-h`;
  const hhId = `${id}-hh`;

  return (
    <svg className={`logo ${className}`} viewBox="0 0 360 206" role="img" aria-label="SAK Nexora">
      <defs>
        <linearGradient id={hId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe9a8" />
          <stop offset=".42" stopColor="#f4b945" />
          <stop offset=".7" stopColor="#a6762a" />
          <stop offset="1" stopColor="#f0cd7a" />
        </linearGradient>
        <linearGradient id={hhId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#a6762a" />
          <stop offset=".5" stopColor="#ffe9a8" />
          <stop offset="1" stopColor="#a6762a" />
        </linearGradient>
      </defs>
      <g fill="none" stroke={`url(#${hId})`} strokeWidth="4.5" className="logo__hex">
        <path d="M180 6 L225 32 L225 84 L180 110 L135 84 L135 32 Z" pathLength="1" />
      </g>
      <text x="180" y="70" textAnchor="middle" fill={`url(#${hId})`} fontFamily="Cinzel, Georgia, serif" fontWeight="700" fontSize="30" letterSpacing="1">
        SAK
      </text>
      <g fill={`url(#${hhId})`} className="logo__rules">
        <rect x="14" y="118" width="332" height="2.4" />
        <rect x="14" y="192" width="332" height="2.4" />
        <path d="M6 119.2 12 113.2 18 119.2 12 125.2Z M342 119.2 348 113.2 354 119.2 348 125.2Z M6 193.2 12 187.2 18 193.2 12 199.2Z M342 193.2 348 187.2 354 193.2 348 199.2Z" />
      </g>
      <text x="180" y="177" textAnchor="middle" fill={`url(#${hId})`} fontFamily="Cinzel, Georgia, serif" fontWeight="600" fontSize="58" letterSpacing="5" textLength="300" lengthAdjust="spacingAndGlyphs">
        NE<tspan fillOpacity="0">X</tspan>ORA
      </text>
      <g className="logo__x" fill={`url(#${hId})`}>
        <path d="M170.5 136.5 L173.5 136.5 L137.5 177 L134.5 177 Z" />
        <path d="M128 177 h14 v1.6 h-14 Z M163 136 h14 v1.6 h-14 Z" />
        <path d="M132.5 138 C132.5 133 139.5 131.5 144.5 135 L172.5 168.5 C178.5 178.5 193 185 214 186 C238 187 258 183 272 177.5 C259 188.5 237 193 210 193 C184 193 167 185 160.5 175 Z" />
      </g>
      <path d="M134 135 C131.5 129.5 127 128.5 124 131" fill="none" stroke={`url(#${hId})`} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
