import { useState } from "react";
import { MapPin, Eye, Star, Info, ChevronRight } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

// Stadium data with sections and prices
const STADIUM_DATA = {
  "camp_nou": {
    name: "Camp Nou",
    team: "FC Barcelona",
    city: "Barcelona, Spain",
    capacity: "99,354",
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800",
    sections: [
      { id: "vip", name: "VIP Tribuna", price: 450, view: "Best central view", color: "#FFD700" },
      { id: "lateral1", name: "Lateral 1st Tier", price: 280, view: "Great side view", color: "#9333EA" },
      { id: "lateral2", name: "Lateral 2nd Tier", price: 180, view: "Elevated side view", color: "#3B82F6" },
      { id: "gol_nord", name: "Gol Nord", price: 120, view: "Behind goal (North)", color: "#10B981" },
      { id: "gol_sud", name: "Gol Sud", price: 120, view: "Behind goal (South)", color: "#10B981" },
      { id: "corner", name: "Corner Sections", price: 150, view: "Diagonal view", color: "#F59E0B" }
    ]
  },
  "santiago_bernabeu": {
    name: "Santiago Bernabéu",
    team: "Real Madrid",
    city: "Madrid, Spain",
    capacity: "81,044",
    image: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800",
    sections: [
      { id: "palco", name: "Palco VIP", price: 550, view: "Executive boxes", color: "#FFD700" },
      { id: "tribuna", name: "Tribuna", price: 380, view: "Central sideline", color: "#9333EA" },
      { id: "lateral_este", name: "Lateral Este", price: 220, view: "East stand", color: "#3B82F6" },
      { id: "lateral_oeste", name: "Lateral Oeste", price: 220, view: "West stand", color: "#3B82F6" },
      { id: "fondo_norte", name: "Fondo Norte", price: 150, view: "North end (Ultras Sur)", color: "#10B981" },
      { id: "fondo_sur", name: "Fondo Sur", price: 150, view: "South end", color: "#10B981" }
    ]
  },
  "emirates": {
    name: "Emirates Stadium",
    team: "Arsenal FC",
    city: "London, England",
    capacity: "60,704",
    image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800",
    sections: [
      { id: "club_level", name: "Club Level", price: 400, view: "Premium central", color: "#FFD700" },
      { id: "upper_tier", name: "Upper Tier", price: 180, view: "Elevated view", color: "#9333EA" },
      { id: "lower_tier", name: "Lower Tier", price: 280, view: "Pitch-side", color: "#3B82F6" },
      { id: "north_bank", name: "North Bank", price: 150, view: "Behind goal", color: "#10B981" },
      { id: "clock_end", name: "Clock End", price: 150, view: "Behind goal", color: "#10B981" }
    ]
  },
  "allianz_arena": {
    name: "Allianz Arena",
    team: "Bayern Munich",
    city: "Munich, Germany",
    capacity: "75,024",
    image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800",
    sections: [
      { id: "business", name: "Business Seats", price: 480, view: "Premium hospitality", color: "#FFD700" },
      { id: "haupttribune", name: "Haupttribüne", price: 320, view: "Main stand", color: "#9333EA" },
      { id: "gegentribune", name: "Gegentribüne", price: 220, view: "Opposite stand", color: "#3B82F6" },
      { id: "sudkurve", name: "Südkurve", price: 120, view: "South curve (Ultras)", color: "#EF4444" },
      { id: "nordkurve", name: "Nordkurve", price: 150, view: "North curve", color: "#10B981" }
    ]
  },
  "old_trafford": {
    name: "Old Trafford",
    team: "Manchester United",
    city: "Manchester, England",
    capacity: "74,310",
    image: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800",
    sections: [
      { id: "executive", name: "Executive Club", price: 520, view: "VIP hospitality", color: "#FFD700" },
      { id: "sir_alex", name: "Sir Alex Ferguson Stand", price: 350, view: "Main stand", color: "#9333EA" },
      { id: "stretford", name: "Stretford End", price: 180, view: "Famous home end", color: "#EF4444" },
      { id: "east_stand", name: "East Stand", price: 220, view: "Side view", color: "#3B82F6" },
      { id: "south_stand", name: "South Stand", price: 200, view: "Side view", color: "#3B82F6" }
    ]
  },
  // F1 Circuits
  "monaco_circuit": {
    name: "Circuit de Monaco",
    team: "Monaco Grand Prix",
    city: "Monte Carlo",
    capacity: "37,000",
    type: "f1",
    sections: [
      { id: "tribune_k", name: "Tribune K (Pool)", price: 890, view: "Swimming pool section", color: "#FFD700" },
      { id: "tribune_t", name: "Tribune T", price: 650, view: "Tabac corner", color: "#9333EA" },
      { id: "tribune_a", name: "Tribune A", price: 450, view: "Start/Finish", color: "#3B82F6" },
      { id: "rocher", name: "Rocher", price: 350, view: "Elevated view", color: "#10B981" },
      { id: "general", name: "General Admission", price: 180, view: "Various spots", color: "#6B7280" }
    ]
  },
  "silverstone": {
    name: "Silverstone Circuit",
    team: "British Grand Prix",
    city: "Northamptonshire, UK",
    capacity: "150,000",
    type: "f1",
    sections: [
      { id: "paddock_club", name: "Paddock Club", price: 4500, view: "VIP hospitality", color: "#FFD700" },
      { id: "club_corner", name: "Club Corner", price: 450, view: "Start/Finish", color: "#9333EA" },
      { id: "becketts", name: "Becketts", price: 380, view: "High-speed section", color: "#3B82F6" },
      { id: "copse", name: "Copse", price: 350, view: "Fast corner", color: "#10B981" },
      { id: "general", name: "General Admission", price: 199, view: "Various areas", color: "#6B7280" }
    ]
  },
  "monza": {
    name: "Autodromo di Monza",
    team: "Italian Grand Prix",
    city: "Monza, Italy",
    capacity: "113,000",
    type: "f1",
    sections: [
      { id: "central", name: "Tribuna Centrale", price: 550, view: "Main grandstand", color: "#FFD700" },
      { id: "parabolica", name: "Parabolica", price: 380, view: "Famous final corner", color: "#9333EA" },
      { id: "ascari", name: "Ascari", price: 320, view: "Chicane view", color: "#3B82F6" },
      { id: "lesmo", name: "Lesmo", price: 280, view: "Fast corners", color: "#10B981" },
      { id: "general", name: "Prato", price: 120, view: "General admission", color: "#6B7280" }
    ]
  },
  // MotoGP Circuits  
  "mugello": {
    name: "Autodromo del Mugello",
    team: "Italian MotoGP",
    city: "Scarperia, Italy",
    capacity: "60,000",
    type: "motogp",
    sections: [
      { id: "vip_village", name: "VIP Village", price: 1200, view: "Paddock access", color: "#FFD700" },
      { id: "tribuna_box", name: "Tribuna Box", price: 450, view: "Covered grandstand", color: "#9333EA" },
      { id: "tribuna_poggio", name: "Tribuna Poggio", price: 280, view: "Elevated view", color: "#3B82F6" },
      { id: "prato", name: "Prato", price: 99, view: "General admission", color: "#6B7280" }
    ]
  }
};

// Stadium Map Component
export const StadiumMap = ({ stadiumId, onSelectSection }) => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [hoveredSection, setHoveredSection] = useState(null);
  
  const stadium = STADIUM_DATA[stadiumId];
  if (!stadium) return null;

  const handleSelect = (section) => {
    setSelectedSection(section.id);
    if (onSelectSection) onSelectSection(section);
  };

  return (
    <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl overflow-hidden">
      {/* Stadium Header */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={stadium.image} 
          alt={stadium.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <h3 className="text-2xl font-bold">{stadium.name}</h3>
          <p className="text-slate-500">{stadium.team} • {stadium.city}</p>
        </div>
        <Badge className="absolute top-4 right-4 bg-purple-500/20 text-purple-400">
          {stadium.capacity} capacity
        </Badge>
      </div>

      {/* Section Selection */}
      <div className="p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-purple-400" />
          Select Your Section
        </h4>
        
        {/* Visual Map */}
        <div className="bg-[#15151e] rounded-xl p-4 mb-6">
          <div className="aspect-[2/1] relative bg-emerald-900/30 rounded-lg border-2 border-emerald-600/30 flex items-center justify-center">
            {/* Pitch/Track */}
            <div className="text-center text-emerald-600/50">
              <span className="text-sm">{stadium.type === 'f1' || stadium.type === 'motogp' ? '🏁 Track' : '⚽ Pitch'}</span>
            </div>
            
            {/* Sections around */}
            <div className="absolute inset-0 flex flex-wrap">
              {stadium.sections.map((section, idx) => (
                <button
                  key={section.id}
                  onClick={() => handleSelect(section)}
                  onMouseEnter={() => setHoveredSection(section.id)}
                  onMouseLeave={() => setHoveredSection(null)}
                  className={`absolute p-2 rounded transition-all ${
                    selectedSection === section.id 
                      ? 'ring-2 ring-white scale-105 z-10' 
                      : hoveredSection === section.id 
                        ? 'scale-105 z-10' 
                        : ''
                  }`}
                  style={{
                    backgroundColor: section.color + '40',
                    borderColor: section.color,
                    top: `${15 + (idx % 3) * 25}%`,
                    left: `${5 + (idx % 4) * 23}%`,
                    borderWidth: 2
                  }}
                >
                  <span className="text-xs font-medium whitespace-nowrap">{section.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section List */}
        <div className="space-y-2">
          {stadium.sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleSelect(section)}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                selectedSection === section.id
                  ? 'bg-purple-500/20 border-purple-500'
                  : 'bg-[#15151e] hover:bg-slate-100 border-transparent'
              } border`}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: section.color }}
                />
                <div className="text-left">
                  <div className="font-semibold">{section.name}</div>
                  <div className="text-sm text-slate-500 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {section.view}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">€{section.price}</div>
                <div className="text-xs text-slate-400">per ticket</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Mini Stadium Preview
export const StadiumPreview = ({ stadiumId }) => {
  const stadium = STADIUM_DATA[stadiumId];
  if (!stadium) return null;

  const lowestPrice = Math.min(...stadium.sections.map(s => s.price));

  return (
    <div className="bg-[#1e1e1e] border border-white/10 rounded-xl p-4 hover:border-purple-500/50 transition-colors">
      <div className="flex items-center gap-4">
        <img 
          src={stadium.image} 
          alt={stadium.name}
          className="w-20 h-20 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h4 className="font-semibold">{stadium.name}</h4>
          <p className="text-sm text-slate-500">{stadium.team}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {stadium.sections.length} sections
            </Badge>
            <span className="text-emerald-400 font-semibold">
              From €{lowestPrice}
            </span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-400" />
      </div>
    </div>
  );
};

// Stadium Gallery
export const StadiumGallery = () => {
  const stadiums = Object.entries(STADIUM_DATA).slice(0, 6);
  
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stadiums.map(([id, stadium]) => (
        <StadiumPreview key={id} stadiumId={id} />
      ))}
    </div>
  );
};

// Get stadium data
export const getStadiumData = (stadiumId) => STADIUM_DATA[stadiumId];
export const getAllStadiums = () => STADIUM_DATA;

export default StadiumMap;
