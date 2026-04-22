import { useState } from "react";
import { Flame, X } from "lucide-react";

/**
 * VIP Experience Gallery — "From the heart of the event" shots.
 *
 * Shows real photos from inside real events: pit lanes, packed stadiums,
 * concert pyros, grid walks. Photo set is selected based on event type.
 */

const IMG = (slug) => `/api/event-images/vip/${slug}.jpg`;

// Curated photo sets per event type.
const GALLERY_SETS = {
  f1: [
    { src: IMG("f1-paddock"),  caption: "Pit Lane — metres from the action" },
    { src: IMG("f1-podium"),   caption: "Champagne podium celebration" },
    { src: IMG("f1-start"),    caption: "Lights out & away we go" },
    { src: IMG("f1-paddock"),  caption: "Paddock Club hospitality" },
  ],
  motogp: [
    { src: IMG("motogp-race"), caption: "Grid walk with the riders" },
    { src: IMG("motogp-grid"), caption: "Championship contenders lined up" },
    { src: IMG("f1-podium"),   caption: "Winner's podium spray" },
    { src: IMG("f1-start"),    caption: "The fastest motorcycles on earth" },
  ],
  worldcup: [
    { src: IMG("wc-ceremony"),   caption: "World Cup opening ceremony" },
    { src: IMG("wc-atmosphere"), caption: "104 matches · 48 nations" },
    { src: IMG("stadium-packed"),caption: "MetLife Final atmosphere" },
    { src: IMG("stadium-interior"), caption: "Iconic host stadiums" },
  ],
  match: [
    { src: IMG("stadium-interior"),  caption: "Best seats in the house" },
    { src: IMG("stadium-packed"),    caption: "Sold-out atmosphere" },
    { src: IMG("stadium-atmosphere"),caption: "Elite club hospitality" },
    { src: IMG("stadium-tunnel"),    caption: "Tunnel view · Pre-match warmup" },
  ],
  football: [
    { src: IMG("stadium-interior"),  caption: "Premium lower-bowl seating" },
    { src: IMG("stadium-packed"),    caption: "Packed stadium on match day" },
    { src: IMG("stadium-atmosphere"),caption: "Club-level VIP lounge" },
    { src: IMG("stadium-tunnel"),    caption: "Players' tunnel view" },
  ],
  concert: [
    { src: IMG("concert-stage"),  caption: "Front-row stage view" },
    { src: IMG("concert-pyro"),   caption: "Pyrotechnic finale" },
    { src: IMG("concert-lights"), caption: "Light show spectacle" },
    { src: IMG("concert-crowd"),  caption: "Sold-out crowd energy" },
  ],
  festival: [
    { src: IMG("festival-main"),  caption: "Headline stage view" },
    { src: IMG("concert-pyro"),   caption: "Closing fireworks" },
    { src: IMG("concert-crowd"),  caption: "VIP Deck with sightlines" },
    { src: IMG("concert-lights"), caption: "Immersive production" },
  ],
  tennis: [
    { src: IMG("tennis-court"),      caption: "Centre Court premium seats" },
    { src: IMG("stadium-interior"),  caption: "Courtside hospitality" },
    { src: IMG("stadium-atmosphere"),caption: "Royal Box atmosphere" },
    { src: IMG("tennis-court"),      caption: "Trophy presentation ceremony" },
  ],
  isle_of_man_tt: [
    { src: IMG("motogp-race"),       caption: "Snaefell Mountain Course" },
    { src: IMG("motogp-grid"),       caption: "Grandstand start/finish line" },
    { src: IMG("f1-start"),          caption: "Raw trackside speed" },
    { src: IMG("f1-podium"),         caption: "Senior TT winner podium" },
  ],
};

const DEFAULT_SET = GALLERY_SETS.match;

export default function VIPGallery({ eventType = "match" }) {
  const [lightbox, setLightbox] = useState(null);
  const photos = GALLERY_SETS[eventType] || DEFAULT_SET;

  return (
    <section className="mt-10" data-testid="vip-gallery">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-gradient-to-br from-[#facc15] to-[#b45309] flex items-center justify-center">
          <Flame className="w-5 h-5 text-black" strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            VIP Experience
            <span className="text-[10px] font-black tracking-[0.2em] bg-[#facc15]/15 text-[#facc15] px-2 py-0.5 border border-[#facc15]/40">
              FIRE
            </span>
          </h2>
          <p className="text-xs text-white/50">From the heart of the event · Real photos from inside</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {photos.map((p, i) => (
          <button
            key={i}
            onClick={() => setLightbox(p)}
            className="group relative aspect-square overflow-hidden bg-black/40 hover:ring-2 hover:ring-[#facc15] transition"
            data-testid={`vip-photo-${i}`}
          >
            <img
              src={p.src}
              alt={p.caption}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => { e.currentTarget.src = "/images/heroes/football-stadium.jpg"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-2.5">
              <p className="text-[11px] font-bold text-white leading-tight">{p.caption}</p>
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
