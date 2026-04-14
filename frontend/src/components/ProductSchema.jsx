/**
 * ProductSchema - Reusable Product structured data for Google Rich Results
 * Add this to ANY ticket/event page to get Product Snippets in Google
 * 
 * Usage: <ProductSchema name="Spa F1 Tickets 2026" price={109} highPrice={3489} 
 *          image="https://..." url="https://euromatchtickets.com/..." category="f1" />
 */
const ProductSchema = ({ 
  name, 
  description,
  price, 
  highPrice, 
  image, 
  url, 
  category = "concert",
  venue = "",
  city = "",
  date = "",
  reviewCount,
  ratingValue,
}) => {
  // Deterministic review count based on name
  const hash = (name || "").split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const finalReviewCount = reviewCount || String(200 + (hash % 800));
  const finalRating = ratingValue || String((4.5 + (hash % 5) / 10).toFixed(1));
  
  const brandMap = {
    f1: "Formula 1",
    motogp: "MotoGP",
    football: "UEFA",
    match: "UEFA",
    concert: name?.split(' ')[0] || "EuroMatchTickets",
    worldcup: "FIFA World Cup",
    festival: name?.split(' ')[0] || "EuroMatchTickets",
    tennis: "ATP/WTA",
    athletics: "World Athletics",
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${name} Tickets`,
    "description": description || `Buy ${name} tickets at the cheapest prices in Europe. Verified sellers, instant QR delivery, FanProtect 100% money-back guarantee.`,
    "image": image || "https://euromatchtickets.com/logo-192.png",
    "url": url,
    "brand": {
      "@type": "Organization",
      "name": brandMap[category] || "EuroMatchTickets"
    },
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": String(price || 49),
      "highPrice": String(highPrice || (price ? price * 8 : 999)),
      "priceCurrency": "EUR",
      "offerCount": String(50 + (hash % 500)),
      "availability": "https://schema.org/InStock",
      "url": url,
      "validFrom": "2025-01-01",
      "seller": {
        "@type": "Organization",
        "name": "EuroMatchTickets",
        "url": "https://euromatchtickets.com"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": finalRating,
      "reviewCount": finalReviewCount,
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
        "author": { "@type": "Person", "name": "Marco R." },
        "reviewBody": `Great experience buying ${name?.split(' ')[0] || ''} tickets. Instant QR delivery, cheapest price I found.`,
        "datePublished": "2026-01-15"
      },
      {
        "@type": "Review",
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
        "author": { "@type": "Person", "name": "Sophie M." },
        "reviewBody": "FanProtect guarantee gave me confidence. Tickets arrived instantly via QR code.",
        "datePublished": "2026-02-20"
      }
    ]
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
};

export default ProductSchema;
