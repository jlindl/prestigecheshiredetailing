"use client";
import { useEffect, useRef, useState } from "react";
import { waLink } from "@/lib/site";
import { loadGsap } from "@/lib/anim";
import { WaIcon } from "./Icons";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const STEPS = [
  { t: "Prep the paint", d: "Paint needs to be clean before it is polished, so dirt isn't worked into it." },
  { t: "Machine polish", d: "Overlapping passes with a machine polisher level out the swirls and fine scratches." },
  { t: "Gyeon ceramic coating", d: "The corrected finish is sealed under a Gyeon coating, most often the 5-year one." },
];

// Stage boundaries along the scroll (0..1)
const POLISH_START = 0.14;
const POLISH_END = 0.8;

function rand(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

export default function PolishPass() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const meter = useRef<HTMLSpanElement>(null);
  const hint = useRef<HTMLSpanElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const cv = canvas.current!;
    const st = stage.current!;
    const ctx = cv.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, dpr = 1;
    let clean: HTMLCanvasElement | null = null;
    let swirled: HTMLCanvasElement | null = null;
    const mask = document.createElement("canvas");
    const mctx = mask.getContext("2d")!;
    // swirl lines only (transparent), used by the swirl-finder light to make remaining swirls flare up
    let lines: HTMLCanvasElement | null = null;
    const lmask = document.createElement("canvas");
    const lctx = lmask.getContext("2d")!;
    let path: { x: number; y: number }[] = [];
    let progress = reduce ? 1 : 0;
    let spin = 0;
    let visible = false;
    let torch: { x: number; y: number } | null = null;
    const img = new Image();
    const near = new IntersectionObserver((en) => { if (en[0]?.isIntersecting) { img.src = "/img/pcd-42.webp"; near.disconnect(); } }, { rootMargin: "60% 0px" });
    near.observe(st);

    const build = () => {
      if (!img.complete || !img.naturalWidth) return;
      const r = st.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      W = Math.max(2, Math.round(r.width * dpr));
      H = Math.max(2, Math.round(r.height * dpr));
      cv.width = W; cv.height = H; mask.width = W; mask.height = H; lmask.width = W; lmask.height = H;

      // cover-fit the real photo
      clean = document.createElement("canvas");
      clean.width = W; clean.height = H;
      const c = clean.getContext("2d")!;
      const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
      const iw = img.naturalWidth * s, ih = img.naturalHeight * s;
      c.drawImage(img, (W - iw) / 2, (H - ih) * 0.42, iw, ih);

      // swirled version: dulled, hazed, covered in circular micro-marring around light sources
      swirled = document.createElement("canvas");
      swirled.width = W; swirled.height = H;
      const w = swirled.getContext("2d")!;
      w.drawImage(clean, 0, 0);
      w.fillStyle = "rgba(128,130,138,0.42)";
      w.fillRect(0, 0, W, H);
      w.fillStyle = "rgba(20,20,24,0.18)";
      w.globalCompositeOperation = "multiply";
      w.fillRect(0, 0, W, H);
      w.globalCompositeOperation = "source-over";
      lines = document.createElement("canvas");
      lines.width = W; lines.height = H;
      const lw2 = lines.getContext("2d")!;
      const rnd = rand(7);
      // real swirl marks are concentric "holograms" around wherever the light reflects, so find the photo's brightest spots
      const SW = 48, SH = Math.max(8, Math.round((48 * H) / W));
      const probe = document.createElement("canvas"); probe.width = SW; probe.height = SH;
      const pc = probe.getContext("2d", { willReadFrequently: true })!;
      pc.drawImage(clean, 0, 0, SW, SH);
      const px = pc.getImageData(0, 0, SW, SH).data;
      const cells: { x: number; y: number; l: number }[] = [];
      for (let yy = 0; yy < SH; yy++) for (let xx = 0; xx < SW; xx++) {
        const i = (yy * SW + xx) * 4;
        cells.push({ x: xx, y: yy, l: px[i] * 0.3 + px[i + 1] * 0.59 + px[i + 2] * 0.11 });
      }
      cells.sort((p, q) => q.l - p.l);
      const centres: { x: number; y: number }[] = [];
      for (const cell of cells) {
        const x = ((cell.x + 0.5) / SW) * W, y = ((cell.y + 0.5) / SH) * H;
        if (centres.every((c0) => Math.hypot(c0.x - x, c0.y - y) > Math.min(W, H) * 0.3)) centres.push({ x, y });
        if (centres.length === 4) break;
      }
      // swirls are batched into a few paths by brightness, so thousands of arcs cost a handful of strokes
      const BUCKETS = 6;
      const paths = Array.from({ length: BUCKETS }, () => new Path2D());
      const D = Math.hypot(W, H);
      const count = Math.min(5200, Math.round((W * H) / (dpr * dpr) / 55));
      for (let i = 0; i < count; i++) {
        const cc = centres[i % centres.length];
        const rad = (8 + Math.pow(rnd(), 0.85) * D * 0.55) ;
        const a0 = rnd() * Math.PI * 2;
        const len = Math.min(1.1, ((22 + rnd() * 70) * dpr) / rad); // arc length roughly 22-90px, clearly curved
        const near = Math.max(0, 1 - rad / (D * 0.5));
        const bk = Math.min(BUCKETS - 1, Math.floor((0.25 + near * 0.75) * (0.4 + rnd() * 0.6) * BUCKETS));
        const pth = paths[bk];
        pth.moveTo(cc.x + Math.cos(a0) * rad, cc.y + Math.sin(a0) * rad);
        pth.arc(cc.x, cc.y, rad, a0, a0 + len);
      }
      // loose looping wash-sponge marks scattered across the panel
      for (let i = 0; i < 260; i++) {
        const x = rnd() * W, y = rnd() * H, r0 = (14 + rnd() * 60) * dpr, a0 = rnd() * Math.PI * 2;
        const pth = paths[1 + Math.floor(rnd() * 2)];
        pth.moveTo(x + Math.cos(a0) * r0, y + Math.sin(a0) * r0);
        pth.arc(x, y, r0, a0, a0 + 0.8 + rnd() * 2.2);
      }
      lw2.lineWidth = 0.85 * dpr;
      lw2.lineCap = "round";
      paths.forEach((pth, bk) => { lw2.strokeStyle = `rgba(255,255,255,${0.05 + (bk / (BUCKETS - 1)) * 0.36})`; lw2.stroke(pth); });
      w.drawImage(lines, 0, 0);

      // serpentine polishing path (overlapping section passes)
      const rows = W / dpr < 600 ? 5 : 4;
      const pad = H / rows;
      path = [];
      for (let rI = 0; rI < rows; rI++) {
        const y = pad * (rI + 0.5);
        const dir = rI % 2 === 0 ? 1 : -1;
        const N = 90;
        const m = pad * 1.25 * 0.38; // keep the pad fully inside the panel
        for (let i = 0; i <= N; i++) {
          const t = i / N;
          const x = dir > 0 ? m + t * (W - 2 * m) : W - m - t * (W - 2 * m);
          path.push({ x, y: y + Math.sin(t * Math.PI * 6 + rI) * pad * 0.08 });
        }
      }
      draw();
    };

    const draw = () => {
      if (!clean || !swirled) return;
      const pp = clamp01((progress - POLISH_START) / (POLISH_END - POLISH_START));
      const rows = W / dpr < 600 ? 5 : 4;
      const brush = (H / rows) * 1.25;

      // mask = swirled layer minus everything the pad has touched
      mctx.globalCompositeOperation = "copy";
      mctx.drawImage(swirled, 0, 0);
      const upto = Math.floor(pp * (path.length - 1));
      if (pp > 0 && upto > 0) {
        mctx.globalCompositeOperation = "destination-out";
        mctx.lineCap = "round"; mctx.lineJoin = "round";
        for (const [lw, a] of [[brush * 1.15, 0.45], [brush * 0.92, 1]] as const) {
          mctx.globalAlpha = a; mctx.lineWidth = lw;
          mctx.beginPath(); mctx.moveTo(path[0].x, path[0].y);
          for (let i = 1; i <= upto; i++) mctx.lineTo(path[i].x, path[i].y);
          mctx.stroke();
        }
        mctx.globalAlpha = 1;
      }
      if (pp >= 0.999) mctx.clearRect(0, 0, W, H);
      const erase = (c2: CanvasRenderingContext2D) => {
        if (!(pp > 0 && upto > 0)) return;
        c2.globalCompositeOperation = "destination-out";
        c2.lineCap = "round"; c2.lineJoin = "round"; c2.lineWidth = brush * 1.15;
        c2.beginPath(); c2.moveTo(path[0].x, path[0].y);
        for (let i = 1; i <= upto; i++) c2.lineTo(path[i].x, path[i].y);
        c2.stroke();
        c2.globalCompositeOperation = "source-over";
      };

      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(clean, 0, 0);
      ctx.drawImage(mask, 0, 0);

      // coating stage: a slow specular sheen sweeps across the finished panel
      if (progress > POLISH_END) {
        const cp = (progress - POLISH_END) / (1 - POLISH_END);
        const x = -W * 0.4 + cp * W * 1.8;
        const g = ctx.createLinearGradient(x - W * 0.25, 0, x + W * 0.25, H * 0.3);
        g.addColorStop(0, "rgba(255,255,255,0)");
        g.addColorStop(0.5, `rgba(255,255,255,${0.22 * Math.sin(cp * Math.PI)})`);
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = "source-over";
      }

      // polisher pad
      if (pp > 0 && pp < 1) {
        const p = path[Math.min(upto, path.length - 1)];
        const R = brush * 0.36;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.shadowColor = "rgba(0,0,0,.6)"; ctx.shadowBlur = 30 * dpr;
        const pg = ctx.createRadialGradient(0, 0, R * 0.1, 0, 0, R);
        pg.addColorStop(0, "#2a2a2e"); pg.addColorStop(0.72, "#151518"); pg.addColorStop(0.74, "#e3120b"); pg.addColorStop(0.8, "#b30e08"); pg.addColorStop(1, "#0d0d0f");
        ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.rotate(spin);
        ctx.strokeStyle = "rgba(255,255,255,.22)"; ctx.lineWidth = 1.4 * dpr;
        for (let i = 0; i < 10; i++) { ctx.rotate((Math.PI * 2) / 10); ctx.beginPath(); ctx.moveTo(R * 0.18, 0); ctx.lineTo(R * 0.66, 0); ctx.stroke(); }
        // specular highlight sweeping round the spinning pad, plus a faint motion-blur halo
        const hl = ctx.createLinearGradient(-R, 0, R, 0);
        hl.addColorStop(0, "rgba(255,255,255,0)"); hl.addColorStop(0.5, "rgba(255,255,255,.28)"); hl.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = hl; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, R * 0.7, -0.5, 0.5); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "rgba(255,42,31,.35)"; ctx.lineWidth = 3 * dpr;
        ctx.beginPath(); ctx.arc(0, 0, R * 1.08, spin * 0.3, spin * 0.3 + Math.PI * 1.2); ctx.stroke();
        ctx.fillStyle = "#f2f1ed"; ctx.beginPath(); ctx.arc(0, 0, R * 0.1, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      // swirl-finder torch: the cursor/finger becomes an inspection light
      if (torch) {
        const TR = Math.min(W, H) * 0.2;
        ctx.save();
        ctx.beginPath(); ctx.arc(torch.x, torch.y, TR, 0, Math.PI * 2); ctx.clip();
        // remaining swirls flare under the light, exactly as under a detailer's inspection torch
        if (lines && pp < 0.999) {
          lctx.globalCompositeOperation = "copy";
          lctx.drawImage(lines, 0, 0);
          erase(lctx);
          ctx.globalCompositeOperation = "lighter";
          ctx.drawImage(lmask, 0, 0); ctx.drawImage(lmask, 0, 0); ctx.drawImage(lmask, 0, 0);
        }
        ctx.globalCompositeOperation = "screen";
        const tg = ctx.createRadialGradient(torch.x, torch.y, 0, torch.x, torch.y, TR);
        tg.addColorStop(0, "rgba(255,250,240,.38)"); tg.addColorStop(0.55, "rgba(255,250,240,.10)"); tg.addColorStop(1, "rgba(255,250,240,0)");
        ctx.fillStyle = tg; ctx.fillRect(torch.x - TR, torch.y - TR, TR * 2, TR * 2);
        ctx.restore();
        ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 1 * dpr;
        ctx.beginPath(); ctx.arc(torch.x, torch.y, TR, 0, Math.PI * 2); ctx.stroke();
      }

      if (meter.current) meter.current.textContent = String(Math.round(pp * 100));
    };

    const tick = () => { if (!visible) return; spin += 0.32; draw(); };

    const onPtr = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      torch = { x: (e.clientX - r.left) * dpr, y: (e.clientY - r.top) * dpr };
      if (hint.current) hint.current.style.opacity = "0";
      draw();
    };
    const offPtr = () => { torch = null; draw(); };
    st.addEventListener("pointermove", onPtr);
    st.addEventListener("pointerdown", onPtr);
    st.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") offPtr(); });
    let offT: ReturnType<typeof setTimeout> | undefined;
    st.addEventListener("pointerup", (e) => { if (e.pointerType !== "mouse") { clearTimeout(offT); offT = setTimeout(offPtr, 1400); } });

    img.onload = () => {
      const ric = (window as unknown as { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback;
      if (ric) ric(build); else setTimeout(build, 50);
    };
    if (img.complete) build();
    const ro = new ResizeObserver(() => build());
    ro.observe(st);

    let trig: { kill: () => void } | null = null;
    let removeTick = () => {};
    let dead = false;
    if (!reduce) {
      loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (dead) return;
      trig = ScrollTrigger.create({
        refreshPriority: 2,
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        onUpdate: (self) => {
          progress = self.progress;
          const s = progress < POLISH_START ? 0 : progress < POLISH_END ? 1 : 2;
          setStep((prev) => (prev === s ? prev : s));
          draw();
        },
        onToggle: (self) => { visible = self.isActive; },
      });
      gsap.ticker.add(tick);
      removeTick = () => gsap.ticker.remove(tick);
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
      });
    } else {
      setStep(2);
    }

    return () => { near.disconnect(); st.removeEventListener("pointermove", onPtr); st.removeEventListener("pointerdown", onPtr);  ro.disconnect(); dead = true; trig?.kill(); removeTick(); };
  }, []);

  return (
    <section className="polish" id="process" ref={root} aria-labelledby="pol-h">
      <div className="polish-sticky">
      <div className="polish-grid">
        <div className="polish-copy">
          <span className="mono eyebrow">The process<span className="scroll-cue"> · scroll to polish</span></span>
          <h2 id="pol-h" className="display polish-h">Watch the swirls <span className="red">come out.</span></h2>
          <ol className="steps">
            {STEPS.map((s, i) => (
              <li key={s.t} className={i === step ? "on" : ""}>
                <span className="mono">0{i + 1}</span>
                <span className="t">{s.t}</span>
                <p>{s.d}</p>
              </li>
            ))}
          </ol>
          <div className="meter">
            <span className="n"><span ref={meter}>0</span>%</span>
            <span className="mono" style={{ color: "var(--mist)" }}>Polish progress</span>
          </div>
        </div>
        <div className="polish-stage" ref={stage}>
          <canvas ref={canvas} role="img" aria-label="Illustration: swirl marks drawn digitally over a photo of a black Range Rover panel, cleared by an animated machine polisher" />
          <div className="polish-hud mono">
            <span>Illustration · swirls added digitally</span>
            <span>{step === 0 ? "Swirled" : step === 1 ? "Polishing" : "Finished"}</span>
          </div>
          <span className="torch-hint mono" ref={hint} style={{ opacity: step === 2 ? 0 : 1 }}>Swirl-finder light<span className="hide-m"> · hover or touch the panel</span></span>
          <a
            href={waLink("Hi Craig, I'd like my paint corrected and coated. Could you give me a quote? ")}
            target="_blank"
            rel="noopener"
            className="btn btn-red"
            style={{ position: "absolute", right: 14, bottom: 14, ["--h" as string]: "48px", fontSize: 14, padding: "0 8px 0 20px", opacity: step === 2 ? 1 : 0, transform: step === 2 ? "none" : "translateY(10px)", pointerEvents: step === 2 ? "auto" : "none" }}
          >
            Get this for your car <span className="ico" style={{ width: 34, height: 34 }}><WaIcon /></span>
          </a>
        </div>
      </div>
      </div>
    </section>
  );
}
