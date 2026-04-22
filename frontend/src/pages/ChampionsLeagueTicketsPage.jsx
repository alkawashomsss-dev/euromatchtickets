import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, Shield, Zap, Trophy, Ticket, Star } from "lucide-react";
import { Button } from "../components/ui/button";
import SEOHead from "../components/SEOHead";
import ProductSchema from "../components/ProductSchema";
import BreadcrumbSchema from "../components/BreadcrumbSchema";
import { RelatedEventsLinks } from "../components/RelatedEventsLinks";
import { EventFAQ, FAQSchemaScript } from "../components/EventFAQ";

const UCL_FAQS = [
  { q: "How much are Champions League tickets?", a: "Champions League group stage from €85. Quarter-finals from €149. Semi-finals from €249. UCL Final 2026 in Munich from €495. VIP hospitality from €1,200. All include Buyer protection cancellation refund policy." },
  { q: "Where is the Champions League Final 2026?", a: "The 2025/26 UEFA Champions League Final takes place at the Allianz Arena in Munich, Germany on Saturday May 30, 2026. Kick-off at 21:00 CET." },
  { q: "How to buy Champions League tickets?", a: "Select your match on EuroMatchTickets, choose your category, and pay securely via Stripe. Tickets are delivered instantly as QR codes to your email. All tickets are verified with Buyer protection money-back guarantee." },
  { q: "Are Champions League tickets refundable?", a: "Yes! Buyer protection cancellation refund policy. Full refund if the match is cancelled or postponed. If tickets are invalid at the gate, you receive refund policy." },
  { q: "Can I buy Champions League Final tickets?", a: "Yes! UCL Final 2026 Munich tickets are available from €495. Category 1, 2, 3, and VIP hospitality. Limited availability — the Final always sells out months in advance." }
];

const ChampionsLeagueTicketsPage = () => {
  const navigate = useNavigate();
  const [viewersNow, setViewersNow] = useState(156);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewersNow(prev => Math.max(100, prev + Math.floor(Math.random() * 7) - 3));
    }, 4000);

    if (window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_name: 'UEFA Champions League Tickets',
        content_category: 'Football',
        content_type: 'ticket'
      });
    }

    return () => clearInterval(interval);
  }, []);

  const matches = [
    { 
      teams: "Real Madrid vs Man City", 
      stage: "Quarter Final",
      date: "April 2026", 
      venue: "Santiago Bernabeu",
      price: 350,
      seatsLeft: 18,
      hot: true
    },
    { 
      teams: "Bayern Munich vs PSG", 
      stage: "Quarter Final",
      date: "April 2026", 
      venue: "Allianz Arena",
      price: 280,
      seatsLeft: 24,
      hot: true
    },
    { 
      teams: "Liverpool vs Barcelona", 
      stage: "Semi Final",
      date: "May 2026", 
      venue: "Anfield",
      price: 420,
      seatsLeft: 12,
      hot: true
    },
    { 
      teams: "Champions League Final", 
      stage: "FINAL",
      date: "May 31, 2026", 
      venue: "Munich",
      price: 890,
      seatsLeft: 8,
      hot: true
    }
  ];

  return (
    <>
      <FAQSchemaScript faqs={UCL_FAQS} />
      <SEOHead
        title="Buy Champions League Tickets 2026 | UCL Final From €85 | Munich"
        description="Buy UEFA Champions League 2026 tickets from €85. Semi-finals & Final in Munich. 90% Sold — limited seats remaining. Cancellation refund policy. Instant QR delivery."
        keywords="champions league tickets, ucl 2025 tickets, ticket champions league 2025, champions league semi final 2025 tickets, buy ticket final champions league 2025, champions league munich tickets"
        canonicalUrl="https://euromatchtickets.com/champions-league-tickets"
        image="https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&h=630&fit=crop"
      />

      <ProductSchema name="Champions League Tickets 2026" price={99} highPrice={4999} url="https://euromatchtickets.com/champions-league-tickets" category="football" venue="Various Stadiums" city="Europe" />
      <BreadcrumbSchema items={[{ name: "Home", url: "https://euromatchtickets.com/" }, { name: "Football", url: "https://euromatchtickets.com/events?type=match" }, { name: "Champions League Tickets", url: "https://euromatchtickets.com/champions-league-tickets" }]} />

      <div className="min-h-screen bg-[#0e0e14]">
        {/* Hero Section */}
        <div className="relative h-[60vh] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-slate-950/40" />
          
          <div className="relative z-10 h-full flex flex-col justify-end pb-12 px-4 md:px-8 max-w-[1440px] mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2 bg-[#e10600]/10 border border-red-500/50 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 bg-[#e10600]/100 rounded-full animate-pulse" />
                <span className="text-red-600 text-sm font-medium">{viewersNow} people viewing</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-4xl">⭐</span>
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">UEFA</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
              Champions League 2025/26
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 mb-6 max-w-2xl">
              The pinnacle of European club football. Quarter Finals to Final.
            </p>
          </div>
        </div>

        {/* Urgency Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-4">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="flex items-center justify-center gap-4 text-white">
              <Star className="w-6 h-6" />
              <span className="text-lg md:text-xl font-bold">
                ⚽ UCL knockout stage tickets are EXTREMELY LIMITED!
              </span>
              <Star className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Matches Section */}
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-600" />
            Upcoming UCL Matches
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {matches.map((match, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-none bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border border-blue-500/20 hover:border-blue-500/50 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    match.stage === 'FINAL' 
                      ? 'bg-amber-500/100 text-black' 
                      : 'bg-blue-500/100 text-white'
                  }`}>
                    {match.stage}
                  </span>
                  <span className="flex items-center gap-1 text-amber-600 text-sm">
                    <Zap className="w-4 h-4" />
                    {match.seatsLeft} tickets left
                  </span>
                </div>

                <h3 className="text-2xl font-bold mb-2">{match.teams}</h3>
                
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {match.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {match.venue}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 text-sm">From</span>
                    <div className="text-3xl font-bold text-white">€{match.price}</div>
                  </div>
                  <Button 
                    onClick={() => navigate('/checkout?event=champions-league-2026')}
                    className="bg-blue-600 hover:bg-blue-700 px-6"
                  >
                    Get Tickets
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Teams Section */}
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12 border-t border-white/5">
          <h2 className="text-2xl font-bold mb-8">Popular Teams - UCL 2025/26</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Real Madrid', 'Barcelona', 'Man City', 'Bayern Munich', 'Liverpool', 'PSG', 'Inter Milan', 'Arsenal', 'Dortmund', 'Juventus', 'Chelsea', 'AC Milan'].map((team, idx) => (
              <button
                key={idx}
                onClick={() => navigate('/checkout?event=champions-league-2026')}
                className="p-4 bg-[#1e1e1e] border border-white/5 rounded-none hover:border-blue-500/50 transition-all text-center"
              >
                <span className="font-semibold">{team}</span>
              </button>
            ))}
          </div>
        </div>

        {/* SEO Content */}
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12 border-t border-white/5">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-3xl font-bold mb-6">Buy UEFA Champions League Tickets</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-6">
              The UEFA Champions League is the most prestigious club competition in world football. 
              Watch Europe's elite clubs battle for glory - from the knockout stages to the Final.
            </p>
            <h3 className="text-2xl font-bold mb-4">UCL 2025/26 Key Dates</h3>
            <ul className="text-slate-400 space-y-2 mb-6">
              <li>⚽ Quarter Finals: April 2026</li>
              <li>⚽ Semi Finals: April-May 2026</li>
              <li>⚽ Final: May 31, 2026 - Munich, Germany</li>
            </ul>
          </div>
        </div>
      </div>
      <EventFAQ faqs={UCL_FAQS} title="Champions League Tickets — FAQ" />
      <RelatedEventsLinks category="champions-league" title="More Events You'll Love" />
    </>
  );
};

export default ChampionsLeagueTicketsPage;
