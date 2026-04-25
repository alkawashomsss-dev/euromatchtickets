import { useEffect } from 'react';

/**
 * EventStructuredData - Rich Schema.org markup for Google Rich Results
 * Shows: Event name, date, location, ticket prices, availability directly in search
 */
const EventStructuredData = ({ event }) => {
  useEffect(() => {
    if (!event) return;

    const getEventType = (eventType) => {
      switch (eventType) {
        case 'concert': return 'MusicEvent';
        case 'f1': case 'motogp': case 'match': case 'worldcup': return 'SportsEvent';
        default: return 'Event';
      }
    };

    const getOrganizer = (eventType, title) => {
      if (eventType === 'f1') return { "@type": "Organization", "name": "Formula 1", "url": "https://www.formula1.com" };
      if (eventType === 'motogp') return { "@type": "Organization", "name": "MotoGP", "url": "https://www.motogp.com" };
      if (eventType === 'worldcup') return { "@type": "Organization", "name": "FIFA", "url": "https://www.fifa.com" };
      if (eventType === 'match') {
        if (title?.toLowerCase().includes('champions league')) return { "@type": "Organization", "name": "UEFA", "url": "https://www.uefa.com" };
        return { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" };
      }
      if (eventType === 'concert') {
        const artist = title?.split(' - ')[0] || title?.split(' Live')[0] || 'Artist';
        return { "@type": "Person", "name": artist, "url": "https://euromatchtickets.com" };
      }
      return { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" };
    };

    const getEndDate = (startDate, eventType) => {
      if (!startDate) return null;
      const date = new Date(startDate);
      date.setHours(date.getHours() + (eventType === 'concert' ? 3 : 2));
      return date.toISOString();
    };

    const availableTickets = event.available_tickets || event.tickets?.length || 50;
    const pageUrl = `https://euromatchtickets.com/event/${event.slug || event.event_id}`;
    const eventImage = event.image_url || event.image || "https://euromatchtickets.com/images/heroes/football-stadium-lg.webp";

    const getPerformer = () => {
      if (event.event_type === 'concert') {
        return { "@type": "PerformingGroup", "name": event.title?.split(' - ')[0] || event.title?.split(' Live')[0] || event.artist || "Artist" };
      }
      if (event.event_type === 'f1') return { "@type": "SportsTeam", "name": "Formula 1 World Championship" };
      if (event.event_type === 'motogp') return { "@type": "SportsTeam", "name": "MotoGP World Championship" };
      if (event.event_type === 'worldcup') return { "@type": "SportsTeam", "name": "FIFA World Cup 2026" };
      // Football - try to extract teams
      const teams = event.title?.split(' vs ');
      if (teams?.length === 2) {
        return [
          { "@type": "SportsTeam", "name": teams[0].trim() },
          { "@type": "SportsTeam", "name": teams[1].trim() }
        ];
      }
      return { "@type": "Organization", "name": event.title || "Event" };
    };

    // Main Event Schema - Google Rich Result optimized.
    // NOTE: We deliberately do NOT emit `offers` here. Per platform mandate,
    // a ticket resale marketplace cannot accurately represent a single
    // canonical "price/availability" Offer per Event. Including a Product or
    // AggregateOffer block on a marketplace page triggers Google validation
    // errors (price required, etc.) without unlocking valid Merchant rich
    // results. Keep Event schema clean and let buyers see live prices in-page.
    const eventSchema = {
      "@context": "https://schema.org",
      "@type": getEventType(event.event_type),
      "name": event.title || event.name,
      "description": event.description || `Buy tickets for ${event.title}. Secure booking with Buyer protection and QR ticket delivery.`,
      "startDate": event.event_date || event.date,
      "endDate": getEndDate(event.event_date || event.date, event.event_type),
      "eventStatus": event.status === 'postponed'
        ? "https://schema.org/EventPostponed"
        : event.status === 'cancelled'
          ? "https://schema.org/EventCancelled"
          : "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "location": {
        "@type": "Place",
        "name": event.venue || "Venue TBA",
        "url": pageUrl,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": event.city || "",
          "addressRegion": event.region || "",
          "addressCountry": event.country || "Europe"
        }
      },
      "organizer": getOrganizer(event.event_type, event.title),
      "performer": getPerformer(),
      "image": [eventImage],
      "url": pageUrl
    };

    let script = document.querySelector('script[data-schema="event"]');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema', 'event');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(eventSchema);
    // Note: no cleanup remove(). The next event navigation will overwrite
    // textContent above. Removing here races with React reconciliation and
    // causes "finishedRoot.parentNode.removeChild" errors.
  }, [event]);

  return null;
};

/**
 * BreadcrumbStructuredData - For navigation breadcrumbs
 */
const BreadcrumbStructuredData = ({ items }) => {
  useEffect(() => {
    if (!items || items.length === 0) return;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url
      }))
    };

    let script = document.querySelector('script[data-schema="breadcrumb"]');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema', 'breadcrumb');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);
  }, [items]);

  return null;
};

/**
 * FAQStructuredData - For FAQ Rich Results in Google
 */
const FAQStructuredData = ({ faqs }) => {
  useEffect(() => {
    if (!faqs || faqs.length === 0) return;

    const structuredData = {
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

    let script = document.querySelector('script[data-schema="faq"]');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema', 'faq');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);
  }, [faqs]);

  return null;
};

/**
 * OrganizationStructuredData - For homepage and about page
 */
const OrganizationStructuredData = () => {
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "EuroMatchTickets",
      "url": "https://euromatchtickets.com",
      "logo": {
        "@type": "ImageObject",
        "name": "EuroMatchTickets Logo",
        "url": "https://euromatchtickets.com/logo-600.png",
        "width": 600,
        "height": 600
      },
      "image": "https://euromatchtickets.com/logo-192.png",
      "description": "Europe's trusted ticket marketplace for football, Formula 1, and concert tickets.",
      "foundingDate": "2024",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Erzgießereistraße 15",
        "addressLocality": "München",
        "postalCode": "80335",
        "addressCountry": "DE"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "name": "EuroMatchTickets Customer Service",
        "email": "support@euromatchtickets.com",
        "contactType": "customer service",
        "availableLanguage": ["English", "German", "Spanish", "French", "Arabic"]
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "2847",
        "bestRating": "5",
        "worstRating": "1"
      },
      "sameAs": [
        "https://facebook.com/euromatchtickets",
        "https://instagram.com/euromatchtickets",
        "https://twitter.com/euromatchtickets"
      ]
    };

    // Remove pre-hydration duplicate before adding React-managed version
    const phOrg = document.getElementById('ph-org');
    if (phOrg && phOrg.parentNode) phOrg.parentNode.removeChild(phOrg);

    let script = document.querySelector('script[data-schema="organization"]');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema', 'organization');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);
  }, []);

  return null;
};

/**
 * WebsiteStructuredData - For sitelinks search box
 */
const WebsiteStructuredData = () => {
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "EuroMatchTickets",
      "url": "https://euromatchtickets.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://euromatchtickets.com/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    };

    // Remove pre-hydration duplicate before adding React-managed version
    const phSite = document.getElementById('ph-site');
    if (phSite && phSite.parentNode) phSite.parentNode.removeChild(phSite);

    let script = document.querySelector('script[data-schema="website"]');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema', 'website');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);
  }, []);

  return null;
};

/**
 * LocalBusinessStructuredData - For Google Business Profile
 */
const LocalBusinessStructuredData = () => {
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "EuroMatchTickets",
      "alternateName": "Euro Match Tickets",
      "url": "https://euromatchtickets.com",
      "logo": "https://euromatchtickets.com/logo512.png",
      "image": "https://euromatchtickets.com/logo-192.png",
      "description": "European ticket marketplace for FIFA World Cup 2026, Champions League, Premier League, F1, MotoGP, concerts and more. Verified-seller listings with QR ticket delivery.",
      "priceRange": "€€",
      "telephone": "+49-89-20174141",
      "email": "support@euromatchtickets.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Fürstenrieder Str. 33",
        "addressLocality": "Munich",
        "addressRegion": "Bayern",
        "postalCode": "80686",
        "addressCountry": "DE"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 48.1351,
        "longitude": 11.5820
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "00:00",
        "closes": "23:59"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "2847",
        "bestRating": "5",
        "worstRating": "1"
      },
      "sameAs": [
        "https://facebook.com/euromatchtickets",
        "https://instagram.com/euromatchtickets",
        "https://twitter.com/euromatchtickets",
        "https://linkedin.com/company/euromatchtickets"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Event Tickets",
        "itemListElement": [
          { "@type": "OfferCatalog", "name": "Football Tickets" },
          { "@type": "OfferCatalog", "name": "Concert Tickets" },
          { "@type": "OfferCatalog", "name": "Formula 1 Tickets" },
          { "@type": "OfferCatalog", "name": "MotoGP Tickets" }
        ]
      }
    };

    let script = document.querySelector('script[data-schema="localbusiness"]');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema', 'localbusiness');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);
  }, []);

  return null;
};

// Common FAQ data for ticket pages
const commonTicketFAQs = [
  {
    question: "Is it safe to buy tickets from EuroMatchTickets?",
    answer: "Yes, all tickets sold on EuroMatchTickets are verified. We offer Buyer protection which ensures valid tickets, on-time delivery, and full refund if the event is cancelled."
  },
  {
    question: "When will I receive my tickets?",
    answer: "Most tickets are delivered digitally within minutes of purchase as secure QR codes. For some events, tickets may be delivered closer to the event date. You'll receive an email with your tickets."
  },
  {
    question: "Are resale tickets legal?",
    answer: "Yes, ticket resale is legal in most European countries. EuroMatchTickets operates as a legitimate secondary marketplace connecting buyers with verified sellers."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and other secure payment methods through Stripe."
  },
  {
    question: "Can I get a refund if I can't attend the event?",
    answer: "While all sales are generally final, you may be eligible for a refund if the event is cancelled or significantly changed. Contact our customer support for assistance."
  }
];

export { 
  EventStructuredData, 
  BreadcrumbStructuredData, 
  FAQStructuredData,
  OrganizationStructuredData,
  WebsiteStructuredData,
  LocalBusinessStructuredData,
  commonTicketFAQs
};
export default EventStructuredData;
