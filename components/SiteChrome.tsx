import { SITE, waLink } from "@/lib/site";
import { Logo, WaIcon, PhoneIcon } from "@/components/Icons";
import { WaButton } from "@/components/Cta";
import Social from "@/components/Social";

export function SiteHeader({ home = true }: { home?: boolean }) {
  const pre = home ? "" : "/";
  return (
    <>
        <header className={home ? "hdr" : "hdr scrolled"}>
          <a href={home ? "#top" : "/"} className="hdr-brand">
            <Logo size="sm" />
          </a>
          <nav className="hdr-nav" aria-label="Main">
            <a className="lnk" href={`${pre}#services`}>Services</a>
            <a className="lnk" href={`${pre}#work`}>Work</a>
            <a className="lnk" href={`${pre}#areas`}>Areas</a>
            <a className="lnk gal-lnk" href="/gallery" aria-current={home ? undefined : "page"}>Gallery</a>
            <a className="lnk tel" href={SITE.phoneHref}>{SITE.phoneDisplay}</a>
            <WaButton label="WhatsApp" />
          </nav>
        </header>

        <div className="mbar" role="navigation" aria-label="Quick contact">
          <a className="wa" href={waLink()} target="_blank" rel="noopener"><WaIcon /> WhatsApp us</a>
          <a className="call" href={SITE.phoneHref}><PhoneIcon /> Call</a>
        </div>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="foot">
      <div className="foot-cols">
        <div>
          <Logo size="lg" />
          <p style={{ marginTop: 18, maxWidth: 340 }}>Machine polishing and Gyeon ceramic coatings. Mobile across Cheshire, the North West and North Wales, by appointment.</p>
        </div>
        <div>
          <p className="mono fh">Contact</p>
          <a href={waLink()} target="_blank" rel="noopener">WhatsApp</a>
          <a href={SITE.phoneHref}>{SITE.phoneDisplay}</a>
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        </div>
        <div>
          <p className="mono fh">Areas</p>
          <p>{SITE.areas}. As far north as Wigan and Manchester.</p>
        </div>
        <div>
          <p className="mono fh">Follow</p>
          <Social />
          <a href={SITE.facebookReviews} target="_blank" rel="noopener" style={{ marginTop: 10 }}>Read the reviews</a>
        </div>
      </div>
      <div className="wordmark" aria-hidden="true">
        <div className="w display">PRESTIGE</div>
        <div className="rl" data-rl />
      </div>
      <div className="legal mono">
        <span>© {new Date().getFullYear()} Prestige Cheshire Detailing</span>
        <span>Concept homepage by Integrate</span>
      </div>
    </footer>
  );
}
