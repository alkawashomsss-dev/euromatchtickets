import { useEffect } from 'react';

/**
 * EventStructuredData - Generates proper Schema.org markup for events
 * Fixes Google Rich Results errors:
 * - missing location, image, organizer, endDate, offers
 */
const EventStructuredData = ({ event }) => {
  useEffect(() => {
    if (!event) return;

    // Determine event type schema
    const getEventType = (eventType) => {
      switch (eventType) {
        case 'concert':
          return 'MusicEvent';
        case 'f1':
        case 'motogp':
        case 'match':
        case 'worldcup':
          return 'SportsEvent';
        default:
          return 'Event';
      }
    };

    // Get organizer based on event type
    const getOrganizer = (eventType, title) => {
      if (eventType === 'f1') return { "@type": "Organization", "name": "Formula 1", "url": "https://www.formula1.com" };
      if (eventType === 'motogp') return { "@type": "Organization", "name": "MotoGP", "url": "https://www.motogp.com" };
      if (eventType === 'worldcup') return { "@type": "Organization", "name": "FIFA", "url": "https://www.fifa.com" };
      if (eventType === 'match') {
        if (title?.toLowerCase().includes('champions league')) {
          return { "@type": "Organization", "name": "UEFA", "url": "https://www.uefa.com" };
        }
        return { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" };
      }
      if (eventType === 'concert') {
        const artist = title?.split(' - ')[0] || title?.split(' Live')[0] || 'Artist';
        return { "@type": "Person", "name": artist };
      }
      return { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" };
    };

    // Calculate end date (typically same day for sports, +3 hours for concerts)
    const getEndDate = (startDate, eventType) => {
      if (!startDate) return null;
      const date = new Date(startDate);
      if (eventType === 'concert') {
        date.setHours(date.getHours() + 3);
      } else if (eventType === 'f1' || eventType === 'motogp') {
        date.setHours(date.getHours() + 2);
      } else {
        date.setHours(date.getHours() + 2);
      }
      return date.toISOString();
    };

    // Get lowest and highest prices
    const getPrices = (tickets, categories) => {
      let lowPrice = 50;
      let highPrice = 500;
      
      if (tickets && tickets.length > 0) {
        const prices = tickets.map(t => t.price).filter(p => p > 0);
        if (prices.length > 0) {
          lowPrice = Math.min(...prices);
          highPrice = Math.max(...prices);
        }
      } else if (categories) {
        const catPrices = Object.values(categories).map(c => c.lowest_price).filter(p => p > 0);
        if (catPrices.length > 0) {
          lowPrice = Math.min(...catPrices);
          highPrice = Math.max(...catPrices) * 3; // Estimate high price
        }
      }
      
      return { lowPrice: Math.round(lowPrice), highPrice: Math.round(highPrice) };
    };

    const { lowPrice, highPrice } = getPrices(event.tickets, event.categories);
    const availableTickets = event.available_tickets || event.tickets?.length || 50;
    const pageUrl = `https://euromatchtickets.com/event/${event.event_id}`;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": getEventType(event.event_type),
      "name": event.title || event.name,
      "description": event.description || `Buy tickets for ${event.title}. Secure booking with instant delivery. FanProtect guarantee included.`,
      "startDate": event.event_date || event.date,
      "endDate": getEndDate(event.event_date || event.date, event.event_type),
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "location": {
        "@type": "Place",
        "name": event.venue || "Venue TBA",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": event.city || "",
          "addressCountry": event.country || "Europe"
        }
      },
      "organizer": getOrganizer(event.event_type, event.title),
      "performer": event.event_type === 'concert' ? {
        "@type": "Person",
        "name": event.title?.split(' - ')[0] || event.title?.split(' Live')[0] || event.artist || "Artist"
      } : undefined,
      "image": event.image_url || event.image || "https://euromatchtickets.com/og-image.jpg",
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "EUR",
        "lowPrice": lowPrice.toString(),
        "highPrice": highPrice.toString(),
        "offerCount": availableTickets.toString(),
        "availability": availableTickets > 0 
          ? "https://schema.org/InStock" 
          : "https://schema.org/SoldOut",
        "url": pageUrl,
        "validFrom": new Date().toISOString().split('T')[0],
        "seller": {
          "@type": "Organization",
          "name": "EuroMatchTickets",
          "url": "https://euromatchtickets.com"
        }
      },
      "url": pageUrl
    };

    // Remove undefined fields
    Object.keys(structuredData).forEach(key => {
      if (structuredData[key] === undefined) {
        delete structuredData[key];
      }
    });

    // Add or update script tag
    let script = document.querySelector('script[data-schema="event"]');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema', 'event');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);

    // Cleanup
    return () => {
      const existingScript = document.querySelector('script[data-schema="event"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
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

    return () => {
      const existingScript = document.querySelector('script[data-schema="breadcrumb"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [items]);

  return null;
};

/**
 * FAQStructuredData - For FAQ pages
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

    return () => {
      const existingScript = document.querySelector('script[data-schema="faq"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [faqs]);

  return null;
};

export { EventStructuredData, BreadcrumbStructuredData, FAQStructuredData };
export default EventStructuredData;
