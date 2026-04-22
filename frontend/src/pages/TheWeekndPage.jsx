import { Link } from "react-router-dom";
import { Calendar, MapPin, Ticket, Music, Star, Shield, Users, TrendingUp, Zap, ChevronDown } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
import ProductSchema from "../components/ProductSchema";
import BreadcrumbSchema from "../components/BreadcrumbSchema";
import { RelatedEventsLinks } from "../components/RelatedEventsLinks";
import { useState } from "react";

const TheWeekndPage = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const CANONICAL = "https://euromatchtickets.com/the-weeknd-tour-2026";

  const schema = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    "name": "The Weeknd After Hours Til Dawn Tour 2026",
    "description": "Buy The Weeknd 2026 European tour tickets from €95. After Hours Til Dawn stadium tour. Paris, London, Berlin, Amsterdam, Milan, Madrid. Instant QR delivery.",
    "startDate": "2026-06-11T20:00:00+02:00",
    "endDate": "2026-07-08T23:00:00+02:00",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200",
    "location": {
      "@type": "Place",
      "name": "Stade de France",
      "address": { "@type": "PostalAddress", "addressLocality": "Paris", "addressCountry": "FR" }
    },
    "performer": { "@type": "MusicGroup", "name": "The Weeknd" },
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR",
              "offerCount": "436", "lowPrice": "95", "highPrice": "450", "availability": "https://schema.org/InStock", "url": CANONICAL, "validFrom": "2025-01-01" }
  };

  const faqSchema = {
    "@context": "https://schema.org", "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "How much are The Weeknd 2026 tour tickets?", "acceptedAnswer": { "@type": "Answer", "text": "The Weeknd After Hours Til Dawn Tour 2026 tickets start from €95 for upper tier seats. Floor standing from €145. Golden Circle from €195. VIP packages from €350. All prices include 100% Buyer protection money-back guarantee and QR ticket delivery." }},
      { "@type": "Question", "name": "When is The Weeknd touring Europe in 2026?", "acceptedAnswer": { "@type": "Answer", "text": "The Weeknd's European stadium tour runs June 11 to July 8, 2026. Dates include Paris Stade de France (Jun 11), London Wembley (Jun 15), Berlin Olympiastadion (Jun 20), Amsterdam Johan Cruijff Arena (Jun 25), Milan San Siro (Jul 2), and Madrid Metropolitano (Jul 8)." }},
      { "@type": "Question", "name": "What songs does The Weeknd play live?", "acceptedAnswer": { "@type": "Answer", "text": "The Weeknd's setlist features 25+ songs including Blinding Lights, Save Your Tears, Starboy, The Hills, Can't Feel My Face, Die For You, I Feel It Coming, Earned It, and tracks from his latest album. The show runs approximately 2 hours with a spectacular visual production." }},
      { "@type": "Question", "name": "Are The Weeknd tickets refundable?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Every ticket purchased through EuroMatchTickets includes Buyer protection cancellation refund policy. If the concert is cancelled or postponed, you receive a full refund. If tickets are invalid, you get 100% of your money back." }},
      { "@type": "Question", "name": "Where is the best seat for The Weeknd concert?", "acceptedAnswer": { "@type": "Answer", "text": "For the best experience: Golden Circle offers closest proximity to the stage. Floor Standing B1-B4 provides great energy. Lower tier seats offer the best balance of view and comfort. The Weeknd's production has massive screens visible from all sections." }},
    ]
  };

  const faqs = [
    { q: "How much are The Weeknd 2026 tour tickets?", a: "Tickets start from €95 for upper tier. Floor standing from €145. Golden Circle from €195. VIP from €350. All include Buyer protection cancellation refund policy and QR ticket delivery." },
    { q: "When is The Weeknd touring Europe in 2026?", a: "June 11 to July 8, 2026. Six cities: Paris (Jun 11), London Wembley (Jun 15), Berlin (Jun 20), Amsterdam (Jun 25), Milan (Jul 2), Madrid (Jul 8)." },
    { q: "What songs does The Weeknd play live?", a: "25+ songs: Blinding Lights, Save Your Tears, Starboy, The Hills, Can't Feel My Face, Die For You, I Feel It Coming, Earned It, plus new album tracks. 2-hour spectacular show." },
    { q: "Are The Weeknd tickets refundable?", a: "Yes! Buyer protection cancellation refund policy on every ticket. Full refund if cancelled or postponed. If tickets are invalid, 100% refund." },
    { q: "Where is the best seat for The Weeknd concert?", a: "Golden Circle for closest to stage. Floor Standing B1-B4 for energy. Lower tier for balanced view. Massive screens visible from all sections." },
    { q: "How are tickets delivered?", a: "Instant QR code delivery to your email within minutes of purchase. Show the QR code on your phone at the venue entrance. No printing needed." },
  ];

  const shows = [
    { date: "Jun 11, 2026", time: "20:00", venue: "Stade de France", city: "Paris", price: 125, tickets: 89 },
    { date: "Jun 15, 2026", time: "19:30", venue: "Wembley Stadium", city: "London", price: 145, tickets: 56, hot: true },
    { date: "Jun 20, 2026", time: "20:00", venue: "Olympiastadion", city: "Berlin", price: 115, tickets: 72 },
    { date: "Jun 25, 2026", time: "20:00", venue: "Johan Cruijff Arena", city: "Amsterdam", price: 135, tickets: 41, hot: true },
    { date: "Jul 2, 2026", time: "20:30", venue: "San Siro", city: "Milan", price: 110, tickets: 95 },
    { date: "Jul 8, 2026", time: "21:00", venue: "Estadio Metropolitano", city: "Madrid", price: 105, tickets: 83 },
  ];

  return (
    <div className="min-h-screen bg-[#0e0e14]">
      <SEOHead 
        title="Buy The Weeknd Tour Tickets 2026 | Europe From €95"
        description="Buy The Weeknd After Hours Til Dawn 2026 tickets from €95. Paris, London, Berlin, Amsterdam, Milan, Madrid. Selling Fast. Cancellation refund policy. Instant QR delivery."
        canonicalUrl={CANONICAL}
        image="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=630&fit=crop"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ProductSchema name="The Weeknd After Hours Til Dawn Tour 2026" price={95} highPrice={450} url={CANONICAL} category="concert" venue="Multiple Stadiums" city="Europe" />
      <BreadcrumbSchema items={[{ name: "Home", url: "https://euromatchtickets.com/" }, { name: "Concerts", url: "https://euromatchtickets.com/events?type=concert" }, { name: "The Weeknd Tour 2026", url: CANONICAL }]} />

      {/* HERO */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-slate-900 to-slate-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <Badge className="bg-[#e10600]/10 text-red-500 border-[#e10600]/20 mb-4"><Music className="w-4 h-4 mr-2" />Stadium World Tour</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            The Weeknd
            <span className="block text-2xl md:text-3xl mt-2 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">After Hours Til Dawn Tour 2026</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">The most spectacular concert production ever — Blinding Lights, Save Your Tears, Starboy live in stadiums across Europe. 6 cities, 6 unforgettable nights.</p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full text-sm"><Calendar className="w-4 h-4 text-red-500" /><span>June — July 2026</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full text-sm"><MapPin className="w-4 h-4 text-red-500" /><span>6 European Cities</span></div>
          </div>
          <div className="inline-block bg-[#161620] border border-white/10 p-6">
            <div className="text-slate-500 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-white">€95</div>
            <div className="text-emerald-500 text-sm mt-1">Cancellation refund policy</div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="py-4 border-y border-white/5 bg-[#15151e]">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-8 text-sm">
          <span className="flex items-center gap-2 text-emerald-500"><Shield className="w-4 h-4" />Verified Tickets</span>
          <span className="flex items-center gap-2 text-emerald-500"><Star className="w-4 h-4" />4.8/5 from 1 Reviews</span>
          <span className="flex items-center gap-2 text-emerald-500"><Zap className="w-4 h-4" />QR ticket delivery</span>
        </div>
      </section>

      {/* TOUR DATES */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">The Weeknd 2026 European Tour Dates & Tickets</h2>
          <div className="grid gap-3">
            {shows.map((show, i) => (
              <Link key={i} to={`/checkout?event=the-weeknd-tour-2026&category=General+Admission&price=${show.price}`} className="group flex flex-col md:flex-row md:items-center justify-between bg-[#1e1e1e] border border-white/5 hover:border-[#e10600]/30 p-5 transition-all">
                <div className="flex items-center gap-4 mb-3 md:mb-0">
                  <div className="w-12 h-12 bg-[#e10600]/10 flex items-center justify-center flex-shrink-0"><Music className="w-6 h-6 text-red-500" /></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold group-hover:text-[#e10600] transition-colors">{show.venue}</h3>
                      {show.hot && <Badge className="bg-orange-500/10 text-orange-500 text-[10px]">SELLING FAST</Badge>}
                    </div>
                    <p className="text-slate-500 text-sm">{show.date} at {show.time} — {show.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-orange-500 text-xs">{show.tickets} left</span>
                  <div className="text-right"><div className="text-xs text-slate-500">From</div><div className="text-xl font-bold text-white">€{show.price}</div></div>
                  <Button className="bg-[#e10600] hover:bg-[#c10500] text-white font-bold px-6">Buy</Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* RICH CONTENT */}
      <section className="py-16 bg-[#0a0a0f]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">The Weeknd After Hours Til Dawn Tour 2026 — Everything You Need to Know</h2>
          <div className="prose prose-invert max-w-none text-slate-400 space-y-4">
            <p><strong className="text-white">The Weeknd</strong> (Abel Tesfaye) brings his record-breaking <strong className="text-white">After Hours Til Dawn Tour</strong> to European stadiums in summer 2026. After selling out arenas worldwide, this stadium tour is the biggest concert production The Weeknd has ever created — featuring a completely reimagined stage design, pyrotechnics, floating platforms, and immersive LED visuals spanning the entire stadium.</p>
            <p>The tour kicks off at <strong className="text-white">Stade de France in Paris</strong> on June 11, 2026, followed by <strong className="text-white">Wembley Stadium in London</strong> (June 15), <strong className="text-white">Olympiastadion Berlin</strong> (June 20), <strong className="text-white">Johan Cruijff Arena Amsterdam</strong> (June 25), <strong className="text-white">San Siro Milan</strong> (July 2), and closing at <strong className="text-white">Estadio Metropolitano Madrid</strong> (July 8).</p>
            <h3 className="text-white text-lg">Expected Setlist</h3>
            <p>The 2-hour show features 25+ songs spanning The Weeknd's entire career: <em>Blinding Lights</em>, <em>Save Your Tears</em>, <em>Starboy</em>, <em>The Hills</em>, <em>Can't Feel My Face</em>, <em>Die For You</em>, <em>I Feel It Coming</em>, <em>Earned It</em>, <em>Heartless</em>, <em>In Your Eyes</em>, plus new material from his upcoming album. The After Hours era songs feature a completely dark, cinematic production that transforms the stadium into an immersive experience.</p>
            <h3 className="text-white text-lg">Ticket Categories</h3>
            <p><strong className="text-white">Upper Tier</strong> (from €95) — Great sightlines with full view of the spectacular production. <strong className="text-white">Floor Standing</strong> (from €145) — Close to the stage with incredible energy. <strong className="text-white">Golden Circle</strong> (from €195) — Closest to the main stage. <strong className="text-white">VIP Packages</strong> (from €350) — Includes early entry, exclusive merchandise, and premium viewing.</p>
            <p>All tickets on EuroMatchTickets are <strong className="text-white">verified</strong> by our team and come with <Link to="/buyer-protection" className="text-[#e10600] hover:underline">Buyer protection money-back guarantee</Link>. Tickets are delivered instantly as QR codes to your email — no waiting, no printing needed.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-[#15151e]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions — The Weeknd Tour 2026</h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-white/5 bg-[#1e1e1e]">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
                  <span className="font-semibold text-white text-sm">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && <div className="px-4 pb-4 text-slate-400 text-sm">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED */}
      <RelatedEventsLinks category="taylor-swift" title="More Concerts You'll Love" />
    </div>
  );
};

export default TheWeekndPage;
