"use client";
import { useMemo, useState } from "react";
import { SITE, waLink } from "@/lib/site";
import { WaIcon } from "./Icons";

const SERVICES = ["Ceramic coating", "Paint correction", "Detailing", "Not sure yet"];
const NONE = "";

export default function Builder() {
  const [vehicle, setVehicle] = useState("");
  const [service, setService] = useState(NONE);
  const [town, setTown] = useState("");

  const msg = useMemo(() => {
    const v = vehicle.trim() ? `my ${vehicle.trim()}` : "my vehicle";
    const s = !service ? "What would you recommend" : service === "Not sure yet" ? "I'm not sure what it needs" : `I'm interested in ${service === "Detailing" ? "a detail" : service.toLowerCase()}`;
    const t = town ? ` I'm in ${town}.` : "";
    return `Hi Craig, I'd like a quote for ${v}. ${s}${service ? "." : "?"}${t} I'll send a couple of photos.`;
  }, [vehicle, service, town]);

  return (
    <form className="builder" id="quote" onSubmit={(e) => { e.preventDefault(); window.open(waLink(msg), "_blank", "noopener"); }} aria-label="Build your WhatsApp quote request">
      <div className="fld">
        <label htmlFor="veh">Your vehicle</label>
        <input id="veh" placeholder="e.g. Transit Custom" value={vehicle} onChange={(e) => setVehicle(e.target.value)} autoComplete="off" />
      </div>
      <div className="fld">
        <span className="lbl" id="svc-l">What you&rsquo;re after</span>
        <div className="seg" role="group" aria-labelledby="svc-l">
          {SERVICES.map((s) => (
            <button type="button" key={s} aria-pressed={service === s} onClick={() => setService(service === s ? NONE : s)}>{s}</button>
          ))}
        </div>
      </div>
      <div className="fld">
        <label htmlFor="town">Where you are</label>
        <select id="town" value={town} onChange={(e) => setTown(e.target.value)}>
          <option value="">Choose a town (optional)</option>
          {SITE.towns.map((t) => <option key={t} value={t}>{t}</option>)}
          <option value="North Wales">North Wales</option>
          <option value="another area nearby">Somewhere nearby</option>
        </select>
      </div>
      <button type="submit" className="btn btn-red btn-wide" data-magnet>
        <span>Send on WhatsApp</span> <span className="ico"><WaIcon /></span>
      </button>
      <p className="b-note">
        Opens WhatsApp with your message ready. Nothing is sent until you press send.
      </p>
    </form>
  );
}
