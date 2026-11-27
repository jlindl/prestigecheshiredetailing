"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { WORK } from "@/lib/content";

// Two rows of customer cars drifting in opposite directions (Craig asked for auto-scroll).
// Hover pauses a row; tap or click any photo to see it full size.
export default function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const dlg = useRef<HTMLDivElement>(null);
  const close = () => { setOpen(null); requestAnimationFrame(() => opener.current?.focus()); };
  const rows = [WORK];

  useEffect(() => {
    if (open === null) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % WORK.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + WORK.length) % WORK.length));
    };
    // keep Tab inside the dialog and make the page behind it inert
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !dlg.current) return;
      const f = [...dlg.current.querySelectorAll<HTMLElement>("button")];
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    const bg = [...document.querySelectorAll<HTMLElement>("body > header, main, body > footer, .mbar")];
    bg.forEach((el) => el.setAttribute("inert", ""));
    window.addEventListener("keydown", onKey);
    window.addEventListener("keydown", trap);
    document.documentElement.classList.add("lb-open");
    return () => {
      bg.forEach((el) => el.removeAttribute("inert"));
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keydown", trap);
      document.documentElement.classList.remove("lb-open");
    };
  }, [open]);

  return (
    <>
      <div className="gal" data-gal>
        {rows.map((row, r) => (
          <div className={`gal-row ${r ? "rev" : ""}`} key={r}>
            <div className="gal-track">
              {[0, 1].map((loop) =>
                row.map((w, i) => {
                  const idx = r * 8 + i;
                  return (
                    <button
                      type="button"
                      className="gal-item"
                      key={`${loop}-${idx}`}
                      onClick={(e) => { opener.current = e.currentTarget; setOpen(idx); }}
                      aria-label={loop ? undefined : `${w.name}, view larger`}
                      aria-hidden={loop ? true : undefined}
                      tabIndex={loop ? -1 : 0}
                    >
                      <img
                        data-src={`/img/${w.img}-xs.webp`}
                        data-srcset={`/img/${w.img}-xs.webp 480w, /img/${w.img}-sm.webp 800w`}
                        sizes="(max-width: 760px) 200px, 300px"
                        alt={loop ? "" : w.name}
                        decoding="async"
                        loading="lazy"
                      />
                      <span className="gal-cap">{w.name}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>

      {open !== null && createPortal(
        <div ref={dlg} className="lb" role="dialog" aria-modal="true" aria-label={WORK[open].name} onClick={close}>
          <img src={`/img/${WORK[open].img}.webp`} alt={WORK[open].name} onClick={(e) => e.stopPropagation()} />
          <p className="lb-cap">{WORK[open].name} <span>{open + 1} / {WORK.length}</span></p>
          <button ref={closeRef} type="button" className="lb-x" aria-label="Close" onClick={close}>×</button>
          <button type="button" className="lb-nav prev" aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + WORK.length) % WORK.length); }}>‹</button>
          <button type="button" className="lb-nav next" aria-label="Next photo" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % WORK.length); }}>›</button>
        </div>,
        document.body
      )}
    </>
  );
}
