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
      { rootMargin: "120% 120% 120% 120%" }
    );
    const els = document.querySelectorAll("img[data-src], [data-bg]");
    els.forEach((el) => io.observe(el));
    // horizontally pinned cards never "intersect" sideways until scrolled; load the whole garage once it is near
    const gar = document.querySelector(".garage");
    const gio = new IntersectionObserver((en) => {
      if (en[0]?.isIntersecting) { document.querySelectorAll(".garage img[data-src]").forEach(load); gio.disconnect(); }
    }, { rootMargin: "100% 0px" });
    if (gar) gio.observe(gar);
    // the mobile thumb bar steps aside while the final WhatsApp form is on screen
    const bar = document.querySelector(".mbar");
    const fin = document.querySelector(".final");
    const fio = new IntersectionObserver((en) => bar?.classList.toggle("away", !!en[0]?.isIntersecting), { threshold: 0.25 });
    if (fin) fio.observe(fin);
    return () => { io.disconnect(); gio.disconnect(); fio.disconnect(); };
  }, []);
  return null;
}
