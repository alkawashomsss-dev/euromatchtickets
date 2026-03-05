import { Link } from "react-router-dom";
import { Calendar, MapPin, Trophy, Star, Shield, Users, TrendingUp, Zap, Flag, Ticket } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";

const ZandvoortGPPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": "Dutch Grand Prix 2026 Zandvoort",
    "description": "Buy Dutch Grand Prix 2026 tickets at Circuit Zandvoort. Max Verstappen home race. General admission, grandstand, hospitality tickets.",
    "startDate": "2026-08-30",
    "location": {
      "@type": "Place",
      "name": "Circuit Zandvoort",
      "address": "Zandvoort, Netherlands"
    },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "189" }
  };

  const tickets = [
    { section: "General Admission", price: 189, originalPrice: 199, available: 156, popular: false },
    { section: "Eastside Grandstand", price: 389, originalPrice: 399, available: 67, popular: true },
    { section: "Main Grandstand", price: 489, originalPrice: 499, available: 45, popular: true },
    { section: "Arie Luyendyk Grandstand", price: 349, originalPrice: 359, available: 89, popular: false },
    { section: "VIP Hospitality", price: 1489, originalPrice: 1499, available: 23, popular: true },
    { section: "Paddock Club", price: 4489, originalPrice: 4499, available: 8, popular: false },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <SEOHead 
        title="Dutch Grand Prix Tickets 2026 - Zandvoort F1 Tickets | Max Verstappen Home Race"
        description="Buy Dutch Grand Prix 2026 Zandvoort tickets from €189. Max Verstappen's home race! Orange army atmosphere. General admission, grandstand, VIP. €10 cheaper than F1.com!"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/30 via-zinc-900 to-zinc-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 mb-6">
            <Trophy className="w-4 h-4 mr-2" />Max Verstappen's Home Race! 🧡
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Dutch Grand Prix 2026
            <span className="block text-2xl md:text-3xl mt-2 text-zinc-400">Circuit Zandvoort • Netherlands</span>
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
            Join the Orange Army at Max's home! The incredible banked corners and seaside atmosphere. 
            <strong className="text-emerald-400"> €10 cheaper than competitors!</strong>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full">
              <Calendar className="w-5 h-5 text-orange-400" /><span>August 28-30, 2026</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full">
              <MapPin className="w-5 h-5 text-orange-400" /><span>Zandvoort, NL</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full">
              <Users className="w-5 h-5 text-orange-400" /><span>Orange Army!</span>
            </div>
          </div>

          <div className="inline-block bg-zinc-900/80 border border-emerald-500/30 rounded-2xl p-6">
            <div className="text-zinc-400 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-emerald-400">€189</div>
            <div className="text-emerald-400 text-sm mt-1">Save €10 vs competitors</div>
          </div>
        </div>
      </section>

      <section className="py-6 border-y border-white/5 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-emerald-400"><Shield className="w-5 h-5" /><span>100% Buyer Protection</span></div>
            <div className="flex items-center gap-2 text-emerald-400"><Star className="w-5 h-5" /><span>Verified Tickets</span></div>
            <div className="flex items-center gap-2 text-emerald-400"><TrendingUp className="w-5 h-5" /><span>€10 Cheaper</span></div>
            <div className="flex items-center gap-2 text-emerald-400"><Zap className="w-5 h-5" /><span>Instant Delivery</span></div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Zandvoort F1 2026 Tickets</h2>
          <div className="grid gap-4">
            {tickets.map((ticket, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between bg-zinc-900/50 border border-white/5 hover:border-orange-500/30 rounded-2xl p-6 transition-all">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center">
                    <Ticket className="w-7 h-7 text-orange-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{ticket.section}</h3>
                      {ticket.popular && <Badge className="bg-orange-500/20 text-orange-400 text-xs">HOT</Badge>}
                    </div>
                    <p className="text-zinc-500 text-sm">Dutch Grand Prix 2026 • 3-Day Pass</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-emerald-400 text-sm">{ticket.available} left</span>
                  <div className="text-right">
                    <div className="text-xs text-zinc-500 line-through">€{ticket.originalPrice}</div>
                    <div className="text-xl font-bold text-emerald-400">€{ticket.price}</div>
                  </div>
                  <Link to="/events?type=f1"><Button className="bg-orange-500 hover:bg-orange-600">Buy Now</Button></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-lg font-bold mb-4">Related Searches:</h3>
          <div className="flex flex-wrap gap-2">
            {["Dutch GP tickets", "Zandvoort F1 tickets", "Max Verstappen home race", "F1 Netherlands tickets", 
              "Zandvoort 2026", "Orange army F1", "Dutch Grand Prix 2026", "Zandvoort grandstand"].map((term, i) => (
              <span key={i} className="px-3 py-1 bg-zinc-800/50 text-zinc-400 rounded-full text-sm">{term}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-orange-900/30 to-red-900/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Orange Army! 🧡</h2>
          <p className="text-zinc-400 mb-8">Max Verstappen's home Grand Prix - The best atmosphere in F1</p>
          <Link to="/events?type=f1">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 px-8">
              <Ticket className="w-5 h-5 mr-2" />Buy Zandvoort Tickets
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ZandvoortGPPage;
