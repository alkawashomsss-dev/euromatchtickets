/**
 * VenueViewer — iframe-based, zero React/Three-fiber deps
 * =========================================================
 * Loads /3d/circuit.html or /3d/stadium.html in an iframe, which hosts
 * a self-contained three.js r161 scene. This completely bypasses the
 * React 19 + @react-three/fiber "x-line-number" runtime bug.
 *
 * Characteristics:
 *  - IntersectionObserver: iframe src only set when the viewer is ~200px
 *    from the viewport → three.js bundle is NOT fetched for events a
 *    visitor never scrolls to.
 *  - `prefers-reduced-motion`: falls back to the static SVG seat map.
 *  - No bundle cost in the main app (the iframe page pulls three.js
 *    from a CDN on its own).
 *  - Works identically on dev / prod / preview — no build step.
 */
import { useEffect, useRef, useState } from "react";
import { Box, Orbit, Loader2 } from "lucide-react";
import SeatMapSVG from "./SeatMapSVG";

const VENUE_TO_STADIUM = {
  "allianz arena": "allianz_arena",
  "allianz arena munich": "allianz_arena",
  "wembley stadium": "wembley",
  "wembley": "wembley",
  "tottenham hotspur stadium": "wembley",
  "johan cruijff arena": "wembley",
  "puskás aréna": "puskas_arena",
  "puskas arena": "puskas_arena",
  "estadio santiago bernabéu": "santiago_bernabeu",
  "santiago bernabéu": "santiago_bernabeu",
  "santiago bernabeu": "santiago_bernabeu",
  "camp nou": "camp_nou",
  "spotify camp nou": "camp_nou"
};

const TRACK_TO_CIRCUIT = {
  "circuit de monaco": "monaco",
  "monaco": "monaco",
  "silverstone circuit": "silverstone",
  "silverstone": "silverstone",
  "autodromo nazionale di monza": "monza",
  "monza": "monza",
  "spa-francorchamps": "spa",
  "circuit de spa-francorchamps": "spa",
  "spa": "spa",
  "circuit zandvoort": "zandvoort",
  "cm.com circuit zandvoort": "zandvoort",
  "zandvoort": "zandvoort"
};

function resolvePreset(event) {
  const venue = (event?.venue || "").toLowerCase().trim();
  const et = (event?.event_type || "").toLowerCase();

  if (et === "f1" || et === "motogp" || et === "formula1") {
    if (TRACK_TO_CIRCUIT[venue]) return { kind: "circuit", preset: TRACK_TO_CIRCUIT[venue] };
    for (const k in TRACK_TO_CIRCUIT) {
      if (venue.includes(k)) return { kind: "circuit", preset: TRACK_TO_CIRCUIT[k] };
    }
    return { kind: "circuit", preset: "monaco" };
  }

  if (["match", "football", "worldcup", "concert", "athletics"].includes(et)) {
    if (VENUE_TO_STADIUM[venue]) return { kind: "stadium", preset: VENUE_TO_STADIUM[venue] };
    for (const k in VENUE_TO_STADIUM) {
      if (venue.includes(k)) return { kind: "stadium", preset: VENUE_TO_STADIUM[k] };
    }
    return { kind: "stadium", preset: "wembley" };
  }

  return { kind: "svg", preset: null };
}

export default function VenueViewer({ event, className = "" }) {
  const wrapperRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    setReduced(!!mq?.matches);
    if (mq) {
      const fn = (e) => setReduced(e.matches);
      mq.addEventListener?.("change", fn);
      return () => mq.removeEventListener?.("change", fn);
    }
  }, []);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(wrapperRef.current);
    return () => io.disconnect();
  }, []);

  const { kind, preset } = resolvePreset(event);
  const iframeSrc =
    kind === "circuit"
      ? `/3d/circuit.html?p=${preset}`
      : kind === "stadium"
      ? `/3d/stadium.html?p=${preset}`
      : null;

  const useIframe = !reduced && visible && iframeSrc;

  return (
    <div
      ref={wrapperRef}
      className={`relative ${className}`}
      data-testid="venue-viewer-wrapper"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          {kind === "circuit" ? (
            <Orbit className="w-4 h-4 text-[#e10600]" />
          ) : (
            <Box className="w-4 h-4 text-[#9c27b0]" />
          )}
          {kind === "circuit"
            ? "Interactive 3D circuit"
            : kind === "stadium"
            ? "Interactive 3D stadium"
            : "Venue layout"}
        </h3>
        <span className="text-[10px] uppercase tracking-wider text-slate-500">
          Drag · zoom · tap
        </span>
      </div>

      {useIframe ? (
        <div
          className="relative w-full aspect-video bg-[#0a1426] overflow-hidden"
          data-testid={`venue-3d-${kind}`}
        >
          {!iframeLoaded ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-500 z-10 pointer-events-none">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-xs uppercase tracking-wider">Loading 3D scene…</span>
            </div>
          ) : null}
          <iframe
            key={iframeSrc}
            src={iframeSrc}
            title={kind === "circuit" ? "3D circuit viewer" : "3D stadium viewer"}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin"
            className="absolute inset-0 w-full h-full border-0"
            onLoad={() => setIframeLoaded(true)}
          />
        </div>
      ) : reduced || !visible ? (
        <div className="w-full aspect-video bg-gradient-to-br from-[#0b0b0b] to-[#1a1a2e] flex items-center justify-center">
          {reduced ? (
            <SeatMapSVG event={event} />
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-xs">Loading venue…</span>
            </div>
          )}
        </div>
      ) : (
        <SeatMapSVG event={event} />
      )}
    </div>
  );
}
