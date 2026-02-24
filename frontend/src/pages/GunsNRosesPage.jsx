import { Link } from "react-router-dom";
import { Calendar, MapPin, Music, Star, Shield, Users, TrendingUp, Zap, Skull } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";

const GunsNRosesPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    "name": "Guns N Roses European Tour 2026",
    "description": "Buy Guns N Roses 2026 tour tickets. European stadium tour - Berlin, London, Hamburg, Cologne, Marseille.",
    "startDate": "2026-06-13",
    "performer": { "@type": "MusicGroup", "name": "Guns N Roses" },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "95" }
  };

  // Real confirmed dates
  const shows = [
    { date: "Jun 13, 2026", venue: "Olympiastadion", city: "Berlin", country: "Germany", price: 125, tickets: 145 },
    { date: "Jun 23, 2026", venue: "Gelredome", city: "Arnhem", country: "Netherlands", price: 115, tickets: 89 },
    { date: "Jun 26, 2026", venue: "RheinEnergieSTADION", city: "Cologne", country: "Germany", price: 120, tickets: 112 },
    { date: "Jun 27, 2026", venue: "Tottenham Hotspur Stadium", city: "London", country: "UK", price: 145, tickets: 78, hot: true },
    { date: "Jul 1, 2026", venue: "Stade Velodrome", city: "Marseille", country: "France", price: 115, tickets: 134 },
    { date: "Jul 3-4, 2026", venue: "Volksparkstadion", city: "Hamburg", country: "Germany", nights: 2, price: 125, tickets: 167, hot: true },
    { date: "Jul 17, 2026", venue: "Olympiastadion", city: "Munich", country: "Germany", price: 130, tickets: 95 },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <SEOHead 
        title="Guns N Roses Tour 2026 Tickets - European Stadium Tour Berlin London"
        description="Buy Guns N Roses 2026 European tour tickets from €95. Stadium shows - Berlin, London Tottenham, Hamburg, Cologne, Munich. Sweet Child O Mine live!"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-red-500/10 to-zinc-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 font-medium">Legendary Rock Tour 2026!</span>
          </div>
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 mb-6">
            <Skull className="w-4 h-4 mr-2" />Stadium Rock
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Guns N Roses
            <span className="block text-2xl md:text-3xl mt-2 bg-gradient-to-r from-cyan-400 via-red-400 to-cyan-400 bg-clip-text text-transparent">European Stadium Tour 2026</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">The most dangerous band in the world returns! Axl, Slash & Duff bring the ultimate rock n roll experience to European stadiums.</p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full"><Calendar className="w-5 h-5 text-cyan-400" /><span>June - July 2026</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full"><MapPin className="w-5 h-5 text-cyan-400" /><span>8 Stadium Shows</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full"><Users className="w-5 h-5 text-cyan-400" /><span>3+ Hour Sets</span></div>
          </div>
          <div className="inline-block bg-zinc-900/80 border border-white/10 rounded-2xl p-6">
            <div className="text-zinc-400 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-white">€95</div>
            <div className="text-emerald-400 text-sm mt-1">Verified</div>
          </div>
        </div>
      </section>

      <section className="py-6 border-y border-white/5 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-emerald-400"><Shield className="w-5 h-5" /><span>100% Verified</span></div>
            <div className="flex items-center gap-2 text-emerald-400"><Star className="w-5 h-5" /><span>Money-Back Guarantee</span></div>
            <div className="flex items-center gap-2 text-emerald-400"><TrendingUp className="w-5 h-5" /><span>9,800+ Sold</span></div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Guns N Roses 2026 European Dates</h2>
          <div className="grid gap-4">
            {shows.map((show, i) => (
              <Link key={i} to="/events?type=concert" className="group flex flex-col md:flex-row md:items-center justify-between bg-zinc-900/50 border border-white/5 hover:border-cyan-500/30 rounded-2xl p-6 transition-all">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-14 h-14 bg-cyan-500/20 rounded-xl flex items-center justify-center"><Music className="w-7 h-7 text-cyan-400" /></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold group-hover:text-cyan-400">{show.venue}</h3>
                      {show.hot && <Badge className="bg-red-500/20 text-red-400 text-xs animate-pulse">HOT</Badge>}
                    </div>
                    <p className="text-zinc-500 text-sm">{show.date} - {show.city}, {show.country}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-emerald-400 text-sm">{show.tickets} left</span>
                  <div className="text-right"><div className="text-xs text-zinc-500">From</div><div className="text-xl font-bold text-cyan-400">€{show.price}</div></div>
                  <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold">Buy</Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Guns N Roses European Tour 2026</h2>
          <div className="prose prose-invert max-w-none text-zinc-400">
            <p><strong>Guns N Roses</strong> - Axl Rose, Slash, and Duff McKagan - return to Europe for their 2026 stadium tour. Expect epic 3+ hour shows!</p>
            <h3 className="text-white">Setlist Highlights</h3>
            <p>Sweet Child O Mine, Paradise City, Welcome to the Jungle, November Rain, Patience, Knockin on Heavens Door, and more classics!</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GunsNRosesPage;
