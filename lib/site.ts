export const SITE = {
  name: "Prestige Cheshire Detailing",
  owner: "Craig",
  phoneDisplay: "07791 543486",
  phoneHref: "tel:+447791543486",
  email: "prestige.valeting@outlook.com",
  facebook: "https://www.facebook.com/prestigecheshirevaleting",
  facebookReviews: "https://www.facebook.com/prestigecheshirevaleting/reviews",
  waNumber: "447791543486",
  reviews: { count: 21, recommend: 100 },
  towns: ["Chester", "Northwich", "Winsford", "Sandbach", "Crewe", "Nantwich", "Macclesfield", "Wilmslow", "Bramhall"],
};

export function waLink(text = "Hi Craig, I'd like a quote for a detail on my car. ") {
  return `https://wa.me/${SITE.waNumber}?text=${encodeURIComponent(text)}`;
}
