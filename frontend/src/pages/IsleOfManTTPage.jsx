import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Ticket, Shield, Zap, Star, Bike, HelpCircle, CreditCard, Headphones, Trophy, Mountain, Clock, AlertTriangle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";

const IsleOfManTTPage = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": "Isle of Man TT 2026",
    "description": "Buy Isle of Man TT 2026 tickets. The world's most dangerous motorcycle race. Grandstand, VIP hospitality, and race week passes.",
    "startDate": "2026-05-30",
    "endDate": "2026-06-13",
    "location": { "@type": "Place", "name": "Snaefell Mountain Course", "address": "Isle of Man, British Isles" },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "45", "highPrice": "599" }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "When is Isle of Man TT 2026?", "acceptedAnswer": { "@type": "Answer", "text": "The Isle of Man TT 2026 runs from May 30th to June 13th, 2026. Practice week starts May 30th, with racing from June 6th-13th." }},
      { "@type": "Question", "name": "How do I get Isle of Man TT tickets?", "acceptedAnswer": { "@type": "Answer", "text": "Most areas around the 37.73-mile course are free to watch. Grandstand tickets (start/finish) and VIP hospitality require purchase. We offer instant delivery." }},
      { "@type": "Question", "name": "Are Isle of Man TT tickets mobile?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, all grandstand and VIP tickets are delivered instantly via email as mobile QR codes. Print option also available." }},
      { "@type": "Question", "name": "What's included in TT VIP tickets?", "acceptedAnswer": { "@type": "Answer", "text": "VIP packages include premium grandstand seating, hospitality suite access, gourmet food, open bar, paddock tours, and rider meet & greets." }}
    ]
  };

  const raceSchedule = [
    { day: "Saturday May 30", event: "Practice Week Begins", type: "practice" },
    { day: "Saturday June 6", event: "Superbike TT Race", type: "race", featured: true },
    { day: "Sunday June 7", event: "Sidecar TT Race 1", type: "race" },
    { day: "Monday June 8", event: "Supersport TT Race 1", type: "race" },
    { day: "Wednesday June 10", event: "Superstock TT Race", type: "race" },
    { day: "Friday June 12", event: "Senior TT Race", type: "race", featured: true },
    { day: "Saturday June 13", event: "Sidecar TT Race 2", type: "race" },
  ];

  const tickets = [
    { name: "Grandstand Day Pass", price: 45, desc: "Single race day at the start/finish grandstand", popular: false },
    { name: "Grandstand Week Pass", price: 149, desc: "Full race week access to grandstand (June 6-13)", popular: true },
    { name: "Practice Week Pass", price: 79, desc: "Access to all practice sessions (May 30 - June 5)", popular: false },
    { name: "Full TT Fortnight Pass", price: 199, desc: "Complete 2-week access: practice + all races", popular: true },
    { name: "VIP Hospitality Day", price: 299, desc: "Premium seating, food, drinks, paddock access", popular: true },
    { name: "VIP Full Week Package", price: 599, desc: "Ultimate TT experience with all VIP benefits", popular: false },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <SEOHead 
        title="Isle of Man TT Tickets 2026 - Buy TT Race Tickets | Grandstand & VIP Passes"
        description="Buy Isle of Man TT 2026 tickets from €45. The world's most dangerous motorcycle race! Grandstand passes, VIP hospitality, practice week. May 30 - June 13, 2026. Instant delivery. 100% guarantee."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 via-zinc-900 to-zinc-950" />
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/2611686/pexels-photo-2611686.jpeg')] opacity-10 bg-cover bg-center" />
        
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-2 mb-6">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-red-400 font-medium">The World's Most Dangerous Race</span>
          </div>
          
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-6 ml-2">
            <Trophy className="w-4 h-4 mr-2" />Since 1907 - 117 Years of Racing History
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Isle of Man TT 2026 Tickets
            <span className="block text-2xl md:text-3xl mt-2 text-zinc-400">Snaefell Mountain Course • May 30 - June 13</span>
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
            Experience the legendary TT races! 37.73 miles of public roads, average speeds over 135mph. 
            The ultimate test of man and machine. <strong className="text-emerald-400">Grandstand tickets from €45!</strong>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full">
              <Calendar className="w-5 h-5 text-red-400" /><span>May 30 - June 13, 2026</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full">
              <MapPin className="w-5 h-5 text-red-400" /><span>Isle of Man, British Isles</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full">
              <Mountain className="w-5 h-5 text-red-400" /><span>37.73 Mile Course</span>
            </div>
          </div>

          <div className="inline-block bg-zinc-900/80 border border-emerald-500/30 rounded-2xl p-6">
            <div className="text-zinc-400 text-sm">Grandstand tickets from</div>
            <div className="text-5xl font-bold text-emerald-400">€45</div>
            <div className="text-emerald-400 text-sm mt-1">VIP Hospitality from €299</div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-6 border-y border-white/5 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 justify-center text-emerald-400"><Shield className="w-5 h-5" /><span className="text-sm">100% Ticket Guarantee</span></div>
            <div className="flex items-center gap-2 justify-center text-emerald-400"><CreditCard className="w-5 h-5" /><span className="text-sm">Secure Checkout</span></div>
            <div className="flex items-center gap-2 justify-center text-emerald-400"><Zap className="w-5 h-5" /><span className="text-sm">Instant QR Delivery</span></div>
            <div className="flex items-center gap-2 justify-center text-emerald-400"><Headphones className="w-5 h-5" /><span className="text-sm">24/7 Support</span></div>
          </div>
        </div>
      </section>

      {/* Race Schedule */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Isle of Man TT 2026 Race Schedule</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {raceSchedule.map((item, i) => (
              <div 
                key={i} 
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  item.featured 
                    ? 'bg-red-500/10 border-red-500/30' 
                    : 'bg-zinc-900/50 border-zinc-700'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  item.type === 'race' ? 'bg-red-500/20' : 'bg-zinc-700'
                }`}>
                  {item.type === 'race' ? <Trophy className="w-6 h-6 text-red-400" /> : <Clock className="w-6 h-6 text-zinc-400" />}
                </div>
                <div className="flex-1">
                  <div className="font-bold">{item.event}</div>
                  <div className="text-sm text-zinc-500">{item.day}</div>
                </div>
                {item.featured && <Badge className="bg-red-500/20 text-red-400">Main Event</Badge>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tickets */}
      <section className="py-16 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Buy Isle of Man TT 2026 Tickets</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tickets.map((ticket, i) => (
              <div 
                key={i} 
                className={`bg-zinc-900/50 border rounded-xl p-6 transition-all ${
                  ticket.popular ? 'border-red-500/50' : 'border-zinc-700 hover:border-zinc-500'
                }`}
              >
                {ticket.popular && (
                  <Badge className="bg-red-500/20 text-red-400 mb-4">Most Popular</Badge>
                )}
                <h3 className="text-xl font-bold mb-2">{ticket.name}</h3>
                <p className="text-zinc-400 text-sm mb-4">{ticket.desc}</p>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-emerald-400">€{ticket.price}</div>
                  <Button className="bg-red-500 hover:bg-red-600">
                    <Ticket className="w-4 h-4 mr-2" />Buy
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About TT */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">About the Isle of Man TT</h2>
          <div className="prose prose-invert max-w-none text-zinc-400">
            <p className="mb-4">
              The <strong>Isle of Man TT</strong> (Tourist Trophy) is the oldest and most prestigious motorcycle road race in the world. 
              First held in 1907, it takes place on the 37.73-mile Snaefell Mountain Course - a circuit of closed public roads 
              featuring everything from tight villages to high-speed mountain sections.
            </p>
            <p className="mb-4">
              Riders reach speeds exceeding <strong>200mph</strong> on some sections, with lap averages over 135mph. 
              The event attracts 40,000+ spectators annually and is considered the ultimate challenge in motorcycle racing.
            </p>
            <h3 className="text-xl font-bold text-white mt-6 mb-3">Key TT 2026 Races:</h3>
            <ul className="space-y-2">
              <li>• <strong>Superbike TT</strong> - 6 laps, the blue riband event featuring the fastest machines</li>
              <li>• <strong>Senior TT</strong> - The most prestigious race, traditionally held on the final Friday</li>
              <li>• <strong>Supersport TT</strong> - 4 laps on 600cc machines</li>
              <li>• <strong>Sidecar TT</strong> - Spectacular 3-wheel racing with driver and passenger</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-red-400" />
            Isle of Man TT Tickets FAQ
          </h2>
          <div className="space-y-4">
            {[
              { q: "When is Isle of Man TT 2026?", a: "The Isle of Man TT 2026 runs from May 30th to June 13th, 2026. Practice week is May 30 - June 5, with racing June 6-13." },
              { q: "Do I need tickets for Isle of Man TT?", a: "Most of the 37.73-mile course is FREE to watch from public areas. Grandstand tickets (start/finish) and VIP hospitality require purchase." },
              { q: "How do I receive my TT tickets?", a: "Instant email delivery as mobile QR codes. Show your phone at entry or print the PDF. Delivered within minutes of purchase." },
              { q: "What's included in VIP hospitality?", a: "Premium grandstand seating, hospitality suite with gourmet food, open bar, paddock access, rider meet & greets, and exclusive merchandise." },
              { q: "Is Isle of Man TT worth attending?", a: "Absolutely! It's a bucket-list event for motorsport fans. The atmosphere, speed, and history are unmatched. Many areas are free, making it affordable." },
              { q: "How do I get to the Isle of Man?", a: "Fly to Ronaldsway Airport (IOM) or take the Steam Packet ferry from Liverpool, Heysham, or Dublin. Book accommodation early - it sells out!" },
            ].map((faq, i) => (
              <div key={i} className="bg-zinc-900/50 border border-zinc-700 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                <p className="text-zinc-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Buy From Us */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Why Buy TT Tickets From EuroMatchTickets?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "100% Guarantee", desc: "Full refund if tickets invalid" },
              { icon: Zap, title: "Instant Delivery", desc: "QR tickets via email" },
              { icon: Star, title: "Best Prices", desc: "No hidden fees" },
              { icon: Headphones, title: "24/7 Support", desc: "Help when you need it" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 mx-auto bg-red-500/20 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-7 h-7 text-red-400" />
                </div>
                <h3 className="font-bold mb-1">{item.title}</h3>
                <p className="text-zinc-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Events */}
      <section className="py-16 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">More Motorcycle Racing Events</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link to="/motogp-tickets" className="bg-zinc-900/50 border border-zinc-700 hover:border-orange-500/50 rounded-xl p-6 transition-all">
              <Bike className="w-10 h-10 text-orange-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">MotoGP 2026</h3>
              <p className="text-zinc-400 text-sm mb-4">21 Grand Prix races worldwide</p>
              <span className="text-emerald-400">From €69 →</span>
            </Link>
            <Link to="/motogp-mugello-tickets" className="bg-zinc-900/50 border border-zinc-700 hover:border-green-500/50 rounded-xl p-6 transition-all">
              <Trophy className="w-10 h-10 text-green-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Italian MotoGP Mugello</h3>
              <p className="text-zinc-400 text-sm mb-4">The Cathedral of motorcycling</p>
              <span className="text-emerald-400">From €79 →</span>
            </Link>
            <Link to="/f1-tickets" className="bg-zinc-900/50 border border-zinc-700 hover:border-red-500/50 rounded-xl p-6 transition-all">
              <Star className="w-10 h-10 text-red-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Formula 1 2026</h3>
              <p className="text-zinc-400 text-sm mb-4">24 Grand Prix races worldwide</p>
              <span className="text-emerald-400">From €99 →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-red-900/30 to-amber-900/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Experience the Legendary Isle of Man TT!</h2>
          <p className="text-zinc-400 mb-8">The world's most dangerous and thrilling motorcycle race</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="bg-red-500 hover:bg-red-600 px-8">
              <Ticket className="w-5 h-5 mr-2" />Buy TT Grandstand Tickets
            </Button>
            <Link to="/isle-of-man-tt-schedule">
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 px-8">
                View Full Schedule
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
              "Isle of Man TT tickets", "TT 2026 tickets", "Isle of Man TT 2026",
              "buy TT tickets", "TT grandstand tickets", "TT VIP tickets",
              "Isle of Man TT schedule", "TT race week", "Snaefell Mountain Course",
              "motorcycle road racing", "TT hospitality", "Isle of Man TT dates"
            ].map((term, i) => (
              <span key={i} className="px-3 py-1 bg-zinc-800/50 text-zinc-400 rounded-full text-sm">{term}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default IsleOfManTTPage;
