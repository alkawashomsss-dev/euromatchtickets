import { Link } from "react-router-dom";
import { Calendar, MapPin, Trophy, Star, Shield, Users, TrendingUp, Zap, Flag, Ticket } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
import ProductSchema from "../components/ProductSchema";

const SilverstoneGPPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": "British Grand Prix 2026 Silverstone",
    "description": "Buy British Grand Prix 2026 tickets at Silverstone. Home of British motorsport. General admission, grandstand and hospitality tickets.",
    "startDate": "2026-07-05",
    "endDate": "2026-07-06",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": "https://euromatchtickets.com/logo-192.png",
    "location": {
      "@type": "Place",
      "name": "Silverstone Circuit",
      "address": { "@type": "PostalAddress", "addressLocality": "Silverstone", "addressCountry": "GB" }
    },
    "performer": {"@type": "SportsTeam", "name": "Formula 1 - FIA"},
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR",
              "offerCount": "100", "lowPrice": "149", "highPrice": "2499", "availability": "https://schema.org/InStock", "url": "https://euromatchtickets.com/f1-british-grand-prix-silverstone-tickets", "validFrom": "2025-01-01" }
  };

  const tickets = [
    { section: "General Admission", price: 149, originalPrice: 159, available: 234, popular: false },
    { section: "Grandstand (Copse)", price: 289, originalPrice: 299, available: 89, popular: true },
    { section: "Grandstand (Club)", price: 349, originalPrice: 359, available: 67, popular: true },
    { section: "Grandstand (Maggotts)", price: 269, originalPrice: 279, available: 112, popular: false },
    { section: "VIP Hospitality", price: 1289, originalPrice: 1299, available: 34, popular: true },
    { section: "Paddock Club", price: 3989, originalPrice: 3999, available: 12, popular: false },
  ];

  return (
    <div className="min-h-screen bg-[#0e0e14]">
      <SEOHead 
        title="British GP Tickets 2026 | Silverstone F1 Prices"
        description="Buy British Grand Prix 2026 Silverstone tickets from €149. Best grandstands Copse, Club, Maggotts. VIP Hospitality available. 100% Buyer Protection. €10."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ProductSchema name="British Grand Prix Silverstone 2026" price={149} highPrice={3499} url="https://euromatchtickets.com/f1-british-grand-prix-silverstone-tickets" category="f1" venue="Silverstone Circuit" city="Silverstone" />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/12801/pexels-photo-12801.jpeg')] opacity-15 bg-cover bg-center" />
        
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-200 rounded-full px-4 py-2 mb-6">
            <Trophy className="w-4 h-4 text-blue-600" />
            <span className="text-blue-600 font-medium">Home of British Motorsport</span>
          </div>
          
          <Badge className="bg-[#e10600]/10 text-red-600 border-red-200 mb-6">
            <Flag className="w-4 h-4 mr-2" />Formula 1® World Championship
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            British Grand Prix 2026
            <span className="block text-2xl md:text-3xl mt-2 text-slate-500">Silverstone Circuit • United Kingdom</span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-3xl mx-auto mb-8">
            The legendary Silverstone - birthplace of Formula 1. Experience Copse, Maggotts-Becketts, 
            and the incredible British fans. <strong className="text-emerald-600">€10 cheaper than competitors!</strong>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>July 3-5, 2026</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>Silverstone, UK</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full">
              <Users className="w-5 h-5 text-blue-600" />
              <span>5.891 km Circuit</span>
            </div>
          </div>

          <div className="inline-block bg-white/90 border border-emerald-200 rounded-none p-6">
            <div className="text-slate-500 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-emerald-600">€149</div>
            <div className="text-emerald-600 text-sm mt-1">Save €10 vs F1.com & StubHub</div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
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

      {/* Tickets */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Silverstone F1 2026 Tickets</h2>
          <div className="grid gap-4">
            {tickets.map((ticket, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between bg-[#1e1e1e] border border-white/5 hover:border-blue-200 rounded-none p-6 transition-all">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-14 h-14 bg-blue-500/10 rounded-none flex items-center justify-center">
                    <Ticket className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{ticket.section}</h3>
                      {ticket.popular && <Badge className="bg-orange-500/10 text-orange-600 text-xs">POPULAR</Badge>}
                    </div>
                    <p className="text-slate-400 text-sm">British Grand Prix 2026 • 3-Day Pass</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-emerald-600 text-sm">{ticket.available} left</span>
                  <div className="text-right">
                    <div className="text-xs text-slate-400 line-through">€{ticket.originalPrice}</div>
                    <div className="text-xl font-bold text-emerald-600">€{ticket.price}</div>
                  </div>
                  <Link to="/checkout?event=silverstone-grand-prix-2026">
                    <Button className="bg-blue-500/100 hover:bg-blue-600">Buy Now</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 bg-[#15151e]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">About British Grand Prix at Silverstone</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-500 mb-4">
              The <strong>British Grand Prix at Silverstone</strong> is one of the most iconic races in Formula 1 history. 
              As the venue for the first-ever F1 World Championship race in 1950, Silverstone holds a special place 
              in motorsport history.
            </p>
            <p className="text-slate-500 mb-4">
              <strong>Silverstone Circuit</strong> features legendary corners like Copse, Maggotts-Becketts, and Stowe. 
              The British fans create an electric atmosphere, especially when cheering for home heroes.
            </p>
            <h3 className="text-xl font-bold text-white mt-6 mb-3">Best Grandstands at Silverstone:</h3>
            <ul className="text-slate-500 space-y-2">
              <li>• <strong>Copse Corner</strong> - High-speed right-hander with great overtaking</li>
              <li>• <strong>Club Corner</strong> - Near the podium and pit exit</li>
              <li>• <strong>Maggotts-Becketts</strong> - The most spectacular corners in F1</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Related Keywords */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-lg font-bold mb-4">Related Searches:</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "Silverstone F1 tickets", "British GP tickets", "British Grand Prix 2026",
              "Silverstone tickets", "F1 Silverstone", "Silverstone grandstand",
              "British GP hospitality", "Silverstone camping", "Silverstone VIP",
              "buy Silverstone tickets", "UK F1 tickets", "F1 UK 2026"
            ].map((term, i) => (
              <span key={i} className="px-3 py-1 bg-[#15151e] text-slate-500 rounded-full text-sm">
                {term}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-900/30 to-red-900/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Experience Silverstone 2026!</h2>
          <p className="text-slate-500 mb-8">Join 400,000 fans at the home of British motorsport</p>
          <Link to="/checkout?event=silverstone-grand-prix-2026">
            <Button size="lg" className="bg-blue-500/100 hover:bg-blue-600 px-8">
              <Ticket className="w-5 h-5 mr-2" />
              Buy Silverstone Tickets
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SilverstoneGPPage;
