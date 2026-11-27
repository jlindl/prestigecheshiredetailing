"use client";
import { useEffect, useRef } from "react";

export type Car = { name: string; img: string; alt: string; note: string };

const Chev = ({ dir }: { dir: "l" | "r" }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === "l" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
  </svg>
);

// Customer cars strip: drifts on its own, arrows step one car at a time, swipe on touch.
export default function GarageRail({ cars }: { cars: Car[] }) {
  const view = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const api = useRef<{ step: (d: number) => void } | null>(null);

  useEffect(() => {
    const v = view.current, t = track.current;
    if (!v || !t) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let x = 0, half = 0, stepW = 0, speed = 0, last = 0, raf = 0;
    let hover = false, dragging = false, holdUntil = 0;
    let tween: { from: number; to: number; t0: number } | null = null;

    const measure = () => {
      half = t.scrollWidth / 2;
      const first = t.children[0] as HTMLElement | undefined;
      const gap = first ? parseFloat(getComputedStyle(first).marginRight) || 0 : 0;
      stepW = first ? first.offsetWidth + gap : 400;
      speed = stepW / 6.5; // one car every 6.5s, same pace as before
    };
    const wrap = (n: number) => ((n % half) + half) % half;
    const paint = () => { t.style.transform = `translate3d(${-x}px,0,0)`; };
    const ease = (p: number) => 1 - Math.pow(1 - p, 4);

    const loop = (now: number) => {
      const dt = Math.min((now - (last || now)) / 1000, 0.05);
      last = now;
      if (tween) {
        const p = Math.min((now - tween.t0) / 650, 1);
        x = tween.from + (tween.to - tween.from) * ease(p);
        if (p >= 1) { x = wrap(tween.to); tween = null; holdUntil = now + 2500; }
        paint();
      } else if (!reduced && !hover && !dragging && now > holdUntil && !v.classList.contains("is-off")) {
        x = wrap(x + speed * dt);
        paint();
      }
      raf = requestAnimationFrame(loop);
    };

    api.current = {
      step: (d: number) => {
        if (!half) measure();
        const base = tween ? tween.to : x;
        // snap to the nearest car edge, then move one car
        const snapped = Math.round(base / stepW) * stepW;
        let from = x, to = snapped + d * stepW;
        if (to < 0) { from += half; to += half; }
        if (to > half + stepW) { from -= half; to -= half; }
        tween = { from, to, t0: performance.now() };
      },
    };

    // touch swipe
    let sx = 0, sy = 0, sxPos = 0, axis: "x" | "y" | null = null;
    const down = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      sx = e.clientX; sy = e.clientY; sxPos = x; axis = null; dragging = true; tween = null;
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!axis && Math.hypot(dx, dy) > 8) axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (axis === "x") { x = wrap(sxPos - dx); paint(); }
    };
    const up = () => { if (dragging) { dragging = false; holdUntil = performance.now() + 2500; } };

    const enter = (e: PointerEvent) => { if (e.pointerType === "mouse") hover = true; };
    const leave = () => { hover = false; };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(t);
    v.addEventListener("pointerenter", enter);
    v.addEventListener("pointerleave", leave);
    v.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf); ro.disconnect();
      v.removeEventListener("pointerenter", enter); v.removeEventListener("pointerleave", leave);
      v.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <div className="garage-view is-off" ref={view}>
      <div className="garage-track" ref={track}>
        {[0, 1].map((loop) =>
          cars.map((c) => (
            <article className="car" key={`${loop}-${c.name}`} aria-hidden={loop === 1 ? true : undefined}>
              <div className="ph">
                <img decoding="async" data-src={`/img/${c.img}.webp`} data-srcset={`/img/${c.img}-xs.webp 480w, /img/${c.img}-sm.webp 800w, /img/${c.img}.webp 1400w`} sizes="(max-width: 820px) 340px, 420px" alt={loop === 1 ? "" : `${c.name}, a Prestige Cheshire Detailing customer car`} loading="lazy" draggable={false} />
                <img decoding="async" className="alt" data-alt-src={`/img/${c.alt}.webp`} data-alt-srcset={`/img/${c.alt}-xs.webp 480w, /img/${c.alt}-sm.webp 800w, /img/${c.alt}.webp 1400w`} sizes="(max-width: 820px) 340px, 420px" alt="" loading="lazy" aria-hidden="true" draggable={false} />
              </div>
              <div className="meta">
                <h3 className="name">{c.name}</h3>
                <span className="mono" style={{ color: "var(--dim)" }}>{c.note}</span>
              </div>
            </article>
          ))
        )}
      </div>
      <button type="button" className="rail-btn prev" aria-label="Previous car" onClick={() => api.current?.step(-1)}><Chev dir="l" /></button>
      <button type="button" className="rail-btn next" aria-label="Next car" onClick={() => api.current?.step(1)}><Chev dir="r" /></button>
    </div>
  );
}
