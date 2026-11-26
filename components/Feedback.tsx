"use client";
import { useCallback, useEffect, useRef, useState } from "react";

// Pin-and-comment review layer (BugSmash style). Only loads on ?feedback links, see FeedbackGate.

type Anchor = { path: string; x: number; y: number; section: string; sectionPath: string; sx: number; sy: number; snippet: string };
type Note = { id: string; n: number; text: string; author: string; status: "open" | "resolved"; anchor: Anchor; device: string; createdAt: string };
type Draft = { anchor: Anchor };

const API = "/api/feedback";
const UI = "[data-fb-ui]";

function cssPath(el: Element): string {
  const parts: string[] = [];
  let node: Element | null = el;
  while (node && node !== document.body && node.parentElement) {
    const i = Array.prototype.indexOf.call(node.parentElement.children, node) + 1;
    parts.unshift(`${node.tagName.toLowerCase()}:nth-child(${i})`);
    node = node.parentElement;
  }
  return parts.length ? `body > ${parts.join(" > ")}` : "body";
}

function sectionOf(el: Element): Element {
  return el.closest("section, header, footer, .mbar") ?? document.body;
}

function sectionLabel(sec: Element): string {
  if (sec.matches("header")) return "Header";
  if (sec.matches("footer")) return "Footer";
  if (sec.matches(".mbar")) return "Mobile button bar";
  const h = sec.querySelector("h1, h2");
  const t = (h?.textContent || sec.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim();
  return t.slice(0, 70) || "Page";
}

function snippetOf(el: Element): string {
  const img = el.closest("img") as HTMLImageElement | null;
  if (img?.alt) return `Image: ${img.alt}`.slice(0, 110);
  const t = ((el as HTMLElement).innerText || el.textContent || "").replace(/\s+/g, " ").trim();
  return t.slice(0, 110);
}

function resolve(sel: string): Element | null {
  try { return sel ? document.querySelector(sel) : null; } catch { return null; }
}

function point(a: Anchor): { x: number; y: number } | null {
  const tryEl = (sel: string, fx: number, fy: number) => {
    const el = resolve(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return null;
    return { x: r.left + fx * r.width, y: r.top + fy * r.height };
  };
  return tryEl(a.path, a.x, a.y) ?? tryEl(a.sectionPath, a.sx, a.sy);
}

function ago(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function Feedback() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [placing, setPlacing] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [panel, setPanel] = useState(false);
  const [filter, setFilter] = useState<"open" | "resolved" | "all">("open");
  const [hidePins, setHidePins] = useState(false);
  const [intro, setIntro] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  const pinRefs = useRef(new Map<string, HTMLButtonElement>());
  const draftPin = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const notesRef = useRef<Note[]>([]);
  notesRef.current = notes;

  const flash = (m: string) => { setToast(m); window.setTimeout(() => setToast(""), 2200); };

  const load = useCallback(async () => {
    try {
      const r = await fetch(API, { cache: "no-store" });
      const j = await r.json();
      setNotes(j.notes ?? []);
    } catch { /* offline: keep what we have */ }
  }, []);

  useEffect(() => {
    load();
    try {
      setName(localStorage.getItem("fb-name") || "");
      if (!localStorage.getItem("fb-intro")) setIntro(true);
    } catch { /* storage blocked */ }
    const t = window.setInterval(load, 30000);
    return () => window.clearInterval(t);
  }, [load]);

  // Keep every pin glued to its element each frame (handles GSAP, sticky scenes, resizes, scrolling).
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      for (const n of notesRef.current) {
        const el = pinRefs.current.get(n.id);
        if (!el) continue;
        const p = point(n.anchor);
        if (!p) { el.style.display = "none"; continue; }
        el.style.display = "";
        el.style.transform = `translate(${p.x}px, ${p.y}px)`;
      }
      const activeAnchor = draftAnchorRef.current ?? notesRef.current.find((n) => n.id === activeIdRef.current)?.anchor;
      if (activeAnchor) {
        const p = point(activeAnchor);
        if (p && draftPin.current) draftPin.current.style.transform = `translate(${p.x}px, ${p.y}px)`;
        if (p && popRef.current) {
          const w = popRef.current.offsetWidth, h = popRef.current.offsetHeight;
          const vw = window.innerWidth, vh = window.innerHeight;
          let left = p.x + 22, top = p.y - 18;
          if (vw < 560) {
            left = 12;
            top = p.y + 16 + h > vh - 170 ? p.y - h - 44 : p.y + 16;
          } else if (left + w > vw - 12) left = p.x - w - 22;
          left = Math.max(12, Math.min(left, vw - w - 12));
          top = Math.max(12, Math.min(top, vh - h - 12));
          popRef.current.style.transform = `translate(${left}px, ${top}px)`;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const draftAnchorRef = useRef<Anchor | null>(null);
  draftAnchorRef.current = draft?.anchor ?? null;
  const activeIdRef = useRef<string | null>(null);
  activeIdRef.current = activeId;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (draft) setDraft(null);
      else if (placing) setPlacing(false);
      else if (activeId) setActiveId(null);
      else if (panel) setPanel(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [draft, placing, activeId, panel]);

  const onPlace = (e: React.MouseEvent) => {
    const ov = overlayRef.current;
    if (!ov) return;
    ov.style.pointerEvents = "none";
    let target = document.elementFromPoint(e.clientX, e.clientY);
    ov.style.pointerEvents = "";
    if (!target || target.closest(UI)) return;
    while (target.parentElement && target !== document.body) {
      const r = target.getBoundingClientRect();
      if (r.width >= 12 && r.height >= 12) break;
      target = target.parentElement;
    }
    const r = target.getBoundingClientRect();
    const sec = sectionOf(target);
    const sr = sec.getBoundingClientRect();
    const anchor: Anchor = {
      path: cssPath(target),
      x: (e.clientX - r.left) / Math.max(1, r.width),
      y: (e.clientY - r.top) / Math.max(1, r.height),
      section: sectionLabel(sec),
      sectionPath: cssPath(sec),
      sx: (e.clientX - sr.left) / Math.max(1, sr.width),
      sy: (e.clientY - sr.top) / Math.max(1, sr.height),
      snippet: snippetOf(target),
    };
    setPlacing(false);
    setActiveId(null);
    setText("");
    setDraft({ anchor });
  };

  const post = async () => {
    if (!draft || !text.trim() || busy) return;
    setBusy(true);
    try {
      try { localStorage.setItem("fb-name", name.trim()); } catch { /* ignore */ }
      const r = await fetch(API, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          text, author: name.trim(), anchor: draft.anchor, vw: window.innerWidth,
          device: window.matchMedia("(max-width: 820px)").matches ? "mobile" : "desktop",
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Couldn't save");
      setNotes((ns) => [...ns, j.note]);
      setDraft(null);
      setText("");
      flash(`Note #${j.note.n} saved`);
    } catch (err) {
      flash(err instanceof Error ? err.message : "Couldn't save, try again");
    } finally {
      setBusy(false);
    }
  };

  const setStatus = async (n: Note, status: Note["status"]) => {
    setNotes((ns) => ns.map((x) => (x.id === n.id ? { ...x, status } : x)));
    await fetch(`${API}?id=${n.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status }) }).catch(() => load());
  };

  const remove = async (n: Note) => {
    if (!window.confirm(`Delete note #${n.n}?`)) return;
    setNotes((ns) => ns.filter((x) => x.id !== n.id));
    setActiveId(null);
    await fetch(`${API}?id=${n.id}`, { method: "DELETE" }).catch(() => load());
  };

  const goTo = (n: Note) => {
    const el = resolve(n.anchor.path) ?? resolve(n.anchor.sectionPath);
    if (el) {
      const r = el.getBoundingClientRect();
      const y = window.scrollY + r.top + n.anchor.y * r.height - window.innerHeight / 2;
      window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    }
    setDraft(null);
    setActiveId(n.id);
    if (window.innerWidth < 820) setPanel(false);
  };

  const copyAll = async () => {
    try {
      const md = await (await fetch(`${API}?format=md`, { cache: "no-store" })).text();
      await navigator.clipboard.writeText(md);
      flash("All notes copied");
    } catch { flash("Couldn't copy"); }
  };

  const visible = notes.filter((n) => (filter === "all" ? true : n.status === filter));
  const openCount = notes.filter((n) => n.status === "open").length;
  const active = notes.find((n) => n.id === activeId) ?? null;

  return (
    <div data-fb-ui className="fb-root" data-lenis-prevent>
      <style>{CSS}</style>

      {!hidePins && notes.map((n) => (
        <button
          key={n.id}
          ref={(el) => { if (el) pinRefs.current.set(n.id, el); else pinRefs.current.delete(n.id); }}
          className={`fb-pin${n.status === "resolved" ? " done" : ""}${n.id === activeId ? " on" : ""}`}
          style={{ display: "none" }}
          onClick={(e) => { e.stopPropagation(); setDraft(null); setActiveId(n.id === activeId ? null : n.id); }}
          aria-label={`Note ${n.n}`}
        >
          <span>{n.n}</span>
        </button>
      ))}

      {placing && (
        <div ref={overlayRef} className="fb-overlay" onClick={onPlace}>
          <div className="fb-hint">Click or tap the bit you want changed <kbd>Esc</kbd> to cancel</div>
        </div>
      )}

      {(draft || active) && <div ref={draftPin} className={`fb-pin ghost${active ? " hidden" : ""}`}><span>{draft ? "+" : ""}</span></div>}

      {draft && (
        <div ref={popRef} className="fb-pop">
          <div className="fb-pop-sec">{draft.anchor.section}</div>
          <textarea
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) post(); }}
            placeholder="What would you like changed here?"
            rows={4}
          />
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" maxLength={60} />
          <div className="fb-row">
            <button className="fb-btn ghost" onClick={() => setDraft(null)}>Cancel</button>
            <button className="fb-btn red" onClick={post} disabled={!text.trim() || busy}>{busy ? "Saving" : "Save note"}</button>
          </div>
        </div>
      )}

      {active && !draft && (
        <div ref={popRef} className="fb-pop">
          <div className="fb-pop-head">
            <span className={`fb-num${active.status === "resolved" ? " done" : ""}`}>{active.n}</span>
            <div>
              <b>{active.author || "Client"}</b>
              <small>{ago(active.createdAt)} on {active.device}</small>
            </div>
            <button className="fb-x" onClick={() => setActiveId(null)} aria-label="Close">×</button>
          </div>
          <p className="fb-text">{active.text}</p>
          <div className="fb-pop-sec">{active.anchor.section}</div>
          <div className="fb-row">
            <button className="fb-btn ghost" onClick={() => remove(active)}>Delete</button>
            {active.status === "open"
              ? <button className="fb-btn" onClick={() => setStatus(active, "resolved")}>Mark done</button>
              : <button className="fb-btn" onClick={() => setStatus(active, "open")}>Reopen</button>}
          </div>
        </div>
      )}

      {panel && (
        <aside className="fb-panel">
          <div className="fb-panel-head">
            <b>Notes</b>
            <button className="fb-x" onClick={() => setPanel(false)} aria-label="Close">×</button>
          </div>
          <div className="fb-tabs">
            {(["open", "resolved", "all"] as const).map((f) => (
              <button key={f} className={filter === f ? "on" : ""} onClick={() => setFilter(f)}>
                {f === "open" ? `Open (${openCount})` : f === "resolved" ? `Done (${notes.length - openCount})` : `All (${notes.length})`}
              </button>
            ))}
          </div>
          <div className="fb-list">
            {visible.length === 0 && <p className="fb-empty">{notes.length ? "Nothing here." : "No notes yet. Press Comment and click anywhere on the page."}</p>}
            {visible.map((n) => (
              <button key={n.id} className={`fb-item${n.id === activeId ? " on" : ""}`} onClick={() => goTo(n)}>
                <span className={`fb-num${n.status === "resolved" ? " done" : ""}`}>{n.n}</span>
                <span className="fb-item-body">
                  <span className="fb-item-sec">{n.anchor.section}</span>
                  <span className="fb-item-text">{n.text}</span>
                  <small>{n.author || "Client"} · {ago(n.createdAt)}</small>
                </span>
              </button>
            ))}
          </div>
          {notes.length > 0 && <button className="fb-btn ghost wide" onClick={copyAll}>Copy all notes</button>}
        </aside>
      )}

      {intro && (
        <div className="fb-intro">
          <b>Tell us what to change</b>
          <p>Press <strong>Comment</strong>, then click or tap any part of the page and type your note. Add as many as you like. They save automatically.</p>
          <button className="fb-btn red" onClick={() => { setIntro(false); try { localStorage.setItem("fb-intro", "1"); } catch { /* ignore */ } }}>Got it</button>
        </div>
      )}

      <div className="fb-bar">
        <button className={`fb-bar-btn main${placing ? " on" : ""}`} onClick={() => { setDraft(null); setActiveId(null); setPlacing((p) => !p); }}>
          <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 14.5z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
          {placing ? "Cancel" : "Comment"}
        </button>
        <button className={`fb-bar-btn${panel ? " on" : ""}`} onClick={() => setPanel((p) => !p)}>
          Notes <span className="fb-count">{openCount}</span>
        </button>
        <button className="fb-bar-btn icon" onClick={() => setHidePins((h) => !h)} aria-label={hidePins ? "Show pins" : "Hide pins"} title={hidePins ? "Show pins" : "Hide pins"}>
          <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden>
            <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
            {hidePins && <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" />}
          </svg>
        </button>
      </div>

      {toast && <div className="fb-toast">{toast}</div>}
    </div>
  );
}

const CSS = `
.fb-root { --fb-red: #e3120b; --fb-bg: rgba(15,16,19,.94); --fb-line: rgba(242,241,237,.14); --fb-txt: #f2f1ed; --fb-dim: #a3a5ab;
  font-family: var(--font-archivo), system-ui, sans-serif; color: var(--fb-txt); }
.fb-root button { font: inherit; color: inherit; cursor: pointer; }
.fb-pin { position: fixed; left: 0; top: 0; z-index: 2147483600; width: 30px; height: 30px; margin: -30px 0 0 -2px; padding: 0;
  border: 2px solid #fff; border-radius: 50% 50% 50% 4px; background: var(--fb-red); box-shadow: 0 6px 18px rgba(0,0,0,.45);
  display: grid; place-items: center; font-family: var(--font-mono), monospace; font-size: 12px; font-weight: 500; color: #fff; will-change: transform; }
.fb-pin span { display: block; line-height: 1; }
.fb-pin.done { background: #2f9e5b; opacity: .75; }
.fb-pin.on { outline: 3px solid rgba(227,18,11,.35); outline-offset: 2px; }
.fb-pin.ghost { pointer-events: none; z-index: 2147483601; background: #fff; color: var(--fb-red); border-color: var(--fb-red); font-size: 16px; }
.fb-pin.ghost.hidden { opacity: 0; }
.fb-overlay { position: fixed; inset: 0; z-index: 2147483500; cursor: crosshair; background: rgba(227,18,11,.04); box-shadow: inset 0 0 0 3px var(--fb-red); }
.fb-hint { position: fixed; top: 76px; left: 50%; transform: translateX(-50%); background: var(--fb-red); color: #fff; padding: 9px 16px;
  border-radius: 999px; font-size: 14px; font-weight: 600; white-space: nowrap; pointer-events: none; box-shadow: 0 8px 24px rgba(0,0,0,.4); }
.fb-hint kbd { font-family: var(--font-mono), monospace; font-size: 11px; background: rgba(0,0,0,.25); padding: 2px 6px; border-radius: 5px; margin-left: 8px; }
.fb-pop { position: fixed; left: 0; top: 0; z-index: 2147483602; width: min(320px, calc(100vw - 24px)); padding: 14px; border-radius: 16px;
  background: var(--fb-bg); border: 1px solid var(--fb-line); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
  box-shadow: 0 20px 50px rgba(0,0,0,.55); display: grid; gap: 10px; }
.fb-pop textarea, .fb-pop input { width: 100%; box-sizing: border-box; background: rgba(242,241,237,.06); border: 1px solid var(--fb-line);
  border-radius: 10px; color: var(--fb-txt); padding: 10px 12px; font: inherit; font-size: 15px; resize: vertical; outline: none; }
.fb-pop textarea:focus, .fb-pop input:focus { border-color: var(--fb-red); }
.fb-pop-sec, .fb-item-sec { font-family: var(--font-mono), monospace; font-size: 11px; letter-spacing: .04em; text-transform: uppercase; color: var(--fb-dim);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.fb-pop-head { display: flex; align-items: center; gap: 10px; }
.fb-pop-head b { display: block; font-size: 14px; }
.fb-pop-head small, .fb-item small { color: var(--fb-dim); font-size: 12px; }
.fb-pop-head > div { flex: 1; min-width: 0; }
.fb-text { margin: 0; font-size: 15px; line-height: 1.45; white-space: pre-wrap; word-break: break-word; }
.fb-row { display: flex; gap: 8px; justify-content: flex-end; }
.fb-btn { height: 38px; padding: 0 16px; border-radius: 10px; border: 1px solid var(--fb-line); background: rgba(242,241,237,.1); font-weight: 600; font-size: 14px; }
.fb-btn.red { background: var(--fb-red); border-color: var(--fb-red); color: #fff; }
.fb-btn.ghost { background: transparent; }
.fb-btn.wide { width: 100%; margin-top: 10px; }
.fb-btn:disabled { opacity: .45; cursor: default; }
.fb-x { margin-left: auto; width: 30px; height: 30px; border-radius: 8px; border: 0; background: rgba(242,241,237,.08); font-size: 18px; line-height: 1; }
.fb-num { flex: none; width: 26px; height: 26px; border-radius: 50%; background: var(--fb-red); color: #fff; display: grid; place-items: center;
  font-family: var(--font-mono), monospace; font-size: 12px; }
.fb-num.done { background: #2f9e5b; }
.fb-bar { position: fixed; left: 50%; bottom: calc(18px + env(safe-area-inset-bottom)); transform: translateX(-50%); z-index: 2147483603;
  display: flex; gap: 6px; padding: 6px; border-radius: 16px; background: var(--fb-bg); border: 1px solid var(--fb-line);
  backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); box-shadow: 0 14px 40px rgba(0,0,0,.5); }
.fb-bar-btn { height: 42px; padding: 0 16px; border-radius: 11px; border: 0; background: transparent; display: inline-flex; align-items: center; gap: 8px;
  font-weight: 600; font-size: 14px; white-space: nowrap; }
.fb-bar-btn:hover { background: rgba(242,241,237,.08); }
.fb-bar-btn.main { background: var(--fb-red); color: #fff; }
.fb-bar-btn.main.on { background: #fff; color: var(--fb-red); }
.fb-bar-btn.on:not(.main) { background: rgba(242,241,237,.14); }
.fb-bar-btn.icon { width: 42px; padding: 0; justify-content: center; }
.fb-count { min-width: 20px; height: 20px; padding: 0 6px; border-radius: 999px; background: rgba(242,241,237,.14); font-family: var(--font-mono), monospace;
  font-size: 11px; display: inline-grid; place-items: center; box-sizing: border-box; }
.fb-panel { position: fixed; top: 12px; right: 12px; bottom: 12px; width: 340px; z-index: 2147483604; display: flex; flex-direction: column;
  padding: 14px; border-radius: 18px; background: var(--fb-bg); border: 1px solid var(--fb-line); backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px); box-shadow: 0 20px 50px rgba(0,0,0,.55); box-sizing: border-box; }
.fb-panel-head { display: flex; align-items: center; margin-bottom: 12px; font-size: 17px; }
.fb-tabs { display: flex; gap: 4px; padding: 4px; border-radius: 11px; background: rgba(242,241,237,.06); margin-bottom: 10px; }
.fb-tabs button { flex: 1; height: 32px; border: 0; border-radius: 8px; background: transparent; font-size: 13px; font-weight: 600; color: var(--fb-dim); }
.fb-tabs button.on { background: rgba(242,241,237,.14); color: var(--fb-txt); }
.fb-list { flex: 1; overflow-y: auto; display: grid; align-content: start; gap: 6px; overscroll-behavior: contain; }
.fb-item { display: flex; gap: 10px; text-align: left; padding: 10px; border-radius: 12px; border: 1px solid transparent; background: rgba(242,241,237,.04); }
.fb-item:hover, .fb-item.on { border-color: var(--fb-line); background: rgba(242,241,237,.08); }
.fb-item-body { display: grid; gap: 3px; min-width: 0; }
.fb-item-text { font-size: 14px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.fb-empty { color: var(--fb-dim); font-size: 14px; line-height: 1.5; margin: 8px 2px; }
.fb-intro { position: fixed; left: 50%; bottom: calc(86px + env(safe-area-inset-bottom)); transform: translateX(-50%); z-index: 2147483605;
  width: min(360px, calc(100vw - 24px)); box-sizing: border-box; padding: 16px; border-radius: 16px; background: var(--fb-bg);
  border: 1px solid var(--fb-line); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); box-shadow: 0 20px 50px rgba(0,0,0,.55); display: grid; gap: 10px; }
.fb-intro b { font-size: 17px; }
.fb-intro p { margin: 0; color: var(--fb-dim); font-size: 14px; line-height: 1.5; }
.fb-intro strong { color: var(--fb-txt); }
.fb-toast { position: fixed; top: 76px; left: 50%; transform: translateX(-50%); z-index: 2147483606; background: #fff; color: #08080a;
  padding: 9px 16px; border-radius: 999px; font-size: 14px; font-weight: 600; box-shadow: 0 8px 24px rgba(0,0,0,.4); }
@media (max-width: 820px) {
  .fb-bar { bottom: calc(96px + env(safe-area-inset-bottom)); }
  .fb-intro { bottom: calc(160px + env(safe-area-inset-bottom)); }
  .fb-panel { top: auto; left: 8px; right: 8px; bottom: 8px; width: auto; height: 70vh; }
  .fb-hint { top: 70px; font-size: 13px; }
  .fb-hint kbd { display: none; }
}
`;
