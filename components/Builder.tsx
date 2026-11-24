"use client";
import { useMemo, useState } from "react";
import { SITE, waLink } from "@/lib/site";
import { WaIcon } from "./Icons";

const SERVICES = ["Machine polish", "Ceramic coating", "Both", "Not sure yet"];
const NONE = "";

export default function Builder() {
  const [vehicle, setVehicle] = useState("");
  const [service, setService] = useState(NONE);
  const [town, setTown] = useState("");

  const msg = useMemo(() => {
    const v = vehicle.trim() ? `my ${vehicle.trim()}` : "my vehicle";
    const s = !service ? "Could you tell me what you'd recommend" : service === "Not sure yet" ? "I'm not sure whether it needs polishing, a coating or both" : service === "Both" ? "I'm interested in a machine polish and a ceramic coating" : `I'm interested in a ${service.toLowerCase()}`;
    const t = town ? ` I'm in ${town}.` : "";
    return `Hi Craig, I'd like a quote for ${v}. ${s}.${t} I'll send a couple of photos.`;
  }, [vehicle, service, town]);

  return (
    <form className="builder" onSubmit={(e) => { e.preventDefault(); window.open(waLink(msg), "_blank", "noopener"); }} aria-label="Build your WhatsApp quote request">
      <div className="fld">
        <label className="mono" htmlFor="veh">Your vehicle</label>
        <input id="veh" placeholder="e.g. Transit Custom" value={vehicle} onChange={(e) => setVehicle(e.target.value)} autoComplete="off" />
      </div>
      <div className="fld">
        <span className="mono" style={{ display: "block", marginBottom: 10, color: "var(--mist)" }} id="svc-l">What you&rsquo;re after</span>
        <div className="seg" role="group" aria-labelledby="svc-l">
          {SERVICES.map((s) => (
            <button type="button" key={s} aria-pressed={service === s} onClick={() => setService(service === s ? NONE : s)}>{s}</button>
          ))}
        </div>
      </div>
      <div className="fld">
        <label className="mono" htmlFor="town">Where you are</label>
        <select id="town" value={town} onChange={(e) => setTown(e.target.value)}>
          <option value="">Choose a town (optional)</option>
          {SITE.towns.map((t) => <option key={t} value={t}>{t}</option>)}
          <option value="another area nearby">Somewhere nearby</option>
        </select>
      </div>
      <button type="submit" className="btn btn-red">
        Send on WhatsApp <span className="ico"><WaIcon /></span>
      </button>
      <p className="mono" style={{ color: "var(--dim)", margin: "14px 0 0", lineHeight: 1.6, textTransform: "none", letterSpacing: "0.02em", fontSize: 12 }}>
        Opens WhatsApp with your message ready. Nothing is sent until you press send.
      </p>
    </form>
  );
}
