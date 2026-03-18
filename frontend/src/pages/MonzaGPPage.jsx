import { Link } from "react-router-dom";
import { Calendar, MapPin, Trophy, Star, Shield, Users, TrendingUp, Zap, Flag, Ticket } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";

const MonzaGPPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": "Italian Grand Prix 2026 Monza",
    "description": "Buy Italian Grand Prix 2026 tickets at Monza. Temple of Speed. Tifosi atmosphere. General admission, grandstand and paddock club tickets.",
    "startDate": "2026-09-06",
    "endDate": "2026-09-07",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": "https://euromatchtickets.com/logo.png",
    "location": {
      "@type": "Place",
      "name": "Autodromo Nazionale Monza",
      "address": { "@type": "PostalAddress", "addressLocality": "Monza", "addressCountry": "IT" }
    },
    "performer": {"@type": "SportsTeam", "name": "Formula 1 - FIA"},
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "99", "highPrice": "1999", "availability": "https://schema.org/InStock", "url": "https://euromatchtickets.com/f1-italian-grand-prix-monza-tickets", "validFrom": "2025-01-01" }
  };

  const tickets = [
    { section: "General Admission", price: 99, originalPrice: 109, available: 456, popular: false },
    { section: "Grandstand (Parabolica)", price: 189, originalPrice: 199, available: 123, popular: true },
    { section: "Grandstand (Prima Variante)", price: 219, originalPrice: 229, available: 89, popular: true },
    { section: "Grandstand (Ascari)", price: 179, originalPrice: 189, available: 145, popular: false },
    { section: "VIP Hospitality", price: 989, originalPrice: 999, available: 45, popular: true },
    { section: "Paddock Club", price: 2989, originalPrice: 2999, available: 18, popular: false },
  ];

  return (
    <div className="min-h-screen bg-[hsl(210,20%,98%)]">
      <SEOHead 
        title="Italian GP Tickets 2026 | Monza F1 Best Prices"
        description="Buy Italian Grand Prix 2026 Monza tickets from €99. The Temple of Speed! Parabolica, Ascari grandstands. Tifosi atmosphere. 100% Buyer Protection. €10 cheaper!"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/30 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/12801/pexels-photo-12801.jpeg')] opacity-15 bg-cover bg-center" />
        
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2 mb-6">
            <Trophy className="w-4 h-4 text-green-600" />
            <span className="text-green-600 font-medium">The Temple of Speed 🏎️</span>
          </div>
          
          <Badge className="bg-red-50 text-red-600 border-red-200 mb-6">
            <Flag className="w-4 h-4 mr-2" />Formula 1® World Championship
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Italian Grand Prix 2026
            <span className="block text-2xl md:text-3xl mt-2 text-slate-500">Autodromo Nazionale Monza • Italy</span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-3xl mx-auto mb-8">
            Feel the passion of the Tifosi at the fastest track in F1. Historic Monza - where legends are made 
            and Ferrari dreams come true. <strong className="text-emerald-600">€10 cheaper than competitors!</strong>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
              <Calendar className="w-5 h-5 text-green-600" />
              <span>September 4-6, 2026</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
              <MapPin className="w-5 h-5 text-green-600" />
              <span>Monza, Italy</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
              <Users className="w-5 h-5 text-green-600" />
              <span>5.793 km Circuit</span>
            </div>
          </div>

          <div className="inline-block bg-white/90 border border-emerald-200 rounded-2xl p-6">
            <div className="text-slate-500 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-emerald-600">€99</div>
            <div className="text-emerald-600 text-sm mt-1">Best value F1 race! Save €10</div>
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
          <h2 className="text-3xl font-bold mb-8">Monza F1 2026 Tickets</h2>
          <div className="grid gap-4">
            {tickets.map((ticket, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between bg-white border border-slate-100 hover:border-green-500/30 rounded-2xl p-6 transition-all">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <Ticket className="w-7 h-7 text-green-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{ticket.section}</h3>
                      {ticket.popular && <Badge className="bg-orange-50 text-orange-600 text-xs">POPULAR</Badge>}
                    </div>
                    <p className="text-slate-400 text-sm">Italian Grand Prix 2026 • 3-Day Pass</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-emerald-600 text-sm">{ticket.available} left</span>
                  <div className="text-right">
                    <div className="text-xs text-slate-400 line-through">€{ticket.originalPrice}</div>
                    <div className="text-xl font-bold text-emerald-600">€{ticket.price}</div>
                  </div>
                  <Link to="/events?type=f1">
                    <Button className="bg-green-500 hover:bg-green-600">Buy Now</Button>
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
          <h2 className="text-2xl font-bold mb-6">About Italian Grand Prix at Monza</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-500 mb-4">
              The <strong>Italian Grand Prix at Monza</strong> is known as the "Temple of Speed" - 
              the fastest circuit on the F1 calendar with average speeds over 260 km/h. 
              The passionate Tifosi fans make this one of the most atmospheric races.
            </p>
            <p className="text-slate-500 mb-4">
              <strong>Autodromo Nazionale Monza</strong> has hosted F1 since 1950. 
              The track features famous corners like the Parabolica, Lesmo curves, and the 
              Ascari chicane. A Ferrari victory here sends the crowd into rapture.
            </p>
            <h3 className="text-xl font-bold text-white mt-6 mb-3">Best Grandstands at Monza:</h3>
            <ul className="text-slate-500 space-y-2">
              <li>• <strong>Parabolica</strong> - The legendary final corner before the straight</li>
              <li>• <strong>Prima Variante</strong> - Best overtaking spot, turn 1 action</li>
              <li>• <strong>Ascari</strong> - Technical chicane with close racing</li>
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
              "Monza F1 tickets", "Italian GP tickets", "Italian Grand Prix 2026",
              "Monza tickets", "F1 Monza", "Monza grandstand",
              "Italian GP hospitality", "Monza Tifosi", "Monza VIP",
              "buy Monza tickets", "Italy F1 tickets", "F1 Italy 2026"
            ].map((term, i) => (
              <span key={i} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-sm">
                {term}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-green-900/30 to-red-900/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Tifosi at Monza 2026!</h2>
          <p className="text-slate-500 mb-8">Experience the passion of Italian motorsport</p>
          <Link to="/events?type=f1">
            <Button size="lg" className="bg-green-500 hover:bg-green-600 px-8">
              <Ticket className="w-5 h-5 mr-2" />
              Buy Monza Tickets
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MonzaGPPage;
