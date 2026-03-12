import { Link } from "react-router-dom";
import { Calendar, MapPin, Shield, Zap, Flag, Ticket, HelpCircle, CreditCard, Headphones, Moon } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";

const SaudiGPPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": "Saudi Arabian Grand Prix 2026",
    "description": "Buy Saudi Arabian Grand Prix 2026 tickets. Jeddah Corniche Circuit night race. High-speed street circuit. Grandstand and hospitality tickets.",
    "startDate": "2026-03-22",
    "endDate": "2026-03-23",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": "https://euromatchtickets.com/logo.png",
    "location": { "@type": "Place", "name": "Jeddah Corniche Circuit", "address": { "@type": "PostalAddress", "addressLocality": "Jeddah", "addressCountry": "SA" } },
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "169", "highPrice": "2999", "availability": "https://schema.org/InStock" }
  };

  const tickets = [
    { section: "General Admission", price: 169, originalPrice: 179, available: 345, popular: false },
    { section: "Main Grandstand", price: 379, originalPrice: 389, available: 89, popular: true },
    { section: "Turn 1 Grandstand", price: 429, originalPrice: 439, available: 67, popular: true },
    { section: "Beach Grandstand", price: 389, originalPrice: 399, available: 78, popular: false },
    { section: "VIP Hospitality", price: 1389, originalPrice: 1399, available: 28, popular: true },
    { section: "Paddock Club", price: 4289, originalPrice: 4299, available: 10, popular: false },
  ];

  const faqs = [
    { q: "Is Saudi GP a night race?", a: "Yes! The Saudi Arabian GP is run under floodlights at the spectacular Jeddah Corniche Circuit along the Red Sea coast." },
    { q: "How fast is Jeddah circuit?", a: "Jeddah is the fastest street circuit in F1, with average speeds over 250 km/h. Expect thrilling high-speed action!" },
    { q: "Are Saudi GP tickets mobile?", a: "Yes, all tickets are delivered as mobile QR codes via email. Print option also available." },
    { q: "Is it safe to attend Saudi GP?", a: "Yes, the event has extensive security measures and is safe for international visitors. Thousands of fans attend annually." },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <SEOHead 
        title="Saudi Arabian Grand Prix Tickets 2026 - Jeddah F1 Tickets | Night Race | Best Prices"
        description="Buy Saudi Arabian Grand Prix 2026 Jeddah tickets from €169. Fastest street circuit! Night race on the Red Sea. VIP Hospitality. 100% Ticket Guarantee. Instant delivery!"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/30 via-zinc-900 to-zinc-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-2 mb-6">
            <Moon className="w-4 h-4 text-purple-400" /><span className="text-purple-400 font-medium">Fastest Street Circuit in F1</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Saudi Arabian Grand Prix 2026
            <span className="block text-2xl md:text-3xl mt-2 text-zinc-400">Jeddah Corniche Circuit 🇸🇦</span>
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
            The fastest street circuit in Formula 1! Night racing along the Red Sea coastline.
            <strong className="text-emerald-400"> €10 cheaper than competitors!</strong>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full">
              <Calendar className="w-5 h-5 text-green-400" /><span>March 20-22, 2026</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full">
              <MapPin className="w-5 h-5 text-green-400" /><span>Jeddah, Saudi Arabia</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full">
              <Moon className="w-5 h-5 text-purple-400" /><span>Night Race</span>
            </div>
          </div>

          <div className="inline-block bg-zinc-900/80 border border-emerald-500/30 rounded-2xl p-6">
            <div className="text-zinc-400 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-emerald-400">€169</div>
          </div>
        </div>
      </section>

      <section className="py-6 border-y border-white/5 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 justify-center text-emerald-400"><Shield className="w-5 h-5" /><span className="text-sm">100% Ticket Guarantee</span></div>
            <div className="flex items-center gap-2 justify-center text-emerald-400"><CreditCard className="w-5 h-5" /><span className="text-sm">Secure Checkout</span></div>
            <div className="flex items-center gap-2 justify-center text-emerald-400"><Zap className="w-5 h-5" /><span className="text-sm">Instant Delivery</span></div>
            <div className="flex items-center gap-2 justify-center text-emerald-400"><Headphones className="w-5 h-5" /><span className="text-sm">24/7 Support</span></div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Buy Jeddah F1 2026 Tickets</h2>
          <div className="grid gap-4">
            {tickets.map((ticket, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between bg-zinc-900/50 border border-white/5 hover:border-green-500/30 rounded-2xl p-6 transition-all">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center"><Ticket className="w-7 h-7 text-green-400" /></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{ticket.section}</h3>
                      {ticket.popular && <Badge className="bg-orange-500/20 text-orange-400 text-xs">POPULAR</Badge>}
                    </div>
                    <p className="text-zinc-500 text-sm">Saudi Arabian GP 2026 • 3-Day Pass</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-emerald-400 text-sm">{ticket.available} left</span>
                  <div className="text-right">
                    <div className="text-xs text-zinc-500 line-through">€{ticket.originalPrice}</div>
                    <div className="text-xl font-bold text-emerald-400">€{ticket.price}</div>
                  </div>
                  <Link to="/events?type=f1"><Button className="bg-green-500 hover:bg-green-600">Buy Now</Button></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2"><HelpCircle className="w-6 h-6 text-green-400" />FAQ - Saudi GP Tickets</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-zinc-900/50 border border-zinc-700 rounded-xl p-6">
                <h3 className="font-bold text-white mb-2">{faq.q}</h3>
                <p className="text-zinc-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-lg font-bold mb-4">Related Searches:</h3>
          <div className="flex flex-wrap gap-2">
            {["Saudi GP tickets", "Jeddah F1 tickets", "Saudi Arabian Grand Prix 2026", "F1 Saudi Arabia", "Jeddah street circuit", "buy Saudi GP tickets", "F1 Middle East tickets"].map((term, i) => (
              <span key={i} className="px-3 py-1 bg-zinc-800/50 text-zinc-400 rounded-full text-sm">{term}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-green-900/30 to-purple-900/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Experience the Fastest Street Circuit!</h2>
          <p className="text-zinc-400 mb-8">High-speed night racing on the Red Sea</p>
          <Link to="/events?type=f1"><Button size="lg" className="bg-green-500 hover:bg-green-600 px-8"><Ticket className="w-5 h-5 mr-2" />Buy Saudi GP Tickets</Button></Link>
        </div>
      </section>
    </div>
  );
};

export default SaudiGPPage;
