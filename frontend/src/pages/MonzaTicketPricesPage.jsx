import { Link } from "react-router-dom";
import { Check, ChevronRight, TrendingDown, Shield, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import SEOHead from "../components/SEOHead";
import { BreadcrumbStructuredData, FAQStructuredData } from "../components/StructuredData";

const MonzaTicketPricesPage = () => {
  const comparison = [
    { category: "General Admission (Prato)", ours: 69, official: 109, stubhub: 99, viagogo: 105, saving: "37%" },
    { category: "Parabolica Grandstand", ours: 149, official: 239, stubhub: 219, viagogo: 229, saving: "38%" },
    { category: "Prima Variante (Turn 1)", ours: 169, official: 279, stubhub: 249, viagogo: 259, saving: "39%" },
    { category: "Ascari Chicane", ours: 139, official: 219, stubhub: 199, viagogo: 209, saving: "37%" },
    { category: "VIP Village", ours: 595, official: 999, stubhub: 899, viagogo: 949, saving: "40%" },
    { category: "Paddock Club", ours: 1995, official: 2999, stubhub: 2799, viagogo: 2899, saving: "33%" }
  ];

  const monthlyPrices = [
    { month: "December 2025", ga: 59, parabolica: 129, tip: "Verified time to buy!" },
    { month: "January 2026", ga: 62, parabolica: 135, tip: "Still excellent prices" },
    { month: "March 2026", ga: 65, parabolica: 142, tip: "Good early-bird prices" },
    { month: "June 2026", ga: 69, parabolica: 149, tip: "Standard pricing" },
    { month: "August 2026", ga: 79, parabolica: 169, tip: "Prices starting to rise" },
    { month: "Race Week", ga: 95, parabolica: 199, tip: "Last-minute premium" }
  ];

  const faqs = [
    { question: "How much do Monza F1 tickets cost?", answer: "Monza F1 tickets on EuroMatchTickets start from €69 for General Admission - the cheapest F1 race in Europe. Grandstand seats range from €139-€169. VIP from €595. All prices include 3-day weekend access." },
    { question: "When is the cheapest time to buy Monza tickets?", answer: "The cheapest time is December-January, 8-9 months before the race. Prices increase by 15-25% as the race approaches. Race week prices can be 40% higher than early-bird rates." },
    { question: "Are Monza tickets cheaper than other F1 races?", answer: "Yes! Monza is the cheapest F1 race in Europe. General Admission at €69 is half the price of Monaco (€195) and cheaper than Silverstone (€95), Spa (€85), and Barcelona (€79)." },
    { question: "Do ticket prices include all 3 days?", answer: "Yes! Every Monza GP ticket includes access to all 3 days - Friday Practice, Saturday Qualifying, and Sunday Race. You don't need to buy separate tickets for each day." }
  ];

  return (
    <div className="min-h-screen bg-[#0e0e14]" data-testid="monza-prices-page">
      <SEOHead title="Monza F1 Ticket Prices 2026 - Price Comparison" description="Compare Monza Italian Grand Prix ticket prices 2026. Save up to 40% vs competitors. General admission from €69, grandstands from €139. Price history & buying tips." canonicalUrl="https://euromatchtickets.com/monza-ticket-prices" />
      <BreadcrumbStructuredData items={[{ name: "Home", url: "https://euromatchtickets.com" }, { name: "F1 Tickets", url: "https://euromatchtickets.com/f1-tickets" }, { name: "Monza GP", url: "https://euromatchtickets.com/f1-italian-grand-prix-monza-tickets" }, { name: "Ticket Prices", url: "https://euromatchtickets.com/monza-ticket-prices" }]} />

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-sm text-slate-500 mb-2">Updated March 2026 &bull; Prices verified daily</p>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4">Monza F1 Ticket Prices 2026 - Complete Comparison</h1>
          <p className="text-lg text-slate-400 mb-10">We compared prices across 4 major platforms. EuroMatchTickets offers the cheapest Monza tickets - save up to 40%.</p>

          {/* Price Comparison Table */}
          <div className="bg-[#1e1e1e] rounded-none shadow-sm border border-white/10 overflow-hidden mb-12">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#15151e] border-b border-white/10">
                    <th className="text-left py-4 px-4 font-bold text-slate-300">Category</th>
                    <th className="text-center py-4 px-4 font-bold text-emerald-700 bg-emerald-500/10">EuroMatch</th>
                    <th className="text-center py-4 px-4 font-bold text-slate-500">F1.com</th>
                    <th className="text-center py-4 px-4 font-bold text-slate-500">StubHub</th>
                    <th className="text-center py-4 px-4 font-bold text-slate-500">Viagogo</th>
                    <th className="text-center py-4 px-4 font-bold text-red-600">You Save</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((c, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-[#15151e]">
                      <td className="py-4 px-4 font-medium text-white">{c.category}</td>
                      <td className="py-4 px-4 text-center font-bold text-emerald-700 bg-emerald-500/10 text-lg">&euro;{c.ours}</td>
                      <td className="py-4 px-4 text-center text-slate-400 line-through">&euro;{c.official}</td>
                      <td className="py-4 px-4 text-center text-slate-400 line-through">&euro;{c.stubhub}</td>
                      <td className="py-4 px-4 text-center text-slate-400 line-through">&euro;{c.viagogo}</td>
                      <td className="py-4 px-4 text-center font-bold text-red-600">{c.saving}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-emerald-500/10 border-t border-emerald-200 text-center">
              <p className="text-sm text-emerald-800 font-medium flex items-center justify-center gap-2"><Shield className="w-4 h-4" /> All EuroMatchTickets prices include Buyer protection + QR ticket delivery</p>
            </div>
          </div>

          {/* When to Buy */}
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><TrendingDown className="w-6 h-6 text-emerald-600" /> When to Buy - Price History</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-12">
            {monthlyPrices.map((m, i) => (
              <div key={i} className={`bg-[#1e1e1e] rounded-none border p-4 ${i === 0 ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-white/10'}`}>
                <p className="font-bold text-white">{m.month}</p>
                <div className="flex gap-4 mt-2">
                  <div><p className="text-[10px] text-slate-400">GA</p><p className="font-bold text-white">&euro;{m.ga}</p></div>
                  <div><p className="text-[10px] text-slate-400">Parabolica</p><p className="font-bold text-white">&euro;{m.parabolica}</p></div>
                </div>
                <p className={`text-xs mt-2 ${i === 0 ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>{m.tip}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-red-600 rounded-none p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-2">Lock In Today's Prices</h2>
            <p className="text-red-100 mb-4">Monza tickets from &euro;69 &bull; Prices increase as race day approaches</p>
            <Link to="/f1-italian-grand-prix-monza-tickets"><Button size="lg" className="bg-[#1e1e1e] text-red-600 hover:bg-[#e10600]/10 font-bold px-8 rounded-full">Buy Monza Tickets Now</Button></Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-[#15151e]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-6">FAQ - Monza Ticket Prices</h2>
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
            <Link to="/f1-italian-grand-prix-monza-tickets" className="bg-[#1e1e1e] border border-white/10 rounded-none p-4 hover:border-red-300 transition-all"><p className="font-bold text-white text-sm">Buy Monza Tickets</p><p className="text-xs text-emerald-600">From €69 - Instant delivery</p></Link>
            <Link to="/monza-best-seats-guide" className="bg-[#1e1e1e] border border-white/10 rounded-none p-4 hover:border-red-300 transition-all"><p className="font-bold text-white text-sm">Best Seats Guide</p><p className="text-xs text-slate-500">Every grandstand rated</p></Link>
            <Link to="/how-to-get-to-monza" className="bg-[#1e1e1e] border border-white/10 rounded-none p-4 hover:border-red-300 transition-all"><p className="font-bold text-white text-sm">How to Get to Monza</p><p className="text-xs text-slate-500">From Milan in 45 min</p></Link>
            <Link to="/monza-f1-travel-tips" className="bg-[#1e1e1e] border border-white/10 rounded-none p-4 hover:border-red-300 transition-all"><p className="font-bold text-white text-sm">Monza Tips & Travel Guide</p><p className="text-xs text-slate-500">Expert insider tips</p></Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MonzaTicketPricesPage;
