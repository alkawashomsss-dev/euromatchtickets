import { Link } from "react-router-dom";
import { Calendar, MapPin, Trophy, Star, Shield, Users, TrendingUp, Zap, Flag, Ticket, Sunset } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
import BreadcrumbSchema from "../components/BreadcrumbSchema";

const AbuDhabiGPPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": "Abu Dhabi Grand Prix 2026",
    "description": "Buy Abu Dhabi Grand Prix 2026 tickets. F1 Season Finale at Yas Marina Circuit. Twilight race, VIP Hospitality, Paddock Club tickets.",
    "startDate": "2026-12-06",
    "endDate": "2026-12-07",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": "https://euromatchtickets.com/logo-192.png",
    "location": {
      "@type": "Place",
      "name": "Yas Marina Circuit",
      "address": { "@type": "PostalAddress", "addressLocality": "Abu Dhabi", "addressCountry": "AE" }
    },
    "performer": {"@type": "SportsTeam", "name": "Formula 1 - FIA"},
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    
  };

  const tickets = [
    { section: "North Grandstand", price: 169, originalPrice: 179, available: 189, popular: false },
    { section: "Main Grandstand", price: 289, originalPrice: 299, available: 78, popular: true },
    { section: "West Grandstand", price: 249, originalPrice: 259, available: 112, popular: false },
    { section: "Marina Grandstand", price: 389, originalPrice: 399, available: 45, popular: true },
    { section: "VIP Hospitality", price: 1489, originalPrice: 1499, available: 28, popular: true },
    { section: "Paddock Club", price: 4489, originalPrice: 4499, available: 9, popular: false }
  ];

  return (
    <div className="min-h-screen bg-[#0e0e14]">
      <SEOHead 
        title="Abu Dhabi GP 2026 Tickets (Yas Marina F1) — Prices & Availability | EuroMatchTickets"
        description="Compare Abu Dhabi Grand Prix 2026 listings at Yas Marina Circuit. Updated prices from €169, twilight-race grandstands, Marina, North & VIP Hospitality. Instant QR delivery."
        image="https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200&h=630&fit=crop"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <BreadcrumbSchema items={[{ name: "Home", url: "https://euromatchtickets.com/" }, { name: "F1 Tickets", url: "https://euromatchtickets.com/f1-tickets" }, { name: "Abu Dhabi GP 2026", url: "https://euromatchtickets.com/f1-abu-dhabi-grand-prix-tickets" }]} />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/30 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/12801/pexels-photo-12801.jpeg')] opacity-15 bg-cover bg-center" />
        
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-200 rounded-full px-4 py-2 mb-6">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span className="text-amber-600 font-medium">F1 Season Finale 2026! 🏆</span>
          </div>
          
          <Badge className="bg-[#e10600]/10 text-red-600 border-red-200 mb-6">
            <Flag className="w-4 h-4 mr-2" />Formula 1® World Championship
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Abu Dhabi Grand Prix 2026
            <span className="block text-2xl md:text-3xl mt-2 text-slate-500">Yas Marina Circuit • UAE</span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-3xl mx-auto mb-8">
            The spectacular season finale! Watch the sun set as champions are crowned. 
            The iconic Yas Hotel and marina backdrop. <strong className="text-emerald-600">€10 cheaper than competitors!</strong>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full">
              <Calendar className="w-5 h-5 text-amber-600" />
              <span>December 4-6, 2026</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full">
              <MapPin className="w-5 h-5 text-amber-600" />
              <span>Abu Dhabi, UAE</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-full">
              <Sunset className="w-5 h-5 text-amber-600" />
              <span>Twilight Race</span>
            </div>
          </div>

          <div className="inline-block bg-white/90 border border-emerald-200 rounded-none p-6">
            <div className="text-slate-500 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-emerald-600">€169</div>
            <div className="text-emerald-600 text-sm mt-1">Season finale</div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-6 border-y border-white/5 bg-[#15151e]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-emerald-600"><Shield className="w-5 h-5" /><span>Buyer protection</span></div>
            <div className="flex items-center gap-2 text-emerald-600"><Star className="w-5 h-5" /><span>Verified Tickets</span></div>
            <div className="flex items-center gap-2 text-emerald-600"><TrendingUp className="w-5 h-5" /><span>€10 Cheaper</span></div>
            <div className="flex items-center gap-2 text-emerald-600"><Zap className="w-5 h-5" /><span>QR delivery</span></div>
          </div>
        </div>
      </section>

      {/* Tickets */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Abu Dhabi GP 2026 Tickets</h2>
          <div className="grid gap-4">
            {tickets.map((ticket, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between bg-[#1e1e1e] border border-white/5 hover:border-amber-200 rounded-none p-6 transition-all">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-14 h-14 bg-amber-500/10 rounded-none flex items-center justify-center">
                    <Ticket className="w-7 h-7 text-amber-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{ticket.section}</h3>
                      {ticket.popular && <Badge className="bg-orange-500/10 text-orange-600 text-xs">POPULAR</Badge>}
                    </div>
                    <p className="text-slate-400 text-sm">Abu Dhabi Grand Prix 2026 • 3-Day Pass</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-emerald-600 text-sm">{ticket.available} left</span>
                  <div className="text-right">
                    <div className="text-xs text-slate-400 line-through">€{ticket.originalPrice}</div>
                    <div className="text-xl font-bold text-emerald-600">€{ticket.price}</div>
                  </div>
                  <Link to="/checkout?event=abu-dhabi-grand-prix-2026">
                    <Button className="bg-amber-500/100 hover:bg-amber-600 text-black">Buy Now</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 bg-[#15151e]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">About Abu Dhabi Grand Prix</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-500 mb-4">
              The <strong>Abu Dhabi Grand Prix</strong> has been the F1 season finale since 2009. 
              Yas Marina Circuit is famous for hosting dramatic championship deciders, including 
              the legendary 2021 finale. The twilight start means racing from daylight into darkness.
            </p>
            <p className="text-slate-500 mb-4">
              The circuit winds through the iconic Yas Hotel (the only hotel you can drive through!) 
              and alongside the beautiful marina. Post-race concerts feature global superstars.
            </p>
            <h3 className="text-xl font-bold text-white mt-6 mb-3">Best Grandstands at Abu Dhabi GP:</h3>
            <ul className="text-slate-500 space-y-2">
              <li>• <strong>Main Grandstand</strong> - Start/finish straight with podium views</li>
              <li>• <strong>Marina Grandstand</strong> - Stunning backdrop with yachts and Yas Hotel</li>
              <li>• <strong>North Grandstand</strong> - Great value with good circuit views</li>
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
              "Abu Dhabi GP tickets", "Yas Marina F1 tickets", "Abu Dhabi Grand Prix 2026",
              "F1 Abu Dhabi", "UAE F1 tickets", "Abu Dhabi F1 hospitality",
              "Yas Marina grandstand", "F1 season finale", "Abu Dhabi race tickets",
              "buy Abu Dhabi GP tickets", "Abu Dhabi F1 2026", "F1 finale tickets"
            ].map((term, i) => (
              <span key={i} className="px-3 py-1 bg-[#15151e] text-slate-500 rounded-full text-sm">
                {term}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-amber-900/30 to-orange-900/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Be There for the 2026 F1 Finale!</h2>
          <p className="text-slate-500 mb-8">Where champions are crowned under the lights of Yas Marina</p>
          <Link to="/checkout?event=abu-dhabi-grand-prix-2026">
            <Button size="lg" className="bg-amber-500/100 hover:bg-amber-600 text-black px-8">
              <Ticket className="w-5 h-5 mr-2" />
              Buy Abu Dhabi GP Tickets
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AbuDhabiGPPage;
