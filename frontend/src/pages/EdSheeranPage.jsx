import { Link } from "react-router-dom";
import { Calendar, MapPin, Music, Star, Shield, Users, TrendingUp, Zap, Guitar } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";

const EdSheeranPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    "name": "Ed Sheeran Mathematics Tour 2026",
    "description": "Buy Ed Sheeran 2026 tour tickets. Mathematics Tour European stadium dates.",
    "startDate": "2026-05-01",
    "performer": { "@type": "MusicGroup", "name": "Ed Sheeran" },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "85" }
  };

  const shows = [
    { date: "May 15-16, 2026", venue: "Wembley Stadium", city: "London", price: 145, tickets: 67 },
    { date: "May 22-23, 2026", venue: "Croke Park", city: "Dublin", price: 125, tickets: 89, hot: true },
    { date: "May 29-30, 2026", venue: "Stade de France", city: "Paris", price: 135, tickets: 54 },
    { date: "Jun 5-6, 2026", venue: "Olympiastadion", city: "Berlin", price: 115, tickets: 78 },
    { date: "Jun 12-13, 2026", venue: "Johan Cruijff Arena", city: "Amsterdam", price: 125, tickets: 62, hot: true },
    { date: "Jun 19-20, 2026", venue: "San Siro", city: "Milan", price: 110, tickets: 95 },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <SEOHead 
        title="Ed Sheeran Tour 2026 Tickets - Mathematics Tour Europe Stadium"
        description="Buy Ed Sheeran 2026 tour tickets from €85. Mathematics Tour - London, Dublin, Paris, Berlin, Amsterdam. Shape of You, Perfect live! Verified tickets."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-zinc-900 to-zinc-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-orange-400" />
            <span className="text-orange-400 font-medium">Stadium Tour 2026 - Book Early!</span>
          </div>
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 mb-6">
            <Music className="w-4 h-4 mr-2" />Mathematics Tour
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Ed Sheeran
            <span className="block text-2xl md:text-3xl mt-2 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">+ - = ÷ x Tour 2026</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">The worlds biggest pop star returns! Ed Sheeran brings his incredible one-man show to stadiums across Europe. Just Ed, his guitar, and loop pedal magic.</p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full"><Calendar className="w-5 h-5 text-orange-400" /><span>May - June 2026</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full"><MapPin className="w-5 h-5 text-orange-400" /><span>12 Stadium Shows</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full"><Users className="w-5 h-5 text-orange-400" /><span>One Man Show</span></div>
          </div>
          <div className="inline-block bg-zinc-900/80 border border-white/10 rounded-2xl p-6">
            <div className="text-zinc-400 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-white">€85</div>
            <div className="text-emerald-400 text-sm mt-1">Verified</div>
          </div>
        </div>
      </section>

      <section className="py-6 border-y border-white/5 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-emerald-400"><Shield className="w-5 h-5" /><span>100% Verified</span></div>
            <div className="flex items-center gap-2 text-emerald-400"><Star className="w-5 h-5" /><span>Money-Back Guarantee</span></div>
            <div className="flex items-center gap-2 text-emerald-400"><TrendingUp className="w-5 h-5" /><span>18,000+ Sold</span></div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Ed Sheeran 2026 European Dates</h2>
          <div className="grid gap-4">
            {shows.map((show, i) => (
              <Link key={i} to="/events?type=concert" className="group flex flex-col md:flex-row md:items-center justify-between bg-zinc-900/50 border border-white/5 hover:border-orange-500/30 rounded-2xl p-6 transition-all">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center"><Music className="w-7 h-7 text-orange-400" /></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold group-hover:text-orange-400">{show.venue}</h3>
                      {show.hot && <Badge className="bg-green-500/20 text-green-400 text-xs">GOOD AVAILABILITY</Badge>}
                    </div>
                    <p className="text-zinc-500 text-sm">{show.date} - {show.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-emerald-400 text-sm">{show.tickets} left</span>
                  <div className="text-right"><div className="text-xs text-zinc-500">From</div><div className="text-xl font-bold text-orange-400">€{show.price}</div></div>
                  <Button className="bg-orange-500 hover:bg-orange-600">Buy</Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Ed Sheeran Mathematics Tour 2026</h2>
          <div className="prose prose-invert max-w-none text-zinc-400">
            <p><strong>Ed Sheeran</strong> returns to Europe with his legendary stadium tour. Watch as he fills entire stadiums with just his voice, guitar, and loop pedal.</p>
            <h3 className="text-white">Expected Setlist</h3>
            <p>Shape of You, Perfect, Thinking Out Loud, Castle on the Hill, Bad Habits, Shivers, Photograph, and many more hits!</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EdSheeranPage;
