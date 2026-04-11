import { Link } from "react-router-dom";
import { Calendar, MapPin, Trophy, Star, Shield, Zap, Ticket, ChevronRight, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import SEOHead from "../components/SEOHead";
import { BreadcrumbStructuredData, FAQStructuredData } from "../components/StructuredData";

const JuventusHubPage = () => {
  const matches = [
    { home: "Juventus", away: "AC Milan", label: "Serie A Derby", venue: "Allianz Stadium", date: "Mar 2026", price: 95, tickets: 78, hot: true, link: "/events?search=Juventus+Milan" },
    { home: "Juventus", away: "Inter Milan", label: "Derby d'Italia", venue: "Allianz Stadium", date: "Apr 2026", price: 115, tickets: 56, hot: true, link: "/events?search=Juventus+Inter" },
    { home: "Juventus", away: "Napoli", label: "Serie A", venue: "Allianz Stadium", date: "May 2026", price: 85, tickets: 89, hot: true, link: "/events?search=Juventus+Napoli" },
    { home: "Juventus", away: "Roma", label: "Serie A", venue: "Allianz Stadium", date: "Mar 2026", price: 75, tickets: 123, link: "/events?search=Juventus+Roma" },
  ];

  const faqs = [
    { question: "How much are Juventus tickets?", answer: "Juventus tickets on EuroMatchTickets start from €45 for Serie A matches at Allianz Stadium, Turin. Derby d'Italia (vs Inter) from €115. Champions League from €95. We guarantee the cheapest prices." },
    { question: "Where does Juventus play?", answer: "Juventus plays at Allianz Stadium in Turin, Italy. The 41,507-capacity stadium is one of the most modern in Europe, purpose-built in 2011." },
    { question: "What is the Derby d'Italia?", answer: "Derby d'Italia is Juventus vs Inter Milan - Italy's biggest football rivalry. The atmosphere in Turin for this match is absolutely electrifying." },
    { question: "Can tourists buy Juventus tickets?", answer: "Yes! No Juventus membership needed. Buy verified tickets directly on our platform with instant QR delivery and FanProtect guarantee." },
  ];

  const reviewSchema = {
    "@context": "https://schema.org", "image": "https://euromatchtickets.com/og-image.jpg",
    "@type": "Product",
    "name": "Juventus FC Tickets 2025-26",
    "brand": { "@type": "Brand", "name": "EuroMatchTickets" },
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "1623", "bestRating": "5", "worstRating": "1" },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "45", "highPrice": "1200", "offerCount": "346" , "validFrom": "2025-01-01" }
  };

  return (
    <div className="min-h-screen bg-[#0e0e14]" data-testid="juventus-hub-page">
      <SEOHead title="Juventus Tickets 2026 | Allianz Stadium from €45" description="Buy Juventus tickets from €45. Serie A, Champions League, Derby d'Italia. Allianz Stadium Turin. Cheapest prices, instant QR delivery. FanProtect guarantee!" canonicalUrl="https://euromatchtickets.com/juventus-tickets" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />
      <BreadcrumbStructuredData items={[{ name: "Home", url: "https://euromatchtickets.com" }, { name: "Football", url: "https://euromatchtickets.com/events?type=match" }, { name: "Juventus Tickets", url: "https://euromatchtickets.com/juventus-tickets" }]} />

      {/* Hero - Black & White Stripes Theme */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(90deg, white 0px, white 40px, transparent 40px, transparent 80px)' }} />
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-[#1e1e1e] text-black text-xs font-bold px-4 py-2 rounded-full mb-6"><Trophy className="w-3 h-3" /> JUVENTUS FC</div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">Juventus<br /><span className="text-slate-400">Tickets 2026</span></h1>
              <p className="text-lg text-slate-400 max-w-xl mb-8">La Vecchia Signora - Italy's most successful club. 36 Serie A titles. Allianz Stadium, Turin. Every match available at the cheapest prices in Europe.</p>
              <Link to="/events?search=Juventus"><Button size="lg" className="bg-[#1e1e1e] hover:bg-white/10 text-black font-bold px-8 rounded-full" data-testid="juventus-cta"><Ticket className="w-5 h-5 mr-2" /> Browse Juventus Matches from &euro;45</Button></Link>
            </div>
            <div className="bg-[#1e1e1e] rounded-none shadow-xl p-6 min-w-[280px]">
              <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">ALLIANZ STADIUM</h3>
              {[["Capacity", "41,507"], ["Serie A Titles", "36"], ["UCL Finals", "9"], ["Our Prices From", "€45"]].map(([k, v], i) => (
                <div key={i}><div className="flex justify-between py-2"><span className="text-sm text-slate-400">{k}</span><span className="font-bold text-white">{v}</span></div>{i < 3 && <div className="h-px bg-slate-100" />}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Matches */}
      <section className="py-16"><div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-white mb-8">Upcoming Juventus Matches</h2>
        <div className="space-y-3">{matches.map((m, i) => (
          <Link key={i} to={m.link} className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#1e1e1e] border border-white/10 hover:border-slate-400 rounded-none p-5 transition-all" data-testid={`juve-match-${i}`}>
            <div><div className="flex items-center gap-2 mb-1"><h3 className="font-bold text-white">{m.home} vs {m.away}</h3>{m.hot && <span className="text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded-full font-bold">HOT</span>}</div><p className="text-sm text-slate-500">{m.label} &bull; {m.venue} &bull; {m.date}</p></div>
            <div className="flex items-center gap-4 mt-3 sm:mt-0"><span className="text-xs text-slate-500">{m.tickets} left</span><span className="text-xl font-bold text-white">&euro;{m.price}</span><Button className="bg-slate-900 hover:bg-slate-800 text-white">Buy</Button></div>
          </Link>
        ))}</div>
      </div></section>

      {/* FAQ */}
      <section className="py-16 bg-[#15151e]"><div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-white mb-6">FAQ - Juventus Tickets</h2>
        <FAQStructuredData faqs={faqs} />
        <div className="space-y-3">{faqs.map((f, i) => (
          <details key={i} className="group bg-[#1e1e1e] rounded-none border border-white/10 transition">
            <summary className="p-5 font-bold text-white cursor-pointer list-none flex items-center justify-between">{f.question}<ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" /></summary>
            <p className="px-5 pb-5 text-slate-400 text-sm leading-relaxed">{f.answer}</p>
          </details>
        ))}</div>
      </div></section>

      {/* Link Wheel */}
      <section className="py-12"><div className="max-w-5xl mx-auto px-4">
        <h2 className="text-lg font-bold text-white mb-4">More Teams & Events</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[{ to: "/real-madrid-tickets", label: "Real Madrid", price: "49" }, { to: "/barcelona-tickets", label: "FC Barcelona", price: "45" }, { to: "/bayern-munich-tickets", label: "Bayern Munich", price: "65" }, { to: "/psg-tickets", label: "PSG", price: "55" }, { to: "/liverpool-tickets", label: "Liverpool FC", price: "45" }, { to: "/manchester-city-tickets", label: "Man City", price: "55" }, { to: "/champions-league-tickets", label: "Champions League", price: "49" }, { to: "/f1-italian-grand-prix-monza-tickets", label: "Monza GP", price: "69" }].map((l, i) => (
            <Link key={i} to={l.to} className="bg-[#1e1e1e] border border-white/10 rounded-none p-4 hover:border-slate-400 hover:shadow-md transition-all"><p className="font-bold text-white text-sm">{l.label}</p><p className="text-emerald-600 text-xs font-bold mt-1">From &euro;{l.price}</p></Link>
          ))}
        </div>
      </div></section>

      {/* SEO */}
      <section className="py-12"><div className="max-w-4xl mx-auto px-4 space-y-6">
        <h2 className="text-xl font-bold text-white">Buy Juventus Tickets 2026 - Cheapest Prices Online</h2>
        <p className="text-slate-400 leading-relaxed">EuroMatchTickets is the cheapest place to buy <strong>Juventus tickets</strong> online. Serie A, Champions League, Coppa Italia - every match at <strong>Allianz Stadium</strong> in Turin from just <strong>&euro;45</strong>. Instant QR delivery and FanProtect money-back guarantee on every purchase.</p>
      </div></section>
    </div>
  );
};

export default JuventusHubPage;
