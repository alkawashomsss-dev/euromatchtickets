import { Link } from "react-router-dom";
import { Calendar, MapPin, Shield, Zap, Flag, Ticket, HelpCircle, CreditCard, Headphones } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";

const AustraliaGPPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": "Australian Grand Prix 2026 Melbourne",
    "description": "Buy Australian Grand Prix 2026 tickets at Albert Park Melbourne. Season opener. General admission, grandstand and hospitality tickets.",
    "startDate": "2026-03-15",
    "endDate": "2026-03-16",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": "https://euromatchtickets.com/logo.png",
    "location": { "@type": "Place", "name": "Albert Park Circuit", "address": { "@type": "PostalAddress", "addressLocality": "Melbourne", "addressCountry": "AU" } },
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "159", "highPrice": "2499", "availability": "https://schema.org/InStock", "url": "https://euromatchtickets.com/f1-australian-grand-prix-melbourne-tickets", "validFrom": "2025-01-01" }
  };

  const tickets = [
    { section: "General Admission", price: 159, originalPrice: 169, available: 456, popular: false },
    { section: "Jones Grandstand", price: 349, originalPrice: 359, available: 112, popular: true },
    { section: "Brabham Grandstand", price: 389, originalPrice: 399, available: 89, popular: true },
    { section: "Prost Grandstand", price: 329, originalPrice: 339, available: 134, popular: false },
    { section: "VIP Hospitality", price: 1289, originalPrice: 1299, available: 45, popular: true },
    { section: "Paddock Club", price: 3989, originalPrice: 3999, available: 15, popular: false },
  ];

  const faqs = [
    { q: "Are Melbourne F1 tickets digital?", a: "Yes, all Albert Park tickets are mobile QR codes. Download to your phone or print the PDF - both work at entry." },
    { q: "When do Australian GP tickets get delivered?", a: "Instant delivery via email after purchase. You'll receive your tickets within minutes." },
    { q: "What's the best grandstand at Albert Park?", a: "Jones Grandstand offers the best start/finish views. Brabham is great for Turn 1 action." },
    { q: "Can I walk around Albert Park with GA tickets?", a: "Yes! General Admission gives access to multiple viewing areas around the circuit." },
  ];

  return (
    <div className="min-h-screen bg-[hsl(210,20%,98%)]">
      <SEOHead 
        title="Australian GP Tickets 2026 | Melbourne F1 Prices"
        description="Buy Australian Grand Prix 2026 Melbourne tickets from €159. Albert Park Circuit. Jones, Brabham, Prost grandstands. VIP Hospitality. 100% Ticket."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-slate-900 to-slate-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <Badge className="bg-blue-50 text-blue-600 border-blue-200 mb-6">
            <Flag className="w-4 h-4 mr-2" />Formula 1® Australian Grand Prix
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Australian Grand Prix 2026 Tickets
            <span className="block text-2xl md:text-3xl mt-2 text-slate-500">Albert Park Circuit • Melbourne 🇦🇺</span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-3xl mx-auto mb-8">
            The season opener! Beautiful Melbourne and the iconic Albert Park lake circuit.
            <strong className="text-emerald-600"> 100% Ticket Guarantee. €10 cheaper than competitors!</strong>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
              <Calendar className="w-5 h-5 text-blue-600" /><span>March 13-15, 2026</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
              <MapPin className="w-5 h-5 text-blue-600" /><span>Melbourne, Australia</span>
            </div>
          </div>

          <div className="inline-block bg-white/90 border border-emerald-200 rounded-2xl p-6">
            <div className="text-slate-500 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-emerald-600">€159</div>
          </div>
        </div>
      </section>

      <section className="py-6 border-y border-slate-100 bg-slate-50">
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
          <h2 className="text-3xl font-bold mb-8">Buy Melbourne F1 2026 Tickets</h2>
          <div className="grid gap-4">
            {tickets.map((ticket, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between bg-white border border-slate-100 hover:border-blue-200 rounded-2xl p-6 transition-all">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center"><Ticket className="w-7 h-7 text-blue-600" /></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{ticket.section}</h3>
                      {ticket.popular && <Badge className="bg-orange-50 text-orange-600 text-xs">POPULAR</Badge>}
                    </div>
                    <p className="text-slate-400 text-sm">Australian Grand Prix 2026 • 3-Day Pass</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-emerald-600 text-sm">{ticket.available} left</span>
                  <div className="text-right">
                    <div className="text-xs text-slate-400 line-through">€{ticket.originalPrice}</div>
                    <div className="text-xl font-bold text-emerald-600">€{ticket.price}</div>
                  </div>
                  <Link to="/events?type=f1"><Button className="bg-blue-500 hover:bg-blue-600">Buy Now</Button></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2"><HelpCircle className="w-6 h-6 text-blue-600" />FAQ - Australian GP Tickets</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="font-bold text-white mb-2">{faq.q}</h3>
                <p className="text-slate-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-lg font-bold mb-4">Related Searches:</h3>
          <div className="flex flex-wrap gap-2">
            {["Australian GP tickets", "Melbourne F1 tickets", "Albert Park tickets", "F1 Australia 2026", "Melbourne Grand Prix", "buy Australian GP tickets", "F1 season opener 2026"].map((term, i) => (
              <span key={i} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-sm">{term}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-blue-900/30 to-cyan-900/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Your F1 Season in Melbourne!</h2>
          <p className="text-slate-500 mb-8">The perfect way to kick off the 2026 F1 season</p>
          <Link to="/events?type=f1"><Button size="lg" className="bg-blue-500 hover:bg-blue-600 px-8"><Ticket className="w-5 h-5 mr-2" />Buy Melbourne Tickets</Button></Link>
        </div>
      </section>
    </div>
  );
};

export default AustraliaGPPage;
