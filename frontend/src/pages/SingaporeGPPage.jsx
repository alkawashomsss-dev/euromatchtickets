import { Link } from "react-router-dom";
import { Calendar, MapPin, Trophy, Star, Shield, Users, TrendingUp, Zap, Flag, Ticket, Moon } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";

const SingaporeGPPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": "Singapore Grand Prix 2026",
    "description": "Buy Singapore Grand Prix 2026 tickets. F1 Night Race Marina Bay. VIP Hospitality, Grandstand tickets. The most spectacular night race.",
    "startDate": "2026-09-20",
    "endDate": "2026-09-21",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": "https://euromatchtickets.com/logo.png",
    "location": {
      "@type": "Place",
      "name": "Marina Bay Street Circuit",
      "address": { "@type": "PostalAddress", "addressLocality": "Singapore", "addressCountry": "SG" }
    },
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "189", "highPrice": "2999", "availability": "https://schema.org/InStock", "url": "https://euromatchtickets.com/f1-singapore-grand-prix-tickets", "validFrom": "2025-01-01" }
  };

  const tickets = [
    { section: "Walkabout (General)", price: 189, originalPrice: 199, available: 312, popular: false },
    { section: "Turn 1 Grandstand", price: 389, originalPrice: 399, available: 89, popular: true },
    { section: "Pit Grandstand", price: 489, originalPrice: 499, available: 56, popular: true },
    { section: "Bay Grandstand", price: 349, originalPrice: 359, available: 123, popular: false },
    { section: "VIP Hospitality", price: 1489, originalPrice: 1499, available: 34, popular: true },
    { section: "Paddock Club", price: 4489, originalPrice: 4499, available: 11, popular: false },
  ];

  return (
    <div className="min-h-screen bg-[hsl(210,20%,98%)]">
      <SEOHead 
        title="Singapore GP Tickets 2026 | F1 Marina Bay Prices"
        description="Buy Singapore Grand Prix 2026 tickets from €189. Spectacular F1 Night Race at Marina Bay. Turn 1, Pit Grandstand, VIP available. 100% Buyer Protection."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/12801/pexels-photo-12801.jpeg')] opacity-15 bg-cover bg-center" />
        
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-full px-4 py-2 mb-6">
            <Moon className="w-4 h-4 text-violet-600" />
            <span className="text-violet-600 font-medium">The Original F1 Night Race 🌙</span>
          </div>
          
          <Badge className="bg-red-50 text-red-600 border-red-200 mb-6">
            <Flag className="w-4 h-4 mr-2" />Formula 1® World Championship
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Singapore Grand Prix 2026
            <span className="block text-2xl md:text-3xl mt-2 text-slate-500">Marina Bay Street Circuit • Singapore</span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-3xl mx-auto mb-8">
            The most spectacular race on the calendar. F1 under the lights with the stunning 
            Singapore skyline as backdrop. <strong className="text-emerald-600">€10 cheaper than competitors!</strong>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
              <Calendar className="w-5 h-5 text-violet-600" />
              <span>September 18-20, 2026</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
              <MapPin className="w-5 h-5 text-violet-600" />
              <span>Marina Bay, Singapore</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-violet-50 rounded-full">
              <Moon className="w-5 h-5 text-violet-600" />
              <span>Night Race</span>
            </div>
          </div>

          <div className="inline-block bg-white/90 border border-emerald-200 rounded-2xl p-6">
            <div className="text-slate-500 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-emerald-600">€189</div>
            <div className="text-emerald-600 text-sm mt-1">Save €10 vs F1.com & StubHub</div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-6 border-y border-slate-100 bg-slate-50">
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
          <h2 className="text-3xl font-bold mb-8">Singapore GP 2026 Tickets</h2>
          <div className="grid gap-4">
            {tickets.map((ticket, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between bg-white border border-slate-100 hover:border-violet-200 rounded-2xl p-6 transition-all">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-14 h-14 bg-violet-50 rounded-xl flex items-center justify-center">
                    <Ticket className="w-7 h-7 text-violet-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{ticket.section}</h3>
                      {ticket.popular && <Badge className="bg-orange-50 text-orange-600 text-xs">POPULAR</Badge>}
                    </div>
                    <p className="text-slate-400 text-sm">Singapore Grand Prix 2026 • 3-Day Pass</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-emerald-600 text-sm">{ticket.available} left</span>
                  <div className="text-right">
                    <div className="text-xs text-slate-400 line-through">€{ticket.originalPrice}</div>
                    <div className="text-xl font-bold text-emerald-600">€{ticket.price}</div>
                  </div>
                  <Link to="/events?type=f1">
                    <Button className="bg-purple-500 hover:bg-purple-600">Buy Now</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">About Singapore Grand Prix</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-500 mb-4">
              The <strong>Singapore Grand Prix</strong> introduced F1 night racing in 2008 and 
              remains the most visually stunning event on the calendar. The Marina Bay Street Circuit 
              winds past iconic landmarks including the Marina Bay Sands and Singapore Flyer.
            </p>
            <p className="text-slate-500 mb-4">
              Racing under lights at 300+ km/h through the streets of Singapore creates an 
              unforgettable spectacle. The humid conditions and long race distance make this 
              one of the most physically demanding races for drivers.
            </p>
            <h3 className="text-xl font-bold text-white mt-6 mb-3">Best Grandstands at Singapore GP:</h3>
            <ul className="text-slate-500 space-y-2">
              <li>• <strong>Turn 1 Grandstand</strong> - Best braking zone action and overtakes</li>
              <li>• <strong>Pit Grandstand</strong> - Watch pit stops and start/finish</li>
              <li>• <strong>Bay Grandstand</strong> - Stunning skyline views with Marina Bay Sands</li>
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
              "Singapore GP tickets", "Singapore F1 tickets", "Singapore Grand Prix 2026",
              "Marina Bay F1", "F1 night race", "Singapore F1 hospitality",
              "Singapore GP grandstand", "F1 Singapore", "Singapore race tickets",
              "buy Singapore GP tickets", "Singapore F1 2026", "Marina Bay tickets"
            ].map((term, i) => (
              <span key={i} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-sm">
                {term}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-purple-900/30 to-pink-900/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Experience F1 Under Lights!</h2>
          <p className="text-slate-500 mb-8">The most spectacular night race in motorsport</p>
          <Link to="/events?type=f1">
            <Button size="lg" className="bg-purple-500 hover:bg-purple-600 px-8">
              <Ticket className="w-5 h-5 mr-2" />
              Buy Singapore GP Tickets
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SingaporeGPPage;
