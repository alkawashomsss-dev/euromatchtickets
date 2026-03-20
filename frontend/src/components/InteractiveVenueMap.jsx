import { useState, useMemo } from "react";
import { motion } from "framer-motion";

const CATEGORY_CONFIG = {
  platinum: { label: "Platinum", color: "#7C3AED", order: 0 },
  vip: { label: "VIP", color: "#F59E0B", order: 1 },
  seated: { label: "Seated", color: "#3B82F6", order: 2 },
  general_admission: { label: "General Admission", color: "#22C55E", order: 3 },
  standard: { label: "Standard", color: "#64748B", order: 4 },
};

const SECTION_COLORS = {
  "Floor": "#EC4899",
  "Section A": "#3B82F6",
  "Section B": "#8B5CF6",
  "Section C": "#06B6D4",
  "Balcony": "#F59E0B",
  "Main Grandstand": "#F59E0B",
  "Turn 1 Stand": "#3B82F6",
  "Chicane Stand": "#8B5CF6",
  "Pit Straight": "#EC4899",
  "Final Corner": "#06B6D4",
  "GA Zone A": "#22C55E",
  "GA Zone B": "#10B981",
  "VIP Village": "#F59E0B",
  "Paddock Access": "#7C3AED",
  "Grandstand": "#F59E0B",
  "Grandstand A": "#F59E0B",
  "Grandstand B": "#E5A50B",
  "Bray Hill": "#3B82F6",
  "Quarter Bridge": "#8B5CF6",
  "Ballaugh Bridge": "#EC4899",
  "Ramsey Hairpin": "#06B6D4",
  "The Mountain": "#22C55E",
  "VIP Enclosure": "#F59E0B",
  "Hospitality Suite": "#7C3AED",
};

function getSectionColor(section, category) {
  return SECTION_COLORS[section] || CATEGORY_CONFIG[category]?.color || "#64748B";
}

function formatCategory(cat) {
  return CATEGORY_CONFIG[cat]?.label || cat.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

const InteractiveVenueMap = ({ groupedSections, selectedSection, onSectionSelect, eventType, eventTitle }) => {
  const [hoveredSection, setHoveredSection] = useState(null);

  const sectionMap = useMemo(() => {
    const map = {};
    if (!groupedSections) return map;
    groupedSections.forEach(s => {
      const key = s.section;
      if (!map[key]) {
        map[key] = { count: 0, lowest_price: Infinity, categories: [] };
      }
      map[key].count += s.count;
      map[key].lowest_price = Math.min(map[key].lowest_price, s.lowest_price);
      map[key].categories.push(s.category);
    });
    return map;
  }, [groupedSections]);

  const getOpacity = (section) => {
    if (!sectionMap[section] || sectionMap[section].count === 0) return 0.15;
    if (selectedSection === section) return 1;
    if (hoveredSection === section) return 0.85;
    return 0.6;
  };

  const getStroke = (section) => {
    if (selectedSection === section) return "#fff";
    if (hoveredSection === section) return "rgba(255,255,255,0.6)";
    return "rgba(255,255,255,0.1)";
  };

  const handleClick = (section) => {
    if (sectionMap[section]?.count > 0) {
      onSectionSelect(selectedSection === section ? null : section);
    }
  };

  const SectionTooltip = ({ section }) => {
    const data = sectionMap[section];
    if (!data || !hoveredSection || hoveredSection !== section) return null;
    return (
      <div className="absolute z-50 -top-2 left-1/2 -translate-x-1/2 -translate-y-full bg-slate-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl pointer-events-none whitespace-nowrap">
        <div className="font-bold">{section}</div>
        <div>{data.count} tickets from €{Math.round(data.lowest_price)}</div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
      </div>
    );
  };

  const isFootball = eventType === "match" || eventType === "worldcup" || eventType === "football";
  const isMotoGP = eventType === "motogp" && !(eventTitle || "").toLowerCase().includes("isle of man");
  const isIOM = eventType === "isle_of_man_tt" || ((eventTitle || "").toLowerCase().includes("isle of man"));
  const isF1 = (eventType === "f1") && !isMotoGP && !isIOM;

  if (isFootball) {
    return (
      <div className="relative w-full" data-testid="venue-map">
        <svg viewBox="0 0 800 520" className="w-full h-auto">
          <defs>
            <linearGradient id="pitch" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#15803d" />
              <stop offset="100%" stopColor="#166534" />
            </linearGradient>
          </defs>
          <rect width="800" height="520" fill="#0f172a" rx="16" />
          {/* Pitch */}
          <rect x="200" y="135" width="400" height="250" fill="url(#pitch)" rx="4" />
          <rect x="200" y="135" width="400" height="250" fill="none" stroke="#22C55E" strokeWidth="1.5" rx="4" />
          <line x1="400" y1="135" x2="400" y2="385" stroke="#22C55E" strokeWidth="1.5" />
          <circle cx="400" cy="260" r="45" fill="none" stroke="#22C55E" strokeWidth="1.5" />
          <circle cx="400" cy="260" r="3" fill="#22C55E" />

          {/* Section A - Top */}
          <g className="cursor-pointer" onClick={() => handleClick("Section A")}
            onMouseEnter={() => setHoveredSection("Section A")} onMouseLeave={() => setHoveredSection(null)}>
            <rect x="200" y="50" width="400" height="70" rx="6"
              fill={getSectionColor("Section A")} opacity={getOpacity("Section A")}
              stroke={getStroke("Section A")} strokeWidth="2" />
            <text x="400" y="88" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">SECTION A</text>
            {sectionMap["Section A"]?.count > 0 && <text x="400" y="104" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10">from €{Math.round(sectionMap["Section A"].lowest_price)}</text>}
          </g>

          {/* Section A - Bottom */}
          <g className="cursor-pointer" onClick={() => handleClick("Section A")}
            onMouseEnter={() => setHoveredSection("Section A")} onMouseLeave={() => setHoveredSection(null)}>
            <rect x="200" y="400" width="400" height="70" rx="6"
              fill={getSectionColor("Section A")} opacity={getOpacity("Section A")}
              stroke={getStroke("Section A")} strokeWidth="2" />
            <text x="400" y="440" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">SECTION A</text>
          </g>

          {/* Section B - Left */}
          <g className="cursor-pointer" onClick={() => handleClick("Section B")}
            onMouseEnter={() => setHoveredSection("Section B")} onMouseLeave={() => setHoveredSection(null)}>
            <rect x="70" y="135" width="110" height="250" rx="6"
              fill={getSectionColor("Section B")} opacity={getOpacity("Section B")}
              stroke={getStroke("Section B")} strokeWidth="2" />
            <text x="125" y="264" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">SECTION B</text>
            {sectionMap["Section B"]?.count > 0 && <text x="125" y="280" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10">from €{Math.round(sectionMap["Section B"].lowest_price)}</text>}
          </g>

          {/* Section B - Right */}
          <g className="cursor-pointer" onClick={() => handleClick("Section B")}
            onMouseEnter={() => setHoveredSection("Section B")} onMouseLeave={() => setHoveredSection(null)}>
            <rect x="620" y="135" width="110" height="250" rx="6"
              fill={getSectionColor("Section B")} opacity={getOpacity("Section B")}
              stroke={getStroke("Section B")} strokeWidth="2" />
            <text x="675" y="264" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">SECTION B</text>
          </g>

          {/* Section C - Corners */}
          {[
            { x: 70, y: 50, w: 110, h: 70 },
            { x: 620, y: 50, w: 110, h: 70 },
            { x: 70, y: 400, w: 110, h: 70 },
            { x: 620, y: 400, w: 110, h: 70 },
          ].map((pos, i) => (
            <g key={i} className="cursor-pointer" onClick={() => handleClick("Section C")}
              onMouseEnter={() => setHoveredSection("Section C")} onMouseLeave={() => setHoveredSection(null)}>
              <rect x={pos.x} y={pos.y} width={pos.w} height={pos.h} rx="6"
                fill={getSectionColor("Section C")} opacity={getOpacity("Section C")}
                stroke={getStroke("Section C")} strokeWidth="2" />
              {i === 0 && <text x={pos.x + pos.w/2} y={pos.y + pos.h/2 + 4} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">SEC C</text>}
              {i === 1 && <text x={pos.x + pos.w/2} y={pos.y + pos.h/2 + 4} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">SEC C</text>}
            </g>
          ))}

          {/* Floor / Pitch-side */}
          <g className="cursor-pointer" onClick={() => handleClick("Floor")}
            onMouseEnter={() => setHoveredSection("Floor")} onMouseLeave={() => setHoveredSection(null)}>
            <rect x="15" y="50" width="40" height="420" rx="6"
              fill={getSectionColor("Floor")} opacity={getOpacity("Floor")}
              stroke={getStroke("Floor")} strokeWidth="2" />
            <text x="35" y="264" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700" transform="rotate(-90,35,264)">FLOOR</text>
          </g>
          <g className="cursor-pointer" onClick={() => handleClick("Floor")}
            onMouseEnter={() => setHoveredSection("Floor")} onMouseLeave={() => setHoveredSection(null)}>
            <rect x="745" y="50" width="40" height="420" rx="6"
              fill={getSectionColor("Floor")} opacity={getOpacity("Floor")}
              stroke={getStroke("Floor")} strokeWidth="2" />
            <text x="765" y="264" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700" transform="rotate(90,765,264)">FLOOR</text>
          </g>

          {/* Balcony */}
          <g className="cursor-pointer" onClick={() => handleClick("Balcony")}
            onMouseEnter={() => setHoveredSection("Balcony")} onMouseLeave={() => setHoveredSection(null)}>
            <path d="M 200 15 Q 400 0 600 15 L 600 38 Q 400 25 200 38 Z" rx="4"
              fill={getSectionColor("Balcony")} opacity={getOpacity("Balcony")}
              stroke={getStroke("Balcony")} strokeWidth="2" />
            <text x="400" y="30" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">BALCONY</text>
          </g>
          <g className="cursor-pointer" onClick={() => handleClick("Balcony")}
            onMouseEnter={() => setHoveredSection("Balcony")} onMouseLeave={() => setHoveredSection(null)}>
            <path d="M 200 482 Q 400 497 600 482 L 600 505 Q 400 518 200 505 Z" rx="4"
              fill={getSectionColor("Balcony")} opacity={getOpacity("Balcony")}
              stroke={getStroke("Balcony")} strokeWidth="2" />
            <text x="400" y="498" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">BALCONY</text>
          </g>
        </svg>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 justify-center">
          {Object.keys(sectionMap).filter(s => sectionMap[s].count > 0).map(s => (
            <button key={s} onClick={() => handleClick(s)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                selectedSection === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
              }`} data-testid={`map-legend-${s.toLowerCase().replace(/\s/g,'-')}`}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getSectionColor(s) }} />
              {s} <span className="text-slate-400">({sectionMap[s].count})</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (isMotoGP) {
    return (
      <div className="relative w-full" data-testid="venue-map">
        <svg viewBox="0 0 800 550" className="w-full h-auto">
          <defs>
            <linearGradient id="trackGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1a1a2e" />
              <stop offset="100%" stopColor="#0d0d1a" />
            </linearGradient>
            <linearGradient id="tarmac" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#374151" />
              <stop offset="100%" stopColor="#4B5563" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <rect width="800" height="550" fill="url(#trackGrad)" rx="16" />

          {/* Circuit track - realistic MotoGP layout */}
          <path d="M 200 180 C 200 100, 350 60, 450 80 C 550 100, 620 80, 650 130 C 680 180, 700 250, 680 320 C 660 390, 600 430, 520 440 C 440 450, 350 430, 280 400 C 210 370, 160 320, 160 270 C 160 220, 180 200, 200 180"
            fill="none" stroke="#4B5563" strokeWidth="48" strokeLinecap="round" />
          <path d="M 200 180 C 200 100, 350 60, 450 80 C 550 100, 620 80, 650 130 C 680 180, 700 250, 680 320 C 660 390, 600 430, 520 440 C 440 450, 350 430, 280 400 C 210 370, 160 320, 160 270 C 160 220, 180 200, 200 180"
            fill="none" stroke="#1F2937" strokeWidth="40" strokeLinecap="round" />
          {/* Track kerbs */}
          <path d="M 200 180 C 200 100, 350 60, 450 80" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="8 4" opacity="0.5" />
          <path d="M 650 130 C 680 180, 700 250, 680 320" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="8 4" opacity="0.5" />

          {/* Start/Finish line */}
          <rect x="188" y="170" width="24" height="4" fill="#fff" />
          <rect x="188" y="176" width="24" height="4" fill="#000" />
          <rect x="188" y="182" width="24" height="4" fill="#fff" />
          <text x="180" y="205" fill="#F59E0B" fontSize="9" fontWeight="bold" filter="url(#glow)">START/FINISH</text>

          {/* Speed indicators */}
          <text x="440" y="52" fill="#EF4444" fontSize="8" fontWeight="bold" opacity="0.7">320 km/h</text>
          <text x="700" y="230" fill="#EF4444" fontSize="8" fontWeight="bold" opacity="0.7">280 km/h</text>
          <text x="310" y="460" fill="#EF4444" fontSize="8" fontWeight="bold" opacity="0.7">190 km/h</text>

          {/* Pit Lane */}
          <path d="M 220 200 L 300 200 Q 340 200 350 190 L 400 160" fill="none" stroke="#6B7280" strokeWidth="6" strokeDasharray="4 3" opacity="0.5" />
          <text x="280" y="218" fill="#9CA3AF" fontSize="8">PIT LANE</text>

          {/* === GRANDSTAND SECTIONS === */}
          {/* Main Grandstand */}
          <g className="cursor-pointer" onClick={() => handleClick("Main Grandstand")}
            onMouseEnter={() => setHoveredSection("Main Grandstand")} onMouseLeave={() => setHoveredSection(null)}>
            <rect x="130" y="120" width="50" height="90" rx="6"
              fill="#F59E0B" opacity={getOpacity("Main Grandstand")}
              stroke={getStroke("Main Grandstand")} strokeWidth="2" />
            <text x="155" y="165" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold" transform="rotate(-90,155,165)">MAIN GRANDSTAND</text>
            {sectionMap["Main Grandstand"]?.count > 0 && <text x="155" y="200" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="8">€{Math.round(sectionMap["Main Grandstand"].lowest_price)}</text>}
          </g>

          {/* Turn 1 Stand */}
          <g className="cursor-pointer" onClick={() => handleClick("Turn 1 Stand")}
            onMouseEnter={() => setHoveredSection("Turn 1 Stand")} onMouseLeave={() => setHoveredSection(null)}>
            <rect x="360" y="42" width="100" height="30" rx="6"
              fill="#3B82F6" opacity={getOpacity("Turn 1 Stand")}
              stroke={getStroke("Turn 1 Stand")} strokeWidth="2" />
            <text x="410" y="61" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">TURN 1</text>
          </g>

          {/* Chicane Stand */}
          <g className="cursor-pointer" onClick={() => handleClick("Chicane Stand")}
            onMouseEnter={() => setHoveredSection("Chicane Stand")} onMouseLeave={() => setHoveredSection(null)}>
            <rect x="660" y="110" width="35" height="80" rx="6"
              fill="#8B5CF6" opacity={getOpacity("Chicane Stand")}
              stroke={getStroke("Chicane Stand")} strokeWidth="2" />
            <text x="677" y="155" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold" transform="rotate(90,677,155)">CHICANE</text>
          </g>

          {/* Pit Straight */}
          <g className="cursor-pointer" onClick={() => handleClick("Pit Straight")}
            onMouseEnter={() => setHoveredSection("Pit Straight")} onMouseLeave={() => setHoveredSection(null)}>
            <rect x="250" y="230" width="120" height="35" rx="6"
              fill="#EC4899" opacity={getOpacity("Pit Straight")}
              stroke={getStroke("Pit Straight")} strokeWidth="2" />
            <text x="310" y="252" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">PIT STRAIGHT</text>
          </g>

          {/* Final Corner */}
          <g className="cursor-pointer" onClick={() => handleClick("Final Corner")}
            onMouseEnter={() => setHoveredSection("Final Corner")} onMouseLeave={() => setHoveredSection(null)}>
            <rect x="210" y="350" width="110" height="35" rx="6"
              fill="#06B6D4" opacity={getOpacity("Final Corner")}
              stroke={getStroke("Final Corner")} strokeWidth="2" />
            <text x="265" y="372" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">FINAL CORNER</text>
          </g>

          {/* GA Zones */}
          {["GA Zone A", "GA Zone B"].map((zone, i) => (
            <g key={zone} className="cursor-pointer" onClick={() => handleClick(zone)}
              onMouseEnter={() => setHoveredSection(zone)} onMouseLeave={() => setHoveredSection(null)}>
              <rect x={520 + i * 80} y={350 + i * 30} width={70} height={55} rx="6"
                fill="#22C55E" opacity={getOpacity(zone)}
                stroke={getStroke(zone)} strokeWidth="2" />
              <text x={555 + i * 80} y={382 + i * 30} textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">{zone.toUpperCase()}</text>
            </g>
          ))}

          {/* VIP Village / Paddock */}
          {["VIP Village", "Paddock Access"].map((zone, i) => (
            <g key={zone} className="cursor-pointer" onClick={() => handleClick(zone)}
              onMouseEnter={() => setHoveredSection(zone)} onMouseLeave={() => setHoveredSection(null)}>
              <rect x={400 + i * 95} y={280} width={85} height={30} rx="6"
                fill={i === 0 ? "#F59E0B" : "#7C3AED"} opacity={getOpacity(zone)}
                stroke={getStroke(zone)} strokeWidth="2" />
              <text x={442 + i * 95} y={299} textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">{zone.toUpperCase()}</text>
            </g>
          ))}

          {/* Circuit name */}
          <text x="400" y="530" textAnchor="middle" fill="#6B7280" fontSize="11" fontWeight="600">MotoGP Circuit Layout</text>
          <text x="400" y="545" textAnchor="middle" fill="#4B5563" fontSize="9">Click a section to filter tickets</text>
        </svg>

        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {Object.keys(sectionMap).filter(s => sectionMap[s].count > 0).map(s => (
            <button key={s} onClick={() => handleClick(s)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                selectedSection === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
              }`} data-testid={`map-legend-${s.toLowerCase().replace(/\s/g,'-')}`}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getSectionColor(s) }} />
              {s} <span className="text-slate-400">({sectionMap[s].count})</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (isIOM) {
    return (
      <div className="relative w-full" data-testid="venue-map">
        <svg viewBox="0 0 800 580" className="w-full h-auto">
          <defs>
            <linearGradient id="iomBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a1628" />
              <stop offset="100%" stopColor="#0f1d30" />
            </linearGradient>
            <linearGradient id="road" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6B7280" />
              <stop offset="100%" stopColor="#9CA3AF" />
            </linearGradient>
            <filter id="neon">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <rect width="800" height="580" fill="url(#iomBg)" rx="16" />

          {/* Terrain - hills and landscape */}
          <path d="M 0 380 Q 200 340 400 360 Q 600 380 800 350 L 800 580 L 0 580 Z" fill="#0d2818" opacity="0.3" />
          <path d="M 0 420 Q 300 390 500 410 Q 700 430 800 400 L 800 580 L 0 580 Z" fill="#0a2010" opacity="0.2" />

          {/* === THE FAMOUS SNAEFELL MOUNTAIN COURSE === */}
          {/* Main road course - simplified but recognizable shape */}
          <path d="M 200 450 L 200 380 Q 200 300 250 250 L 300 200 Q 350 150 400 120 Q 480 80 560 100 Q 620 115 650 160 L 670 200 Q 690 250 680 300 L 660 350 Q 640 400 600 430 L 550 460 Q 500 480 430 480 L 300 470 Q 240 465 200 450"
            fill="none" stroke="#4B5563" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 200 450 L 200 380 Q 200 300 250 250 L 300 200 Q 350 150 400 120 Q 480 80 560 100 Q 620 115 650 160 L 670 200 Q 690 250 680 300 L 660 350 Q 640 400 600 430 L 550 460 Q 500 480 430 480 L 300 470 Q 240 465 200 450"
            fill="none" stroke="#374151" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />

          {/* Direction arrows along the course */}
          <polygon points="350,155 360,145 355,165" fill="#F59E0B" opacity="0.6" />
          <polygon points="600,120 610,115 605,130" fill="#F59E0B" opacity="0.6" />
          <polygon points="680,280 685,290 675,295" fill="#F59E0B" opacity="0.6" />
          <polygon points="450,478 440,475 445,485" fill="#F59E0B" opacity="0.6" />

          {/* Start/Finish at Douglas */}
          <rect x="180" y="440" width="30" height="5" fill="#fff" />
          <rect x="180" y="447" width="30" height="5" fill="#000" />
          <rect x="180" y="454" width="30" height="5" fill="#fff" />

          {/* Course labels */}
          <text x="170" y="485" fill="#F59E0B" fontSize="10" fontWeight="bold" filter="url(#neon)">DOUGLAS</text>
          <text x="170" y="497" fill="#9CA3AF" fontSize="7">Start / Finish</text>

          {/* The Mountain section label */}
          <text x="440" y="55" fill="#94A3B8" fontSize="9" fontWeight="600">SNAEFELL MOUNTAIN</text>
          <text x="440" y="67" fill="#64748B" fontSize="7">396m elevation</text>

          {/* Course distance */}
          <text x="400" y="310" textAnchor="middle" fill="#475569" fontSize="9" fontWeight="500">60.7 km per lap</text>
          <text x="400" y="322" textAnchor="middle" fill="#374151" fontSize="8">Average speed: 217 km/h</text>

          {/* === VIEWING SECTIONS === */}
          {/* Grandstand at Start/Finish */}
          <g className="cursor-pointer" onClick={() => handleClick("Grandstand")}
            onMouseEnter={() => setHoveredSection("Grandstand")} onMouseLeave={() => setHoveredSection(null)}>
            <rect x="115" y="400" width="55" height="70" rx="8"
              fill="#F59E0B" opacity={getOpacity("Grandstand")}
              stroke={getStroke("Grandstand")} strokeWidth="2.5" />
            <text x="143" y="432" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">GRAND-</text>
            <text x="143" y="443" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">STAND</text>
            {sectionMap["Grandstand"]?.count > 0 && <text x="143" y="460" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="8">€{Math.round(sectionMap["Grandstand"].lowest_price)}</text>}
          </g>
          {/* Also match Grandstand A/B */}
          {["Grandstand A", "Grandstand B"].map((gs, i) => sectionMap[gs] ? (
            <g key={gs} className="cursor-pointer" onClick={() => handleClick(gs)}
              onMouseEnter={() => setHoveredSection(gs)} onMouseLeave={() => setHoveredSection(null)}>
              <rect x={115} y={395 + (i+1)*38} width={55} height={32} rx="6"
                fill={i === 0 ? "#F59E0B" : "#E5A50B"} opacity={getOpacity(gs)}
                stroke={getStroke(gs)} strokeWidth="2" />
              <text x={143} y={416 + (i+1)*38} textAnchor="middle" fill="#fff" fontSize="7" fontWeight="bold">{gs.toUpperCase()}</text>
            </g>
          ) : null)}

          {/* Bray Hill */}
          <g className="cursor-pointer" onClick={() => handleClick("Bray Hill")}
            onMouseEnter={() => setHoveredSection("Bray Hill")} onMouseLeave={() => setHoveredSection(null)}>
            <rect x="205" y="320" width="65" height="40" rx="8"
              fill="#3B82F6" opacity={getOpacity("Bray Hill")}
              stroke={getStroke("Bray Hill")} strokeWidth="2.5" />
            <text x="237" y="342" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">BRAY</text>
            <text x="237" y="353" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">HILL</text>
          </g>

          {/* Quarter Bridge */}
          <g className="cursor-pointer" onClick={() => handleClick("Quarter Bridge")}
            onMouseEnter={() => setHoveredSection("Quarter Bridge")} onMouseLeave={() => setHoveredSection(null)}>
            <rect x="235" y="215" width="75" height="40" rx="8"
              fill="#8B5CF6" opacity={getOpacity("Quarter Bridge")}
              stroke={getStroke("Quarter Bridge")} strokeWidth="2.5" />
            <text x="272" y="234" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">QUARTER</text>
            <text x="272" y="246" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">BRIDGE</text>
          </g>

          {/* Ballaugh Bridge */}
          <g className="cursor-pointer" onClick={() => handleClick("Ballaugh Bridge")}
            onMouseEnter={() => setHoveredSection("Ballaugh Bridge")} onMouseLeave={() => setHoveredSection(null)}>
            <rect x="490" y="68" width="80" height="40" rx="8"
              fill="#EC4899" opacity={getOpacity("Ballaugh Bridge")}
              stroke={getStroke("Ballaugh Bridge")} strokeWidth="2.5" />
            <text x="530" y="86" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">BALLAUGH</text>
            <text x="530" y="98" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">BRIDGE</text>
          </g>

          {/* Ramsey Hairpin */}
          <g className="cursor-pointer" onClick={() => handleClick("Ramsey Hairpin")}
            onMouseEnter={() => setHoveredSection("Ramsey Hairpin")} onMouseLeave={() => setHoveredSection(null)}>
            <rect x="660" y="145" width="70" height="45" rx="8"
              fill="#06B6D4" opacity={getOpacity("Ramsey Hairpin")}
              stroke={getStroke("Ramsey Hairpin")} strokeWidth="2.5" />
            <text x="695" y="166" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">RAMSEY</text>
            <text x="695" y="178" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">HAIRPIN</text>
          </g>

          {/* The Mountain */}
          <g className="cursor-pointer" onClick={() => handleClick("The Mountain")}
            onMouseEnter={() => setHoveredSection("The Mountain")} onMouseLeave={() => setHoveredSection(null)}>
            <path d="M 380 100 L 420 75 L 460 100 Z" 
              fill="#22C55E" opacity={getOpacity("The Mountain")}
              stroke={getStroke("The Mountain")} strokeWidth="2" />
            <rect x="380" y="100" width="80" height="30" rx="6"
              fill="#22C55E" opacity={getOpacity("The Mountain")}
              stroke={getStroke("The Mountain")} strokeWidth="2" />
            <text x="420" y="119" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">MOUNTAIN</text>
          </g>

          {/* VIP Enclosure / Hospitality */}
          {["VIP Enclosure", "Hospitality Suite"].map((zone, i) => sectionMap[zone] ? (
            <g key={zone} className="cursor-pointer" onClick={() => handleClick(zone)}
              onMouseEnter={() => setHoveredSection(zone)} onMouseLeave={() => setHoveredSection(null)}>
              <rect x={540 + i * 110} y={420} width={95} height={35} rx="6"
                fill={i === 0 ? "#F59E0B" : "#7C3AED"} opacity={getOpacity(zone)}
                stroke={getStroke(zone)} strokeWidth="2" />
              <text x={587 + i * 110} y={442} textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">{zone.toUpperCase()}</text>
            </g>
          ) : null)}

          {/* Danger warning - adds adrenaline */}
          <text x="650" y="510" fill="#EF4444" fontSize="8" fontWeight="bold" opacity="0.6">TOP SPEED: 320+ km/h</text>
          <text x="400" y="555" textAnchor="middle" fill="#64748B" fontSize="10" fontWeight="600">Snaefell Mountain Course - Isle of Man TT</text>
          <text x="400" y="570" textAnchor="middle" fill="#475569" fontSize="8">Click a viewing area to filter tickets</text>
        </svg>

        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {Object.keys(sectionMap).filter(s => sectionMap[s].count > 0).map(s => (
            <button key={s} onClick={() => handleClick(s)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                selectedSection === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
              }`} data-testid={`map-legend-${s.toLowerCase().replace(/\s/g,'-')}`}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getSectionColor(s) }} />
              {s} <span className="text-slate-400">({sectionMap[s].count})</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (isF1) {
    return (
      <div className="relative w-full" data-testid="venue-map">
        <svg viewBox="0 0 800 520" className="w-full h-auto">
          <rect width="800" height="520" fill="#0f172a" rx="16" />
          {/* Track */}
          <path d="M 150 260 Q 150 100 300 100 L 500 100 Q 650 100 650 200 L 650 320 Q 650 420 500 420 L 300 420 Q 150 420 150 260"
            fill="none" stroke="#374151" strokeWidth="45" strokeLinecap="round" />
          <path d="M 150 260 Q 150 100 300 100 L 500 100 Q 650 100 650 200 L 650 320 Q 650 420 500 420 L 300 420 Q 150 420 150 260"
            fill="none" stroke="#1F2937" strokeWidth="38" strokeLinecap="round" />
          <text x="400" y="265" textAnchor="middle" fill="#374151" fontSize="18" fontWeight="bold">CIRCUIT</text>

          {/* Floor / Paddock */}
          <g className="cursor-pointer" onClick={() => handleClick("Floor")}
            onMouseEnter={() => setHoveredSection("Floor")} onMouseLeave={() => setHoveredSection(null)}>
            <rect x="320" y="190" width="160" height="55" rx="8"
              fill={getSectionColor("Floor")} opacity={getOpacity("Floor")}
              stroke={getStroke("Floor")} strokeWidth="2" />
            <text x="400" y="220" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700">PADDOCK / FLOOR</text>
            {sectionMap["Floor"]?.count > 0 && <text x="400" y="236" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10">from €{Math.round(sectionMap["Floor"].lowest_price)}</text>}
          </g>

          {/* Section A */}
          <g className="cursor-pointer" onClick={() => handleClick("Section A")}
            onMouseEnter={() => setHoveredSection("Section A")} onMouseLeave={() => setHoveredSection(null)}>
            <rect x="250" y="50" width="130" height="38" rx="6"
              fill={getSectionColor("Section A")} opacity={getOpacity("Section A")}
              stroke={getStroke("Section A")} strokeWidth="2" />
            <text x="315" y="74" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">SECTION A</text>
          </g>
          <g className="cursor-pointer" onClick={() => handleClick("Section A")}
            onMouseEnter={() => setHoveredSection("Section A")} onMouseLeave={() => setHoveredSection(null)}>
            <rect x="420" y="50" width="130" height="38" rx="6"
              fill={getSectionColor("Section A")} opacity={getOpacity("Section A")}
              stroke={getStroke("Section A")} strokeWidth="2" />
            <text x="485" y="74" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">SECTION A</text>
          </g>

          {/* Section B */}
          <g className="cursor-pointer" onClick={() => handleClick("Section B")}
            onMouseEnter={() => setHoveredSection("Section B")} onMouseLeave={() => setHoveredSection(null)}>
            <rect x="95" y="150" width="40" height="120" rx="6"
              fill={getSectionColor("Section B")} opacity={getOpacity("Section B")}
              stroke={getStroke("Section B")} strokeWidth="2" />
            <text x="115" y="215" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700" transform="rotate(-90,115,215)">SEC B</text>
          </g>
          <g className="cursor-pointer" onClick={() => handleClick("Section B")}
            onMouseEnter={() => setHoveredSection("Section B")} onMouseLeave={() => setHoveredSection(null)}>
            <rect x="665" y="150" width="40" height="120" rx="6"
              fill={getSectionColor("Section B")} opacity={getOpacity("Section B")}
              stroke={getStroke("Section B")} strokeWidth="2" />
            <text x="685" y="215" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700" transform="rotate(90,685,215)">SEC B</text>
          </g>

          {/* Section C */}
          <g className="cursor-pointer" onClick={() => handleClick("Section C")}
            onMouseEnter={() => setHoveredSection("Section C")} onMouseLeave={() => setHoveredSection(null)}>
            <rect x="250" y="432" width="300" height="38" rx="6"
              fill={getSectionColor("Section C")} opacity={getOpacity("Section C")}
              stroke={getStroke("Section C")} strokeWidth="2" />
            <text x="400" y="456" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">SECTION C</text>
            {sectionMap["Section C"]?.count > 0 && <text x="400" y="466" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">from €{Math.round(sectionMap["Section C"].lowest_price)}</text>}
          </g>

          {/* Balcony */}
          <g className="cursor-pointer" onClick={() => handleClick("Balcony")}
            onMouseEnter={() => setHoveredSection("Balcony")} onMouseLeave={() => setHoveredSection(null)}>
            <rect x="95" y="300" width="40" height="100" rx="6"
              fill={getSectionColor("Balcony")} opacity={getOpacity("Balcony")}
              stroke={getStroke("Balcony")} strokeWidth="2" />
            <text x="115" y="355" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700" transform="rotate(-90,115,355)">BALCONY</text>
          </g>
          <g className="cursor-pointer" onClick={() => handleClick("Balcony")}
            onMouseEnter={() => setHoveredSection("Balcony")} onMouseLeave={() => setHoveredSection(null)}>
            <rect x="665" y="300" width="40" height="100" rx="6"
              fill={getSectionColor("Balcony")} opacity={getOpacity("Balcony")}
              stroke={getStroke("Balcony")} strokeWidth="2" />
            <text x="685" y="355" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700" transform="rotate(90,685,355)">BALCONY</text>
          </g>

          {/* Start/Finish */}
          <rect x="395" y="95" width="10" height="12" fill="#fff" opacity="0.6" />
          <text x="400" y="490" textAnchor="middle" fill="#4B5563" fontSize="11">START / FINISH</text>
        </svg>

        <div className="flex flex-wrap gap-3 mt-4 justify-center">
          {Object.keys(sectionMap).filter(s => sectionMap[s].count > 0).map(s => (
            <button key={s} onClick={() => handleClick(s)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                selectedSection === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
              }`} data-testid={`map-legend-${s.toLowerCase().replace(/\s/g,'-')}`}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getSectionColor(s) }} />
              {s} <span className="text-slate-400">({sectionMap[s].count})</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Concert / Default venue
  return (
    <div className="relative w-full" data-testid="venue-map">
      <svg viewBox="0 0 800 520" className="w-full h-auto">
        <rect width="800" height="520" fill="#0f172a" rx="16" />
        {/* Stage */}
        <rect x="200" y="25" width="400" height="75" fill="#7C3AED" rx="10" />
        <text x="400" y="68" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="bold">STAGE</text>

        {/* Floor */}
        <g className="cursor-pointer" onClick={() => handleClick("Floor")}
          onMouseEnter={() => setHoveredSection("Floor")} onMouseLeave={() => setHoveredSection(null)}>
          <rect x="200" y="118" width="400" height="130" rx="6"
            fill={getSectionColor("Floor")} opacity={getOpacity("Floor")}
            stroke={getStroke("Floor")} strokeWidth="2" />
          <text x="400" y="188" textAnchor="middle" fill="#fff" fontSize="15" fontWeight="700">FLOOR</text>
          {sectionMap["Floor"]?.count > 0 && <text x="400" y="206" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="11">from €{Math.round(sectionMap["Floor"].lowest_price)} · {sectionMap["Floor"].count} tickets</text>}
        </g>

        {/* Section A - Sides of floor */}
        <g className="cursor-pointer" onClick={() => handleClick("Section A")}
          onMouseEnter={() => setHoveredSection("Section A")} onMouseLeave={() => setHoveredSection(null)}>
          <rect x="90" y="118" width="92" height="130" rx="6"
            fill={getSectionColor("Section A")} opacity={getOpacity("Section A")}
            stroke={getStroke("Section A")} strokeWidth="2" />
          <text x="136" y="188" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700">SEC A</text>
          {sectionMap["Section A"]?.count > 0 && <text x="136" y="204" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">€{Math.round(sectionMap["Section A"].lowest_price)}</text>}
        </g>
        <g className="cursor-pointer" onClick={() => handleClick("Section A")}
          onMouseEnter={() => setHoveredSection("Section A")} onMouseLeave={() => setHoveredSection(null)}>
          <rect x="618" y="118" width="92" height="130" rx="6"
            fill={getSectionColor("Section A")} opacity={getOpacity("Section A")}
            stroke={getStroke("Section A")} strokeWidth="2" />
          <text x="664" y="188" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700">SEC A</text>
        </g>

        {/* Section B - Lower bowl */}
        <g className="cursor-pointer" onClick={() => handleClick("Section B")}
          onMouseEnter={() => setHoveredSection("Section B")} onMouseLeave={() => setHoveredSection(null)}>
          <path d="M 90 268 L 710 268 L 740 308 L 740 380 L 60 380 L 60 308 Z" rx="6"
            fill={getSectionColor("Section B")} opacity={getOpacity("Section B")}
            stroke={getStroke("Section B")} strokeWidth="2" />
          <text x="400" y="332" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700">SECTION B</text>
          {sectionMap["Section B"]?.count > 0 && <text x="400" y="350" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10">from €{Math.round(sectionMap["Section B"].lowest_price)} · {sectionMap["Section B"].count} tickets</text>}
        </g>

        {/* Section C - Upper */}
        <g className="cursor-pointer" onClick={() => handleClick("Section C")}
          onMouseEnter={() => setHoveredSection("Section C")} onMouseLeave={() => setHoveredSection(null)}>
          <path d="M 60 398 L 740 398 L 770 428 L 770 468 L 30 468 L 30 428 Z" rx="6"
            fill={getSectionColor("Section C")} opacity={getOpacity("Section C")}
            stroke={getStroke("Section C")} strokeWidth="2" />
          <text x="400" y="440" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">SECTION C</text>
          {sectionMap["Section C"]?.count > 0 && <text x="400" y="456" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10">from €{Math.round(sectionMap["Section C"].lowest_price)}</text>}
        </g>

        {/* Balcony */}
        <g className="cursor-pointer" onClick={() => handleClick("Balcony")}
          onMouseEnter={() => setHoveredSection("Balcony")} onMouseLeave={() => setHoveredSection(null)}>
          <path d="M 30 480 L 770 480 L 785 498 L 785 515 L 15 515 L 15 498 Z" rx="4"
            fill={getSectionColor("Balcony")} opacity={getOpacity("Balcony")}
            stroke={getStroke("Balcony")} strokeWidth="2" />
          <text x="400" y="502" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">BALCONY</text>
        </g>

        {/* Side standing */}
        <g className="cursor-pointer" onClick={() => handleClick("Floor")}
          onMouseEnter={() => setHoveredSection("Floor")} onMouseLeave={() => setHoveredSection(null)}>
          <rect x="18" y="118" width="55" height="260" rx="6"
            fill={getSectionColor("Floor")} opacity={getOpacity("Floor") * 0.7}
            stroke={getStroke("Floor")} strokeWidth="1.5" />
        </g>
        <g className="cursor-pointer" onClick={() => handleClick("Floor")}
          onMouseEnter={() => setHoveredSection("Floor")} onMouseLeave={() => setHoveredSection(null)}>
          <rect x="727" y="118" width="55" height="260" rx="6"
            fill={getSectionColor("Floor")} opacity={getOpacity("Floor") * 0.7}
            stroke={getStroke("Floor")} strokeWidth="1.5" />
        </g>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        {Object.keys(sectionMap).filter(s => sectionMap[s].count > 0).map(s => (
          <button key={s} onClick={() => handleClick(s)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
              selectedSection === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
            }`} data-testid={`map-legend-${s.toLowerCase().replace(/\s/g,'-')}`}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getSectionColor(s) }} />
            {s} <span className="text-slate-400">({sectionMap[s].count})</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default InteractiveVenueMap;
