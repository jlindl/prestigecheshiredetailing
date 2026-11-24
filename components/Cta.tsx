"use client";
import { useRef } from "react";
import { SITE, waLink } from "@/lib/site";
import { WaIcon, PhoneIcon } from "./Icons";

/** Magnetic WhatsApp button: drifts toward the cursor, springs back on leave. */
export function WaButton({ label = "WhatsApp Craig", text, className = "" }: { label?: string; text?: string; className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const move = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia("(hover: none)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * 0.18;
    const y = (e.clientY - (r.top + r.height / 2)) * 0.3;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const leave = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <a ref={ref} href={waLink(text)} target="_blank" rel="noopener" className={`btn btn-red ${className}`} onMouseMove={move} onMouseLeave={leave}>
      {label}
      <span className="ico"><WaIcon /></span>
    </a>
  );
}

export function CallButton({ className = "" }: { className?: string }) {
  return (
    <a href={SITE.phoneHref} className={`btn btn-ghost ${className}`}>
      <PhoneIcon /> {SITE.phoneDisplay}
    </a>
  );
}

export function CtaStrip({ line, sub, text }: { line: string; sub: string; text?: string }) {
  return (
    <div className="cta-strip">
      <p>
        {line} <span>{sub}</span>
      </p>
      <WaButton text={text} />
    </div>
  );
}
