import { Link } from "react-router-dom";
import { MapPin, Train, Car, Plane, Clock, ChevronRight, Check, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import SEOHead from "../components/SEOHead";
import { BreadcrumbStructuredData, FAQStructuredData } from "../components/StructuredData";

const HowToGetToMonzaPage = () => {
  const routes = [
    { icon: Train, title: "From Milan by Train + Shuttle", time: "45 min", cost: "€5-8", steps: ["Take Metro Line 1 (Red) to Sesto FS Rondò", "Free shuttle bus from Sesto to the circuit (every 10 min)", "Walk from Monza train station (20 min) if you prefer"], recommended: true },
    { icon: Train, title: "From Milan Centrale by Train", time: "25 min", cost: "€3.50", steps: ["Take Trenord train from Milano Centrale to Monza station", "Walk to circuit through Parco di Monza (20 min)", "Trains run every 15-20 minutes on race weekend"] },
    { icon: Car, title: "By Car", time: "30-60 min", cost: "€5 parking", steps: ["Take the A4 motorway towards Monza (exit Monza)", "Circuit parking available (€5/day, cash)", "Expect heavy traffic - arrive before 8am on race day"], warning: "Heavy traffic on race day. Allow 2x normal travel time." },
    { icon: Plane, title: "Flying to Milan", time: "Varies", cost: "From €30", steps: ["Milan Malpensa (MXP) - 60km from Monza. Malpensa Express to Centrale, then train to Monza", "Milan Linate (LIN) - 25km from Monza. Bus 73 to Metro, then train", "Bergamo Orio al Serio (BGY) - Budget airlines. Airport bus to Milano Centrale"] },
  ];

  const faqs = [
    { question: "How do I get to Monza from Milan?", answer: "The easiest way is Metro Line 1 (Red) to Sesto FS, then the free race shuttle (runs every 10 min). Total journey ~45 min from central Milan. Alternatively, take a Trenord train from Milano Centrale to Monza station (25 min, €3.50) and walk 20 min through the park." },
    { question: "Is there parking at Monza F1?", answer: "Yes, parking is available around the circuit for €5/day (cash only). However, we strongly recommend public transport. Traffic is extremely heavy on race day - you could be stuck for 2+ hours." },
    { question: "How early should I arrive at Monza?", answer: "Gates open at 08:00. On race day (Sunday), arrive by 09:00 for a good spot in General Admission, or by 10:00 for grandstand seats. The support races start at 10:30." },
    { question: "Can I walk to Monza circuit from the city?", answer: "From Monza train station, it's a pleasant 20-minute walk through the beautiful Parco di Monza. Follow the crowds! From Milan city center, it's too far to walk (15km)." },
  ];

  return (
    <div className="min-h-screen bg-[#0e0e14]" data-testid="monza-travel-page">
      <SEOHead title="How to Get to Monza F1 2026 - Travel Guide" description="Complete guide: how to get to Monza Italian Grand Prix from Milan. Train, metro, car, flight options. Free shuttle buses. Expert tips for race day travel." canonicalUrl="https://euromatchtickets.com/how-to-get-to-monza" />
      <BreadcrumbStructuredData items={[{ name: "Home", url: "https://euromatchtickets.com" }, { name: "F1 Tickets", url: "https://euromatchtickets.com/f1-tickets" }, { name: "Monza GP", url: "https://euromatchtickets.com/f1-italian-grand-prix-monza-tickets" }, { name: "How to Get There", url: "https://euromatchtickets.com/how-to-get-to-monza" }]} />

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm text-slate-500 mb-2">Updated March 2026 &bull; 6 min read</p>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4">How to Get to Monza F1 Grand Prix 2026</h1>
          <p className="text-lg text-slate-400 mb-10">Everything you need to know about travelling to the Autodromo Nazionale di Monza - from Milan airports, city center, and beyond.</p>

          {/* Transport Options */}
          <div className="space-y-6">
            {routes.map((r, i) => (
              <div key={i} className={`bg-[#1e1e1e] rounded-none border p-6 ${r.recommended ? 'border-emerald-300 ring-2 ring-emerald-50' : 'border-white/10'}`} data-testid={`route-${i}`}>
                {r.recommended && <span className="inline-block text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full mb-3">RECOMMENDED</span>}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-none flex items-center justify-center flex-shrink-0"><r.icon className="w-5 h-5 text-slate-400" /></div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white">{r.title}</h2>
                    <div className="flex gap-4 mt-1 mb-3">
                      <span className="text-sm text-slate-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{r.time}</span>
                      <span className="text-sm text-emerald-600 font-medium">{r.cost}</span>
                    </div>
                    <ol className="space-y-1">
                      {r.steps.map((s, j) => <li key={j} className="text-sm text-slate-400 flex items-start gap-2"><span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-slate-500">{j + 1}</span>{s}</li>)}
                    </ol>
                    {r.warning && <p className="mt-3 text-xs text-amber-700 bg-amber-500/10 p-2 rounded-none">{r.warning}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pro Tips */}
          <div className="mt-10 bg-slate-900 rounded-none p-6 text-white">
            <h2 className="text-xl font-bold mb-4">Pro Tips for Race Day</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {["Arrive by 09:00 on Sunday for the best experience", "Bring a portable charger - your phone is your ticket", "Wear comfortable shoes - lots of walking in the park", "Pack sunscreen + a light rain jacket (September weather)", "Buy food from Italian vendors inside - amazing quality!", "Download the F1 app for live timing on your phone"].map((t, i) => (
                <p key={i} className="text-sm text-slate-300 flex items-start gap-2"><Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />{t}</p>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 bg-red-600 rounded-none p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-2">Got Your Travel Sorted?</h2>
            <p className="text-red-100 mb-4">Now grab your Monza tickets from &euro;69!</p>
            <Link to="/f1-italian-grand-prix-monza-tickets"><Button size="lg" className="bg-[#1e1e1e] text-red-600 hover:bg-[#e10600]/10 font-bold px-8 rounded-full">Buy Monza GP Tickets</Button></Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-[#15151e]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-6">FAQ - Getting to Monza</h2>
          <FAQStructuredData faqs={faqs} />
          <div className="space-y-3">{faqs.map((f, i) => (
            <details key={i} className="group bg-[#1e1e1e] rounded-none border border-white/10">
              <summary className="p-5 font-bold text-white cursor-pointer list-none flex items-center justify-between">{f.question}<ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" /></summary>
              <p className="px-5 pb-5 text-slate-400 text-sm leading-relaxed">{f.answer}</p>
            </details>
          ))}</div>
        </div>
      </section>

      {/* Content Cluster */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-lg font-bold text-white mb-4">Complete Monza F1 Guide</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/f1-italian-grand-prix-monza-tickets" className="bg-[#1e1e1e] border border-white/10 rounded-none p-4 hover:border-red-300 transition-all"><p className="font-bold text-white text-sm">Buy Monza Tickets</p><p className="text-xs text-emerald-600">From €69</p></Link>
            <Link to="/monza-best-seats-guide" className="bg-[#1e1e1e] border border-white/10 rounded-none p-4 hover:border-red-300 transition-all"><p className="font-bold text-white text-sm">Best Seats Guide</p><p className="text-xs text-slate-500">Every grandstand rated</p></Link>
            <Link to="/monza-ticket-prices" className="bg-[#1e1e1e] border border-white/10 rounded-none p-4 hover:border-red-300 transition-all"><p className="font-bold text-white text-sm">Ticket Prices Compared</p><p className="text-xs text-slate-500">Save up to 40%</p></Link>
            <Link to="/monza-f1-travel-tips" className="bg-[#1e1e1e] border border-white/10 rounded-none p-4 hover:border-red-300 transition-all"><p className="font-bold text-white text-sm">Monza Tips & Travel Guide</p><p className="text-xs text-slate-500">Expert insider tips</p></Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowToGetToMonzaPage;
