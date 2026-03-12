/**
 * Optimized responsive image component with WebP support
 * Uses <picture> element for format negotiation and srcset for responsive sizes
 */
const OptimizedImage = ({ 
  basePath,  // e.g. "/images/heroes/football"
  alt, 
  className = "", 
  priority = false,
  sizes = "(max-width: 640px) 400px, (max-width: 1024px) 800px, 1536px",
  fallbackSrc,
  onError
}) => {
  const webpSrcSet = `${basePath}-sm.webp 400w, ${basePath}-md.webp 800w, ${basePath}-lg.webp 1536w`;
  const fallback = fallbackSrc || `${basePath}.jpg`;

  return (
    <picture>
      <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
      <img
        src={fallback}
        alt={alt}
        className={className}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
        onError={onError}
      />
    </picture>
  );
};

export default OptimizedImage;
