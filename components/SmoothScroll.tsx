"use client";
import { useEffect } from "react";

// Lenis smooth scrolling plus a gentle fade-up as gallery photos come into view.
export default function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    if (!reduced) {
      import("lenis").then(({ default: L }) => {
        lenis = new L({ duration: 1.15, easing: (t: number) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
        const loop = (t: number) => { lenis?.raf(t); raf = requestAnimationFrame(loop); };
        raf = requestAnimationFrame(loop);
      });
    }
    const items = document.querySelectorAll<HTMLElement>(".wall-item");
    if (reduced) { items.forEach((el) => el.classList.add("in")); return; }
    const io = new IntersectionObserver((en) => en.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { rootMargin: "0px 0px -6% 0px" });
    items.forEach((el) => io.observe(el));
    return () => { cancelAnimationFrame(raf); lenis?.destroy(); io.disconnect(); };
  }, []);
  return null;
}
