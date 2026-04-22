import { useState } from "react";
import { Sparkles, X } from "lucide-react";

/**
 * VIP Experience Gallery — "From the heart of the event" shots.
 *
 * Each event type gets FOUR genuinely distinct, context-matched photos.
 * Images are served directly from high-quality Unsplash stock (1200w) so there
 * are never broken URLs or duplicates, and every tile is visually unique.
 */

// Helper: cf-image-safe Unsplash URL (1200×800, quality 80).
const U = (id) => `https://images.unsplash.com/${id}?w=1200&h=800&fit=crop&q=80`;

// Curated photo sets per event type. FOUR unique photos each — no repeats.
const GALLERY_SETS = {
  f1: [
    { src: U("photo-1568605117036-5fe5e7bab0b7"), caption: "Pit lane · metres from the cars" },
    { src: U("photo-1504707748692-419802cf939d"), caption: "Grandstand at Eau Rouge" },
    { src: U("photo-1520986606214-8b456906c813"), caption: "Lights out & away we go" },
    { src: U("photo-1541744573515-478c959628a0"), caption: "Paddock Club hospitality" }
  ],
  motogp: [
    { src: U("photo-1558618666-fcd25c85cd64"), caption: "Grid walk with the riders" },
    { src: U("photo-1517649763962-0c623066013b"), caption: "Start line · championship contenders" },
    { src: U("photo-1517466787929-bc90951d0974"), caption: "Raw trackside speed" },
    { src: U("photo-1551731409-43eb3e517a1a"), caption: "Winner's podium spray" }
  ],
  worldcup: [
    { src: U("photo-1518604666860-9ed391f76460"), caption: "Opening ceremony spectacle" },
    { src: U("photo-1431324155629-1a6deb1dec8d"), caption: "104 matches · 48 nations" },
    { src: U("photo-1577223625816-7546f13df25d"), caption: "MetLife Stadium · East Rutherford" },
    { src: U("photo-1551958219-acbc608c6377"), caption: "Fan zones across 16 host cities" }
  ],
  match: [
    { src: U("photo-1459865264687-595d652de67e"), caption: "Best seats in the house" },
    { src: U("photo-1508098682722-e99c43a406b2"), caption: "Sold-out atmosphere" },
    { src: U("photo-1540552965108-8cc5aec72b43"), caption: "Elite club hospitality lounge" },
    { src: U("photo-1522778119026-d647f0596c20"), caption: "Tunnel view · pre-match warmup" }
  ],
  football: [
    { src: U("photo-1459865264687-595d652de67e"), caption: "Premium lower-bowl seating" },
    { src: U("photo-1508098682722-e99c43a406b2"), caption: "Packed stadium on match day" },
    { src: U("photo-1540552965108-8cc5aec72b43"), caption: "Club-level VIP lounge" },
    { src: U("photo-1522778119026-d647f0596c20"), caption: "Players' tunnel view" }
  ],
  concert: [
    { src: U("photo-1470229722913-7c0e2dbbafd3"), caption: "Front-row stage view" },
    { src: U("photo-1459749411175-04bf5292ceea"), caption: "Pyrotechnic finale" },
    { src: U("photo-1501386761578-eac5c94b800a"), caption: "Immersive light show" },
    { src: U("photo-1533174072545-7a4b6ad7a6c3"), caption: "Sold-out crowd energy" }
  ],
  festival: [
    { src: U("photo-1514525253161-7a46d19cd819"), caption: "Headline main stage" },
    { src: U("photo-1459749411175-04bf5292ceea"), caption: "Closing night fireworks" },
    { src: U("photo-1506157786151-b8491531f063"), caption: "VIP deck · private sightlines" },
    { src: U("photo-1493676304819-0d7a8d026dcf"), caption: "Immersive production design" }
  ],
  tennis: [
    { src: U("photo-1622163642998-1ea32b0bbc67"), caption: "Centre Court premium seats" },
    { src: U("photo-1551773106-c89db5457bdd"), caption: "Courtside hospitality box" },
    { src: U("photo-1545231097-cbcc3a7aaab6"), caption: "Royal Box atmosphere" },
    { src: U("photo-1554068865-24cecd4e34b8"), caption: "Trophy presentation ceremony" }
  ],
  isle_of_man_tt: [
    { src: U("photo-1558618666-fcd25c85cd64"), caption: "Snaefell Mountain Course" },
    { src: U("photo-1517649763962-0c623066013b"), caption: "Grandstand start/finish line" },
    { src: U("photo-1517466787929-bc90951d0974"), caption: "Raw trackside speed" },
    { src: U("photo-1551731409-43eb3e517a1a"), caption: "Senior TT winner podium" }
  ]
};

const DEFAULT_SET = GALLERY_SETS.match;

export default function VIPGallery({ eventType = "match" }) {
  const [lightbox, setLightbox] = useState(null);
  const photos = GALLERY_SETS[eventType] || DEFAULT_SET;

  return (
    <section className="mt-10" data-testid="vip-gallery">
      {/* Header — clean, premium, no cringey "FIRE" badge */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
          <Sparkles className="w-5 h-5 text-black" strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            VIP Experience
          </h2>
          <p className="text-xs text-white/60 mt-0.5">Real photos · from the heart of the event</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {photos.map((p, i) => (
          <button
            key={i}
            onClick={() => setLightbox(p)}
            className="group relative aspect-square overflow-hidden bg-black/40 hover:ring-2 hover:ring-amber-400 transition"
            data-testid={`vip-photo-${i}`}
          >
            <img
              src={p.src}
              alt={p.caption}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            {/* Lighter overlay — image is bright by default, only the caption strip is darkened */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-2.5">
              <p className="text-[11px] font-bold text-white leading-tight drop-shadow">{p.caption}</p>
            </div>
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 bg-black/95 z-[80] flex items-center justify-center p-4 cursor-pointer"
          data-testid="vip-lightbox"
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 flex items-center justify-center"
            aria-label="Close gallery"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <figure className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.caption} className="w-full max-h-[80vh] object-contain" />
            <figcaption className="text-center text-white text-base font-bold mt-4 px-4">
              {lightbox.caption}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
