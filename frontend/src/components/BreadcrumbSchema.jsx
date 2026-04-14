/**
 * BreadcrumbSchema - Reusable Breadcrumb structured data for Google
 * 
 * Usage: <BreadcrumbSchema items={[
 *   { name: "Home", url: "https://euromatchtickets.com" },
 *   { name: "F1 Tickets", url: "https://euromatchtickets.com/f1-tickets" },
 *   { name: "Spa F1 Tickets 2026", url: "https://euromatchtickets.com/f1-belgian-grand-prix-spa-tickets" }
 * ]} />
 */
const BreadcrumbSchema = ({ items }) => {
  if (!items || items.length === 0) return null;
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
};

export default BreadcrumbSchema;
