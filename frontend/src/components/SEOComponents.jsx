import { useState, useEffect, useRef } from 'react';

/**
 * OptimizedImage - Lazy loading image with WebP support
 * Improves page speed and Core Web Vitals
 */
export const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  width, 
  height,
  priority = false 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Placeholder blur */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-100 animate-pulse" />
      )}
      
      {isInView && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};

/**
 * RelatedEvents - Internal linking component for SEO
 * Shows related events to improve crawlability
 */
export const RelatedEvents = ({ currentEvent, events = [] }) => {
  // Filter related events (same type, same city, or similar date)
  const relatedEvents = events
    .filter(e => e.event_id !== currentEvent?.event_id)
    .filter(e => 
      e.event_type === currentEvent?.event_type ||
      e.city === currentEvent?.city
    )
    .slice(0, 6);

  if (relatedEvents.length === 0) return null;

  return (
    <div className="mt-12 border-t border-white/5 pt-8">
      <h2 className="text-2xl font-bold mb-6">Related Events You Might Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {relatedEvents.map(event => (
          <a
            key={event.event_id}
            href={`/event/${event.event_id}`}
            className="block p-4 bg-white border border-white/5 rounded-xl hover:border-cyan-500/50 transition-all"
          >
            <p className="font-semibold text-sm line-clamp-2">{event.title}</p>
            <p className="text-xs text-slate-400 mt-1">{event.city}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

/**
 * InternalLinks - SEO internal linking section
 */
export const InternalLinks = ({ currentCategory }) => {
  const links = {
    f1: [
      { name: "Monaco Grand Prix", url: "/monaco-grand-prix-tickets" },
      { name: "F1 Tickets 2026", url: "/f1-tickets" },
      { name: "Abu Dhabi GP", url: "/f1-abu-dhabi-grand-prix-tickets" },
      { name: "Las Vegas GP", url: "/f1-las-vegas-grand-prix-tickets" },
      { name: "F1 Ticket Guide", url: "/f1-ticket-prices-guide" },
    ],
    match: [
      { name: "Champions League", url: "/champions-league-tickets" },
      { name: "El Clasico", url: "/el-clasico-tickets" },
      { name: "Real Madrid", url: "/real-madrid-tickets" },
      { name: "Barcelona", url: "/barcelona-tickets" },
      { name: "World Cup 2026", url: "/world-cup-2026-tickets" },
    ],
    concert: [
      { name: "Bruno Mars Tour", url: "/bruno-mars-tour-2026" },
      { name: "Coldplay Tour", url: "/coldplay-tour-2026" },
      { name: "Ed Sheeran", url: "/ed-sheeran-tour-2026" },
      { name: "London Events", url: "/london-events" },
      { name: "Paris Events", url: "/paris-events" },
    ],
  };

  const categoryLinks = links[currentCategory] || links.match;

  return (
    <div className="mt-8 py-6 border-t border-white/5">
      <h3 className="text-lg font-semibold mb-4 text-slate-500">Popular Tickets</h3>
      <div className="flex flex-wrap gap-2">
        {categoryLinks.map((link, idx) => (
          <a
            key={idx}
            href={link.url}
            className="px-3 py-1.5 bg-slate-50 border border-white/5 rounded-full text-sm hover:border-cyan-500/50 hover:text-cyan-400 transition-all"
          >
            {link.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default OptimizedImage;
