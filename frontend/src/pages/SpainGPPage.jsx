import { Link } from "react-router-dom";
import { Calendar, MapPin, Shield, Zap, Flag, Ticket, HelpCircle, CreditCard, Headphones } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
import BreadcrumbSchema from "../components/BreadcrumbSchema";

const SpainGPPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": "Spanish Grand Prix 2026 Barcelona",
    "description": "Buy Spanish Grand Prix 2026 tickets at Circuit de Barcelona-Catalunya. General admission, grandstand and hospitality tickets available.",
    "startDate": "2026-06-07",
    "endDate": "2026-06-08",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": "https://euromatchtickets.com/logo-192.png",
    "location": { "@type": "Place", "name": "Circuit de Barcelona-Catalunya", "address": { "@type": "PostalAddress", "addressLocality": "Barcelona", "addressCountry": "ES" } },
    "performer": {"@type": "SportsTeam", "name": "Formula 1 - FIA"},
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    "offers": {
      "@type": "Offer",
      "url": "https://euromatchtickets.com/f1-spanish-grand-prix-tickets",
      "price": "119",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "validFrom": "2026-05-01"
    }
  };

  const tickets = [
    { section: "General Admission", price: 119, originalPrice: 129, available: 567, popular: false },
    { section: "Grandstand G", price: 249, originalPrice: 259, available: 145, popular: true },
    { section: "Grandstand C (Turn 5)", price: 289, originalPrice: 299, available: 98, popular: true },
    { section: "Grandstand H", price: 229, originalPrice: 239, available: 167, popular: false },
    { section: "VIP Hospitality", price: 989, originalPrice: 999, available: 45, popular: true },
    { section: "Paddock Club", price: 2989, originalPrice: 2999, available: 18, popular: false }
  ];

  const faqs = [
    { q: "What's the best grandstand at Barcelona?", a: "Grandstand G offers excellent main straight views. Grandstand C at Turn 5 is great for overtaking action." },
    { q: "Are Barcelona F1 tickets mobile?", a: "Yes, instant mobile QR delivery. You can also print PDF tickets if preferred." },
    { q: "How hot is it for Spanish GP?", a: "June temperatures average 25-30°C. Bring sunscreen and plenty of water!" },
    { q: "Is there camping at Circuit de Barcelona?", a: "Yes, official campsite available near the circuit. Book early as it sells out!" }
  ];

  return (
    <div className="min-h-screen bg-[#0e0e14]">
      <SEOHead 
        title="Spanish GP 2026 Tickets (Barcelona F1) — Prices & Availability | EuroMatchTickets"
        description="Compare Spanish Grand Prix 2026 listings at Circuit de Barcelona-Catalunya. Updated prices from €119, Grandstand G, C, H and VIP Hospitality availability. Instant QR delivery."
        image="https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1200&h=630&fit=crop"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <BreadcrumbSchema items={[{ name: "Home", url: "https://euromatchtickets.com/" }, { name: "F1 Tickets", url: "https://euromatchtickets.com/f1-tickets" }, { name: "Spanish GP Barcelona 2026", url: "https://euromatchtickets.com/f1-spanish-grand-prix-barcelona-tickets" }]} />

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/30 via-slate-900 to-slate-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <Badge className="bg-yellow-500/20 text-amber-600 border-yellow-500/30 mb-6">
            <Flag className="w-4 h-4 mr-2" />Formula 1® Spanish Grand Prix
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Spanish Grand Prix 2026 Tickets
            <span className="block text-2xl md:text-3xl mt-2 text-slate-500">Circuit de Barcelona-Catalunya 🇪🇸</span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-3xl mx-auto mb-8">
            The testing ground of champions! Historic Barcelona circuit with amazing atmosphere.
            <strong className="text-emerald-600"> Best value F1 race - from €119!</strong>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full">
              <Calendar className="w-5 h-5 text-amber-600" /><span>June 5-7, 2026</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full">
              <MapPin className="w-5 h-5 text-amber-600" /><span>Barcelona, Spain</span>
            </div>
          </div>

          <div className="inline-block bg-white/90 border border-emerald-200 rounded-none p-6">
            <div className="text-slate-500 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-emerald-600">€119</div>
            <div className="text-emerald-600 text-sm mt-1">Best value European F1 race!</div>
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
          <h2 className="text-3xl font-bold mb-8">Buy Barcelona F1 2026 Tickets</h2>
          <div className="grid gap-4">
            {tickets.map((ticket, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between bg-[#1e1e1e] border border-white/5 hover:border-yellow-500/30 rounded-none p-6 transition-all">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-14 h-14 bg-yellow-500/20 rounded-none flex items-center justify-center"><Ticket className="w-7 h-7 text-amber-600" /></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{ticket.section}</h3>
                      {ticket.popular && <Badge className="bg-orange-500/10 text-orange-600 text-xs">POPULAR</Badge>}
                    </div>
                    <p className="text-slate-400 text-sm">Spanish Grand Prix 2026 • 3-Day Pass</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-emerald-600 text-sm">{ticket.available} left</span>
                  <div className="text-right">
                    <div className="text-xs text-slate-400 line-through">€{ticket.originalPrice}</div>
                    <div className="text-xl font-bold text-emerald-600">€{ticket.price}</div>
                  </div>
                  <Link to="/checkout?event=spain-grand-prix-2026"><Button className="bg-yellow-500 hover:bg-yellow-600 text-black">View</Button></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#15151e]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2"><HelpCircle className="w-6 h-6 text-amber-600" />FAQ - Spanish GP Tickets</h2>
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
            {["Spanish GP tickets", "Barcelona F1 tickets", "Catalunya F1 2026", "F1 Spain tickets", "buy Barcelona GP tickets", "Circuit de Catalunya tickets", "Spanish Grand Prix 2026"].map((term, i) => (
              <span key={i} className="px-3 py-1 bg-[#15151e] text-slate-500 rounded-full text-sm">{term}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-yellow-900/30 to-red-900/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Vamos a Barcelona 2026!</h2>
          <p className="text-slate-500 mb-8">Best value F1 weekend in Europe</p>
          <Link to="/checkout?event=spain-grand-prix-2026"><Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black px-8"><Ticket className="w-5 h-5 mr-2" />Buy Barcelona Tickets</Button></Link>
        </div>
      </section>
    </div>
  );
};

export default SpainGPPage;
