"use client";
import { useEffect } from "react";

// One small client script for the whole page: lazy images, scroll reveals, header state,
// hero parallax, map drawing, pausing loops off screen, magnetic buttons on desktop,
// and Lenis smooth scrolling once the page has finished loading. No animation library on first load.
export default function Effects() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduce) root.classList.add("rm");
    root.classList.add("js");

    // lazy images
    const load = (img: HTMLImageElement) => {
      if (img.dataset.srcset) img.srcset = img.dataset.srcset;
      if (img.dataset.src) img.src = img.dataset.src;
      img.removeAttribute("data-src");
    };
    const lio = new IntersectionObserver((en) => en.forEach((e) => { if (e.isIntersecting) { load(e.target as HTMLImageElement); lio.unobserve(e.target); } }), { rootMargin: "70% 0px" });
    document.querySelectorAll<HTMLImageElement>("img[data-src]").forEach((i) => { if (!i.closest("[data-gal]")) lio.observe(i); });

    // gallery: load its photos when near, pause the loops when off screen
    const gal = document.querySelector<HTMLElement>("[data-gal]");
    const gio = new IntersectionObserver((en) => {
      const on = !!en[0]?.isIntersecting;
      gal?.classList.toggle("off", !on);
      if (on) gal?.querySelectorAll<HTMLImageElement>("img[data-src]").forEach(load);
    }, { rootMargin: "50% 0px" });
    if (gal) { gal.classList.add("off"); gio.observe(gal); }

    // the trust strip only moves while visible
    const strip = document.querySelector(".strip");
    const sio = new IntersectionObserver((en) => strip?.classList.toggle("off", !en[0]?.isIntersecting));
    if (strip) sio.observe(strip);

    // reveals
    const rio = new IntersectionObserver((en) => en.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); rio.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll("[data-rv]").forEach((el) => rio.observe(el));

    // map draws itself in when it arrives
    const map = document.querySelector(".map");
    const mio = new IntersectionObserver((en) => { if (en[0]?.isIntersecting) { map?.classList.add("on"); mio.disconnect(); } }, { threshold: 0.35 });
    if (map) mio.observe(map);

    // header + hero parallax (one rAF per scroll frame)
    const nav = document.querySelector("[data-nav]");
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    const bar = document.querySelector(".mbar");
    const final = document.querySelector(".final");
    let ticking = false;
    const frame = () => {
      ticking = false;
      const y = window.scrollY;
      nav?.classList.toggle("solid", y > 30);
      if (hero && !reduce && y < window.innerHeight * 1.2) hero.style.transform = `translate3d(0, ${y * 0.22}px, 0) scale(${1 + y * 0.00012})`;
      if (bar && final) {
        const r = final.getBoundingClientRect();
        bar.classList.toggle("away", r.top < window.innerHeight * 0.6 && r.bottom > 0);
      }
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
    frame();
    window.addEventListener("scroll", onScroll, { passive: true });

    // magnetic buttons, desktop only
    let mag: HTMLElement | null = null, mr = 0, mx = 0, my = 0;
    const onMag = (e: PointerEvent) => {
      const t = (e.target as Element | null)?.closest<HTMLElement>("[data-magnet]") ?? null;
      if (t !== mag) { if (mag) mag.style.transform = ""; mag = t; }
      if (!mag) return;
      mx = e.clientX; my = e.clientY;
      if (mr) return;
      mr = requestAnimationFrame(() => {
        mr = 0;
        if (!mag) return;
        const r = mag.getBoundingClientRect();
        mag.style.transform = `translate(${(mx - (r.left + r.width / 2)) * 0.16}px, ${(my - (r.top + r.height / 2)) * 0.28}px)`;
      });
    };
    if (canHover && !reduce) document.addEventListener("pointermove", onMag, { passive: true });

    // smooth scrolling arrives after load, on devices with a wheel
    let lenis: { raf: (t: number) => void; destroy: () => void; scrollTo: (el: Element, o?: object) => void } | null = null;
    let raf = 0;
    const startLenis = () => {
      if (reduce || !canHover) return;
      import("lenis").then(({ default: Lenis }) => {
        lenis = new Lenis({ duration: 1.1, easing: (t: number) => 1 - Math.pow(1 - t, 4) }) as unknown as typeof lenis;
        const loop = (t: number) => { lenis?.raf(t); raf = requestAnimationFrame(loop); };
        raf = requestAnimationFrame(loop);
      });
    };
    const onAnchor = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a || !lenis) return;
      const el = document.querySelector(a.getAttribute("href")!);
      if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: -70 }); }
    };
    document.addEventListener("click", onAnchor);
    const idle = () => ("requestIdleCallback" in window ? (window as Window & { requestIdleCallback: (f: () => void, o?: object) => void }).requestIdleCallback(startLenis, { timeout: 2000 }) : setTimeout(startLenis, 300));
    if (document.readyState === "complete") idle(); else window.addEventListener("load", idle, { once: true });

    return () => {
      [lio, gio, sio, rio, mio].forEach((o) => o.disconnect());
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointermove", onMag);
      document.removeEventListener("click", onAnchor);
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);
  return null;
}
