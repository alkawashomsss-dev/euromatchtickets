import { Link } from "react-router-dom";
import { Calendar, MapPin, Ticket, Flag, Moon, Trophy, ChevronRight, Shield, Zap, Star } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";

const F1SchedulePage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "F1 2026 Race Schedule",
    "description": "Complete Formula 1 2026 race calendar with all 24 Grand Prix dates, locations, and ticket prices.",
    "numberOfItems": 24,
    "itemListElement": [
      { "@type": "SportsEvent", "position": 1, "name": "Bahrain Grand Prix", "description": "Formula 1 Bahrain Grand Prix 2026 at Bahrain International Circuit. Buy tickets now.", "startDate": "2026-03-08", "endDate": "2026-03-09", "eventStatus": "https://schema.org/EventScheduled", "image": "https://euromatchtickets.com/logo-192.png", "location": {"@type": "Place", "name": "Bahrain International Circuit", "address": {"@type": "PostalAddress", "addressLocality": "Sakhir", "addressCountry": "BH"}}, "performer": {"@type": "SportsTeam", "name": "Formula 1 - FIA"},
    "organizer": {"@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com"}, "offers": {"@type": "AggregateOffer", "lowPrice": "149", "highPrice": "2499", "priceCurrency": "EUR",
              "offerCount": "100", "availability": "https://schema.org/InStock", "url": "https://euromatchtickets.com/f1-bahrain-grand-prix-tickets", "validFrom": "2025-01-01"} },
      { "@type": "SportsEvent", "position": 2, "name": "Saudi Arabian Grand Prix", "description": "Formula 1 Saudi Arabian Grand Prix 2026 at Jeddah Corniche Circuit. Buy tickets now.", "startDate": "2026-03-22", "endDate": "2026-03-23", "eventStatus": "https://schema.org/EventScheduled", "image": "https://euromatchtickets.com/logo-192.png", "location": {"@type": "Place", "name": "Jeddah Corniche Circuit", "address": {"@type": "PostalAddress", "addressLocality": "Jeddah", "addressCountry": "SA"}}, "performer": {"@type": "SportsTeam", "name": "Formula 1 - FIA"},
    "organizer": {"@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com"}, "offers": {"@type": "AggregateOffer", "lowPrice": "169", "highPrice": "2999", "priceCurrency": "EUR",
              "offerCount": "100", "availability": "https://schema.org/InStock", "url": "https://euromatchtickets.com/f1-saudi-arabian-grand-prix-jeddah-tickets", "validFrom": "2025-01-01"} },
      { "@type": "SportsEvent", "position": 3, "name": "Australian Grand Prix", "description": "Formula 1 Australian Grand Prix 2026 at Albert Park Circuit, Melbourne. Buy tickets now.", "startDate": "2026-03-15", "endDate": "2026-03-16", "eventStatus": "https://schema.org/EventScheduled", "image": "https://euromatchtickets.com/logo-192.png", "location": {"@type": "Place", "name": "Albert Park Circuit", "address": {"@type": "PostalAddress", "addressLocality": "Melbourne", "addressCountry": "AU"}}, "performer": {"@type": "SportsTeam", "name": "Formula 1 - FIA"},
    "organizer": {"@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com"}, "offers": {"@type": "AggregateOffer", "lowPrice": "159", "highPrice": "2499", "priceCurrency": "EUR",
              "offerCount": "100", "availability": "https://schema.org/InStock", "url": "https://euromatchtickets.com/f1-australian-grand-prix-melbourne-tickets", "validFrom": "2025-01-01"} },
    ]
  };

  const races = [
    { round: 1, name: "Bahrain Grand Prix", location: "Sakhir, Bahrain", circuit: "Bahrain International Circuit", date: "March 6-8", price: 149, href: "/f1-bahrain-grand-prix-tickets", night: true, featured: false },
    { round: 2, name: "Saudi Arabian Grand Prix", location: "Jeddah, Saudi Arabia", circuit: "Jeddah Corniche Circuit", date: "March 20-22", price: 169, href: "/f1-saudi-arabian-grand-prix-jeddah-tickets", night: true, featured: false },
    { round: 3, name: "Australian Grand Prix", location: "Melbourne, Australia", circuit: "Albert Park Circuit", date: "March 13-15", price: 159, href: "/f1-australian-grand-prix-melbourne-tickets", night: false, featured: true },
    { round: 4, name: "Japanese Grand Prix", location: "Suzuka, Japan", circuit: "Suzuka International Racing Course", date: "April 3-5", price: 189, href: "/f1-japanese-grand-prix-suzuka-tickets", night: false, featured: true },
    { round: 5, name: "Chinese Grand Prix", location: "Shanghai, China", circuit: "Shanghai International Circuit", date: "April 17-19", price: 149, href: "/checkout?event=f1-2026", night: false, featured: false },
    { round: 6, name: "Miami Grand Prix", location: "Miami, USA", circuit: "Miami International Autodrome", date: "May 8-10", price: 249, href: "/f1-miami-grand-prix-tickets", night: false, featured: true },
    { round: 7, name: "Emilia Romagna Grand Prix", location: "Imola, Italy", circuit: "Autodromo Enzo e Dino Ferrari", date: "May 15-17", price: 129, href: "/checkout?event=f1-2026", night: false, featured: false },
    { round: 8, name: "Monaco Grand Prix", location: "Monte Carlo, Monaco", circuit: "Circuit de Monaco", date: "May 22-24", price: 289, href: "/f1-monaco-grand-prix-tickets", night: false, featured: true, legendary: true },
    { round: 9, name: "Spanish Grand Prix", location: "Barcelona, Spain", circuit: "Circuit de Barcelona-Catalunya", date: "June 5-7", price: 119, href: "/f1-spanish-grand-prix-barcelona-tickets", night: false, featured: false },
    { round: 10, name: "Canadian Grand Prix", location: "Montreal, Canada", circuit: "Circuit Gilles Villeneuve", date: "June 12-14", price: 179, href: "/checkout?event=f1-2026", night: false, featured: true },
    { round: 11, name: "Austrian Grand Prix", location: "Spielberg, Austria", circuit: "Red Bull Ring", date: "July 3-5", price: 119, href: "/f1-austrian-grand-prix-red-bull-ring-tickets", night: false, featured: false },
    { round: 12, name: "British Grand Prix", location: "Silverstone, UK", circuit: "Silverstone Circuit", date: "July 17-19", price: 149, href: "/f1-british-grand-prix-silverstone-tickets", night: false, featured: true, legendary: true },
    { round: 13, name: "Hungarian Grand Prix", location: "Budapest, Hungary", circuit: "Hungaroring", date: "July 24-26", price: 99, href: "/f1-hungarian-grand-prix-budapest-tickets", night: false, featured: false },
    { round: 14, name: "Belgian Grand Prix", location: "Spa, Belgium", circuit: "Circuit de Spa-Francorchamps", date: "Aug 28-30", price: 109, href: "/f1-belgian-grand-prix-spa-tickets", night: false, featured: true, legendary: true },
    { round: 15, name: "Dutch Grand Prix", location: "Zandvoort, Netherlands", circuit: "Circuit Zandvoort", date: "Sept 4-6", price: 189, href: "/f1-dutch-grand-prix-zandvoort-tickets", night: false, featured: true },
    { round: 16, name: "Italian Grand Prix", location: "Monza, Italy", circuit: "Autodromo Nazionale Monza", date: "Sept 11-13", price: 99, href: "/f1-italian-grand-prix-monza-tickets", night: false, featured: true, legendary: true },
    { round: 17, name: "Azerbaijan Grand Prix", location: "Baku, Azerbaijan", circuit: "Baku City Circuit", date: "Sept 18-20", price: 159, href: "/checkout?event=f1-2026", night: false, featured: false },
    { round: 18, name: "Singapore Grand Prix", location: "Singapore", circuit: "Marina Bay Street Circuit", date: "Oct 2-4", price: 189, href: "/f1-singapore-grand-prix-tickets", night: true, featured: true },
    { round: 19, name: "United States Grand Prix", location: "Austin, USA", circuit: "Circuit of the Americas", date: "Oct 23-25", price: 179, href: "/checkout?event=f1-2026", night: false, featured: true },
    { round: 20, name: "Mexico City Grand Prix", location: "Mexico City, Mexico", circuit: "Autódromo Hermanos Rodríguez", date: "Oct 30-Nov 1", price: 149, href: "/checkout?event=f1-2026", night: false, featured: false },
    { round: 21, name: "São Paulo Grand Prix", location: "São Paulo, Brazil", circuit: "Interlagos", date: "Nov 13-15", price: 159, href: "/checkout?event=f1-2026", night: false, featured: true },
    { round: 22, name: "Las Vegas Grand Prix", location: "Las Vegas, USA", circuit: "Las Vegas Street Circuit", date: "Nov 20-22", price: 249, href: "/f1-las-vegas-grand-prix-tickets", night: true, featured: true },
    { round: 23, name: "Qatar Grand Prix", location: "Lusail, Qatar", circuit: "Lusail International Circuit", date: "Nov 27-29", price: 169, href: "/checkout?event=f1-2026", night: true, featured: false },
    { round: 24, name: "Abu Dhabi Grand Prix", location: "Abu Dhabi, UAE", circuit: "Yas Marina Circuit", date: "Dec 4-6", price: 169, href: "/f1-abu-dhabi-grand-prix-tickets", night: true, featured: true },
  ];

  return (
    <div className="min-h-screen bg-[#0e0e14]">
      <SEOHead 
        title="F1 Schedule 2026 | F1 Calendar 2026 & Tickets"
        description="F1 2026 calendar with all 24 Grand Prix dates. Formula 1 schedule 2026: Monaco, Silverstone, Bahrain, Abu Dhabi. Buy F1 tickets from €120."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-slate-900 to-slate-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <Badge className="bg-[#e10600]/10 text-red-600 border-red-200 mb-6">
            <Flag className="w-4 h-4 mr-2" />Formula 1® World Championship
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            F1 2026 Race Schedule
            <span className="block text-2xl md:text-3xl mt-2 text-slate-500">Full Calendar & Tickets for All 24 Races</span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-3xl mx-auto mb-8">
            Complete Formula 1 2026 calendar with dates, locations, and ticket prices. 
            Book your F1 tickets now - <strong className="text-emerald-600">prices from €99!</strong>
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full">
              <Flag className="w-5 h-5 text-red-600" /><span>24 Races</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full">
              <Calendar className="w-5 h-5 text-red-600" /><span>March - December 2026</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full">
              <MapPin className="w-5 h-5 text-red-600" /><span>21 Countries</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-6 border-y border-white/5 bg-[#15151e]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-emerald-600"><Shield className="w-5 h-5" /><span>100% Ticket Guarantee</span></div>
            <div className="flex items-center gap-2 text-emerald-600"><Zap className="w-5 h-5" /><span>Instant QR Delivery</span></div>
            <div className="flex items-center gap-2 text-emerald-600"><Star className="w-5 h-5" /><span>€10 Cheaper Than Competitors</span></div>
          </div>
        </div>
      </section>

      {/* Full Schedule */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Complete F1 2026 Calendar</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#1e1e1e] border-b border-white/10">
                  <th className="py-4 px-4 text-left">Round</th>
                  <th className="py-4 px-4 text-left">Race</th>
                  <th className="py-4 px-4 text-left">Location</th>
                  <th className="py-4 px-4 text-left">Date</th>
                  <th className="py-4 px-4 text-right">From</th>
                  <th className="py-4 px-4 text-center">Tickets</th>
                </tr>
              </thead>
              <tbody>
                {races.map((race) => (
                  <tr key={race.round} className="border-b border-white/10 hover:bg-[#15151e] transition-colors">
                    <td className="py-4 px-4">
                      <span className="w-8 h-8 bg-[#e10600]/10 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
                        {race.round}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{race.name}</span>
                        {race.legendary && <Badge className="bg-amber-500/10 text-amber-600 text-xs"><Trophy className="w-3 h-3" /></Badge>}
                        {race.night && <Badge className="bg-violet-50 text-violet-600 text-xs"><Moon className="w-3 h-3" /></Badge>}
                      </div>
                      <div className="text-sm text-slate-400">{race.circuit}</div>
                    </td>
                    <td className="py-4 px-4 text-slate-500">{race.location}</td>
                    <td className="py-4 px-4 text-slate-500">{race.date}</td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-emerald-600 font-bold">€{race.price}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Link to={race.href}>
                        <Button size="sm" className="bg-[#e10600]/100 hover:bg-red-600">
                          <Ticket className="w-4 h-4 mr-1" />Buy
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Featured Races */}
      <section className="py-16 bg-[#15151e]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">🔥 Most Popular F1 Races 2026</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {races.filter(r => r.featured).slice(0, 8).map((race) => (
              <Link 
                key={race.round} 
                to={race.href}
                className="bg-[#1e1e1e] border border-white/10 hover:border-red-500/50 rounded-none p-4 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-[#e10600]/10 text-red-600 text-xs">Round {race.round}</Badge>
                  {race.night && <Moon className="w-4 h-4 text-violet-600" />}
                </div>
                <h3 className="font-bold group-hover:text-red-600 transition-colors">{race.name}</h3>
                <p className="text-sm text-slate-400 mb-3">{race.date} • {race.location.split(',')[0]}</p>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-600 font-bold">From €{race.price}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-red-600" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Night Races */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Moon className="w-8 h-8 text-violet-600" />
            F1 Night Races 2026
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {races.filter(r => r.night).map((race) => (
              <Link 
                key={race.round} 
                to={race.href}
                className="flex items-center gap-4 bg-gradient-to-r from-purple-900/20 to-slate-900/50 border border-violet-200 hover:border-purple-500/50 rounded-none p-4 transition-all"
              >
                <div className="w-12 h-12 bg-violet-50 rounded-full flex items-center justify-center">
                  <Moon className="w-6 h-6 text-violet-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{race.name}</h3>
                  <p className="text-sm text-slate-400">{race.date}</p>
                </div>
                <span className="text-emerald-600 font-bold">€{race.price}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-[#15151e]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">F1 2026 Schedule FAQ</h2>
          <div className="space-y-4">
            {[
              { q: "How many F1 races are there in 2026?", a: "The 2026 F1 season features 24 Grand Prix races across 21 countries, running from March to December." },
              { q: "When does the 2026 F1 season start?", a: "The 2026 Formula 1 season begins with the Bahrain Grand Prix on March 6-8, 2026." },
              { q: "When is the last F1 race of 2026?", a: "The 2026 F1 season finale is the Abu Dhabi Grand Prix on December 4-6, 2026 at Yas Marina Circuit." },
              { q: "Which F1 races are night races in 2026?", a: "The 2026 night races are: Bahrain GP, Saudi Arabian GP, Singapore GP, Las Vegas GP, Qatar GP, and Abu Dhabi GP (twilight)." },
              { q: "What is the cheapest F1 race to attend in 2026?", a: "The Hungarian GP and Italian GP (Monza) offer the best value with General Admission from €99." },
            ].map((faq, i) => (
              <div key={i} className="bg-[#1e1e1e] border border-white/10 rounded-none p-6">
                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                <p className="text-slate-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-red-900/30 to-orange-900/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready for F1 2026?</h2>
          <p className="text-slate-500 mb-8">Book your tickets now and save up to 50% vs official prices</p>
          <Link to="/f1-tickets">
            <Button size="lg" className="bg-[#e10600]/100 hover:bg-red-600 px-8">
              <Ticket className="w-5 h-5 mr-2" />Browse All F1 Tickets
            </Button>
          </Link>
        </div>
      </section>

      {/* SEO Keywords */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-lg font-bold mb-4">Related Searches:</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "F1 2026 schedule", "Formula 1 calendar 2026", "F1 race dates 2026",
              "F1 2026 races", "Formula 1 2026 calendar", "F1 season 2026",
              "when is Monaco GP 2026", "F1 night races 2026", "F1 European races 2026",
              "F1 tickets 2026", "Formula 1 schedule", "F1 race calendar"
            ].map((term, i) => (
              <span key={i} className="px-3 py-1 bg-[#15151e] text-slate-500 rounded-full text-sm">{term}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default F1SchedulePage;
