import { Link } from "react-router-dom";
import { Calendar, MapPin, Trophy, Star, Shield, Zap, Flag, Ticket, ChevronRight, Check, Timer, TrendingUp, Users } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
import { BreadcrumbStructuredData, FAQStructuredData } from "../components/StructuredData";

const MonzaGPPage = () => {
  const tickets = [
    { section: "General Admission (Prato)", price: 69, originalPrice: 109, available: 456, badge: "CHEAPEST", features: ["Roam the circuit freely", "Big screen areas", "Fan Zone access"], color: "border-emerald-500/30" },
    { section: "Parabolica Grandstand", price: 149, originalPrice: 199, available: 123, badge: "FAN FAVOURITE", features: ["Legendary final corner", "High-speed exit view", "Podium visible"], color: "border-red-500/30" },
    { section: "Prima Variante Grandstand", price: 169, originalPrice: 229, available: 89, badge: "BEST OVERTAKING", features: ["Turn 1 braking zone", "Most overtakes here", "Start/finish view"], color: "border-green-500/30" },
    { section: "Ascari Chicane Grandstand", price: 139, originalPrice: 189, available: 145, badge: null, features: ["Technical chicane", "Close to track", "Great photo spot"] },
    { section: "Monza VIP Village", price: 595, originalPrice: 999, available: 45, badge: "VIP", features: ["Open bar all day", "Italian gourmet cuisine", "Track-side terrace"], color: "border-purple-500/30" },
    { section: "Formula 1 Paddock Club", price: 1995, originalPrice: 2999, available: 18, badge: "EXCLUSIVE", features: ["Pit lane walks", "Driver appearances", "5-star hospitality"], color: "border-amber-500/30" },
  ];

  const monzaHistory = [
    { year: "1950", event: "First F1 race held at Monza - the original Temple of Speed" },
    { year: "1971", event: "Closest F1 finish ever - top 5 separated by 0.61 seconds" },
    { year: "2008", event: "Vettel wins first GP here at age 21 in the rain" },
    { year: "2019", event: "Leclerc gives Ferrari a dream home win - Tifosi invasion" },
    { year: "2024", event: "Record attendance - 350,000 fans across the weekend" },
  ];

  const faqs = [
    { question: "How much are Monza F1 tickets?", answer: "Monza GP tickets start from just €69 for General Admission (Prato) on EuroMatchTickets - the cheapest F1 race in Europe! Grandstand seats from €139, VIP Village from €595. All prices include 3-day access to the full race weekend." },
    { question: "What is the best grandstand at Monza?", answer: "The Parabolica Grandstand is the fan favourite - you see the final high-speed corner and the podium celebration. Prima Variante (Turn 1) is best for overtaking action. The Prato (General Admission) lets you roam freely for the cheapest price." },
    { question: "When is the Italian Grand Prix 2026?", answer: "The 2026 Italian Grand Prix at Monza is scheduled for September 4-6, 2026. Friday: Free Practice, Saturday: Qualifying, Sunday: Race. Gates typically open at 08:00." },
    { question: "How do I get to Monza from Milan?", answer: "Monza is just 15km from Milan city center. Take the metro Line 1 (Red) to Sesto FS, then a shuttle bus to the circuit. Journey time is about 45 minutes. You can also take the train from Milano Centrale to Monza station." },
    { question: "What makes Monza special?", answer: "Monza is the fastest circuit on the F1 calendar (average speed 260km/h), the spiritual home of Ferrari racing, and features the most passionate fans in F1 - the Tifosi. When a Ferrari wins, 100,000+ fans storm the track. Nothing compares." },
    { question: "Can I bring food and drinks to Monza?", answer: "Yes! Unlike many circuits, Monza allows you to bring your own food and non-alcoholic drinks. There are also excellent Italian food vendors throughout the Parco di Monza." },
  ];

  const reviewSchema = {
    "@context": "https://schema.org", "@type": "Product",
    "name": "Italian Grand Prix Monza 2026 Tickets",
    "description": "Verified Monza F1 tickets with instant QR delivery",
    "brand": { "@type": "Brand", "name": "EuroMatchTickets" },
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "4127", "bestRating": "5", "worstRating": "1" },
    "review": [
      { "@type": "Review", "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }, "author": { "@type": "Person", "name": "Marco R." }, "reviewBody": "The Tifosi atmosphere is unreal! Monza was my first F1 race and I'm hooked. Got general admission for just €69.", "datePublished": "2026-01-18" },
      { "@type": "Review", "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }, "author": { "@type": "Person", "name": "Julia S." }, "reviewBody": "Parabolica grandstand is incredible. The sound of F1 cars at 340km/h is something you never forget!", "datePublished": "2025-12-22" }
    ],
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "69", "highPrice": "1995", "offerCount": "876" }
  };

  return (
    <div className="min-h-screen bg-[hsl(210,20%,98%)]" data-testid="monza-gp-page">
      <SEOHead
        title="Monza F1 Tickets 2026 | Italian GP from €69"
        description="Buy Italian Grand Prix 2026 tickets at Monza from €69. The Temple of Speed! Parabolica, Ascari grandstands. Tifosi atmosphere. 40% cheaper! FanProtect guarantee."
        canonicalUrl="https://euromatchtickets.com/f1-italian-grand-prix-monza-tickets"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />
      <BreadcrumbStructuredData items={[
        { name: "Home", url: "https://euromatchtickets.com" },
        { name: "F1 Tickets", url: "https://euromatchtickets.com/f1-tickets" },
        { name: "Italian Grand Prix Monza", url: "https://euromatchtickets.com/f1-italian-grand-prix-monza-tickets" }
      ]} />

      {/* HERO - Italian Passion with Tricolor */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-700/20 via-white to-red-700/20" />
        <div className="absolute top-0 left-0 w-1 h-full bg-green-600" />
        <div className="absolute top-0 left-1 w-1 h-full bg-white" />
        <div className="absolute top-0 left-2 w-1 h-full bg-red-600" />

        <div className="relative max-w-6xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <Badge className="bg-red-600 text-white border-0">
                  <Flag className="w-3 h-3 mr-1" /> FORMULA 1
                </Badge>
                <Badge className="bg-green-600 text-white border-0">
                  <Trophy className="w-3 h-3 mr-1" /> TEMPLE OF SPEED
                </Badge>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-4">
                Italian Grand Prix
                <span className="block text-green-600">Monza 2026</span>
              </h1>
              <p className="text-lg text-slate-500 mb-6 max-w-xl">
                Where Ferrari dreams come true and the <strong>Tifosi</strong> roar echoes through history. 
                The <strong>fastest circuit in F1</strong> at 264 km/h average speed.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <span className="flex items-center gap-2 text-sm text-slate-600 bg-white rounded-full px-4 py-2 shadow-sm">
                  <Calendar className="w-4 h-4 text-red-600" /> Sep 4-6, 2026
                </span>
                <span className="flex items-center gap-2 text-sm text-slate-600 bg-white rounded-full px-4 py-2 shadow-sm">
                  <MapPin className="w-4 h-4 text-green-600" /> Monza, Italy
                </span>
                <span className="flex items-center gap-2 text-sm text-slate-600 bg-white rounded-full px-4 py-2 shadow-sm">
                  <Timer className="w-4 h-4 text-red-600" /> 264 km/h avg
                </span>
              </div>

              <Link to="#tickets">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 rounded-full shadow-lg shadow-red-600/20" data-testid="monza-hero-cta">
                  <Ticket className="w-5 h-5 mr-2" /> Get Monza Tickets from &euro;69
                </Button>
              </Link>
            </div>

            {/* Stats Panel */}
            <div className="w-full lg:w-auto">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 space-y-4 min-w-[280px]">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">MONZA STATS</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Circuit Length</span>
                    <span className="font-bold text-slate-900">5.793 km</span>
                  </div>
                  <div className="h-px bg-slate-100" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Top Speed</span>
                    <span className="font-bold text-red-600">365 km/h</span>
                  </div>
                  <div className="h-px bg-slate-100" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">First Race</span>
                    <span className="font-bold text-slate-900">1950</span>
                  </div>
                  <div className="h-px bg-slate-100" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Our Price</span>
                    <span className="font-bold text-emerald-600">From &euro;69</span>
                  </div>
                  <div className="h-px bg-slate-100" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Rating</span>
                    <span className="font-bold text-amber-500 flex items-center gap-1"><Star className="w-4 h-4 fill-amber-400" /> 4.9/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR - Italian style */}
      <section className="py-4 bg-gradient-to-r from-green-600 via-white to-red-600">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-full px-6 py-3 flex flex-wrap justify-center gap-6 shadow-sm">
            <span className="flex items-center gap-2 text-sm text-slate-700"><Shield className="w-4 h-4 text-green-600" /> 100% Verified</span>
            <span className="flex items-center gap-2 text-sm text-slate-700"><Zap className="w-4 h-4 text-amber-500" /> Instant Delivery</span>
            <span className="flex items-center gap-2 text-sm text-slate-700"><TrendingUp className="w-4 h-4 text-red-600" /> 40% Cheaper</span>
            <span className="flex items-center gap-2 text-sm text-slate-700"><Star className="w-4 h-4 text-amber-500 fill-amber-400" /> 4,127 Reviews</span>
          </div>
        </div>
      </section>

      {/* MONZA TIMELINE */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" /> Monza - A Legendary History
          </h2>
          <div className="space-y-0">
            {monzaHistory.map((item, i) => (
              <div key={i} className="flex gap-4 items-start pb-6 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{item.year}</div>
                  {i < monzaHistory.length - 1 && <div className="w-0.5 h-full bg-red-600/30 mt-2" />}
                </div>
                <p className="text-slate-300 text-sm pt-2">{item.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TICKETS */}
      <section id="tickets" className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Monza F1 2026 Tickets</h2>
          <p className="text-slate-500 mb-8">The cheapest F1 race in Europe - from just &euro;69!</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tickets.map((t, i) => (
              <div key={i} className={`bg-white border-2 ${t.color || 'border-slate-100'} rounded-2xl p-6 hover:shadow-lg transition-all relative overflow-hidden`} data-testid={`monza-ticket-${i}`}>
                {t.badge && (
                  <div className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full ${
                    t.badge === 'EXCLUSIVE' ? 'bg-amber-100 text-amber-700' : 
                    t.badge === 'VIP' ? 'bg-purple-100 text-purple-700' : 
                    t.badge === 'CHEAPEST' ? 'bg-emerald-100 text-emerald-700' :
                    t.badge === 'FAN FAVOURITE' ? 'bg-red-100 text-red-700' :
                    t.badge === 'BEST OVERTAKING' ? 'bg-green-100 text-green-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>{t.badge}</div>
                )}
                <h3 className="font-bold text-slate-900 text-lg mb-1">{t.section}</h3>
                <p className="text-slate-400 text-sm mb-3">Italian Grand Prix 2026 - 3-Day Pass</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {t.features.map((f, j) => <span key={j} className="text-xs text-slate-500 flex items-center gap-1"><Check className="w-3 h-3 text-green-600" />{f}</span>)}
                </div>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                  <div>
                    <span className="text-xs text-slate-400 line-through">&euro;{t.originalPrice}</span>
                    <span className="text-2xl font-black text-slate-900 ml-2">&euro;{t.price}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-red-500 font-medium">{t.available} left</span>
                    <Link to={`/checkout?event=monza-gp&category=${encodeURIComponent(t.section)}&price=${t.price}`}>
                      <Button className="bg-red-600 hover:bg-red-700 text-white font-bold">Buy Now</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIFOSI CULTURE */}
      <section className="py-16 bg-gradient-to-br from-red-50 to-green-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-red-600" /> The Tifosi Experience
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-red-600 mb-2">Track Invasion</h3>
              <p className="text-slate-600 text-sm">When a Ferrari wins at Monza, 100,000+ Tifosi fans storm the track in a wave of red. It's the most emotional moment in all of motorsport. The atmosphere is absolutely electric from Friday practice to Sunday's podium ceremony.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-green-600 mb-2">Italian Food Paradise</h3>
              <p className="text-slate-600 text-sm">Monza isn't just racing - it's a culinary festival. Fresh pasta, pizza, gelato, and espresso from local Italian vendors line the Parco di Monza. Many fans bring their own picnic. Pro tip: try the arancini near Gate 1!</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-red-600 mb-2">Best Value in F1</h3>
              <p className="text-slate-600 text-sm">At just &euro;69 for General Admission, Monza is the cheapest race on the entire F1 calendar. Combine with budget flights from anywhere in Europe, and you've got the best F1 experience for under &euro;200 total. Unbeatable value.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-green-600 mb-2">Milan Weekend</h3>
              <p className="text-slate-600 text-sm">Just 15km from Milan, combine your Monza GP weekend with world-class shopping, Da Vinci's Last Supper, AC Milan at San Siro, and Italy's fashion capital nightlife. It's the perfect European weekend.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO CONTENT */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Buy Italian Grand Prix Monza Tickets 2026 - Cheapest Online</h2>
            <p className="text-slate-600 leading-relaxed">The <strong>Italian Grand Prix at Monza</strong> is known as the "Temple of Speed" - the fastest circuit on the F1 calendar with average speeds over 264 km/h and top speeds reaching 365 km/h on the main straight. EuroMatchTickets offers Monza tickets from just <strong>&euro;69</strong> - that's 40% cheaper than the official F1.com price. Every ticket includes 3-day access, instant QR delivery, and our FanProtect money-back guarantee.</p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Best Grandstands at Monza</h2>
            <p className="text-slate-600 leading-relaxed">The <strong>Parabolica Grandstand</strong> offers views of the legendary final corner where cars exit at over 300km/h, plus you can see the podium celebrations. <strong>Prima Variante</strong> (Turn 1) is the best spot for overtaking action - this is where the race is won and lost. The <strong>Prato (General Admission)</strong> at just &euro;69 gives you freedom to roam the beautiful Parco di Monza and watch from multiple vantage points.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions - Monza GP</h2>
          <FAQStructuredData faqs={faqs} />
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <details key={i} className="group bg-white rounded-xl border border-slate-200 hover:border-red-200 transition">
                <summary className="p-5 font-bold text-slate-900 cursor-pointer list-none flex items-center justify-between">
                  {f.question}
                  <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="px-5 pb-5 text-slate-600 text-sm leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* MONZA GUIDES - Content Cluster */}
      <section className="py-12 bg-red-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Complete Monza F1 Guide</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link to="/monza-best-seats-guide" className="bg-white border border-slate-200 rounded-xl p-4 hover:border-red-300 hover:shadow-md transition-all">
              <p className="font-bold text-slate-900 text-sm">Best Seats Guide</p>
              <p className="text-xs text-slate-500 mt-1">Every grandstand rated by experts</p>
            </Link>
            <Link to="/monza-ticket-prices" className="bg-white border border-slate-200 rounded-xl p-4 hover:border-red-300 hover:shadow-md transition-all">
              <p className="font-bold text-slate-900 text-sm">Ticket Prices Compared</p>
              <p className="text-xs text-slate-500 mt-1">Save up to 40% vs competitors</p>
            </Link>
            <Link to="/how-to-get-to-monza" className="bg-white border border-slate-200 rounded-xl p-4 hover:border-red-300 hover:shadow-md transition-all">
              <p className="font-bold text-slate-900 text-sm">How to Get There</p>
              <p className="text-xs text-slate-500 mt-1">From Milan in 45 minutes</p>
            </Link>
            <Link to="/monza-f1-travel-tips" className="bg-white border border-slate-200 rounded-xl p-4 hover:border-red-300 hover:shadow-md transition-all">
              <p className="font-bold text-slate-900 text-sm">Tips & Travel Guide</p>
              <p className="text-xs text-slate-500 mt-1">Expert insider tips</p>
            </Link>
          </div>
        </div>
      </section>

      {/* LINK WHEEL */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Explore More Events</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { to: "/f1-monaco-grand-prix-tickets", label: "Monaco GP", price: "195", tag: "GLAMOUR" },
              { to: "/f1-bahrain-grand-prix-tickets", label: "Bahrain GP", price: "59", tag: "NIGHT RACE" },
              { to: "/f1-british-grand-prix-silverstone-tickets", label: "Silverstone", price: "95", tag: "CLASSIC" },
              { to: "/f1-singapore-grand-prix-tickets", label: "Singapore GP", price: "129", tag: "STREET" },
              { to: "/champions-league-tickets", label: "Champions League", price: "49", tag: "FOOTBALL" },
              { to: "/real-madrid-tickets", label: "Real Madrid", price: "49", tag: "BERNABEU" },
              { to: "/taylor-swift-london-tickets", label: "Taylor Swift", price: "89", tag: "CONCERT" },
              { to: "/world-cup-2026", label: "World Cup 2026", price: "65", tag: "FIFA" },
            ].map((l, i) => (
              <Link key={i} to={l.to} className="bg-white border border-slate-200 rounded-xl p-4 hover:border-red-300 hover:shadow-md transition-all group">
                <p className="font-bold text-slate-900 text-sm group-hover:text-red-600 transition-colors">{l.label}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-emerald-600 text-xs font-bold">From &euro;{l.price}</span>
                  <span className="text-[9px] text-slate-400 font-bold">{l.tag}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED SEARCHES */}
      <section className="py-8 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-sm font-bold text-slate-400 mb-3">Related Searches:</h3>
          <div className="flex flex-wrap gap-2">
            {["Monza F1 tickets", "Italian GP tickets", "Italian Grand Prix 2026", "Monza tickets cheap", "F1 Monza general admission", "Monza Tifosi", "Monza grandstand tickets", "Italian GP hospitality", "Autodromo Nazionale Monza tickets", "Monza VIP", "buy Monza tickets online", "F1 Italy 2026"].map((term, i) => (
              <span key={i} className="px-3 py-1 bg-slate-100 text-slate-400 rounded-full text-xs">{term}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MonzaGPPage;
