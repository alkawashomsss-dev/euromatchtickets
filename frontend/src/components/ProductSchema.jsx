/**
 * ProductSchema — DATA-DRIVEN, honesty-first.
 *
 * SAFE BY DEFAULT: if the caller doesn't pass `verified={true}` together with
 * a real `price` (from `/api/events`), this component renders nothing.
 *
 * We deliberately no longer synthesize reviewCount/ratingValue/offerCount or
 * hardcoded review rows. Those inflated Google rich-result signals were
 * flagged as trust risk across the site.
 *
 * Usage (ONLY on pages with confirmed inventory loaded from the API):
 *   <ProductSchema
 *     verified
 *     name={event.title}
 *     price={event.lowest_price}
 *     image={event.image_url}
 *     url={pageUrl}
 *     category={event.event_type}
 *   />
 */
const ProductSchema = ({
  verified = false,
  name,
  description,
  price,
  image,
  url,
  category = "concert",
}) => {
  // Honesty gate: no real verified data → no Product schema at all.
  if (!verified || !name || !price || price <= 0) {
    return null;
  }

  const brandMap = {
    f1: "Formula 1",
    motogp: "MotoGP",
    football: "UEFA",
    match: "UEFA",
    concert: "EuroMatchTickets",
    worldcup: "FIFA World Cup",
    festival: "EuroMatchTickets",
    tennis: "ATP/WTA",
    athletics: "World Athletics",
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name.endsWith("Tickets") ? name : `${name} Tickets`,
    "description":
      description ||
      `${name} tickets on EuroMatchTickets. Verified-seller inventory, escrowed payments, and full refund if the event is cancelled. Market pricing may vary.`,
    "image": image || "https://euromatchtickets.com/logo-192.png",
    "url": url,
    "brand": {
      "@type": "Organization",
      "name": brandMap[category] || "EuroMatchTickets",
    },
    "offers": {
      "@type": "Offer",
      "price": String(price),
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "url": url,
      "seller": {
        "@type": "Organization",
        "name": "EuroMatchTickets",
        "url": "https://euromatchtickets.com",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default ProductSchema;
