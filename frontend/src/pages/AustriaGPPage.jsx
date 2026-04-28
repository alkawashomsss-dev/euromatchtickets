import { Link } from "react-router-dom";
import { Calendar, MapPin, Shield, Zap, Flag, Ticket, HelpCircle, CreditCard, Headphones } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
import BreadcrumbSchema from "../components/BreadcrumbSchema";

const AustriaGPPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": "Austrian Grand Prix 2026 Red Bull Ring",
    "description": "Buy Austrian Grand Prix 2026 tickets at Red Bull Ring Spielberg. General admission, grandstand and hospitality tickets available.",
    "startDate": "2026-07-05",
    "endDate": "2026-07-06",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": "https://euromatchtickets.com/logo-192.png",
    "location": { "@type": "Place", "name": "Red Bull Ring", "address": { "@type": "PostalAddress", "addressLocality": "Spielberg", "addressCountry": "AT" } },
    "performer": {"@type": "SportsTeam", "name": "Formula 1 - FIA"},
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    
  };

  const tickets = [
    { section: "General Admission", price: 119, originalPrice: 129, available: 456, popular: false },
    { section: "Steiermark Grandstand", price: 279, originalPrice: 289, available: 134, popular: true },
    { section: "Red Bull Grandstand", price: 349, originalPrice: 359, available: 89, popular: true },
    { section: "Start/Finish Grandstand", price: 299, originalPrice: 309, available: 112, popular: false },
    { section: "VIP Hospitality", price: 1089, originalPrice: 1099, available: 38, popular: true },
    { section: "Paddock Club", price: 3289, originalPrice: 3299, available: 15, popular: false }
  ];

  const faqs = [
    { q: "What's special about Red Bull Ring?", a: "Short, fast circuit in the Styrian mountains. Amazing atmosphere with the 'Orange Army' of Dutch fans!" },
    { q: "Are Austrian GP tickets mobile?", a: "Yes, instant mobile QR delivery. Print option also available." },
    { q: "Is there camping at Red Bull Ring?", a: "Yes! Multiple camping areas available. Book early - very popular with Dutch and Austrian fans." },
    { q: "How to get to Spielberg?", a: "Nearest airports are Graz (80km) and Vienna (200km). Shuttle buses available from both." }
  ];

  return (
    <div className="min-h-screen bg-[#0e0e14]">
      <SEOHead 
        title="Austrian GP 2026 Tickets (Red Bull Ring F1) — Prices & Availability | EuroMatchTickets"
        description="Compare Austrian Grand Prix 2026 listings at the Red Bull Ring, Spielberg. Updated prices from €119, mountain-circuit grandstands and VIP Hospitality availability. Instant QR delivery."
        image="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&h=630&fit=crop"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <BreadcrumbSchema items={[{ name: "Home", url: "https://euromatchtickets.com/" }, { name: "F1 Tickets", url: "https://euromatchtickets.com/f1-tickets" }, { name: "Austrian GP Red Bull Ring 2026", url: "https://euromatchtickets.com/f1-austrian-grand-prix-red-bull-ring-tickets" }]} />

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 via-slate-900 to-slate-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <Badge className="bg-[#e10600]/10 text-red-600 border-red-200 mb-6">
            <Flag className="w-4 h-4 mr-2" />Formula 1® Austrian Grand Prix
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Austrian Grand Prix 2026 Tickets
            <span className="block text-2xl md:text-3xl mt-2 text-slate-500">Red Bull Ring • Spielberg 🇦🇹</span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-3xl mx-auto mb-8">
            Racing in the Styrian Alps! Short, fast circuit with amazing mountain scenery.
            <strong className="text-emerald-600"> 100% Ticket Guarantee. €10 cheaper!</strong>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full">
              <Calendar className="w-5 h-5 text-red-600" /><span>July 3-5, 2026</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full">
              <MapPin className="w-5 h-5 text-red-600" /><span>Spielberg, Austria</span>
            </div>
          </div>

          <div className="inline-block bg-white/90 border border-emerald-200 rounded-none p-6">
            <div className="text-slate-500 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-emerald-600">€119</div>
          </div>
        </div>
      </section>

      <section className="py-6 border-y border-white/5 bg-[#15151e]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 justify-center text-emerald-600"><Shield className="w-5 h-5" /><span className="text-sm">100% Ticket Guarantee</span></div>
            <div className="flex items-center gap-2 justify-center text-emerald-600"><CreditCard className="w-5 h-5" /><span className="text-sm">Secure Checkout</span></div>
            <div className="flex items-center gap-2 justify-center text-emerald-600"><Zap className="w-5 h-5" /><span className="text-sm">QR delivery</span></div>
            <div className="flex items-center gap-2 justify-center text-emerald-600"><Headphones className="w-5 h-5" /><span className="text-sm">Customer support</span></div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Buy Red Bull Ring F1 2026 Tickets</h2>
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
                    <p className="text-slate-400 text-sm">Austrian Grand Prix 2026 • 3-Day Pass</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-emerald-600 text-sm">{ticket.available} left</span>
                  <div className="text-right">
                    <div className="text-xs text-slate-400 line-through">€{ticket.originalPrice}</div>
                    <div className="text-xl font-bold text-emerald-600">€{ticket.price}</div>
                  </div>
                  <Link to="/checkout?event=austria-grand-prix-2026"><Button className="bg-[#e10600]/100 hover:bg-red-600">View</Button></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#15151e]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2"><HelpCircle className="w-6 h-6 text-red-600" />FAQ - Austrian GP Tickets</h2>
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
            {["Austrian GP tickets", "Red Bull Ring tickets", "F1 Austria 2026", "Spielberg F1 tickets", "buy Austrian GP tickets", "Red Bull Ring F1", "Austria Grand Prix"].map((term, i) => (
              <span key={i} className="px-3 py-1 bg-[#15151e] text-slate-500 rounded-full text-sm">{term}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-red-900/30 to-yellow-900/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Experience F1 in the Alps!</h2>
          <p className="text-slate-500 mb-8">Stunning mountain scenery and epic racing</p>
          <Link to="/checkout?event=austria-grand-prix-2026"><Button size="lg" className="bg-[#e10600]/100 hover:bg-red-600 px-8"><Ticket className="w-5 h-5 mr-2" />Buy Austrian GP Tickets</Button></Link>
        </div>
      </section>
    </div>
  );
};

export default AustriaGPPage;
