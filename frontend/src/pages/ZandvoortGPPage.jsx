import { Link } from "react-router-dom";
import { Calendar, MapPin, Trophy, Star, Shield, Zap, Flag, Ticket } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
import BreadcrumbSchema from "../components/BreadcrumbSchema";
import { EventFAQ, FAQSchemaScript } from "../components/EventFAQ";
import { RelatedEventsLinks } from "../components/RelatedEventsLinks";

const CANONICAL = "https://euromatchtickets.com/f1-dutch-grand-prix-zandvoort-tickets";

const ZandvoortGPPage = () => {
  const schema = {
    "@context": "https://schema.org", "@type": "SportsEvent",
    "name": "F1 Dutch Grand Prix Zandvoort 2026",
    "description": "Buy Dutch Grand Prix 2026 tickets from €189. Circuit Zandvoort, August 29-31. Max Verstappen home race. verified, QR ticket delivery.",
    "startDate": "2026-08-29T10:00:00+02:00", "endDate": "2026-08-31T16:00:00+02:00",
    "eventStatus": "https://schema.org/EventScheduled", "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": "https://images.unsplash.com/photo-1541447271487-09612b3f49f7?w=1200",
    "location": { "@type": "Place", "name": "Circuit Zandvoort", "address": { "@type": "PostalAddress", "addressLocality": "Zandvoort", "addressCountry": "NL" } },
    "performer": { "@type": "SportsTeam", "name": "Formula 1" },
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    
  };

  const faqs = [
    { q: "How much are Dutch GP Zandvoort 2026 tickets?", a: "General Admission from €189. Eastside Grandstand from €389. Main Grandstand from €489. Arie Luyendyk Grandstand from €349. VIP Hospitality from €1,489. Paddock Club from €4,489. All include 100% Buyer protection money-back guarantee." },
    { q: "When is the Dutch Grand Prix 2026?", a: "August 29-31, 2026 at Circuit Zandvoort. Practice on Friday, Qualifying on Saturday, Race on Sunday at 15:00 CET." },
    { q: "Is Max Verstappen racing at Zandvoort 2026?", a: "Yes! The Dutch Grand Prix is Max Verstappen's home race. The atmosphere is legendary — 100,000+ fans dressed in orange creating one of F1's most electric environments." },
    { q: "How to get to Circuit Zandvoort?", a: "By train: Direct service from Amsterdam Centraal to Zandvoort aan Zee (30 min). The circuit is a 10-minute walk from the station. By car: A4 from Amsterdam, but parking is very limited — train strongly recommended." },
    { q: "What is the best grandstand at Zandvoort?", a: "Main Grandstand for start/finish line. Eastside Grandstand for the banked Turn 3 — unique to Zandvoort. Arie Luyendyk Grandstand for great views of the Tarzan corner overtaking zone." },
    { q: "Are Zandvoort F1 tickets refundable?", a: "Yes! Buyer protection cancellation refund policy. Full refund if the race is cancelled. Instant QR delivery to your email." }
  ];

  const tickets = [
    { section: "General Admission", price: 189, desc: "Full 3-day access, open standing areas", available: 156 },
    { section: "Arie Luyendyk Grandstand", price: 349, desc: "Seated, Tarzan corner view, covered", available: 89 },
    { section: "Eastside Grandstand", price: 389, desc: "Banked Turn 3, unique Zandvoort view", available: 67, popular: true },
    { section: "Main Grandstand", price: 489, desc: "Start/finish straight, pit lane view", available: 45, popular: true },
    { section: "VIP Hospitality", price: 1489, desc: "Open bar, gourmet dining, paddock access", available: 23, popular: true },
    { section: "Paddock Club", price: 4489, desc: "Ultimate VIP, pit lane walk, driver meet", available: 8 }
  ];

  return (
    <div className="min-h-screen bg-[#0e0e14]">
      <SEOHead title="Dutch GP 2026 Tickets (Zandvoort F1) — Prices & Availability | EuroMatchTickets" description="Compare Dutch Grand Prix 2026 listings at Circuit Zandvoort, Aug 29-31. Updated prices from €189, grandstand availability and VIP Hospitality. Instant QR delivery." canonicalUrl={CANONICAL} image="https://images.unsplash.com/photo-1541447271487-09612b3f49f7?w=1200" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <FAQSchemaScript faqs={faqs} />
<BreadcrumbSchema items={[{ name: "Home", url: "https://euromatchtickets.com/" }, { name: "F1 Tickets", url: "https://euromatchtickets.com/f1-tickets" }, { name: "Dutch GP Zandvoort", url: CANONICAL }]} />

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/30 via-slate-900 to-slate-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 mb-4"><Trophy className="w-4 h-4 mr-2" />Max Verstappen's Home Race</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Dutch Grand Prix 2026<span className="block text-2xl md:text-3xl mt-2 text-slate-500">Circuit Zandvoort, Netherlands</span></h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">Join 100,000+ fans in the legendary Orange Army. Banked corners, seaside atmosphere, and the loudest crowd in F1. Max's home Grand Prix — unforgettable.</p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full text-sm"><Calendar className="w-4 h-4 text-orange-500" /><span>August 29-31, 2026</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full text-sm"><MapPin className="w-4 h-4 text-orange-500" /><span>Circuit Zandvoort</span></div>
          </div>
          <div className="inline-block bg-[#161620] border border-white/10 p-6">
            <div className="text-slate-500 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-white">€189</div>
            <div className="text-emerald-500 text-sm mt-1">Cancellation refund policy</div>
          </div>
        </div>
      </section>

      <section className="py-4 border-y border-white/5 bg-[#15151e]">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-8 text-sm">
          <span className="flex items-center gap-2 text-emerald-500"><Shield className="w-4 h-4" />Verified</span>
          <span className="flex items-center gap-2 text-emerald-500"><Star className="w-4 h-4" /> Reviews</span>
          <span className="flex items-center gap-2 text-emerald-500"><Zap className="w-4 h-4" />QR ticket delivery</span>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Zandvoort F1 2026 — Tickets & Prices</h2>
          <div className="grid gap-3">
            {tickets.map((t, i) => (
              <Link key={i} to={`/checkout?event=dutch-grand-prix-2026-zandvoort-tickets&category=${encodeURIComponent(t.section)}&price=${t.price}`} className="group flex flex-col md:flex-row md:items-center justify-between bg-[#1e1e1e] border border-white/5 hover:border-orange-500/30 p-5 transition-all">
                <div className="flex items-center gap-4 mb-3 md:mb-0">
                  <div className="w-12 h-12 bg-orange-500/10 flex items-center justify-center flex-shrink-0"><Ticket className="w-6 h-6 text-orange-500" /></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold group-hover:text-orange-500 transition-colors">{t.section}</h3>
                      {t.popular && <Badge className="bg-[#e10600]/10 text-red-500 text-[10px]">HIGH DEMAND</Badge>}
                    </div>
                    <p className="text-slate-500 text-xs">{t.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-orange-500 text-xs">{t.available} left</span>
                  <div className="text-right"><div className="text-xs text-slate-500">From</div><div className="text-xl font-bold text-white">€{t.price}</div></div>
                  <Button className="bg-[#e10600] hover:bg-[#c10500] text-white font-bold px-6">Buy</Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-[#0a0a0f]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Dutch Grand Prix Zandvoort 2026 — Complete Guide</h2>
          <div className="prose prose-invert max-w-none text-slate-400 space-y-4">
            <p>The <strong className="text-white">Dutch Grand Prix</strong> at <strong className="text-white">Circuit Zandvoort</strong> is one of the most spectacular races on the F1 calendar. Located right on the North Sea coast just 30 minutes from Amsterdam, Zandvoort combines world-class racing with an incredible beach town atmosphere. The circuit's unique <strong className="text-white">banked corners</strong> (18-degree banking at Turn 3 and the final corner) are unlike anything else in Formula 1.</p>
            <p>As the home race of <strong className="text-white">Max Verstappen</strong>, the Dutch GP attracts over 100,000 fans per day — the vast majority wearing orange and creating the famous <strong className="text-white">"Orange Army"</strong> atmosphere. The noise when Max passes is deafening. If you want to experience the most passionate, loudest, most colourful crowd in all of motorsport, Zandvoort is where you need to be.</p>
            <h3 className="text-white text-lg">Circuit Layout & Best Viewing Spots</h3>
            <p><strong className="text-white">Main Grandstand</strong> — Start/finish straight with pit lane view. See all the action including pit stops. <strong className="text-white">Eastside Grandstand (Turn 3)</strong> — The famous banked corner. Cars approach at 250km/h on a wall of death. Unique to Zandvoort. <strong className="text-white">Arie Luyendyk Grandstand (Tarzan Corner)</strong> — The heavy braking zone into Turn 1. Best overtaking spot on the circuit.</p>
            <h3 className="text-white text-lg">Getting to Zandvoort</h3>
            <p><strong className="text-white">By train (recommended):</strong> Direct NS Sprinter from Amsterdam Centraal to Zandvoort aan Zee, every 15 minutes, journey time 30 minutes. The station is a 10-minute walk from the circuit gates. <strong className="text-white">By car:</strong> A4/A44 motorways from Amsterdam/The Hague. Parking is extremely limited and expensive — train is strongly recommended. <strong className="text-white">By bicycle:</strong> Many Dutch fans cycle! Dedicated bike parking at the circuit.</p>
            <p>All tickets include <Link to="/buyer-protection" className="text-[#e10600] hover:underline">Buyer protection cancellation refund policy</Link> and QR ticket delivery.</p>
          </div>
        </div>
      </section>

      <EventFAQ faqs={faqs} title="Dutch Grand Prix Zandvoort 2026 — FAQ" />
      <RelatedEventsLinks category="spa-f1" title="More F1 Races You'll Love" />
    </div>
  );
};

export default ZandvoortGPPage;
