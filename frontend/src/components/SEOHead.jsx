import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const BASE_URL = 'https://euromatchtickets.com';

/**
 * SEO Component for managing meta tags across all pages
 * Provides canonical URLs, Open Graph, Twitter Cards, and structured data
 */
const SEOHead = ({ 
  title, 
  description, 
  image,
  type = 'website',
  article = null,
  event = null,
  noIndex = false 
}) => {
  const location = useLocation();
  const canonicalUrl = `${BASE_URL}${location.pathname}`;
  
  const defaultTitle = 'EuroMatchTickets - Buy Football & Concert Tickets';
  const defaultDescription = 'Buy verified tickets for Champions League, Premier League, La Liga, and top concerts across Europe. 100% secure with instant QR delivery.';
  const defaultImage = `${BASE_URL}/og-image.jpg`;

  const fullTitle = title ? `${title} | EuroMatchTickets` : defaultTitle;
  const metaDescription = description || defaultDescription;
  const ogImage = image || defaultImage;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={metaDescription} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large" />
      )}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="EuroMatchTickets" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Article specific tags */}
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          <meta property="article:author" content={article.author} />
          <meta property="article:section" content={article.section} />
        </>
      )}
    </Helmet>
  );
};

export default SEOHead;
