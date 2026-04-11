import { Link } from "react-router-dom";
import { Calendar, MapPin, Shield, Zap, Flag, Ticket, HelpCircle, CreditCard, Headphones } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";

const HungaryGPPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": "Hungarian Grand Prix 2026 Budapest",
    "description": "Buy Hungarian Grand Prix 2026 tickets at Hungaroring. General admission, grandstand and hospitality tickets available.",
    "startDate": "2026-07-26",
    "endDate": "2026-07-27",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": "https://euromatchtickets.com/logo.png",
    "location": { "@type": "Place", "name": "Hungaroring", "address": { "@type": "PostalAddress", "addressLocality": "Budapest", "addressCountry": "HU" } },
    "performer": {"@type": "SportsTeam", "name": "Formula 1 - FIA"},
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR",
              "offerCount": "100", "lowPrice": "99", "highPrice": "1499", "availability": "https://schema.org/InStock", "url": "https://euromatchtickets.com/f1-hungarian-grand-prix-budapest-tickets", "validFrom": "2025-01-01" }
  };

  const tickets = [
    { section: "General Admission", price: 99, originalPrice: 109, available: 678, popular: false },
    { section: "Silver 4 Grandstand", price: 199, originalPrice: 209, available: 189, popular: true },
    { section: "Gold 3 Grandstand", price: 279, originalPrice: 289, available: 112, popular: true },
    { section: "Super Gold", price: 349, originalPrice: 359, available: 78, popular: false },
    { section: "VIP Hospitality", price: 889, originalPrice: 899, available: 56, popular: true },
    { section: "Paddock Club", price: 2689, originalPrice: 2699, available: 22, popular: false },
  ];

  const faqs = [
    { q: "Is Hungaroring good for overtaking?", a: "The narrow, twisty circuit makes overtaking challenging, but Turn 1 and the main straight offer opportunities." },
    { q: "Are Hungarian GP tickets mobile?", a: "Yes, instant mobile QR delivery via email. Print option also available." },
    { q: "How to get to Hungaroring from Budapest?", a: "Special trains and buses run from Budapest during F1 weekend. The circuit is 20km northeast of the city." },
    { q: "What's the weather like in July?", a: "Expect hot weather, 30-35°C. Bring sunscreen, hat, and plenty of water!" },
  ];

  return (
    <div className="min-h-screen bg-[#0e0e14]">
      <SEOHead 
        title="Hungarian GP Tickets 2026 | Budapest F1 Prices"
        description="Buy Hungarian Grand Prix 2026 Budapest tickets from €99. Cheapest F1 race! Hungaroring circuit. VIP Hospitality. 100% Ticket Guarantee. Instant QR delivery!"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 via-slate-900 to-slate-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <Badge className="bg-[#e10600]/10 text-red-600 border-red-200 mb-6">
            <Flag className="w-4 h-4 mr-2" />Formula 1® Hungarian Grand Prix
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Hungarian Grand Prix 2026 Tickets
            <span className="block text-2xl md:text-3xl mt-2 text-slate-500">Hungaroring • Budapest 🇭🇺</span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-3xl mx-auto mb-8">
            The most affordable F1 race! Enjoy Budapest and world-class racing at the twisty Hungaroring.
            <strong className="text-emerald-600"> From just €99 - Cheapest F1 tickets!</strong>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full">
              <Calendar className="w-5 h-5 text-red-600" /><span>July 24-26, 2026</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full">
              <MapPin className="w-5 h-5 text-red-600" /><span>Budapest, Hungary</span>
            </div>
          </div>

          <div className="inline-block bg-white/90 border border-emerald-200 rounded-none p-6">
            <div className="text-slate-500 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-emerald-600">€99</div>
            <div className="text-emerald-600 text-sm mt-1">Cheapest F1 race 2026!</div>
          </div>
        </div>
      </section>

      <section className="py-6 border-y border-white/5 bg-[#15151e]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 justify-center text-emerald-600"><Shield className="w-5 h-5" /><span className="text-sm">100% Ticket Guarantee</span></div>
            <div className="flex items-center gap-2 justify-center text-emerald-600"><CreditCard className="w-5 h-5" /><span className="text-sm">Secure Checkout</span></div>
            <div className="flex items-center gap-2 justify-center text-emerald-600"><Zap className="w-5 h-5" /><span className="text-sm">Instant Delivery</span></div>
            <div className="flex items-center gap-2 justify-center text-emerald-600"><Headphones className="w-5 h-5" /><span className="text-sm">24/7 Support</span></div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Buy Hungaroring F1 2026 Tickets</h2>
          <div className="grid gap-4">
            {tickets.map((ticket, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between bg-[#1e1e1e] border border-white/5 hover:border-red-200 rounded-none p-6 transition-all">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-14 h-14 bg-[#e10600]/10 rounded-none flex items-center justify-center"><Ticket className="w-7 h-7 text-red-600" /></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{ticket.section}</h3>
                      {ticket.popular && <Badge className="bg-orange-500/10 text-orange-600 text-xs">POPULAR</Badge>}
                    </div>
                    <p className="text-slate-400 text-sm">Hungarian Grand Prix 2026 • 3-Day Pass</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-emerald-600 text-sm">{ticket.available} left</span>
                  <div className="text-right">
                    <div className="text-xs text-slate-400 line-through">€{ticket.originalPrice}</div>
                    <div className="text-xl font-bold text-emerald-600">€{ticket.price}</div>
                  </div>
                  <Link to="/events?type=f1"><Button className="bg-[#e10600]/100 hover:bg-red-600">Buy Now</Button></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#15151e]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2"><HelpCircle className="w-6 h-6 text-red-600" />FAQ - Hungarian GP Tickets</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#1e1e1e] border border-white/10 rounded-none p-6">
                <h3 className="font-bold text-white mb-2">{faq.q}</h3>
                <p className="text-slate-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-lg font-bold mb-4">Related Searches:</h3>
          <div className="flex flex-wrap gap-2">
            {["Hungarian GP tickets", "Budapest F1 tickets", "Hungaroring tickets", "F1 Hungary 2026", "cheap F1 tickets", "buy Hungarian GP tickets", "Budapest Grand Prix"].map((term, i) => (
              <span key={i} className="px-3 py-1 bg-[#15151e] text-slate-500 rounded-full text-sm">{term}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-red-900/30 to-green-900/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Best Budget F1 Experience!</h2>
          <p className="text-slate-500 mb-8">Combine F1 racing with beautiful Budapest</p>
          <Link to="/events?type=f1"><Button size="lg" className="bg-[#e10600]/100 hover:bg-red-600 px-8"><Ticket className="w-5 h-5 mr-2" />Buy Hungarian GP Tickets</Button></Link>
        </div>
      </section>
    </div>
  );
};

export default HungaryGPPage;
