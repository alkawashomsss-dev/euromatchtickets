import { Link } from "react-router-dom";
import { Calendar, MapPin, Shield, Zap, Flag, Ticket, HelpCircle, CreditCard, Headphones, Moon } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";

const BahrainGPPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": "Bahrain Grand Prix 2026",
    "description": "Buy Bahrain Grand Prix 2026 tickets. Night race at Bahrain International Circuit. General admission, grandstand and hospitality tickets.",
    "startDate": "2026-03-08",
    "location": { "@type": "Place", "name": "Bahrain International Circuit", "address": "Sakhir, Bahrain" },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "149", "availability": "https://schema.org/InStock" }
  };

  const tickets = [
    { section: "General Admission", price: 149, originalPrice: 159, available: 389, popular: false },
    { section: "Main Grandstand", price: 329, originalPrice: 339, available: 112, popular: true },
    { section: "Turn 1 Grandstand", price: 389, originalPrice: 399, available: 78, popular: true },
    { section: "Batelco Grandstand", price: 349, originalPrice: 359, available: 98, popular: false },
    { section: "VIP Hospitality", price: 1189, originalPrice: 1199, available: 34, popular: true },
    { section: "Paddock Club", price: 3789, originalPrice: 3799, available: 12, popular: false },
  ];

  const faqs = [
    { q: "Is Bahrain GP a night race?", a: "Yes! Bahrain GP starts at twilight and finishes under floodlights, creating a spectacular visual experience." },
    { q: "Are Bahrain F1 tickets mobile?", a: "Yes, all tickets are mobile QR codes delivered instantly via email. Print option also available." },
    { q: "What's the weather like for Bahrain GP?", a: "March temperatures average 20-25°C in the evening. Very comfortable for watching racing!" },
    { q: "How do I get to Bahrain International Circuit?", a: "The circuit is 30km from Manama. Shuttle buses and taxis are readily available during race weekend." },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <SEOHead 
        title="Bahrain Grand Prix Tickets 2026 - Buy F1 Bahrain Night Race Tickets | Best Prices"
        description="Buy Bahrain Grand Prix 2026 tickets from €149. Spectacular F1 night race! Main Grandstand, Turn 1, VIP Hospitality. 100% Ticket Guarantee. Instant QR delivery!"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/30 via-zinc-900 to-zinc-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-2 mb-6">
            <Moon className="w-4 h-4 text-purple-400" /><span className="text-purple-400 font-medium">Night Race Under The Stars</span>
          </div>
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 mb-6 ml-2">
            <Flag className="w-4 h-4 mr-2" />Formula 1® Bahrain Grand Prix
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Bahrain Grand Prix 2026 Tickets
            <span className="block text-2xl md:text-3xl mt-2 text-zinc-400">Bahrain International Circuit • Sakhir 🇧🇭</span>
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
            The spectacular Bahrain night race! Watch F1 cars under the desert stars.
            <strong className="text-emerald-400"> 100% Ticket Guarantee. €10 cheaper!</strong>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full">
              <Calendar className="w-5 h-5 text-amber-400" /><span>March 6-8, 2026</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full">
              <MapPin className="w-5 h-5 text-amber-400" /><span>Sakhir, Bahrain</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full">
              <Moon className="w-5 h-5 text-purple-400" /><span>Night Race</span>
            </div>
          </div>

          <div className="inline-block bg-zinc-900/80 border border-emerald-500/30 rounded-2xl p-6">
            <div className="text-zinc-400 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-emerald-400">€149</div>
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
          <h2 className="text-3xl font-bold mb-8">Buy Bahrain F1 2026 Tickets</h2>
          <div className="grid gap-4">
            {tickets.map((ticket, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between bg-zinc-900/50 border border-white/5 hover:border-amber-500/30 rounded-2xl p-6 transition-all">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center"><Ticket className="w-7 h-7 text-amber-400" /></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{ticket.section}</h3>
                      {ticket.popular && <Badge className="bg-orange-500/20 text-orange-400 text-xs">POPULAR</Badge>}
                    </div>
                    <p className="text-zinc-500 text-sm">Bahrain Grand Prix 2026 • 3-Day Pass</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-emerald-400 text-sm">{ticket.available} left</span>
                  <div className="text-right">
                    <div className="text-xs text-zinc-500 line-through">€{ticket.originalPrice}</div>
                    <div className="text-xl font-bold text-emerald-400">€{ticket.price}</div>
                  </div>
                  <Link to="/events?type=f1"><Button className="bg-amber-500 hover:bg-amber-600 text-black">Buy Now</Button></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2"><HelpCircle className="w-6 h-6 text-amber-400" />FAQ - Bahrain GP Tickets</h2>
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
            {["Bahrain GP tickets", "F1 Bahrain 2026", "Bahrain night race tickets", "Sakhir F1 tickets", "buy Bahrain GP tickets", "F1 Middle East", "Bahrain International Circuit tickets"].map((term, i) => (
              <span key={i} className="px-3 py-1 bg-zinc-800/50 text-zinc-400 rounded-full text-sm">{term}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-amber-900/30 to-purple-900/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Experience F1 Under Desert Stars!</h2>
          <p className="text-zinc-400 mb-8">The magical Bahrain night race awaits</p>
          <Link to="/events?type=f1"><Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black px-8"><Ticket className="w-5 h-5 mr-2" />Buy Bahrain GP Tickets</Button></Link>
        </div>
      </section>
    </div>
  );
};

export default BahrainGPPage;
