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
      } : event.event_type === 'f1' ? {
        "@type": "Organization",
        "name": "Formula 1 World Championship"
      } : event.event_type === 'motogp' ? {
        "@type": "Organization",
        "name": "MotoGP World Championship"
      } : event.event_type === 'worldcup' ? {
        "@type": "Organization",
        "name": "FIFA World Cup 2026"
      } : {
        "@type": "Organization",
        "name": event.title?.split(' vs ')[0]?.split(' v ')[0]?.trim() || "EuroMatchTickets Event"
      },
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
 * Helps get FAQ Rich Results in Google
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
        "url": "https://euromatchtickets.com/logo-600.png",
        "width": 600,
        "height": 600
      },
      "image": "https://euromatchtickets.com/og-image.jpg",
      "description": "Europe's trusted ticket marketplace for football, Formula 1, and concert tickets.",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+49-123-456-7890",
        "contactType": "customer service",
        "availableLanguage": ["English", "German", "Spanish", "French"]
      },
      "sameAs": [
        "https://facebook.com/euromatchtickets",
        "https://instagram.com/euromatchtickets",
        "https://twitter.com/euromatchtickets"
      ]
    };

    let script = document.querySelector('script[data-schema="organization"]');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema', 'organization');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);

    return () => {
      const existingScript = document.querySelector('script[data-schema="organization"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
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

    let script = document.querySelector('script[data-schema="website"]');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema', 'website');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);

    return () => {
      const existingScript = document.querySelector('script[data-schema="website"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return null;
};

// Common FAQ data for ticket pages
const commonTicketFAQs = [
  {
    question: "Is it safe to buy tickets from EuroMatchTickets?",
    answer: "Yes, all tickets sold on EuroMatchTickets are 100% verified. We offer FanProtect guarantee which ensures valid tickets, on-time delivery, and full refund if the event is cancelled."
  },
  {
    question: "When will I receive my tickets?",
    answer: "Most tickets are delivered digitally within 24 hours of purchase. For some events, tickets may be delivered closer to the event date. You'll receive an email with your tickets and QR code."
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
  commonTicketFAQs
};
export default EventStructuredData;
