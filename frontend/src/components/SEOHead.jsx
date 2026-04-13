import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BASE_URL = 'https://euromatchtickets.com';

/**
 * SEO Component for managing meta tags across all pages
 * Uses useEffect to update document head directly
 * Fixes Google Search Console issues:
 * - Canonical URL for each page
 * - No noindex issues
 * - Proper Open Graph tags
 */
const SEOHead = ({ 
  title, 
  description, 
  image,
  type = 'website',
  article = null,
  noIndex = false,
  canonicalUrl = null
}) => {
  const location = useLocation();
  const pageCanonicalUrl = canonicalUrl || `${BASE_URL}${location.pathname}`;
  
  const defaultTitle = 'EuroMatchTickets - Buy Football, F1 & Concert Tickets';
  const defaultDescription = 'Europe\u2019s cheapest event ticket shop! Buy verified tickets for Champions League, Formula 1, concerts and 500+ events. Instant QR delivery, FanProtect guarantee!';
  const defaultImage = `${BASE_URL}/logo-192.png`;

  const fullTitle = title && typeof title === 'string' && title.trim() 
    ? (title.includes('EuroMatchTickets') ? title : 
       (title.length + 19 <= 60 ? `${title} | EuroMatchTickets` : title))
    : defaultTitle;
  const metaDescription = description && typeof description === 'string' 
    ? description 
    : defaultDescription;
  const ogImage = image && typeof image === 'string' ? image : defaultImage;

  useEffect(() => {
    // Only clean up breadcrumb and FAQ pre-hydration schemas
    // Keep ph-event as a fallback until React renders its own Event schema
    ['ph-bread', 'ph-faq'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });

    // Update title
    document.title = fullTitle;

    // Helper to update or create meta tag
    const updateMetaTag = (selector, content, property = false) => {
      let meta = document.querySelector(selector);
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', selector.replace('meta[property="', '').replace('"]', ''));
        } else {
          meta.setAttribute('name', selector.replace('meta[name="', '').replace('"]', ''));
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Update meta tags - ALWAYS index, follow unless explicitly set
    updateMetaTag('meta[name="description"]', metaDescription);
    updateMetaTag('meta[name="robots"]', noIndex ? 'noindex, nofollow' : 'index, follow');
    
    // Open Graph - Required for Facebook sharing
    updateMetaTag('meta[property="og:title"]', fullTitle, true);
    updateMetaTag('meta[property="og:description"]', metaDescription, true);
    updateMetaTag('meta[property="og:image"]', ogImage, true);
    updateMetaTag('meta[property="og:image:width"]', '1200', true);
    updateMetaTag('meta[property="og:image:height"]', '630', true);
    updateMetaTag('meta[property="og:url"]', pageCanonicalUrl, true);
    updateMetaTag('meta[property="og:type"]', type === 'sports_event' ? 'website' : type, true);
    updateMetaTag('meta[property="og:site_name"]', 'EuroMatchTickets', true);
    updateMetaTag('meta[property="og:locale"]', 'en_US', true);
    
    // Twitter Cards
    updateMetaTag('meta[name="twitter:card"]', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', fullTitle);
    updateMetaTag('meta[name="twitter:description"]', metaDescription);
    updateMetaTag('meta[name="twitter:image"]', ogImage);
    updateMetaTag('meta[name="twitter:site"]', '@euromatchtickets');

    // Update canonical - CRITICAL for Google indexing
    // Remove ALL existing canonical tags first to prevent duplicates
    const existingCanonicals = document.querySelectorAll('link[rel="canonical"]');
    existingCanonicals.forEach((el, i) => {
      if (i > 0) el.remove(); // Keep only the first one
    });
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', pageCanonicalUrl);

    // Hreflang - remove old tags and set correct language-specific URLs
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
    
    const LANG_MAP = {
      '/': { es: '/es/comprar-entradas', de: '/de/tickets-kaufen', fr: '/fr/acheter-billets', it: '/it/biglietti' },
      '/champions-league-tickets': { es: '/es/entradas-champions-league', de: '/de/champions-league-tickets', fr: '/fr/billets-champions-league', it: '/it/biglietti-champions-league' },
      '/f1-tickets': { es: '/es/entradas-f1', de: '/de/formel-1-tickets', fr: '/fr/billets-f1', it: '/it/biglietti-f1' },
      '/es/comprar-entradas': { en: '/', de: '/de/tickets-kaufen', fr: '/fr/acheter-billets', it: '/it/biglietti' },
      '/es/entradas-champions-league': { en: '/champions-league-tickets', de: '/de/champions-league-tickets', fr: '/fr/billets-champions-league', it: '/it/biglietti-champions-league' },
      '/es/entradas-f1': { en: '/f1-tickets', de: '/de/formel-1-tickets', fr: '/fr/billets-f1', it: '/it/biglietti-f1' },
      '/de/tickets-kaufen': { en: '/', es: '/es/comprar-entradas', fr: '/fr/acheter-billets', it: '/it/biglietti' },
      '/de/champions-league-tickets': { en: '/champions-league-tickets', es: '/es/entradas-champions-league', fr: '/fr/billets-champions-league', it: '/it/biglietti-champions-league' },
      '/de/formel-1-tickets': { en: '/f1-tickets', es: '/es/entradas-f1', fr: '/fr/billets-f1', it: '/it/biglietti-f1' },
      '/fr/acheter-billets': { en: '/', es: '/es/comprar-entradas', de: '/de/tickets-kaufen', it: '/it/biglietti' },
      '/fr/billets-champions-league': { en: '/champions-league-tickets', es: '/es/entradas-champions-league', de: '/de/champions-league-tickets', it: '/it/biglietti-champions-league' },
      '/fr/billets-f1': { en: '/f1-tickets', es: '/es/entradas-f1', de: '/de/formel-1-tickets', it: '/it/biglietti-f1' },
      '/it/biglietti': { en: '/', es: '/es/comprar-entradas', de: '/de/tickets-kaufen', fr: '/fr/acheter-billets' },
      '/it/biglietti-champions-league': { en: '/champions-league-tickets', es: '/es/entradas-champions-league', de: '/de/champions-league-tickets', fr: '/fr/billets-champions-league' },
      '/it/biglietti-f1': { en: '/f1-tickets', es: '/es/entradas-f1', de: '/de/formel-1-tickets', fr: '/fr/billets-f1' },
    };

    const addHreflang = (lang, path) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', lang);
      link.setAttribute('href', `${BASE_URL}${path}`);
      document.head.appendChild(link);
    };

    const currentPath = location.pathname.replace(/\/+$/, '') || '/';
    const langMapping = LANG_MAP[currentPath];
    
    if (langMapping) {
      // This page has translations
      addHreflang('x-default', currentPath);
      let thisLang = 'en';
      if (currentPath.startsWith('/es/')) thisLang = 'es';
      else if (currentPath.startsWith('/de/')) thisLang = 'de';
      else if (currentPath.startsWith('/fr/')) thisLang = 'fr';
      else if (currentPath.startsWith('/it/')) thisLang = 'it';
      addHreflang(thisLang, currentPath);
      Object.entries(langMapping).forEach(([lang, path]) => addHreflang(lang, path));
    } else {
      // No translations - only self-referencing
      addHreflang('x-default', currentPath);
      addHreflang('en', currentPath);
    }

    // Cleanup
    return () => {
      document.title = defaultTitle;
    };
  }, [fullTitle, metaDescription, ogImage, pageCanonicalUrl, type, noIndex, defaultTitle]);

  return null; // This component doesn't render anything
};

export default SEOHead;
