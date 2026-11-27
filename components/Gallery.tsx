"use client";
import { useCallback, useEffect, useRef, useState } from "react";

export type Shot = { img: string; alt: string; wide?: boolean };

// Photo grid; tap a photo to see it large, arrows or swipe to move through.
export default function Gallery({ shots }: { shots: Shot[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  const sx = useRef(0);

  const go = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + shots.length) % shots.length)), [shots.length]);

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
    return () => window.removeEventListener("keydown", k);
  }, [open, go]);

  const cur = open === null ? null : shots[open];

  return (
    <>
      <div className="gal-grid">
        {shots.map((s, i) => (
          <button type="button" key={s.img} className={`gal-item${s.wide ? " wide" : ""}`} onClick={() => setOpen(i)} aria-label={`Open photo: ${s.alt}`}>
            <img decoding="async" data-src={`/img/${s.img}.webp`} data-srcset={`/img/${s.img}-xs.webp 480w, /img/${s.img}-sm.webp 800w, /img/${s.img}.webp 1400w`} sizes="(max-width: 820px) 50vw, 25vw" alt={s.alt} loading="lazy" />
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
            <img src={`/img/${cur.img}.webp`} alt={cur.alt} />
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
