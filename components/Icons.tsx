const SWOOSH_BODY = "M40 178 C110 148 200 134 320 132 C520 130 760 152 965 160 L1135 168 C1080 186 1010 194 930 192 C760 188 560 168 400 154 C280 146 160 150 40 178 Z";
const SWOOSH_ROOF = "M360 112 C470 62 600 42 720 43 C830 44 900 80 990 132 L1135 168 L965 162 C900 112 820 66 720 66 C610 66 480 84 360 112 Z";
const SWOOSH_RED = "M790 240 C870 236 950 230 1010 225 L962 218 C1040 210 1100 198 1142 176 C1166 198 1160 236 1100 252 C1020 268 900 256 790 240 Z";

/** Vector redraw of Craig's logo car: white body and roof lines with the red sweep under the nose. */
export function LogoSwoosh({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="30 34 1140 232" aria-hidden="true">
      <path fill="currentColor" d={SWOOSH_BODY} />
      <path fill="currentColor" d={SWOOSH_ROOF} />
      <path fill="#e3120b" d={SWOOSH_RED} />
    </svg>
  );
}

/** Full stacked lockup, as in Craig's logo: car above "PRESTIGE CHESHIRE / DETAILING". */
export function Logo({ size = "md", decorative = false }: { size?: "sm" | "md" | "lg"; decorative?: boolean }) {
  return (
    <span className={`logo logo-${size}`} {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": "Prestige Cheshire Detailing" })}>
      <LogoSwoosh className="logo-car" />
      <span className="logo-t1">PRESTIGE CHESHIRE</span>
      <span className="logo-t2">DETAILING</span>
    </span>
  );
}

export function WaIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2Zm0 18.15h-.01a8.22 8.22 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

export function PhoneIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

export function Arrow({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
