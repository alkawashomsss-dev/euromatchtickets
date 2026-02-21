const VenueSeatMap = ({ categories, selectedCategory, onCategorySelect, eventType }) => {
  const isMatch = eventType === "match";

  // Color mapping for categories
  const categoryColors = {
    vip: "#F59E0B",
    floor: "#EC4899",
    cat1: "#3B82F6",
    cat2: "#22C55E",
    cat3: "#94A3B8",
    standing: "#94A3B8"
  };

  const handleSectionClick = (category) => {
    if (categories?.[category]?.count > 0) {
      onCategorySelect(category);
    }
  };

  const getSectionOpacity = (category) => {
    if (!categories?.[category] || categories[category].count === 0) return 0.2;
    return selectedCategory === category ? 1 : 0.6;
  };

  const getSectionStroke = (category) => {
    return selectedCategory === category ? "#fff" : "transparent";
  };

  if (isMatch) {
    // Football stadium layout
    return (
      <div className="relative w-full aspect-[16/10] bg-zinc-900/50 rounded-xl overflow-hidden border border-white/5">
        <svg viewBox="0 0 800 500" className="w-full h-full">
          {/* Pitch */}
          <rect x="200" y="125" width="400" height="250" fill="#166534" rx="4" />
          <rect x="200" y="125" width="400" height="250" fill="none" stroke="#22C55E" strokeWidth="2" rx="4" />
          <line x1="400" y1="125" x2="400" y2="375" stroke="#22C55E" strokeWidth="2" />
          <circle cx="400" cy="250" r="50" fill="none" stroke="#22C55E" strokeWidth="2" />
          
          {/* VIP Sections */}
          <g onClick={() => handleSectionClick('vip')} className="cursor-pointer venue-section">
            <rect 
              x="200" y="50" width="400" height="60" 
              fill={categoryColors.vip}
              opacity={getSectionOpacity('vip')}
              stroke={getSectionStroke('vip')}
              strokeWidth="2"
              rx="4"
            />
            <text x="400" y="85" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">VIP</text>
          </g>
          <g onClick={() => handleSectionClick('vip')} className="cursor-pointer venue-section">
            <rect 
              x="200" y="390" width="400" height="60" 
              fill={categoryColors.vip}
              opacity={getSectionOpacity('vip')}
              stroke={getSectionStroke('vip')}
              strokeWidth="2"
              rx="4"
            />
            <text x="400" y="425" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">VIP</text>
          </g>

          {/* Category 1 - Side sections */}
          <g onClick={() => handleSectionClick('cat1')} className="cursor-pointer venue-section">
            <rect 
              x="80" y="125" width="100" height="250" 
              fill={categoryColors.cat1}
              opacity={getSectionOpacity('cat1')}
              stroke={getSectionStroke('cat1')}
              strokeWidth="2"
              rx="4"
            />
            <text x="130" y="255" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">CAT 1</text>
          </g>
          <g onClick={() => handleSectionClick('cat1')} className="cursor-pointer venue-section">
            <rect 
              x="620" y="125" width="100" height="250" 
              fill={categoryColors.cat1}
              opacity={getSectionOpacity('cat1')}
              stroke={getSectionStroke('cat1')}
              strokeWidth="2"
              rx="4"
            />
            <text x="670" y="255" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">CAT 1</text>
          </g>

          {/* Category 2 - Corner sections */}
          <g onClick={() => handleSectionClick('cat2')} className="cursor-pointer venue-section">
            <polygon 
              points="80,50 180,50 180,110 80,125" 
              fill={categoryColors.cat2}
              opacity={getSectionOpacity('cat2')}
              stroke={getSectionStroke('cat2')}
              strokeWidth="2"
            />
            <text x="130" y="90" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">CAT 2</text>
          </g>
          <g onClick={() => handleSectionClick('cat2')} className="cursor-pointer venue-section">
            <polygon 
              points="620,50 720,50 720,125 620,110" 
              fill={categoryColors.cat2}
              opacity={getSectionOpacity('cat2')}
              stroke={getSectionStroke('cat2')}
              strokeWidth="2"
            />
            <text x="670" y="90" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">CAT 2</text>
          </g>
          <g onClick={() => handleSectionClick('cat2')} className="cursor-pointer venue-section">
            <polygon 
              points="80,375 180,390 180,450 80,450" 
              fill={categoryColors.cat2}
              opacity={getSectionOpacity('cat2')}
              stroke={getSectionStroke('cat2')}
              strokeWidth="2"
            />
            <text x="130" y="420" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">CAT 2</text>
          </g>
          <g onClick={() => handleSectionClick('cat2')} className="cursor-pointer venue-section">
            <polygon 
              points="620,390 720,375 720,450 620,450" 
              fill={categoryColors.cat2}
              opacity={getSectionOpacity('cat2')}
              stroke={getSectionStroke('cat2')}
              strokeWidth="2"
            />
            <text x="670" y="420" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">CAT 2</text>
          </g>

          {/* Category 3 - Upper sections */}
          <g onClick={() => handleSectionClick('cat3')} className="cursor-pointer venue-section">
            <rect 
              x="20" y="50" width="50" height="400" 
              fill={categoryColors.cat3}
              opacity={getSectionOpacity('cat3')}
              stroke={getSectionStroke('cat3')}
              strokeWidth="2"
              rx="4"
            />
            <text x="45" y="255" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold" transform="rotate(-90, 45, 255)">CAT 3</text>
          </g>
          <g onClick={() => handleSectionClick('cat3')} className="cursor-pointer venue-section">
            <rect 
              x="730" y="50" width="50" height="400" 
              fill={categoryColors.cat3}
              opacity={getSectionOpacity('cat3')}
              stroke={getSectionStroke('cat3')}
              strokeWidth="2"
              rx="4"
            />
            <text x="755" y="255" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold" transform="rotate(90, 755, 255)">CAT 3</text>
          </g>
        </svg>
      </div>
    );
  }

  // Concert venue layout
  return (
    <div className="relative w-full aspect-[16/10] bg-zinc-900/50 rounded-xl overflow-hidden border border-white/5">
      <svg viewBox="0 0 800 500" className="w-full h-full">
        {/* Stage */}
        <rect x="200" y="30" width="400" height="80" fill="#7C3AED" rx="8" />
        <text x="400" y="75" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="bold">STAGE</text>

        {/* Floor/Pit */}
        <g onClick={() => handleSectionClick('floor')} className="cursor-pointer venue-section">
          <rect 
            x="200" y="130" width="400" height="120" 
            fill={categoryColors.floor}
            opacity={getSectionOpacity('floor')}
            stroke={getSectionStroke('floor')}
            strokeWidth="2"
            rx="4"
          />
          <text x="400" y="195" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">FLOOR</text>
        </g>

        {/* VIP - Front rows */}
        <g onClick={() => handleSectionClick('vip')} className="cursor-pointer venue-section">
          <rect 
            x="100" y="130" width="80" height="120" 
            fill={categoryColors.vip}
            opacity={getSectionOpacity('vip')}
            stroke={getSectionStroke('vip')}
            strokeWidth="2"
            rx="4"
          />
          <text x="140" y="195" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">VIP</text>
        </g>
        <g onClick={() => handleSectionClick('vip')} className="cursor-pointer venue-section">
          <rect 
            x="620" y="130" width="80" height="120" 
            fill={categoryColors.vip}
            opacity={getSectionOpacity('vip')}
            stroke={getSectionStroke('vip')}
            strokeWidth="2"
            rx="4"
          />
          <text x="660" y="195" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">VIP</text>
        </g>

        {/* Category 1 - Lower tier */}
        <g onClick={() => handleSectionClick('cat1')} className="cursor-pointer venue-section">
          <path 
            d="M 100 270 L 700 270 L 750 320 L 750 380 L 50 380 L 50 320 Z"
            fill={categoryColors.cat1}
            opacity={getSectionOpacity('cat1')}
            stroke={getSectionStroke('cat1')}
            strokeWidth="2"
          />
          <text x="400" y="335" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">CATEGORY 1</text>
        </g>

        {/* Category 2 - Upper tier */}
        <g onClick={() => handleSectionClick('cat2')} className="cursor-pointer venue-section">
          <path 
            d="M 50 400 L 750 400 L 780 430 L 780 470 L 20 470 L 20 430 Z"
            fill={categoryColors.cat2}
            opacity={getSectionOpacity('cat2')}
            stroke={getSectionStroke('cat2')}
            strokeWidth="2"
          />
          <text x="400" y="445" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">CATEGORY 2</text>
        </g>

        {/* Standing sections */}
        <g onClick={() => handleSectionClick('standing')} className="cursor-pointer venue-section">
          <rect 
            x="20" y="130" width="60" height="250" 
            fill={categoryColors.standing}
            opacity={getSectionOpacity('standing')}
            stroke={getSectionStroke('standing')}
            strokeWidth="2"
            rx="4"
          />
          <text x="50" y="260" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold" transform="rotate(-90, 50, 260)">STANDING</text>
        </g>
        <g onClick={() => handleSectionClick('standing')} className="cursor-pointer venue-section">
          <rect 
            x="720" y="130" width="60" height="250" 
            fill={categoryColors.standing}
            opacity={getSectionOpacity('standing')}
            stroke={getSectionStroke('standing')}
            strokeWidth="2"
            rx="4"
          />
          <text x="750" y="260" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold" transform="rotate(90, 750, 260)">STANDING</text>
        </g>
      </svg>
    </div>
  );
};

export default VenueSeatMap;
