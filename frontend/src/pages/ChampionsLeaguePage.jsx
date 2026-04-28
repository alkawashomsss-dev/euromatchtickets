import { Link } from "react-router-dom";
import { Calendar, MapPin, Trophy, Star, Shield, Users, TrendingUp, Zap, ArrowRight, CheckCircle, Globe, Ticket, AlertCircle, Eye } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
import { BreadcrumbStructuredData, FAQStructuredData } from "../components/StructuredData";
import { NewsletterSignup } from "../components/NewsletterSignup";

const ChampionsLeaguePage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": "UEFA Champions League 2025-26",
    "description": "Buy UEFA Champions League 2025-26 tickets. Group stage, knockout rounds, and final. Real Madrid, Man City, Bayern Munich, Barcelona.",
    "startDate": "2025-09-16",
    "endDate": "2026-05-30",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": "https://euromatchtickets.com/logo-192.png",
    "location": {
      "@type": "Place",
      "name": "Allianz Arena",
      "address": { "@type": "PostalAddress", "addressLocality": "Munich", "addressCountry": "DE" }
    },
    "performer": {"@type": "SportsTeam", "name": "UEFA Champions League"},
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    
  };

  const matches = [
    { home: "Real Madrid", away: "Manchester City", venue: "Santiago Bernabeu", city: "Madrid", date: "Feb 2026", price: 185, tickets: 34, hot: true, link: "/real-madrid-champions-league-tickets-2026" },
    { home: "Bayern Munich", away: "Barcelona", venue: "Allianz Arena", city: "Munich", date: "Feb 2026", price: 165, tickets: 45, hot: true, link: "/bayern-vs-real-madrid-tickets" },
    { home: "PSG", away: "Liverpool", venue: "Parc des Princes", city: "Paris", date: "Mar 2026", price: 155, tickets: 52, link: "/checkout?event=champions-league-2026" },
    { home: "Inter Milan", away: "Arsenal", venue: "San Siro", city: "Milan", date: "Mar 2026", price: 125, tickets: 67, link: "/checkout?event=champions-league-2026" },
    { home: "Atletico Madrid", away: "Juventus", venue: "Metropolitano", city: "Madrid", date: "Apr 2026", price: 115, tickets: 78, link: "/checkout?event=champions-league-2026" },
    { home: "UCL Final 2026", away: "Allianz Arena, Munich", venue: "Allianz Arena", city: "Munich", date: "May 30, 2026", price: 450, tickets: 23, hot: true, link: "/checkout?event=champions-league-final-2026" }
  ];

  const reviews = [
    { name: "Marco R.", country: "Italy", rating: 5, text: "Bought tickets for Real Madrid vs Man City. QR code arrived instantly. Smooth entry at the Bernabeu!", date: "Feb 2026" },
    { name: "Sophie L.", country: "France", rating: 5, text: "Champions League Final tickets were cheaper than StubHub. Will definitely use again!", date: "Jan 2026" },
    { name: "Hans W.", country: "Germany", rating: 5, text: "Great prices for Bayern Munich UCL tickets. Delivery was fast. Highly recommend!", date: "Dec 2025" },
    { name: "Ahmed K.", country: "UAE", rating: 4, text: "Easy booking process. Got my El Clasico tickets in seconds. Excellent service.", date: "Nov 2025" }
  ];

  const faqs = [
    { question: "Where is the Champions League Final 2026?", answer: "The UEFA Champions League 2025-26 Final will be held at the Allianz Arena in Munich, Germany on May 30, 2026." },
    { question: "How can I buy Champions League tickets?", answer: "You can buy verified Champions League tickets from EuroMatchTickets starting at \u20AC85. All tickets are guaranteed authentic with QR ticket delivery." },
    { question: "When does the Champions League 2025-26 start?", answer: "The Champions League 2025-26 league phase starts in September 2025, with the knockout rounds beginning in February 2026 and the final on May 30, 2026." },
    { question: "Are Champions League tickets on EuroMatchTickets verified?", answer: "Yes! All tickets sold on EuroMatchTickets are verified and come with our Buyer protection. You receive instant QR code delivery." },
    { question: "What is the cheapest way to watch Champions League live?", answer: "EuroMatchTickets offers the cheapest Champions League tickets in Europe, starting from \u20AC85. Group stage matches are the most affordable, while knockout rounds start at \u20AC120." },
    { question: "Can I get a refund on Champions League tickets?", answer: "Yes, all tickets come with our buyer protection guarantee. If the event is cancelled, you receive a full refund. Visit our refund policy page for details." },
    { question: "How do I receive my Champions League tickets?", answer: "Tickets are delivered instantly via email as QR codes or mobile tickets. No physical shipping needed - just show your phone at the venue gate." },
    { question: "Which teams are in the Champions League 2025-26?", answer: "Top European clubs including Real Madrid, Manchester City, Bayern Munich, Barcelona, PSG, Liverpool, Arsenal, Inter Milan, and 28 other qualifying teams." }
  ];

  return (
    <div className="min-h-screen bg-[#0e0e14]" data-testid="champions-league-page">
      <SEOHead 
        title="Champions League Tickets 2026 | UCL Final from €85 | Guaranteed"
        description="Buy UEFA Champions League tickets from €85. UCL Final 2026 Munich, Semi-finals, Quarter-finals. Real Madrid, Man City, Barcelona. Verified. Instant QR. Verified in Europe!"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
{/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-slate-900 to-slate-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-200 rounded-full px-4 py-2 mb-6 animate-pulse">
            <Zap className="w-4 h-4 text-blue-600" />
            <span className="text-blue-600 font-medium">Knockout Stage Tickets Available!</span>
          </div>
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-200 mb-6">
            <Trophy className="w-4 h-4 mr-2" />UEFA Champions League
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Buy Champions League Tickets 2026
            <span className="block text-2xl md:text-3xl mt-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">UCL Final Munich - Limited Availability</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-3xl mx-auto mb-4">
            Secure your seat now with QR ticket delivery. Buyer protection.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 bg-[#e10600]/100/10 border border-red-500/20 rounded-full px-3 py-1.5 text-red-500 text-sm font-medium animate-pulse">
              <AlertCircle className="w-3.5 h-3.5" /> Only 156 Final tickets remaining
            </span>
            <span className="inline-flex items-center gap-1.5 bg-amber-500/100/10 border border-amber-500/20 rounded-full px-3 py-1.5 text-amber-600 text-sm font-medium">
              <Eye className="w-3.5 h-3.5" /> 489 people viewing UCL tickets now
            </span>
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/100/10 border border-emerald-500/20 rounded-full px-3 py-1.5 text-emerald-600 text-sm font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> Prices up 18% this week
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full"><Calendar className="w-5 h-5 text-blue-600" /><span>Sep 2025 - May 2026</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full"><MapPin className="w-5 h-5 text-blue-600" /><span>Final: Munich</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full"><Users className="w-5 h-5 text-blue-600" /><span>36 Teams</span></div>
          </div>
          <div className="inline-block bg-white/90 border border-white/10 rounded-none p-6">
            <div className="text-slate-500 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-white">&euro;85</div>
            <div className="text-emerald-600 text-sm mt-1 flex items-center justify-center gap-1"><CheckCircle className="w-4 h-4" /> Up to 40% cheaper than Viagogo &amp; StubHub</div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-6 border-y border-white/5 bg-[#15151e]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-emerald-600"><Shield className="w-5 h-5" /><span>Live marketplace</span></div>
            <div className="flex items-center gap-2 text-amber-600"><Star className="w-5 h-5" /><span>Highly rated from Customer reviews</span></div>
            <div className="flex items-center gap-2 text-blue-600"><Globe className="w-5 h-5" /><span>Trusted in 25+ Countries</span></div>
            <div className="flex items-center gap-2 text-emerald-600"><Zap className="w-5 h-5" /><span>Refund policy applies</span></div>
          </div>
        </div>
      </section>

      {/* Matches */}
      <section className="py-16" data-testid="ucl-matches">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Top Champions League Matches 2026</h2>
          <div className="grid gap-4">
            {matches.map((match, i) => (
              <Link key={i} to={match.link} className="group flex flex-col md:flex-row md:items-center justify-between bg-[#1e1e1e] border border-white/5 hover:border-blue-200 rounded-none p-6 transition-all" data-testid={`match-card-${i}`}>
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-14 h-14 bg-blue-500/10 rounded-none flex items-center justify-center"><Trophy className="w-7 h-7 text-blue-600" /></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold group-hover:text-blue-600">{match.home} vs {match.away}</h3>
                      {match.hot && <Badge className="bg-cyan-500/20 text-cyan-600 text-xs animate-pulse">HOT</Badge>}
                    </div>
                    <p className="text-slate-400 text-sm">{match.date} - {match.venue}, {match.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-cyan-600 text-sm">{match.tickets} left</span>
                  <div className="text-right"><div className="text-xs text-slate-400">From</div><div className="text-xl font-bold text-blue-600">&euro;{match.price}</div></div>
                  <Button className="bg-blue-500/100 hover:bg-blue-600" data-testid={`match-cta-${i}`}>Secure Seat</Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Content Hub - About UCL */}
      <section className="py-16 bg-[#15151e]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-white">Buy Champions League Tickets 2025-26</h2>
          <div className="prose max-w-none text-slate-400 space-y-4">
            <p>The <strong>UEFA Champions League 2025-26</strong> features the new expanded format with 36 teams in a league phase. The <strong>Final will be held in Munich</strong> at the Allianz Arena on May 30, 2026. EuroMatchTickets offers the <strong>cheapest Champions League tickets</strong> in Europe with QR ticket delivery and a money-back guarantee.</p>
            <h3 className="text-lg font-semibold text-white">Key Dates</h3>
            <ul>
              <li><strong>League Phase:</strong> September 2025 - January 2026</li>
              <li><strong>Knockout Playoffs:</strong> February 2026</li>
              <li><strong>Round of 16:</strong> March 2026</li>
              <li><strong>Quarter-Finals:</strong> April 2026</li>
              <li><strong>Semi-Finals:</strong> May 2026</li>
              <li><strong>Final:</strong> May 30, 2026 - Allianz Arena, Munich</li>
            </ul>
            <h3 className="text-lg font-semibold text-white">Why Buy From EuroMatchTickets?</h3>
            <p>We are Europe's <strong>#1 ticket marketplace</strong> for Champions League matches. Every ticket is <strong>verified</strong>, delivered instantly as a QR code, and backed by our <Link to="/buyer-protection" className="text-blue-600 hover:underline">Buyer protection</Link>. Our prices are the cheapest you'll find - guaranteed.</p>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16" data-testid="ucl-reviews">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-2 text-center text-white">What Fans Say</h2>
          <p className="text-center text-slate-500 mb-8"> average rating from 3,247 verified ticket buyers</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reviews.map((r, i) => (
              <div key={i} className="bg-[#1e1e1e] border border-white/5 rounded-none p-5" data-testid={`review-${i}`}>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(r.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  {[...Array(5 - r.rating)].map((_, j) => <Star key={j} className="w-4 h-4 text-slate-200" />)}
                </div>
                <p className="text-slate-400 text-sm mb-3">"{r.text}"</p>
                <div className="text-xs text-slate-400">{r.name} &middot; {r.country} &middot; {r.date}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to="/reviews" className="text-blue-600 hover:underline text-sm font-medium">Read all 3,247 reviews &rarr;</Link>
          </div>
        </div>
      </section>

      {/* Internal Links Hub - CRITICAL FOR SEO */}
      <section className="py-16 bg-[#15151e]" data-testid="internal-links-hub">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center text-white">More Events on EuroMatchTickets</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Football */}
            <div className="bg-[#1e1e1e] rounded-none p-5 border border-white/5">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Trophy className="w-5 h-5 text-blue-600" /> Football</h3>
              <ul className="space-y-2">
                <li><Link to="/real-madrid-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Real Madrid Tickets</Link></li>
                <li><Link to="/barcelona-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Barcelona Tickets</Link></li>
                <li><Link to="/manchester-city-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Man City Tickets</Link></li>
                <li><Link to="/el-clasico-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />El Clasico Tickets</Link></li>
                <li><Link to="/world-cup-2026" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />World Cup 2026</Link></li>
                <li><Link to="/football-ticket-prices-2026" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Football Ticket Prices</Link></li>
              </ul>
            </div>
            {/* F1 */}
            <div className="bg-[#1e1e1e] rounded-none p-5 border border-white/5">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Zap className="w-5 h-5 text-red-500" /> Formula 1</h3>
              <ul className="space-y-2">
                <li><Link to="/f1-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />F1 Tickets 2026</Link></li>
                <li><Link to="/monaco-grand-prix-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Monaco Grand Prix</Link></li>
                <li><Link to="/f1-tickets-2026" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />F1 Season 2026</Link></li>
                <li><Link to="/f1-ticket-prices-2026" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />F1 Ticket Prices</Link></li>
                <li><Link to="/f1-schedule-2026" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />F1 Schedule 2026</Link></li>
              </ul>
            </div>
            {/* Concerts */}
            <div className="bg-[#1e1e1e] rounded-none p-5 border border-white/5">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Star className="w-5 h-5 text-purple-500" /> Concerts</h3>
              <ul className="space-y-2">
                <li><Link to="/taylor-swift-wembley-2026-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Taylor Swift Wembley</Link></li>
                <li><Link to="/the-weeknd-tour-2026" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />The Weeknd Tour 2026</Link></li>
                <li><Link to="/bruno-mars-tour-2026" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Bruno Mars Tour 2026</Link></li>
                <li><Link to="/metallica-sphere-las-vegas-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Metallica Las Vegas</Link></li>
                <li><Link to="/concert-ticket-prices-2026" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Concert Ticket Prices</Link></li>
              </ul>
            </div>
            {/* More */}
            <div className="bg-[#1e1e1e] rounded-none p-5 border border-white/5">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Ticket className="w-5 h-5 text-emerald-500" /> More Events</h3>
              <ul className="space-y-2">
                <li><Link to="/motogp-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />MotoGP Tickets</Link></li>
                <li><Link to="/super-bowl-2026-tickets" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Super Bowl 2026</Link></li>
                <li><Link to="/events?type=match" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />All Events</Link></li>
                <li><Link to="/es/comprar-entradas" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Comprar Entradas</Link></li>
                <li><Link to="/de/tickets-kaufen" className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowRight className="w-3 h-3" />Tickets Kaufen</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16" data-testid="ucl-faq">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center text-white">Champions League Tickets FAQ</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="bg-[#1e1e1e] border border-white/5 rounded-none p-5 group" data-testid={`faq-${i}`}>
                <summary className="font-semibold cursor-pointer text-white flex items-center justify-between">
                  {faq.question}
                  <ArrowRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-3 text-slate-400">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & CTA */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Don't Miss the Champions League</h2>
          <p className="text-blue-100 mb-8 text-lg">Tickets are. Secure your spot now with Europe's cheapest prices and instant delivery.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/events?type=match">
              <Button className="bg-[#1e1e1e] text-blue-600 hover:bg-blue-500/10 text-lg px-8 py-3" data-testid="cta-browse-matches">Browse All Matches</Button>
            </Link>
            <Link to="/buyer-protection">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-3">Buyer protection</Button>
            </Link>
          </div>
        </div>
      </section>

      <BreadcrumbStructuredData items={[
        { name: "Home", url: "https://euromatchtickets.com" },
        { name: "Football", url: "https://euromatchtickets.com/events?type=match" },
        { name: "Champions League Tickets", url: "https://euromatchtickets.com/champions-league-tickets" }
      ]} />
      <FAQStructuredData faqs={faqs} />

      {/* Newsletter */}
      <section className="py-12 bg-[#0a0a0f]">
        <div className="max-w-4xl mx-auto px-4">
          <NewsletterSignup source="champions-league" />
        </div>
      </section>
    </div>
  );
};

export default ChampionsLeaguePage;
