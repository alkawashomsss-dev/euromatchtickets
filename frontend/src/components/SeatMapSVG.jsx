/**
 * SeatMapSVG
 * ===========
 * Stylised seat-map diagram that works on every device with zero runtime
 * cost. Used as fallback when:
 *   - User has `prefers-reduced-motion: reduce`
 *   - 3D canvas is still loading
 *   - Event is not a football stadium or F1 track
 *
 * Four layouts auto-selected from event.event_type:
 *   - football/stadium → concentric tiered bowl (ring sections)
 *   - f1 / motogp      → top-down track outline with sector arrows
 *   - concert / arena  → fan-shaped stage-facing layout
 *   - default          → simple auditorium rows
 */
export default function SeatMapSVG({ event }) {
  const et = (event?.event_type || "").toLowerCase();

  if (et === "f1" || et === "motogp" || et === "formula1") {
    return <TrackDiagram venue={event?.venue} />;
  }
  if (["match", "football", "worldcup", "athletics"].includes(et)) {
    return <StadiumBowl venue={event?.venue} />;
  }
  if (et === "concert" || et === "festival") {
    return <ArenaLayout venue={event?.venue} />;
  }
  return <AuditoriumLayout venue={event?.venue} />;
}

/* ─── Stadium bowl — concentric rings with section labels ─── */
function StadiumBowl({ venue }) {
  const cx = 200, cy = 130;
  const rings = [
    { rx: 140, ry: 100, color: "#c54060", label: "Upper Tier" },
    { rx: 115, ry: 82, color: "#a02030", label: "Middle Tier" },
    { rx: 90, ry: 65, color: "#7f1d1d", label: "Lower Tier" },
  ];
  const pitch = { rx: 70, ry: 45 };

  // 8 sections per ring
  const sections = Array.from({ length: 8 }, (_, i) => i);

  return (
    <svg
      viewBox="0 0 400 260"
      className="w-full aspect-video bg-gradient-to-br from-[#0b0b0b] to-[#1a0828]"
      data-testid="seat-map-svg-stadium"
      role="img"
      aria-label={`Stadium bowl diagram${venue ? ` — ${venue}` : ""}`}
    >
      <defs>
        <linearGradient id="pitch" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#164e14" />
          <stop offset="1" stopColor="#0c3a0c" />
        </linearGradient>
      </defs>

      {/* tiers */}
      {rings.map((r, idx) => (
        <g key={idx}>
          {sections.map((s) => {
            const a0 = (s / 8) * Math.PI * 2 - Math.PI / 2;
            const a1 = ((s + 1) / 8) * Math.PI * 2 - Math.PI / 2;
            const inner = rings[idx + 1] || pitch;
            const x0 = cx + Math.cos(a0) * inner.rx;
            const y0 = cy + Math.sin(a0) * inner.ry;
            const x1 = cx + Math.cos(a0) * r.rx;
            const y1 = cy + Math.sin(a0) * r.ry;
            const x2 = cx + Math.cos(a1) * r.rx;
            const y2 = cy + Math.sin(a1) * r.ry;
            const x3 = cx + Math.cos(a1) * inner.rx;
            const y3 = cy + Math.sin(a1) * inner.ry;
            return (
              <path
                key={s}
                d={`M${x0} ${y0} A${inner.rx} ${inner.ry} 0 0 1 ${x3} ${y3} L${x2} ${y2} A${r.rx} ${r.ry} 0 0 0 ${x1} ${y1} Z`}
                fill={r.color}
                fillOpacity="0.85"
                stroke="#0b0b0b"
                strokeWidth="0.4"
              >
                <title>{`${r.label} · Section ${s + 1}`}</title>
              </path>
            );
          })}
        </g>
      ))}

      {/* pitch */}
      <ellipse cx={cx} cy={cy} rx={pitch.rx} ry={pitch.ry} fill="url(#pitch)" />
      <ellipse
        cx={cx}
        cy={cy}
        rx={pitch.rx}
        ry={pitch.ry}
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.25"
        strokeWidth="0.5"
      />
      <circle
        cx={cx}
        cy={cy}
        r={10}
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.3"
        strokeWidth="0.5"
      />
      <line
        x1={cx}
        y1={cy - pitch.ry}
        x2={cx}
        y2={cy + pitch.ry}
        stroke="#ffffff"
        strokeOpacity="0.3"
        strokeWidth="0.5"
      />

      {/* Labels */}
      <text x={cx} y={30} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700" opacity="0.7">
        NORTH STAND
      </text>
      <text x={cx} y={245} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700" opacity="0.7">
        SOUTH STAND
      </text>
      <text x={30} y={cy + 4} textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700" opacity="0.5">
        WEST
      </text>
      <text x={370} y={cy + 4} textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700" opacity="0.5">
        EAST
      </text>
      {venue ? (
        <text x={cx} y={cy - 4} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700" opacity="0.55">
          {venue}
        </text>
      ) : null}
    </svg>
  );
}

/* ─── F1 / MotoGP track ─── */
function TrackDiagram({ venue }) {
  // Generic oval with start/finish, same aesthetic as CircuitViewer3D
  return (
    <svg
      viewBox="0 0 400 240"
      className="w-full aspect-video bg-gradient-to-br from-[#0a1426] to-[#0b0b0b]"
      data-testid="seat-map-svg-track"
      role="img"
      aria-label={`Track diagram${venue ? ` — ${venue}` : ""}`}
    >
      <defs>
        <pattern id="grass" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#0c2c0c" />
          <circle cx="3" cy="3" r="0.5" fill="#134e13" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="400" height="240" fill="url(#grass)" />
      <path
        d="M 200 40 Q 340 50 340 120 Q 340 180 240 200 Q 120 210 80 170 Q 40 130 80 80 Q 120 30 200 40 Z"
        fill="none"
        stroke="#1a1a1a"
        strokeWidth="14"
        strokeLinejoin="round"
      />
      <path
        d="M 200 40 Q 340 50 340 120 Q 340 180 240 200 Q 120 210 80 170 Q 40 130 80 80 Q 120 30 200 40 Z"
        fill="none"
        stroke="#e10600"
        strokeWidth="1.5"
        strokeDasharray="3 2"
      />
      <rect x={197} y={34} width={6} height={12} fill="#fff" />
      <text x={205} y={30} fill="#fff" fontSize="10" fontWeight="700" opacity="0.8">
        Start / Finish
      </text>
      {venue ? (
        <text x="200" y="130" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700" opacity="0.6">
          {venue}
        </text>
      ) : null}
    </svg>
  );
}

/* ─── Concert / arena ─── */
function ArenaLayout({ venue }) {
  return (
    <svg
      viewBox="0 0 400 240"
      className="w-full aspect-video bg-gradient-to-br from-[#0b0b0b] to-[#1a0828]"
      data-testid="seat-map-svg-arena"
      role="img"
      aria-label={`Arena layout${venue ? ` — ${venue}` : ""}`}
    >
      <rect x="140" y="30" width="120" height="30" fill="#9c27b0" rx="3" />
      <text x="200" y="50" textAnchor="middle" fill="#fff" fontWeight="700" fontSize="12">
        STAGE
      </text>
      {/* Fan-shaped sections */}
      {[
        { d: "M 140 70 L 260 70 L 300 200 L 100 200 Z", c: "#7b1fa2", label: "Floor" },
        { d: "M 100 70 L 140 70 L 100 200 L 40 200 Z", c: "#a04fc0", label: "Left" },
        { d: "M 260 70 L 300 70 L 360 200 L 300 200 Z", c: "#a04fc0", label: "Right" },
        { d: "M 40 210 L 360 210 L 380 230 L 20 230 Z", c: "#c070e0", label: "Back" },
      ].map((s, i) => (
        <g key={i}>
          <path d={s.d} fill={s.c} fillOpacity="0.85" stroke="#0b0b0b" strokeWidth="1" />
          <text
            x={s.d.match(/L (\d+)/g)?.[0]?.match(/\d+/)?.[0] || 200}
            y={130 + i * 15}
            fontSize="9"
            fill="#fff"
            opacity="0.7"
          >
            {s.label}
          </text>
        </g>
      ))}
      {venue ? (
        <text x="200" y="20" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700" opacity="0.6">
          {venue}
        </text>
      ) : null}
    </svg>
  );
}

/* ─── Generic auditorium ─── */
function AuditoriumLayout({ venue }) {
  const rows = 12;
  const cols = 20;
  return (
    <svg
      viewBox="0 0 400 240"
      className="w-full aspect-video bg-gradient-to-br from-[#0b0b0b] to-[#1a0828]"
      data-testid="seat-map-svg-auditorium"
      role="img"
    >
      <rect x="160" y="20" width="80" height="16" fill="#9c27b0" rx="2" />
      <text x="200" y="32" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700">
        STAGE
      </text>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => (
          <circle
            key={`${r}-${c}`}
            cx={40 + c * 16}
            cy={60 + r * 14}
            r={2.6}
            fill={r < 3 ? "#c54060" : r < 7 ? "#a02030" : "#7f1d1d"}
            opacity="0.85"
          />
        ))
      )}
      {venue ? (
        <text x="200" y="235" textAnchor="middle" fill="#fff" fontSize="9" opacity="0.55">
          {venue}
        </text>
      ) : null}
    </svg>
  );
}
