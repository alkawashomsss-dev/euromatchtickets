import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, MapPin, Ticket, Shield, Star, 
  ChevronRight, Trophy, Flag, Zap, Users, 
  Flame, TrendingUp, Timer, Award, Car, Crown,
  AlertCircle, Globe
} from 'lucide-react';
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import SEOHead from "../components/SEOHead";
import { BreadcrumbStructuredData } from "../components/StructuredData";
import { InternalLinks } from "../components/InternalLinks";
import { RelatedEventsLinks } from "../components/RelatedEventsLinks";
import { EventFAQ, FAQSchemaScript } from "../components/EventFAQ";

const F1_FAQS = [
  { q: "How much are F1 tickets in 2026?", a: "F1 2026 General Admission from €79. Grandstand seats from €149. VIP hospitality from €595. Paddock Club from €2,499. Prices vary by race — Monaco is most expensive (from €249), Monza cheapest (from €89)." },
  { q: "What is the cheapest F1 race to attend?", a: "Italian GP at Monza (from €89) and Spanish GP Barcelona (from €99) are the most affordable. Belgian GP Spa (from €109) and Hungarian GP Budapest (from €119) also offer great value." },
  { q: "How many F1 races are there in 2026?", a: "The 2026 F1 season features 24 Grand Prix races across 5 continents. European races run March-September. The season starts in Bahrain (March) and ends in Abu Dhabi (December)." },
  { q: "Which F1 race has the best atmosphere?", a: "Dutch GP Zandvoort (Orange Army), British GP Silverstone (150,000+ fans), Italian GP Monza (passionate tifosi), and Belgian GP Spa (legendary circuit). Monaco for glamour." },
  { q: "Are F1 tickets refundable?", a: "Yes! All F1 tickets on EuroMatchTickets include Buyer protection cancellation refund policy. Full refund if the race is cancelled. Instant QR delivery." }
];
import { NewsletterSignup } from "../components/NewsletterSignup";
import axios from 'axios';
import { API } from '../App';

// ── Real 2026 Driver Standings (After Round 3 - Japanese GP, March 29 2026) ──
const driverStandings2026 = [
  { pos: 1, driver: "Andrea Kimi Antonelli", team: "Mercedes", nat: "ITA", pts: 72, color: "#00D2BE" },
  { pos: 2, driver: "George Russell", team: "Mercedes", nat: "GBR", pts: 63, color: "#00D2BE" },
  { pos: 3, driver: "Charles Leclerc", team: "Ferrari", nat: "MON", pts: 49, color: "#DC0000" },
  { pos: 4, driver: "Lewis Hamilton", team: "Ferrari", nat: "GBR", pts: 41, color: "#DC0000" },
  { pos: 5, driver: "Lando Norris", team: "McLaren", nat: "GBR", pts: 25, color: "#FF8700" },
  { pos: 6, driver: "Oscar Piastri", team: "McLaren", nat: "AUS", pts: 21, color: "#FF8700" },
  { pos: 7, driver: "Oliver Bearman", team: "Haas", nat: "GBR", pts: 17, color: "#B6BABD" },
  { pos: 8, driver: "Pierre Gasly", team: "Alpine", nat: "FRA", pts: 15, color: "#0090FF" },
  { pos: 9, driver: "Max Verstappen", team: "Red Bull", nat: "NED", pts: 12, color: "#3671C6" },
  { pos: 10, driver: "Liam Lawson", team: "Racing Bulls", nat: "NZL", pts: 10, color: "#6692FF" },
  { pos: 11, driver: "Esteban Ocon", team: "Haas", nat: "FRA", pts: 1, color: "#B6BABD" },
  { pos: 12, driver: "Franco Colapinto", team: "Alpine", nat: "ARG", pts: 1, color: "#0090FF" },
  { pos: 13, driver: "Isack Hadjar", team: "Red Bull", nat: "FRA", pts: 4, color: "#3671C6" },
  { pos: 14, driver: "Arvid Lindblad", team: "Racing Bulls", nat: "GBR", pts: 4, color: "#6692FF" },
  { pos: 15, driver: "Nico Hulkenberg", team: "Audi", nat: "GER", pts: 2, color: "#25A617" },
  { pos: 16, driver: "Alexander Albon", team: "Williams", nat: "THA", pts: 2, color: "#005AFF" },
  { pos: 17, driver: "Gabriel Bortoleto", team: "Audi", nat: "BRA", pts: 0, color: "#25A617" },
  { pos: 18, driver: "Carlos Sainz Jr.", team: "Williams", nat: "ESP", pts: 0, color: "#005AFF" },
  { pos: 19, driver: "Fernando Alonso", team: "Aston Martin", nat: "ESP", pts: 0, color: "#006F62" },
  { pos: 20, driver: "Lance Stroll", team: "Aston Martin", nat: "CAN", pts: 0, color: "#006F62" },
  { pos: 21, driver: "Sergio Perez", team: "Cadillac", nat: "MEX", pts: 0, color: "#1E1E1E" },
  { pos: 22, driver: "Valtteri Bottas", team: "Cadillac", nat: "FIN", pts: 0, color: "#1E1E1E" }
];

// ── Real 2026 Constructor Standings (After Round 3) ──
const constructorStandings2026 = [
  { pos: 1, team: "Mercedes", pts: 135, color: "#00D2BE", drivers: "Russell / Antonelli" },
  { pos: 2, team: "Ferrari", pts: 90, color: "#DC0000", drivers: "Leclerc / Hamilton" },
  { pos: 3, team: "McLaren", pts: 46, color: "#FF8700", drivers: "Norris / Piastri" },
  { pos: 4, team: "Haas", pts: 18, color: "#B6BABD", drivers: "Ocon / Bearman" },
  { pos: 5, team: "Alpine", pts: 16, color: "#0090FF", drivers: "Gasly / Colapinto" },
  { pos: 6, team: "Red Bull Racing", pts: 16, color: "#3671C6", drivers: "Verstappen / Hadjar" },
  { pos: 7, team: "Racing Bulls", pts: 14, color: "#6692FF", drivers: "Lawson / Lindblad" },
  { pos: 8, team: "Audi", pts: 2, color: "#25A617", drivers: "Hulkenberg / Bortoleto" },
  { pos: 9, team: "Williams", pts: 2, color: "#005AFF", drivers: "Albon / Sainz Jr." },
  { pos: 10, team: "Cadillac", pts: 0, color: "#1E1E1E", drivers: "Perez / Bottas" },
  { pos: 11, team: "Aston Martin", pts: 0, color: "#006F62", drivers: "Alonso / Stroll" }
];

// ── Real 2025 Final Driver Standings (World Champion: Lando Norris) ──
const driverStandings2025 = [
  { pos: 1, driver: "Lando Norris", team: "McLaren", pts: 423 },
  { pos: 2, driver: "Max Verstappen", team: "Red Bull", pts: 421 },
  { pos: 3, driver: "Oscar Piastri", team: "McLaren", pts: 410 },
  { pos: 4, driver: "George Russell", team: "Mercedes", pts: 319 },
  { pos: 5, driver: "Charles Leclerc", team: "Ferrari", pts: 242 },
  { pos: 6, driver: "Lewis Hamilton", team: "Ferrari", pts: 156 },
  { pos: 7, driver: "Kimi Antonelli", team: "Mercedes", pts: 150 },
  { pos: 8, driver: "Alexander Albon", team: "Williams", pts: 73 },
  { pos: 9, driver: "Carlos Sainz", team: "Williams", pts: 64 },
  { pos: 10, driver: "Fernando Alonso", team: "Aston Martin", pts: 56 }
];

// ── 2026 Teams & Drivers ──
const teamsDrivers2026 = [
  { team: "Red Bull Racing", engine: "Honda RBPT", d1: "Max Verstappen", d2: "Isack Hadjar", color: "#3671C6" },
  { team: "McLaren", engine: "Mercedes", d1: "Lando Norris", d2: "Oscar Piastri", color: "#FF8700" },
  { team: "Ferrari", engine: "Ferrari", d1: "Charles Leclerc", d2: "Lewis Hamilton", color: "#DC0000" },
  { team: "Mercedes", engine: "Mercedes", d1: "George Russell", d2: "Kimi Antonelli", color: "#00D2BE" },
  { team: "Aston Martin", engine: "Mercedes", d1: "Fernando Alonso", d2: "Lance Stroll", color: "#006F62" },
  { team: "Alpine", engine: "Renault", d1: "Pierre Gasly", d2: "Franco Colapinto", color: "#0090FF" },
  { team: "Williams", engine: "Mercedes", d1: "Alexander Albon", d2: "Carlos Sainz Jr.", color: "#005AFF" },
  { team: "Racing Bulls", engine: "Honda RBPT", d1: "Liam Lawson", d2: "Arvid Lindblad", color: "#6692FF" },
  { team: "Haas", engine: "Ferrari", d1: "Esteban Ocon", d2: "Oliver Bearman", color: "#B6BABD" },
  { team: "Audi", engine: "Audi", d1: "Nico Hulkenberg", d2: "Gabriel Bortoleto", color: "#25A617" },
  { team: "Cadillac", engine: "Ferrari", d1: "Sergio Perez", d2: "Valtteri Bottas", color: "#1E1E1E" }
];

// ── Official 2026 F1 Race Calendar (24 Races) ──
const raceCalendar2026 = [
  { round: 1, gp: "Australian Grand Prix", circuit: "Albert Park, Melbourne", country: "Australia", flag: "AU", dates: "Mar 6-8", sprint: false, price: "159" },
  { round: 2, gp: "Chinese Grand Prix", circuit: "Shanghai International", country: "China", flag: "CN", dates: "Mar 13-15", sprint: true, price: "129" },
  { round: 3, gp: "Japanese Grand Prix", circuit: "Suzuka Circuit", country: "Japan", flag: "JP", dates: "Mar 27-29", sprint: false, price: "189" },
  { round: 4, gp: "Bahrain Grand Prix", circuit: "Bahrain International", country: "Bahrain", flag: "BH", dates: "Apr 10-12", sprint: false, price: "149" },
  { round: 5, gp: "Saudi Arabian Grand Prix", circuit: "Jeddah Corniche", country: "Saudi Arabia", flag: "SA", dates: "Apr 17-19", sprint: false, price: "169" },
  { round: 6, gp: "Miami Grand Prix", circuit: "Miami International", country: "USA", flag: "US", dates: "May 1-3", sprint: true, price: "249" },
  { round: 7, gp: "Canadian Grand Prix", circuit: "Circuit Gilles Villeneuve", country: "Canada", flag: "CA", dates: "May 22-24", sprint: true, price: "179" },
  { round: 8, gp: "Monaco Grand Prix", circuit: "Circuit de Monaco", country: "Monaco", flag: "MC", dates: "Jun 5-7", sprint: false, price: "289" },
  { round: 9, gp: "Spanish Grand Prix", circuit: "Barcelona-Catalunya", country: "Spain", flag: "ES", dates: "Jun 12-14", sprint: false, price: "119" },
  { round: 10, gp: "Austrian Grand Prix", circuit: "Red Bull Ring, Spielberg", country: "Austria", flag: "AT", dates: "Jun 26-28", sprint: false, price: "119" },
  { round: 11, gp: "British Grand Prix", circuit: "Silverstone Circuit", country: "Great Britain", flag: "GB", dates: "Jul 3-5", sprint: true, price: "149" },
  { round: 12, gp: "Belgian Grand Prix", circuit: "Spa-Francorchamps", country: "Belgium", flag: "BE", dates: "Jul 17-19", sprint: false, price: "109" },
  { round: 13, gp: "Hungarian Grand Prix", circuit: "Hungaroring, Budapest", country: "Hungary", flag: "HU", dates: "Jul 24-26", sprint: false, price: "99" },
  { round: 14, gp: "Dutch Grand Prix", circuit: "Circuit Zandvoort", country: "Netherlands", flag: "NL", dates: "Aug 21-23", sprint: true, price: "189" },
  { round: 15, gp: "Italian Grand Prix", circuit: "Autodromo di Monza", country: "Italy", flag: "IT", dates: "Sep 4-6", sprint: false, price: "99" },
  { round: 16, gp: "Madrid Grand Prix", circuit: "Madring Circuit", country: "Spain", flag: "ES", dates: "Sep 11-13", sprint: false, price: "139" },
  { round: 17, gp: "Azerbaijan Grand Prix", circuit: "Baku City Circuit", country: "Azerbaijan", flag: "AZ", dates: "Sep 24-26", sprint: false, price: "169" },
  { round: 18, gp: "Singapore Grand Prix", circuit: "Marina Bay Street", country: "Singapore", flag: "SG", dates: "Oct 9-11", sprint: true, price: "189" },
  { round: 19, gp: "United States Grand Prix", circuit: "COTA, Austin", country: "USA", flag: "US", dates: "Oct 23-25", sprint: false, price: "199" },
  { round: 20, gp: "Mexico City Grand Prix", circuit: "Autodromo Hermanos Rodriguez", country: "Mexico", flag: "MX", dates: "Oct 30 - Nov 1", sprint: false, price: "139" },
  { round: 21, gp: "Sao Paulo Grand Prix", circuit: "Interlagos", country: "Brazil", flag: "BR", dates: "Nov 6-8", sprint: false, price: "129" },
  { round: 22, gp: "Las Vegas Grand Prix", circuit: "Las Vegas Strip", country: "USA", flag: "US", dates: "Nov 19-21", sprint: false, price: "249" },
  { round: 23, gp: "Qatar Grand Prix", circuit: "Lusail International", country: "Qatar", flag: "QA", dates: "Nov 27-29", sprint: false, price: "179" },
  { round: 24, gp: "Abu Dhabi Grand Prix", circuit: "Yas Marina Circuit", country: "UAE", flag: "AE", dates: "Dec 4-6", sprint: false, price: "169" }
];

// ── Clean URL mapping for each GP - SEO critical! Never link to ugly event IDs ──
const gpCleanLinks = {
  "Australian Grand Prix": "/f1-australian-grand-prix-melbourne-tickets",
  "Chinese Grand Prix": "/checkout?event=f1-chinese-grand-prix-2026",
  "Japanese Grand Prix": "/f1-japanese-grand-prix-suzuka-tickets",
  "Bahrain Grand Prix": "/f1-bahrain-grand-prix-tickets",
  "Saudi Arabian Grand Prix": "/f1-saudi-arabian-grand-prix-jeddah-tickets",
  "Miami Grand Prix": "/f1-miami-grand-prix-tickets",
  "Canadian Grand Prix": "/checkout?event=f1-canadian-grand-prix-2026",
  "Monaco Grand Prix": "/f1-monaco-grand-prix-tickets",
  "Spanish Grand Prix": "/f1-spanish-grand-prix-barcelona-tickets",
  "Austrian Grand Prix": "/f1-austrian-grand-prix-red-bull-ring-tickets",
  "British Grand Prix": "/f1-british-grand-prix-silverstone-tickets",
  "Belgian Grand Prix": "/f1-belgian-grand-prix-spa-tickets",
  "Hungarian Grand Prix": "/f1-hungarian-grand-prix-budapest-tickets",
  "Dutch Grand Prix": "/f1-dutch-grand-prix-zandvoort-tickets",
  "Italian Grand Prix": "/f1-italian-grand-prix-monza-tickets",
  "Madrid Grand Prix": "/checkout?event=f1-madrid-grand-prix-2026",
  "Azerbaijan Grand Prix": "/checkout?event=f1-azerbaijan-grand-prix-2026",
  "Singapore Grand Prix": "/f1-singapore-grand-prix-tickets",
  "United States Grand Prix": "/checkout?event=f1-us-grand-prix-2026",
  "Mexico City Grand Prix": "/checkout?event=f1-mexico-grand-prix-2026",
  "Sao Paulo Grand Prix": "/checkout?event=f1-brazil-grand-prix-2026",
  "Las Vegas Grand Prix": "/f1-las-vegas-grand-prix-tickets",
  "Qatar Grand Prix": "/checkout?event=f1-qatar-grand-prix-2026",
  "Abu Dhabi Grand Prix": "/f1-abu-dhabi-grand-prix-tickets"
};

const F1TicketsPage = () => {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const fetchF1Events = async () => {
      try {
        const response = await axios.get(`${API}/events?event_type=f1`);
        setRaces(response.data.sort((a, b) => new Date(a.event_date) - new Date(b.event_date)));
      } catch (error) {
        console.error('Error fetching F1 events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchF1Events();
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SportsEvent",
        "name": "Formula 1 World Championship 2026",
        "description": "Buy official F1 2026 tickets for all 24 Grand Prix races. Monaco GP from \u20ac289, Silverstone from \u20ac149. Market pricing may vary.",
        "startDate": "2026-03-06",
        "endDate": "2026-12-06",
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "image": ["https://euromatchtickets.com/logo-192.png"],
        "url": "https://euromatchtickets.com/f1-tickets",
        "location": { "@type": "Place", "name": "24 Circuits Worldwide", "address": { "@type": "PostalAddress", "addressCountry": "GB" } },
        "organizer": { "@type": "Organization", "name": "Formula 1", "url": "https://www.formula1.com" },
        "performer": { "@type": "SportsTeam", "name": "Formula 1 World Championship" },
        "offers": {
          "@type": "Offer",
          "lowPrice": "61",
          "highPrice": "5989",
          "priceCurrency": "EUR","availability": "https://schema.org/InStock",
          "url": "https://euromatchtickets.com/f1-tickets",
          "validFrom": "2025-01-01",
          "seller": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" }
        }
      },
      {
        "@type": "Product",
        "name": "F1 2026 Grand Prix Tickets",
        "description": "Buy Formula 1 2026 tickets for all 24 Grand Prix races. Verified prices with 0% fees.",
        "image": "https://euromatchtickets.com/logo-192.png",
        "url": "https://euromatchtickets.com/f1-tickets",
        "brand": { "@type": "Organization", "name": "EuroMatchTickets" },
        "offers": {
          "@type": "Offer",
          "lowPrice": "61",
          "highPrice": "5989",
          "priceCurrency": "EUR","availability": "https://schema.org/InStock",
          "url": "https://euromatchtickets.com/f1-tickets"
        }
      },
      {
        "@type": "ItemList",
        "name": "F1 2026 Race Calendar with Tickets",
        "numberOfItems": 24,
        "itemListElement": raceCalendar2026.slice(0, 10).map((r, i) => {
          const monthMap = {'Mar':'03','Apr':'04','May':'05','Jun':'06','Jul':'07','Aug':'08','Sep':'09','Oct':'10','Nov':'11','Dec':'12'};
          const monthStr = r.dates.split(' ')[0];
          const dayStr = r.dates.split('-')[0].split(' ').pop().padStart(2, '0');
          const month = monthMap[monthStr] || '03';
          const startDate = `2026-${month}-${dayStr}`;
          const endDay = r.dates.includes('-') ? r.dates.split('-').pop().trim().padStart(2, '0') : dayStr;
          const endDate = `2026-${month}-${endDay}`;
          return {
          "@type": "ListItem",
          "position": i + 1,
          "item": {
            "@type": "SportsEvent",
            "name": `${r.gp} 2026`,
            "description": `Buy ${r.gp} 2026 tickets from €${r.price}. ${r.circuit}. Verified sellers, QR ticket delivery, cancellation refund policy.`,
            "startDate": startDate,
            "endDate": endDate,
            "eventStatus": "https://schema.org/EventScheduled",
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "location": { "@type": "Place", "name": r.circuit, "address": { "@type": "PostalAddress", "addressCountry": {"@type": "Country", "name": r.flag} } },
            "image": "https://euromatchtickets.com/images/heroes/f1-red-lg.webp",
            "performer": { "@type": "SportsTeam", "name": "Formula 1" },
            "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
            "offers": {
              "@type": "Offer",
              "lowPrice": r.price,
              "highPrice": String(parseInt(r.price) * 10),
              "priceCurrency": "EUR","availability": "https://schema.org/InStock",
              "url": "https://euromatchtickets.com/f1-tickets",
              "validFrom": "2025-01-01",
              "seller": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" }
            }
          }
        }})
      }
    ]
  };

  // ISO code flags for calendar
  const codeFlags = {
    "AU": "\ud83c\udde6\ud83c\uddfa", "CN": "\ud83c\udde8\ud83c\uddf3", "JP": "\ud83c\uddef\ud83c\uddf5", "BH": "\ud83c\udde7\ud83c\udded",
    "SA": "\ud83c\uddf8\ud83c\udde6", "US": "\ud83c\uddfa\ud83c\uddf8", "CA": "\ud83c\udde8\ud83c\udde6", "MC": "\ud83c\uddf2\ud83c\udde8",
    "ES": "\ud83c\uddea\ud83c\uddf8", "AT": "\ud83c\udde6\ud83c\uddf9", "GB": "\ud83c\uddec\ud83c\udde7", "BE": "\ud83c\udde7\ud83c\uddea",
    "HU": "\ud83c\udded\ud83c\uddfa", "NL": "\ud83c\uddf3\ud83c\uddf1", "IT": "\ud83c\uddee\ud83c\uddf9", "AZ": "\ud83c\udde6\ud83c\uddff",
    "SG": "\ud83c\uddf8\ud83c\uddec", "MX": "\ud83c\uddf2\ud83c\uddfd", "BR": "\ud83c\udde7\ud83c\uddf7", "QA": "\ud83c\uddf6\ud83c\udde6",
    "AE": "\ud83c\udde6\ud83c\uddea"
  };
  // Country name flags for API events
  const countryFlags = {
    "Australia": "\ud83c\udde6\ud83c\uddfa", "China": "\ud83c\udde8\ud83c\uddf3", "Japan": "\ud83c\uddef\ud83c\uddf5",
    "Bahrain": "\ud83c\udde7\ud83c\udded", "Saudi Arabia": "\ud83c\uddf8\ud83c\udde6", "USA": "\ud83c\uddfa\ud83c\uddf8",
    "Canada": "\ud83c\udde8\ud83c\udde6", "Monaco": "\ud83c\uddf2\ud83c\udde8", "Spain": "\ud83c\uddea\ud83c\uddf8",
    "Austria": "\ud83c\udde6\ud83c\uddf9", "UK": "\ud83c\uddec\ud83c\udde7", "England": "\ud83c\uddec\ud83c\udde7",
    "Great Britain": "\ud83c\uddec\ud83c\udde7", "Belgium": "\ud83c\udde7\ud83c\uddea", "Hungary": "\ud83c\udded\ud83c\uddfa",
    "Netherlands": "\ud83c\uddf3\ud83c\uddf1", "Italy": "\ud83c\uddee\ud83c\uddf9", "Azerbaijan": "\ud83c\udde6\ud83c\uddff",
    "Singapore": "\ud83c\uddf8\ud83c\uddec", "Mexico": "\ud83c\uddf2\ud83c\uddfd", "Brazil": "\ud83c\udde7\ud83c\uddf7",
    "Qatar": "\ud83c\uddf6\ud83c\udde6", "UAE": "\ud83c\udde6\ud83c\uddea"
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const featuredRaces = races.filter(r => r.featured).slice(0, 6);
  const displayRaces = featuredRaces.length > 0 ? featuredRaces : races.slice(0, 6);

  const positionBadge = (pos) => {
    if (pos === 1) return <span className="inline-flex items-center justify-center w-7 h-7 rounded-none bg-amber-400 text-white font-black text-xs">1</span>;
    if (pos === 2) return <span className="inline-flex items-center justify-center w-7 h-7 rounded-none bg-slate-300 text-white font-black text-xs">2</span>;
    if (pos === 3) return <span className="inline-flex items-center justify-center w-7 h-7 rounded-none bg-amber-700 text-white font-black text-xs">3</span>;
    return <span className="inline-flex items-center justify-center w-7 h-7 rounded-none bg-slate-700 text-slate-300 font-bold text-xs">{pos}</span>;
  };

  return (
    <div className="min-h-screen bg-[#0e0e14]" data-testid="f1-tickets-page">
      <FAQSchemaScript faqs={F1_FAQS} />
      <SEOHead
        title="Buy Formula 1 Tickets 2026 | All 24 Grand Prix From €79"
        description="Buy F1 2026 tickets at best prices. Full 2026 calendar, driver standings, team info. Monaco GP from \u20ac289, Silverstone from \u20ac149, Monza from \u20ac99. All 24 races."
        image="https://images.unsplash.com/photo-1504707748692-419802cf939d?w=1200&h=630&fit=crop"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative py-20 overflow-hidden" data-testid="f1-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-slate-900 to-slate-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-[#e10600]/100/20 border border-red-500/30 rounded-none px-4 py-2 mb-6">
            <Flame className="w-4 h-4 text-red-400" />
            <span className="text-red-300 font-medium text-sm">2026 Season Live - Round 3 Complete</span>
          </div>
          <Badge className="bg-[#e10600]/10 text-red-600 border-red-200 mb-6">
            <Flag className="w-4 h-4 mr-2" />Formula 1 World Championship 2026
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            F1 Tickets 2026
            <span className="block text-2xl md:text-3xl mt-2 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              24 Grand Prix Races - 11 Teams - 22 Drivers
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto mb-4">
            Secure your seat now with QR ticket delivery. Buyer protection.
            <strong className="text-white"> Market pricing may vary - No service fees!</strong>
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 bg-[#e10600]/100/20 border border-red-500/30 rounded-none px-3 py-1.5 text-red-300 text-sm font-medium animate-pulse">
              <AlertCircle className="w-3.5 h-3.5" /> Only 847 tickets left for Monaco GP
            </span>
            <span className="inline-flex items-center gap-1.5 bg-amber-500/100/20 border border-amber-500/30 rounded-none px-3 py-1.5 text-amber-300 text-sm font-medium">
              <Users className="w-3.5 h-3.5" /> 312 people viewing F1 tickets now
            </span>
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/100/20 border border-emerald-500/30 rounded-none px-3 py-1.5 text-emerald-300 text-sm font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> Prices up 12% this week
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { icon: Flag, label: "24 Races" },
              { icon: Users, label: "11 Teams" },
              { icon: Calendar, label: "Mar - Dec 2026" },
              { icon: MapPin, label: "21 Countries" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-none text-slate-200 text-sm">
                <item.icon className="w-4 h-4 text-red-400" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-none p-6">
            <div className="text-slate-400 text-sm">Tickets from</div>
            <div className="text-5xl font-black text-white">&#8364;89</div>
            <div className="text-emerald-400 text-sm mt-1 font-medium">Up to 40% cheaper than competitors</div>
          </div>
        </div>
      </section>

      {/* ═══════════════ TRUST BAR ═══════════════ */}
      <section className="py-4 border-y border-white/6 bg-[#15151e]" data-testid="f1-trust-bar">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            {[
              { icon: Shield, label: "500,000+ Tickets Sold" },
              { icon: Star, label: "Highly rated from Customer reviews" },
              { icon: Globe, label: "Trusted in 25+ Countries" },
              { icon: Zap, label: "QR ticket delivery" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-400">
                <item.icon className="w-3.5 h-3.5 text-[#e10600]" />
                <span className="font-bold text-xs uppercase tracking-wider">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PRICE COMPARISON ═══════════════ */}
      <section className="py-10 bg-[#0e0e14]" data-testid="f1-price-comparison">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-black text-center text-white mb-6 uppercase tracking-tight">Compare Our F1 Ticket Prices</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: "F1.com Official", price: "399", strike: true },
              { name: "StubHub", price: "379", strike: true },
              { name: "Viagogo", price: "365", strike: true },
              { name: "EuroMatchTickets", price: "189", strike: false, best: true }
            ].map((s, i) => (
              <div key={i} className={`text-center p-4 ${s.best ? 'bg-[#15803d]/10 border-2 border-[#15803d]' : 'bg-[#1e1e1e] border border-white/8'}`}>
                <div className={`text-xs mb-1 font-bold uppercase tracking-wider ${s.best ? 'text-[#15803d]' : 'text-slate-500'}`}>{s.name}</div>
                <div className={`font-black text-xl ${s.strike ? 'text-red-500 line-through' : 'text-[#15803d]'}`}>&#8364;{s.price}</div>
              </div>
            ))}
          </div>
          <p className="text-slate-400 text-xs text-center mt-3">*Average Grandstand prices. Prices vary by race and availability.</p>
        </div>
      </section>

      {/* ═══════════════ STANDINGS & TEAMS ═══════════════ */}
      <section className="py-14 bg-[#15151e]" data-testid="f1-standings-section">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2 uppercase tracking-tight">F1 2026 Championship Standings</h2>
            <p className="text-slate-500 text-sm">Live after Round 3 - Japanese Grand Prix, Suzuka</p>
          </div>

          <Tabs defaultValue="drivers" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6 h-11 bg-white/5 rounded-none" data-testid="standings-tabs">
              <TabsTrigger value="drivers" className="text-xs sm:text-sm rounded-none data-[state=active]:bg-[#e10600] data-[state=active]:text-white">Drivers 2026</TabsTrigger>
              <TabsTrigger value="constructors" className="text-xs sm:text-sm rounded-none data-[state=active]:bg-[#e10600] data-[state=active]:text-white">Teams 2026</TabsTrigger>
              <TabsTrigger value="lineups" className="text-xs sm:text-sm rounded-none data-[state=active]:bg-[#e10600] data-[state=active]:text-white">All Lineups</TabsTrigger>
              <TabsTrigger value="champions" className="text-xs sm:text-sm rounded-none data-[state=active]:bg-[#e10600] data-[state=active]:text-white">2025 Champions</TabsTrigger>
            </TabsList>

            {/* ── Drivers Standings 2026 ── */}
            <TabsContent value="drivers" data-testid="driver-standings-tab">
              <div className="border border-white/10 rounded-none overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-900 hover:bg-slate-900">
                      <TableHead className="text-white font-bold w-16 text-center">Pos</TableHead>
                      <TableHead className="text-white font-bold">Driver</TableHead>
                      <TableHead className="text-white font-bold hidden sm:table-cell">Nationality</TableHead>
                      <TableHead className="text-white font-bold">Team</TableHead>
                      <TableHead className="text-white font-bold text-right">Points</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {driverStandings2026.map((d) => (
                      <TableRow key={d.pos} className={d.pos <= 3 ? 'bg-amber-500/10/50' : ''} data-testid={`driver-row-${d.pos}`}>
                        <TableCell className="text-center">{positionBadge(d.pos)}</TableCell>
                        <TableCell className="font-bold text-white">{d.driver}</TableCell>
                        <TableCell className="text-slate-500 hidden sm:table-cell">{d.nat}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-2">
                            <span className="w-3 h-3 rounded-none flex-shrink-0" style={{ backgroundColor: d.color }} />
                            <span className="text-slate-300">{d.team}</span>
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-black text-lg text-white">{d.pts}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="text-xs text-slate-400 mt-2 text-center">Updated after Round 3 - Japanese Grand Prix, March 29, 2026</p>
            </TabsContent>

            {/* ── Constructor Standings 2026 ── */}
            <TabsContent value="constructors" data-testid="constructor-standings-tab">
              <div className="border border-white/10 rounded-none overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-900 hover:bg-slate-900">
                      <TableHead className="text-white font-bold w-16 text-center">Pos</TableHead>
                      <TableHead className="text-white font-bold">Team</TableHead>
                      <TableHead className="text-white font-bold hidden sm:table-cell">Drivers</TableHead>
                      <TableHead className="text-white font-bold text-right">Points</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {constructorStandings2026.map((t) => (
                      <TableRow key={t.pos} className={t.pos <= 3 ? 'bg-amber-500/10/50' : ''} data-testid={`constructor-row-${t.pos}`}>
                        <TableCell className="text-center">{positionBadge(t.pos)}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-2">
                            <span className="w-3 h-3 rounded-none flex-shrink-0" style={{ backgroundColor: t.color }} />
                            <span className="font-bold text-white">{t.team}</span>
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-500 text-sm hidden sm:table-cell">{t.drivers}</TableCell>
                        <TableCell className="text-right font-black text-lg text-white">{t.pts}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="text-xs text-slate-400 mt-2 text-center">Updated after Round 3 - Japanese Grand Prix, March 29, 2026</p>
            </TabsContent>

            {/* ── All 2026 Team Lineups ── */}
            <TabsContent value="lineups" data-testid="team-lineups-tab">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {teamsDrivers2026.map((t) => (
                  <div key={t.team} className="border border-white/10 rounded-none p-4 hover:shadow-md transition-shadow" data-testid={`team-card-${t.team.replace(/\s/g, '-').toLowerCase()}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-4 h-10 rounded-sm" style={{ backgroundColor: t.color }} />
                      <div>
                        <h3 className="font-bold text-white text-sm">{t.team}</h3>
                        <span className="text-xs text-slate-400">{t.engine} Engine</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-sm bg-[#0e0e14] rounded-none px-3 py-2">
                        <Car className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-slate-300 font-medium">{t.d1}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm bg-[#0e0e14] rounded-none px-3 py-2">
                        <Car className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-slate-300 font-medium">{t.d2}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* ── 2025 Champions ── */}
            <TabsContent value="champions" data-testid="champions-2025-tab">
              <div className="mb-6 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-none p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Crown className="w-8 h-8 text-amber-500" />
                  <div>
                    <h3 className="font-bold text-white text-lg">2025 World Champion: Lando Norris</h3>
                    <p className="text-slate-500 text-sm">McLaren Mercedes - 423 Points - Won by just 2 points over Verstappen</p>
                  </div>
                </div>
              </div>
              <div className="border border-white/10 rounded-none overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-900 hover:bg-slate-900">
                      <TableHead className="text-white font-bold w-16 text-center">Pos</TableHead>
                      <TableHead className="text-white font-bold">Driver</TableHead>
                      <TableHead className="text-white font-bold">Team</TableHead>
                      <TableHead className="text-white font-bold text-right">Points</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {driverStandings2025.map((d) => (
                      <TableRow key={d.pos} className={d.pos === 1 ? 'bg-amber-500/10' : ''}>
                        <TableCell className="text-center">{positionBadge(d.pos)}</TableCell>
                        <TableCell className="font-bold text-white">{d.driver}</TableCell>
                        <TableCell className="text-slate-400">{d.team}</TableCell>
                        <TableCell className="text-right font-black text-lg text-white">{d.pts}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="text-xs text-slate-400 mt-2 text-center">Final 2025 Season Standings - 24 Races</p>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* ═══════════════ FEATURED RACES FROM API ═══════════════ */}
      <section className="py-14 bg-[#0e0e14]" data-testid="f1-featured-races">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Featured F1 Races 2026</h2>
            <Link to="/checkout?event=f1-tickets-2026" className="text-[#e10600] hover:text-red-400 flex items-center gap-1 text-sm font-black uppercase tracking-wider">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-none animate-spin" />
            </div>
          ) : (
            <div className="grid gap-3">
              {displayRaces.map((race, i) => {
                const gpName = Object.keys(gpCleanLinks).find(gp => race.title?.includes(gp.split(' ')[0]));
                const cleanLink = gpName ? gpCleanLinks[gpName] : `/checkout?event=${race.slug || race.event_id}`;
                return (
                <Link
                  key={race.event_id || i}
                  to={cleanLink}
                  className="group flex flex-col md:flex-row md:items-center justify-between bg-[#1e1e1e] border border-white/6 hover:border-[#e10600] p-5 transition-colors duration-150"
                  data-testid={`featured-race-${i}`}
                >
                  <div className="flex items-center gap-4 mb-3 md:mb-0">
                    <div className="w-12 h-12 bg-[#e10600]/10 flex items-center justify-center text-2xl">
                      {countryFlags[race.country] || <Flag className="w-5 h-5 text-red-500" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-white group-hover:text-[#e10600] transition-colors uppercase tracking-tight">{race.title}</h3>
                        {race.featured && (
                          <Badge className="bg-[#facc15] text-black border-transparent text-xs font-black uppercase rounded-none">
                            <Flame className="w-3 h-3 mr-1" />HOT
                          </Badge>
                        )}
                      </div>
                      <p className="text-slate-500 text-sm">{formatDate(race.event_date)} &middot; {race.venue}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[#15803d] text-sm font-bold">{race.available_tickets || 0} tickets</span>
                    <div className="text-right">
                      <div className="text-xs text-slate-500">From</div>
                      <div className="text-xl font-black text-[#e10600]">&#8364;{race.lowest_price ? Math.round(race.lowest_price) : '89'}</div>
                    </div>
                    <Button className="bg-[#e10600] hover:bg-red-700 text-white rounded-none font-black uppercase text-xs" data-testid={`buy-btn-${i}`}>
                      <Ticket className="w-4 h-4 mr-2" />Buy
                    </Button>
                  </div>
                </Link>
              );
              })}
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/checkout?event=f1-tickets-2026">
              <Button size="lg" className="bg-[#e10600]/100 hover:bg-red-600 text-white px-8" data-testid="view-all-races-btn">
                <Flag className="w-5 h-5 mr-2" />View All {races.length || 24} F1 Races
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ FULL 2026 RACE CALENDAR ═══════════════ */}
      <section className="py-14 bg-[#15151e]" data-testid="f1-calendar-section">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2 uppercase tracking-tight">F1 2026 Calendar - Full Schedule & Ticket Prices</h2>
            <p className="text-slate-500 text-sm">Buy tickets for all 24 Formula 1 Grand Prix races - 6 Sprint weekends included</p>
          </div>
          <div className="border border-white/10 rounded-none overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-900 hover:bg-slate-900">
                  <TableHead className="text-white font-bold w-14 text-center">Rd</TableHead>
                  <TableHead className="text-white font-bold">Grand Prix</TableHead>
                  <TableHead className="text-white font-bold hidden md:table-cell">Circuit</TableHead>
                  <TableHead className="text-white font-bold hidden sm:table-cell">Dates</TableHead>
                  <TableHead className="text-white font-bold text-center hidden sm:table-cell">Sprint</TableHead>
                  <TableHead className="text-white font-bold text-right">Secure Seats</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {raceCalendar2026.map((r) => {
                  const matchedEvent = races.find(e => e.title?.includes(r.country) || e.title?.includes(r.gp.split(' ')[0]));
                  const cleanLink = gpCleanLinks[r.gp];
                  const ticketPrice = matchedEvent?.lowest_price ? Math.round(matchedEvent.lowest_price) : r.price;
                  return (
                    <TableRow key={r.round} className="hover:bg-[#e10600]/10/40" data-testid={`calendar-row-${r.round}`}>
                      <TableCell className="text-center font-bold text-slate-500">{r.round}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{codeFlags[r.flag]}</span>
                          <span className="font-bold text-white text-sm">{r.gp}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm hidden md:table-cell">{r.circuit}</TableCell>
                      <TableCell className="text-slate-400 text-sm hidden sm:table-cell font-medium">{r.dates}</TableCell>
                      <TableCell className="text-center hidden sm:table-cell">
                        {r.sprint ? (
                          <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">Sprint</Badge>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {cleanLink ? (
                          <Link to={cleanLink} className="inline-flex items-center gap-1 bg-[#e10600]/100 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-none transition-colors">
                            &#8364;{ticketPrice}
                          </Link>
                        ) : (
                          <span className="font-black text-red-600">&#8364;{r.price}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            <Badge className="bg-purple-500/10 text-purple-700 border-purple-200">6 Sprint Race Weekends</Badge>
            <Badge className="bg-blue-500/10 text-blue-700 border-blue-200">24 Races Total</Badge>
            <Badge className="bg-amber-500/10 text-amber-700 border-amber-200">Season: March - December</Badge>
          </div>
        </div>
      </section>

      {/* ═══════════════ TICKET CATEGORIES ═══════════════ */}
      <section className="py-14 bg-[#0e0e14]" data-testid="f1-ticket-categories">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-black text-center text-white mb-8 uppercase tracking-tight">Choose Your F1 Experience</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "General Admission", price: "\u20ac89 - \u20ac199", desc: "Access to general viewing areas around the circuit", icon: Users },
              { name: "Grandstand Seats", price: "\u20ac149 - \u20ac589", desc: "Reserved seating with excellent track views", icon: Ticket },
              { name: "VIP Hospitality", price: "\u20ac989 - \u20ac1,989", desc: "Premium experience with gourmet food & open bar", icon: Trophy },
              { name: "Paddock Club", price: "\u20ac2,989 - \u20ac5,989", desc: "The ultimate F1 experience with pit lane access", icon: Star }
            ].map((cat, i) => (
              <div key={i} className="bg-[#1e1e1e] border border-white/8 p-5 hover:border-[#e10600] transition-colors duration-150" data-testid={`ticket-cat-${i}`}>
                <cat.icon className="w-9 h-9 text-[#e10600] mb-3" />
                <h3 className="text-base font-black text-white mb-1 uppercase tracking-tight">{cat.name}</h3>
                <p className="text-slate-500 text-sm mb-3">{cat.desc}</p>
                <div className="text-lg font-black text-[#15803d]">{cat.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ ALL RACE TICKET LINKS (SEO KEYWORDS) ═══════════════ */}
      <section className="py-14 bg-[#15151e]" data-testid="f1-all-race-links">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-black text-center text-white mb-2 uppercase tracking-tight">Buy F1 2026 Grand Prix Tickets - All Races</h2>
          <p className="text-slate-500 text-sm text-center mb-8">Verified Formula 1 tickets for every Grand Prix - 0% fees, instant delivery</p>
          {races.filter(r => r.title?.includes('2026')).length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {races.filter(r => r.title?.includes('2026')).map((race, i) => {
                const seoMap = {
                  "Monaco": { kw: "Buy Monaco GP Tickets 2026", sub: "Circuit de Monaco - Verified Listings", hot: true },
                  "British": { kw: "Buy Silverstone F1 Tickets 2026", sub: "British Grand Prix - Best Grandstand Seats", hot: true },
                  "Italian Grand Prix": { kw: "Buy Monza F1 Tickets 2026", sub: "Italian GP - Autodromo Nazionale Monza" },
                  "Singapore": { kw: "Buy Singapore GP Night Race Tickets", sub: "Marina Bay F1 Street Circuit 2026", hot: true },
                  "Las Vegas": { kw: "Buy Las Vegas Grand Prix Tickets 2026", sub: "F1 Las Vegas Strip Night Race - VIP Available", hot: true },
                  "Abu Dhabi": { kw: "Buy Abu Dhabi GP Tickets 2026", sub: "Yas Marina Circuit - Season Finale" },
                  "Miami": { kw: "Buy Miami Grand Prix Tickets 2026", sub: "Miami F1 Sprint Race - Verified Listings", hot: true },
                  "Australian": { kw: "Buy Australian GP Tickets 2026", sub: "Albert Park Melbourne - Season Opener" },
                  "Japanese": { kw: "Buy Suzuka F1 Tickets 2026", sub: "Japanese Grand Prix - Suzuka Circuit" },
                  "Chinese": { kw: "Buy Chinese GP Tickets 2026", sub: "Shanghai F1 Sprint Race Weekend" },
                  "Bahrain": { kw: "Buy Bahrain GP Tickets 2026", sub: "Bahrain International Circuit - Night Race" },
                  "Saudi": { kw: "Buy Saudi Arabian GP Tickets 2026", sub: "Jeddah Corniche Street Circuit F1" },
                  "Canadian": { kw: "Buy Canadian GP Tickets 2026", sub: "Montreal Circuit Gilles Villeneuve - Sprint" },
                  "Spanish Grand Prix": { kw: "Buy Barcelona F1 Tickets 2026", sub: "Spanish GP - Circuit de Catalunya" },
                  "Austrian": { kw: "Buy Austrian GP Tickets 2026", sub: "Red Bull Ring Spielberg - F1 Sprint" },
                  "Belgian": { kw: "Buy Spa F1 Tickets 2026", sub: "Belgian GP - Spa-Francorchamps Circuit", directLink: "/spa-f1-tickets" },
                  "Hungarian": { kw: "Buy Hungarian GP Tickets 2026", sub: "Hungaroring Budapest - F1 Grand Prix" },
                  "Dutch": { kw: "Buy Zandvoort F1 Tickets 2026", sub: "Dutch GP Sprint - Final Year at Zandvoort", hot: true },
                  "Madrid": { kw: "Buy Madrid GP Tickets 2026", sub: "NEW - Madrid Grand Prix Debut Race", hot: true },
                  "Azerbaijan": { kw: "Buy Baku F1 Tickets 2026", sub: "Azerbaijan GP - Baku City Street Circuit" },
                  "United States": { kw: "Buy COTA F1 Tickets Austin 2026", sub: "US Grand Prix - Circuit of the Americas" },
                  "Mexico": { kw: "Buy Mexico City GP Tickets 2026", sub: "Mexican F1 Grand Prix - Best Atmosphere" },
                  "Brazil": { kw: "Buy Interlagos F1 Tickets 2026", sub: "Sao Paulo GP - Autodromo Interlagos" },
                  "Qatar": { kw: "Buy Qatar GP Tickets 2026", sub: "Lusail International Circuit F1" },
                  "Emilia": { kw: "Buy Imola F1 Tickets 2026", sub: "Emilia Romagna GP - Autodromo Enzo Ferrari" }
                };
                const match = Object.keys(seoMap).find(k => race.title?.includes(k));
                const seo = match ? seoMap[match] : { kw: `Buy ${race.title} Tickets`, sub: race.venue };
                const gpNameMatch = Object.keys(gpCleanLinks).find(gp => race.title?.includes(gp.split(' ')[0]));
                const raceCleanLink = seo.directLink || (gpNameMatch ? gpCleanLinks[gpNameMatch] : `/checkout?event=${race.slug || race.event_id}`);
                return (
                  <Link
                    key={race.event_id || i}
                    to={raceCleanLink}
                    className={`flex items-center gap-3 p-4 border transition-colors duration-150 ${
                      seo.hot
                        ? 'bg-[#e10600]/5 border-[#e10600]/30 hover:border-[#e10600]'
                        : 'bg-[#1e1e1e] border-white/8 hover:border-white/20'
                    }`}
                    data-testid={`race-link-${race.event_id}`}
                  >
                    <span className="text-2xl flex-shrink-0">{countryFlags[race.country] || <Flag className="w-5 h-5 text-red-500" />}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-white text-sm uppercase tracking-tight">{seo.kw}</h3>
                      <span className="text-slate-500 text-xs block truncate">{seo.sub}</span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs text-slate-400">from</div>
                      <span className="font-black text-[#e10600]">&#8364;{race.lowest_price ? Math.round(race.lowest_price) : '89'}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">Loading events...</div>
          )}
        </div>
      </section>

      {/* ═══════════════ WHY BUY FROM US ═══════════════ */}
      <section className="py-14 bg-[#0e0e14]" data-testid="f1-why-buy">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-black text-center text-white mb-8 uppercase tracking-tight">Why Buy F1 Tickets From Us?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: "Best Prices Guaranteed", desc: "Up to 40% cheaper than official F1 and major competitors" },
              { title: "Buyer protection", desc: "Full refund if tickets are invalid or the event is cancelled" },
              { title: "QR ticket delivery", desc: "Receive your tickets immediately via email after purchase" },
              { title: "0% Service Fees", desc: "The price you see is the final price you pay - no hidden charges" }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-[#1e1e1e] border border-white/8">
                <div className="w-9 h-9 bg-[#e10600]/10 flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 h-4 text-[#e10600]" />
                </div>
                <div>
                  <h3 className="font-black text-white text-sm mb-0.5 uppercase tracking-tight">{item.title}</h3>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="py-16 bg-gradient-to-r from-red-900/30 to-orange-900/30" data-testid="f1-cta">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Secure Your F1 2026 Tickets Now</h2>
          <p className="text-lg text-slate-400 mb-8">
            New regulations, new teams, new champions. Up to 40% cheaper than Viagogo &amp; StubHub!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/checkout?event=f1-tickets-2026">
              <Button size="lg" className="bg-[#e10600]/100 hover:bg-red-600 text-white px-8" data-testid="cta-browse-btn" onClick={() => window.trackCTAClick?.('Secure Your Seat Now', 'F1 Tickets', 'bottom')}>
                <Ticket className="w-5 h-5 mr-2" />Secure Your Seat Now
              </Button>
            </Link>
            <Link to="/events?type=f1">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8">
                View Available Seats
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ STRUCTURED DATA ═══════════════ */}
      <BreadcrumbStructuredData items={[
        { name: "Home", url: "https://euromatchtickets.com" },
        { name: "F1 Tickets 2026", url: "https://euromatchtickets.com/f1-tickets" }
      ]} />

      {/* ═══════════════ INTERNAL LINKS ═══════════════ */}
      <section className="py-10 max-w-7xl mx-auto px-4">
        <div className="mb-6 p-5 bg-gradient-to-r from-red-900/20 via-slate-900/50 to-amber-900/20 rounded-none border border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold">Looking for other events?</p>
            <p className="text-slate-400 text-sm">Champions League, World Cup 2026, MotoGP and more!</p>
          </div>
          <div className="flex gap-3">
            <Link to="/super-bowl-2026-tickets" className="bg-red-600 hover:bg-[#e10600]/100 text-white text-sm font-bold px-4 py-2 rounded-none transition">Super Bowl 2026</Link>
            <Link to="/world-cup-2026" className="bg-amber-600 hover:bg-amber-500/100 text-white text-sm font-bold px-4 py-2 rounded-none transition">World Cup 2026</Link>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <InternalLinks category="f1" showRelated={false} />
          <InternalLinks category="football" showRelated={false} />
          <InternalLinks category="concert" showRelated={false} />
        </div>
      </section>
      <EventFAQ faqs={F1_FAQS} title="F1 Tickets 2026 — FAQ" />
      <RelatedEventsLinks category="f1-tickets" title="Top F1 Races & More Events" />
      {/* Newsletter */}
      <section className="py-12 bg-[#0a0a0f]">
        <div className="max-w-4xl mx-auto px-4">
          <NewsletterSignup source="f1-tickets" />
        </div>
      </section>
    </div>
  );
};

export default F1TicketsPage;
