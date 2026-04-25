import { Link } from "react-router-dom";
import { Calendar, MapPin, Music, Star, Shield, Zap, Skull } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
import BreadcrumbSchema from "../components/BreadcrumbSchema";
import { EventFAQ, FAQSchemaScript } from "../components/EventFAQ";
import { RelatedEventsLinks } from "../components/RelatedEventsLinks";

const CANONICAL = "https://euromatchtickets.com/guns-n-roses-tour-2026";

const GunsNRosesPage = () => {
  const schema = {
    "@context": "https://schema.org", "@type": "MusicEvent",
    "name": "Guns N' Roses European Stadium Tour 2026",
    "description": "Buy Guns N' Roses 2026 European tour tickets from €95. Berlin, London, Hamburg, Cologne, Munich, Marseille. 3+ hour stadium rock shows.",
    "startDate": "2026-06-13T19:00:00+02:00", "endDate": "2026-07-17T23:30:00+02:00",
    "eventStatus": "https://schema.org/EventScheduled", "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200",
    "location": { "@type": "Place", "name": "Olympiastadion Berlin", "address": { "@type": "PostalAddress", "addressLocality": "Berlin", "addressCountry": "DE" } },
    "performer": { "@type": "MusicGroup", "name": "Guns N' Roses" },
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    
  };

  const faqs = [
    { q: "How much are Guns N' Roses 2026 tour tickets?", a: "Tickets start from €95 for upper tier. Lower tier from €145. Floor standing from €175. Golden Circle from €295. VIP packages from €395. All include Buyer protection cancellation refund policy and QR ticket delivery." },
    { q: "When are Guns N' Roses playing in Europe 2026?", a: "June 13 to July 17, 2026. Berlin (Jun 13), Arnhem (Jun 23), Cologne (Jun 26), London Tottenham (Jun 27), Marseille (Jul 1), Hamburg (Jul 3-4), Munich (Jul 17)." },
    { q: "How long is a Guns N' Roses concert?", a: "Guns N' Roses are legendary for their marathon sets — typically 3 to 3.5 hours! One of the longest rock performances you'll ever see. Doors open 2 hours before showtime." },
    { q: "What songs do Guns N' Roses play live?", a: "Sweet Child O' Mine, Paradise City, Welcome to the Jungle, November Rain, Patience, Knockin' on Heaven's Door, Nightrain, Mr. Brownstone, Rocket Queen, Civil War, Estranged, and 20+ more classics. 35-40 songs per show." },
    { q: "Are Guns N' Roses tickets refundable?", a: "Yes! Buyer protection cancellation refund policy on every ticket. Full refund if cancelled or postponed. Instant QR delivery." }
  ];

  const shows = [
    { date: "Sat, Jun 13, 2026", time: "19:00", venue: "Olympiastadion", city: "Berlin", country: "Germany", price: 125, tickets: 145 },
    { date: "Tue, Jun 23, 2026", time: "19:30", venue: "Gelredome", city: "Arnhem", country: "Netherlands", price: 115, tickets: 89 },
    { date: "Fri, Jun 26, 2026", time: "19:00", venue: "RheinEnergieSTADION", city: "Cologne", country: "Germany", price: 120, tickets: 112 },
    { date: "Sat, Jun 27, 2026", time: "19:30", venue: "Tottenham Hotspur Stadium", city: "London", country: "UK", price: 145, tickets: 78, hot: true },
    { date: "Wed, Jul 1, 2026", time: "20:00", venue: "Stade Vélodrome", city: "Marseille", country: "France", price: 115, tickets: 134 },
    { date: "Jul 3-4, 2026", time: "19:00", venue: "Volksparkstadion", city: "Hamburg", country: "Germany", nights: 2, price: 125, tickets: 167, hot: true },
    { date: "Fri, Jul 17, 2026", time: "19:00", venue: "Olympiastadion", city: "Munich", country: "Germany", price: 130, tickets: 95 }
  ];

  return (
    <div className="min-h-screen bg-[#0e0e14]">
      <SEOHead title="Buy Guns N' Roses Tour Tickets 2026 | Europe From €95" description="Buy Guns N' Roses 2026 European stadium tour tickets from €95. Berlin, London, Hamburg, Cologne, Munich. 3+ hour shows. Cancellation refund policy. Instant QR." canonicalUrl={CANONICAL} image="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <FAQSchemaScript faqs={faqs} />
<BreadcrumbSchema items={[{ name: "Home", url: "https://euromatchtickets.com/" }, { name: "Concerts", url: "https://euromatchtickets.com/events?type=concert" }, { name: "Guns N' Roses Tour 2026", url: CANONICAL }]} />

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/15 via-red-500/10 to-slate-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <Badge className="bg-[#e10600]/10 text-red-500 border-[#e10600]/20 mb-4"><Skull className="w-4 h-4 mr-2" />Stadium Rock Tour</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Guns N' Roses<span className="block text-2xl md:text-3xl mt-2 bg-gradient-to-r from-amber-400 via-red-500 to-amber-400 bg-clip-text text-transparent">European Stadium Tour 2026</span></h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">Axl Rose, Slash & Duff McKagan bring the most dangerous band in the world to European stadiums. 3+ hour marathon rock shows across 7 cities.</p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full text-sm"><Calendar className="w-4 h-4 text-amber-400" /><span>June — July 2026</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full text-sm"><MapPin className="w-4 h-4 text-amber-400" /><span>7 Cities, 8 Shows</span></div>
          </div>
          <div className="inline-block bg-[#161620] border border-white/10 p-6">
            <div className="text-slate-500 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-white">€95</div>
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
          <h2 className="text-2xl font-bold mb-8 text-center">Guns N' Roses 2026 — All European Dates & Tickets</h2>
          <div className="grid gap-3">
            {shows.map((show, i) => (
              <Link key={i} to={`/checkout?event=guns-n-roses-tour-2026&category=General+Admission&price=${show.price}`} className="group flex flex-col md:flex-row md:items-center justify-between bg-[#1e1e1e] border border-white/5 hover:border-amber-500/30 p-5 transition-all">
                <div className="flex items-center gap-4 mb-3 md:mb-0">
                  <div className="w-12 h-12 bg-amber-500/10 flex items-center justify-center flex-shrink-0"><Music className="w-6 h-6 text-amber-400" /></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold group-hover:text-amber-400 transition-colors">{show.venue}</h3>
                      {show.hot && <Badge className="bg-[#e10600]/10 text-red-500 text-[10px]">HIGH DEMAND</Badge>}
                    </div>
                    <p className="text-slate-500 text-sm">{show.date} at {show.time} — {show.city}, {show.country} {show.nights && <span className="text-amber-400">({show.nights} nights)</span>}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-emerald-500 text-xs">{show.tickets} left</span>
                  <div className="text-right"><div className="text-xs text-slate-500">From</div><div className="text-xl font-bold text-white">€{show.price}</div></div>
                  <Button className="bg-[#e10600] hover:bg-[#c10500] text-white font-bold px-6">Buy</Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-[#0a0a0f]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Guns N' Roses European Tour 2026 — Complete Guide</h2>
          <div className="prose prose-invert max-w-none text-slate-400 space-y-4">
            <p><strong className="text-white">Guns N' Roses</strong> — Axl Rose, Slash, and Duff McKagan — return to Europe for their 2026 stadium tour, bringing the most electrifying rock show on the planet. Known for legendary 3+ hour marathon sets, GN'R delivers one of the longest and most intense live rock experiences you'll ever witness.</p>
            <p>The tour opens at <strong className="text-white">Olympiastadion Berlin</strong> (June 13), followed by <strong className="text-white">Gelredome Arnhem</strong> (June 23), <strong className="text-white">RheinEnergieSTADION Cologne</strong> (June 26), <strong className="text-white">Tottenham Hotspur Stadium London</strong> (June 27), <strong className="text-white">Stade Vélodrome Marseille</strong> (July 1), <strong className="text-white">2 nights at Volksparkstadion Hamburg</strong> (July 3-4), and closing at <strong className="text-white">Olympiastadion Munich</strong> (July 17).</p>
            <h3 className="text-white text-lg">Expected Setlist (35-40 songs)</h3>
            <p>The marathon setlist spans the entire GN'R catalogue: <em>Sweet Child O' Mine</em>, <em>Paradise City</em>, <em>Welcome to the Jungle</em>, <em>November Rain</em> (with full orchestral intro), <em>Patience</em>, <em>Knockin' on Heaven's Door</em>, <em>Nightrain</em>, <em>Mr. Brownstone</em>, <em>Rocket Queen</em>, <em>Civil War</em>, <em>Estranged</em>, <em>Don't Cry</em>, <em>You Could Be Mine</em>, <em>Live and Let Die</em>, plus Slash's iconic guitar solos.</p>
            <h3 className="text-white text-lg">Ticket Categories</h3>
            <p><strong className="text-white">Upper Tier</strong> (from €95). <strong className="text-white">Lower Tier</strong> (from €145). <strong className="text-white">Floor Standing</strong> (from €175). <strong className="text-white">Golden Circle</strong> (from €295). <strong className="text-white">VIP</strong> (from €395).</p>
            <p>All tickets include <Link to="/buyer-protection" className="text-[#e10600] hover:underline">Buyer protection cancellation refund policy</Link> and QR ticket delivery to your email.</p>
          </div>
        </div>
      </section>

      <EventFAQ faqs={faqs} title="Guns N' Roses Tour 2026 — FAQ" />
      <RelatedEventsLinks category="coldplay" title="More Concerts You'll Love" />
    </div>
  );
};

export default GunsNRosesPage;
