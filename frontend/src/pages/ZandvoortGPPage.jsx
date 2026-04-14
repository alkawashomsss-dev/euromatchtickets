import { Link } from "react-router-dom";
import { Calendar, MapPin, Trophy, Star, Shield, Users, TrendingUp, Zap, Flag, Ticket } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
import ProductSchema from "../components/ProductSchema";
import BreadcrumbSchema from "../components/BreadcrumbSchema";

const ZandvoortGPPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": "Dutch Grand Prix 2026 Zandvoort",
    "description": "Buy Dutch Grand Prix 2026 tickets at Circuit Zandvoort. Max Verstappen home race. General admission, grandstand, hospitality tickets.",
    "startDate": "2026-08-30",
    "endDate": "2026-08-31",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": "https://euromatchtickets.com/logo-192.png",
    "location": {
      "@type": "Place",
      "name": "Circuit Zandvoort",
      "address": { "@type": "PostalAddress", "addressLocality": "Zandvoort", "addressCountry": "NL" }
    },
    "performer": {"@type": "SportsTeam", "name": "Formula 1 - FIA"},
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR",
              "offerCount": "100", "lowPrice": "189", "highPrice": "2499", "availability": "https://schema.org/InStock", "url": "https://euromatchtickets.com/f1-dutch-grand-prix-zandvoort-tickets", "validFrom": "2025-01-01" }
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
    <div className="min-h-screen bg-[#0e0e14]">
      <SEOHead 
        title="Dutch GP Tickets 2026 | Zandvoort F1 Prices"
        description="Buy Dutch Grand Prix 2026 Zandvoort tickets from €189. Max Verstappen's home race! Orange army atmosphere. General admission, grandstand, VIP. €10 cheaper."
        image="https://images.unsplash.com/photo-1541447271487-09612b3f49f7?w=1200&h=630&fit=crop"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ProductSchema name="Dutch Grand Prix Zandvoort 2026" price={149} highPrice={2999} url="https://euromatchtickets.com/f1-dutch-grand-prix-zandvoort-tickets" category="f1" venue="Circuit Zandvoort" city="Zandvoort" />
      <BreadcrumbSchema items={[{ name: "Home", url: "https://euromatchtickets.com/" }, { name: "F1 Tickets", url: "https://euromatchtickets.com/f1-tickets" }, { name: "Dutch GP Zandvoort 2026", url: "https://euromatchtickets.com/f1-dutch-grand-prix-zandvoort-tickets" }]} />

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/30 via-slate-900 to-slate-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <Badge className="bg-orange-500/10 text-orange-600 border-orange-200 mb-6">
            <Trophy className="w-4 h-4 mr-2" />Max Verstappen's Home Race! 🧡
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Dutch Grand Prix 2026
            <span className="block text-2xl md:text-3xl mt-2 text-slate-500">Circuit Zandvoort • Netherlands</span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-3xl mx-auto mb-8">
            Join the Orange Army at Max's home! The incredible banked corners and seaside atmosphere. 
            <strong className="text-emerald-600"> €10 cheaper than competitors!</strong>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full">
              <Calendar className="w-5 h-5 text-orange-600" /><span>August 28-30, 2026</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full">
              <MapPin className="w-5 h-5 text-orange-600" /><span>Zandvoort, NL</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 rounded-full">
              <Users className="w-5 h-5 text-orange-600" /><span>Orange Army!</span>
            </div>
          </div>

          <div className="inline-block bg-white/90 border border-emerald-200 rounded-none p-6">
            <div className="text-slate-500 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-emerald-600">€189</div>
            <div className="text-emerald-600 text-sm mt-1">Save €10 vs competitors</div>
          </div>
        </div>
      </section>

      <section className="py-6 border-y border-white/5 bg-[#15151e]">
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
          <h2 className="text-3xl font-bold mb-8">Zandvoort F1 2026 Tickets</h2>
          <div className="grid gap-4">
            {tickets.map((ticket, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between bg-[#1e1e1e] border border-white/5 hover:border-orange-200 rounded-none p-6 transition-all">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-14 h-14 bg-orange-500/10 rounded-none flex items-center justify-center">
                    <Ticket className="w-7 h-7 text-orange-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{ticket.section}</h3>
                      {ticket.popular && <Badge className="bg-orange-500/10 text-orange-600 text-xs">HOT</Badge>}
                    </div>
                    <p className="text-slate-400 text-sm">Dutch Grand Prix 2026 • 3-Day Pass</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-emerald-600 text-sm">{ticket.available} left</span>
                  <div className="text-right">
                    <div className="text-xs text-slate-400 line-through">€{ticket.originalPrice}</div>
                    <div className="text-xl font-bold text-emerald-600">€{ticket.price}</div>
                  </div>
                  <Link to="/checkout?event=zandvoort-grand-prix-2026"><Button className="bg-orange-500/100 hover:bg-orange-600">Buy Now</Button></Link>
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
              <span key={i} className="px-3 py-1 bg-[#15151e] text-slate-500 rounded-full text-sm">{term}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-orange-900/30 to-red-900/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Orange Army! 🧡</h2>
          <p className="text-slate-500 mb-8">Max Verstappen's home Grand Prix - The best atmosphere in F1</p>
          <Link to="/checkout?event=zandvoort-grand-prix-2026">
            <Button size="lg" className="bg-orange-500/100 hover:bg-orange-600 px-8">
              <Ticket className="w-5 h-5 mr-2" />Buy Zandvoort Tickets
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ZandvoortGPPage;
