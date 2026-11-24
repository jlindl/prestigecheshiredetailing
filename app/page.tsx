import { SITE, waLink } from "@/lib/site";
import { LogoMark, WaIcon, PhoneIcon, Arrow } from "@/components/Icons";
import { WaButton, CallButton, CtaStrip } from "@/components/Cta";
import PolishPass from "@/components/PolishPass";
import Faq from "@/components/Faq";
import Builder from "@/components/Builder";
import Motion from "@/components/Motion";
import CoverageMap from "@/components/CoverageMap";
import LazyLoader from "@/components/LazyLoader";

const CARS = [
  { name: "Porsche Macan", img: "pcd-48", alt: "pcd-47", note: "Deep purple gloss" },
  { name: "Range Rover", img: "pcd-43", alt: "pcd-39", note: "Deep black gloss" },
  { name: "Audi Avant", img: "pcd-73", alt: "pcd-78", note: "Gloss black estate" },
  { name: "BMW M2", img: "pcd-80", alt: "pcd-82", note: "Bright paint, crisp reflections" },
  { name: "Range Rover Sport", img: "pcd-66", alt: "pcd-70", note: "Grey metallic, deep and clean" },
  { name: "BMW 3 Series", img: "pcd-02", alt: "pcd-03", note: "Blue that looks wet" },
  { name: "BMW X3", img: "pcd-35", alt: "pcd-34", note: "Dark paint, sharp lines" },
];

const STATEMENT =
  "Every wash, every sponge and every automatic brush leaves fine circular scratches. In sunlight they show up as swirls, and they scatter the light so the colour looks flat. Craig polishes them out by machine, then locks the finish in with a Gyeon ceramic coating.";

export default function Home() {
  return (
    <>
      <div className="progress" aria-hidden="true" />
      <header className="hdr">
        <a href="#top" className="hdr-brand">
          <LogoMark size={42} decorative />
          <span className="wm">
            PRESTIGE<span>CHESHIRE DETAILING</span>
          </span>
        </a>
        <nav className="hdr-nav" aria-label="Main">
          <a className="lnk" href="#process">The process</a>
          <a className="lnk" href="#work">Work</a>
          <a className="lnk" href="#areas">Areas</a>
          <a className="lnk tel" href={SITE.phoneHref}>{SITE.phoneDisplay}</a>
          <WaButton label="WhatsApp" />
        </nav>
      </header>

      <div className="mbar" role="navigation" aria-label="Quick contact">
        <a className="wa" href={waLink()} target="_blank" rel="noopener"><WaIcon /> WhatsApp Craig</a>
        <a className="call" href={SITE.phoneHref}><PhoneIcon /> Call</a>
      </div>

      <main id="top">
        {/* HERO */}
        <section className="hero" aria-label="Introduction">
          <div className="hero-bg" aria-hidden="true" />
          <div className="hero-shade" aria-hidden="true" />
          <div className="hero-spec" aria-hidden="true" />
          <div className="wrap hero-inner">
            <div>
              <span className="mono eyebrow hero-eb">Mobile detailing · Cheshire<span className="hide-m"> · By appointment</span></span>
              <h1 className="display">
                <span className="ln"><span>Paint you</span></span>
                <span className="ln"><span>can see</span></span>
                <span className="ln ln-last"><span>yourself</span><span className="in-word"><span className="red">in.</span></span></span>
              </h1>
              <p className="lede">
                <b>Machine polishing</b> to take out swirl marks and <b>Gyeon ceramic coatings</b> to keep the gloss, for cars, vans and motorbikes. Craig comes to you across Cheshire with <b>his own water and power</b>.
              </p>
              <div className="hero-ctas">
                <WaButton label="Get a quote on WhatsApp" />
                <CallButton />
              </div>
              <a className="proof-chip" href={SITE.facebookReviews} target="_blank" rel="noopener">
                <span className="pc-n">{SITE.reviews.recommend}%</span>
                <span><b>recommend</b> · from {SITE.reviews.count} Facebook reviews</span>
              </a>
            </div>
            <figure className="hero-card">
              <img decoding="async" data-src="/img/pcd-48.webp" data-srcset="/img/pcd-48-sm.webp 800w, /img/pcd-48.webp 1400w" sizes="320px" alt="Freshly detailed purple Porsche Macan bonnet with mirror reflections" />
              <span className="sweep" aria-hidden="true" />
              <figcaption>
                <span className="m">Porsche Macan</span>
                <span className="mono">Recent work</span>
              </figcaption>
            </figure>
          </div>
          <div className="wrap">
            <div className="hero-redline" aria-hidden="true" />
            <div className="hero-foot mono">
              <span>Covering</span>
              <span className="towns">{SITE.towns.map((t) => <span key={t}>{t}</span>)}</span>
            </div>
          </div>
        </section>

        {/* STATEMENT */}
        <section className="statement wrap" aria-labelledby="st-h">
          <span className="mono eyebrow">Why your paint looks tired</span>
          <h2 id="st-h" className="display reveal" data-reveal>
            Most paint isn&rsquo;t dull. It&rsquo;s <span className="red">scratched.</span>
          </h2>
          <div className="body">
            <p className="big" data-words>
              {STATEMENT.split(" ").map((w, i) => (
                <span key={i} className="w">{w} </span>
              ))}
            </p>
            <p className="lede" data-reveal>
              That&rsquo;s why a wash alone never brings it back. The gloss isn&rsquo;t hiding under dirt. It&rsquo;s been cut up by thousands of tiny marks. Scroll on to watch them come out.
            </p>
          </div>
        </section>

        {/* SIGNATURE: POLISH PASS */}
        <PolishPass />

        {/* GARAGE */}
        <section className="garage" id="work" aria-labelledby="gar-h">
          <div className="garage-sticky">
          <div className="garage-head">
            <div>
              <span className="mono eyebrow">The garage · real customer cars</span>
              <h2 id="gar-h" className="display">Recent work</h2>
            </div>
            <span className="mono r" style={{ color: "var(--dim)" }}>Hover for a second angle</span>
          </div>
          <div className="garage-ghost display" aria-hidden="true">PRESTIGE</div>
          <div className="garage-track">
            {CARS.map((c, i) => (
              <article className="car" key={c.name}>
                <span className="idx mono">{String(i + 1).padStart(2, "0")} / {String(CARS.length).padStart(2, "0")}</span>
                <div className="ph">
                  <img decoding="async" data-src={`/img/${c.img}.webp`} data-srcset={`/img/${c.img}-sm.webp 800w, /img/${c.img}.webp 1400w`} sizes="(max-width: 820px) 80vw, 460px" alt={`${c.name}, a Prestige Cheshire Detailing customer car`} loading="lazy" />
                  <img decoding="async" className="alt" data-src={`/img/${c.alt}.webp`} data-srcset={`/img/${c.alt}-sm.webp 800w, /img/${c.alt}.webp 1400w`} sizes="(max-width: 820px) 80vw, 460px" alt="" loading="lazy" aria-hidden="true" />
                </div>
                <div className="meta">
                  <h3 className="name">{c.name}</h3>
                  <span className="mono" style={{ color: "var(--dim)" }}>{c.note}</span>
                </div>
              </article>
            ))}
            <div className="car end">
              <span className="mono eyebrow">Yours next</span>
              <h3 className="display">Send Craig a photo of yours.</h3>
              <p className="lede" style={{ margin: 0 }}>A couple of pictures on WhatsApp is all it takes to get a quote.</p>
              <WaButton label="Send photos" text="Hi Craig, here are a few photos of my car. Could you give me a quote? " />
            </div>
          </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="services wrap" aria-labelledby="svc-h">
          <div className="svc-head">
            <div>
              <span className="mono eyebrow">What Craig does</span>
              <h2 id="svc-h" className="display" data-reveal>Two things, done <span className="red">properly.</span></h2>
            </div>
            <p className="lede" data-reveal>Prestige Cheshire Detailing specialises in correcting paint and then protecting it, on cars, vans and motorbikes. Fully mobile.</p>
          </div>

          <article className="svc">
            <span className="no mono">01</span>
            <div className="tx">
              <h3 className="display">Machine <span className="red">polishing</span></h3>
              <p className="lede">Paint correction by machine to take out the swirl marks and fine scratches that make paint look flat, bringing back depth, clarity and true colour.</p>
              <ul>
                <li>Removes swirls and wash marring</li>
                <li>Brings back gloss and colour depth</li>
                <li>The right prep before any coating</li>
              </ul>
            </div>
            <figure className="im" style={{ margin: 0 }}>
              <img decoding="async" data-src="/img/pcd-39.webp" data-srcset="/img/pcd-39-sm.webp 800w, /img/pcd-39.webp 1400w" sizes="(max-width: 820px) 90vw, 40vw" alt="Mirror finish on the rear of a black Range Rover" loading="lazy" data-speed="0.12" />
              <span className="tag mono">Range Rover</span>
            </figure>
          </article>

          <article className="svc flip">
            <span className="no mono" style={{ gridColumn: "1", gridRow: "1" }}>02</span>
            <div className="tx">
              <h3 className="display">Gyeon ceramic <span className="red">coatings</span></h3>
              <p className="lede">A hard, glossy layer of protection over the corrected paint. Water beads and runs off, dirt struggles to stick, and the car is far easier to keep clean. Craig&rsquo;s posts most often feature Gyeon&rsquo;s 5-year coating.</p>
              <ul>
                <li>Gyeon coatings, most often the 5-year</li>
                <li>Strong water beading</li>
                <li>Easier, safer washing afterwards</li>
              </ul>
            </div>
            <figure className="im" style={{ margin: 0 }}>
              <img decoding="async" data-src="/img/pcd-51.webp" data-srcset="/img/pcd-51-sm.webp 800w, /img/pcd-51.webp 1400w" sizes="(max-width: 820px) 90vw, 40vw" alt="Glossy purple Porsche wing reflecting its surroundings" loading="lazy" data-speed="0.12" />
              <span className="tag mono">Porsche Macan</span>
            </figure>
          </article>

          <div className="chips" data-reveal>
            <span className="chip">Cars</span>
            <span className="chip">Vans</span>
            <span className="chip">Motorbikes</span>
            <span className="chip">Fully mobile</span>
            <span className="chip">Appointment only</span>
          </div>
          <CtaStrip line="Not sure which you need?" sub="Send Craig a photo and ask." text="Hi Craig, I'm not sure whether my car needs polishing, a ceramic coating or both. Here's a photo: " />
        </section>

        {/* VANS */}
        <section className="vans wrap" aria-labelledby="van-h">
          <div className="vans-grid">
            <div className="a">
              <span className="mono eyebrow">Vans</span>
              <h2 id="van-h" className="display" data-reveal>Your van is your <span className="red">shop window<span className="dot">.</span></span></h2>
              <p className="lede" data-reveal>Vans are a big part of the work, from Transporters to Transit Customs. Send a photo of yours for a quote.</p>
              <div style={{ marginTop: 30 }}><WaButton label="Book your van in" text="Hi Craig, I'd like a quote for my van. It's a " /></div>
            </div>
            <figure className="ph p1" style={{ margin: 0 }}><img decoding="async" data-src="/img/pcd-21.webp" data-srcset="/img/pcd-21-sm.webp 800w, /img/pcd-21.webp 1400w" sizes="(max-width: 820px) 90vw, 40vw" alt="Black VW Transporter after a detail, front view" loading="lazy" data-speed="0.1" /></figure>
            <figure className="ph p2" style={{ margin: 0 }}><img decoding="async" data-src="/img/pcd-23.webp" data-srcset="/img/pcd-23-sm.webp 800w, /img/pcd-23.webp 1400w" sizes="(max-width: 820px) 90vw, 40vw" alt="Black VW Transporter flank reflecting the sky" loading="lazy" data-speed="0.18" /></figure>
          </div>
        </section>

        {/* COVERAGE */}
        <section className="cover wrap" id="areas" aria-labelledby="cov-h">
          <div className="cover-grid">
            <div>
              <span className="mono eyebrow">Fully mobile</span>
              <h2 id="cov-h" className="display" data-reveal>We bring the water. <span className="red">And the power.</span></h2>
              <p className="lede" data-reveal>No need to provide water or power. Craig comes to you, by appointment, across the towns below.</p>
              <div className="facts">
                <div><span className="mono" style={{ color: "var(--dim)" }}>Water</span><span className="k">Own supply</span></div>
                <div><span className="mono" style={{ color: "var(--dim)" }}>Power</span><span className="k">Own supply</span></div>
                <div><span className="mono" style={{ color: "var(--dim)" }}>Booking</span><span className="k">Appointment only</span></div>
              </div>
              <div style={{ marginTop: 30 }}><WaButton label="Check a date" text="Hi Craig, do you have any availability coming up? I'm in " /></div>
            </div>
            <CoverageMap />
          </div>
        </section>

        {/* PROOF */}
        <section className="proof wrap" aria-labelledby="pr-h">
          <div className="proof-top">
            <div className="pct" aria-label={`${SITE.reviews.recommend} percent`}><span data-count={SITE.reviews.recommend}>{SITE.reviews.recommend}</span><sup>%</sup></div>
            <div>
              <span className="mono eyebrow">Facebook recommendations</span>
              <h2 id="pr-h" className="display-soft">{SITE.reviews.count} Facebook reviews. Every one recommends.</h2>
              <a href={SITE.facebookReviews} target="_blank" rel="noopener" className="mono" style={{ display: "inline-flex", gap: 10, alignItems: "center", color: "var(--chrome)", borderBottom: "1px solid var(--red)", paddingBottom: 6 }}>
                Read them on Facebook <Arrow size={14} />
              </a>
            </div>
          </div>
          <div className="themes">
            <div className="theme" data-reveal><span className="mono red">What reviewers mention</span><h3>He replies quickly.</h3><p>Reviewers say Craig gets back to them quickly.</p></div>
            <div className="theme" data-reveal><span className="mono red">What reviewers mention</span><h3>He turns up on time.</h3><p>Appointment only, and reviewers say he turns up on time.</p></div>
            <div className="theme" data-reveal><span className="mono red">What reviewers mention</span><h3>He talks you through it.</h3><p>Reviewers say he talks them through the job.</p></div>
          </div>
        </section>

        {/* FAQ */}
        <Faq />

        {/* FINAL CTA */}
        <section className="final" aria-labelledby="fin-h">
          <div className="final-bg" aria-hidden="true" data-final-bg data-bg />
          <div className="wrap final-grid">
            <div>
              <span className="mono eyebrow">Ready when you are</span>
              <h2 id="fin-h" className="display">Let&rsquo;s get it <span className="red">booked in.</span></h2>
              <p className="lede">Tell Craig what you drive and where you are. It opens WhatsApp with the message written for you. Add a photo and send.</p>
              <div className="alt-contact">
                <span>Or call <a href={SITE.phoneHref}>{SITE.phoneDisplay}</a></span>
                <span>Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a></span>
              </div>
            </div>
            <Builder />
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="foot-cols">
          <div>
            <LogoMark size={56} />
            <p style={{ marginTop: 18, maxWidth: 340 }}>Machine polishing and Gyeon ceramic coatings. Mobile across Cheshire, by appointment.</p>
          </div>
          <div>
            <p className="mono fh">Contact</p>
            <a href={waLink()} target="_blank" rel="noopener">WhatsApp</a>
            <a href={SITE.phoneHref}>{SITE.phoneDisplay}</a>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </div>
          <div>
            <p className="mono fh">Areas</p>
            <p>{SITE.towns.join(", ")}</p>
          </div>
          <div>
            <p className="mono fh">Follow</p>
            <a href={SITE.facebook} target="_blank" rel="noopener">Facebook</a>
            <a href={SITE.facebookReviews} target="_blank" rel="noopener">Reviews</a>
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

      <LazyLoader />
      <Motion />
    </>
  );
}
