import { Helmet } from 'react-helmet-async';

// SEO Helper Component for dynamic meta tags
export const SEOHead = ({ 
  title, 
  description, 
  keywords,
  image,
  url,
  type = 'website',
  event = null 
}) => {
  const baseTitle = 'FanPass';
  const fullTitle = title ? `${title} | ${baseTitle}` : `${baseTitle} - Buy Verified Concert & Football Tickets`;
  const defaultDescription = "Buy and sell verified tickets for Champions League, Premier League, concerts. 100% secure with instant QR delivery.";
  const defaultImage = "/og-image.jpg";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:type" content={type} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:image" content={image || defaultImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || defaultImage} />

      {/* Event Schema */}
      {event && (
        <script type="application/ld+json">
          {JSON.stringify(generateEventSchema(event))}
        </script>
      )}
    </Helmet>
  );
};

// Generate Event Schema for SEO
export const generateEventSchema = (event) => {
  const isMatch = event.event_type === 'match';
  
  const schema = {
    "@context": "https://schema.org",
    "@type": isMatch ? "SportsEvent" : "MusicEvent",
    "name": event.title,
    "description": event.subtitle || `${event.title} at ${event.venue}`,
    "startDate": event.event_date,
    "location": {
      "@type": "Place",
      "name": event.venue,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": event.city,
        "addressCountry": event.country
      }
    },
    "image": event.event_image,
    "url": `https://fanpass.com/event/${event.event_id}`,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode"
  };

  // Add performer for concerts
  if (!isMatch && event.artist) {
    schema.performer = {
      "@type": "MusicGroup",
      "name": event.artist
    };
  }

  // Add teams for sports events
  if (isMatch && event.home_team) {
    schema.homeTeam = {
      "@type": "SportsTeam",
      "name": event.home_team
    };
    schema.awayTeam = {
      "@type": "SportsTeam",
      "name": event.away_team
    };
    schema.sport = "Football";
  }

  // Add offers if tickets available
  if (event.lowest_price) {
    schema.offers = {
      "@type": "AggregateOffer",
      "lowPrice": event.lowest_price,
      "priceCurrency": "EUR",
      "availability": event.available_tickets > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/SoldOut",
      "validFrom": new Date().toISOString(),
      "url": `https://fanpass.com/event/${event.event_id}`
    };
  }

  return schema;
};

// Generate Ticket/Product Schema
export const generateTicketSchema = (ticket, event) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${event.title} - ${ticket.category.toUpperCase()} Ticket`,
    "description": `${ticket.category} ticket for ${event.title} at ${event.venue}. Section: ${ticket.section}`,
    "category": "Event Ticket",
    "offers": {
      "@type": "Offer",
      "price": ticket.price,
      "priceCurrency": ticket.currency || "EUR",
      "availability": ticket.status === "available" 
        ? "https://schema.org/InStock" 
        : "https://schema.org/SoldOut",
      "seller": {
        "@type": "Organization",
        "name": ticket.seller_name
      }
    }
  };
};

// Generate BreadcrumbList Schema
export const generateBreadcrumbSchema = (items) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

// Generate FAQ Schema for help pages
export const generateFAQSchema = (faqs) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

export default SEOHead;
