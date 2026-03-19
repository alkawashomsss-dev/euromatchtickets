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
};

function getSectionColor(section, category) {
  return SECTION_COLORS[section] || CATEGORY_CONFIG[category]?.color || "#64748B";
}

function formatCategory(cat) {
  return CATEGORY_CONFIG[cat]?.label || cat.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

const InteractiveVenueMap = ({ groupedSections, selectedSection, onSectionSelect, eventType }) => {
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
  const isF1 = eventType === "f1" || eventType === "motogp";

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
