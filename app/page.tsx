import { SITE, waLink } from "@/lib/site";
import { SERVICES, REVIEWS, PROCESS } from "@/lib/content";
import { Logo, WaIcon, PhoneIcon, Arrow } from "@/components/Icons";
import Social from "@/components/Social";
import Gallery from "@/components/Gallery";
import Process from "@/components/Process";
import Faq from "@/components/Faq";
import Builder from "@/components/Builder";
import CoverageMap from "@/components/CoverageMap";
import Effects from "@/components/Effects";

function Wa({ label = "WhatsApp", text, className = "" }: { label?: string; text?: string; className?: string }) {
  return (
    <a href={waLink(text)} target="_blank" rel="noopener" className={`btn btn-red ${className}`} data-magnet>
      <span>{label}</span>
      <span className="ico"><WaIcon size={17} /></span>
    </a>
  );
}

function Call({ className = "" }: { className?: string }) {
  return (
    <a href={SITE.phoneHref} className={`call ${className}`}>
      or call <span>{SITE.phoneDisplay}</span>
    </a>
  );
}

function Img({ name, alt, sizes, className = "", eager = false }: { name: string; alt: string; sizes: string; className?: string; eager?: boolean }) {
  const set = `/img/${name}-xs.webp 480w, /img/${name}-sm.webp 800w, /img/${name}.webp 1400w`;
  return eager ? (
    <img className={className} src={`/img/${name}-sm.webp`} srcSet={set} sizes={sizes} alt={alt} decoding="async" />
  ) : (
    <img className={className} data-src={`/img/${name}-sm.webp`} data-srcset={set} sizes={sizes} alt={alt} decoding="async" loading="lazy" />
  );
}

function Head({ eyebrow, title, sub, id, left = false }: { eyebrow: string; title: React.ReactNode; sub?: string; id: string; left?: boolean }) {
  return (
    <header className={`sh ${left ? "sh-left" : ""}`}>
      <p className="eyebrow" data-rv>{eyebrow}</p>
      <div>
        <h2 id={id} data-rv>{title}</h2>
        {sub && <p className="sh-sub" data-rv>{sub}</p>}
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <>
      <link rel="preload" as="image" href="/img/hero-rs3-m.webp" media="(max-width: 760px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/img/hero-rs3.webp" media="(min-width: 761px)" fetchPriority="high" />

      <header className="nav" data-nav>
        <a href="#top" className="nav-logo"><Logo size="sm" /></a>
        <nav aria-label="Main">
          <a href="#services">Services</a>
          <a href="#work">Recent work</a>
          <a href="#reviews">Reviews</a>
          <a href="#process">The process</a>
          <a href="#areas">Areas</a>
          <a href="#faqs">FAQs</a>
          <a href="#contact" className="nav-quote">Get a quote</a>
        </nav>
        <Wa className="btn-sm" />
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero" aria-labelledby="hero-h">
          <picture className="hero-media" data-hero>
            <source media="(max-width: 760px)" srcSet="/img/hero-rs3-m.webp" />
            <source srcSet="/img/hero-rs3-sm.webp 1200w, /img/hero-rs3.webp 1536w" sizes="100vw" />
            <img src="/img/hero-rs3.webp" alt="Our red Audi RS3 with its gloss black grille" fetchPriority="high" decoding="async" />
          </picture>
          <div className="hero-shade" aria-hidden="true" />
          <div className="grain" aria-hidden="true" />
          <div className="hero-in wrap">
            <h1 id="hero-h">
              <span className="l"><span>Ceramic coating</span></span>
              <span className="l"><span>specialists</span></span>
              <span className="l"><span>in Cheshire<em>.</em></span></span>
            </h1>
            <div className="hero-foot">
              <div>
                <p className="tag-chip"><i /> Mobile detailing · {SITE.areas}</p>
                <p className="hero-lede">Gyeon and Gtechniq ceramic coatings, paint correction and detailing for cars, vans and motorbikes. Fully mobile, by appointment only.</p>
                <div className="cta-row">
                  <Wa label="WhatsApp us" />
                  <Call />
                </div>
              </div>
              <a className="proof-pill" href="#reviews">
                <b>{SITE.reviews.recommend}%</b>
                <span>recommend<br />{SITE.reviews.count} Facebook reviews</span>
                <Arrow size={15} />
              </a>
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <div className="strip" aria-label="At a glance">
          <div className="strip-track">
            {[0, 1].map((k) => (
              <div className="strip-set" key={k} aria-hidden={k === 1 ? true : undefined}>
                <span>Gyeon &amp; Gtechniq coatings</span><i />
                <span>Fully mobile</span><i />
                <span>We bring the water</span><i />
                <span>Cars, vans &amp; motorbikes</span><i />
                <span>{SITE.reviews.recommend}% recommend on Facebook</span><i />
                <span>Appointment only</span><i />
              </div>
            ))}
          </div>
        </div>

        {/* SERVICES */}
        <section className="sec" id="services" aria-labelledby="svc-h">
          <div className="wrap">
            <Head id="svc-h" eyebrow="Services" title={<>What we do<em>.</em></>} sub="One job, one coating, done once." />
            <div className="svc-grid">
              {SERVICES.map((s) => (
                <article className="svc" key={s.title} data-rv>
                  <div className="svc-ph"><Img name={s.img} alt={s.alt} sizes="(max-width: 760px) 92vw, 31vw" /></div>
                  <div className="svc-tx">
                    <span className="svc-n">{s.n}</span>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="inline-cta" data-rv>
              <p>Not sure which you need? Send us a photo and we&rsquo;ll tell you honestly.</p>
              <Wa label="Ask us" text="Hi, I'm not sure whether my car needs polishing, a coating or both. Here's a photo: " />
            </div>
          </div>
        </section>

        {/* WORK */}
        <section className="sec sec-work" id="work" aria-labelledby="work-h">
          <div className="wrap">
            <Head id="work-h" eyebrow="Recent work" title={<>Finished on the driveway<em>.</em></>} sub="Recent work from across Cheshire. Tap any photo to see it bigger." />
          </div>
          <Gallery />
        </section>

        {/* REVIEWS */}
        <section className="sec" id="reviews" aria-labelledby="rev-h">
          <div className="wrap">
            <Head id="rev-h" eyebrow="Reviews" title={<>{SITE.reviews.recommend}% recommend<em>.</em></>} sub={`Every one of our ${SITE.reviews.count} reviews on Facebook recommends us.`} />
            <div className="rev-grid">
              <figure className="rev rev-lead" data-rv>
                <div className="rev-bg" aria-hidden="true"><Img name="beads" alt="" sizes="(max-width: 760px) 92vw, 55vw" /></div>
                <span className="q" aria-hidden="true">&ldquo;</span>
                <blockquote>{REVIEWS[0].q}</blockquote>
                <figcaption>{REVIEWS[0].who} <span>· Facebook</span></figcaption>
              </figure>
              {REVIEWS.slice(1).map((r) => (
                <figure className="rev" key={r.who} data-rv>
                  <span className="q" aria-hidden="true">&ldquo;</span>
                  <blockquote>{r.q}</blockquote>
                  <figcaption>{r.who} <span>· Facebook</span></figcaption>
                </figure>
              ))}
            </div>
            <a className="text-link" href={SITE.facebookReviews} target="_blank" rel="noopener" data-rv>
              Read all reviews on Facebook <Arrow size={15} /><span className="sr">(opens in a new tab)</span>
            </a>
          </div>
        </section>

        {/* PROCESS */}
        <section className="sec" id="process" aria-labelledby="pro-h">
          <div className="wrap">
            <Head left id="pro-h" eyebrow="The process" title={<>What goes into a coating<em>.</em></>} sub="A coating is only as good as the paint underneath it, so most of the work happens before it goes on." />
            <Process steps={PROCESS} />
          </div>
        </section>

        {/* AREAS */}
        <section className="sec" id="areas" aria-labelledby="area-h">
          <div className="wrap areas">
            <div className="areas-tx">
              <p className="eyebrow" data-rv>Fully mobile</p>
              <h2 id="area-h" data-rv>We bring the water<em>.</em><br /><span className="dim">You supply the power.</span></h2>
              <p className="lede" data-rv>No need to provide water, we bring our own. All we need from you is access to a power socket. We cover {SITE.areas}, as far north as Wigan and Manchester.</p>
              <dl className="facts" data-rv>
                <div><dt>Water</dt><dd>We bring it</dd></div>
                <div><dt>Power</dt><dd>Your socket</dd></div>
                <div><dt>Booking</dt><dd>Appointment only</dd></div>
              </dl>
              <div className="cta-row" data-rv>
                <Wa label="Check a date" text="Hi, do you have any availability coming up? I'm in " />
                <Call />
              </div>
            </div>
            <div className="areas-map" data-rv>
              <CoverageMap />
              <ul className="town-list" aria-label="Towns we cover">
                {SITE.towns.map((t) => <li key={t}>{t}</li>)}
                <li>North Wales</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="sec" id="faqs" aria-labelledby="faq-h">
          <div className="wrap faq-wrap">
            <Head left id="faq-h" eyebrow="FAQs" title={<>Before you book<em>.</em></>} sub="Anything else, just ask us. Reviewers say we reply quickly." />
            <Faq />
          </div>
        </section>

        {/* FINAL */}
        <section className="final" id="contact" aria-labelledby="fin-h">
          <div className="final-bg" aria-hidden="true"><Img name="rs3" alt="" sizes="100vw" /></div>
          <div className="wrap final-in">
            <div className="final-tx">
              <p className="eyebrow" data-rv>Get a quote</p>
              <h2 id="fin-h" data-rv>Tell us about your vehicle<em>.</em></h2>
              <p className="lede" data-rv>Fill in a few details and WhatsApp opens with your message written. Add a couple of photos and send. Prefer to talk?</p>
              <a className="big-call" href={SITE.phoneHref} data-rv><PhoneIcon size={20} /> {SITE.phoneDisplay}</a>
            </div>
            <div data-rv><Builder /></div>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap foot-grid">
          <div>
            <Logo size="md" decorative />
            <p className="foot-line">Ceramic coatings, paint correction and detailing. Mobile across {SITE.areas}, by appointment.</p>
          </div>
          <div>
            <p className="foot-h">Contact</p>
            <a href={waLink()} target="_blank" rel="noopener">WhatsApp</a>
            <a href={SITE.phoneHref}>{SITE.phoneDisplay}</a>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </div>
          <div>
            <p className="foot-h">Follow our work</p>
            <Social />
            <a href={SITE.facebookReviews} target="_blank" rel="noopener" className="foot-rev">Read the reviews</a>
          </div>
        </div>
        <div className="wrap foot-base">
          <span>&copy; {new Date().getFullYear()} {SITE.name}</span>
          <span>Concept homepage by Integrate</span>
        </div>
      </footer>

      <div className="mbar" aria-label="Quick contact">
        <a className="mbar-wa" href={waLink()} target="_blank" rel="noopener"><WaIcon size={18} /> WhatsApp us</a>
        <a className="mbar-call" href={SITE.phoneHref}><PhoneIcon size={17} /> Call</a>
      </div>

      <Effects />
    </>
  );
}
