import { Link } from "react-router-dom";
import { Ticket, TrendingUp, Calendar, Info } from "lucide-react";
import { Button } from "../components/ui/button";
import SEOHead from "../components/SEOHead";
import BreadcrumbSchema from "../components/BreadcrumbSchema";

const F1TicketPricesGuidePage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "F1 Ticket Prices 2026 - Complete Price Guide",
    "description": "Complete guide to Formula 1 ticket prices for 2026. Compare prices across all 23 races. General admission, grandstand, VIP hospitality costs.",
    "author": { "@type": "Organization", "name": "EuroMatchTickets" },
    "datePublished": "2026-01-20",
    "dateModified": "2026-03-01"
  };

  const priceData = [
    { race: "Bahrain GP", ga: 149, grandstand: 329, vip: 1189, paddock: 3789 },
    { race: "Saudi Arabian GP", ga: 169, grandstand: 379, vip: 1389, paddock: 4289 },
    { race: "Australian GP", ga: 159, grandstand: 349, vip: 1289, paddock: 3989 },
    { race: "Japanese GP", ga: 189, grandstand: 389, vip: 1389, paddock: 4289 },
    { race: "Miami GP", ga: 249, grandstand: 449, vip: 1489, paddock: 4989 },
    { race: "Monaco GP", ga: 289, grandstand: 589, vip: 1989, paddock: 4989 },
    { race: "Spanish GP", ga: 119, grandstand: 249, vip: 989, paddock: 2989 },
    { race: "Austrian GP", ga: 119, grandstand: 279, vip: 1089, paddock: 3289 },
    { race: "British GP", ga: 149, grandstand: 289, vip: 1289, paddock: 3989 },
    { race: "Hungarian GP", ga: 99, grandstand: 199, vip: 889, paddock: 2689 },
    { race: "Belgian GP", ga: 109, grandstand: 259, vip: 1189, paddock: 3489 },
    { race: "Dutch GP", ga: 189, grandstand: 389, vip: 1489, paddock: 4489 },
    { race: "Italian GP", ga: 99, grandstand: 189, vip: 989, paddock: 2989 },
    { race: "Singapore GP", ga: 189, grandstand: 389, vip: 1489, paddock: 4489 },
    { race: "USA GP (Austin)", ga: 179, grandstand: 349, vip: 1389, paddock: 4289 },
    { race: "Mexico GP", ga: 149, grandstand: 299, vip: 1189, paddock: 3789 },
    { race: "Brazil GP", ga: 159, grandstand: 319, vip: 1289, paddock: 3989 },
    { race: "Las Vegas GP", ga: 249, grandstand: 489, vip: 1989, paddock: 5989 },
    { race: "Abu Dhabi GP", ga: 169, grandstand: 289, vip: 1489, paddock: 4489 }
  ];

  const cheapestRaces = priceData.sort((a, b) => a.ga - b.ga).slice(0, 5);
  const mostExpensive = priceData.sort((a, b) => b.ga - a.ga).slice(0, 5);

  return (
    <div className="min-h-screen bg-[#0e0e14]">
      <BreadcrumbSchema items={[{ name: "Home", url: "https://euromatchtickets.com/" }, { name: "F1 Tickets", url: "https://euromatchtickets.com/f1-tickets" }, { name: "F1 Ticket Prices Guide", url: "https://euromatchtickets.com/f1-ticket-prices-guide" }]} />
      <SEOHead 
        title="F1 Ticket Prices 2026 | Complete Price Guide"
        description="Complete F1 ticket price guide 2026. Compare prices for all 23 Grand Prix races. General admission from €99, Grandstand from €189, VIP from €889. Save up."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero */}
      <section className="relative py-16 bg-gradient-to-br from-emerald-600/20 via-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            F1 Ticket Prices 2026
            <span className="block text-2xl mt-2 text-slate-500">Complete Price Guide for All Races</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Compare ticket prices across all 23 Formula 1 races. Find the best deals and save up to 50% (market pricing may vary) prices.
          </p>
        </div>
      </section>

      {/* Price Overview */}
      <section className="py-8 border-y border-white/5 bg-[#15151e]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-sm text-slate-400 mb-1">General Admission</div>
              <div className="text-2xl font-bold text-emerald-600">€99 - €289</div>
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-1">Grandstand</div>
              <div className="text-2xl font-bold text-blue-600">€189 - €589</div>
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-1">VIP Hospitality</div>
              <div className="text-2xl font-bold text-violet-600">€889 - €1,989</div>
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-1">Paddock Club</div>
              <div className="text-2xl font-bold text-amber-600">€2,689 - €5,989</div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Price Table */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">2026 F1 Ticket Prices by Race</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#1e1e1e] border-b border-white/10">
                  <th className="py-3 px-4 text-left">Race</th>
                  <th className="py-3 px-4 text-right">General Admission</th>
                  <th className="py-3 px-4 text-right">Grandstand</th>
                  <th className="py-3 px-4 text-right">VIP Hospitality</th>
                  <th className="py-3 px-4 text-right">Paddock Club</th>
                </tr>
              </thead>
              <tbody>
                {priceData.sort((a, b) => a.ga - b.ga).map((race, i) => (
                  <tr key={i} className="border-b border-white/10 hover:bg-[#15151e]">
                    <td className="py-3 px-4 font-medium">{race.race}</td>
                    <td className="py-3 px-4 text-right text-emerald-600">€{race.ga}</td>
                    <td className="py-3 px-4 text-right text-blue-600">€{race.grandstand}</td>
                    <td className="py-3 px-4 text-right text-violet-600">€{race.vip}</td>
                    <td className="py-3 px-4 text-right text-amber-600">€{race.paddock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-slate-400 text-sm mt-4">* Prices are starting prices for 3-day weekend passes. Actual prices may vary based on grandstand selection and availability.</p>
        </div>
      </section>

      {/* Verified vs Most Expensive */}
      <section className="py-16 bg-[#15151e]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
                5 Verified F1 Races 2026
              </h2>
              <div className="space-y-3">
                {cheapestRaces.map((race, i) => (
                  <div key={i} className="flex items-center justify-between bg-[#1e1e1e] rounded-none p-4">
                    <span className="font-medium">{i + 1}. {race.race}</span>
                    <span className="text-emerald-600 font-bold">from €{race.ga}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Ticket className="w-6 h-6 text-red-600" />
                5 Premium F1 Races 2026
              </h2>
              <div className="space-y-3">
                {mostExpensive.map((race, i) => (
                  <div key={i} className="flex items-center justify-between bg-[#1e1e1e] rounded-none p-4">
                    <span className="font-medium">{i + 1}. {race.race}</span>
                    <span className="text-amber-600 font-bold">from €{race.ga}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticket Categories Explained */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">F1 Ticket Categories Explained</h2>
          <div className="space-y-6">
            <div className="bg-[#1e1e1e] border border-white/10 rounded-none p-6">
              <h3 className="text-xl font-bold text-emerald-600 mb-2">General Admission (€99 - €289)</h3>
              <p className="text-slate-500">Access to designated viewing areas around the circuit. No reserved seat - arrive early for best spots. Great value for exploring multiple vantage points throughout the weekend.</p>
            </div>
            <div className="bg-[#1e1e1e] border border-white/10 rounded-none p-6">
              <h3 className="text-xl font-bold text-blue-600 mb-2">Grandstand (€189 - €589)</h3>
              <p className="text-slate-500">Reserved numbered seat in covered or uncovered grandstand. Choose specific corners like Turn 1, Pit Straight, or iconic locations like Eau Rouge (Spa) or Casino (Monaco).</p>
            </div>
            <div className="bg-[#1e1e1e] border border-white/10 rounded-none p-6">
              <h3 className="text-xl font-bold text-violet-600 mb-2">VIP Hospitality (€889 - €1,989)</h3>
              <p className="text-slate-500">Premium experience including grandstand seat plus hospitality suite access. Includes gourmet food, open bar, pit lane walks, and sometimes driver appearances.</p>
            </div>
            <div className="bg-[#1e1e1e] border border-white/10 rounded-none p-6">
              <h3 className="text-xl font-bold text-amber-600 mb-2">Paddock Club (€2,689 - €5,989)</h3>
              <p className="text-slate-500">The ultimate F1 experience. Exclusive paddock access, five-star dining, open champagne bar, behind-the-scenes tours, and the chance to meet drivers and team principals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="py-16 bg-[#15151e]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Info className="w-6 h-6 text-red-600" />
            Tips to Get the Best F1 Ticket Prices
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Book 3-6 months in advance for best prices",
              "Consider 'off-peak' races like Hungary or Spain",
              "General Admission offers best value for first-timers",
              "Friday tickets are cheapest if you can't attend full weekend",
              "Compare grandstand locations - some offer better value",
              "Look for early bird discounts in November/December",
              "Avoid booking too close to race day - prices increase",
              "Check for package deals including hotel + tickets"
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3 bg-[#1e1e1e] rounded-none p-4">
                <span className="text-emerald-600 font-bold">{i + 1}.</span>
                <span className="text-slate-400">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-emerald-900/30 to-blue-900/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Book Your F1 Tickets?</h2>
          <p className="text-slate-500 mb-8">Browse all races and find tickets at the best prices</p>
          <Link to="/f1-tickets">
            <Button size="lg" className="bg-emerald-500/100 hover:bg-emerald-600 px-8">
              <Ticket className="w-5 h-5 mr-2" />
              View All F1 Tickets
            </Button>
          </Link>
        </div>
      </section>

      {/* Related Searches */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-lg font-bold mb-4">Related Searches:</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "F1 ticket prices 2026", "how much are F1 tickets", "cheapest F1 race",
              "F1 hospitality prices", "F1 paddock club cost", "F1 ticket comparison",
              "budget F1 experience", "F1 grandstand prices"
            ].map((term, i) => (
              <span key={i} className="px-3 py-1 bg-[#15151e] text-slate-500 rounded-full text-sm">{term}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default F1TicketPricesGuidePage;
