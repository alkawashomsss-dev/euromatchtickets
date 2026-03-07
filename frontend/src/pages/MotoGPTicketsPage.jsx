import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Ticket, Flag, Trophy, ChevronRight, Shield, Zap, Star, Bike } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";

const MotoGPTicketsPage = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "MotoGP 2026 Tickets",
    "description": "Buy MotoGP 2026 tickets for all Grand Prix races. Best prices for motorcycle racing events.",
    "numberOfItems": 21
  };

  const races = [
    { name: "Qatar GP", location: "Lusail, Qatar", date: "March 6-8", price: 89, href: "/motogp-qatar-tickets", featured: true },
    { name: "Portuguese GP", location: "Portimão, Portugal", date: "March 20-22", price: 79, href: "/motogp-portugal-tickets", featured: false },
    { name: "Americas GP", location: "Austin, USA", date: "April 10-12", price: 99, href: "/motogp-austin-tickets", featured: true },
    { name: "Spanish GP", location: "Jerez, Spain", date: "April 24-26", price: 69, href: "/motogp-jerez-tickets", featured: true },
    { name: "French GP", location: "Le Mans, France", date: "May 15-17", price: 79, href: "/motogp-france-tickets", featured: true },
    { name: "Catalunya GP", location: "Barcelona, Spain", date: "June 5-7", price: 69, href: "/motogp-barcelona-tickets", featured: true },
    { name: "Italian GP", location: "Mugello, Italy", date: "June 12-14", price: 79, href: "/motogp-mugello-tickets", featured: true },
    { name: "German GP", location: "Sachsenring, Germany", date: "July 17-19", price: 89, href: "/motogp-germany-tickets", featured: false },
    { name: "Dutch GP", location: "Assen, Netherlands", date: "June 26-28", price: 89, href: "/motogp-assen-tickets", featured: true },
    { name: "British GP", location: "Silverstone, UK", date: "Aug 7-9", price: 89, href: "/motogp-silverstone-tickets", featured: true },
    { name: "Austrian GP", location: "Spielberg, Austria", date: "Aug 14-16", price: 79, href: "/motogp-austria-tickets", featured: false },
    { name: "Aragon GP", location: "Alcañiz, Spain", date: "Sept 4-6", price: 69, href: "/motogp-aragon-tickets", featured: false },
    { name: "San Marino GP", location: "Misano, Italy", date: "Sept 11-13", price: 79, href: "/motogp-misano-tickets", featured: true },
    { name: "Japanese GP", location: "Motegi, Japan", date: "Oct 2-4", price: 99, href: "/motogp-japan-tickets", featured: false },
    { name: "Indonesian GP", location: "Mandalika, Indonesia", date: "Oct 16-18", price: 79, href: "/motogp-indonesia-tickets", featured: false },
    { name: "Australian GP", location: "Phillip Island, Australia", date: "Oct 23-25", price: 99, href: "/motogp-australia-tickets", featured: true },
    { name: "Thai GP", location: "Buriram, Thailand", date: "Oct 30-Nov 1", price: 69, href: "/motogp-thailand-tickets", featured: false },
    { name: "Malaysian GP", location: "Sepang, Malaysia", date: "Nov 6-8", price: 79, href: "/motogp-malaysia-tickets", featured: false },
    { name: "Valencia GP", location: "Valencia, Spain", date: "Nov 13-15", price: 79, href: "/motogp-valencia-tickets", featured: true },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <SEOHead 
        title="MotoGP Tickets 2026 - Buy Motorcycle Grand Prix Tickets | All Races"
        description="Buy MotoGP 2026 tickets from €69. All 21 Grand Prix races. Mugello, Silverstone, Assen, Barcelona, Valencia. 100% Ticket Guarantee. Instant delivery. Best prices!"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/30 via-zinc-900 to-zinc-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 mb-6">
            <Bike className="w-4 h-4 mr-2" />MotoGP™ World Championship
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            MotoGP Tickets 2026
            <span className="block text-2xl md:text-3xl mt-2 text-zinc-400">21 Races • World's Best Motorcycle Racing</span>
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
            Experience the thrill of MotoGP! Watch Marquez, Bagnaia, and Martin battle at 350 km/h. 
            <strong className="text-emerald-400"> Tickets from €69 - Best prices guaranteed!</strong>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full">
              <Flag className="w-5 h-5 text-orange-400" /><span>21 Races</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full">
              <Calendar className="w-5 h-5 text-orange-400" /><span>March - November 2026</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-500/30">
              <Ticket className="w-5 h-5 text-emerald-400" /><span className="text-emerald-400">From €69</span>
            </div>
          </div>

          <div className="inline-block bg-zinc-900/80 border border-emerald-500/30 rounded-2xl p-6">
            <div className="text-zinc-400 text-sm">General Admission from</div>
            <div className="text-5xl font-bold text-emerald-400">€69</div>
            <div className="text-emerald-400 text-sm mt-1">Save 30% vs official MotoGP.com</div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-6 border-y border-white/5 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-emerald-400"><Shield className="w-5 h-5" /><span>100% Ticket Guarantee</span></div>
            <div className="flex items-center gap-2 text-emerald-400"><Zap className="w-5 h-5" /><span>Instant QR Delivery</span></div>
            <div className="flex items-center gap-2 text-emerald-400"><Star className="w-5 h-5" /><span>30% Cheaper</span></div>
          </div>
        </div>
      </section>

      {/* Featured Races */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">🏍️ Featured MotoGP Races 2026</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {races.filter(r => r.featured).map((race, i) => (
              <Link 
                key={i} 
                to={race.href}
                className="bg-zinc-900/50 border border-zinc-700 hover:border-orange-500/50 rounded-xl p-5 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge className="bg-orange-500/20 text-orange-400">{race.date}</Badge>
                  <Bike className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold group-hover:text-orange-400 transition-colors mb-1">{race.name}</h3>
                <p className="text-zinc-500 text-sm mb-4 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />{race.location}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-zinc-500 text-sm">From </span>
                    <span className="text-emerald-400 font-bold text-xl">€{race.price}</span>
                  </div>
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                    <Ticket className="w-4 h-4 mr-1" />Buy
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Full Schedule Table */}
      <section className="py-16 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Complete MotoGP 2026 Schedule</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-900/50 border-b border-zinc-700">
                  <th className="py-4 px-4 text-left">Race</th>
                  <th className="py-4 px-4 text-left">Location</th>
                  <th className="py-4 px-4 text-left">Date</th>
                  <th className="py-4 px-4 text-right">From</th>
                  <th className="py-4 px-4 text-center">Tickets</th>
                </tr>
              </thead>
              <tbody>
                {races.map((race, i) => (
                  <tr key={i} className="border-b border-zinc-800 hover:bg-zinc-900/30">
                    <td className="py-4 px-4 font-medium">{race.name}</td>
                    <td className="py-4 px-4 text-zinc-400">{race.location}</td>
                    <td className="py-4 px-4 text-zinc-400">{race.date}</td>
                    <td className="py-4 px-4 text-right text-emerald-400 font-bold">€{race.price}</td>
                    <td className="py-4 px-4 text-center">
                      <Link to={race.href}>
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600">Buy</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Ticket Categories */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">MotoGP Ticket Types</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-zinc-900/50 border border-zinc-700 rounded-xl p-6">
              <Ticket className="w-10 h-10 text-emerald-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">General Admission</h3>
              <p className="text-zinc-400 mb-4">Access to open viewing areas around the circuit. Move around and find your perfect spot.</p>
              <div className="text-2xl font-bold text-emerald-400">€69 - €99</div>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-700 rounded-xl p-6">
              <Trophy className="w-10 h-10 text-orange-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Grandstand</h3>
              <p className="text-zinc-400 mb-4">Reserved seat with excellent track views. Choose your preferred corner or straight.</p>
              <div className="text-2xl font-bold text-orange-400">€99 - €199</div>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-700 rounded-xl p-6">
              <Star className="w-10 h-10 text-amber-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">VIP Village</h3>
              <p className="text-zinc-400 mb-4">Premium hospitality with food, drinks, pit lane access, and paddock tours.</p>
              <div className="text-2xl font-bold text-amber-400">€399 - €999</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">MotoGP Tickets FAQ</h2>
          <div className="space-y-4">
            {[
              { q: "How do I receive my MotoGP tickets?", a: "Tickets are delivered instantly via email as mobile QR codes. Show your phone at the gate or print the PDF." },
              { q: "What's the best MotoGP race to attend?", a: "Mugello (Italian GP) and Assen (Dutch GP) are legendary for atmosphere. Barcelona and Valencia offer great value." },
              { q: "Are MotoGP tickets refundable?", a: "Full refund if the race is cancelled. Partial refunds available up to 30 days before the event." },
              { q: "What's included with General Admission?", a: "Access to open viewing areas, big screens, food courts, and merchandise stands. Great for first-timers!" },
            ].map((faq, i) => (
              <div key={i} className="bg-zinc-900/50 border border-zinc-700 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                <p className="text-zinc-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-900/30 to-red-900/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Experience MotoGP 2026!</h2>
          <p className="text-zinc-400 mb-8">The world's most exciting motorcycle racing - live!</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/motogp-mugello-tickets">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 px-8">
                <Ticket className="w-5 h-5 mr-2" />Buy Mugello Tickets
              </Button>
            </Link>
            <Link to="/events">
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 px-8">
                View All Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SEO Keywords */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-lg font-bold mb-4">Related Searches:</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "MotoGP tickets", "MotoGP 2026", "buy MotoGP tickets", "MotoGP Mugello tickets",
              "MotoGP Barcelona tickets", "MotoGP Silverstone", "MotoGP schedule 2026",
              "motorcycle racing tickets", "MotoGP calendar", "MotoGP prices"
            ].map((term, i) => (
              <span key={i} className="px-3 py-1 bg-zinc-800/50 text-zinc-400 rounded-full text-sm">{term}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MotoGPTicketsPage;
