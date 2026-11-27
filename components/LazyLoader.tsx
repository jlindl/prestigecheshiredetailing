"use client";
import { useEffect } from "react";

/** Loads [data-src] images and [data-bg] backgrounds only as they approach the viewport. */
export default function LazyLoader() {
  useEffect(() => {
    const load = (el: Element) => {
      const h = el as HTMLElement;
      if (h.dataset.srcset) h.setAttribute("srcset", h.dataset.srcset);
      if (h.dataset.src) h.setAttribute("src", h.dataset.src);
      if (h.hasAttribute("data-bg")) h.classList.add("bg-on");
      h.removeAttribute("data-src");
    };
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { load(e.target); io.unobserve(e.target); } }),
      { rootMargin: "60% 0px 60% 0px" }
    );
    const els = document.querySelectorAll("img[data-src], [data-bg]");
    els.forEach((el) => io.observe(el));
    // the garage strip scrolls sideways on its own: load its main photos once it is near,
    // pause the loop while it is off screen, and fetch the hover angles only on devices that can hover
    const gar = document.querySelector(".garage");
    const view = document.querySelector(".garage-view");
    const gio = new IntersectionObserver((en) => {
      const on = !!en[0]?.isIntersecting;
      view?.classList.toggle("is-off", !on);
      if (on) document.querySelectorAll(".garage img[data-src]").forEach(load);
    }, { rootMargin: "40% 0px" });
    if (gar) gio.observe(gar);
    const loadAlts = () => {
      document.querySelectorAll<HTMLImageElement>("img[data-alt-src]").forEach((im) => {
        if (im.dataset.altSrcset) im.setAttribute("srcset", im.dataset.altSrcset);
        im.setAttribute("src", im.dataset.altSrc!);
        im.removeAttribute("data-alt-src");
      });
    };
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (canHover) view?.addEventListener("pointerenter", loadAlts, { once: true });
    // magnetic WhatsApp buttons: one delegated listener, desktop only, one style write per frame
    let mag: HTMLElement | null = null, mRaf = 0, mx = 0, my = 0;
    const onMag = (e: PointerEvent) => {
      const t = (e.target as Element | null)?.closest<HTMLElement>("[data-magnet]") ?? null;
      if (t !== mag) { if (mag) mag.style.transform = ""; mag = t; }
      if (!mag) return;
      mx = e.clientX; my = e.clientY;
      if (mRaf) return;
      mRaf = requestAnimationFrame(() => {
        mRaf = 0;
        if (!mag) return;
        const r = mag.getBoundingClientRect();
        mag.style.transform = `translate(${(mx - (r.left + r.width / 2)) * 0.18}px, ${(my - (r.top + r.height / 2)) * 0.3}px)`;
      });
    };
    if (canHover) document.addEventListener("pointermove", onMag, { passive: true });
    // header gets its solid background as soon as the page scrolls (no dependency on the animation libraries)
    const hdr = document.querySelector(".hdr");
    const onScroll = () => hdr?.classList.toggle("scrolled", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    // the mobile thumb bar steps aside while the final WhatsApp form is on screen
    const bar = document.querySelector(".mbar");
    const showing = new Map<Element, boolean>();
    const fio = new IntersectionObserver((en) => {
      en.forEach((e) => showing.set(e.target, e.isIntersecting));
      bar?.classList.toggle("away", [...showing.values()].some(Boolean));
    }, { threshold: 0.25 });
    // the final form has its own send button
    document.querySelectorAll(".final").forEach((el) => fio.observe(el));
    return () => { io.disconnect(); gio.disconnect(); fio.disconnect(); window.removeEventListener("scroll", onScroll); document.removeEventListener("pointermove", onMag); };
  }, []);
  return null;
}
