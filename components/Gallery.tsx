"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { PHOTOS } from "@/lib/gallery";

const ALT = "Customer car detailed by Prestige Cheshire Detailing";

// Full photo wall; tap a photo to see it large, arrows, keys or swipe to move through.
export default function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  const sx = useRef(0);
  const n = PHOTOS.length;
  const go = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + n) % n)), [n]);

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
  }, [open]);

  useEffect(() => {
    if (open === null) return;
    const k = (e: KeyboardEvent) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); };
    window.addEventListener("keydown", k);
    // warm the neighbours so arrows feel instant
    [1, -1].forEach((d) => { const im = new Image(); im.src = `/gallery/${PHOTOS[(open + d + n) % n][0]}.webp`; });
    return () => window.removeEventListener("keydown", k);
  }, [open, go, n]);

  const cur = open === null ? null : PHOTOS[open];

  return (
    <>
      <div className="wall">
        {PHOTOS.map(([k, w, h, sw], i) => (
          <button type="button" key={k} className="wall-item" onClick={() => setOpen(i)} aria-label="Open photo">
            <img src={`/gallery/${k}-sm.webp`} srcSet={`/gallery/${k}-sm.webp ${sw}w, /gallery/${k}.webp ${w}w`} sizes="(max-width: 600px) 50vw, (max-width: 1100px) 33vw, 25vw" width={w} height={h} alt={ALT} loading={i < 8 ? "eager" : "lazy"} decoding="async" />
          </button>
        ))}
      </div>
      <dialog
        ref={dlg}
        className="gal-box"
        onClose={() => setOpen(null)}
        onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }}
        onTouchStart={(e) => { sx.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => { const dx = e.changedTouches[0].clientX - sx.current; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); }}
      >
        {cur && (
          <figure>
            <img src={`/gallery/${cur[0]}.webp`} width={cur[1]} height={cur[2]} alt={ALT} />
          </figure>
        )}
        <button type="button" className="gal-x" aria-label="Close" onClick={() => setOpen(null)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <button type="button" className="rail-btn prev" aria-label="Previous photo" onClick={() => go(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <button type="button" className="rail-btn next" aria-label="Next photo" onClick={() => go(1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
        </button>
      </dialog>
    </>
  );
}
