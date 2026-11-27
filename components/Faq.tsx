"use client";
import { useState } from "react";
import { SITE, waLink } from "@/lib/site";

const QA: { q: string; a: React.ReactNode }[] = [
  {
    q: "How much does it cost?",
    a: (
      <>
        It depends on the size of the vehicle, the condition of the paint and whether you want polishing, a coating or both. The quickest way to get a price is to{" "}
        <a href={waLink("Hi, could I get a price? Here are some photos of my car: ")} target="_blank" rel="noopener">send us a few photos on WhatsApp</a>.
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
    q: "Do you come to me, or do I drop the vehicle off?",
    a: <>We come to you. We&rsquo;re fully mobile and bring our own water, so all you need is a power socket and space to work.</>,
  },
  {
    q: "Which coatings do you use?",
    a: <>Gyeon and Gtechniq ceramic coatings. How long any coating lasts in practice depends on how the vehicle is washed and looked after.</>,
  },
  {
    q: "Do you do vans and motorbikes?",
    a: <>Yes. Cars, vans and motorbikes.</>,
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
    <div className="faq-list">
      {QA.map((item, i) => (
        <div key={item.q} className={`qa ${open === i ? "open" : ""}`} data-rv>
          <button type="button" aria-expanded={open === i} aria-controls={`qa-${i}`} id={`qb-${i}`} onClick={() => setOpen(open === i ? -1 : i)}>
            <span>{item.q}</span>
            <span className="pm" aria-hidden="true" />
          </button>
          <div className="ans" id={`qa-${i}`} role="region" aria-labelledby={`qb-${i}`}>
            <div><p>{item.a}</p></div>
          </div>
        </div>
      ))}
    </div>
  );
}
