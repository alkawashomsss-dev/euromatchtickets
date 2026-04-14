import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API } from "../App";
import { Crown, Wine, Anchor, Gem, Star, ChevronRight, Check, Shield } from "lucide-react";
import { Button } from "../components/ui/button";
import SEOHead from "../components/SEOHead";
import { BreadcrumbStructuredData, FAQStructuredData } from "../components/StructuredData";

const MonacoExperiencePage = () => {
  const [eventLink, setEventLink] = useState('/checkout?event=monaco-grand-prix');

  useEffect(() => {
    axios.get(`${API}/events?search=Monaco+Grand+Prix&limit=1`).then(r => {
      if (r.data.length > 0) setEventLink(`/event/${r.data[0].slug || r.data[0].event_id}`);
    }).catch(() => {});
  }, []);
  const experiences = [
    { title: "Yacht Hospitality", price: "€2,995", desc: "Watch F1 cars race past from your private yacht in Port Hercule harbour. Unlimited champagne, gourmet catering, helicopter transfers available. The ultimate Monaco experience.", features: ["Private yacht with 360° views", "All-inclusive champagne & gourmet food", "Helicopter transfer option", "Celebrity sighting guaranteed"], tier: "ULTRA VIP" },
    { title: "Champions Club", price: "€1,295", desc: "5-star hospitality suite overlooking the circuit. Meet-and-greet with F1 personalities, Michelin-star dining, exclusive pit lane walks.", features: ["Track-side luxury terrace", "Michelin-star dining experience", "Pit lane walk before the race", "Exclusive F1 driver appearances"], tier: "VIP" },
    { title: "Casino Square Grandstand", price: "€389", desc: "The most iconic viewing spot in all of motorsport. Watch cars navigate the legendary Casino hairpin from above, with Monte Carlo Casino as your backdrop.", features: ["Iconic Casino hairpin view", "Monte Carlo Casino backdrop", "Best photo opportunity in F1", "Covered premium seating"], tier: "PREMIUM" },
    { title: "Tabac Grandstand", price: "€329", desc: "Harbour views + Swimming Pool chicane action. See cars at speed through the technical section with superyachts in the background.", features: ["Harbour and yacht views", "Swimming Pool section action", "Good overtaking zone", "Partially covered"], tier: "POPULAR" },
  ];

  const dayPlan = [
    { time: "08:00", activity: "Breakfast at Café de Paris overlooking Casino Square" },
    { time: "10:00", activity: "Gates open - explore the Monaco paddock area" },
    { time: "11:00", activity: "Watch support races from your grandstand/yacht" },
    { time: "13:00", activity: "Champagne lunch at your hospitality suite" },
    { time: "14:45", activity: "National anthems + grid ceremony - goosebumps!" },
    { time: "15:00", activity: "LIGHTS OUT - the Monaco Grand Prix begins!" },
    { time: "17:00", activity: "Podium ceremony + champagne celebration" },
    { time: "19:00", activity: "Dinner at a Michelin-star restaurant in Monte Carlo" },
    { time: "22:00", activity: "Casino Royale experience at Monte Carlo Casino" },
  ];

  const faqs = [
    { question: "What is Monaco GP yacht hospitality?", answer: "Yacht hospitality places you on a private superyacht in Port Hercule harbour, directly overlooking the Monaco GP circuit. You watch F1 cars race past metres away while enjoying unlimited champagne and gourmet food. Packages start from €2,995." },
    { question: "Is Monaco GP VIP worth it?", answer: "If you can afford it, absolutely! The Champions Club (€1,295) includes Michelin-star dining, pit lane walks, and an atmosphere you can't get anywhere else. It's a once-in-a-lifetime experience. Many guests book again every year." },
    { question: "What should I wear to Monaco GP?", answer: "Monaco is the most glamorous event on the F1 calendar. Smart casual is minimum for grandstands. For VIP/yacht hospitality, think designer resort wear - linen, cocktail attire, sunglasses. Leave the cargo shorts at home!" },
    { question: "Can I visit the Monaco Casino during GP weekend?", answer: "Yes! The Monte Carlo Casino is open during GP weekend. Dress code applies (jacket required for main rooms). Many fans visit Friday or Saturday evening, saving Sunday for the race and celebrations." },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1a]" data-testid="monaco-experience-page">
      <SEOHead title="Monaco GP VIP Experience 2026 - Yacht & Hospitality" description="Ultimate Monaco Grand Prix VIP guide 2026. Yacht hospitality from €2,995, Champions Club from €1,295. Casino Square grandstand. The most glamorous race in F1." canonicalUrl="https://euromatchtickets.com/monaco-gp-vip-experience" />
      <BreadcrumbStructuredData items={[{ name: "Home", url: "https://euromatchtickets.com" }, { name: "F1 Tickets", url: "https://euromatchtickets.com/f1-tickets" }, { name: "Monaco GP", url: "https://euromatchtickets.com/f1-monaco-grand-prix-tickets" }, { name: "VIP Experience", url: "https://euromatchtickets.com/monaco-gp-vip-experience" }]} />

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-400/30 bg-amber-400/5 text-amber-300 text-xs font-bold mb-6"><Crown className="w-4 h-4" /> LUXURY EXPERIENCE</div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">Monaco GP VIP Experience 2026</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">From yacht parties to Casino Square grandstands - everything you need for the most glamorous weekend in sport.</p>
          <p className="text-xs text-slate-500 mt-4">Updated March 2026 &bull; by EuroMatchTickets VIP team</p>
        </div>
      </section>

      {/* Packages */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="space-y-4">
          {experiences.map((e, i) => (
            <div key={i} className="bg-white/5 border border-amber-400/10 rounded-none p-6 hover:border-amber-400/30 transition-all" data-testid={`vip-package-${i}`}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-bold text-white">{e.title}</h2>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${e.tier === 'ULTRA VIP' ? 'bg-amber-400/30 text-amber-200' : e.tier === 'VIP' ? 'bg-purple-500/100/30 text-purple-300' : e.tier === 'PREMIUM' ? 'bg-[#e10600]/100/30 text-red-300' : 'bg-emerald-500/100/30 text-emerald-300'}`}>{e.tier}</span>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">{e.desc}</p>
                  <div className="flex flex-wrap gap-2">{e.features.map((f, j) => <span key={j} className="text-xs text-slate-400 flex items-center gap-1"><Check className="w-3 h-3 text-amber-400" />{f}</span>)}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-3xl font-black bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">{e.price}</p>
                  <Link to={`/checkout?event=f1-monaco-grand-prix-2026&category=${encodeURIComponent(e.title)}`}><Button className="mt-2 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold">Book Now</Button></Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Perfect Monaco GP Day */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Gem className="w-6 h-6 text-amber-400" /> Your Perfect Monaco GP Day</h2>
        <div className="space-y-0">
          {dayPlan.map((d, i) => (
            <div key={i} className="flex gap-4 items-start pb-4 last:pb-0">
              <div className="flex flex-col items-center"><div className="w-14 bg-amber-400/10 border border-amber-400/20 rounded-none px-2 py-1 text-center text-amber-300 text-xs font-bold flex-shrink-0">{d.time}</div>{i < dayPlan.length - 1 && <div className="w-0.5 h-full bg-amber-400/10 mt-2" />}</div>
              <p className="text-sm text-slate-300 pt-1">{d.activity}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-bold text-white mb-4">FAQ - Monaco GP VIP</h2>
        <FAQStructuredData faqs={faqs} />
        <div className="space-y-2">{faqs.map((f, i) => (
          <details key={i} className="group rounded-none border border-white/10 bg-white/5 hover:bg-white/10 transition">
            <summary className="p-4 font-bold text-sm text-white cursor-pointer list-none flex items-center justify-between">{f.question}<ChevronRight className="w-4 h-4 text-slate-500 group-open:rotate-90 transition-transform" /></summary>
            <p className="px-4 pb-4 text-slate-400 text-sm leading-relaxed">{f.answer}</p>
          </details>
        ))}</div>
      </section>

      {/* Cluster Links */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-lg font-bold text-white mb-4">More Monaco GP Pages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link to="/f1-monaco-grand-prix-tickets" className="bg-white/5 border border-white/10 rounded-none p-4 hover:border-amber-400/30 transition-all"><p className="font-bold text-white text-sm">Buy Monaco GP Tickets</p><p className="text-xs text-amber-400">From €195</p></Link>
          <Link to="/ultimate-f1-tickets-guide-2026" className="bg-white/5 border border-white/10 rounded-none p-4 hover:border-amber-400/30 transition-all"><p className="font-bold text-white text-sm">Ultimate F1 Guide 2026</p><p className="text-xs text-slate-500">Every race compared</p></Link>
        </div>
      </section>
    </div>
  );
};

export default MonacoExperiencePage;
