import { Link } from "react-router-dom";
import { Trophy, MapPin, Calendar, Star, Ticket, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import SEOHead from "../components/SEOHead";

const BestF1RacesEuropePage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Best F1 Races to Attend in Europe 2026",
    "description": "Complete guide to the best Formula 1 races in Europe. Monaco, Silverstone, Monza, Spa, and more. Tips, prices, and recommendations.",
    "author": { "@type": "Organization", "name": "EuroMatchTickets" },
    "publisher": { "@type": "Organization", "name": "EuroMatchTickets" },
    "datePublished": "2026-01-15",
    "dateModified": "2026-03-01"
  };

  const races = [
    {
      rank: 1,
      name: "Monaco Grand Prix",
      flag: "🇲🇨",
      circuit: "Circuit de Monaco",
      date: "May 22-24, 2026",
      price: "€289",
      href: "/f1-monaco-grand-prix-tickets",
      rating: 5,
      pros: ["Most prestigious F1 race", "Stunning Monaco scenery", "Celebrity atmosphere", "Yacht parties"],
      cons: ["Most expensive race", "Limited overtaking"],
      bestFor: "Once-in-a-lifetime experience"
    },
    {
      rank: 2,
      name: "British Grand Prix",
      flag: "🇬🇧",
      circuit: "Silverstone Circuit",
      date: "July 3-5, 2026",
      price: "€149",
      href: "/f1-british-grand-prix-silverstone-tickets",
      rating: 5,
      pros: ["Best atmosphere in F1", "Historic circuit", "Great racing", "Excellent facilities"],
      cons: ["Unpredictable British weather"],
      bestFor: "Pure racing fans"
    },
    {
      rank: 3,
      name: "Italian Grand Prix",
      flag: "🇮🇹",
      circuit: "Autodromo Nazionale Monza",
      date: "Sept 4-6, 2026",
      price: "€99",
      href: "/f1-italian-grand-prix-monza-tickets",
      rating: 5,
      pros: ["Cheapest major F1 race", "Incredible Tifosi fans", "Fastest circuit", "Historic venue"],
      cons: ["Very hot in September"],
      bestFor: "Budget-conscious fans"
    },
    {
      rank: 4,
      name: "Belgian Grand Prix",
      flag: "🇧🇪",
      circuit: "Spa-Francorchamps",
      date: "Aug 28-30, 2026",
      price: "€109",
      href: "/f1-belgian-grand-prix-spa-tickets",
      rating: 5,
      pros: ["Legendary Eau Rouge", "Beautiful Ardennes forest", "Great value", "Unpredictable weather"],
      cons: ["Rain likely", "Large circuit = lots of walking"],
      bestFor: "True motorsport enthusiasts"
    },
    {
      rank: 5,
      name: "Dutch Grand Prix",
      flag: "🇳🇱",
      circuit: "Circuit Zandvoort",
      date: "Aug 28-30, 2026",
      price: "€189",
      href: "/f1-dutch-grand-prix-zandvoort-tickets",
      rating: 4,
      pros: ["Amazing Orange Army atmosphere", "Banked corners unique to F1", "Beach location"],
      cons: ["Tickets sell out instantly", "Limited grandstand views"],
      bestFor: "Max Verstappen fans"
    },
    {
      rank: 6,
      name: "Spanish Grand Prix",
      flag: "🇪🇸",
      circuit: "Circuit de Barcelona-Catalunya",
      date: "June 5-7, 2026",
      price: "€119",
      href: "/f1-spanish-grand-prix-barcelona-tickets",
      rating: 4,
      pros: ["Excellent value", "Near Barcelona city", "Good facilities", "Sunny weather"],
      cons: ["Difficult overtaking", "Very hot"],
      bestFor: "Combining F1 with a city break"
    },
    {
      rank: 7,
      name: "Austrian Grand Prix",
      flag: "🇦🇹",
      circuit: "Red Bull Ring",
      date: "July 3-5, 2026",
      price: "€119",
      href: "/f1-austrian-grand-prix-red-bull-ring-tickets",
      rating: 4,
      pros: ["Stunning Alpine scenery", "Short track = see everything", "Great camping", "Orange Army party"],
      cons: ["Remote location", "Changeable mountain weather"],
      bestFor: "Festival atmosphere lovers"
    },
    {
      rank: 8,
      name: "Hungarian Grand Prix",
      flag: "🇭🇺",
      circuit: "Hungaroring",
      date: "July 24-26, 2026",
      price: "€99",
      href: "/f1-hungarian-grand-prix-budapest-tickets",
      rating: 4,
      pros: ["Cheapest European F1 race", "Beautiful Budapest nearby", "Loyal fan base"],
      cons: ["Limited overtaking", "Very hot"],
      bestFor: "Best budget F1 experience"
    }
  ];

  return (
    <div className="min-h-screen bg-[hsl(210,20%,98%)] pt-20">
      <SEOHead 
        title="Best F1 Races in Europe 2026 - Top 8 Grand Prix to Attend | Complete Guide"
        description="Discover the best Formula 1 races to attend in Europe 2026. Monaco, Silverstone, Monza, Spa ranked with prices, pros & cons. Expert recommendations for your first F1 race."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero */}
      <section className="relative py-16 bg-gradient-to-br from-red-600/20 via-zinc-900 to-zinc-950">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Best F1 Races to Attend in Europe
            <span className="block text-2xl mt-2 text-slate-500">2026 Season Guide</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Our expert ranking of the top European Grand Prix races. Find your perfect F1 experience based on atmosphere, value, and racing action.
          </p>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="py-8 border-y border-slate-100 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-600">€99</div>
              <div className="text-slate-400 text-sm">Cheapest Race (Monza)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">Monaco</div>
              <div className="text-slate-400 text-sm">Most Prestigious</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">Silverstone</div>
              <div className="text-slate-400 text-sm">Best Atmosphere</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">Spa</div>
              <div className="text-slate-400 text-sm">Best Circuit</div>
            </div>
          </div>
        </div>
      </section>

      {/* Race Rankings */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10">Top 8 European F1 Races Ranked</h2>
          
          <div className="space-y-8">
            {races.map((race) => (
              <div key={race.rank} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="flex items-center gap-4 p-6 border-b border-slate-200">
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-red-600">#{race.rank}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{race.flag}</span>
                      <h3 className="text-xl font-bold">{race.name}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{race.circuit}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{race.date}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-600">{race.price}</div>
                    <div className="flex">
                      {[...Array(race.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-600 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-bold text-emerald-600 mb-2">✓ Pros</h4>
                      <ul className="space-y-1">
                        {race.pros.map((pro, i) => (
                          <li key={i} className="text-sm text-slate-500">• {pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-red-600 mb-2">✗ Cons</h4>
                      <ul className="space-y-1">
                        {race.cons.map((con, i) => (
                          <li key={i} className="text-sm text-slate-500">• {con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div className="text-sm">
                      <span className="text-slate-400">Best for: </span>
                      <span className="text-white font-medium">{race.bestFor}</span>
                    </div>
                    <Link to={race.href}>
                      <Button className="bg-red-500 hover:bg-red-600">
                        <Ticket className="w-4 h-4 mr-2" />Buy Tickets
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Our Recommendations</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <Trophy className="w-8 h-8 text-amber-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Best Overall</h3>
              <p className="text-slate-500 text-sm mb-4">British GP at Silverstone combines great racing, atmosphere, and reasonable prices.</p>
              <Link to="/f1-british-grand-prix-silverstone-tickets" className="text-red-600 text-sm hover:underline">View Silverstone Tickets →</Link>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <Star className="w-8 h-8 text-emerald-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Best Value</h3>
              <p className="text-slate-500 text-sm mb-4">Italian GP at Monza offers F1's fastest circuit from just €99 with incredible Tifosi fans.</p>
              <Link to="/f1-italian-grand-prix-monza-tickets" className="text-red-600 text-sm hover:underline">View Monza Tickets →</Link>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <MapPin className="w-8 h-8 text-red-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Bucket List</h3>
              <p className="text-slate-500 text-sm mb-4">Monaco GP is the ultimate F1 experience. Expensive but unforgettable.</p>
              <Link to="/f1-monaco-grand-prix-tickets" className="text-red-600 text-sm hover:underline">View Monaco Tickets →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-red-900/30 to-orange-900/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience European F1?</h2>
          <p className="text-slate-500 mb-8">Browse all European Grand Prix tickets for 2026</p>
          <Link to="/f1-tickets">
            <Button size="lg" className="bg-red-500 hover:bg-red-600 px-8">
              <Ticket className="w-5 h-5 mr-2" />
              View All F1 Tickets
            </Button>
          </Link>
        </div>
      </section>

      {/* Related Searches */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-lg font-bold mb-4">Related Searches:</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "best F1 races Europe", "F1 races to attend", "European Grand Prix guide",
              "F1 race comparison", "cheapest F1 race Europe", "best atmosphere F1",
              "first F1 race recommendations", "F1 travel guide Europe"
            ].map((term, i) => (
              <span key={i} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-sm">{term}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BestF1RacesEuropePage;
