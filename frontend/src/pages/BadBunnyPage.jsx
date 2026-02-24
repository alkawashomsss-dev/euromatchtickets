import { Link } from "react-router-dom";
import { Calendar, MapPin, Music, Star, Shield, Users, TrendingUp, Zap, Flame } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";

const BadBunnyPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    "name": "Bad Bunny DeBi TiRAR MaS FOToS Tour 2026",
    "description": "Buy Bad Bunny 2026 tour tickets. DeBi TiRAR MaS FOToS World Tour - London Tottenham Stadium.",
    "startDate": "2026-06-27",
    "performer": { "@type": "MusicGroup", "name": "Bad Bunny" },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "145" }
  };

  // Real confirmed dates
  const shows = [
    { date: "Jun 27, 2026", venue: "Tottenham Hotspur Stadium", city: "London", country: "UK", price: 175, tickets: 89, hot: true },
    { date: "Jun 28, 2026", venue: "Tottenham Hotspur Stadium", city: "London", country: "UK", price: 185, tickets: 56, hot: true },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <SEOHead 
        title="Bad Bunny London 2026 Tickets - DeBi TiRAR MaS FOToS Tour Tottenham"
        description="Buy Bad Bunny London 2026 tickets from €145. DeBi TiRAR MaS FOToS World Tour - Tottenham Hotspur Stadium June 27-28. El Conejo Malo live! Verified tickets."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-zinc-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-2 mb-6 animate-pulse">
            <Flame className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 font-medium">2 NIGHTS ONLY - London Stadium!</span>
          </div>
          <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30 mb-6">
            <Music className="w-4 h-4 mr-2" />World Tour
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Bad Bunny
            <span className="block text-2xl md:text-3xl mt-2 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">DeBi TiRAR MaS FOToS Tour 2026</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">El Conejo Malo brings his record-breaking tour to London! The biggest Latin artist in the world performs 2 stadium nights in the UK.</p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full"><Calendar className="w-5 h-5 text-purple-400" /><span>June 27-28, 2026</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full"><MapPin className="w-5 h-5 text-purple-400" /><span>Tottenham Stadium</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full"><Users className="w-5 h-5 text-purple-400" /><span>62,000 Capacity</span></div>
          </div>
          <div className="inline-block bg-zinc-900/80 border border-white/10 rounded-2xl p-6">
            <div className="text-zinc-400 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-white">€145</div>
            <div className="text-emerald-400 text-sm mt-1">Verified</div>
          </div>
        </div>
      </section>

      <section className="py-6 border-y border-white/5 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-emerald-400"><Shield className="w-5 h-5" /><span>100% Verified</span></div>
            <div className="flex items-center gap-2 text-emerald-400"><Star className="w-5 h-5" /><span>Money-Back Guarantee</span></div>
            <div className="flex items-center gap-2 text-emerald-400"><TrendingUp className="w-5 h-5" /><span>8,200+ Sold</span></div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Bad Bunny London 2026</h2>
          <div className="grid gap-4">
            {shows.map((show, i) => (
              <Link key={i} to="/events?type=concert" className="group flex flex-col md:flex-row md:items-center justify-between bg-zinc-900/50 border border-white/5 hover:border-purple-500/30 rounded-2xl p-6 transition-all">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center"><Music className="w-7 h-7 text-purple-400" /></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold group-hover:text-purple-400">{show.venue}</h3>
                      {show.hot && <Badge className="bg-red-500/20 text-red-400 text-xs animate-pulse">SELLING FAST</Badge>}
                    </div>
                    <p className="text-zinc-500 text-sm">{show.date} - {show.city}, {show.country}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-cyan-400 text-sm">{show.tickets} left</span>
                  <div className="text-right"><div className="text-xs text-zinc-500">From</div><div className="text-xl font-bold text-purple-400">€{show.price}</div></div>
                  <Button className="bg-purple-500 hover:bg-purple-600">Buy</Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Bad Bunny DeBi TiRAR MaS FOToS Tour 2026</h2>
          <div className="prose prose-invert max-w-none text-zinc-400">
            <p><strong>Bad Bunny</strong> is the most streamed artist in the world! His <strong>DeBi TiRAR MaS FOToS</strong> tour is breaking records globally, and now comes to London for 2 stadium nights.</p>
            <h3 className="text-white">Expected Hits</h3>
            <p>Titi Me Pregunto, Me Porto Bonito, Moscow Mule, Ojitos Lindos, Dakiti, Callaita, and tracks from his latest album!</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BadBunnyPage;
