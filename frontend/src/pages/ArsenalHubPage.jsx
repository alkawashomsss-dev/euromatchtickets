import { Link } from "react-router-dom";
import { Calendar, MapPin, Trophy, Star, Shield, Users, TrendingUp, Zap, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
import { BreadcrumbStructuredData, FAQStructuredData } from "../components/StructuredData";

const ArsenalHubPage = () => {
  const reviewSchema = {
    "@context": "https://schema.org", "@type": "Product",
    "name": "Arsenal FC Tickets 2025-26",
    "description": "Verified Arsenal FC match tickets with instant QR delivery",
    "brand": { "@type": "Brand", "name": "EuroMatchTickets" },
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "2187", "bestRating": "5" },
    "review": [
      { "@type": "Review", "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }, "author": { "@type": "Person", "name": "Jack W." }, "reviewBody": "Emirates on a European night is unreal! Saka was incredible. Cheapest tickets I found.", "datePublished": "2026-02-18" },
      { "@type": "Review", "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }, "author": { "@type": "Person", "name": "Amira F." }, "reviewBody": "North London Derby was the best football experience of my life! Great prices.", "datePublished": "2026-01-10" }
    ],
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "65", "highPrice": "1500", "offerCount": "245" }
  };

  const matches = [
    { home: "Arsenal", away: "Bayern Munich", label: "UCL Quarter-Final", venue: "Emirates Stadium", date: "Apr 2026", price: 165, tickets: 24, hot: true, link: "/champions-league-tickets" },
    { home: "Arsenal", away: "Tottenham", label: "North London Derby", venue: "Emirates Stadium", date: "Mar 2026", price: 175, tickets: 18, hot: true, link: "/events?type=match" },
    { home: "Arsenal", away: "Man City", label: "Premier League", venue: "Emirates Stadium", date: "Apr 2026", price: 155, tickets: 33, hot: true, link: "/events?type=match" },
    { home: "Arsenal", away: "Liverpool", label: "Premier League", venue: "Emirates Stadium", date: "May 2026", price: 145, tickets: 29, hot: true, link: "/events?type=match" },
    { home: "Arsenal", away: "Chelsea", label: "London Derby", venue: "Emirates Stadium", date: "Mar 2026", price: 135, tickets: 45, link: "/events?type=match" },
  ];

  const reviews = [
    { name: "Jack W.", country: "UK", rating: 5, text: "Emirates on a European night is unreal! Saka was incredible. Cheapest tickets!", date: "Feb 2026" },
    { name: "Amira F.", country: "Egypt", rating: 5, text: "North London Derby was the best football experience of my life!", date: "Jan 2026" },
    { name: "Thomas B.", country: "Germany", rating: 5, text: "Arsenal vs Bayern was electric. Tickets arrived in seconds.", date: "Dec 2025" },
    { name: "Chloe P.", country: "France", rating: 4, text: "Great atmosphere at Emirates. Easy booking, instant delivery.", date: "Nov 2025" },
  ];

  const faqs = [
    { question: "How much are Arsenal tickets?", answer: "Arsenal tickets start from \u20AC65 for Premier League. Champions League from \u20AC110. North London Derby from \u20AC175." },
    { question: "Where does Arsenal play?", answer: "Arsenal plays at the Emirates Stadium in Holloway, North London. Capacity 60,704. Nearest tube: Arsenal (Piccadilly line)." },
    { question: "Can I buy North London Derby tickets?", answer: "Yes! Arsenal vs Tottenham tickets start from \u20AC175. The most intense rivalry in London football!" },
    { question: "Are Arsenal tickets genuine?", answer: "100% verified with FanProtect guarantee. Full refund if cancelled or any issue." },
    { question: "Who are Arsenal's best players?", answer: "Bukayo Saka, Martin Odegaard, Declan Rice, William Saliba, and Kai Havertz lead Mikel Arteta's title-challenging squad." },
  ];

  return (
    <div className="min-h-screen bg-[hsl(210,20%,98%)]" data-testid="arsenal-hub-page">
      <SEOHead title="Arsenal Tickets 2026 | Emirates, UCL, Premier League €65" description="Buy Arsenal FC tickets from \u20AC65. Premier League, Champions League, North London Derby at Emirates. Saka, Odegaard. Verified. Instant QR. Cheapest!" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-800/40 via-slate-900 to-slate-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <Badge className="bg-red-50 text-red-700 border-red-200 mb-6"><Trophy className="w-4 h-4 mr-2" />Arsenal FC</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Arsenal Tickets 2025-26<span className="block text-2xl md:text-3xl mt-2 bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">Emirates Stadium &middot; Premier League &middot; Champions League</span></h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8">Watch Arteta's Gunners challenge for every trophy. Saka, Odegaard, Rice - live at the Emirates. Cheapest tickets guaranteed.</p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full"><Calendar className="w-5 h-5 text-red-600" /><span>2025-26 Season</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full"><MapPin className="w-5 h-5 text-red-600" /><span>Emirates Stadium, London</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full"><Users className="w-5 h-5 text-red-600" /><span>60,704 Capacity</span></div>
          </div>
          <div className="inline-block bg-white/90 border border-slate-200 rounded-2xl p-6">
            <div className="text-slate-500 text-sm">Tickets from</div><div className="text-5xl font-bold text-white">&euro;65</div>
            <div className="text-emerald-600 text-sm mt-1 flex items-center justify-center gap-1"><CheckCircle className="w-4 h-4" /> Cheapest in Europe</div>
          </div>
        </div>
      </section>

      <section className="py-5 border-y border-slate-100 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-8">
          <div className="flex items-center gap-2 text-emerald-600"><Shield className="w-5 h-5" /><span>100% Verified</span></div>
          <div className="flex items-center gap-2 text-emerald-600"><Star className="w-5 h-5" /><span>4.8/5 (2,187 Reviews)</span></div>
          <div className="flex items-center gap-2 text-emerald-600"><TrendingUp className="w-5 h-5" /><span>7,500+ Arsenal Tickets Sold</span></div>
        </div>
      </section>

      <section className="py-16" data-testid="afc-matches">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">Arsenal Matches 2026</h2>
          <div className="grid gap-4">
            {matches.map((m, i) => (
              <Link key={i} to={m.link} className="group flex flex-col md:flex-row md:items-center justify-between bg-white border border-slate-100 hover:border-red-200 rounded-2xl p-6 transition-all" data-testid={`afc-match-${i}`}>
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center"><Trophy className="w-7 h-7 text-red-600" /></div>
                  <div>
                    <div className="flex items-center gap-2"><h3 className="font-bold text-slate-900 group-hover:text-red-600">{m.home} vs {m.away}</h3>{m.hot && <Badge className="bg-red-100 text-red-600 text-xs animate-pulse">HOT</Badge>}</div>
                    <p className="text-slate-400 text-sm">{m.label} &middot; {m.date} &middot; {m.venue}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-cyan-600 text-sm">{m.tickets} left</span>
                  <div className="text-right"><div className="text-xs text-slate-400">From</div><div className="text-xl font-bold text-red-600">&euro;{m.price}</div></div>
                  <Button className="bg-red-600 hover:bg-red-700">Buy</Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-slate-900">Buy Arsenal Tickets 2025-26</h2>
          <div className="prose max-w-none text-slate-600 space-y-4">
            <p><strong>Arsenal FC</strong> under Mikel Arteta has become one of the most exciting teams in Europe. The Gunners are serious contenders for the <strong>Premier League title and Champions League</strong>, with a squad featuring <strong>Bukayo Saka, Martin Odegaard, Declan Rice, and William Saliba</strong>.</p>
            <p>The <strong>Emirates Stadium</strong> in North London holds 60,704 fans and has become a fortress under Arteta. EuroMatchTickets offers the <strong>cheapest Arsenal tickets</strong> with instant QR delivery and <Link to="/buyer-protection" className="text-red-600 hover:underline">FanProtect guarantee</Link>.</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-2 text-center text-slate-900">Fan Reviews</h2>
          <p className="text-center text-slate-500 mb-8">4.8/5 from 2,187 verified buyers</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reviews.map((r, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5">
                <div className="flex items-center gap-1 mb-2">{[...Array(r.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}{[...Array(5 - r.rating)].map((_, j) => <Star key={j} className="w-4 h-4 text-slate-200" />)}</div>
                <p className="text-slate-600 text-sm mb-3">"{r.text}"</p>
                <div className="text-xs text-slate-400">{r.name} &middot; {r.country} &middot; {r.date}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Link Wheel */}
      <section className="py-16 bg-slate-50" data-testid="afc-link-hub">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center text-slate-900">More Events</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-3">Link Wheel</h3>
              <ul className="space-y-2">
                <li><Link to="/liverpool-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Liverpool</Link></li>
                <li><Link to="/real-madrid-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Real Madrid</Link></li>
                <li><Link to="/barcelona-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Barcelona</Link></li>
                <li><Link to="/manchester-city-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Man City</Link></li>
                <li><Link to="/champions-league-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Champions League</Link></li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-3">Football</h3>
              <ul className="space-y-2">
                <li><Link to="/el-clasico-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />El Clasico</Link></li>
                <li><Link to="/world-cup-2026" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />World Cup 2026</Link></li>
                <li><Link to="/events?type=match" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />All Matches</Link></li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-3">More</h3>
              <ul className="space-y-2">
                <li><Link to="/f1-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />F1 Tickets</Link></li>
                <li><Link to="/taylor-swift-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Taylor Swift</Link></li>
                <li><Link to="/events" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />All Events</Link></li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-3">International</h3>
              <ul className="space-y-2">
                <li><Link to="/fr/acheter-billets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Acheter Billets</Link></li>
                <li><Link to="/it/biglietti" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Biglietti</Link></li>
                <li><Link to="/es/comprar-entradas" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Entradas</Link></li>
                <li><Link to="/de/tickets-kaufen" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Tickets Kaufen</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="afc-faq">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center text-slate-900">Arsenal Tickets FAQ</h2>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <details key={i} className="bg-white border border-slate-100 rounded-xl p-5 group">
                <summary className="font-semibold cursor-pointer text-slate-900 flex items-center justify-between">{f.question}<ArrowRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" /></summary>
                <p className="mt-3 text-slate-600">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-red-700 to-red-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Come On You Gunners!</h2>
          <p className="text-red-100 mb-8 text-lg">Premier League, Champions League, North London Derby - all at the Emirates.</p>
          <Link to="/events?type=match"><Button className="bg-white text-red-700 hover:bg-red-50 text-lg px-8 py-3">Browse Matches</Button></Link>
        </div>
      </section>

      <BreadcrumbStructuredData items={[{ name: "Home", url: "https://euromatchtickets.com" }, { name: "Football", url: "https://euromatchtickets.com/events?type=match" }, { name: "Arsenal Tickets", url: "https://euromatchtickets.com/arsenal-tickets" }]} />
      <FAQStructuredData faqs={faqs} />
    </div>
  );
};

export default ArsenalHubPage;
