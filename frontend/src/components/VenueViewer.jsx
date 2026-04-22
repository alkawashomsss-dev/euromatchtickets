/**
 * VenueViewer — smart wrapper
 * ============================
 * Chooses 3D stadium vs 3D circuit vs SVG fallback based on the event.
 *
 * Key wins:
 * 1. three.js bundle is lazy-loaded ONLY when the <canvas> comes into
 *    view (IntersectionObserver).
 * 2. Respects `prefers-reduced-motion` — falls back to a static image +
 *    SVG top-down diagram for users who asked to reduce motion.
 * 3. Works without any back-end changes — maps `venue` or `event_type`
 *    to the appropriate preset via a small lookup table.
 *
 * Usage (anywhere in event pages):
 *   <VenueViewer event={event} />
 */
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { Box, Orbit, Loader2 } from "lucide-react";
import SeatMapSVG from "./SeatMapSVG";

const StadiumViewer3D = lazy(() => import("./StadiumViewer3D"));
const CircuitViewer3D = lazy(() => import("./CircuitViewer3D"));

// Map real venue names → stadium preset slug
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
  "spotify camp nou": "camp_nou",
};

// Map real track names → circuit preset slug
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
  "zandvoort": "zandvoort",
};

function resolvePreset(event) {
  const venue = (event?.venue || "").toLowerCase().trim();
  const et = (event?.event_type || "").toLowerCase();

  if (et === "f1" || et === "motogp" || et === "formula1") {
    const circuit = TRACK_TO_CIRCUIT[venue];
    if (circuit) return { kind: "circuit", preset: circuit };
    // Fallback: try substring match
    for (const k in TRACK_TO_CIRCUIT) {
      if (venue.includes(k)) return { kind: "circuit", preset: TRACK_TO_CIRCUIT[k] };
    }
    return { kind: "circuit", preset: "monaco" }; // generic F1 fallback
  }

  if (["match", "football", "worldcup", "concert", "athletics"].includes(et)) {
    const stad = VENUE_TO_STADIUM[venue];
    if (stad) return { kind: "stadium", preset: stad };
    for (const k in VENUE_TO_STADIUM) {
      if (venue.includes(k)) return { kind: "stadium", preset: VENUE_TO_STADIUM[k] };
    }
    return { kind: "stadium", preset: "wembley" }; // generic stadium fallback
  }

  return { kind: "svg", preset: null };
}

export default function VenueViewer({ event, className = "" }) {
  const wrapperRef = useRef(null);
  const [visible, setVisible] = useState(false);
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

  return (
    <div
      ref={wrapperRef}
      className={`relative ${className}`}
      data-testid="venue-viewer-wrapper"
    >
      {/* Header */}
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

      {/* 3D canvas or SVG fallback */}
      {reduced || !visible ? (
        <div className="w-full aspect-video bg-gradient-to-br from-[#0b0b0b] to-[#1a1a2e] border border-white/5 rounded flex items-center justify-center">
          {visible ? (
            <SeatMapSVG event={event} />
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-xs">Loading venue…</span>
            </div>
          )}
        </div>
      ) : kind === "circuit" ? (
        <Suspense
          fallback={
            <div className="w-full aspect-video bg-[#0a1426] flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
            </div>
          }
        >
          <CircuitViewer3D preset={preset} />
        </Suspense>
      ) : kind === "stadium" ? (
        <Suspense
          fallback={
            <div className="w-full aspect-video bg-[#0b0b0b] flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
            </div>
          }
        >
          <StadiumViewer3D preset={preset} />
        </Suspense>
      ) : (
        <SeatMapSVG event={event} />
      )}
    </div>
  );
}
