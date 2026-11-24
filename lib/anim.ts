// Animation libraries load on first interaction, so they never compete with first paint or the hero text.
type Libs = { gsap: typeof import("gsap").default; ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger };
let p: Promise<Libs> | null = null;

function afterIdle(): Promise<void> {
  // start on the visitor's first interaction (or after a quiet fallback), never during first load
  return new Promise((res) => {
    let done = false;
    const evs = ["scroll", "wheel", "touchstart", "pointerdown", "pointermove", "keydown"];
    const go = () => {
      if (done) return;
      done = true;
      evs.forEach((e) => window.removeEventListener(e, go));
      res();
    };
    evs.forEach((e) => window.addEventListener(e, go, { passive: true, once: true }));
    const arm = () => setTimeout(go, 6000);
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });
  });
}

export function loadGsap() {
  if (!p) {
    p = afterIdle()
      .then(() => Promise.all([import("gsap"), import("gsap/ScrollTrigger")]))
      .then(([g, s]) => {
        g.default.registerPlugin(s.ScrollTrigger);
        return { gsap: g.default, ScrollTrigger: s.ScrollTrigger };
      });
  }
  return p;
}
