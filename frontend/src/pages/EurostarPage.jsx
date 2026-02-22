import { Link } from "react-router-dom";
import { Calendar, MapPin, Train, Clock, Star, Shield, TrendingUp, Zap, Leaf, CreditCard } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";

const EurostarPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Eurostar Train Tickets",
    "description": "Buy Eurostar train tickets London to Paris, Brussels, Amsterdam. High-speed train travel across Europe.",
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "39" }
  };

  const routes = [
    { from: "London", to: "Paris", duration: "2h 16min", price: 49, frequency: "18/day", hot: true },
    { from: "London", to: "Brussels", duration: "2h", price: 39, frequency: "10/day" },
    { from: "London", to: "Amsterdam", duration: "3h 52min", price: 59, frequency: "5/day", hot: true },
    { from: "Paris", to: "London", duration: "2h 16min", price: 49, frequency: "18/day" },
    { from: "Paris", to: "Amsterdam", duration: "3h 20min", price: 55, frequency: "8/day" },
    { from: "Brussels", to: "London", duration: "2h", price: 39, frequency: "10/day" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <SEOHead 
        title="Eurostar Tickets 2026 - London Paris Brussels Amsterdam from €39"
        description="Buy Eurostar train tickets from €39. London to Paris in 2h16m, Brussels 2h, Amsterdam 4h. Book high-speed train tickets. Eco-friendly travel across Europe."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-zinc-900 to-zinc-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2 mb-6">
            <Leaf className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-medium">90% Less CO2 Than Flying!</span>
          </div>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mb-6">
            <Train className="w-4 h-4 mr-2" />High-Speed Rail
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Eurostar Tickets
            <span className="block text-2xl md:text-3xl mt-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">London - Paris - Brussels - Amsterdam</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">The fastest way to travel between London and Europe. City center to city center in comfort. No airport hassle, no hidden fees.</p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full"><Clock className="w-5 h-5 text-blue-400" /><span>London-Paris: 2h 16min</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full"><Train className="w-5 h-5 text-blue-400" /><span>Up to 300 km/h</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full"><CreditCard className="w-5 h-5 text-blue-400" /><span>Free WiFi Onboard</span></div>
          </div>
          <div className="inline-block bg-zinc-900/80 border border-white/10 rounded-2xl p-6">
            <div className="text-zinc-400 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-white">€39</div>
            <div className="text-emerald-400 text-sm mt-1">One Way</div>
          </div>
        </div>
      </section>

      <section className="py-6 border-y border-white/5 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-emerald-400"><Shield className="w-5 h-5" /><span>Official Tickets</span></div>
            <div className="flex items-center gap-2 text-emerald-400"><Star className="w-5 h-5" /><span>Flexible Changes</span></div>
            <div className="flex items-center gap-2 text-emerald-400"><TrendingUp className="w-5 h-5" /><span>25,000+ Booked</span></div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Popular Eurostar Routes</h2>
          <div className="grid gap-4">
            {routes.map((route, i) => (
              <Link key={i} to="/events?type=train" className="group flex flex-col md:flex-row md:items-center justify-between bg-zinc-900/50 border border-white/5 hover:border-blue-500/30 rounded-2xl p-6 transition-all">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center"><Train className="w-7 h-7 text-blue-400" /></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold group-hover:text-blue-400">{route.from} → {route.to}</h3>
                      {route.hot && <Badge className="bg-orange-500/20 text-orange-400 text-xs">POPULAR</Badge>}
                    </div>
                    <p className="text-zinc-500 text-sm">{route.duration} - {route.frequency}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right"><div className="text-xs text-zinc-500">From</div><div className="text-xl font-bold text-blue-400">€{route.price}</div></div>
                  <Button className="bg-blue-500 hover:bg-blue-600">Book</Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Buy Eurostar Train Tickets</h2>
          <div className="prose prose-invert max-w-none text-zinc-400">
            <p><strong>Eurostar</strong> is the high-speed train connecting <strong>London</strong> with <strong>Paris, Brussels, and Amsterdam</strong> through the Channel Tunnel.</p>
            <h3 className="text-white">Why Choose Eurostar?</h3>
            <ul>
              <li><strong>City Center to City Center</strong> - No airport transfers needed</li>
              <li><strong>Fast</strong> - London to Paris in just 2h 16min</li>
              <li><strong>Eco-Friendly</strong> - 90% less CO2 than flying</li>
              <li><strong>Comfortable</strong> - Spacious seats, free WiFi, onboard bistro</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EurostarPage;
