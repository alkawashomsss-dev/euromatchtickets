/**
 * Optimized responsive image component with WebP support.
 *
 * Accepts EITHER:
 *   - `basePath` (e.g. "/images/heroes/football") for legacy hero images
 *     that have -sm.webp / -md.webp / -lg.webp variants, OR
 *   - a direct URL in `src` for real collected images
 *     (/event-images/xxx.jpg or any http URL).
 */
const OptimizedImage = ({
  basePath,
  src: directSrc,
  alt,
  className = "",
  priority = false,
  sizes = "(max-width: 640px) 400px, (max-width: 1024px) 800px, 1536px",
  fallbackSrc,
  onError,
}) => {
  // 1. Real URL → single <img>, browser handles scaling
  if (directSrc || (basePath && /\.(jpg|jpeg|png|webp)$/i.test(basePath)) || basePath?.startsWith("/event-images/") || basePath?.startsWith("/api/event-images/") || basePath?.startsWith("http")) {
    const realSrc = directSrc || basePath;
    return (
      <img
        src={realSrc}
        alt={alt}
        className={className}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
        onError={onError}
      />
    );
  }

  // 2. Legacy hero base-path → picture with srcset
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
