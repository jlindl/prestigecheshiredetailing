// Animation libraries load after first paint, so they never sit in front of the content.
let p: Promise<{ gsap: typeof import("gsap").default; ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger }> | null = null;
export function loadGsap() {
  if (!p) {
    p = Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, s]) => {
      g.default.registerPlugin(s.ScrollTrigger);
      return { gsap: g.default, ScrollTrigger: s.ScrollTrigger };
    });
  }
  return p;
}
