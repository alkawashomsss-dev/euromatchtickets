import { Link } from "react-router-dom";
import { Calendar, MapPin, Trophy, Star, Shield, Users, TrendingUp, Zap, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
import { BreadcrumbStructuredData, FAQStructuredData } from "../components/StructuredData";
import { ScarcityBadges, TrustBar, CompetitorLine } from "../components/ConversionElements";

const LiverpoolHubPage = () => {
  const reviewSchema = {
    "@context": "https://schema.org", "image": "https://euromatchtickets.com/logo-192.png",
    "@type": "Product",
    "name": "Liverpool FC Tickets 2025-26",
    "description": "Verified Liverpool FC match tickets with QR ticket delivery",
    "brand": { "@type": "Brand", "name": "EuroMatchTickets" },
    
    
    "offers": { "@type": "Offer", "priceCurrency": "EUR", "lowPrice": "65", "highPrice": "1800","validFrom": "2025-01-01" }
  };

  const matches = [
    { home: "Liverpool", away: "Real Madrid", label: "UCL Semi-Final", venue: "Anfield", date: "May 2026", price: 185, tickets: 22, hot: true, link: "/champions-league-tickets" },
    { home: "Liverpool", away: "Man City", label: "Premier League", venue: "Anfield", date: "Mar 2026", price: 165, tickets: 31, hot: true, link: "/checkout?event=match" },
    { home: "Liverpool", away: "Man United", label: "Northwest Derby", venue: "Anfield", date: "Apr 2026", price: 155, tickets: 28, hot: true, link: "/checkout?event=match" },
    { home: "Liverpool", away: "Everton", label: "Merseyside Derby", venue: "Anfield", date: "Mar 2026", price: 135, tickets: 35, hot: true, link: "/checkout?event=match" },
    { home: "Liverpool", away: "Arsenal", label: "Premier League", venue: "Anfield", date: "Apr 2026", price: 145, tickets: 42, link: "/checkout?event=match" }
  ];

  const reviews = [
    { name: "Steven G.", country: "UK", rating: 5, text: "Anfield on a Champions League night is something else! Verified tickets I found.", date: "Feb 2026" },
    { name: "Lisa M.", country: "USA", rating: 5, text: "You'll Never Walk Alone live gave me goosebumps. Amazing prices!", date: "Jan 2026" },
    { name: "Kenji O.", country: "Japan", rating: 5, text: "Travelled from Tokyo for Liverpool vs Real Madrid. Unforgettable!", date: "Dec 2025" },
    { name: "Mia K.", country: "Germany", rating: 4, text: "Great service, tickets arrived instantly. Anfield atmosphere is unreal.", date: "Nov 2025" }
  ];

  const faqs = [
    { question: "How much are Liverpool tickets?", answer: "Liverpool tickets start from \u20AC65 for Premier League matches. Champions League tickets from \u20AC120. Derby matches from \u20AC135." },
    { question: "Where does Liverpool play?", answer: "Liverpool plays at Anfield in Liverpool, England. The stadium holds 61,276 fans and is famous for the Kop end and 'You'll Never Walk Alone' anthem." },
    { question: "Can I buy Merseyside Derby tickets?", answer: "Yes! Liverpool vs Everton tickets start from \u20AC135. One of the most passionate derbies in English football." },
    { question: "Are Liverpool tickets genuine?", answer: "verified and backed by our Buyer protection. Full refund if there's any issue." },
    { question: "How to get to Anfield?", answer: "Anfield is accessible via bus from Liverpool city centre (routes 26 and 27). Liverpool Lime Street is the nearest main station." }
  ];

  return (
    <div className="min-h-screen bg-[#0e0e14]" data-testid="liverpool-hub-page">
      <SEOHead noIndex={true} title="Liverpool Tickets 2026 | Anfield, UCL, Premier League €65" description="Buy Liverpool FC tickets from \u20AC65. Premier League, Champions League, Merseyside Derby at Anfield. You'll Never Walk Alone. Verified. Instant QR. Verified!" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-700/40 via-slate-900 to-slate-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <Badge className="bg-[#e10600]/10 text-red-700 border-red-200 mb-6"><Trophy className="w-4 h-4 mr-2" />Liverpool FC</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Liverpool Tickets 2025-26<span className="block text-2xl md:text-3xl mt-2 bg-gradient-to-r from-red-400 to-red-200 bg-clip-text text-transparent">Anfield &middot; Premier League &middot; Champions League</span></h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-4">Secure your seat now with QR ticket delivery. Buyer protection.</p>
          <ScarcityBadges ticketsLeft={423} viewers={187} priceIncrease="15%" />
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full"><Calendar className="w-5 h-5 text-red-600" /><span>2025-26 Season</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full"><MapPin className="w-5 h-5 text-red-600" /><span>Anfield, Liverpool</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full"><Users className="w-5 h-5 text-red-600" /><span>61,276 Capacity</span></div>
          </div>
          <div className="inline-block bg-white/90 border border-white/10 rounded-none p-6">
            <div className="text-slate-500 text-sm">Tickets from</div><div className="text-5xl font-bold text-white">&euro;65</div>
            <div className="text-emerald-600 text-sm mt-1 flex items-center justify-center gap-1"><CheckCircle className="w-4 h-4" /> Up to 40% cheaper than Viagogo &amp; StubHub</div>
          </div>
        </div>
      </section>

      <TrustBar />

      <section className="py-16" data-testid="lfc-matches">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Liverpool Matches 2026</h2>
          <div className="grid gap-4">
            {matches.map((m, i) => (
              <Link key={i} to={m.link} className="group flex flex-col md:flex-row md:items-center justify-between bg-[#1e1e1e] border border-white/5 hover:border-red-200 rounded-none p-6 transition-all" data-testid={`lfc-match-${i}`}>
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-14 h-14 bg-[#e10600]/10 rounded-none flex items-center justify-center"><Trophy className="w-7 h-7 text-red-600" /></div>
                  <div>
                    <div className="flex items-center gap-2"><h3 className="font-bold text-white group-hover:text-red-600">{m.home} vs {m.away}</h3>{m.hot && <Badge className="bg-red-100 text-red-600 text-xs animate-pulse">HOT</Badge>}</div>
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

      <section className="py-16 bg-[#15151e]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-white">Buy Liverpool Tickets 2025-26</h2>
          <div className="prose max-w-none text-slate-400 space-y-4">
            <p><strong>Liverpool FC</strong> is one of the most successful clubs in English football with <strong>6 Champions League titles</strong> and 19 League titles. Under Arne Slot, the Reds continue to compete at the highest level with stars like <strong>Mohamed Salah, Virgil van Dijk, and Darwin Nunez</strong>.</p>
            <p><strong>Anfield</strong> is legendary for its atmosphere, especially the famous <strong>Kop end</strong> and the spine-tingling <strong>You'll Never Walk Alone</strong> anthem before kickoff. EuroMatchTickets offers the <strong>cheapest Liverpool tickets</strong> with QR ticket delivery and <Link to="/buyer-protection" className="text-red-600 hover:underline">Buyer protection</Link>.</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-2 text-center text-white">Fan Reviews</h2>
          <p className="text-center text-slate-500 mb-8">4.9/5 from 3,412 verified buyers</p>
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

      {/* Link Wheel */}
      <section className="py-16 bg-[#15151e]" data-testid="lfc-link-hub">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center text-white">More Events</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#1e1e1e] rounded-none p-5 border border-white/5">
              <h3 className="font-bold text-white mb-3">Link Wheel</h3>
              <ul className="space-y-2">
                <li><Link to="/real-madrid-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Real Madrid</Link></li>
                <li><Link to="/barcelona-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Barcelona</Link></li>
                <li><Link to="/manchester-city-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Man City</Link></li>
                <li><Link to="/arsenal-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Arsenal</Link></li>
                <li><Link to="/bayern-munich-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Bayern Munich</Link></li>
                <li><Link to="/psg-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />PSG</Link></li>
                <li><Link to="/juventus-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Juventus</Link></li>
                <li><Link to="/champions-league-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Champions League</Link></li>
              </ul>
            </div>
            <div className="bg-[#1e1e1e] rounded-none p-5 border border-white/5">
              <h3 className="font-bold text-white mb-3">Football</h3>
              <ul className="space-y-2">
                <li><Link to="/el-clasico-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />El Clasico</Link></li>
                <li><Link to="/world-cup-2026" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />World Cup 2026</Link></li>
                <li><Link to="/events?type=match" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />All Matches</Link></li>
              </ul>
            </div>
            <div className="bg-[#1e1e1e] rounded-none p-5 border border-white/5">
              <h3 className="font-bold text-white mb-3">More</h3>
              <ul className="space-y-2">
                <li><Link to="/f1-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />F1 Tickets</Link></li>
                <li><Link to="/taylor-swift-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Taylor Swift</Link></li>
                <li><Link to="/events?type=match" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />All Events</Link></li>
              </ul>
            </div>
            <div className="bg-[#1e1e1e] rounded-none p-5 border border-white/5">
              <h3 className="font-bold text-white mb-3">International</h3>
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

      <section className="py-16" data-testid="lfc-faq">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center text-white">Liverpool Tickets FAQ</h2>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <details key={i} className="bg-[#1e1e1e] border border-white/5 rounded-none p-5 group">
                <summary className="font-semibold cursor-pointer text-white flex items-center justify-between">{f.question}<ArrowRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" /></summary>
                <p className="mt-3 text-slate-400">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-red-700 to-red-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">You'll Never Walk Alone</h2>
          <p className="text-red-100 mb-8 text-lg">Experience the magic of Anfield. Premier League, Champions League, derbies.</p>
          <Link to="/checkout?event=football-tickets"><Button className="bg-[#1e1e1e] text-red-700 hover:bg-[#e10600]/10 text-lg px-8 py-3">Browse Matches</Button></Link>
        </div>
      </section>

      <BreadcrumbStructuredData items={[{ name: "Home", url: "https://euromatchtickets.com" }, { name: "Football", url: "https://euromatchtickets.com/events?type=match" }, { name: "Liverpool Tickets", url: "https://euromatchtickets.com/liverpool-tickets" }]} />
      <FAQStructuredData faqs={faqs} />
    </div>
  );
};

export default LiverpoolHubPage;
