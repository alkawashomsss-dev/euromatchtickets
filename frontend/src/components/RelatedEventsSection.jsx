import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trophy, Music, Flag, Globe, MapPin, Calendar, ChevronRight, Flame } from "lucide-react";
import axios from "axios";
import { API } from "../App";

const catConfig = {
  f1: { icon: Flag, color: "text-red-400", border: "border-red-500/30", bg: "bg-red-500/10" },
  football: { icon: Trophy, color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10" },
  concert: { icon: Music, color: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/10" },
  worldcup: { icon: Globe, color: "text-green-400", border: "border-green-500/30", bg: "bg-green-500/10" },
  match: { icon: Trophy, color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10" },
};

const LinkCard = ({ item }) => {
  const cfg = catConfig[item.category] || catConfig.football;
  const Icon = cfg.icon;
  return (
    <Link to={item.url} className={`group block rounded-lg border ${cfg.border} ${cfg.bg} p-4 hover:scale-[1.02] transition-all`} data-testid={`related-link-${item.url}`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${cfg.color} mt-0.5 flex-shrink-0`} />
        <div className="min-w-0">
          <p className="text-white text-sm font-medium truncate group-hover:text-emerald-400 transition">{item.title}</p>
          <div className="flex items-center gap-2 mt-1">
            {item.city && <span className="text-zinc-500 text-xs flex items-center gap-1"><MapPin className="w-3 h-3" />{item.city}</span>}
            {item.date && <span className="text-zinc-500 text-xs flex items-center gap-1"><Calendar className="w-3 h-3" />{item.date}</span>}
            {item.price_low && <span className="text-emerald-500 text-xs font-medium">From €{item.price_low}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
};

const Section = ({ title, icon: Icon, iconColor, items }) => {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item, i) => <LinkCard key={i} item={item} />)}
      </div>
    </div>
  );
};

export const RelatedEventsSection = ({ slug, category, city }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!slug) return;
    axios.get(`${API}/seo/full-related/${slug}`)
      .then(res => setData(res.data))
      .catch(() => {});
  }, [slug]);

  if (!data) return null;
  const { related_pages, city_events, upcoming_events, similar_pages } = data;
  const hasContent = [related_pages, city_events, upcoming_events, similar_pages].some(a => a?.length > 0);
  if (!hasContent) return null;

  const catLabel = {
    f1: "F1 Races", football: "Football Matches", concert: "Concerts",
    worldcup: "World Cup Matches", motogp: "MotoGP Races"
  }[category] || "Events";

  return (
    <div className="border-t border-zinc-800 pt-10 mt-10 space-y-8" data-testid="related-events-section">
      <Section title={`Related ${catLabel}`} icon={Flame} iconColor="text-orange-400" items={related_pages} />
      {city && <Section title={`More Events in ${city}`} icon={MapPin} iconColor="text-amber-400" items={city_events} />}
      <Section title="Upcoming Events" icon={Calendar} iconColor="text-emerald-400" items={upcoming_events} />
      <Section title="You Might Also Like" icon={ChevronRight} iconColor="text-zinc-400" items={similar_pages} />
      
      {/* Quick category navigation */}
      <div className="flex flex-wrap gap-3 pt-4">
        {[
          { to: "/f1-tickets", label: "F1 Tickets", cat: "f1" },
          { to: "/events?type=match", label: "Football Tickets", cat: "football" },
          { to: "/events?type=concert", label: "Concert Tickets", cat: "concert" },
          { to: "/world-cup-2026", label: "World Cup 2026", cat: "worldcup" },
          { to: "/events", label: "All Events", cat: "all" },
        ].map(link => {
          const cfg = catConfig[link.cat] || catConfig.football;
          return (
            <Link key={link.to} to={link.to}
              className={`px-4 py-2 rounded-full border ${cfg.border} ${cfg.bg} text-sm ${cfg.color} hover:opacity-80 transition`}
              data-testid={`quick-nav-${link.cat}`}>
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedEventsSection;
