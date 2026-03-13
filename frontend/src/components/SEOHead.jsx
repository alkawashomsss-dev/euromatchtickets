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
  const defaultDescription = 'Buy verified tickets for Champions League, Formula 1, Premier League, La Liga, and top concerts across Europe. 100% secure with instant QR delivery.';
  const defaultImage = `${BASE_URL}/og-image.jpg`;

  const fullTitle = title && typeof title === 'string' && title.trim() 
    ? `${title} | EuroMatchTickets` 
    : defaultTitle;
  const metaDescription = description && typeof description === 'string' 
    ? description 
    : defaultDescription;
  const ogImage = image && typeof image === 'string' ? image : defaultImage;

  useEffect(() => {
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
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', pageCanonicalUrl);

    // Hreflang - x-default for international targeting
    const updateHreflang = (lang, href) => {
      let link = document.querySelector(`link[hreflang="${lang}"]`);
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'alternate');
        link.setAttribute('hreflang', lang);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };
    updateHreflang('x-default', pageCanonicalUrl);
    updateHreflang('en', pageCanonicalUrl);
    updateHreflang('de', pageCanonicalUrl);
    updateHreflang('fr', pageCanonicalUrl);
    updateHreflang('es', pageCanonicalUrl);

    // Cleanup
    return () => {
      document.title = defaultTitle;
    };
  }, [fullTitle, metaDescription, ogImage, pageCanonicalUrl, type, noIndex, defaultTitle]);

  return null; // This component doesn't render anything
};

export default SEOHead;
