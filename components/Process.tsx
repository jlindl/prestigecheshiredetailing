"use client";
import { useEffect, useRef, useState } from "react";
import { SWOOSH_BODY, SWOOSH_ROOF, SWOOSH_RED } from "./Icons";

// Signature moment. The car from Craig's logo is "worked on" as the visitor scrolls the six steps:
// mapped point by point, washed, decontaminated, polished from matte to gloss, prepped, then coated
// with a light sweep. It's a visual story of the prep, with no readings or numbers invented.
const POINTS = [[150, 156], [330, 140], [520, 142], [710, 151], [905, 162], [1080, 172], [470, 84], [720, 50], [905, 104]];
const SPECKS = [[210, 150], [380, 142], [560, 146], [640, 147], [820, 158], [990, 166], [600, 56], [800, 70]];
const STATUS = ["Mapping the paint", "Washing", "Decontaminating", "Polishing", "Prepping the panels", "Coated"];

export default function Process({ steps }: { steps: { t: string; d: string }[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i)); }),
      { rootMargin: "-45% 0px -45% 0px" }
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  // how much of the body has been brought to a gloss
  const gloss = active < 3 ? 0 : active === 3 ? 0.62 : 1;

  return (
    <div className="pro">
      <div className="pro-media" data-rv>
        <div className={`stage s${active}`} role="img" aria-label={`Illustration: ${STATUS[active]}`}>
          <svg viewBox="20 20 1170 260" aria-hidden="true">
            <defs>
              <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ffffff" />
                <stop offset="0.55" stopColor="#d9d9d6" />
                <stop offset="1" stopColor="#8d8d8a" />
              </linearGradient>
              <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#fff" stopOpacity="0" />
                <stop offset="0.5" stopColor="#fff" stopOpacity="0.95" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
              <clipPath id="car"><path d={SWOOSH_BODY} /><path d={SWOOSH_ROOF} /><path d={SWOOSH_RED} /></clipPath>
              <clipPath id="done"><rect className="done-rect" x="0" y="0" height="300" width="1200" style={{ transform: `scaleX(${gloss})` }} /></clipPath>
            </defs>

            {/* matte, uncorrected paint */}
            <g className="matte">
              <path d={SWOOSH_BODY} /><path d={SWOOSH_ROOF} /><path d={SWOOSH_RED} />
            </g>

            {/* corrected gloss, revealed by the polisher */}
            <g clipPath="url(#done)" className="glossy">
              <path d={SWOOSH_BODY} fill="url(#gl)" /><path d={SWOOSH_ROOF} fill="url(#gl)" /><path d={SWOOSH_RED} fill="#e01e19" />
            </g>

            {/* light sweep once coated */}
            <g clipPath="url(#car)"><rect className="sweep" x="-300" y="0" width="260" height="300" fill="url(#sheen)" transform="skewX(-20)" /></g>

            {/* 1 mapping: scan line and measuring points */}
            <line className="scan" x1="0" x2="0" y1="20" y2="285" />
            <g className="pts">{POINTS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="7" style={{ transitionDelay: `${i * 90}ms` }} />)}</g>

            {/* 2 wash: foam */}
            <g className="foam" clipPath="url(#car)">
              {Array.from({ length: 34 }, (_, i) => <circle key={i} cx={60 + ((i * 97) % 1100)} cy={50 + ((i * 53) % 210)} r={6 + (i % 4) * 3} />)}
            </g>

            {/* 3 decontamination: specks lifted away */}
            <g className="specks">{SPECKS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" style={{ transitionDelay: `${i * 70}ms` }} />)}</g>

            {/* 4 polish: the machine pad travelling across */}
            <g className="pad" style={{ transform: `translateX(${gloss * 1100}px)` }}>
              <circle cx="40" cy="140" r="42" />
              <circle cx="40" cy="140" r="24" />
            </g>
          </svg>
          <div className="stage-cap">
            <span className="stage-n">{String(active + 1).padStart(2, "0")}<i>/{String(steps.length).padStart(2, "0")}</i></span>
            <span className="stage-t">{STATUS[active]}</span>
          </div>
          <i className="stage-bar" style={{ transform: `scaleX(${(active + 1) / steps.length})` }} />
        </div>
      </div>
      <ol className="pro-list">
        {steps.map((s, i) => (
          <li key={s.t} ref={(el) => { refs.current[i] = el; }} data-i={i} className={i === active ? "on" : i < active ? "done" : ""}>
            <span className="pro-n">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
