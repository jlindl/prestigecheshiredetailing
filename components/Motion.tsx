"use client";
import { useEffect } from "react";
import type Lenis from "lenis";
import { loadGsap } from "@/lib/anim";

const EXPO = "expo.out";
const SMOOTH = "power3.out";

export default function Motion() {
  useEffect(() => {
    let cleanup = () => {};
    let dead = false;
    Promise.all([loadGsap(), import("lenis")]).then(([{ gsap, ScrollTrigger }, { default: LenisCtor }]) => {
    if (dead) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    if (reduce) root.classList.add("rm");

    // ---------- smooth scroll ----------
    let lenis: Lenis | null = null;
    const raf = (t: number) => lenis?.raf(t * 1000);
    if (!reduce) {
      lenis = new LenisCtor({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }
    const onAnchor = (e: Event) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href")!;
      const el = id === "#top" ? document.body : document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(el as HTMLElement, { offset: 0, duration: 1.6 });
      else (el as HTMLElement).scrollIntoView();
    };
    document.addEventListener("click", onAnchor);

    // ---------- header state ----------
    const hdr = document.querySelector(".hdr");
    const onScroll = () => hdr?.classList.toggle("scrolled", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // ---------- hero cursor specular ----------
    const hero = document.querySelector<HTMLElement>(".hero");
    const onMove = (e: MouseEvent) => {
      if (!hero) return;
      const r = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      hero.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    hero?.addEventListener("mousemove", onMove);

    const ctx = gsap.context(() => {
      gsap.to(".progress", { scaleX: 1, ease: "none", scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.3 } });

      if (reduce) return;

      // ---------- hero intro (fast, never blocks the CTAs) ----------

      gsap.to(".hero-bg", { yPercent: 10, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".hero-inner", { yPercent: -10, opacity: 0.2, ease: "none", scrollTrigger: { trigger: ".hero", start: "40% top", end: "bottom top", scrub: true } });

      // ---------- statement word light-up ----------
      gsap.to("[data-words] .w", {
        color: "#f2f1ed", stagger: 0.05, ease: "none",
        scrollTrigger: { trigger: "[data-words]", start: "top 82%", end: "bottom 45%", scrub: true },
      });

      // ---------- generic reveals ----------
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, { y: 36, opacity: 0, duration: 1, ease: EXPO, scrollTrigger: { trigger: el, start: "top 96%", once: true } });
      });

      // ---------- garage: photos reveal once, the strip itself auto-scrolls in CSS ----------
      gsap.utils.toArray<HTMLElement>(".car .ph").slice(0, 7).forEach((ph, i) => {
        gsap.from(ph, { clipPath: "inset(100% 0 0 0)", duration: 1.4, ease: "expo.inOut", delay: i * 0.08, scrollTrigger: { trigger: ".garage", start: "top 70%", once: true } });
      });

      // ---------- in-image parallax ----------
      gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((img) => {
        const s = parseFloat(img.dataset.speed || "0.1");
        gsap.fromTo(img, { yPercent: -s * 100 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
      });

      // ---------- coverage route ----------
      gsap.fromTo("[data-route]", { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: "[data-map]", start: "top 75%", end: "bottom 60%", scrub: 0.6 } });
      gsap.from("[data-town]", { opacity: 0, scale: 0.4, transformOrigin: "center", svgOrigin: undefined, duration: 0.9, ease: "back.out(2)", stagger: 0.09, scrollTrigger: { trigger: "[data-map]", start: "top 70%", once: true } });

      // ---------- proof counter ----------
      const num = null as HTMLElement | null; // the 100% is rendered final in HTML; no count-up that could show a wrong figure
      if (num) {
        const o = { v: 0 };
        gsap.to(o, { v: Number(num.dataset.count), duration: 2.2, ease: SMOOTH, onUpdate: () => (num.textContent = String(Math.round(o.v))), scrollTrigger: { trigger: num, start: "top 85%", once: true } });
      }

      // ---------- final stage ----------
      gsap.fromTo("[data-final-bg]", { scale: 1.2 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".final", start: "top bottom", end: "center center", scrub: true } });
      gsap.from(".final h2, .builder", { y: 60, opacity: 0, duration: 1.4, ease: EXPO, stagger: 0.12, scrollTrigger: { trigger: ".final", start: "top 65%", once: true } });

      // ---------- footer red line ----------
      gsap.fromTo("[data-rl]", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".wordmark", start: "top 95%", end: "bottom 80%", scrub: true } });
    });

    const refresh = () => { ScrollTrigger.sort(); ScrollTrigger.refresh(); };
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    refresh();

    cleanup = () => {
      ctx.revert();
      document.removeEventListener("click", onAnchor);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("load", refresh);
      hero?.removeEventListener("mousemove", onMove);
      gsap.ticker.remove(raf);
      lenis?.destroy();
    };
    });
    return () => { dead = true; cleanup(); };
  }, []);
  return null;
}
