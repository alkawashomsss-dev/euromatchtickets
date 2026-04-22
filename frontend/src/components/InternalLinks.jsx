import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Trophy, Music, Flag, Globe, MapPin } from "lucide-react";
import { API } from "../App";
import axios from "axios";

const linkGroups = {
  f1: {
    title: "Popular F1 Races",
    icon: Flag,
    links: [
      { to: "/spa-f1-tickets", label: "Spa F1 Tickets 2026", hot: true },
      { to: "/belgian-grand-prix-tickets", label: "Belgian Grand Prix", hot: true },
      { to: "/f1-monaco-grand-prix-tickets", label: "Monaco GP Tickets" },
      { to: "/f1-italian-grand-prix-monza-tickets", label: "Monza GP" },
      { to: "/f1-bahrain-grand-prix-tickets", label: "Bahrain GP" },
      { to: "/f1-tickets-london-2026", label: "F1 London (Silverstone)" },
      { to: "/f1-tickets-barcelona-2026", label: "F1 Barcelona" },
      { to: "/f1-2026-tickets", label: "All F1 2026 Tickets" },
      { to: "/cheap-f1-tickets-2026", label: "Cheap F1 Tickets" },
      { to: "/cheapest-f1-races-2026", label: "Verified F1 Races Ranked" },
      { to: "/f1-hospitality-packages-2026", label: "F1 VIP Hospitality" },
      { to: "/spa-paddock-club-tickets", label: "Spa Paddock Club" },
    ],
  },
  football: {
    title: "Top Football Events",
    icon: Trophy,
    links: [
      { to: "/champions-league-tickets", label: "Champions League" },
      { to: "/champions-league-final-2026-tickets", label: "UCL Final 2026" },
      { to: "/buy-manchester-united-tickets", label: "Manchester United" },
      { to: "/buy-chelsea-fc-tickets", label: "Chelsea FC" },
      { to: "/football-tickets-london", label: "Football in London" },
      { to: "/football-tickets-madrid", label: "Football in Madrid" },
      { to: "/premier-league-tickets-2026", label: "Premier League" },
      { to: "/la-liga-tickets-2026", label: "La Liga" },
      { to: "/bundesliga-tickets-2026", label: "Bundesliga" },
      { to: "/world-cup-2026", label: "World Cup 2026" },
    ],
  },
  concert: {
    title: "Hot Concert Tickets",
    icon: Music,
    links: [
      { to: "/taylor-swift-eras-tour-europe-2026", label: "Taylor Swift Eras Tour" },
      { to: "/coldplay-music-spheres-europe-2026", label: "Coldplay Tour 2026" },
      { to: "/concert-tickets-london-2026", label: "Concerts in London" },
      { to: "/concert-tickets-paris-2026", label: "Concerts in Paris" },
      { to: "/concert-tickets-berlin-2026", label: "Concerts in Berlin" },
      { to: "/concert-tickets-barcelona-2026", label: "Concerts in Barcelona" },
      { to: "/events?type=concert", label: "All Concerts" },
    ],
  },
  worldcup: {
    title: "World Cup 2026",
    icon: Globe,
    links: [
      { to: "/world-cup-2026", label: "World Cup Overview" },
      { to: "/world-cup-2026-tickets-new-york", label: "WC New York" },
      { to: "/world-cup-2026-tickets-los-angeles", label: "WC Los Angeles" },
      { to: "/world-cup-2026-tickets-miami", label: "WC Miami" },
      { to: "/world-cup-2026-tickets-dallas", label: "WC Dallas" },
      { to: "/world-cup-2026-tickets-toronto", label: "WC Toronto" },
      { to: "/world-cup-2026-tickets-mexico-city", label: "WC Mexico City" },
      { to: "/champions-league-tickets", label: "Champions League" },
    ],
  },
};

const relatedMap = {
  f1: ["football", "concert"],
  football: ["f1", "concert"],
  concert: ["football", "f1"],
  worldcup: ["f1", "concert"],
};

const catIcons = { f1: Flag, football: Trophy, concert: Music, worldcup: Globe };

export const InternalLinks = ({ category = "f1", slug = "", city = "", showRelated = true }) => {
  const [dynamicLinks, setDynamicLinks] = useState([]);
  const primary = linkGroups[category] || linkGroups.f1;
  const relatedCategories = showRelated ? (relatedMap[category] || []).slice(0, 1) : [];

  useEffect(() => {
    const params = new URLSearchParams({ category, slug, city, limit: "6" });
    axios.get(`${API}/seo/related-pages?${params}`).then(res => {
      setDynamicLinks(res.data.links || []);
    }).catch(() => {});
  }, [category, slug, city]);

  return (
    <div className="space-y-6" data-testid="internal-links">
      {/* Static category links */}
      <div className="bg-[#1e1e1e] border border-white/10 rounded-none p-5">
        <div className="flex items-center gap-2 mb-4">
          <primary.icon className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-white text-sm">{primary.title}</h3>
        </div>
        <ul className="space-y-2">
          {primary.links.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className="flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-400 transition-colors">
                <ChevronRight className="w-3 h-3 flex-shrink-0" />
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Dynamic related pages from DB */}
      {dynamicLinks.length > 0 && (
        <div className="bg-[#1e1e1e] border border-white/10 rounded-none p-5" data-testid="dynamic-internal-links">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-white text-sm">Related Events</h3>
          </div>
          <ul className="space-y-2">
            {dynamicLinks.map((link) => {
              const Icon = catIcons[link.category] || Flag;
              return (
                <li key={link.url}>
                  <Link to={link.url} className="flex items-center gap-2 text-sm text-slate-500 hover:text-amber-400 transition-colors">
                    <Icon className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{link.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Static related category links */}
      {relatedCategories.map((cat) => {
        const group = linkGroups[cat];
        if (!group) return null;
        return (
          <div key={cat} className="bg-[#1e1e1e] border border-white/10 rounded-none p-5">
            <div className="flex items-center gap-2 mb-4">
              <group.icon className="w-4 h-4 text-slate-400" />
              <h3 className="font-bold text-white text-sm">{group.title}</h3>
            </div>
            <ul className="space-y-2">
              {group.links.slice(0, 4).map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors">
                    <ChevronRight className="w-3 h-3 flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default InternalLinks;
