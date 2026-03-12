import { Link } from "react-router-dom";
import { Calendar, MapPin, Trophy, Star, Shield, Users, TrendingUp, Zap, Flag, Ticket, HelpCircle, CheckCircle, CreditCard, Headphones } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";

const MiamiGPPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": "Miami Grand Prix 2026",
    "description": "Buy Miami Grand Prix 2026 tickets. F1 Miami International Autodrome. VIP Hospitality, Grandstand, General Admission tickets available.",
    "startDate": "2026-05-10",
    "endDate": "2026-05-11",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": "https://euromatchtickets.com/logo.png",
    "location": { "@type": "Place", "name": "Miami International Autodrome", "address": { "@type": "PostalAddress", "addressLocality": "Miami", "addressCountry": "US" } },
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "249", "highPrice": "3999", "availability": "https://schema.org/InStock", "url": "https://euromatchtickets.com/f1-miami-grand-prix-tickets", "validFrom": "2025-01-01" }
  };

  const tickets = [
    { section: "General Admission", price: 249, originalPrice: 259, available: 234, popular: false },
    { section: "Turn 1 Grandstand", price: 449, originalPrice: 459, available: 89, popular: true },
    { section: "Beach Grandstand", price: 549, originalPrice: 559, available: 67, popular: true },
    { section: "Marina Grandstand", price: 489, originalPrice: 499, available: 78, popular: false },
    { section: "Campus Hospitality", price: 1489, originalPrice: 1499, available: 34, popular: true },
    { section: "Paddock Club", price: 4989, originalPrice: 4999, available: 12, popular: false },
  ];

  const faqs = [
    { q: "Are Miami GP tickets mobile or PDF?", a: "Miami GP uses mobile tickets exclusively. You'll receive a QR code via email that can be scanned directly from your phone at entry gates." },
    { q: "When will I receive my Miami F1 tickets?", a: "Tickets are delivered instantly after purchase via email. For hospitality packages, additional details are sent 2 weeks before the event." },
    { q: "What happens if Miami GP is cancelled?", a: "Full refund within 14 days if the race is cancelled and not rescheduled. Our 100% Money Back Guarantee protects your purchase." },
    { q: "Can I resell my Miami GP tickets?", a: "Yes, tickets are transferable. You can resell through our platform or transfer to another person." },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <SEOHead 
        title="Miami Grand Prix Tickets 2026 - Buy F1 Miami GP Tickets | Beach, Marina Grandstand"
        description="Buy Miami Grand Prix 2026 tickets from €249. F1 Miami International Autodrome. Beach Grandstand, Turn 1, Marina views. VIP Hospitality. 100% Ticket Guarantee. Instant QR delivery!"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/30 via-zinc-900 to-zinc-950" />
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/12801/pexels-photo-12801.jpeg')] opacity-15 bg-cover bg-center" />
        
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 mb-6">
            <Flag className="w-4 h-4 mr-2" />Formula 1® Miami Grand Prix
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Miami Grand Prix 2026 Tickets
            <span className="block text-2xl md:text-3xl mt-2 text-zinc-400">Miami International Autodrome • Florida, USA</span>
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
            Experience F1 American style! Beach views, palm trees, and world-class racing in Miami Gardens. 
            <strong className="text-emerald-400"> €10 cheaper than competitors. 100% Ticket Guarantee!</strong>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full">
              <Calendar className="w-5 h-5 text-cyan-400" /><span>May 8-10, 2026</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full">
              <MapPin className="w-5 h-5 text-cyan-400" /><span>Miami, Florida</span>
            </div>
          </div>

          <div className="inline-block bg-zinc-900/80 border border-emerald-500/30 rounded-2xl p-6">
            <div className="text-zinc-400 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-emerald-400">€249</div>
            <div className="text-emerald-400 text-sm mt-1">Save €10 vs F1.com & StubHub</div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-6 border-y border-white/5 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 justify-center text-emerald-400">
              <Shield className="w-5 h-5" /><span className="text-sm">100% Ticket Guarantee</span>
            </div>
            <div className="flex items-center gap-2 justify-center text-emerald-400">
              <CreditCard className="w-5 h-5" /><span className="text-sm">Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2 justify-center text-emerald-400">
              <Zap className="w-5 h-5" /><span className="text-sm">Instant QR Delivery</span>
            </div>
            <div className="flex items-center gap-2 justify-center text-emerald-400">
              <Headphones className="w-5 h-5" /><span className="text-sm">24/7 Customer Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tickets */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Buy Miami GP 2026 Tickets</h2>
          <div className="grid gap-4">
            {tickets.map((ticket, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between bg-zinc-900/50 border border-white/5 hover:border-cyan-500/30 rounded-2xl p-6 transition-all">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-14 h-14 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                    <Ticket className="w-7 h-7 text-cyan-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{ticket.section}</h3>
                      {ticket.popular && <Badge className="bg-orange-500/20 text-orange-400 text-xs">POPULAR</Badge>}
                    </div>
                    <p className="text-zinc-500 text-sm">Miami Grand Prix 2026 • 3-Day Pass</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-emerald-400 text-sm">{ticket.available} left</span>
                  <div className="text-right">
                    <div className="text-xs text-zinc-500 line-through">€{ticket.originalPrice}</div>
                    <div className="text-xl font-bold text-emerald-400">€{ticket.price}</div>
                  </div>
                  <Link to="/events?type=f1"><Button className="bg-cyan-500 hover:bg-cyan-600">Buy Now</Button></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-cyan-400" />
            Frequently Asked Questions - Miami GP Tickets
          </h2>
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

      {/* SEO Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">About Miami Grand Prix</h2>
          <div className="prose prose-invert max-w-none text-zinc-400">
            <p className="mb-4">The <strong>Miami Grand Prix</strong> joined the F1 calendar in 2022 and quickly became one of the most popular races. The Miami International Autodrome is built around Hard Rock Stadium, home of the Miami Dolphins.</p>
            <p className="mb-4">The circuit features a unique "beach" section with sand, palm trees, and a fake marina - creating an iconic Miami vibe. The race attracts celebrities, athletes, and F1 fans from around the world.</p>
            <h3 className="text-xl font-bold text-white mt-6 mb-3">Best Grandstands at Miami GP:</h3>
            <ul className="space-y-2">
              <li>• <strong>Beach Grandstand</strong> - Iconic Miami views with the beach section backdrop</li>
              <li>• <strong>Turn 1 Grandstand</strong> - Best braking zone for overtaking action</li>
              <li>• <strong>Marina Grandstand</strong> - Views of the faux marina and yacht club</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Related Keywords */}
      <section className="py-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-lg font-bold mb-4">Related F1 Ticket Searches:</h3>
          <div className="flex flex-wrap gap-2">
            {["Miami GP tickets", "F1 Miami 2026", "Miami Grand Prix tickets", "Miami F1 tickets", "buy Miami GP tickets", "Miami F1 hospitality", "Miami GP grandstand", "F1 Miami beach grandstand", "Miami International Autodrome tickets", "F1 USA tickets 2026"].map((term, i) => (
              <span key={i} className="px-3 py-1 bg-zinc-800/50 text-zinc-400 rounded-full text-sm hover:bg-zinc-700 cursor-pointer">{term}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-cyan-900/30 to-blue-900/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Don't Miss Miami GP 2026!</h2>
          <p className="text-zinc-400 mb-8">Experience F1 American style - Beach, sun, and world-class racing</p>
          <Link to="/events?type=f1">
            <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 px-8">
              <Ticket className="w-5 h-5 mr-2" />Buy Miami GP Tickets
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MiamiGPPage;
