import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API } from "../App";
import { Calendar, MapPin, Ticket, Music, Star, Shield, Users, TrendingUp, Zap, Heart } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";

const OasisReunionPage = () => {
  const oasisSchema = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    "name": "Oasis Reunion Tour 2025",
    "description": "Buy Oasis Reunion Tour 2025 tickets. Gallagher brothers reunite after 15 years.",
    "startDate": "2025-07-04",
    "performer": { "@type": "MusicGroup", "name": "Oasis" },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "180" }
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <SEOHead 
        title="Oasis Reunion Tour 2025 Tickets - Buy Wembley, Dublin, Edinburgh"
        description="Buy Oasis Reunion Tour 2025 tickets from €180. Gallagher brothers reunite after 15 years! Wembley, Croke Park, Murrayfield. 100% verified tickets."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(oasisSchema) }} />

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-zinc-900 to-zinc-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-2 mb-6 animate-pulse">
            <Zap className="w-4 h-4 text-red-400" />
            <span className="text-red-400 font-medium">SOLD OUT - Limited Resale Tickets!</span>
          </div>
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 mb-6">
            <Heart className="w-4 h-4 mr-2" />Historic Reunion After 15 Years
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Oasis Reunion Tour 2025
            <span className="block text-2xl md:text-3xl mt-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Dont Look Back in Anger</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">The moment fans waited 15 years for! Liam and Noel Gallagher reunite for the biggest rock reunion of the century.</p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full"><Calendar className="w-5 h-5 text-cyan-400" /><span>July - August 2025</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full"><MapPin className="w-5 h-5 text-cyan-400" /><span>UK, Ireland, Europe</span></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full"><Users className="w-5 h-5 text-cyan-400" /><span>17 Stadium Shows</span></div>
          </div>
          <div className="inline-block bg-zinc-900/80 border border-white/10 rounded-2xl p-6 mb-8">
            <div className="text-zinc-400 text-sm">Resale Tickets from</div>
            <div className="text-5xl font-bold text-white">€180</div>
            <div className="text-emerald-400 text-sm mt-1">100% Verified</div>
          </div>
        </div>
      </section>

      <section className="py-6 border-y border-white/5 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-emerald-400"><Shield className="w-5 h-5" /><span>100% Verified</span></div>
            <div className="flex items-center gap-2 text-emerald-400"><Star className="w-5 h-5" /><span>Money-Back Guarantee</span></div>
            <div className="flex items-center gap-2 text-emerald-400"><TrendingUp className="w-5 h-5" /><span>8,500+ Sold</span></div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Oasis 2025 Tour Dates</h2>
          <div className="grid gap-4">
            {[
              { date: "Jul 4-5, 11-12, 19-20", venue: "Principality Stadium", city: "Cardiff", tickets: 45, price: 195 },
              { date: "Jul 25-26, Aug 2-3", venue: "Wembley Stadium", city: "London", tickets: 23, price: 285, hot: true },
              { date: "Aug 8-9, 12", venue: "Murrayfield Stadium", city: "Edinburgh", tickets: 34, price: 220 },
              { date: "Aug 16-17", venue: "Croke Park", city: "Dublin", tickets: 18, price: 245, hot: true },
            ].map((show, i) => (
              <Link key={i} to="/events?type=concert" className="group flex flex-col md:flex-row md:items-center justify-between bg-zinc-900/50 border border-white/5 hover:border-cyan-500/30 rounded-2xl p-6 transition-all">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-14 h-14 bg-cyan-500/20 rounded-xl flex items-center justify-center"><Music className="w-7 h-7 text-cyan-400" /></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold group-hover:text-cyan-400">{show.venue}</h3>
                      {show.hot && <Badge className="bg-red-500/20 text-red-400 text-xs animate-pulse">HOT</Badge>}
                    </div>
                    <p className="text-zinc-500 text-sm">{show.date} - {show.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-orange-400 text-sm">{show.tickets} left</span>
                  <div className="text-right"><div className="text-xs text-zinc-500">From</div><div className="text-xl font-bold text-cyan-400">€{show.price}</div></div>
                  <Button className="bg-cyan-500 hover:bg-cyan-600">Buy</Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Buy Oasis Reunion Tour 2025 Tickets</h2>
          <div className="prose prose-invert max-w-none text-zinc-400">
            <p>After <strong>15 years apart</strong>, <strong>Oasis</strong> announced their historic reunion. Brothers <strong>Liam and Noel Gallagher</strong> perform together for the first time since 2009.</p>
            <h3 className="text-white">Expected Setlist</h3>
            <p>Wonderwall, Dont Look Back in Anger, Live Forever, Champagne Supernova, Supersonic, Rock n Roll Star.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OasisReunionPage;
