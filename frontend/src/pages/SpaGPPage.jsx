import { Link } from "react-router-dom";
import { Calendar, MapPin, Trophy, Star, Shield, Users, TrendingUp, Zap, Flag, Ticket } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";

const SpaGPPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": "Belgian Grand Prix 2026 Spa-Francorchamps",
    "description": "Buy Belgian Grand Prix 2026 tickets at Spa-Francorchamps. Eau Rouge, Raidillon. VIP Hospitality and grandstand tickets available.",
    "startDate": "2026-08-30",
    "endDate": "2026-08-31",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": "https://euromatchtickets.com/logo.png",
    "location": {
      "@type": "Place",
      "name": "Circuit de Spa-Francorchamps",
      "address": { "@type": "PostalAddress", "addressLocality": "Spa", "addressCountry": "BE" }
    },
    "performer": {"@type": "SportsTeam", "name": "Formula 1 - FIA"},
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "109", "highPrice": "1499", "availability": "https://schema.org/InStock", "url": "https://euromatchtickets.com/f1-belgian-grand-prix-spa-tickets", "validFrom": "2025-01-01" }
  };

  const tickets = [
    { section: "General Admission", price: 109, originalPrice: 119, available: 345, popular: false },
    { section: "Gold 3 (Eau Rouge)", price: 259, originalPrice: 269, available: 89, popular: true },
    { section: "Gold 4 (Raidillon)", price: 289, originalPrice: 299, available: 67, popular: true },
    { section: "Silver (La Source)", price: 189, originalPrice: 199, available: 134, popular: false },
    { section: "VIP Hospitality", price: 1189, originalPrice: 1199, available: 38, popular: true },
    { section: "Paddock Club", price: 3489, originalPrice: 3499, available: 14, popular: false },
  ];

  return (
    <div className="min-h-screen bg-[hsl(210,20%,98%)]">
      <SEOHead 
        title="Belgian GP Tickets 2026 | Spa F1 Eau Rouge"
        description="Buy Belgian Grand Prix 2026 Spa-Francorchamps tickets from €109. Legendary Eau Rouge & Raidillon! General admission, grandstand, VIP. 100% Buyer."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/30 via-slate-900 to-slate-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <Badge className="bg-yellow-500/20 text-amber-600 border-yellow-500/30 mb-6">
            <Trophy className="w-4 h-4 mr-2" />The Legendary Spa-Francorchamps
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Belgian Grand Prix 2026
            <span className="block text-2xl md:text-3xl mt-2 text-slate-500">Spa-Francorchamps • Belgium</span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-3xl mx-auto mb-8">
            The most challenging circuit in F1. Eau Rouge, Raidillon, and the unpredictable Ardennes weather. 
            <strong className="text-emerald-600"> €10 cheaper than competitors!</strong>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
              <Calendar className="w-5 h-5 text-amber-600" /><span>August 28-30, 2026</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
              <MapPin className="w-5 h-5 text-amber-600" /><span>Spa, Belgium</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
              <Users className="w-5 h-5 text-amber-600" /><span>7.004 km Circuit</span>
            </div>
          </div>

          <div className="inline-block bg-white/90 border border-emerald-200 rounded-2xl p-6">
            <div className="text-slate-500 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-emerald-600">€109</div>
            <div className="text-emerald-600 text-sm mt-1">Save €10 vs competitors</div>
          </div>
        </div>
      </section>

      <section className="py-6 border-y border-slate-100 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-emerald-600"><Shield className="w-5 h-5" /><span>100% Buyer Protection</span></div>
            <div className="flex items-center gap-2 text-emerald-600"><Star className="w-5 h-5" /><span>Verified Tickets</span></div>
            <div className="flex items-center gap-2 text-emerald-600"><TrendingUp className="w-5 h-5" /><span>€10 Cheaper</span></div>
            <div className="flex items-center gap-2 text-emerald-600"><Zap className="w-5 h-5" /><span>Instant Delivery</span></div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Spa F1 2026 Tickets</h2>
          <div className="grid gap-4">
            {tickets.map((ticket, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between bg-white border border-slate-100 hover:border-yellow-500/30 rounded-2xl p-6 transition-all">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-14 h-14 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                    <Ticket className="w-7 h-7 text-amber-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{ticket.section}</h3>
                      {ticket.popular && <Badge className="bg-orange-50 text-orange-600 text-xs">POPULAR</Badge>}
                    </div>
                    <p className="text-slate-400 text-sm">Belgian Grand Prix 2026 • 3-Day Pass</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-emerald-600 text-sm">{ticket.available} left</span>
                  <div className="text-right">
                    <div className="text-xs text-slate-400 line-through">€{ticket.originalPrice}</div>
                    <div className="text-xl font-bold text-emerald-600">€{ticket.price}</div>
                  </div>
                  <Link to="/events?type=f1"><Button className="bg-yellow-500 hover:bg-yellow-600 text-black">Buy Now</Button></Link>
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
            {["Spa F1 tickets", "Belgian GP tickets", "Spa-Francorchamps tickets", "Eau Rouge grandstand", 
              "F1 Belgium", "Spa F1 2026", "Raidillon tickets", "Belgian Grand Prix 2026"].map((term, i) => (
              <span key={i} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-sm">{term}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-yellow-900/30 to-red-900/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Conquer Eau Rouge at Spa 2026!</h2>
          <p className="text-slate-500 mb-8">The most legendary corner in motorsport</p>
          <Link to="/events?type=f1">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black px-8">
              <Ticket className="w-5 h-5 mr-2" />Buy Spa Tickets
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SpaGPPage;
