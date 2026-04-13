import { Link } from "react-router-dom";
import { Calendar, MapPin, Trophy, Star, Shield, Users, TrendingUp, Zap, ArrowRight, CheckCircle, Globe } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
import { BreadcrumbStructuredData, FAQStructuredData } from "../components/StructuredData";
import { ScarcityBadges, TrustBar } from "../components/ConversionElements";

const ManCityHubPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": "Manchester City FC 2025-26 Season",
    "description": "Buy Manchester City tickets for Premier League, Champions League at Etihad Stadium. Cheapest prices guaranteed.",
    "image": "https://euromatchtickets.com/logo-192.png",
    "startDate": "2025-08-15",
    "endDate": "2026-06-01",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": { "@type": "Place", "name": "Etihad Stadium", "address": { "@type": "PostalAddress", "addressLocality": "Manchester", "addressCountry": "GB" } },
    "performer": { "@type": "SportsTeam", "name": "Manchester City FC" },
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR",
              "offerCount": "100", "lowPrice": "65", "highPrice": "1800", "availability": "https://schema.org/InStock", "validFrom": "2025-01-01", "url": "https://euromatchtickets.com/manchester-city-tickets" }
  };

  const reviewSchema = {
    "@context": "https://schema.org",
    "image": "https://euromatchtickets.com/logo-192.png",
    "@type": "Product",
    "name": "Manchester City Tickets 2025-26",
    "description": "Verified Manchester City match tickets with instant QR delivery",
    "brand": { "@type": "Brand", "name": "EuroMatchTickets" },
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "1923", "bestRating": "5", "worstRating": "1" },
    "review": [
      { "@type": "Review", "name": "Haaland hat-trick at electric Etihad", "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }, "author": { "@type": "Person", "name": "David L." }, "reviewBody": "Watched Haaland score a hat-trick! Etihad was electric. Cheapest tickets I found online.", "datePublished": "2026-02-10" },
      { "@type": "Review", "name": "Man City vs Real Madrid was incredible", "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }, "author": { "@type": "Person", "name": "Sarah M." }, "reviewBody": "Man City vs Real Madrid in the Champions League was incredible. Tickets arrived instantly.", "datePublished": "2026-01-18" }
    ],
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "65", "highPrice": "1800", "offerCount": "234" , "validFrom": "2025-01-01" }
  };

  const matches = [
    { home: "Man City", away: "Real Madrid", label: "UCL Quarter-Final", venue: "Etihad Stadium", date: "Apr 2026", price: 175, tickets: 32, hot: true, link: "/manchester-city-champions-league-tickets-2026" },
    { home: "Man City", away: "Liverpool", label: "Premier League", venue: "Etihad Stadium", date: "Mar 2026", price: 155, tickets: 41, hot: true, link: "/manchester-city-premier-league-tickets-2026" },
    { home: "Man City", away: "Arsenal", label: "Premier League", venue: "Etihad Stadium", date: "Apr 2026", price: 145, tickets: 38, hot: true, link: "/manchester-city-premier-league-tickets-2026" },
    { home: "Man City", away: "Man United", label: "Manchester Derby", venue: "Etihad Stadium", date: "May 2026", price: 165, tickets: 25, hot: true, link: "/manchester-city-premier-league-tickets-2026" },
    { home: "Man City", away: "Chelsea", label: "Premier League", venue: "Etihad Stadium", date: "Mar 2026", price: 115, tickets: 62, link: "/manchester-city-premier-league-tickets-2026" },
  ];

  const reviews = [
    { name: "David L.", country: "UK", rating: 5, text: "Watched Haaland score a hat-trick! Etihad was electric. Cheapest tickets I found.", date: "Feb 2026" },
    { name: "Sarah M.", country: "Ireland", rating: 5, text: "Man City vs Real Madrid was incredible. Tickets arrived instantly.", date: "Jan 2026" },
    { name: "Kenji T.", country: "Japan", rating: 5, text: "Flew from Tokyo for the Manchester Derby. Worth every penny!", date: "Dec 2025" },
    { name: "Alex V.", country: "USA", rating: 4, text: "Great prices for Premier League tickets. Easy checkout process.", date: "Nov 2025" },
  ];

  const faqs = [
    { question: "How much are Manchester City tickets?", answer: "Manchester City tickets start from \u20AC65 for Premier League matches. Champions League tickets start at \u20AC120, and Manchester Derby tickets from \u20AC165." },
    { question: "Where does Manchester City play?", answer: "Manchester City plays at the Etihad Stadium in Manchester, England. The stadium holds 53,400 spectators and is known for its electric atmosphere." },
    { question: "Can I buy Manchester Derby tickets?", answer: "Yes! Manchester Derby (Man City vs Man United) tickets are available starting from \u20AC165. These are among our most popular Premier League tickets." },
    { question: "Are Manchester City tickets genuine?", answer: "All tickets on EuroMatchTickets are 100% verified and backed by our FanProtect guarantee with full refund protection." },
    { question: "How to get to Etihad Stadium?", answer: "Etihad Stadium is a 15-minute walk from Manchester Piccadilly station. The Metrolink tram stops at Etihad Campus, right next to the stadium." },
    { question: "Who plays for Manchester City?", answer: "Manchester City's star players include Erling Haaland, Kevin De Bruyne, Phil Foden, Bernardo Silva, and Rodri - managed by Pep Guardiola." },
  ];

  return (
    <div className="min-h-screen bg-[#0e0e14]" data-testid="man-city-hub-page">
      <SEOHead
        title="Manchester City Tickets 2026 | Etihad, UCL, Premier League"
        description="Buy Manchester City tickets from \u20AC65. Premier League, Champions League, Manchester Derby at Etihad. Haaland, De Bruyne. Verified. Instant QR. Cheapest prices."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-600/30 via-slate-900 to-slate-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <Badge className="bg-sky-50 text-sky-700 border-sky-200 mb-6"><Trophy className="w-4 h-4 mr-2" />Manchester City FC</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Manchester City Tickets 2025-26
            <span className="block text-2xl md:text-3xl mt-2 bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">Etihad Stadium &middot; Premier League &middot; Champions League</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-4">Secure your seat now with instant QR delivery. 100% Buyer Protection.</p>
          <ScarcityBadges ticketsLeft={289} viewers={156} priceIncrease="14%" />
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full"><Calendar className="w-5 h-5 text-sky-600" /><span>2025-26 Season</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full"><MapPin className="w-5 h-5 text-sky-600" /><span>Etihad Stadium, Manchester</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full"><Users className="w-5 h-5 text-sky-600" /><span>53,400 Capacity</span></div>
          </div>
          <div className="inline-block bg-white/90 border border-white/10 rounded-none p-6">
            <div className="text-slate-500 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-white">&euro;65</div>
            <div className="text-emerald-600 text-sm mt-1 flex items-center justify-center gap-1"><CheckCircle className="w-4 h-4" /> Up to 40% cheaper than Viagogo &amp; StubHub</div>
          </div>
        </div>
      </section>

      <TrustBar />

      {/* Matches */}
      <section className="py-16" data-testid="mc-matches">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Manchester City Matches 2026</h2>
          <div className="grid gap-4">
            {matches.map((m, i) => (
              <Link key={i} to={m.link} className="group flex flex-col md:flex-row md:items-center justify-between bg-[#1e1e1e] border border-white/5 hover:border-sky-200 rounded-none p-6 transition-all" data-testid={`mc-match-${i}`}>
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-14 h-14 bg-sky-50 rounded-none flex items-center justify-center"><Trophy className="w-7 h-7 text-sky-600" /></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white group-hover:text-sky-600">{m.home} vs {m.away}</h3>
                      {m.hot && <Badge className="bg-red-100 text-red-600 text-xs animate-pulse">HOT</Badge>}
                    </div>
                    <p className="text-slate-400 text-sm">{m.label} &middot; {m.date} &middot; {m.venue}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-cyan-600 text-sm">{m.tickets} left</span>
                  <div className="text-right"><div className="text-xs text-slate-400">From</div><div className="text-xl font-bold text-sky-600">&euro;{m.price}</div></div>
                  <Button className="bg-sky-600 hover:bg-sky-700">Buy</Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-[#15151e]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-white">Buy Manchester City Tickets 2025-26</h2>
          <div className="prose max-w-none text-slate-400 space-y-4">
            <p><strong>Manchester City</strong> under Pep Guardiola has become the dominant force in English and European football. With <strong>Erling Haaland</strong> breaking records every season and <strong>Kevin De Bruyne</strong> pulling the strings, City are favourites for the Premier League, Champions League, and FA Cup in 2025-26.</p>
            <p>The <strong>Etihad Stadium</strong> holds 53,400 fans and delivers an incredible matchday atmosphere, especially for the <strong>Manchester Derby</strong> and Champions League nights. EuroMatchTickets offers the <strong>cheapest Man City tickets</strong> with instant QR delivery and <Link to="/buyer-protection" className="text-sky-600 hover:underline">FanProtect guarantee</Link>.</p>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-2 text-center text-white">Fan Reviews</h2>
          <p className="text-center text-slate-500 mb-8">4.8/5 from 1,923 verified buyers</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reviews.map((r, i) => (
              <div key={i} className="bg-[#1e1e1e] border border-white/5 rounded-none p-5">
                <div className="flex items-center gap-1 mb-2">{[...Array(r.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}{[...Array(5 - r.rating)].map((_, j) => <Star key={j} className="w-4 h-4 text-slate-200" />)}</div>
                <p className="text-slate-400 text-sm mb-3">"{r.text}"</p>
                <div className="text-xs text-slate-400">{r.name} &middot; {r.country} &middot; {r.date}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LINK WHEEL */}
      <section className="py-16 bg-[#15151e]" data-testid="mc-link-hub">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center text-white">More Events on EuroMatchTickets</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#1e1e1e] rounded-none p-5 border border-white/5">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Trophy className="w-5 h-5 text-sky-600" /> Man City</h3>
              <ul className="space-y-2">
                <li><Link to="/manchester-city-champions-league-tickets-2026" className="text-sky-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />UCL Tickets</Link></li>
                <li><Link to="/manchester-city-premier-league-tickets-2026" className="text-sky-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Premier League</Link></li>
              </ul>
            </div>
            <div className="bg-[#1e1e1e] rounded-none p-5 border border-white/5">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Trophy className="w-5 h-5 text-blue-600" /> Link Wheel</h3>
              <ul className="space-y-2">
                <li><Link to="/real-madrid-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Real Madrid Tickets</Link></li>
                <li><Link to="/barcelona-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Barcelona Tickets</Link></li>
                <li><Link to="/liverpool-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Liverpool</Link></li>
                <li><Link to="/arsenal-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Arsenal</Link></li>
                <li><Link to="/bayern-munich-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Bayern Munich</Link></li>
                <li><Link to="/psg-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />PSG</Link></li>
                <li><Link to="/juventus-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Juventus</Link></li>
                <li><Link to="/champions-league-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Champions League</Link></li>
                <li><Link to="/world-cup-2026" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />World Cup 2026</Link></li>
              </ul>
            </div>
            <div className="bg-[#1e1e1e] rounded-none p-5 border border-white/5">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Globe className="w-5 h-5 text-emerald-500" /> Premier League</h3>
              <ul className="space-y-2">
                <li><Link to="/events?type=match" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />All Matches</Link></li>
                <li><Link to="/el-clasico-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />El Clasico</Link></li>
                <li><Link to="/football-ticket-prices-2026" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Ticket Prices</Link></li>
              </ul>
            </div>
            <div className="bg-[#1e1e1e] rounded-none p-5 border border-white/5">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Zap className="w-5 h-5 text-red-500" /> More</h3>
              <ul className="space-y-2">
                <li><Link to="/f1-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />F1 Tickets</Link></li>
                <li><Link to="/taylor-swift-wembley-2026-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Taylor Swift</Link></li>
                <li><Link to="/de/tickets-kaufen" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Tickets Kaufen</Link></li>
                <li><Link to="/events" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />All Events</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16" data-testid="mc-faq">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center text-white">Manchester City Tickets FAQ</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="bg-[#1e1e1e] border border-white/5 rounded-none p-5 group">
                <summary className="font-semibold cursor-pointer text-white flex items-center justify-between">{faq.question}<ArrowRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" /></summary>
                <p className="mt-3 text-slate-400">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-sky-600 to-sky-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Watch Man City Live</h2>
          <p className="text-sky-100 mb-8 text-lg">Premier League, Champions League, Manchester Derby - all at the Etihad.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/events?type=match"><Button className="bg-[#1e1e1e] text-sky-700 hover:bg-sky-50 text-lg px-8 py-3">Browse Matches</Button></Link>
            <Link to="/buyer-protection"><Button variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-3">FanProtect Guarantee</Button></Link>
          </div>
        </div>
      </section>

      <BreadcrumbStructuredData items={[
        { name: "Home", url: "https://euromatchtickets.com" },
        { name: "Football", url: "https://euromatchtickets.com/events?type=match" },
        { name: "Manchester City Tickets", url: "https://euromatchtickets.com/manchester-city-tickets" }
      ]} />
      <FAQStructuredData faqs={faqs} />
    </div>
  );
};

export default ManCityHubPage;
