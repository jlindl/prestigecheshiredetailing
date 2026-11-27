import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { CtaStrip } from "@/components/Cta";
import Gallery from "@/components/Gallery";
import SmoothScroll from "@/components/SmoothScroll";
import { PHOTOS } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Gallery | Prestige Cheshire Detailing",
  description: "Customer cars after machine polishing and Gyeon ceramic coatings, across Cheshire, the North West and North Wales.",
};

export default function GalleryPage() {
  return (
    <>
      <SiteHeader home={false} />
      <main className="gal-page">
        <section className="wrap gal-hero" aria-labelledby="galp-h">
          <span className="mono eyebrow">Gallery</span>
          <h1 id="galp-h" className="display">Customer cars, <span className="red">up close.</span></h1>
          <p className="lede">{PHOTOS.length} photos of cars, vans and bikes we&rsquo;ve looked after. Tap any photo to see it full size.</p>
        </section>
        <section className="wrap" aria-label="Photos">
          <Gallery />
        </section>
        <div className="wrap" style={{ marginTop: "clamp(50px, 8vh, 90px)" }}>
          <CtaStrip line="Want yours looking like this?" sub="Send us a photo for a quote." text="Hi Craig, I've seen your gallery. Here's a photo of my car, could you give me a quote? " />
        </div>
      </main>
      <SiteFooter />
      <SmoothScroll />
    </>
  );
}
