import { Link } from "react-router-dom";
import { Calendar, MapPin, Trophy, Star, Shield, Zap, Ticket, ChevronRight, Check, Users } from "lucide-react";
import { Button } from "../components/ui/button";
import SEOHead from "../components/SEOHead";
import { BreadcrumbStructuredData, FAQStructuredData } from "../components/StructuredData";

const BayernMunichHubPage = () => {
  const matches = [
    { home: "Bayern Munich", away: "Real Madrid", label: "UCL Semi-Final", venue: "Allianz Arena", date: "Apr 2026", price: 185, tickets: 34, hot: true, link: "/bayern-vs-real-madrid-tickets" },
    { home: "Bayern Munich", away: "Borussia Dortmund", label: "Der Klassiker", venue: "Allianz Arena", date: "Mar 2026", price: 125, tickets: 67, hot: true, link: "/events?search=Bayern+Dortmund" },
    { home: "Bayern Munich", away: "Barcelona", label: "UCL Quarter-Final", venue: "Allianz Arena", date: "Apr 2026", price: 165, tickets: 45, hot: true, link: "/events?search=Bayern+Barcelona" },
    { home: "Bayern Munich", away: "RB Leipzig", label: "Bundesliga", venue: "Allianz Arena", date: "Mar 2026", price: 85, tickets: 112, link: "/events?search=Bayern+Leipzig" },
    { home: "Bayern Munich", away: "Bayer Leverkusen", label: "Bundesliga Top", venue: "Allianz Arena", date: "May 2026", price: 95, tickets: 89, link: "/events?search=Bayern+Leverkusen" },
  ];

  const faqs = [
    { question: "How much are Bayern Munich tickets?", answer: "Bayern Munich tickets on EuroMatchTickets start from €65 for Bundesliga matches. Champions League matches from €125. Der Klassiker (vs Dortmund) from €125. We guarantee the cheapest prices in Europe." },
    { question: "How to buy Bayern Munich tickets as a tourist?", answer: "Simply browse our listings, select your match, and checkout. No FC Bayern membership needed! Tickets are delivered instantly as QR codes. We accept all major cards and PayPal." },
    { question: "Where does Bayern Munich play?", answer: "Bayern Munich plays at the Allianz Arena in Munich, Germany. The iconic stadium holds 75,000 fans and features a stunning illuminated exterior that glows red on matchdays." },
    { question: "What is Der Klassiker?", answer: "Der Klassiker is Bayern Munich vs Borussia Dortmund - Germany's biggest football rivalry. It's one of the most attended and watched club matches in world football." },
  ];

  const reviewSchema = {
    "@context": "https://schema.org", "image": "https://euromatchtickets.com/og-image.jpg",
    "@type": "Product",
    "name": "Bayern Munich Tickets 2025-26",
    "brand": { "@type": "Brand", "name": "EuroMatchTickets" },
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "2156", "bestRating": "5", "worstRating": "1" },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "65", "highPrice": "2000", "offerCount": "347" , "validFrom": "2025-01-01" }
  };

  return (
    <div className="min-h-screen bg-[#0e0e14]" data-testid="bayern-hub-page">
      <SEOHead title="Bayern Munich Tickets 2026 | Allianz Arena from €65" description="Buy Bayern Munich tickets from €65. Bundesliga, Champions League, Der Klassiker. Allianz Arena. Cheapest prices, instant QR delivery. FanProtect guarantee!" canonicalUrl="https://euromatchtickets.com/bayern-munich-tickets" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />
      <BreadcrumbStructuredData items={[{ name: "Home", url: "https://euromatchtickets.com" }, { name: "Football Tickets", url: "https://euromatchtickets.com/events?type=match" }, { name: "Bayern Munich Tickets", url: "https://euromatchtickets.com/bayern-munich-tickets" }]} />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-700/30 via-slate-900 to-slate-950" />
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-full mb-6"><Trophy className="w-3 h-3" /> FC BAYERN MÜNCHEN</div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">Bayern Munich<br /><span className="text-red-400">Tickets 2026</span></h1>
              <p className="text-lg text-slate-400 max-w-xl mb-8">Germany's most successful club. Allianz Arena. Bundesliga, Champions League, DFB-Pokal - every match available at the cheapest prices.</p>
              <Link to="/events?search=Bayern+Munich"><Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 rounded-full" data-testid="bayern-cta"><Ticket className="w-5 h-5 mr-2" /> Browse All Bayern Matches</Button></Link>
            </div>
            <div className="bg-[#1e1e1e] rounded-none shadow-xl p-6 min-w-[280px]">
              <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">ALLIANZ ARENA</h3>
              {[["Capacity", "75,000"], ["Bundesliga Titles", "33"], ["UCL Titles", "6"], ["Our Prices From", "€65"]].map(([k, v], i) => (
                <div key={i}><div className="flex justify-between py-2"><span className="text-sm text-slate-400">{k}</span><span className="font-bold text-white">{v}</span></div>{i < 3 && <div className="h-px bg-slate-100" />}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Matches */}
      <section className="py-16"><div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-white mb-8">Upcoming Bayern Munich Matches</h2>
        <div className="space-y-3">{matches.map((m, i) => (
          <Link key={i} to={m.link} className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#1e1e1e] border border-white/10 hover:border-red-300 rounded-none p-5 transition-all group" data-testid={`bayern-match-${i}`}>
            <div><div className="flex items-center gap-2 mb-1"><h3 className="font-bold text-white">{m.home} vs {m.away}</h3>{m.hot && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">HOT</span>}</div><p className="text-sm text-slate-500">{m.label} &bull; {m.venue} &bull; {m.date}</p></div>
            <div className="flex items-center gap-4 mt-3 sm:mt-0"><span className="text-xs text-red-500">{m.tickets} tickets left</span><span className="text-xl font-bold text-white">&euro;{m.price}</span><Button className="bg-red-600 hover:bg-red-700 text-white">Buy</Button></div>
          </Link>
        ))}</div>
      </div></section>

      {/* FAQ */}
      <section className="py-16 bg-[#15151e]"><div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-white mb-6">FAQ - Bayern Munich Tickets</h2>
        <FAQStructuredData faqs={faqs} />
        <div className="space-y-3">{faqs.map((f, i) => (
          <details key={i} className="group bg-[#1e1e1e] rounded-none border border-white/10 hover:border-red-200 transition">
            <summary className="p-5 font-bold text-white cursor-pointer list-none flex items-center justify-between">{f.question}<ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" /></summary>
            <p className="px-5 pb-5 text-slate-400 text-sm leading-relaxed">{f.answer}</p>
          </details>
        ))}</div>
      </div></section>

      {/* Link Wheel */}
      <section className="py-12"><div className="max-w-5xl mx-auto px-4">
        <h2 className="text-lg font-bold text-white mb-4">More Teams & Events</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[{ to: "/real-madrid-tickets", label: "Real Madrid", price: "49" }, { to: "/barcelona-tickets", label: "FC Barcelona", price: "45" }, { to: "/liverpool-tickets", label: "Liverpool FC", price: "45" }, { to: "/arsenal-tickets", label: "Arsenal", price: "55" }, { to: "/manchester-city-tickets", label: "Man City", price: "55" }, { to: "/champions-league-tickets", label: "Champions League", price: "49" }, { to: "/f1-tickets", label: "F1 Tickets", price: "59" }, { to: "/taylor-swift-london-tickets", label: "Taylor Swift", price: "89" }].map((l, i) => (
            <Link key={i} to={l.to} className="bg-[#1e1e1e] border border-white/10 rounded-none p-4 hover:border-red-300 hover:shadow-md transition-all"><p className="font-bold text-white text-sm">{l.label}</p><p className="text-emerald-600 text-xs font-bold mt-1">From &euro;{l.price}</p></Link>
          ))}
        </div>
      </div></section>

      {/* SEO Content */}
      <section className="py-12"><div className="max-w-4xl mx-auto px-4 space-y-6">
        <h2 className="text-xl font-bold text-white">Buy Bayern Munich Tickets 2026 - Cheapest Prices Online</h2>
        <p className="text-slate-400 leading-relaxed">EuroMatchTickets offers the <strong>cheapest Bayern Munich tickets</strong> available online. Whether it's Bundesliga, Champions League, or Der Klassiker against Dortmund - we have verified tickets for every match at the <strong>Allianz Arena</strong> in Munich. Prices start from just <strong>&euro;65</strong> with instant QR delivery and our FanProtect money-back guarantee.</p>
      </div></section>
    </div>
  );
};

export default BayernMunichHubPage;
