import { Link } from "react-router-dom";
import { Calendar, MapPin, Trophy, Star, Shield, Zap, Flag, Ticket, HelpCircle, CreditCard, Headphones } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";

const JapanGPPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": "Japanese Grand Prix 2026 Suzuka",
    "description": "Buy Japanese Grand Prix 2026 tickets at Suzuka Circuit. The legendary figure-8 circuit. General admission, grandstand and hospitality tickets.",
    "startDate": "2026-04-05",
    "endDate": "2026-04-06",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": "https://euromatchtickets.com/logo.png",
    "location": { "@type": "Place", "name": "Suzuka International Racing Course", "address": { "@type": "PostalAddress", "addressLocality": "Suzuka", "addressCountry": "JP" } },
    "performer": {"@type": "SportsTeam", "name": "Formula 1 - FIA"},
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "189", "highPrice": "2499", "availability": "https://schema.org/InStock", "url": "https://euromatchtickets.com/f1-japanese-grand-prix-suzuka-tickets", "validFrom": "2025-01-01" }
  };

  const tickets = [
    { section: "General Admission", price: 189, originalPrice: 199, available: 312, popular: false },
    { section: "A1 Grandstand (130R)", price: 389, originalPrice: 399, available: 89, popular: true },
    { section: "B2 Grandstand (S-Curves)", price: 449, originalPrice: 459, available: 67, popular: true },
    { section: "D Grandstand (Hairpin)", price: 349, originalPrice: 359, available: 98, popular: false },
    { section: "VIP Hospitality", price: 1389, originalPrice: 1399, available: 28, popular: true },
    { section: "Paddock Club", price: 4289, originalPrice: 4299, available: 11, popular: false },
  ];

  const faqs = [
    { q: "Are Suzuka F1 tickets mobile or paper?", a: "Suzuka offers both mobile QR tickets and printable PDF tickets. You'll receive both options via email after purchase." },
    { q: "When will Japanese GP tickets be delivered?", a: "Tickets are delivered instantly via email after successful payment. Check your spam folder if not received within 10 minutes." },
    { q: "What if Japanese GP is cancelled due to weather?", a: "If cancelled without rescheduling, full refund within 14 days. If rescheduled, tickets remain valid for new date." },
    { q: "Is Suzuka accessible by public transport?", a: "Yes! Suzuka Circuit is accessible via Shiroko Station. Special shuttle buses run during the F1 weekend." },
  ];

  return (
    <div className="min-h-screen bg-[hsl(210,20%,98%)]">
      <SEOHead 
        title="Japanese GP Tickets 2026 | Suzuka F1 Prices"
        description="Buy Japanese Grand Prix 2026 Suzuka tickets from €189. The legendary figure-8 circuit! 130R, S-Curves, Hairpin grandstands. VIP Hospitality. 100% Ticket."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-600/30 via-slate-900 to-slate-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 mb-6">
            <Flag className="w-4 h-4 mr-2" />Formula 1® Japanese Grand Prix
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Japanese Grand Prix 2026 Tickets
            <span className="block text-2xl md:text-3xl mt-2 text-slate-500">Suzuka International Racing Course • Japan 🇯🇵</span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-3xl mx-auto mb-8">
            The legendary Suzuka! Home to the famous 130R, S-Curves, and Spoon. One of the most challenging circuits in F1.
            <strong className="text-emerald-600"> 100% Ticket Guarantee. €10 cheaper!</strong>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
              <Calendar className="w-5 h-5 text-rose-400" /><span>April 3-5, 2026</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
              <MapPin className="w-5 h-5 text-rose-400" /><span>Suzuka, Japan</span>
            </div>
          </div>

          <div className="inline-block bg-white/90 border border-emerald-200 rounded-2xl p-6">
            <div className="text-slate-500 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-emerald-600">€189</div>
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
          <h2 className="text-3xl font-bold mb-8">Buy Suzuka F1 2026 Tickets</h2>
          <div className="grid gap-4">
            {tickets.map((ticket, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between bg-white border border-slate-100 hover:border-rose-500/30 rounded-2xl p-6 transition-all">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-14 h-14 bg-rose-500/20 rounded-xl flex items-center justify-center"><Ticket className="w-7 h-7 text-rose-400" /></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{ticket.section}</h3>
                      {ticket.popular && <Badge className="bg-orange-50 text-orange-600 text-xs">POPULAR</Badge>}
                    </div>
                    <p className="text-slate-400 text-sm">Japanese Grand Prix 2026 • 3-Day Pass</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-emerald-600 text-sm">{ticket.available} left</span>
                  <div className="text-right">
                    <div className="text-xs text-slate-400 line-through">€{ticket.originalPrice}</div>
                    <div className="text-xl font-bold text-emerald-600">€{ticket.price}</div>
                  </div>
                  <Link to="/events?type=f1"><Button className="bg-rose-500 hover:bg-rose-600">Buy Now</Button></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2"><HelpCircle className="w-6 h-6 text-rose-400" />FAQ - Japanese GP Tickets</h2>
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
            {["Japanese GP tickets", "Suzuka F1 tickets", "Japan F1 2026", "Suzuka Circuit tickets", "F1 Japan tickets", "130R grandstand", "Suzuka S-curves", "buy Suzuka tickets", "Japanese Grand Prix 2026"].map((term, i) => (
              <span key={i} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-sm">{term}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-rose-900/30 to-red-900/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Experience Suzuka 2026!</h2>
          <p className="text-slate-500 mb-8">The most technically challenging circuit on the F1 calendar</p>
          <Link to="/events?type=f1"><Button size="lg" className="bg-rose-500 hover:bg-rose-600 px-8"><Ticket className="w-5 h-5 mr-2" />Buy Suzuka Tickets</Button></Link>
        </div>
      </section>
    </div>
  );
};

export default JapanGPPage;
