"use client";
import { useEffect, useRef, useState } from "react";

// Signature moment: the photo stays pinned while each step lights up as it reaches the middle of the screen.
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

  return (
    <div className="pro">
      <div className="pro-media" data-rv>
        <div className="pro-ph">
          <img data-src="/img/pcd-70-sm.webp" data-srcset="/img/pcd-70-xs.webp 480w, /img/pcd-70-sm.webp 800w, /img/pcd-70.webp 1400w" sizes="(max-width: 760px) 92vw, 40vw" alt="Close-up of the deep gloss on a Range Rover Sport's rear panel and badge" decoding="async" loading="lazy" />
          <div className="pro-meter" aria-hidden="true">
            <span>Step</span>
            <b>{String(active + 1).padStart(2, "0")}</b>
            <span>of {String(steps.length).padStart(2, "0")}</span>
            <i style={{ transform: `scaleX(${(active + 1) / steps.length})` }} />
          </div>
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
