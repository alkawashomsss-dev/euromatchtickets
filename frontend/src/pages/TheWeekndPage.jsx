import { Link } from "react-router-dom";
import { Calendar, MapPin, Ticket, Music, Star, Shield, Users, TrendingUp, Zap } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";

const TheWeekndPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    "name": "The Weeknd After Hours Til Dawn Tour 2026",
    "description": "Buy The Weeknd 2026 tour tickets. After Hours Til Dawn European stadium tour. Blinding Lights, Save Your Tears live.",
    "startDate": "2026-06-11",
    "performer": { "@type": "MusicGroup", "name": "The Weeknd" },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "95" }
  };

  const shows = [
    { date: "Jun 11, 2026", venue: "Stade de France", city: "Paris", price: 125, tickets: 89 },
    { date: "Jun 15, 2026", venue: "Wembley Stadium", city: "London", price: 145, tickets: 56, hot: true },
    { date: "Jun 20, 2026", venue: "Olympiastadion", city: "Berlin", price: 115, tickets: 72 },
    { date: "Jun 25, 2026", venue: "Johan Cruijff Arena", city: "Amsterdam", price: 135, tickets: 41, hot: true },
    { date: "Jul 2, 2026", venue: "San Siro", city: "Milan", price: 110, tickets: 95 },
    { date: "Jul 8, 2026", venue: "Estadio Metropolitano", city: "Madrid", price: 105, tickets: 83 },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <SEOHead 
        title="The Weeknd Tour 2026 Tickets - After Hours Til Dawn Europe"
        description="Buy The Weeknd 2026 European tour tickets from €95. After Hours Til Dawn stadium tour. Paris, London, Berlin, Amsterdam. Blinding Lights live! 100% verified."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-zinc-900 to-zinc-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-2 mb-6 animate-pulse">
            <Zap className="w-4 h-4 text-red-400" />
            <span className="text-red-400 font-medium">2026 Tour Announced - Get Tickets Early!</span>
          </div>
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 mb-6">
            <Music className="w-4 h-4 mr-2" />Stadium World Tour
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            The Weeknd
            <span className="block text-2xl md:text-3xl mt-2 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">After Hours Til Dawn Tour 2026</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">Experience the most spectacular concert production ever! Blinding Lights, Save Your Tears, Starboy - all your favorites LIVE in stadiums across Europe.</p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full"><Calendar className="w-5 h-5 text-red-400" /><span>June - September 2026</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full"><MapPin className="w-5 h-5 text-red-400" /><span>12 European Cities</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full"><Users className="w-5 h-5 text-red-400" /><span>Stadium Shows</span></div>
          </div>
          <div className="inline-block bg-zinc-900/80 border border-white/10 rounded-2xl p-6">
            <div className="text-zinc-400 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-white">€95</div>
            <div className="text-emerald-400 text-sm mt-1">100% Verified</div>
          </div>
        </div>
      </section>

      <section className="py-6 border-y border-white/5 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-emerald-400"><Shield className="w-5 h-5" /><span>100% Verified</span></div>
            <div className="flex items-center gap-2 text-emerald-400"><Star className="w-5 h-5" /><span>Money-Back Guarantee</span></div>
            <div className="flex items-center gap-2 text-emerald-400"><TrendingUp className="w-5 h-5" /><span>6,200+ Sold</span></div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">The Weeknd 2026 European Tour Dates</h2>
          <div className="grid gap-4">
            {shows.map((show, i) => (
              <Link key={i} to="/events?type=concert" className="group flex flex-col md:flex-row md:items-center justify-between bg-zinc-900/50 border border-white/5 hover:border-red-500/30 rounded-2xl p-6 transition-all">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-14 h-14 bg-red-500/20 rounded-xl flex items-center justify-center"><Music className="w-7 h-7 text-red-400" /></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold group-hover:text-red-400">{show.venue}</h3>
                      {show.hot && <Badge className="bg-orange-500/20 text-orange-400 text-xs animate-pulse">SELLING FAST</Badge>}
                    </div>
                    <p className="text-zinc-500 text-sm">{show.date} - {show.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-orange-400 text-sm">{show.tickets} left</span>
                  <div className="text-right"><div className="text-xs text-zinc-500">From</div><div className="text-xl font-bold text-red-400">€{show.price}</div></div>
                  <Button className="bg-red-500 hover:bg-red-600">Buy</Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">The Weeknd After Hours Til Dawn Tour 2026</h2>
          <div className="prose prose-invert max-w-none text-zinc-400">
            <p><strong>The Weeknd</strong> brings his record-breaking <strong>After Hours Til Dawn Tour</strong> to Europe in 2026. Experience the most visually stunning concert production ever created.</p>
            <h3 className="text-white">Expected Setlist</h3>
            <p>Blinding Lights, Save Your Tears, Starboy, The Hills, Cant Feel My Face, Die For You, I Feel It Coming, Earned It, and new hits from upcoming album.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TheWeekndPage;
