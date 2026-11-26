// Towns plotted from real latitude/longitude (projected into the viewBox), joined by a red route drawn on scroll.
const TOWNS: { n: string; x: number; y: number; side: "l" | "r" | "t" | "b" }[] = [
  { n: "Chester", x: 243, y: 336, side: "t" },
  { n: "Winsford", x: 391, y: 337, side: "b" },
  { n: "Northwich", x: 393, y: 292, side: "l" },
  { n: "Wigan", x: 347, y: 100, side: "l" },
  { n: "Manchester", x: 503, y: 144, side: "l" },
  { n: "Bramhall", x: 534, y: 225, side: "t" },
  { n: "Wilmslow", x: 508, y: 247, side: "l" },
  { n: "Macclesfield", x: 550, y: 292, side: "b" },
  { n: "Sandbach", x: 455, y: 369, side: "r" },
  { n: "Crewe", x: 424, y: 399, side: "r" },
  { n: "Nantwich", x: 391, y: 420, side: "r" },
];

export default function CoverageMap() {
  const d = TOWNS.map((t, i) => `${i ? "L" : "M"}${t.x} ${t.y}`).join(" ");
  return (
    <div className="map" data-map>
      <svg viewBox="0 0 600 520" role="img" aria-label="Map of the area covered: Cheshire, the North West as far north as Wigan and Manchester, and North Wales">
        <defs>
          <pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="rgba(242,241,237,.09)" />
          </pattern>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width="600" height="520" fill="url(#dots)" />
        {[90, 170, 250].map((r) => (
          <circle key={r} cx="300" cy="270" r={r} fill="none" stroke="rgba(242,241,237,.06)" strokeDasharray="2 6" />
        ))}
        <text x="0" y="16" className="mono" fill="rgba(242,241,237,.35)" fontSize="11" letterSpacing="2">CHESHIRE · NORTH WEST · NORTH WALES</text>
        <g className="region" data-town>
          <ellipse cx="112" cy="318" rx="92" ry="58" fill="rgba(227,18,11,.07)" stroke="rgba(227,18,11,.55)" strokeDasharray="4 6" />
          <text x="112" y="323" textAnchor="middle">North Wales</text>
        </g>
        <path d="M243 336 L204 326" fill="none" stroke="#e3120b" strokeWidth="2" strokeDasharray="3 5" opacity=".8" />
        <path d={d} fill="none" stroke="#e3120b" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" filter="url(#glow)" data-route pathLength={1} strokeDasharray="1" strokeDashoffset="0" />
        {TOWNS.map((t) => (
          <g key={t.n} className="town" data-town>
            <circle cx={t.x} cy={t.y} r="14" fill="rgba(227,18,11,.14)" />
            <circle cx={t.x} cy={t.y} r="5" fill="#f2f1ed" stroke="#e3120b" strokeWidth="2" />
            <text x={t.side === "r" ? t.x + 16 : t.side === "l" ? t.x - 16 : t.x} y={t.side === "t" ? t.y - 20 : t.side === "b" ? t.y + 30 : t.y + 5} textAnchor={t.side === "r" ? "start" : t.side === "l" ? "end" : "middle"}>{t.n}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
