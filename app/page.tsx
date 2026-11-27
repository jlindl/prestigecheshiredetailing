import { SITE, waLink } from "@/lib/site";
import { Logo, WaIcon, PhoneIcon, Arrow } from "@/components/Icons";
import { WaButton, CallButton, CtaStrip } from "@/components/Cta";
import Social from "@/components/Social";
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
  "Over time, most washing leaves fine scratches in the paint. In sunlight they scatter the light so the colour looks flat. We polish them out by machine, then lock the finish in with a Gyeon ceramic coating.";

export default function Home() {
  return (
    <>
      <div className="progress" aria-hidden="true" />
      <header className="hdr">
        <a href="#top" className="hdr-brand">
          <Logo size="sm" />
        </a>
        <nav className="hdr-nav" aria-label="Main">
          <a className="lnk" href="#services">Services</a>
          <a className="lnk" href="#work">Work</a>
          <a className="lnk" href="#areas">Areas</a>
          <a className="lnk tel" href={SITE.phoneHref}>{SITE.phoneDisplay}</a>
          <WaButton label="WhatsApp" />
        </nav>
      </header>

      <div className="mbar" role="navigation" aria-label="Quick contact">
        <a className="wa" href={waLink()} target="_blank" rel="noopener"><WaIcon /> WhatsApp us</a>
        <a className="call" href={SITE.phoneHref}><PhoneIcon /> Call</a>
      </div>

      <main id="top">
        {/* HERO */}
        <link rel="preload" as="image" href="/img/beads-sm.webp" media="(max-width: 820px)" fetchPriority="high" />
        <link rel="preload" as="image" href="/img/beads.webp" media="(min-width: 821px)" fetchPriority="high" />
        <section className="hero" aria-label="Introduction">
          <div className="hero-bg" aria-hidden="true" />
          <div className="hero-shade" aria-hidden="true" />
          <div className="hero-spec" aria-hidden="true" />
          <div className="wrap hero-inner">
            <div>
              <span className="mono eyebrow hero-eb">Mobile detailing · Cheshire<span className="hide-m"> · By appointment</span></span>
              <h1 className="display">
                <span className="ln"><span>Ceramic</span></span>
                <span className="ln"><span>coating</span></span>
                <span className="ln ln-last"><span className="red">specialists.</span></span>
              </h1>
              <p className="lede">
                <b>Machine polishing</b> to take out fine scratches and <b>Gyeon ceramic coatings</b> to keep the gloss, for cars, vans and motorbikes. We come to you across Cheshire, the North West and North Wales, and <b>bring our own water</b>.
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
            <div className="hero-logo" aria-hidden="true"><Logo size="lg" decorative /></div>
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
              That&rsquo;s why a wash alone never brings it back. The gloss isn&rsquo;t hiding under dirt. It&rsquo;s been cut up by thousands of tiny marks.
            </p>
          </div>
        </section>


        {/* GARAGE */}
        <section className="garage" id="work" aria-labelledby="gar-h">
          <div className="garage-head wrap">
            <div>
              <span className="mono eyebrow">The garage</span>
              <h2 id="gar-h" className="display">Customer cars</h2>
            </div>
            <span className="mono r" style={{ color: "var(--dim)" }}>Hover for a second angle</span>
          </div>
          <div className="garage-ghost display" aria-hidden="true">PRESTIGE</div>
          <div className="garage-view is-off">
            <div className="garage-track" style={{ ["--n" as string]: CARS.length }}>
              {[0, 1].map((loop) =>
                CARS.map((c, i) => (
                  <article className="car" key={`${loop}-${c.name}`} aria-hidden={loop === 1 ? true : undefined}>
                    <span className="idx mono">{String(i + 1).padStart(2, "0")} / {String(CARS.length).padStart(2, "0")}</span>
                    <div className="ph">
                      <img decoding="async" data-src={`/img/${c.img}.webp`} data-srcset={`/img/${c.img}-xs.webp 480w, /img/${c.img}-sm.webp 800w, /img/${c.img}.webp 1400w`} sizes="(max-width: 820px) 340px, 420px" alt={loop === 1 ? "" : `${c.name}, a Prestige Cheshire Detailing customer car`} loading="lazy" />
                      <img decoding="async" className="alt" data-alt-src={`/img/${c.alt}.webp`} data-alt-srcset={`/img/${c.alt}-xs.webp 480w, /img/${c.alt}-sm.webp 800w, /img/${c.alt}.webp 1400w`} sizes="(max-width: 820px) 340px, 420px" alt="" loading="lazy" aria-hidden="true" />
                    </div>
                    <div className="meta">
                      <h3 className="name">{c.name}</h3>
                      <span className="mono" style={{ color: "var(--dim)" }}>{c.note}</span>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
          <div className="garage-next wrap">
            <div>
              <span className="mono eyebrow">Yours next</span>
              <h3 className="display">Send us a photo of yours.</h3>
              <p className="lede" style={{ margin: 0 }}>A couple of pictures on WhatsApp is all it takes to get a quote.</p>
            </div>
            <WaButton label="Send photos" text="Hi Craig, here are a few photos of my car. Could you give me a quote? " />
          </div>
        </section>

        {/* PROOF */}
        <section className="proof wrap" aria-labelledby="pr-h">
          <div className="proof-bg" aria-hidden="true">
            <img decoding="async" data-src="/img/rs3.webp" data-srcset="/img/rs3-xs.webp 480w, /img/rs3-sm.webp 800w, /img/rs3.webp 1600w" sizes="100vw" alt="" loading="lazy" />
          </div>
          <div className="proof-top">
            <div className="pct" aria-label={`${SITE.reviews.recommend} percent`}><span data-count={SITE.reviews.recommend}>{SITE.reviews.recommend}</span><sup>%</sup></div>
            <div>
              <span className="mono eyebrow">Facebook recommendations</span>
              <h2 id="pr-h" className="display-soft">{SITE.reviews.count} Facebook reviews. Every one recommends.</h2>
              <a href={SITE.facebookReviews} target="_blank" rel="noopener" className="btn btn-ghost" style={{ marginTop: 6 }}>
                Read the reviews on Facebook <Arrow size={16} />
              </a>
            </div>
          </div>
          <div className="themes">
            <div className="theme" data-reveal><span className="mono red">What reviewers mention</span><h3>Quick replies.</h3><p>Reviewers say we get back to them quickly.</p></div>
            <div className="theme" data-reveal><span className="mono red">What reviewers mention</span><h3>On time, every time.</h3><p>Appointment only, and reviewers say we turn up on time.</p></div>
            <div className="theme" data-reveal><span className="mono red">What reviewers mention</span><h3>Talked through it.</h3><p>Reviewers say we talk them through the job.</p></div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="services wrap" id="services" aria-labelledby="svc-h">
          <div className="svc-head">
            <div>
              <span className="mono eyebrow">What we do</span>
              <h2 id="svc-h" className="display" data-reveal>One job, one coating, <span className="red">done once.</span></h2>
            </div>
            <p className="lede" data-reveal>Prestige Cheshire Detailing specialises in paint correction and ceramic coatings, on cars, vans and motorbikes. Fully mobile.</p>
          </div>

          <article className="svc">
            <span className="no mono">01</span>
            <div className="tx">
              <h3 className="display">Machine <span className="red">polishing</span></h3>
              <p className="lede">Paint correction by machine to take out the fine scratches that make paint look flat, bringing back depth, clarity and true colour.</p>
              <ul>
                <li>Removes marring and fine scratches</li>
                <li>Brings back gloss and colour depth</li>
                <li>The right prep before any coating</li>
              </ul>
            </div>
            <figure className="im" style={{ margin: 0 }}>
              <img decoding="async" data-src="/img/pcd-39.webp" data-srcset="/img/pcd-39-xs.webp 480w, /img/pcd-39-sm.webp 800w, /img/pcd-39.webp 1400w" sizes="(max-width: 820px) 90vw, 40vw" alt="Mirror finish on the rear of a black Range Rover" loading="lazy" data-speed="0.12" />
              <span className="tag mono">Range Rover</span>
            </figure>
          </article>

          <article className="svc flip">
            <span className="no mono" style={{ gridColumn: "1", gridRow: "1" }}>02</span>
            <div className="tx">
              <h3 className="display">Gyeon ceramic <span className="red">coatings</span></h3>
              <p className="lede">A hard, glossy layer of protection over the corrected paint. Water beads and runs off, dirt struggles to stick, and the car is far easier to keep clean.</p>
              <ul>
                <li>Gyeon ceramic coatings</li>
                <li>Strong water beading</li>
                <li>Easier, safer washing afterwards</li>
              </ul>
            </div>
            <figure className="im" style={{ margin: 0 }}>
              <img decoding="async" data-src="/img/pcd-51.webp" data-srcset="/img/pcd-51-xs.webp 480w, /img/pcd-51-sm.webp 800w, /img/pcd-51.webp 1400w" sizes="(max-width: 820px) 90vw, 40vw" alt="Glossy purple Porsche wing reflecting its surroundings" loading="lazy" data-speed="0.12" />
              <span className="tag mono">Porsche Macan</span>
            </figure>
          </article>

          <div className="process" data-reveal>
            <p className="mono eyebrow">How we do it</p>
            <ol>
              <li><span className="mono">01</span>Digital paint mapping</li>
              <li><span className="mono">02</span>Pre-wash</li>
              <li><span className="mono">03</span>Contact wash</li>
              <li><span className="mono">04</span>Chemical decontamination</li>
            </ol>
          </div>

          <div className="chips" data-reveal>
            <span className="chip">Cars</span>
            <span className="chip">Vans</span>
            <span className="chip">Motorbikes</span>
            <span className="chip">Fully mobile</span>
            <span className="chip">Appointment only</span>
          </div>
          <CtaStrip line="Not sure which you need?" sub="Send us a photo and ask." text="Hi Craig, I'm not sure whether my car needs polishing, a ceramic coating or both. Here's a photo: " />
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
            <figure className="ph p1" style={{ margin: 0 }}><img decoding="async" data-src="/img/pcd-21.webp" data-srcset="/img/pcd-21-xs.webp 480w, /img/pcd-21-sm.webp 800w, /img/pcd-21.webp 1400w" sizes="(max-width: 820px) 90vw, 40vw" alt="Black VW Transporter after a detail, front view" loading="lazy" data-speed="0.1" /></figure>
            <figure className="ph p2" style={{ margin: 0 }}><img decoding="async" data-src="/img/pcd-23.webp" data-srcset="/img/pcd-23-xs.webp 480w, /img/pcd-23-sm.webp 800w, /img/pcd-23.webp 1400w" sizes="(max-width: 820px) 90vw, 40vw" alt="Black VW Transporter flank reflecting the sky" loading="lazy" data-speed="0.18" /></figure>
          </div>
        </section>

        {/* COVERAGE */}
        <section className="cover wrap" id="areas" aria-labelledby="cov-h">
          <div className="cover-grid">
            <div>
              <span className="mono eyebrow">Fully mobile</span>
              <h2 id="cov-h" className="display" data-reveal>We bring the water. <span className="red">You supply the power.</span></h2>
              <p className="lede" data-reveal>No need to provide water, we bring our own. All we need from you is access to a power socket. We cover Cheshire, the North West and North Wales, as far north as Wigan and Manchester. By appointment.</p>
              <div className="facts">
                <div><span className="mono" style={{ color: "var(--dim)" }}>Water</span><span className="k">Own supply</span></div>
                <div><span className="mono" style={{ color: "var(--dim)" }}>Power</span><span className="k">Your socket</span></div>
                <div><span className="mono" style={{ color: "var(--dim)" }}>Booking</span><span className="k">Appointment only</span></div>
              </div>
              <div style={{ marginTop: 30 }}><WaButton label="Check a date" text="Hi Craig, do you have any availability coming up? I'm in " /></div>
            </div>
            <CoverageMap />
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
              <h2 id="fin-h" className="display">Let&rsquo;s get&nbsp;it <span className="red">booked&nbsp;in.</span></h2>
              <p className="lede">Tell us what you drive and where you are. It opens WhatsApp with the message written for you. Add a photo and send.</p>
              <div className="alt-contact">
                <span>Or call <a href={SITE.phoneHref}>{SITE.phoneDisplay}</a></span>
                <span>Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a></span>
              </div>
              <div className="follow-row">
                <span className="mono">See more of our work</span>
                <Social />
              </div>
            </div>
            <Builder />
          </div>
        </section>
      </main>

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

      <LazyLoader />
      <Motion />
    </>
  );
}
