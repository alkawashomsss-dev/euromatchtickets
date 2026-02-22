import { Link } from "react-router-dom";
import { Calendar, MapPin, Music, Star, Shield, Users, TrendingUp, Zap, Heart } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";

const BrunoMarsPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    "name": "Bruno Mars The Romantic Tour 2026",
    "description": "Buy Bruno Mars The Romantic Tour 2026 tickets. Official European stadium tour - Berlin, Amsterdam, Madrid, Milan, London Wembley.",
    "startDate": "2026-06-21",
    "performer": { "@type": "MusicGroup", "name": "Bruno Mars" },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "125" }
  };

  // Real confirmed dates from brunomars.com
  const shows = [
    { date: "Jun 21, 2026", venue: "Stade de France", city: "Paris", country: "France", price: 165, tickets: 89 },
    { date: "Jun 26-29, 2026", venue: "Olympiastadion", city: "Berlin", country: "Germany", nights: 3, price: 145, tickets: 156, hot: true },
    { date: "Jul 2-7, 2026", venue: "Johan Cruijff Arena", city: "Amsterdam", country: "Netherlands", nights: 4, price: 155, tickets: 203, hot: true },
    { date: "Jul 10-11, 2026", venue: "Riyadh Air Metropolitano", city: "Madrid", country: "Spain", nights: 2, price: 135, tickets: 134 },
    { date: "Jul 14-15, 2026", venue: "Stadio San Siro", city: "Milan", country: "Italy", nights: 2, price: 145, tickets: 98 },
    { date: "Jul 18-28, 2026", venue: "Wembley Stadium", city: "London", country: "UK", nights: 6, price: 185, tickets: 67, hot: true },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <SEOHead 
        title="Bruno Mars The Romantic Tour 2026 Tickets - Wembley, Berlin, Amsterdam"
        description="Buy Bruno Mars The Romantic Tour 2026 tickets. Official European stadium tour - 6 nights Wembley London, Berlin, Amsterdam, Madrid, Milan. Verified tickets from €125."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-rose-500/10 to-zinc-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 rounded-full px-4 py-2 mb-6 animate-pulse">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 font-medium">OFFICIAL TOUR - 6 Nights at Wembley!</span>
          </div>
          <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 mb-6">
            <Heart className="w-4 h-4 mr-2" />The Romantic Tour
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Bruno Mars
            <span className="block text-2xl md:text-3xl mt-2 bg-gradient-to-r from-amber-400 via-rose-400 to-pink-400 bg-clip-text text-transparent">The Romantic Tour Europe 2026</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">The king of pop is back! Bruno Mars brings his legendary live show to European stadiums. Uptown Funk, 24K Magic, Thats What I Like - the ultimate party!</p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full"><Calendar className="w-5 h-5 text-amber-400" /><span>June - July 2026</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full"><MapPin className="w-5 h-5 text-amber-400" /><span>6 Cities, 18 Shows</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full"><Users className="w-5 h-5 text-amber-400" /><span>Stadium Tour</span></div>
          </div>
          <div className="inline-block bg-zinc-900/80 border border-white/10 rounded-2xl p-6">
            <div className="text-zinc-400 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-white">€125</div>
            <div className="text-emerald-400 text-sm mt-1">Official Resale</div>
          </div>
        </div>
      </section>

      <section className="py-6 border-y border-white/5 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-emerald-400"><Shield className="w-5 h-5" /><span>100% Verified</span></div>
            <div className="flex items-center gap-2 text-emerald-400"><Star className="w-5 h-5" /><span>Money-Back Guarantee</span></div>
            <div className="flex items-center gap-2 text-emerald-400"><TrendingUp className="w-5 h-5" /><span>12,500+ Sold</span></div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Bruno Mars Europe 2026 - Official Dates</h2>
          <div className="grid gap-4">
            {shows.map((show, i) => (
              <Link key={i} to="/events?type=concert" className="group flex flex-col md:flex-row md:items-center justify-between bg-zinc-900/50 border border-white/5 hover:border-amber-500/30 rounded-2xl p-6 transition-all">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center"><Music className="w-7 h-7 text-amber-400" /></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold group-hover:text-amber-400">{show.venue}</h3>
                      {show.hot && <Badge className="bg-red-500/20 text-red-400 text-xs animate-pulse">HIGH DEMAND</Badge>}
                    </div>
                    <p className="text-zinc-500 text-sm">{show.date} - {show.city}, {show.country} {show.nights && <span className="text-amber-400">({show.nights} nights)</span>}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-emerald-400 text-sm">{show.tickets} available</span>
                  <div className="text-right"><div className="text-xs text-zinc-500">From</div><div className="text-xl font-bold text-amber-400">€{show.price}</div></div>
                  <Button className="bg-amber-500 hover:bg-amber-600 text-black font-bold">Buy Tickets</Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Bruno Mars The Romantic Tour 2026</h2>
          <div className="prose prose-invert max-w-none text-zinc-400">
            <p><strong>Bruno Mars</strong> announced <strong>The Romantic Tour</strong> for 2026, his biggest European tour ever! Including an incredible <strong>6 nights at Wembley Stadium</strong> in London.</p>
            <h3 className="text-white">What to Expect</h3>
            <ul>
              <li>Full live band with The Hooligans</li>
              <li>All the hits: Uptown Funk, 24K Magic, Locked Out of Heaven</li>
              <li>New songs from The Romantic album</li>
              <li>World-class choreography and production</li>
            </ul>
            <p className="text-amber-400 font-medium">This is an official tour announced on brunomars.com - tickets selling fast!</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BrunoMarsPage;
