import { NextResponse } from "next/server";
import { put, list, get, del } from "@vercel/blob";

// Client feedback pins for the demo. Each note is one private JSON blob: comments/<id>.json
// Without BLOB_READ_WRITE_TOKEN (local dev) notes live in memory so the UI can still be tested.

export const dynamic = "force-dynamic";

type Anchor = { path: string; x: number; y: number; section: string; sectionPath: string; sx: number; sy: number; snippet: string };
export type Note = {
  id: string;
  n: number;
  text: string;
  author: string;
  status: "open" | "resolved";
  anchor: Anchor;
  vw: number;
  device: "mobile" | "desktop";
  createdAt: string;
  updatedAt: string;
};

const PREFIX = "comments/";
const MAX_NOTES = 500;
const hasBlob = !!process.env.BLOB_READ_WRITE_TOKEN;
const mem = (globalThis as unknown as { __fbNotes?: Map<string, Note> }).__fbNotes ??= new Map();

async function readAll(): Promise<Note[]> {
  if (!hasBlob) return [...mem.values()].sort((a, b) => a.n - b.n);
  const blobs: { pathname: string }[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: PREFIX, cursor, limit: 1000 });
    blobs.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  const notes = await Promise.all(blobs.map((b) => readOne(b.pathname)));
  return notes.filter((n): n is Note => !!n).sort((a, b) => a.n - b.n);
}

async function readOne(pathname: string): Promise<Note | null> {
  if (!hasBlob) return mem.get(pathname.slice(PREFIX.length, -5)) ?? null;
  try {
    const res = await get(pathname, { access: "private", useCache: false });
    if (!res || res.statusCode !== 200) return null;
    return JSON.parse(await new Response(res.stream).text()) as Note;
  } catch {
    return null;
  }
}

async function save(note: Note) {
  if (!hasBlob) { mem.set(note.id, note); return; }
  await put(`${PREFIX}${note.id}.json`, JSON.stringify(note), {
    access: "private", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json", cacheControlMaxAge: 60,
  });
}

const clamp01 = (v: unknown) => Math.min(1, Math.max(0, Number(v) || 0));
const str = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
const validId = (id: string | null) => !!id && /^[a-z0-9]{6,32}$/.test(id);

function toMarkdown(notes: Note[]) {
  const lines = ["# Prestige Cheshire Detailing: client notes", ""];
  for (const n of notes) {
    lines.push(`## #${n.n} ${n.status === "resolved" ? "[done] " : ""}${n.anchor.section || "Page"}`);
    lines.push(`- From: ${n.author || "Client"} on ${n.device}, ${new Date(n.createdAt).toLocaleString("en-GB", { timeZone: "Europe/London" })}`);
    if (n.anchor.snippet) lines.push(`- Pinned on: "${n.anchor.snippet}"`);
    lines.push("", n.text, "");
  }
  return lines.join("\n");
}

export async function GET(req: Request) {
  const notes = await readAll();
  if (new URL(req.url).searchParams.get("format") === "md") {
    return new NextResponse(toMarkdown(notes), { headers: { "content-type": "text/markdown; charset=utf-8", "cache-control": "no-store" } });
  }
  return NextResponse.json({ notes }, { headers: { "cache-control": "no-store" } });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const text = str(body?.text, 2000);
  if (!text) return NextResponse.json({ error: "Write a note first." }, { status: 400 });
  const existing = await readAll();
  if (existing.length >= MAX_NOTES) return NextResponse.json({ error: "Note limit reached." }, { status: 429 });
  const a = body?.anchor ?? {};
  const now = new Date().toISOString();
  const note: Note = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    n: existing.reduce((m, x) => Math.max(m, x.n), 0) + 1,
    text,
    author: str(body?.author, 60),
    status: "open",
    anchor: {
      path: str(a.path, 600), x: clamp01(a.x), y: clamp01(a.y),
      section: str(a.section, 80), sectionPath: str(a.sectionPath, 300), sx: clamp01(a.sx), sy: clamp01(a.sy),
      snippet: str(a.snippet, 120),
    },
    vw: Math.round(Number(body?.vw) || 0),
    device: body?.device === "mobile" ? "mobile" : "desktop",
    createdAt: now,
    updatedAt: now,
  };
  await save(note);
  return NextResponse.json({ note });
}

export async function PATCH(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!validId(id)) return NextResponse.json({ error: "Bad id" }, { status: 400 });
  const note = await readOne(`${PREFIX}${id}.json`);
  if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await req.json().catch(() => ({}));
  if (body.status === "open" || body.status === "resolved") note.status = body.status;
  if (typeof body.text === "string" && body.text.trim()) note.text = str(body.text, 2000);
  note.updatedAt = new Date().toISOString();
  await save(note);
  return NextResponse.json({ note });
}

export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!validId(id)) return NextResponse.json({ error: "Bad id" }, { status: 400 });
  if (hasBlob) await del(`${PREFIX}${id}.json`);
  else mem.delete(id!);
  return NextResponse.json({ ok: true });
}
