import { Link } from "react-router-dom";
import { Calendar, MapPin, Music, Star, Shield, Users, TrendingUp, Zap, Heart } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";

const TaylorSwiftPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    "name": "Taylor Swift Eras Tour Europe 2026",
    "description": "Buy Taylor Swift Eras Tour 2026 tickets. Stadium shows across Europe. London, Paris, Madrid, Milan dates.",
    "startDate": "2026-06-01",
    "performer": { "@type": "MusicGroup", "name": "Taylor Swift" },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "150" }
  };

  const shows = [
    { date: "Jun 5-7, 2026", venue: "Wembley Stadium", city: "London", price: 285, tickets: 34, hot: true },
    { date: "Jun 12-13, 2026", venue: "Stade de France", city: "Paris", price: 245, tickets: 45, hot: true },
    { date: "Jun 18-19, 2026", venue: "Santiago Bernabeu", city: "Madrid", price: 225, tickets: 52 },
    { date: "Jun 25-26, 2026", venue: "San Siro", city: "Milan", price: 215, tickets: 67 },
    { date: "Jul 3-4, 2026", venue: "Olympiastadion", city: "Munich", price: 235, tickets: 41 },
    { date: "Jul 10-11, 2026", venue: "Johan Cruijff Arena", city: "Amsterdam", price: 255, tickets: 38, hot: true },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <SEOHead 
        title="Taylor Swift Eras Tour 2026 Europe Tickets - Wembley, Paris, Madrid"
        description="Buy Taylor Swift Eras Tour 2026 tickets from €150. European stadium tour - London Wembley, Paris, Madrid, Milan, Munich. 100% verified Swiftie tickets!"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-zinc-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-pink-500/20 border border-pink-500/30 rounded-full px-4 py-2 mb-6 animate-pulse">
            <Zap className="w-4 h-4 text-pink-400" />
            <span className="text-pink-400 font-medium">Record-Breaking Tour - Get Tickets Now!</span>
          </div>
          <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30 mb-6">
            <Heart className="w-4 h-4 mr-2" />The Eras Tour
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Taylor Swift
            <span className="block text-2xl md:text-3xl mt-2 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">The Eras Tour Europe 2026</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">Experience the biggest tour in music history! A 3+ hour journey through all of Taylor's musical eras. Lover, Folklore, 1989, Reputation & more!</p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full"><Calendar className="w-5 h-5 text-pink-400" /><span>June - July 2026</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full"><MapPin className="w-5 h-5 text-pink-400" /><span>12 Stadium Shows</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full"><Users className="w-5 h-5 text-pink-400" /><span>3+ Hours Show</span></div>
          </div>
          <div className="inline-block bg-zinc-900/80 border border-white/10 rounded-2xl p-6">
            <div className="text-zinc-400 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-white">€150</div>
            <div className="text-emerald-400 text-sm mt-1">100% Verified</div>
          </div>
        </div>
      </section>

      <section className="py-6 border-y border-white/5 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-emerald-400"><Shield className="w-5 h-5" /><span>Swiftie Verified</span></div>
            <div className="flex items-center gap-2 text-emerald-400"><Star className="w-5 h-5" /><span>Money-Back Guarantee</span></div>
            <div className="flex items-center gap-2 text-emerald-400"><TrendingUp className="w-5 h-5" /><span>25,000+ Sold</span></div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Taylor Swift Europe 2026 Dates</h2>
          <div className="grid gap-4">
            {shows.map((show, i) => (
              <Link key={i} to="/events?type=concert" className="group flex flex-col md:flex-row md:items-center justify-between bg-zinc-900/50 border border-white/5 hover:border-pink-500/30 rounded-2xl p-6 transition-all">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-14 h-14 bg-pink-500/20 rounded-xl flex items-center justify-center"><Music className="w-7 h-7 text-pink-400" /></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold group-hover:text-pink-400">{show.venue}</h3>
                      {show.hot && <Badge className="bg-red-500/20 text-red-400 text-xs animate-pulse">SELLING FAST</Badge>}
                    </div>
                    <p className="text-zinc-500 text-sm">{show.date} - {show.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-orange-400 text-sm">{show.tickets} left</span>
                  <div className="text-right"><div className="text-xs text-zinc-500">From</div><div className="text-xl font-bold text-pink-400">€{show.price}</div></div>
                  <Button className="bg-pink-500 hover:bg-pink-600">Buy</Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Taylor Swift Eras Tour 2026 Tickets</h2>
          <div className="prose prose-invert max-w-none text-zinc-400">
            <p>The <strong>Eras Tour</strong> is the highest-grossing concert tour of all time! Taylor Swift takes you through her entire musical journey spanning 17 years and 10 studio albums.</p>
            <h3 className="text-white">What to Expect</h3>
            <ul>
              <li>3+ hours of non-stop music</li>
              <li>44 songs across all eras</li>
              <li>Stunning stage production with multiple set changes</li>
              <li>Surprise songs every night</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TaylorSwiftPage;
