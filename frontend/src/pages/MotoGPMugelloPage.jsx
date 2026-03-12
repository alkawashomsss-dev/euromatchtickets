import { Link } from "react-router-dom";
import { Calendar, MapPin, Ticket, Shield, Zap, Star, Bike, HelpCircle, CreditCard, Headphones } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";

const MotoGPMugelloPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": "Italian MotoGP 2026 Mugello",
    "description": "Buy Italian MotoGP 2026 tickets at Mugello Circuit. The cathedral of motorcycling. General admission and grandstand tickets.",
    "startDate": "2026-06-12",
    "endDate": "2026-06-14",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": "https://euromatchtickets.com/logo.png",
    "location": { "@type": "Place", "name": "Mugello Circuit", "address": { "@type": "PostalAddress", "addressLocality": "Scarperia e San Piero", "addressCountry": "IT" } },
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "79", "highPrice": "849", "availability": "https://schema.org/InStock" }
  };

  const tickets = [
    { section: "General Admission", price: 79, originalPrice: 89, available: 567, popular: false },
    { section: "Tribuna Centrale", price: 149, originalPrice: 159, available: 189, popular: true },
    { section: "Tribuna Poggio Secco", price: 129, originalPrice: 139, available: 234, popular: true },
    { section: "Tribuna Materassi", price: 139, originalPrice: 149, available: 156, popular: false },
    { section: "VIP Village", price: 489, originalPrice: 499, available: 45, popular: true },
    { section: "Paddock Experience", price: 799, originalPrice: 849, available: 18, popular: false },
  ];

  const faqs = [
    { q: "Why is Mugello special for MotoGP?", a: "Mugello is called 'The Cathedral' of motorcycling. The passionate Italian fans (Tifosi), stunning Tuscan scenery, and challenging circuit make it the best MotoGP atmosphere." },
    { q: "Are Mugello tickets mobile?", a: "Yes, instant mobile QR delivery via email. Print option also available." },
    { q: "What's the best grandstand at Mugello?", a: "Tribuna Centrale offers the best overall views. Poggio Secco is great for the famous uphill section." },
    { q: "Can I camp at Mugello?", a: "Yes! Free camping areas are available for ticket holders. Book early as they fill up fast!" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <SEOHead 
        title="Italian MotoGP Tickets 2026 - Mugello | The Cathedral of Motorcycling"
        description="Buy Italian MotoGP 2026 Mugello tickets from €79. The best atmosphere in motorcycle racing! Tribuna Centrale, Poggio Secco. 100% Ticket Guarantee. Instant delivery!"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/30 via-zinc-900 to-zinc-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-6">
            <Bike className="w-4 h-4 mr-2" />The Cathedral of Motorcycling 🏍️
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Italian MotoGP 2026 Tickets
            <span className="block text-2xl md:text-3xl mt-2 text-zinc-400">Mugello Circuit • Tuscany, Italy 🇮🇹</span>
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
            Experience the best atmosphere in motorcycle racing! The passionate Tifosi, beautiful Tuscany, 
            and legendary circuit. <strong className="text-emerald-400">Tickets from €79!</strong>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full">
              <Calendar className="w-5 h-5 text-green-400" /><span>June 12-14, 2026</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full">
              <MapPin className="w-5 h-5 text-green-400" /><span>Mugello, Italy</span>
            </div>
          </div>

          <div className="inline-block bg-zinc-900/80 border border-emerald-500/30 rounded-2xl p-6">
            <div className="text-zinc-400 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-emerald-400">€79</div>
          </div>
        </div>
      </section>

      <section className="py-6 border-y border-white/5 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 justify-center text-emerald-400"><Shield className="w-5 h-5" /><span className="text-sm">100% Guarantee</span></div>
            <div className="flex items-center gap-2 justify-center text-emerald-400"><CreditCard className="w-5 h-5" /><span className="text-sm">Secure Checkout</span></div>
            <div className="flex items-center gap-2 justify-center text-emerald-400"><Zap className="w-5 h-5" /><span className="text-sm">Instant Delivery</span></div>
            <div className="flex items-center gap-2 justify-center text-emerald-400"><Headphones className="w-5 h-5" /><span className="text-sm">24/7 Support</span></div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Buy Mugello MotoGP 2026 Tickets</h2>
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
                    <p className="text-zinc-500 text-sm">Italian MotoGP 2026 • 3-Day Pass</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-emerald-400 text-sm">{ticket.available} left</span>
                  <div className="text-right">
                    <div className="text-xs text-zinc-500 line-through">€{ticket.originalPrice}</div>
                    <div className="text-xl font-bold text-emerald-400">€{ticket.price}</div>
                  </div>
                  <Link to="/events"><Button className="bg-green-500 hover:bg-green-600">Buy Now</Button></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2"><HelpCircle className="w-6 h-6 text-green-400" />Mugello MotoGP FAQ</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-zinc-900/50 border border-zinc-700 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                <p className="text-zinc-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">About Mugello MotoGP</h2>
          <div className="prose prose-invert max-w-none text-zinc-400">
            <p className="mb-4">
              <strong>Mugello Circuit</strong> is known as "The Cathedral" of motorcycle racing. Located in the beautiful 
              Tuscan hills near Florence, it offers the most passionate atmosphere in MotoGP thanks to the legendary Italian Tifosi.
            </p>
            <p className="mb-4">
              The circuit is famous for its long main straight (1.1km), challenging elevation changes, and the iconic 
              Arrabiata corners. Italian riders like Rossi, Dovizioso, and Bagnaia have created unforgettable moments here.
            </p>
            <h3 className="text-xl font-bold text-white mt-6 mb-3">Best Grandstands at Mugello:</h3>
            <ul className="space-y-2">
              <li>• <strong>Tribuna Centrale</strong> - Main grandstand with start/finish views</li>
              <li>• <strong>Poggio Secco</strong> - Famous uphill section, great overtaking</li>
              <li>• <strong>Materassi</strong> - Technical section with close action</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-lg font-bold mb-4">Related Searches:</h3>
          <div className="flex flex-wrap gap-2">
            {["Mugello MotoGP tickets", "Italian MotoGP 2026", "Mugello tickets", "MotoGP Italy", 
              "Mugello grandstand", "buy Mugello tickets", "MotoGP Tuscany", "Mugello camping"].map((term, i) => (
              <span key={i} className="px-3 py-1 bg-zinc-800/50 text-zinc-400 rounded-full text-sm">{term}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-green-900/30 to-red-900/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Experience The Cathedral!</h2>
          <p className="text-zinc-400 mb-8">The most passionate MotoGP atmosphere awaits</p>
          <Link to="/motogp-tickets">
            <Button size="lg" className="bg-green-500 hover:bg-green-600 px-8">
              <Ticket className="w-5 h-5 mr-2" />View All MotoGP Tickets
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MotoGPMugelloPage;
