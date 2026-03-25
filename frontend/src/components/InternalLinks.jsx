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
      { to: "/f1-monaco-grand-prix-tickets", label: "Monaco GP Tickets" },
      { to: "/f1-british-grand-prix-silverstone-tickets", label: "Silverstone GP" },
      { to: "/f1-italian-grand-prix-monza-tickets", label: "Monza GP" },
      { to: "/f1-singapore-grand-prix-tickets", label: "Singapore GP" },
      { to: "/f1-las-vegas-grand-prix-tickets", label: "Las Vegas GP" },
      { to: "/f1-2026-schedule", label: "Full F1 Schedule 2026" },
      { to: "/champions-league-tickets", label: "Champions League Tickets" },
    ],
  },
  football: {
    title: "Top Football Events",
    icon: Trophy,
    links: [
      { to: "/champions-league-tickets", label: "Champions League Tickets" },
      { to: "/world-cup-2026", label: "FIFA World Cup 2026" },
      { to: "/el-clasico-tickets", label: "El Clasico" },
      { to: "/events?type=match", label: "All Football Matches" },
      { to: "/football-ticket-prices-2026", label: "Football Price Guide" },
      { to: "/bayern-vs-real-madrid-tickets", label: "Bayern vs Real Madrid" },
    ],
  },
  concert: {
    title: "Hot Concert Tickets",
    icon: Music,
    links: [
      { to: "/the-weeknd-tour-2026", label: "The Weeknd Tour" },
      { to: "/bruno-mars-tour-2026", label: "Bruno Mars Tour" },
      { to: "/metallica-sphere-las-vegas-tickets", label: "Metallica @ Sphere" },
      { to: "/harry-styles-tickets", label: "Harry Styles" },
      { to: "/events?type=concert", label: "All Concerts" },
      { to: "/champions-league-tickets", label: "Champions League Tickets" },
    ],
  },
  worldcup: {
    title: "World Cup 2026",
    icon: Globe,
    links: [
      { to: "/world-cup-2026", label: "World Cup Overview" },
      { to: "/world-cup-2026-tickets", label: "Buy World Cup Tickets" },
      { to: "/world-cup-raffle", label: "World Cup Raffle" },
      { to: "/champions-league-tickets", label: "Champions League Tickets" },
      { to: "/events?type=match", label: "All Matches" },
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
      <div className="bg-white border border-slate-200 rounded-xl p-5">
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
        <div className="bg-white border border-slate-200 rounded-xl p-5" data-testid="dynamic-internal-links">
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
          <div key={cat} className="bg-white border border-slate-200 rounded-xl p-5">
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
