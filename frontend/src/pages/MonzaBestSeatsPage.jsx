import { Link } from "react-router-dom";
import { MapPin, Star, ChevronRight, Check, Eye, Camera, Sun, Umbrella, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import SEOHead from "../components/SEOHead";
import { BreadcrumbStructuredData, FAQStructuredData } from "../components/StructuredData";

const MonzaBestSeatsPage = () => {
  const grandstands = [
    { name: "Parabolica Grandstand", rating: 9.5, price: "€149", view: "Final high-speed corner + podium ceremony", pros: ["See cars at 300km/h exit", "Podium celebration visible", "Covered seating available"], cons: ["Limited pit straight view"], best: "Best for: Photography enthusiasts & Ferrari fans", color: "border-red-500" },
    { name: "Prima Variante (Turn 1)", rating: 9.2, price: "€169", view: "Braking zone + start/finish straight", pros: ["Most overtaking action", "See race start & finish", "Close to pit entry"], cons: ["Slightly more expensive"], best: "Best for: Overtaking action lovers", color: "border-green-600" },
    { name: "Ascari Chicane", rating: 8.5, price: "€139", view: "Technical chicane section", pros: ["Close to the track", "Great for photos", "Less crowded"], cons: ["No straight-line speed view"], best: "Best for: Photographers & quiet atmosphere", color: "border-blue-500" },
    { name: "General Admission (Prato)", rating: 8.8, price: "€69", view: "Multiple spots around the circuit", pros: ["Freedom to roam", "Cheapest option", "Multiple viewpoints"], cons: ["No guaranteed seat", "Can get crowded"], best: "Best for: Budget-conscious fans & first-timers", color: "border-emerald-500" },
    { name: "VIP Village", rating: 9.8, price: "€595", view: "Track-side terrace", pros: ["Open bar all day", "Italian gourmet cuisine", "Private terrace"], cons: ["Premium price"], best: "Best for: Corporate events & luxury seekers", color: "border-purple-500" },
    { name: "Paddock Club", rating: 10, price: "€1,995", view: "Pit lane & paddock access", pros: ["Pit lane walks", "Driver meet & greet", "5-star hospitality"], cons: ["Very limited availability"], best: "Best for: Ultimate F1 experience", color: "border-amber-500" },
  ];

  const faqs = [
    { question: "What is the best grandstand at Monza for overtaking?", answer: "Prima Variante (Turn 1) is the best spot for overtaking. Cars brake from 340km/h to 80km/h here, making it the heaviest braking zone. Most position changes happen at this corner." },
    { question: "Which Monza grandstand has the best view?", answer: "The Parabolica Grandstand offers the most dramatic view - seeing cars exit at 300km/h plus the podium celebration. However, Prima Variante gives you the start/finish and overtaking action." },
    { question: "Is General Admission worth it at Monza?", answer: "Absolutely! At just €69, Monza's Prato (GA) is the best value in F1. You can roam the entire Parco di Monza, find multiple vantage points, and experience the legendary Tifosi atmosphere." },
    { question: "Are Monza grandstand seats covered?", answer: "Most grandstands at Monza have partial cover. The Parabolica and Prima Variante main sections have roofing. September weather in Monza is usually warm (22-28°C) with occasional rain." },
  ];

  const reviewSchema = {
    "@context": "https://schema.org", "@type": "Article",
    "headline": "Best Seats at Monza F1 Grand Prix 2026 - Complete Grandstand Guide",
    "author": { "@type": "Organization", "name": "EuroMatchTickets" },
    "publisher": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    "datePublished": "2026-02-15", "dateModified": "2026-03-30",
    "mainEntityOfPage": "https://euromatchtickets.com/monza-best-seats-guide"
  };

  return (
    <div className="min-h-screen bg-[#0e0e14]" data-testid="monza-seats-page">
      <SEOHead title="Best Seats at Monza F1 2026 - Grandstand Guide" description="Complete guide to the best grandstands at Monza Italian Grand Prix 2026. Parabolica, Prima Variante, Ascari rated. Expert tips + cheapest prices from €69." canonicalUrl="https://euromatchtickets.com/monza-best-seats-guide" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />
      <BreadcrumbStructuredData items={[{ name: "Home", url: "https://euromatchtickets.com" }, { name: "F1 Tickets", url: "https://euromatchtickets.com/f1-tickets" }, { name: "Monza GP", url: "https://euromatchtickets.com/f1-italian-grand-prix-monza-tickets" }, { name: "Best Seats Guide", url: "https://euromatchtickets.com/monza-best-seats-guide" }]} />

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm text-slate-500 mb-2">Updated March 2026 &bull; 8 min read</p>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4">Best Seats at Monza F1 Grand Prix 2026</h1>
          <p className="text-lg text-slate-400 mb-8">Our expert guide to every grandstand at the Autodromo Nazionale di Monza. Find the perfect seat for your budget and viewing preferences.</p>

          <div className="bg-emerald-500/10 border border-emerald-200 rounded-none p-4 mb-8 flex items-center gap-3">
            <Star className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p className="text-sm text-emerald-800"><strong>Our Pick:</strong> Parabolica Grandstand (€149) - best combination of view, atmosphere, and value. <Link to="/f1-italian-grand-prix-monza-tickets" className="text-emerald-700 underline font-bold">Buy Monza tickets from €69</Link></p>
          </div>

          {/* Grandstand Reviews */}
          <div className="space-y-6">
            {grandstands.map((g, i) => (
              <div key={i} className={`bg-[#1e1e1e] rounded-none border-l-4 ${g.color} p-6 shadow-sm`} data-testid={`grandstand-${i}`}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h2 className="text-xl font-bold text-white">{i + 1}. {g.name}</h2>
                    <p className="text-sm text-slate-500 mt-1"><Eye className="w-3.5 h-3.5 inline mr-1" />{g.view}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-black text-white">{g.rating}<span className="text-sm text-slate-400 font-normal">/10</span></div>
                    <div className="text-emerald-600 font-bold text-sm">From {g.price}</div>
                  </div>
                </div>
                <p className="text-xs text-amber-700 bg-amber-500/10 inline-block px-2 py-1 rounded-full mb-3">{g.best}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-slate-400 font-bold mb-1">PROS</p>
                    {g.pros.map((p, j) => <p key={j} className="text-sm text-slate-300 flex items-center gap-1"><Check className="w-3 h-3 text-emerald-500" />{p}</p>)}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold mb-1">CONS</p>
                    {g.cons.map((c, j) => <p key={j} className="text-sm text-slate-500 flex items-center gap-1"><span className="w-3 text-center text-red-400">-</span>{c}</p>)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 bg-red-600 rounded-none p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-2">Ready to Book Your Monza Seats?</h2>
            <p className="text-red-100 mb-4">Tickets from €69 &bull; Instant QR Delivery &bull; FanProtect Guarantee</p>
            <Link to="/f1-italian-grand-prix-monza-tickets"><Button size="lg" className="bg-[#1e1e1e] text-red-600 hover:bg-[#e10600]/10 font-bold px-8 rounded-full">Buy Monza GP Tickets</Button></Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-[#15151e]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-6">FAQ - Monza Grandstands</h2>
          <FAQStructuredData faqs={faqs} />
          <div className="space-y-3">{faqs.map((f, i) => (
            <details key={i} className="group bg-[#1e1e1e] rounded-none border border-white/10">
              <summary className="p-5 font-bold text-white cursor-pointer list-none flex items-center justify-between">{f.question}<ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" /></summary>
              <p className="px-5 pb-5 text-slate-400 text-sm leading-relaxed">{f.answer}</p>
            </details>
          ))}</div>
        </div>
      </section>

      {/* Content Cluster Links */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-lg font-bold text-white mb-4">Complete Monza F1 Guide</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/f1-italian-grand-prix-monza-tickets" className="bg-[#1e1e1e] border border-white/10 rounded-none p-4 hover:border-red-300 transition-all flex items-center gap-3"><span className="text-2xl">🎟️</span><div><p className="font-bold text-white text-sm">Buy Monza Tickets</p><p className="text-xs text-emerald-600">From €69</p></div></Link>
            <Link to="/monza-ticket-prices" className="bg-[#1e1e1e] border border-white/10 rounded-none p-4 hover:border-red-300 transition-all flex items-center gap-3"><span className="text-2xl">💰</span><div><p className="font-bold text-white text-sm">Monza Ticket Prices Compared</p><p className="text-xs text-slate-500">Save up to 40%</p></div></Link>
            <Link to="/how-to-get-to-monza" className="bg-[#1e1e1e] border border-white/10 rounded-none p-4 hover:border-red-300 transition-all flex items-center gap-3"><span className="text-2xl">🚆</span><div><p className="font-bold text-white text-sm">How to Get to Monza</p><p className="text-xs text-slate-500">From Milan in 45 min</p></div></Link>
            <Link to="/monza-f1-travel-tips" className="bg-[#1e1e1e] border border-white/10 rounded-none p-4 hover:border-red-300 transition-all flex items-center gap-3"><span className="text-2xl">📋</span><div><p className="font-bold text-white text-sm">Monza F1 Tips & Travel Guide</p><p className="text-xs text-slate-500">Expert insider tips</p></div></Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MonzaBestSeatsPage;
