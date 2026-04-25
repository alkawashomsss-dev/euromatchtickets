import { Link } from "react-router-dom";
import { Calendar, MapPin, Music, Star, Shield, Users, TrendingUp, Zap, Flame } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
import BreadcrumbSchema from "../components/BreadcrumbSchema";
import { EventFAQ, FAQSchemaScript } from "../components/EventFAQ";
import { RelatedEventsLinks } from "../components/RelatedEventsLinks";

const CANONICAL = "https://euromatchtickets.com/bad-bunny-london-2026";

const BadBunnyPage = () => {
  const schema = {
    "@context": "https://schema.org", "@type": "MusicEvent",
    "name": "Bad Bunny DeBi TiRAR MaS FOToS Tour London 2026",
    "description": "Buy Bad Bunny London 2026 tickets from €145. Tottenham Hotspur Stadium, June 27-28. verified, QR ticket delivery.",
    "startDate": "2026-06-27T19:30:00+01:00", "endDate": "2026-06-28T23:00:00+01:00",
    "eventStatus": "https://schema.org/EventScheduled", "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200",
    "location": { "@type": "Place", "name": "Tottenham Hotspur Stadium", "address": { "@type": "PostalAddress", "addressLocality": "London", "addressCountry": "GB" } },
    "performer": { "@type": "MusicGroup", "name": "Bad Bunny" },
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    
  };

  const faqs = [
    { q: "How much are Bad Bunny London 2026 tickets?", a: "Bad Bunny London tickets start from €145 for upper tier. Lower tier from €225. Floor standing from €295. Golden Circle from €395. VIP packages from €550. All include Buyer protection cancellation refund policy." },
    { q: "When is Bad Bunny playing in London?", a: "Bad Bunny performs 2 nights at Tottenham Hotspur Stadium: Saturday June 27 and Sunday June 28, 2026. Doors open at 17:30, show starts at 19:30." },
    { q: "Where is the Bad Bunny concert in London?", a: "Tottenham Hotspur Stadium, 782 High Road, London N17. Nearest stations: White Hart Lane (rail) or Tottenham Hale (Victoria line). 62,850 capacity." },
    { q: "What songs will Bad Bunny play?", a: "Expected setlist: Titi Me Pregunto, Me Porto Bonito, Moscow Mule, Ojitos Lindos, Dakiti, Callaita, Yonaguni, Efecto, Neverita, plus new album tracks. 2-hour spectacular show with pyrotechnics." },
    { q: "Are Bad Bunny tickets refundable?", a: "Yes! All tickets include Buyer protection cancellation refund policy. Full refund if cancelled or postponed. Instant QR delivery to your email." }
  ];

  const shows = [
    { date: "Sat, Jun 27, 2026", time: "19:30", venue: "Tottenham Hotspur Stadium", city: "London", price: 175, tickets: 89, hot: true },
    { date: "Sun, Jun 28, 2026", time: "19:30", venue: "Tottenham Hotspur Stadium", city: "London", price: 185, tickets: 56, hot: true }
  ];

  return (
    <div className="min-h-screen bg-[#0e0e14]">
      <SEOHead title="Buy Bad Bunny London Tickets 2026 | Tottenham Stadium From €145" description="Buy Bad Bunny London 2026 tickets from €145. Tottenham Hotspur Stadium, June 27-28. DeBi TiRAR MaS FOToS Tour. Available. Cancellation refund policy. Instant QR." canonicalUrl={CANONICAL} image="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <FAQSchemaScript faqs={faqs} />
<BreadcrumbSchema items={[{ name: "Home", url: "https://euromatchtickets.com/" }, { name: "Concerts", url: "https://euromatchtickets.com/events?type=concert" }, { name: "Bad Bunny London 2026", url: CANONICAL }]} />

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-slate-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30 mb-4"><Music className="w-4 h-4 mr-2" />World Tour</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Bad Bunny<span className="block text-2xl md:text-3xl mt-2 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">DeBi TiRAR MaS FOToS Tour — London 2026</span></h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">The most streamed artist in the world performs 2 stadium nights in London. Titi Me Pregunto, Dakiti, Moscow Mule — El Conejo Malo live at Tottenham Stadium!</p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full text-sm"><Calendar className="w-4 h-4 text-pink-400" /><span>June 27-28, 2026</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full text-sm"><MapPin className="w-4 h-4 text-pink-400" /><span>Tottenham Hotspur Stadium</span></div>
          </div>
          <div className="inline-block bg-[#161620] border border-white/10 p-6">
            <div className="text-slate-500 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-white">€145</div>
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
          <h2 className="text-2xl font-bold mb-8 text-center">Bad Bunny London 2026 — Dates & Tickets</h2>
          <div className="grid gap-3">
            {shows.map((show, i) => (
              <Link key={i} to={`/checkout?event=bad-bunny-london-2026&category=General+Admission&price=${show.price}`} className="group flex flex-col md:flex-row md:items-center justify-between bg-[#1e1e1e] border border-white/5 hover:border-pink-500/30 p-5 transition-all">
                <div className="flex items-center gap-4 mb-3 md:mb-0">
                  <div className="w-12 h-12 bg-pink-500/10 flex items-center justify-center flex-shrink-0"><Music className="w-6 h-6 text-pink-400" /></div>
                  <div>
                    <h3 className="font-bold group-hover:text-pink-400 transition-colors">{show.venue}</h3>
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

      <section className="py-14 bg-[#0a0a0f]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Bad Bunny in London 2026 — Complete Guide</h2>
          <div className="prose prose-invert max-w-none text-slate-400 space-y-4">
            <p><strong className="text-white">Bad Bunny</strong> (Benito Antonio Martínez Ocasio) — the most streamed artist on Spotify worldwide — brings his <strong className="text-white">DeBi TiRAR MaS FOToS</strong> world tour to London for 2 stadium nights at <strong className="text-white">Tottenham Hotspur Stadium</strong> on June 27-28, 2026. With a 62,850-seat capacity, these will be the biggest Latin music shows ever held in the UK.</p>
            <p>Known as "El Conejo Malo," Bad Bunny has revolutionized Latin music with reggaeton, trap, and genre-bending experimentation. His live shows are legendary — featuring elaborate stage designs, pyrotechnics, dancers, and a 2-hour setlist spanning his entire discography.</p>
            <h3 className="text-white text-lg">Expected Setlist</h3>
            <p><em>Titi Me Pregunto</em>, <em>Me Porto Bonito</em>, <em>Moscow Mule</em>, <em>Ojitos Lindos</em>, <em>Dakiti</em>, <em>Callaita</em>, <em>Yonaguni</em>, <em>Efecto</em>, <em>Neverita</em>, <em>Vete</em>, <em>Yo Perreo Sola</em>, <em>La Noche de Anoche</em>, plus tracks from DeBi TiRAR MaS FOToS and unreleased material.</p>
            <h3 className="text-white text-lg">Getting to Tottenham Stadium</h3>
            <p><strong className="text-white">By train:</strong> White Hart Lane station (direct from Liverpool Street, 25 min). <strong className="text-white">By tube:</strong> Tottenham Hale (Victoria line) + 15 min walk. <strong className="text-white">By bus:</strong> Routes 149, 259, 279. Parking is extremely limited — public transport strongly recommended.</p>
            <p>All tickets include <Link to="/buyer-protection" className="text-[#e10600] hover:underline">Buyer protection cancellation refund policy</Link> and QR ticket delivery.</p>
          </div>
        </div>
      </section>

      <EventFAQ faqs={faqs} title="Bad Bunny London 2026 — FAQ" />
      <RelatedEventsLinks category="coldplay" title="More Concerts You'll Love" />
    </div>
  );
};

export default BadBunnyPage;
