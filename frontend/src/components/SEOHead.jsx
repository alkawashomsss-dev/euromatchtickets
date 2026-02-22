import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BASE_URL = 'https://euromatchtickets.com';

/**
 * SEO Component for managing meta tags across all pages
 * Uses useEffect to update document head directly
 */
const SEOHead = ({ 
  title, 
  description, 
  image,
  type = 'website',
  article = null,
  noIndex = false 
}) => {
  const location = useLocation();
  const canonicalUrl = `${BASE_URL}${location.pathname}`;
  
  const defaultTitle = 'EuroMatchTickets - Buy Football & Concert Tickets';
  const defaultDescription = 'Buy verified tickets for Champions League, Premier League, La Liga, and top concerts across Europe. 100% secure with instant QR delivery.';
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

    // Update meta tags
    updateMetaTag('meta[name="description"]', metaDescription);
    updateMetaTag('meta[name="robots"]', noIndex ? 'noindex, nofollow' : 'index, follow');
    
    // Open Graph
    updateMetaTag('meta[property="og:title"]', fullTitle, true);
    updateMetaTag('meta[property="og:description"]', metaDescription, true);
    updateMetaTag('meta[property="og:image"]', ogImage, true);
    updateMetaTag('meta[property="og:url"]', canonicalUrl, true);
    updateMetaTag('meta[property="og:type"]', type, true);
    
    // Twitter
    updateMetaTag('meta[name="twitter:title"]', fullTitle);
    updateMetaTag('meta[name="twitter:description"]', metaDescription);
    updateMetaTag('meta[name="twitter:image"]', ogImage);

    // Update canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // Cleanup
    return () => {
      document.title = defaultTitle;
    };
  }, [fullTitle, metaDescription, ogImage, canonicalUrl, type, noIndex, defaultTitle]);

  return null; // This component doesn't render anything
};

export default SEOHead;
