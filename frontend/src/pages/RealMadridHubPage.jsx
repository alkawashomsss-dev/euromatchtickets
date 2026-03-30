import { Link } from "react-router-dom";
import { Calendar, MapPin, Trophy, Star, Shield, Users, TrendingUp, Zap, ArrowRight, CheckCircle, Globe, Ticket } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
import { BreadcrumbStructuredData, FAQStructuredData } from "../components/StructuredData";

const RealMadridHubPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": "Real Madrid CF 2025-26 Season",
    "description": "Buy Real Madrid tickets for La Liga, Champions League, and all matches at Santiago Bernabeu. Cheapest prices guaranteed.",
    "startDate": "2025-08-15",
    "endDate": "2026-06-01",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": { "@type": "Place", "name": "Santiago Bernabeu", "address": { "@type": "PostalAddress", "addressLocality": "Madrid", "addressCountry": "ES" } },
    "performer": { "@type": "SportsTeam", "name": "Real Madrid CF" },
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "75", "highPrice": "2500", "availability": "https://schema.org/InStock", "url": "https://euromatchtickets.com/real-madrid-tickets" }
  };

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Real Madrid Tickets 2025-26",
    "description": "Verified Real Madrid match tickets with instant QR delivery",
    "brand": { "@type": "Brand", "name": "EuroMatchTickets" },
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "2841", "bestRating": "5", "worstRating": "1" },
    "review": [
      { "@type": "Review", "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }, "author": { "@type": "Person", "name": "Carlos M." }, "reviewBody": "Incredible experience at the Bernabeu! Tickets arrived instantly. Best prices I found anywhere.", "datePublished": "2026-02-20" },
      { "@type": "Review", "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }, "author": { "@type": "Person", "name": "James T." }, "reviewBody": "Got El Clasico tickets at amazing prices. QR code worked perfectly at the gate.", "datePublished": "2026-01-15" },
      { "@type": "Review", "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }, "author": { "@type": "Person", "name": "Yuki H." }, "reviewBody": "Flew from Tokyo for Real Madrid vs Man City. EuroMatchTickets made it so easy!", "datePublished": "2025-12-08" }
    ],
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "75", "highPrice": "2500", "offerCount": "412" }
  };

  const matches = [
    { home: "Real Madrid", away: "Barcelona", label: "El Clasico", venue: "Santiago Bernabeu", date: "Apr 2026", price: 195, tickets: 28, hot: true, link: "/el-clasico-tickets" },
    { home: "Real Madrid", away: "Man City", label: "UCL Quarter-Final", venue: "Santiago Bernabeu", date: "Apr 2026", price: 185, tickets: 34, hot: true, link: "/real-madrid-champions-league-tickets-2026" },
    { home: "Real Madrid", away: "Bayern Munich", label: "UCL Semi-Final", venue: "Santiago Bernabeu", date: "May 2026", price: 210, tickets: 19, hot: true, link: "/bayern-vs-real-madrid-tickets" },
    { home: "Real Madrid", away: "Atletico Madrid", label: "La Liga Derby", venue: "Santiago Bernabeu", date: "Mar 2026", price: 145, tickets: 56, link: "/real-madrid-la-liga-tickets-2026" },
    { home: "Real Madrid", away: "Sevilla", label: "La Liga", venue: "Santiago Bernabeu", date: "Mar 2026", price: 95, tickets: 89, link: "/real-madrid-la-liga-tickets-2026" },
  ];

  const reviews = [
    { name: "Carlos M.", country: "Spain", rating: 5, text: "Incredible experience at the Bernabeu! Tickets arrived instantly. Best prices I found.", date: "Feb 2026" },
    { name: "James T.", country: "UK", rating: 5, text: "Got El Clasico tickets at amazing prices. QR code worked perfectly at the gate.", date: "Jan 2026" },
    { name: "Yuki H.", country: "Japan", rating: 5, text: "Flew from Tokyo for Real Madrid vs Man City. EuroMatchTickets made it so easy!", date: "Dec 2025" },
    { name: "Fatima A.", country: "UAE", rating: 5, text: "Best service for Real Madrid tickets. Cheaper than the official site!", date: "Nov 2025" },
  ];

  const faqs = [
    { question: "How much are Real Madrid tickets?", answer: "Real Madrid tickets on EuroMatchTickets start from \u20AC75 for La Liga matches. Champions League matches start at \u20AC150, and El Clasico tickets start at \u20AC195. We guarantee the cheapest prices in Europe." },
    { question: "How to buy Real Madrid tickets online?", answer: "Simply browse our Real Madrid ticket listings, select your preferred match and seats, and checkout securely. Tickets are delivered instantly as QR codes to your email." },
    { question: "Where does Real Madrid play?", answer: "Real Madrid plays home matches at the Santiago Bernab\u00E9u Stadium in Madrid, Spain. The stadium was recently renovated with a retractable roof and holds 81,044 spectators." },
    { question: "Can I buy El Clasico tickets?", answer: "Yes! We have El Clasico tickets (Real Madrid vs Barcelona) starting from \u20AC195. These are among our most popular tickets - book early as they sell out fast." },
    { question: "Are EuroMatchTickets Real Madrid tickets genuine?", answer: "Absolutely. All tickets are 100% verified and backed by our FanProtect guarantee. If there's any issue, you receive a full refund." },
    { question: "When is the next Real Madrid Champions League match?", answer: "Real Madrid's next Champions League match is in the knockout rounds, starting February 2026. Check our listings for the latest schedule and available tickets." },
  ];

  return (
    <div className="min-h-screen bg-[hsl(210,20%,98%)]" data-testid="real-madrid-hub-page">
      <SEOHead
        title="Real Madrid Tickets 2026 | Bernabeu, UCL, El Clasico"
        description="Buy Real Madrid tickets from \u20AC75. La Liga, Champions League, El Clasico at Santiago Bernabeu. 100% verified. Instant QR delivery. Cheapest prices guaranteed."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-slate-900 to-slate-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <Badge className="bg-purple-50 text-purple-700 border-purple-200 mb-6"><Trophy className="w-4 h-4 mr-2" />Real Madrid CF</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Real Madrid Tickets 2025-26
            <span className="block text-2xl md:text-3xl mt-2 bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">Santiago Bernabeu &middot; La Liga &middot; Champions League</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8">Watch the most successful club in European football history. Vinicius Jr., Bellingham, Mbapp&eacute; - live at the Bernabeu. Cheapest tickets in Europe.</p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full"><Calendar className="w-5 h-5 text-purple-600" /><span>2025-26 Season</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full"><MapPin className="w-5 h-5 text-purple-600" /><span>Santiago Bernabeu, Madrid</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full"><Users className="w-5 h-5 text-purple-600" /><span>81,044 Capacity</span></div>
          </div>
          <div className="inline-block bg-white/90 border border-slate-200 rounded-2xl p-6">
            <div className="text-slate-500 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-white">&euro;75</div>
            <div className="text-emerald-600 text-sm mt-1 flex items-center justify-center gap-1"><CheckCircle className="w-4 h-4" /> Cheapest in Europe</div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-5 border-y border-slate-100 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-8">
          <div className="flex items-center gap-2 text-emerald-600"><Shield className="w-5 h-5" /><span>100% Verified</span></div>
          <div className="flex items-center gap-2 text-emerald-600"><Star className="w-5 h-5" /><span>4.9/5 (2,841 Reviews)</span></div>
          <div className="flex items-center gap-2 text-emerald-600"><TrendingUp className="w-5 h-5" /><span>12,000+ Real Madrid Tickets Sold</span></div>
        </div>
      </section>

      {/* Matches */}
      <section className="py-16" data-testid="rm-matches">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">Real Madrid Matches &amp; Tickets 2026</h2>
          <div className="grid gap-4">
            {matches.map((m, i) => (
              <Link key={i} to={m.link} className="group flex flex-col md:flex-row md:items-center justify-between bg-white border border-slate-100 hover:border-purple-200 rounded-2xl p-6 transition-all" data-testid={`rm-match-${i}`}>
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center"><Trophy className="w-7 h-7 text-purple-600" /></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 group-hover:text-purple-600">{m.home} vs {m.away}</h3>
                      {m.hot && <Badge className="bg-red-100 text-red-600 text-xs animate-pulse">HOT</Badge>}
                    </div>
                    <p className="text-slate-400 text-sm">{m.label} &middot; {m.date} &middot; {m.venue}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-cyan-600 text-sm">{m.tickets} left</span>
                  <div className="text-right"><div className="text-xs text-slate-400">From</div><div className="text-xl font-bold text-purple-600">&euro;{m.price}</div></div>
                  <Button className="bg-purple-600 hover:bg-purple-700">Buy</Button>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to="/real-madrid-tickets-2026" className="text-purple-600 hover:underline font-medium">View all Real Madrid tickets &rarr;</Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-slate-900">Buy Real Madrid Tickets 2025-26</h2>
          <div className="prose max-w-none text-slate-600 space-y-4">
            <p><strong>Real Madrid CF</strong> is the most decorated club in European football with <strong>15 Champions League titles</strong>. The 2025-26 season sees the galacticos compete for La Liga, Champions League, Copa del Rey, and the Club World Cup. Watch <strong>Vinicius Jr., Jude Bellingham, and Kylian Mbapp&eacute;</strong> live at the iconic <strong>Santiago Bernab&eacute;u</strong>.</p>
            <h3 className="text-lg font-semibold text-slate-800">Santiago Bernabeu Stadium</h3>
            <p>The newly renovated Santiago Bernab&eacute;u is one of the world's greatest football stadiums. With a <strong>retractable roof, 360-degree screen</strong>, and capacity of 81,044, it offers an unforgettable matchday experience. EuroMatchTickets has tickets for every section - from <strong>Fondo Sur</strong> ultras area to <strong>VIP hospitality boxes</strong>.</p>
            <h3 className="text-lg font-semibold text-slate-800">Why Buy From EuroMatchTickets?</h3>
            <p>We offer the <strong>cheapest Real Madrid tickets</strong> in Europe. All tickets are <strong>100% verified</strong>, delivered instantly as QR codes, and backed by our <Link to="/buyer-protection" className="text-purple-600 hover:underline">FanProtect guarantee</Link>.</p>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16" data-testid="rm-reviews">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-2 text-center text-slate-900">What Fans Say About Real Madrid Tickets</h2>
          <p className="text-center text-slate-500 mb-8">4.9/5 from 2,841 verified buyers</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reviews.map((r, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5">
                <div className="flex items-center gap-1 mb-2">{[...Array(r.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
                <p className="text-slate-600 text-sm mb-3">"{r.text}"</p>
                <div className="text-xs text-slate-400">{r.name} &middot; {r.country} &middot; {r.date}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LINK WHEEL - Internal Links Hub */}
      <section className="py-16 bg-slate-50" data-testid="rm-link-hub">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center text-slate-900">More Tickets on EuroMatchTickets</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><Trophy className="w-5 h-5 text-purple-600" /> Real Madrid</h3>
              <ul className="space-y-2">
                <li><Link to="/real-madrid-champions-league-tickets-2026" className="text-purple-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />UCL Tickets</Link></li>
                <li><Link to="/real-madrid-la-liga-tickets-2026" className="text-purple-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />La Liga Tickets</Link></li>
                <li><Link to="/el-clasico-tickets" className="text-purple-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />El Clasico</Link></li>
                <li><Link to="/bayern-vs-real-madrid-tickets" className="text-purple-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />vs Bayern Munich</Link></li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><Trophy className="w-5 h-5 text-blue-600" /> Link Wheel</h3>
              <ul className="space-y-2">
                <li><Link to="/barcelona-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Barcelona Tickets</Link></li>
                <li><Link to="/manchester-city-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Man City Tickets</Link></li>
                <li><Link to="/liverpool-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Liverpool</Link></li>
                <li><Link to="/bayern-munich-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Bayern Munich</Link></li>
                <li><Link to="/psg-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />PSG</Link></li>
                <li><Link to="/juventus-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Juventus</Link></li>
                <li><Link to="/champions-league-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Champions League</Link></li>
                <li><Link to="/world-cup-2026" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />World Cup 2026</Link></li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><Zap className="w-5 h-5 text-red-500" /> More Sports</h3>
              <ul className="space-y-2">
                <li><Link to="/f1-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />F1 Tickets 2026</Link></li>
                <li><Link to="/motogp-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />MotoGP Tickets</Link></li>
                <li><Link to="/super-bowl-2026-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Super Bowl 2026</Link></li>
                <li><Link to="/events" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />All Events</Link></li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><Star className="w-5 h-5 text-purple-500" /> Concerts</h3>
              <ul className="space-y-2">
                <li><Link to="/taylor-swift-wembley-2026-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Taylor Swift</Link></li>
                <li><Link to="/the-weeknd-tour-2026" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />The Weeknd</Link></li>
                <li><Link to="/bruno-mars-tour-2026" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Bruno Mars</Link></li>
                <li><Link to="/es/comprar-entradas" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Comprar Entradas</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16" data-testid="rm-faq">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center text-slate-900">Real Madrid Tickets FAQ</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="bg-white border border-slate-100 rounded-xl p-5 group">
                <summary className="font-semibold cursor-pointer text-slate-900 flex items-center justify-between">{faq.question}<ArrowRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" /></summary>
                <p className="mt-3 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-purple-700 to-purple-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Don't Miss Real Madrid Live</h2>
          <p className="text-purple-100 mb-8 text-lg">El Clasico, Champions League, La Liga - all at the legendary Bernabeu.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/events?type=match"><Button className="bg-white text-purple-700 hover:bg-purple-50 text-lg px-8 py-3">Browse All Matches</Button></Link>
            <Link to="/buyer-protection"><Button variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-3">FanProtect Guarantee</Button></Link>
          </div>
        </div>
      </section>

      <BreadcrumbStructuredData items={[
        { name: "Home", url: "https://euromatchtickets.com" },
        { name: "Football", url: "https://euromatchtickets.com/events?type=match" },
        { name: "Real Madrid Tickets", url: "https://euromatchtickets.com/real-madrid-tickets" }
      ]} />
      <FAQStructuredData faqs={faqs} />
    </div>
  );
};

export default RealMadridHubPage;
