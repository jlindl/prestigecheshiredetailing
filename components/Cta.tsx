import { SITE, waLink } from "@/lib/site";
import { WaIcon, PhoneIcon } from "./Icons";

/** WhatsApp button. Static HTML; the magnetic drift on desktop is one shared listener in LazyLoader. */
export function WaButton({ label = "WhatsApp us", text, className = "" }: { label?: string; text?: string; className?: string }) {
  return (
    <a href={waLink(text)} target="_blank" rel="noopener" className={`btn btn-red ${className}`} data-magnet>
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
