import { Link } from "react-router-dom";
import { Calendar, MapPin, Trophy, Star, Shield, Users, TrendingUp, Zap } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";

const ChampionsLeaguePage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": "UEFA Champions League 2025-26",
    "description": "Buy UEFA Champions League 2025-26 tickets. Group stage, knockout rounds, and final. Real Madrid, Man City, Bayern Munich, Barcelona.",
    "startDate": "2025-09-16",
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "85" }
  };

  const matches = [
    { home: "Real Madrid", away: "Manchester City", venue: "Santiago Bernabeu", city: "Madrid", date: "Feb 2026", price: 185, tickets: 34, hot: true },
    { home: "Bayern Munich", away: "Barcelona", venue: "Allianz Arena", city: "Munich", date: "Feb 2026", price: 165, tickets: 45, hot: true },
    { home: "PSG", away: "Liverpool", venue: "Parc des Princes", city: "Paris", date: "Mar 2026", price: 155, tickets: 52 },
    { home: "Inter Milan", away: "Arsenal", venue: "San Siro", city: "Milan", date: "Mar 2026", price: 125, tickets: 67 },
    { home: "Atletico Madrid", away: "Juventus", venue: "Metropolitano", city: "Madrid", date: "Apr 2026", price: 115, tickets: 78 },
    { home: "UCL Final 2026", away: "TBD vs TBD", venue: "Allianz Arena", city: "Munich", date: "May 30, 2026", price: 450, tickets: 23, hot: true },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <SEOHead 
        title="Champions League Tickets 2025-26 - Buy UCL Final, Semi Finals"
        description="Buy UEFA Champions League 2025-26 tickets from €85. Real Madrid, Man City, Bayern, Barcelona matches. UCL Final 2026 Munich. 100% verified tickets."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-zinc-900 to-zinc-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-2 mb-6 animate-pulse">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 font-medium">Knockout Stage Tickets Available!</span>
          </div>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mb-6">
            <Trophy className="w-4 h-4 mr-2" />UEFA Champions League
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Champions League 2025-26
            <span className="block text-2xl md:text-3xl mt-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">The Greatest Club Competition</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">Watch European football's elite battle for glory. Real Madrid, Manchester City, Bayern Munich, Barcelona - the best of the best.</p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full"><Calendar className="w-5 h-5 text-blue-400" /><span>Sep 2025 - May 2026</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full"><MapPin className="w-5 h-5 text-blue-400" /><span>Final: Munich</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full"><Users className="w-5 h-5 text-blue-400" /><span>36 Teams</span></div>
          </div>
          <div className="inline-block bg-zinc-900/80 border border-white/10 rounded-2xl p-6">
            <div className="text-zinc-400 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-white">€85</div>
            <div className="text-emerald-400 text-sm mt-1">100% Verified</div>
          </div>
        </div>
      </section>

      <section className="py-6 border-y border-white/5 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-emerald-400"><Shield className="w-5 h-5" /><span>100% Verified</span></div>
            <div className="flex items-center gap-2 text-emerald-400"><Star className="w-5 h-5" /><span>Money-Back Guarantee</span></div>
            <div className="flex items-center gap-2 text-emerald-400"><TrendingUp className="w-5 h-5" /><span>15,000+ Sold</span></div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Top Champions League Matches 2026</h2>
          <div className="grid gap-4">
            {matches.map((match, i) => (
              <Link key={i} to="/events?type=match" className="group flex flex-col md:flex-row md:items-center justify-between bg-zinc-900/50 border border-white/5 hover:border-blue-500/30 rounded-2xl p-6 transition-all">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center"><Trophy className="w-7 h-7 text-blue-400" /></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold group-hover:text-blue-400">{match.home} vs {match.away}</h3>
                      {match.hot && <Badge className="bg-cyan-500/20 text-cyan-400 text-xs animate-pulse">HOT</Badge>}
                    </div>
                    <p className="text-zinc-500 text-sm">{match.date} - {match.venue}, {match.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-cyan-400 text-sm">{match.tickets} left</span>
                  <div className="text-right"><div className="text-xs text-zinc-500">From</div><div className="text-xl font-bold text-blue-400">€{match.price}</div></div>
                  <Button className="bg-blue-500 hover:bg-blue-600">Buy</Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Buy Champions League Tickets 2025-26</h2>
          <div className="prose prose-invert max-w-none text-zinc-400">
            <p>The <strong>UEFA Champions League 2025-26</strong> features the new expanded format with 36 teams in a league phase. The <strong>Final will be held in Munich</strong> at the Allianz Arena on May 30, 2026.</p>
            <h3 className="text-white">Key Dates</h3>
            <ul>
              <li><strong>League Phase:</strong> September 2025 - January 2026</li>
              <li><strong>Knockout Playoffs:</strong> February 2026</li>
              <li><strong>Round of 16:</strong> March 2026</li>
              <li><strong>Quarter-Finals:</strong> April 2026</li>
              <li><strong>Semi-Finals:</strong> May 2026</li>
              <li><strong>Final:</strong> May 30, 2026 - Allianz Arena, Munich</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChampionsLeaguePage;
