import { Link } from "react-router-dom";
import { Calendar, MapPin, Ticket, Music, Star, Shield, Users, TrendingUp, Zap } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";

const TheWeekndPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    "name": "The Weeknd After Hours Til Dawn Tour 2026",
    "description": "Buy The Weeknd 2026 tour tickets. After Hours Til Dawn European stadium tour. Blinding Lights, Save Your Tears live.",
    "startDate": "2026-06-11",
    "endDate": "2026-07-08",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": "https://euromatchtickets.com/logo-192.png",
    "location": {
      "@type": "Place",
      "name": "Stade de France",
      "address": { "@type": "PostalAddress", "addressLocality": "Paris", "addressCountry": "FR" }
    },
    "performer": { "@type": "MusicGroup", "name": "The Weeknd" },
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR",
              "offerCount": "100", "lowPrice": "95", "highPrice": "450", "availability": "https://schema.org/InStock", "url": "https://euromatchtickets.com/the-weeknd-tour-2026", "validFrom": "2025-01-01" }
  };

  const shows = [
    { date: "Jun 11, 2026", venue: "Stade de France", city: "Paris", price: 125, tickets: 89 },
    { date: "Jun 15, 2026", venue: "Wembley Stadium", city: "London", price: 145, tickets: 56, hot: true },
    { date: "Jun 20, 2026", venue: "Olympiastadion", city: "Berlin", price: 115, tickets: 72 },
    { date: "Jun 25, 2026", venue: "Johan Cruijff Arena", city: "Amsterdam", price: 135, tickets: 41, hot: true },
    { date: "Jul 2, 2026", venue: "San Siro", city: "Milan", price: 110, tickets: 95 },
    { date: "Jul 8, 2026", venue: "Estadio Metropolitano", city: "Madrid", price: 105, tickets: 83 },
  ];

  return (
    <div className="min-h-screen bg-[#0e0e14]">
      <SEOHead 
        title="The Weeknd Tour 2026 Tickets | Concert & European Tour"
        description="Buy The Weeknd tour 2026 tickets from €95. Concert The Weeknd 2026 European dates. Paris, London, Berlin. Instant QR delivery + FanProtect guarantee."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-slate-900 to-slate-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-[#e10600]/10 border border-red-200 rounded-full px-4 py-2 mb-6 animate-pulse">
            <Zap className="w-4 h-4 text-red-600" />
            <span className="text-red-600 font-medium">2026 Tour Announced - Get Tickets Early!</span>
          </div>
          <Badge className="bg-[#e10600]/10 text-red-600 border-red-200 mb-6">
            <Music className="w-4 h-4 mr-2" />Stadium World Tour
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            The Weeknd
            <span className="block text-2xl md:text-3xl mt-2 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">After Hours Til Dawn Tour 2026</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto mb-8">Experience the most spectacular concert production ever! Blinding Lights, Save Your Tears, Starboy - all your favorites LIVE in stadiums across Europe.</p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full"><Calendar className="w-5 h-5 text-red-600" /><span>June - September 2026</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full"><MapPin className="w-5 h-5 text-red-600" /><span>12 European Cities</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full"><Users className="w-5 h-5 text-red-600" /><span>Stadium Shows</span></div>
          </div>
          <div className="inline-block bg-white/90 border border-white/10 rounded-none p-6">
            <div className="text-slate-500 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-white">€95</div>
            <div className="text-emerald-600 text-sm mt-1">100% Verified</div>
          </div>
        </div>
      </section>

      <section className="py-6 border-y border-white/5 bg-[#15151e]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-emerald-600"><Shield className="w-5 h-5" /><span>100% Verified</span></div>
            <div className="flex items-center gap-2 text-emerald-600"><Star className="w-5 h-5" /><span>Money-Back Guarantee</span></div>
            <div className="flex items-center gap-2 text-emerald-600"><TrendingUp className="w-5 h-5" /><span>6,200+ Sold</span></div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">The Weeknd 2026 European Tour Dates</h2>
          <div className="grid gap-4">
            {shows.map((show, i) => (
              <Link key={i} to="/events?type=concert" className="group flex flex-col md:flex-row md:items-center justify-between bg-[#1e1e1e] border border-white/5 hover:border-red-200 rounded-none p-6 transition-all">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-14 h-14 bg-[#e10600]/10 rounded-none flex items-center justify-center"><Music className="w-7 h-7 text-red-600" /></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold group-hover:text-red-600">{show.venue}</h3>
                      {show.hot && <Badge className="bg-orange-500/10 text-orange-600 text-xs animate-pulse">SELLING FAST</Badge>}
                    </div>
                    <p className="text-slate-400 text-sm">{show.date} - {show.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-orange-600 text-sm">{show.tickets} left</span>
                  <div className="text-right"><div className="text-xs text-slate-400">From</div><div className="text-xl font-bold text-red-600">€{show.price}</div></div>
                  <Button className="bg-[#e10600]/100 hover:bg-red-600">Buy</Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#15151e]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">The Weeknd After Hours Til Dawn Tour 2026</h2>
          <div className="prose prose-invert max-w-none text-slate-500">
            <p><strong>The Weeknd</strong> brings his record-breaking <strong>After Hours Til Dawn Tour</strong> to Europe in 2026. Experience the most visually stunning concert production ever created.</p>
            <h3 className="text-white">Expected Setlist</h3>
            <p>Blinding Lights, Save Your Tears, Starboy, The Hills, Cant Feel My Face, Die For You, I Feel It Coming, Earned It, and new hits from upcoming album.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TheWeekndPage;
