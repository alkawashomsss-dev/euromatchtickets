import { Link } from "react-router-dom";
import { Calendar, MapPin, Trophy, Star, Shield, Users, TrendingUp, Zap, Flag, Ticket, Moon, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";

const LasVegasGPPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": "Las Vegas Grand Prix 2026",
    "description": "Buy Las Vegas Grand Prix 2026 tickets. F1 on the Las Vegas Strip. Night race past casinos and hotels. VIP Hospitality available.",
    "startDate": "2026-11-22",
    "endDate": "2026-11-23",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": "https://euromatchtickets.com/logo.png",
    "location": {
      "@type": "Place",
      "name": "Las Vegas Street Circuit",
      "address": { "@type": "PostalAddress", "addressLocality": "Las Vegas", "addressCountry": "US" }
    },
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "249", "highPrice": "3999", "availability": "https://schema.org/InStock", "url": "https://euromatchtickets.com/f1-las-vegas-grand-prix-tickets", "validFrom": "2025-01-01" }
  };

  const tickets = [
    { section: "General Admission", price: 249, originalPrice: 259, available: 234, popular: false },
    { section: "Sphere Grandstand", price: 589, originalPrice: 599, available: 67, popular: true },
    { section: "Strip View Grandstand", price: 489, originalPrice: 499, available: 89, popular: true },
    { section: "Turn 1 Grandstand", price: 389, originalPrice: 399, available: 112, popular: false },
    { section: "VIP Hospitality", price: 1989, originalPrice: 1999, available: 23, popular: true },
    { section: "Wynn Paddock Club", price: 5989, originalPrice: 5999, available: 8, popular: false },
  ];

  return (
    <div className="min-h-screen bg-[hsl(210,20%,98%)]">
      <SEOHead 
        title="Las Vegas GP Tickets 2026 | F1 Night Race Prices"
        description="Buy Las Vegas Grand Prix 2026 tickets from €249. F1 on the Strip! Sphere Grandstand, Strip View, VIP Hospitality. Night race past casinos. 100% Buyer Protection. €10 cheaper!"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-600/30 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/12801/pexels-photo-12801.jpeg')] opacity-15 bg-cover bg-center" />
        
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-pink-500/20 border border-pink-500/30 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-pink-600" />
            <span className="text-pink-600 font-medium">F1 Meets Las Vegas! 🎰</span>
          </div>
          
          <Badge className="bg-red-50 text-red-600 border-red-200 mb-6">
            <Flag className="w-4 h-4 mr-2" />Formula 1® World Championship
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Las Vegas Grand Prix 2026
            <span className="block text-2xl md:text-3xl mt-2 text-slate-500">Las Vegas Strip • Nevada, USA</span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-3xl mx-auto mb-8">
            F1 on the world's most famous street! Race past the Bellagio, Caesars Palace, 
            and The Sphere. The ultimate entertainment spectacle. <strong className="text-emerald-600">€10 cheaper!</strong>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
              <Calendar className="w-5 h-5 text-pink-600" />
              <span>November 20-22, 2026</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
              <MapPin className="w-5 h-5 text-pink-600" />
              <span>Las Vegas, USA</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-violet-50 rounded-full">
              <Moon className="w-5 h-5 text-violet-600" />
              <span>Night Race</span>
            </div>
          </div>

          <div className="inline-block bg-white/90 border border-emerald-200 rounded-2xl p-6">
            <div className="text-slate-500 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-emerald-600">€249</div>
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
          <h2 className="text-3xl font-bold mb-8">Las Vegas GP 2026 Tickets</h2>
          <div className="grid gap-4">
            {tickets.map((ticket, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between bg-white border border-slate-100 hover:border-pink-500/30 rounded-2xl p-6 transition-all">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-14 h-14 bg-pink-500/20 rounded-xl flex items-center justify-center">
                    <Ticket className="w-7 h-7 text-pink-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{ticket.section}</h3>
                      {ticket.popular && <Badge className="bg-orange-50 text-orange-600 text-xs">HOT</Badge>}
                    </div>
                    <p className="text-slate-400 text-sm">Las Vegas Grand Prix 2026 • 3-Day Pass</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-emerald-600 text-sm">{ticket.available} left</span>
                  <div className="text-right">
                    <div className="text-xs text-slate-400 line-through">€{ticket.originalPrice}</div>
                    <div className="text-xl font-bold text-emerald-600">€{ticket.price}</div>
                  </div>
                  <Link to="/events?type=f1">
                    <Button className="bg-pink-500 hover:bg-pink-600">Buy Now</Button>
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
          <h2 className="text-2xl font-bold mb-6">About Las Vegas Grand Prix</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-500 mb-4">
              The <strong>Las Vegas Grand Prix</strong> brings F1 to the Entertainment Capital of the World. 
              The 6.2km street circuit runs right down the iconic Las Vegas Strip, past world-famous 
              casinos, hotels, and The Sphere.
            </p>
            <p className="text-slate-500 mb-4">
              Racing at night with the neon lights of Vegas as backdrop creates an unmatched atmosphere. 
              The event combines world-class motorsport with the city's legendary entertainment scene.
            </p>
            <h3 className="text-xl font-bold text-white mt-6 mb-3">Best Grandstands at Las Vegas GP:</h3>
            <ul className="text-slate-500 space-y-2">
              <li>• <strong>Sphere Grandstand</strong> - Views of the world's largest LED screen</li>
              <li>• <strong>Strip View Grandstand</strong> - Classic Vegas backdrop with casinos</li>
              <li>• <strong>Turn 1 Grandstand</strong> - High-speed braking zone action</li>
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
              "Las Vegas GP tickets", "Vegas F1 tickets", "Las Vegas Grand Prix 2026",
              "F1 Las Vegas", "Vegas Strip F1", "Las Vegas F1 hospitality",
              "Vegas GP grandstand", "F1 Vegas night race", "Las Vegas race tickets",
              "buy Vegas GP tickets", "Las Vegas F1 2026", "F1 USA tickets"
            ].map((term, i) => (
              <span key={i} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-sm">
                {term}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-pink-900/30 to-purple-900/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">What Happens in Vegas... F1! 🎰</h2>
          <p className="text-slate-500 mb-8">The most glamorous race weekend of the year</p>
          <Link to="/events?type=f1">
            <Button size="lg" className="bg-pink-500 hover:bg-pink-600 px-8">
              <Ticket className="w-5 h-5 mr-2" />
              Buy Las Vegas GP Tickets
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LasVegasGPPage;
