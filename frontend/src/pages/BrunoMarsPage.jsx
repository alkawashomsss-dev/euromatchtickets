import { Link } from "react-router-dom";
import { Calendar, MapPin, Music, Star, Shield, Users, TrendingUp, Zap, Heart, ChevronDown } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
import ProductSchema from "../components/ProductSchema";
import BreadcrumbSchema from "../components/BreadcrumbSchema";
import { RelatedEventsLinks } from "../components/RelatedEventsLinks";
import { useState } from "react";

const BrunoMarsPage = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const CANONICAL = "https://euromatchtickets.com/bruno-mars-tour-2026";

  const schema = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    "name": "Bruno Mars The Romantic Tour Europe 2026",
    "description": "Buy Bruno Mars The Romantic Tour 2026 tickets from €125. 6 nights Wembley London, Berlin, Amsterdam, Madrid, Milan, Paris. Instant QR delivery.",
    "startDate": "2026-06-21T20:00:00+02:00",
    "endDate": "2026-07-28T23:00:00+01:00",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200",
    "location": { "@type": "Place", "name": "Wembley Stadium", "address": { "@type": "PostalAddress", "addressLocality": "London", "addressCountry": "GB" } },
    "performer": { "@type": "MusicGroup", "name": "Bruno Mars" },
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "offerCount": "747", "lowPrice": "125", "highPrice": "650", "availability": "https://schema.org/InStock", "url": CANONICAL, "validFrom": "2025-01-01" }
  };

  const faqSchema = {
    "@context": "https://schema.org", "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "How much are Bruno Mars 2026 tour tickets?", "acceptedAnswer": { "@type": "Answer", "text": "Bruno Mars The Romantic Tour 2026 tickets start from €125. Floor standing from €185. Golden Circle from €295. VIP packages from €450. Wembley London dates are the most popular. All tickets include FanProtect 100% money-back guarantee." }},
      { "@type": "Question", "name": "When is Bruno Mars touring Europe in 2026?", "acceptedAnswer": { "@type": "Answer", "text": "Bruno Mars tours Europe June 21 to July 28, 2026. Paris Stade de France (Jun 21), Berlin Olympiastadion (Jun 26-29, 3 nights), Amsterdam Johan Cruijff Arena (Jul 2-7, 4 nights), Madrid Metropolitano (Jul 10-11), Milan San Siro (Jul 14-15), London Wembley (Jul 18-28, 6 nights)." }},
      { "@type": "Question", "name": "How many nights is Bruno Mars at Wembley?", "acceptedAnswer": { "@type": "Answer", "text": "Bruno Mars plays 6 nights at Wembley Stadium London from July 18-28, 2026. This makes it the biggest London residency of the tour. Each night features a slightly different setlist with surprise songs." }},
      { "@type": "Question", "name": "What songs does Bruno Mars play on The Romantic Tour?", "acceptedAnswer": { "@type": "Answer", "text": "The setlist includes Uptown Funk, 24K Magic, That's What I Like, Locked Out of Heaven, Just The Way You Are, Grenade, When I Was Your Man, Treasure, Leave The Door Open (Silk Sonic), plus new songs from The Romantic album. 2+ hour show." }},
      { "@type": "Question", "name": "Are Bruno Mars tickets refundable?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. All tickets include FanProtect 100% money-back guarantee. Full refund if cancelled, postponed, or invalid tickets. Instant QR delivery." }},
    ]
  };

  const faqs = [
    { q: "How much are Bruno Mars 2026 tour tickets?", a: "Tickets from €125. Floor standing from €185. Golden Circle from €295. VIP from €450. Wembley dates are most popular. All include FanProtect 100% money-back guarantee." },
    { q: "When is Bruno Mars touring Europe in 2026?", a: "June 21 to July 28. Paris (Jun 21), Berlin (Jun 26-29), Amsterdam (Jul 2-7), Madrid (Jul 10-11), Milan (Jul 14-15), London Wembley (Jul 18-28, 6 nights)." },
    { q: "How many nights at Wembley?", a: "6 nights, July 18-28 — the biggest London residency of the tour. Each night has a different setlist with surprise songs." },
    { q: "What songs does Bruno Mars play?", a: "Uptown Funk, 24K Magic, That's What I Like, Locked Out of Heaven, Just The Way You Are, Grenade, Leave The Door Open (Silk Sonic), plus new album tracks. 2+ hours." },
    { q: "Are tickets refundable?", a: "Yes! FanProtect 100% money-back guarantee. Full refund if cancelled, postponed, or invalid. Instant QR delivery." },
  ];

  const shows = [
    { date: "Jun 21, 2026", venue: "Stade de France", city: "Paris", country: "France", price: 165, tickets: 89 },
    { date: "Jun 26-29, 2026", venue: "Olympiastadion", city: "Berlin", country: "Germany", nights: 3, price: 145, tickets: 156, hot: true },
    { date: "Jul 2-7, 2026", venue: "Johan Cruijff Arena", city: "Amsterdam", country: "Netherlands", nights: 4, price: 155, tickets: 203, hot: true },
    { date: "Jul 10-11, 2026", venue: "Riyadh Air Metropolitano", city: "Madrid", country: "Spain", nights: 2, price: 135, tickets: 134 },
    { date: "Jul 14-15, 2026", venue: "Stadio San Siro", city: "Milan", country: "Italy", nights: 2, price: 145, tickets: 98 },
    { date: "Jul 18-28, 2026", venue: "Wembley Stadium", city: "London", country: "UK", nights: 6, price: 185, tickets: 67, hot: true },
  ];

  return (
    <div className="min-h-screen bg-[#0e0e14]">
      <SEOHead 
        title="Buy Bruno Mars Tour Tickets 2026 | London & Europe From €125"
        description="Buy Bruno Mars The Romantic Tour 2026 tickets from €125. 6 nights Wembley London, Berlin, Amsterdam, Madrid, Milan. Selling Fast. 100% Money-Back Guarantee. Instant QR."
        canonicalUrl={CANONICAL}
        image="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=630&fit=crop"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ProductSchema name="Bruno Mars The Romantic Tour Europe 2026" price={125} highPrice={650} url={CANONICAL} category="concert" venue="Wembley Stadium" city="London" />
      <BreadcrumbSchema items={[{ name: "Home", url: "https://euromatchtickets.com/" }, { name: "Concerts", url: "https://euromatchtickets.com/events?type=concert" }, { name: "Bruno Mars Tour 2026", url: CANONICAL }]} />

      {/* HERO */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-rose-500/10 to-slate-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 mb-4"><Heart className="w-4 h-4 mr-2" />The Romantic Tour</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Bruno Mars
            <span className="block text-2xl md:text-3xl mt-2 bg-gradient-to-r from-purple-400 via-rose-400 to-pink-400 bg-clip-text text-transparent">The Romantic Tour Europe 2026</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">The king of pop returns! 18 stadium shows across 6 European cities. 6 nights at Wembley London. Uptown Funk, 24K Magic, That's What I Like — the ultimate party!</p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full text-sm"><Calendar className="w-4 h-4 text-purple-400" /><span>June — July 2026</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full text-sm"><MapPin className="w-4 h-4 text-purple-400" /><span>6 Cities, 18 Shows</span></div>
          </div>
          <div className="inline-block bg-[#161620] border border-white/10 p-6">
            <div className="text-slate-500 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-white">€125</div>
            <div className="text-emerald-500 text-sm mt-1">100% Money-Back Guarantee</div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="py-4 border-y border-white/5 bg-[#15151e]">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-8 text-sm">
          <span className="flex items-center gap-2 text-emerald-500"><Shield className="w-4 h-4" />100% Verified</span>
          <span className="flex items-center gap-2 text-emerald-500"><Star className="w-4 h-4" />4.8/5 Reviews</span>
          <span className="flex items-center gap-2 text-emerald-500"><Zap className="w-4 h-4" />Instant QR Delivery</span>
        </div>
      </section>

      {/* DATES */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Bruno Mars 2026 European Tour — All Dates & Tickets</h2>
          <div className="grid gap-3">
            {shows.map((show, i) => (
              <Link key={i} to={`/checkout?event=bruno-mars-tour-2026&category=General+Admission&price=${show.price}`} className="group flex flex-col md:flex-row md:items-center justify-between bg-[#1e1e1e] border border-white/5 hover:border-purple-500/30 p-5 transition-all">
                <div className="flex items-center gap-4 mb-3 md:mb-0">
                  <div className="w-12 h-12 bg-purple-500/10 flex items-center justify-center flex-shrink-0"><Music className="w-6 h-6 text-purple-400" /></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold group-hover:text-purple-400 transition-colors">{show.venue}</h3>
                      {show.hot && <Badge className="bg-[#e10600]/10 text-red-500 text-[10px]">HIGH DEMAND</Badge>}
                    </div>
                    <p className="text-slate-500 text-sm">{show.date} — {show.city}, {show.country} {show.nights && <span className="text-purple-400">({show.nights} nights)</span>}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-emerald-500 text-xs">{show.tickets} available</span>
                  <div className="text-right"><div className="text-xs text-slate-500">From</div><div className="text-xl font-bold text-white">€{show.price}</div></div>
                  <Button className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-6">Buy</Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-16 bg-[#0a0a0f]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Bruno Mars The Romantic Tour 2026 — Complete Guide</h2>
          <div className="prose prose-invert max-w-none text-slate-400 space-y-4">
            <p><strong className="text-white">Bruno Mars</strong> (Peter Gene Hernandez) announced <strong className="text-white">The Romantic Tour</strong> for 2026 — his biggest European stadium tour ever! The tour features an incredible <strong className="text-white">6 nights at Wembley Stadium</strong> in London, making it one of the longest residencies at the iconic venue.</p>
            <p>The European leg kicks off at <strong className="text-white">Stade de France in Paris</strong> (June 21), before moving to <strong className="text-white">Olympiastadion Berlin</strong> (3 nights, June 26-29), <strong className="text-white">Johan Cruijff Arena Amsterdam</strong> (4 nights, July 2-7), <strong className="text-white">Riyadh Air Metropolitano Madrid</strong> (2 nights, July 10-11), <strong className="text-white">San Siro Milan</strong> (2 nights, July 14-15), and culminating in <strong className="text-white">6 nights at Wembley London</strong> (July 18-28).</p>
            <h3 className="text-white text-lg">What to Expect</h3>
            <p>Bruno Mars is widely considered the greatest live performer of his generation. The Romantic Tour features a full live band with <strong className="text-white">The Hooligans</strong>, world-class choreography, and a setlist spanning his entire career. Expect 25+ songs including all the hits: <em>Uptown Funk</em>, <em>24K Magic</em>, <em>That's What I Like</em>, <em>Locked Out of Heaven</em>, <em>Just The Way You Are</em>, <em>Grenade</em>, <em>When I Was Your Man</em>, <em>Treasure</em>, <em>Leave The Door Open</em> (Silk Sonic), plus new material from The Romantic album.</p>
            <h3 className="text-white text-lg">Ticket Categories & Prices</h3>
            <p><strong className="text-white">Upper Tier</strong> (from €125) — Full stadium view with giant screens. <strong className="text-white">Lower Tier</strong> (from €165) — Closer to the stage. <strong className="text-white">Floor Standing</strong> (from €185) — In the pit. <strong className="text-white">Golden Circle</strong> (from €295) — Front of stage. <strong className="text-white">VIP</strong> (from €450) — Early entry, exclusive merch, premium bar.</p>
            <p>All tickets include <Link to="/buyer-protection" className="text-[#e10600] hover:underline">FanProtect 100% money-back guarantee</Link> and instant QR delivery.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-[#15151e]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions — Bruno Mars Tour 2026</h2>
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

      <RelatedEventsLinks category="coldplay" title="More Concerts You'll Love" />
    </div>
  );
};

export default BrunoMarsPage;
