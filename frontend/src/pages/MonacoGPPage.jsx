import { Link } from "react-router-dom";
import { Calendar, MapPin, Trophy, Star, Shield, Users, TrendingUp, Zap, Flag, Ticket } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";

const MonacoGPPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": "Monaco Grand Prix 2026",
    "description": "Buy Monaco Grand Prix 2026 tickets. F1 Monte Carlo street circuit. VIP Hospitality, Grandstand, Paddock Club tickets available.",
    "startDate": "2026-05-24",
    "endDate": "2026-05-25",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": "https://euromatchtickets.com/logo.png",
    "location": {
      "@type": "Place",
      "name": "Circuit de Monaco",
      "address": { "@type": "PostalAddress", "addressLocality": "Monte Carlo", "addressCountry": "MC" }
    },
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "289", "highPrice": "4999", "availability": "https://schema.org/InStock", "url": "https://euromatchtickets.com/f1-monaco-grand-prix-tickets", "validFrom": "2025-01-01" }
  };

  const tickets = [
    { section: "General Admission", price: 289, originalPrice: 299, available: 145, popular: false },
    { section: "Grandstand K (Casino)", price: 589, originalPrice: 599, available: 67, popular: true },
    { section: "Grandstand T (Tabac)", price: 489, originalPrice: 499, available: 89, popular: true },
    { section: "Grandstand B (Piscine)", price: 549, originalPrice: 559, available: 52, popular: false },
    { section: "VIP Hospitality", price: 1989, originalPrice: 1999, available: 23, popular: true },
    { section: "Paddock Club", price: 4989, originalPrice: 4999, available: 8, popular: false },
  ];

  return (
    <div className="min-h-screen bg-[hsl(210,20%,98%)]">
      <SEOHead 
        title="Monaco Grand Prix 2026 Tickets Price – Cheapest F1 Monte Carlo GP | Official Alternative + Instant QR"
        description="Buy Monaco Grand Prix 2026 tickets from €289. Cheapest prices for Casino Square, Swimming Pool, Tabac. VIP Hospitality & Paddock Club. Official alternative marketplace with instant QR delivery & FanProtect guarantee."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/12801/pexels-photo-12801.jpeg')] opacity-15 bg-cover bg-center" />
        
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-2 mb-6">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span className="text-amber-600 font-medium">The Most Prestigious Race in F1</span>
          </div>
          
          <Badge className="bg-red-50 text-red-600 border-red-200 mb-6">
            <Flag className="w-4 h-4 mr-2" />Formula 1® World Championship
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Monaco Grand Prix 2026
            <span className="block text-2xl md:text-3xl mt-2 text-slate-500">Circuit de Monaco • Monte Carlo</span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-3xl mx-auto mb-8">
            The crown jewel of Formula 1. Experience the glamour of Monte Carlo, Casino Square, 
            and the legendary tunnel. <strong className="text-emerald-600">€10 cheaper than all competitors!</strong>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
              <Calendar className="w-5 h-5 text-red-600" />
              <span>May 22-24, 2026</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
              <MapPin className="w-5 h-5 text-red-600" />
              <span>Monte Carlo, Monaco</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
              <Users className="w-5 h-5 text-red-600" />
              <span>3.337 km Street Circuit</span>
            </div>
          </div>

          <div className="inline-block bg-white/90 border border-emerald-200 rounded-2xl p-6">
            <div className="text-slate-500 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-emerald-600">€289</div>
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
            <div className="flex items-center gap-2 text-emerald-600"><Zap className="w-5 h-5" /><span>Instant QR Delivery</span></div>
          </div>
        </div>
      </section>

      {/* Price Comparison */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">💰 Monaco GP Price Comparison</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <div className="text-slate-400 text-sm">F1.com</div>
              <div className="text-red-600 line-through font-bold text-xl">€599</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <div className="text-slate-400 text-sm">StubHub</div>
              <div className="text-red-600 line-through font-bold text-xl">€599</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <div className="text-slate-400 text-sm">Viagogo</div>
              <div className="text-red-600 line-through font-bold text-xl">€599</div>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-xl border-2 border-emerald-500/50">
              <div className="text-emerald-600 text-sm font-medium">EuroMatchTickets</div>
              <div className="text-emerald-600 font-black text-2xl">€589</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tickets */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Monaco GP 2026 Tickets</h2>
          <div className="grid gap-4">
            {tickets.map((ticket, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between bg-white border border-slate-100 hover:border-red-200 rounded-2xl p-6 transition-all">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center">
                    <Ticket className="w-7 h-7 text-red-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{ticket.section}</h3>
                      {ticket.popular && <Badge className="bg-orange-50 text-orange-600 text-xs">POPULAR</Badge>}
                    </div>
                    <p className="text-slate-400 text-sm">Monaco Grand Prix 2026 • 3-Day Pass</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-emerald-600 text-sm">{ticket.available} left</span>
                  <div className="text-right">
                    <div className="text-xs text-slate-400 line-through">€{ticket.originalPrice}</div>
                    <div className="text-xl font-bold text-emerald-600">€{ticket.price}</div>
                  </div>
                  <Link to="/events?type=f1">
                    <Button className="bg-red-500 hover:bg-red-600">Buy Now</Button>
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
          <h2 className="text-2xl font-bold mb-6">About Monaco Grand Prix</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-500 mb-4">
              The <strong>Monaco Grand Prix</strong> is the most prestigious race on the Formula 1 calendar. 
              Held annually on the streets of Monte Carlo since 1929, it's one of the "Triple Crown" of motorsport 
              alongside the Indianapolis 500 and 24 Hours of Le Mans.
            </p>
            <p className="text-slate-500 mb-4">
              The <strong>Circuit de Monaco</strong> is famous for its tight corners, elevation changes, and the 
              iconic tunnel section. Watch F1 cars race past Casino Square, through the Swimming Pool complex, 
              and along the harbor.
            </p>
            <h3 className="text-xl font-bold text-white mt-6 mb-3">Best Grandstands at Monaco GP:</h3>
            <ul className="text-slate-500 space-y-2">
              <li>• <strong>Grandstand K (Casino Square)</strong> - Premium views of the iconic casino hairpin</li>
              <li>• <strong>Grandstand T (Tabac)</strong> - Great overtaking spot near the chicane</li>
              <li>• <strong>Grandstand B (Piscine)</strong> - See cars navigate the swimming pool complex</li>
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
              "Monaco GP tickets", "Monte Carlo F1", "Monaco Grand Prix 2026",
              "F1 Monaco tickets", "Monaco GP hospitality", "Monaco paddock club",
              "Monaco GP grandstand K", "Casino square F1", "Monaco F1 VIP",
              "buy Monaco GP tickets", "Monaco race tickets", "F1 Monaco 2026"
            ].map((term, i) => (
              <span key={i} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-sm">
                {term}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-red-900/30 to-amber-900/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Don't Miss Monaco GP 2026!</h2>
          <p className="text-slate-500 mb-8">Limited tickets available for the most glamorous race in F1</p>
          <Link to="/events?type=f1">
            <Button size="lg" className="bg-red-500 hover:bg-red-600 px-8">
              <Ticket className="w-5 h-5 mr-2" />
              Buy Monaco GP Tickets
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MonacoGPPage;
