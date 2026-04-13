import { Link } from "react-router-dom";
import { Calendar, MapPin, Trophy, Star, Shield, Users, TrendingUp, Zap, ArrowRight, CheckCircle, Globe, Ticket, Music } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
import { BreadcrumbStructuredData, FAQStructuredData } from "../components/StructuredData";
import { ScarcityBadges, TrustBar } from "../components/ConversionElements";

const BarcelonaHubPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": "FC Barcelona 2025-26 Season",
    "description": "Buy FC Barcelona tickets for La Liga, Champions League, and concerts at Spotify Camp Nou. Cheapest prices guaranteed.",
    "image": "https://euromatchtickets.com/logo-192.png",
    "startDate": "2025-08-15",
    "endDate": "2026-06-01",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": { "@type": "Place", "name": "Spotify Camp Nou", "address": { "@type": "PostalAddress", "addressLocality": "Barcelona", "addressCountry": "ES" } },
    "performer": { "@type": "SportsTeam", "name": "FC Barcelona" },
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR",
              "offerCount": "100", "lowPrice": "65", "highPrice": "2200", "availability": "https://schema.org/InStock", "validFrom": "2025-01-01", "url": "https://euromatchtickets.com/barcelona-tickets" }
  };

  const reviewSchema = {
    "@context": "https://schema.org",
    "image": "https://euromatchtickets.com/logo-192.png",
    "@type": "Product",
    "name": "FC Barcelona Tickets 2025-26",
    "description": "Verified FC Barcelona match and concert tickets at Camp Nou with instant QR delivery",
    "brand": { "@type": "Brand", "name": "EuroMatchTickets" },
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "4156", "bestRating": "5", "worstRating": "1" },
    "review": [
      { "@type": "Review", "name": "Magical Camp Nou at half the price", "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }, "author": { "@type": "Person", "name": "Maria G." }, "reviewBody": "Camp Nou was magical! Got La Liga tickets for half the price of other sites. Amazing!", "datePublished": "2026-02-18" },
      { "@type": "Review", "name": "Best El Clasico night of my life", "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }, "author": { "@type": "Person", "name": "Tom B." }, "reviewBody": "Barcelona vs Real Madrid - El Clasico - best night of my life. Tickets were legit and cheap.", "datePublished": "2026-01-22" },
      { "@type": "Review", "name": "Smooth Coldplay Camp Nou booking", "reviewRating": { "@type": "Rating", "ratingValue": "4", "bestRating": "5" }, "author": { "@type": "Person", "name": "Priya S." }, "reviewBody": "Booked Coldplay at Camp Nou through EuroMatchTickets. Smooth process, instant delivery.", "datePublished": "2025-11-30" }
    ],
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "65", "highPrice": "2200", "offerCount": "587" , "validFrom": "2025-01-01" }
  };

  const matches = [
    { home: "Barcelona", away: "Real Madrid", label: "El Clasico", venue: "Camp Nou", date: "Oct 2026", price: 185, tickets: 31, hot: true, link: "/el-clasico-tickets" },
    { home: "Barcelona", away: "Bayern Munich", label: "UCL Group Stage", venue: "Camp Nou", date: "Nov 2025", price: 155, tickets: 42, hot: true, link: "/barcelona-champions-league-tickets-2026" },
    { home: "Barcelona", away: "PSG", label: "UCL Knockout", venue: "Camp Nou", date: "Mar 2026", price: 175, tickets: 27, hot: true, link: "/barcelona-champions-league-tickets-2026" },
    { home: "Barcelona", away: "Atletico Madrid", label: "La Liga", venue: "Camp Nou", date: "Apr 2026", price: 95, tickets: 68, link: "/barcelona-la-liga-tickets-2026" },
    { home: "Barcelona", away: "Sevilla", label: "La Liga", venue: "Camp Nou", date: "Mar 2026", price: 75, tickets: 92, link: "/barcelona-la-liga-tickets-2026" },
  ];

  const concerts = [
    { artist: "Coldplay", tour: "Music of the Spheres", date: "Jun 2026", price: 85, link: "/coldplay-barcelona-tickets-2026" },
    { artist: "Ed Sheeran", tour: "Mathematics Tour", date: "Jul 2026", price: 75, link: "/ed-sheeran-barcelona-tickets-2026" },
    { artist: "Bruno Mars", tour: "24K World Tour", date: "Aug 2026", price: 95, link: "/bruno-mars-barcelona-tickets-2026" },
    { artist: "Beyonce", tour: "Renaissance Tour", date: "Sep 2026", price: 110, link: "/beyonce-barcelona-tickets-2026" },
  ];

  const reviews = [
    { name: "Maria G.", country: "Spain", rating: 5, text: "Camp Nou was magical! Got La Liga tickets for half the price. Amazing!", date: "Feb 2026" },
    { name: "Tom B.", country: "UK", rating: 5, text: "El Clasico - best night of my life. Tickets were legit and cheap.", date: "Jan 2026" },
    { name: "Priya S.", country: "India", rating: 5, text: "Booked Coldplay at Camp Nou. Smooth process, instant delivery.", date: "Nov 2025" },
    { name: "Lars K.", country: "Germany", rating: 4, text: "Great prices for Barcelona vs Bayern. The new Camp Nou is incredible!", date: "Oct 2025" },
  ];

  const faqs = [
    { question: "How much are Barcelona tickets?", answer: "FC Barcelona tickets start from \u20AC65 for La Liga matches. Champions League tickets start at \u20AC120, and El Clasico tickets from \u20AC185. Concert tickets at Camp Nou start from \u20AC75." },
    { question: "Where does Barcelona play?", answer: "FC Barcelona plays at Spotify Camp Nou in Barcelona, Spain. The stadium is being renovated to hold 105,000 spectators, making it the largest in Europe." },
    { question: "Can I buy El Clasico tickets?", answer: "Yes! El Clasico (Barcelona vs Real Madrid) tickets are available starting from \u20AC185. These are our most popular football tickets - book early!" },
    { question: "Are there concerts at Camp Nou?", answer: "Yes! Camp Nou hosts major concerts including Coldplay, Ed Sheeran, Bruno Mars, Beyonce, and more. Concert tickets start from \u20AC75." },
    { question: "Are Barcelona tickets on EuroMatchTickets genuine?", answer: "100% verified. Every ticket comes with our FanProtect guarantee - full refund if cancelled or if there's any issue with your tickets." },
    { question: "How do I get to Camp Nou?", answer: "Camp Nou is easily accessible by Barcelona Metro (Line 3 - Les Corts or Line 5 - Collblanc). It's located in the Les Corts district." },
  ];

  return (
    <div className="min-h-screen bg-[#0e0e14]" data-testid="barcelona-hub-page">
      <SEOHead
        title="Barcelona Tickets 2026 | Camp Nou, UCL, El Clasico"
        description="Buy FC Barcelona tickets from \u20AC65. La Liga, Champions League, El Clasico, concerts at Camp Nou. Coldplay, Ed Sheeran. Verified. Instant QR. Cheapest prices."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-blue-900/40 to-slate-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <Badge className="bg-[#e10600]/10 text-red-700 border-red-200 mb-6"><Trophy className="w-4 h-4 mr-2" />FC Barcelona</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Barcelona Tickets 2025-26
            <span className="block text-2xl md:text-3xl mt-2 bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent">Camp Nou &middot; Football &middot; Concerts</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-4">Secure your seat now with instant QR delivery. 100% Buyer Protection.</p>
          <ScarcityBadges ticketsLeft={634} viewers={445} priceIncrease="19%" />
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full"><Calendar className="w-5 h-5 text-red-600" /><span>2025-26 Season</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full"><MapPin className="w-5 h-5 text-red-600" /><span>Spotify Camp Nou</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full"><Users className="w-5 h-5 text-red-600" /><span>105,000 Capacity</span></div>
          </div>
          <div className="inline-block bg-white/90 border border-white/10 rounded-none p-6">
            <div className="text-slate-500 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-white">&euro;65</div>
            <div className="text-emerald-600 text-sm mt-1 flex items-center justify-center gap-1"><CheckCircle className="w-4 h-4" /> Up to 40% cheaper than Viagogo &amp; StubHub</div>
          </div>
        </div>
      </section>

      <TrustBar />

      {/* Football Matches */}
      <section className="py-16" data-testid="barca-matches">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Barcelona Football Matches 2026</h2>
          <div className="grid gap-4">
            {matches.map((m, i) => (
              <Link key={i} to={m.link} className="group flex flex-col md:flex-row md:items-center justify-between bg-[#1e1e1e] border border-white/5 hover:border-red-200 rounded-none p-6 transition-all" data-testid={`barca-match-${i}`}>
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-14 h-14 bg-[#e10600]/10 rounded-none flex items-center justify-center"><Trophy className="w-7 h-7 text-red-600" /></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white group-hover:text-red-600">{m.home} vs {m.away}</h3>
                      {m.hot && <Badge className="bg-red-100 text-red-600 text-xs animate-pulse">HOT</Badge>}
                    </div>
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

      {/* Concerts at Camp Nou */}
      <section className="py-16 bg-[#15151e]" data-testid="barca-concerts">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Concerts at Camp Nou 2026</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {concerts.map((c, i) => (
              <Link key={i} to={c.link} className="group bg-[#1e1e1e] border border-white/5 hover:border-purple-200 rounded-none p-6 transition-all text-center" data-testid={`barca-concert-${i}`}>
                <Music className="w-10 h-10 text-purple-500 mx-auto mb-3" />
                <h3 className="font-bold text-white group-hover:text-purple-600">{c.artist}</h3>
                <p className="text-slate-400 text-sm mb-2">{c.tour}</p>
                <p className="text-slate-400 text-xs mb-3">{c.date} &middot; Camp Nou</p>
                <div className="text-purple-600 font-bold text-lg">From &euro;{c.price}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-white">Buy Barcelona Tickets 2025-26</h2>
          <div className="prose max-w-none text-slate-400 space-y-4">
            <p><strong>FC Barcelona</strong> is one of the world's most iconic football clubs with 5 Champions League titles. The 2025-26 season at the renovated <strong>Spotify Camp Nou</strong> - set to become <strong>Europe's largest stadium at 105,000 capacity</strong> - promises unforgettable experiences both on and off the pitch.</p>
            <p>Beyond football, Camp Nou has become <strong>Barcelona's premier concert venue</strong>, hosting world tours from <strong>Coldplay, Ed Sheeran, Beyonce, Bruno Mars</strong>, and more. EuroMatchTickets offers the cheapest tickets for all events at Camp Nou.</p>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 bg-[#15151e]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-2 text-center text-white">Verified Fan Reviews</h2>
          <p className="text-center text-slate-500 mb-8">4.8/5 from 4,156 verified buyers</p>
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
      <section className="py-16" data-testid="barca-link-hub">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center text-white">More Events on EuroMatchTickets</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#1e1e1e] rounded-none p-5 border border-white/5">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Trophy className="w-5 h-5 text-red-600" /> Barcelona</h3>
              <ul className="space-y-2">
                <li><Link to="/barcelona-champions-league-tickets-2026" className="text-red-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />UCL Tickets</Link></li>
                <li><Link to="/barcelona-la-liga-tickets-2026" className="text-red-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />La Liga Tickets</Link></li>
                <li><Link to="/barcelona-concerts-tickets-2026" className="text-red-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Camp Nou Concerts</Link></li>
                <li><Link to="/el-clasico-tickets" className="text-red-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />El Clasico</Link></li>
              </ul>
            </div>
            <div className="bg-[#1e1e1e] rounded-none p-5 border border-white/5">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Trophy className="w-5 h-5 text-blue-600" /> Link Wheel</h3>
              <ul className="space-y-2">
                <li><Link to="/real-madrid-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Real Madrid Tickets</Link></li>
                <li><Link to="/manchester-city-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Man City Tickets</Link></li>
                <li><Link to="/liverpool-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Liverpool</Link></li>
                <li><Link to="/bayern-munich-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Bayern Munich</Link></li>
                <li><Link to="/psg-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />PSG</Link></li>
                <li><Link to="/juventus-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Juventus</Link></li>
                <li><Link to="/champions-league-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Champions League</Link></li>
                <li><Link to="/world-cup-2026" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />World Cup 2026</Link></li>
              </ul>
            </div>
            <div className="bg-[#1e1e1e] rounded-none p-5 border border-white/5">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Music className="w-5 h-5 text-purple-500" /> Camp Nou Concerts</h3>
              <ul className="space-y-2">
                <li><Link to="/coldplay-barcelona-tickets-2026" className="text-purple-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Coldplay</Link></li>
                <li><Link to="/ed-sheeran-barcelona-tickets-2026" className="text-purple-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Ed Sheeran</Link></li>
                <li><Link to="/beyonce-barcelona-tickets-2026" className="text-purple-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Beyonce</Link></li>
                <li><Link to="/bruno-mars-barcelona-tickets-2026" className="text-purple-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Bruno Mars</Link></li>
              </ul>
            </div>
            <div className="bg-[#1e1e1e] rounded-none p-5 border border-white/5">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Zap className="w-5 h-5 text-red-500" /> More Sports</h3>
              <ul className="space-y-2">
                <li><Link to="/f1-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />F1 Tickets</Link></li>
                <li><Link to="/f1-spanish-grand-prix-barcelona-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Barcelona F1 GP</Link></li>
                <li><Link to="/motogp-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />MotoGP Tickets</Link></li>
                <li><Link to="/events?type=match" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />All Events</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-[#15151e]" data-testid="barca-faq">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center text-white">Barcelona Tickets FAQ</h2>
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
      <section className="py-16 bg-gradient-to-br from-red-700 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Experience Barcelona Live</h2>
          <p className="text-red-100 mb-8 text-lg">Football, concerts, culture - all at the legendary Camp Nou.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/events?type=match"><Button className="bg-[#1e1e1e] text-red-700 hover:bg-[#e10600]/10 text-lg px-8 py-3">Football Matches</Button></Link>
            <Link to="/checkout?event=concerts-2026"><Button variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-3">Concert Tickets</Button></Link>
          </div>
        </div>
      </section>

      <BreadcrumbStructuredData items={[
        { name: "Home", url: "https://euromatchtickets.com" },
        { name: "Football", url: "https://euromatchtickets.com/events?type=match" },
        { name: "Barcelona Tickets", url: "https://euromatchtickets.com/barcelona-tickets" }
      ]} />
      <FAQStructuredData faqs={faqs} />
    </div>
  );
};

export default BarcelonaHubPage;
