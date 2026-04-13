import { Link } from "react-router-dom";
import { Calendar, MapPin, Trophy, Star, Shield, Zap, Ticket, ChevronRight, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import SEOHead from "../components/SEOHead";
import { BreadcrumbStructuredData, FAQStructuredData } from "../components/StructuredData";

const PSGHubPage = () => {
  const matches = [
    { home: "PSG", away: "Real Madrid", label: "UCL Round of 16", venue: "Parc des Princes", date: "Feb 2026", price: 145, tickets: 56, hot: true, link: "/events?search=PSG+Real+Madrid" },
    { home: "PSG", away: "Marseille", label: "Le Classique", venue: "Parc des Princes", date: "Mar 2026", price: 125, tickets: 78, hot: true, link: "/events?search=PSG+Marseille" },
    { home: "PSG", away: "Lyon", label: "Ligue 1", venue: "Parc des Princes", date: "Apr 2026", price: 75, tickets: 134, link: "/events?search=PSG+Lyon" },
    { home: "PSG", away: "Monaco", label: "Ligue 1", venue: "Parc des Princes", date: "May 2026", price: 85, tickets: 98, link: "/events?search=PSG+Monaco" },
  ];

  const faqs = [
    { question: "How much are PSG tickets?", answer: "PSG tickets start from €55 for Ligue 1 matches at Parc des Princes. Champions League from €125. Le Classique (vs Marseille) from €125. All prices on EuroMatchTickets are the cheapest in Europe." },
    { question: "Where does PSG play?", answer: "PSG plays at Parc des Princes in Paris, France. The 47,929-capacity stadium is located in the 16th arrondissement, easily accessible by Metro Line 9 (Porte de Saint-Cloud)." },
    { question: "Can tourists buy PSG tickets?", answer: "Yes! No membership required. Buy verified PSG tickets directly on EuroMatchTickets. Instant QR delivery to your email." },
    { question: "What is Le Classique?", answer: "Le Classique is PSG vs Olympique de Marseille - France's biggest and most heated football rivalry. The atmosphere at Parc des Princes is absolutely electric." },
  ];

  const reviewSchema = {
    "@context": "https://schema.org", "image": "https://euromatchtickets.com/og-image.jpg",
    "@type": "Product",
    "name": "PSG Paris Saint-Germain Tickets 2025-26",
    "brand": { "@type": "Brand", "name": "EuroMatchTickets" },
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "1847", "bestRating": "5", "worstRating": "1" },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "55", "highPrice": "1500", "offerCount": "366" , "validFrom": "2025-01-01" }
  };

  return (
    <div className="min-h-screen bg-[#0c1029]" data-testid="psg-hub-page">
      <SEOHead title="PSG Tickets 2026 | Paris Saint-Germain from €55" description="Buy PSG tickets from €55. Ligue 1, Champions League, Le Classique. Parc des Princes. Cheapest prices, instant QR delivery. FanProtect guarantee!" canonicalUrl="https://euromatchtickets.com/psg-tickets" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />
      <BreadcrumbStructuredData items={[{ name: "Home", url: "https://euromatchtickets.com" }, { name: "Football Tickets", url: "https://euromatchtickets.com/events?type=match" }, { name: "PSG Tickets", url: "https://euromatchtickets.com/psg-tickets" }]} />

      {/* Hero - Parisian Blue */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800/30 via-[#0c1029] to-red-900/20" />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-full mb-6"><Trophy className="w-3 h-3" /> PARIS SAINT-GERMAIN</div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tighter mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">PSG</span>
            <span className="block text-2xl sm:text-3xl text-slate-400 mt-2 font-light">Paris Tickets 2026</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">Experience the magic of French football at the Parc des Princes. Champions League, Ligue 1, Le Classique.</p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="flex items-center gap-2 text-xs text-blue-300/60 bg-blue-500/100/10 border border-blue-500/20 rounded-full px-4 py-2"><MapPin className="w-3.5 h-3.5" /> Paris, France</span>
            <span className="flex items-center gap-2 text-xs text-blue-300/60 bg-blue-500/100/10 border border-blue-500/20 rounded-full px-4 py-2"><Calendar className="w-3.5 h-3.5" /> 2025-26 Season</span>
          </div>
          <Link to="/checkout?event=psg-tickets"><Button size="lg" className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white font-bold px-8 rounded-full" data-testid="psg-cta"><Ticket className="w-5 h-5 mr-2" /> Get PSG Tickets from &euro;55</Button></Link>
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-[11px] text-white/40">
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-400" /> FanProtect Guarantee</span>
            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-400" /> Instant QR Delivery</span>
            <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-400" /> 4.8/5 Reviews</span>
          </div>
        </div>
      </section>

      {/* Matches */}
      <section className="py-16"><div className="max-w-5xl mx-auto px-4">
        <h2 className="text-xl font-bold text-white mb-6">Upcoming PSG Matches</h2>
        <div className="space-y-3">{matches.map((m, i) => (
          <Link key={i} to={m.link} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/5 border border-white/10 hover:border-blue-500/30 rounded-none p-5 transition-all" data-testid={`psg-match-${i}`}>
            <div><div className="flex items-center gap-2 mb-1"><h3 className="font-bold text-white">{m.home} vs {m.away}</h3>{m.hot && <span className="text-[10px] bg-[#e10600]/100/30 text-red-300 px-2 py-0.5 rounded-full font-bold">HOT</span>}</div><p className="text-sm text-slate-500">{m.label} &bull; {m.venue} &bull; {m.date}</p></div>
            <div className="flex items-center gap-4 mt-3 sm:mt-0"><span className="text-xs text-blue-400/60">{m.tickets} left</span><span className="text-xl font-bold text-white">&euro;{m.price}</span><Button className="bg-blue-600 hover:bg-blue-700 text-white">Buy</Button></div>
          </Link>
        ))}</div>
      </div></section>

      {/* FAQ */}
      <section className="py-16"><div className="max-w-4xl mx-auto px-4">
        <h2 className="text-xl font-bold text-white mb-6">FAQ - PSG Tickets</h2>
        <FAQStructuredData faqs={faqs} />
        <div className="space-y-2">{faqs.map((f, i) => (
          <details key={i} className="group rounded-none border border-white/10 bg-white/5 hover:bg-white/10 transition">
            <summary className="p-4 font-bold text-sm text-white cursor-pointer list-none flex items-center justify-between">{f.question}<ChevronRight className="w-4 h-4 text-slate-500 group-open:rotate-90 transition-transform" /></summary>
            <p className="px-4 pb-4 text-slate-400 text-sm leading-relaxed">{f.answer}</p>
          </details>
        ))}</div>
      </div></section>

      {/* Link Wheel */}
      <section className="py-12"><div className="max-w-5xl mx-auto px-4">
        <h2 className="text-lg font-bold text-white mb-4">More Teams & Events</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[{ to: "/real-madrid-tickets", label: "Real Madrid", price: "49" }, { to: "/barcelona-tickets", label: "FC Barcelona", price: "45" }, { to: "/bayern-munich-tickets", label: "Bayern Munich", price: "65" }, { to: "/juventus-tickets", label: "Juventus", price: "55" }, { to: "/liverpool-tickets", label: "Liverpool FC", price: "45" }, { to: "/manchester-city-tickets", label: "Man City", price: "55" }, { to: "/champions-league-tickets", label: "Champions League", price: "49" }, { to: "/f1-tickets", label: "F1 Tickets", price: "59" }].map((l, i) => (
            <Link key={i} to={l.to} className="bg-white/5 border border-white/10 rounded-none p-4 hover:border-blue-500/30 transition-all"><p className="font-bold text-white text-sm">{l.label}</p><p className="text-blue-400 text-xs font-bold mt-1">From &euro;{l.price}</p></Link>
          ))}
        </div>
      </div></section>

      {/* SEO Content */}
      <section className="py-12"><div className="max-w-4xl mx-auto px-4 space-y-6">
        <h2 className="text-xl font-bold text-white">Buy PSG Tickets 2026 - Cheapest Prices Online</h2>
        <p className="text-slate-400 leading-relaxed">EuroMatchTickets offers the <strong>cheapest PSG tickets</strong> for every match at Parc des Princes. Whether it's Ligue 1, Champions League, or Le Classique against Marseille - all verified with instant QR delivery and FanProtect guarantee. Prices from just <strong>&euro;55</strong>.</p>
      </div></section>
    </div>
  );
};

export default PSGHubPage;
