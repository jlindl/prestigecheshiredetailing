import { SITE } from "@/lib/site";
import { FbIcon, IgIcon } from "./Icons";

// Facebook and Instagram buttons.
export default function Social({ label = true }: { label?: boolean }) {
  return (
    <div className="social">
      <a href={SITE.facebook} target="_blank" rel="noopener" aria-label="Prestige Cheshire Detailing on Facebook">
        <FbIcon />{label && <span>Facebook</span>}
      </a>
      <a href={SITE.instagram} target="_blank" rel="noopener" aria-label="Prestige Cheshire Detailing on Instagram">
          <IgIcon />{label && <span>Instagram</span>}
      </a>
    </div>
  );
}
