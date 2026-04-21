import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const LINK_GROUPS = {
  "justin-bieber": [
    { href: "/taylor-swift-london-tickets", label: "Taylor Swift London Tickets", desc: "Wembley Stadium from €79" },
    { href: "/coldplay-tour-2026", label: "Coldplay Tour 2026", desc: "Barcelona & Berlin from €69" },
    { href: "/the-weeknd-tour-2026", label: "The Weeknd Tour 2026", desc: "European dates from €79" },
    { href: "/bruno-mars-tour-2026", label: "Bruno Mars Tour 2026", desc: "London Wembley from €89" },
    { href: "/harry-styles-tickets", label: "Harry Styles Tickets", desc: "London from €79" },
  ],
  "spa-f1": [
    { href: "/f1-monaco-grand-prix-tickets", label: "Monaco Grand Prix Tickets", desc: "Monte Carlo from €249" },
    { href: "/f1-italian-grand-prix-monza-tickets", label: "Italian GP Monza Tickets", desc: "Autodromo Nazionale from €89" },
    { href: "/f1-british-grand-prix-silverstone-tickets", label: "British GP Silverstone", desc: "Silverstone from €149" },
    { href: "/f1-las-vegas-grand-prix-tickets", label: "Las Vegas GP Tickets", desc: "Night race from €249" },
    { href: "/f1-tickets", label: "All F1 Tickets 2026", desc: "24 Grand Prix from €79" },
  ],
  "monaco-gp": [
    { href: "/f1-belgian-grand-prix-spa-tickets", label: "Belgian GP Spa Tickets", desc: "Spa-Francorchamps from €109" },
    { href: "/f1-singapore-grand-prix-tickets", label: "Singapore GP Night Race", desc: "Marina Bay from €189" },
    { href: "/f1-las-vegas-grand-prix-tickets", label: "Las Vegas GP Tickets", desc: "The Strip from €249" },
    { href: "/f1-italian-grand-prix-monza-tickets", label: "Italian GP Monza Tickets", desc: "From €89" },
    { href: "/f1-tickets", label: "All F1 Tickets 2026", desc: "24 Grand Prix from €79" },
  ],
  "champions-league": [
    { href: "/el-clasico-tickets", label: "El Clasico Tickets", desc: "Real Madrid vs Barcelona from €89" },
    { href: "/bayern-munich-vs-real-madrid-tickets", label: "Bayern vs Real Madrid", desc: "UCL from €129" },
    { href: "/world-cup-2026-tickets", label: "FIFA World Cup 2026", desc: "USA/Mexico/Canada from €65" },
    { href: "/super-bowl-2026-tickets", label: "Super Bowl Tickets", desc: "VIP from €2,499" },
    { href: "/f1-tickets", label: "Formula 1 Tickets 2026", desc: "All Grand Prix from €79" },
  ],
  "el-clasico": [
    { href: "/champions-league-tickets", label: "Champions League Tickets", desc: "UCL Final Munich from €85" },
    { href: "/bayern-munich-vs-real-madrid-tickets", label: "Bayern vs Real Madrid", desc: "UCL from €129" },
    { href: "/world-cup-2026-tickets", label: "FIFA World Cup 2026", desc: "From €65" },
    { href: "/f1-tickets", label: "Formula 1 Tickets 2026", desc: "All Grand Prix from €79" },
    { href: "/taylor-swift-london-tickets", label: "Taylor Swift London", desc: "Wembley from €79" },
  ],
  "taylor-swift": [
    { href: "/justin-bieber-amsterdam-2026-tickets", label: "Justin Bieber Amsterdam", desc: "Not announced yet · Join notify list" },
    { href: "/coldplay-tour-2026", label: "Coldplay Tour 2026", desc: "Barcelona & Berlin from €69" },
    { href: "/bruno-mars-tour-2026", label: "Bruno Mars Tour 2026", desc: "London from €89" },
    { href: "/the-weeknd-tour-2026", label: "The Weeknd Tour 2026", desc: "From €79" },
    { href: "/harry-styles-tickets", label: "Harry Styles Tickets", desc: "London from €79" },
  ],
  "coldplay": [
    { href: "/taylor-swift-london-tickets", label: "Taylor Swift London Tickets", desc: "Wembley from €79" },
    { href: "/justin-bieber-amsterdam-2026-tickets", label: "Justin Bieber Amsterdam", desc: "Coming Soon · Notify list" },
    { href: "/bruno-mars-tour-2026", label: "Bruno Mars Tour 2026", desc: "London from €89" },
    { href: "/the-weeknd-tour-2026", label: "The Weeknd Tour 2026", desc: "From €79" },
    { href: "/metallica-sphere-las-vegas-tickets", label: "Metallica at The Sphere", desc: "Las Vegas from €99" },
  ],
  "world-cup": [
    { href: "/champions-league-tickets", label: "Champions League Tickets", desc: "UCL Final Munich from €85" },
    { href: "/el-clasico-tickets", label: "El Clasico Tickets", desc: "Real Madrid vs Barcelona from €89" },
    { href: "/f1-tickets", label: "Formula 1 Tickets 2026", desc: "All Grand Prix from €79" },
    { href: "/justin-bieber-amsterdam-2026-tickets", label: "Justin Bieber Amsterdam", desc: "Coming Soon · Notify list" },
    { href: "/taylor-swift-london-tickets", label: "Taylor Swift London", desc: "Wembley from €79" },
  ],
  "f1-tickets": [
    { href: "/f1-belgian-grand-prix-spa-tickets", label: "Belgian GP Spa Tickets", desc: "Spa-Francorchamps from €109" },
    { href: "/f1-monaco-grand-prix-tickets", label: "Monaco Grand Prix", desc: "Monte Carlo from €249" },
    { href: "/f1-british-grand-prix-silverstone-tickets", label: "British GP Silverstone", desc: "From €149" },
    { href: "/f1-italian-grand-prix-monza-tickets", label: "Italian GP Monza", desc: "From €89" },
    { href: "/champions-league-tickets", label: "Champions League Tickets", desc: "UCL Final from €85" },
  ],
};

export const RelatedEventsLinks = ({ category, title = "You May Also Like" }) => {
  const links = LINK_GROUPS[category];
  if (!links) return null;

  return (
    <section className="py-14 bg-[#0a0a0f]" data-testid="related-events-links">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-white mb-8">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="group flex items-center justify-between bg-[#161620] border border-white/5 hover:border-[#e10600]/40 rounded-lg p-4 transition-all duration-200"
              data-testid={`related-link-${link.href.replace(/\//g, '-').slice(1)}`}
            >
              <div>
                <span className="text-white font-semibold group-hover:text-[#e10600] transition-colors text-sm">
                  {link.label}
                </span>
                <p className="text-white/40 text-xs mt-1">{link.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-[#e10600] transition-colors flex-shrink-0 ml-3" />
            </Link>
          ))}
        </div>
        <p className="text-white/30 text-xs mt-6 text-center">
          Browse all events at <Link to="/events" className="text-[#e10600]/60 hover:text-[#e10600]">EuroMatchTickets</Link>
        </p>
      </div>
    </section>
  );
};

export default RelatedEventsLinks;
