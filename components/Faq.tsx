"use client";
import { useState } from "react";
import { SITE, waLink } from "@/lib/site";
import { WaButton } from "./Cta";

const QA: { q: string; a: React.ReactNode }[] = [
  {
    q: "How much does it cost?",
    a: (
      <>
        It depends on the size of the vehicle, the condition of the paint and whether you want polishing, a coating or both. The quickest way to get a price is to{" "}
        <a href={waLink("Hi Craig, could I get a price? Here are some photos of my car: ")} target="_blank" rel="noopener">send us a few photos on WhatsApp</a>.
      </>
    ),
  },
  {
    q: "Do I need to provide water or electricity?",
    a: <>You don&rsquo;t need to provide water, we&rsquo;re fully mobile and bring our own. We will need access to a power socket.</>,
  },
  {
    q: "Which areas do you cover?",
    a: <>{SITE.areas}, as far north as Wigan and Manchester. Not sure if you&rsquo;re covered? Just message us.</>,
  },
  {
    q: "How long does a ceramic coating last?",
    a: <>We use Gyeon ceramic coatings. How long any coating lasts in practice depends on how the car is washed and looked after.</>,
  },
  {
    q: "Do you do vans and motorbikes?",
    a: <>Yes. Cars, vans and motorbikes. Vans are a big part of the work, including Transporters and Transit Customs.</>,
  },
  {
    q: "How do I book?",
    a: (
      <>
        It&rsquo;s appointment only. Message on WhatsApp or call <a href={SITE.phoneHref}>{SITE.phoneDisplay}</a> to arrange a date.
      </>
    ),
  },
];

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="faq wrap" aria-labelledby="faq-h">
      <div>
        <span className="mono eyebrow">Before you message</span>
        <h2 id="faq-h" className="display">Good <span className="red">questions.</span></h2>
        <p className="lede">Anything else, just ask us directly. We&rsquo;re known for getting back quickly.</p>
        <div style={{ marginTop: 28 }}><WaButton label="Ask us" text="Hi Craig, I have a quick question: " /></div>
      </div>
      <div>
        {QA.map((item, i) => (
          <div key={item.q} className={`qa ${open === i ? "open" : ""}`}>
            <button aria-expanded={open === i} aria-controls={`qa-${i}`} onClick={() => setOpen(open === i ? -1 : i)}>
              {item.q}
              <span className="pm" aria-hidden="true" />
            </button>
            <div className="ans" id={`qa-${i}`} role="region">
              <div><p>{item.a}</p></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
