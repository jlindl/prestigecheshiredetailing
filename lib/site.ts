export const SITE = {
  name: "Prestige Cheshire Detailing",
  owner: "Craig",
  phoneDisplay: "07791 543486",
  phoneHref: "tel:+447791543486",
  email: "prestige.valeting@outlook.com",
  facebook: "https://www.facebook.com/prestigecheshirevaleting",
  instagram: "https://www.instagram.com/prestigecheshiredetailing/",
  facebookReviews: "https://www.facebook.com/prestigecheshirevaleting/reviews",
  waNumber: "447791543486",
  reviews: { count: 21, recommend: 100 },
  areas: "Cheshire, the North West and North Wales",
  towns: ["Chester", "Northwich", "Winsford", "Sandbach", "Crewe", "Nantwich", "Macclesfield", "Wilmslow", "Bramhall", "Manchester", "Wigan"],
};

export function waLink(text = "Hi, I'd like a quote for a detail on my vehicle. ") {
  return `https://wa.me/${SITE.waNumber}?text=${encodeURIComponent(text)}`;
}
