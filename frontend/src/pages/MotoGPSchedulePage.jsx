import { Link } from "react-router-dom";
import { Calendar, MapPin, Ticket, Shield, Zap, Star, Bike, HelpCircle, CreditCard, Headphones, Trophy } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";

const MotoGPSchedulePage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "MotoGP 2026 Race Schedule",
    "description": "Complete MotoGP 2026 calendar with all 21 Grand Prix dates, locations, and ticket prices.",
    "numberOfItems": 21
  };

  const races = [
    { round: 1, name: "Qatar GP", location: "Lusail, Qatar", circuit: "Lusail International Circuit", date: "March 6-8", price: 89, night: true },
    { round: 2, name: "Portuguese GP", location: "Portimão, Portugal", circuit: "Autódromo do Algarve", date: "March 20-22", price: 79, featured: false },
    { round: 3, name: "Americas GP", location: "Austin, USA", circuit: "Circuit of the Americas", date: "April 10-12", price: 99, featured: true },
    { round: 4, name: "Spanish GP", location: "Jerez, Spain", circuit: "Circuito de Jerez", date: "April 24-26", price: 69, featured: true },
    { round: 5, name: "French GP", location: "Le Mans, France", circuit: "Circuit Bugatti", date: "May 15-17", price: 79, featured: true },
    { round: 6, name: "Catalunya GP", location: "Barcelona, Spain", circuit: "Circuit de Barcelona-Catalunya", date: "June 5-7", price: 69, featured: true },
    { round: 7, name: "Italian GP", location: "Mugello, Italy", circuit: "Mugello Circuit", date: "June 12-14", price: 79, featured: true, legendary: true },
    { round: 8, name: "Dutch GP", location: "Assen, Netherlands", circuit: "TT Circuit Assen", date: "June 26-28", price: 89, featured: true, legendary: true },
    { round: 9, name: "German GP", location: "Sachsenring, Germany", circuit: "Sachsenring", date: "July 17-19", price: 89, featured: false },
    { round: 10, name: "British GP", location: "Silverstone, UK", circuit: "Silverstone Circuit", date: "Aug 7-9", price: 89, featured: true },
    { round: 11, name: "Austrian GP", location: "Spielberg, Austria", circuit: "Red Bull Ring", date: "Aug 14-16", price: 79, featured: false },
    { round: 12, name: "Aragon GP", location: "Alcañiz, Spain", circuit: "MotorLand Aragón", date: "Sept 4-6", price: 69, featured: false },
    { round: 13, name: "San Marino GP", location: "Misano, Italy", circuit: "Misano World Circuit", date: "Sept 11-13", price: 79, featured: true },
    { round: 14, name: "Japanese GP", location: "Motegi, Japan", circuit: "Twin Ring Motegi", date: "Oct 2-4", price: 99, featured: false },
    { round: 15, name: "Indonesian GP", location: "Mandalika, Indonesia", circuit: "Mandalika Circuit", date: "Oct 16-18", price: 79, featured: false },
    { round: 16, name: "Australian GP", location: "Phillip Island, Australia", circuit: "Phillip Island Circuit", date: "Oct 23-25", price: 99, featured: true },
    { round: 17, name: "Thai GP", location: "Buriram, Thailand", circuit: "Chang International Circuit", date: "Oct 30-Nov 1", price: 69, featured: false },
    { round: 18, name: "Malaysian GP", location: "Sepang, Malaysia", circuit: "Sepang International Circuit", date: "Nov 6-8", price: 79, featured: false },
    { round: 19, name: "Valencia GP", location: "Valencia, Spain", circuit: "Circuit Ricardo Tormo", date: "Nov 13-15", price: 79, featured: true },
  ];

  return (
    <div className="min-h-screen bg-[hsl(210,20%,98%)]">
      <SEOHead 
        title="MotoGP 2026 Schedule & Tickets | Full Calendar"
        description="Complete MotoGP 2026 race schedule with all 21 Grand Prix dates, locations, and tickets. Mugello, Assen, Silverstone, Barcelona. Buy MotoGP tickets from."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-slate-900 to-slate-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <Badge className="bg-orange-50 text-orange-600 border-orange-200 mb-6">
            <Bike className="w-4 h-4 mr-2" />MotoGP™ World Championship
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            MotoGP 2026 Race Schedule
            <span className="block text-2xl md:text-3xl mt-2 text-slate-500">Full Calendar & Tickets for All 21 Races</span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-3xl mx-auto mb-8">
            Complete MotoGP 2026 calendar with dates, locations, and ticket prices. 
            Book your MotoGP tickets now - <strong className="text-emerald-600">prices from €69!</strong>
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
              <Bike className="w-5 h-5 text-orange-600" /><span>21 Races</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
              <Calendar className="w-5 h-5 text-orange-600" /><span>March - November 2026</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
              <MapPin className="w-5 h-5 text-orange-600" /><span>19 Countries</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-6 border-y border-slate-100 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-emerald-600"><Shield className="w-5 h-5" /><span>100% Ticket Guarantee</span></div>
            <div className="flex items-center gap-2 text-emerald-600"><Zap className="w-5 h-5" /><span>Instant QR Delivery</span></div>
            <div className="flex items-center gap-2 text-emerald-600"><Star className="w-5 h-5" /><span>30% Cheaper</span></div>
          </div>
        </div>
      </section>

      {/* Full Schedule */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Complete MotoGP 2026 Calendar</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white border-b border-slate-200">
                  <th className="py-4 px-4 text-left">Round</th>
                  <th className="py-4 px-4 text-left">Race</th>
                  <th className="py-4 px-4 text-left">Circuit</th>
                  <th className="py-4 px-4 text-left">Date</th>
                  <th className="py-4 px-4 text-right">From</th>
                  <th className="py-4 px-4 text-center">Tickets</th>
                </tr>
              </thead>
              <tbody>
                {races.map((race) => (
                  <tr key={race.round} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">
                        {race.round}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{race.name}</span>
                        {race.legendary && <Badge className="bg-amber-50 text-amber-600 text-xs"><Trophy className="w-3 h-3" /></Badge>}
                      </div>
                      <div className="text-sm text-slate-400">{race.location}</div>
                    </td>
                    <td className="py-4 px-4 text-slate-500 text-sm">{race.circuit}</td>
                    <td className="py-4 px-4 text-slate-500">{race.date}</td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-emerald-600 font-bold">€{race.price}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Link to="/motogp-tickets">
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                          <Ticket className="w-4 h-4 mr-1" />Buy
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Featured Races */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">🏆 Legendary MotoGP Circuits</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {races.filter(r => r.legendary || r.featured).slice(0, 6).map((race) => (
              <Link 
                key={race.round} 
                to="/motogp-tickets"
                className="bg-white border border-slate-200 hover:border-orange-500/50 rounded-xl p-4 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-orange-50 text-orange-600 text-xs">Round {race.round}</Badge>
                  {race.legendary && <Trophy className="w-4 h-4 text-amber-600" />}
                </div>
                <h3 className="font-bold group-hover:text-orange-600 transition-colors">{race.name}</h3>
                <p className="text-sm text-slate-400 mb-3">{race.date} • {race.location}</p>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-600 font-bold">From €{race.price}</span>
                  <Bike className="w-4 h-4 text-slate-400 group-hover:text-orange-600" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-orange-600" />MotoGP 2026 Schedule FAQ
          </h2>
          <div className="space-y-4">
            {[
              { q: "How many MotoGP races are there in 2026?", a: "The 2026 MotoGP season features 21 Grand Prix races across 19 countries, running from March to November." },
              { q: "When does the 2026 MotoGP season start?", a: "The 2026 MotoGP season begins with the Qatar GP on March 6-8, 2026 at Lusail International Circuit." },
              { q: "What is the best MotoGP race to attend?", a: "Mugello (Italian GP) and Assen (Dutch GP) are legendary for their atmosphere. They're considered the 'must-see' MotoGP events." },
              { q: "What is the cheapest MotoGP race?", a: "Spanish GP at Jerez and Catalunya GP at Barcelona offer tickets from €69 - best value in MotoGP!" },
            ].map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                <p className="text-slate-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-900/30 to-red-900/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready for MotoGP 2026?</h2>
          <p className="text-slate-500 mb-8">Book your tickets now and save up to 30%</p>
          <Link to="/motogp-tickets">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 px-8">
              <Ticket className="w-5 h-5 mr-2" />Browse All MotoGP Tickets
            </Button>
          </Link>
        </div>
      </section>

      {/* SEO Keywords */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-lg font-bold mb-4">Related Searches:</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "MotoGP 2026 schedule", "MotoGP calendar 2026", "MotoGP race dates",
              "MotoGP 2026 races", "MotoGP season 2026", "when is Mugello MotoGP",
              "MotoGP tickets 2026", "motorcycle racing schedule", "MotoGP European races"
            ].map((term, i) => (
              <span key={i} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-sm">{term}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MotoGPSchedulePage;
