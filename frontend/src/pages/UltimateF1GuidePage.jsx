import { Link } from "react-router-dom";
import { Flag, Star, MapPin, Calendar, Ticket, ChevronRight, TrendingUp, Trophy, Shield, Check, Zap } from "lucide-react";
import { Button } from "../components/ui/button";
import SEOHead from "../components/SEOHead";
import { BreadcrumbStructuredData, FAQStructuredData } from "../components/StructuredData";

const UltimateF1GuidePage = () => {
  const races = [
    { name: "Bahrain GP", circuit: "Sakhir", date: "Mar 6-8", price: 59, type: "Night Race", rating: 9.0, link: "/f1-bahrain-grand-prix-tickets", highlight: "Season opener under the desert stars" },
    { name: "Saudi Arabian GP", circuit: "Jeddah Corniche", date: "Mar 20-22", price: 89, type: "Street Night", rating: 8.5, link: "/f1-saudi-arabian-grand-prix-jeddah-tickets", highlight: "Fastest street circuit - 250km/h average" },
    { name: "Australian GP", circuit: "Albert Park, Melbourne", date: "Apr 3-5", price: 99, type: "Daylight", rating: 8.8, link: "/f1-australian-grand-prix-melbourne-tickets", highlight: "Party atmosphere + beach culture" },
    { name: "Japanese GP", circuit: "Suzuka", date: "Apr 17-19", price: 109, type: "Daylight", rating: 9.3, link: "/f1-japanese-grand-prix-suzuka-tickets", highlight: "Legendary figure-8 layout" },
    { name: "Miami GP", circuit: "Hard Rock Stadium", date: "May 1-3", price: 145, type: "Daylight", rating: 8.4, link: "/f1-miami-grand-prix-tickets", highlight: "Beach club + poolside viewing" },
    { name: "Monaco GP", circuit: "Monte Carlo", date: "May 22-24", price: 195, type: "Street", rating: 9.8, link: "/f1-monaco-grand-prix-tickets", highlight: "Most prestigious race - yachts & casinos" },
    { name: "Spanish GP", circuit: "Barcelona-Catalunya", date: "Jun 5-7", price: 79, type: "Daylight", rating: 7.8, link: "/f1-spanish-grand-prix-barcelona-tickets", highlight: "Great test track + Barcelona city" },
    { name: "Belgian GP", circuit: "Spa-Francorchamps", date: "Jul 24-26", price: 85, type: "Daylight", rating: 9.5, link: "/f1-belgian-grand-prix-spa-tickets", highlight: "Eau Rouge - most iconic corner in F1" },
    { name: "Hungarian GP", circuit: "Hungaroring, Budapest", date: "Jul 31-Aug 2", price: 75, type: "Daylight", rating: 8.2, link: "/f1-hungarian-grand-prix-budapest-tickets", highlight: "Verified European GP + Budapest nightlife" },
    { name: "Dutch GP", circuit: "Zandvoort", date: "Aug 28-30", price: 95, type: "Daylight", rating: 8.7, link: "/f1-dutch-grand-prix-zandvoort-tickets", highlight: "Incredible Dutch fans + beach circuit" },
    { name: "Italian GP", circuit: "Monza", date: "Sep 4-6", price: 69, type: "Daylight", rating: 9.4, link: "/f1-italian-grand-prix-monza-tickets", highlight: "Temple of Speed - Tifosi atmosphere" },
    { name: "Singapore GP", circuit: "Marina Bay", date: "Oct 2-4", price: 129, type: "Night Race", rating: 9.2, link: "/f1-singapore-grand-prix-tickets", highlight: "Stunning night race through the city" },
    { name: "Austrian GP", circuit: "Red Bull Ring", date: "Oct 16-18", price: 85, type: "Daylight", rating: 8.3, link: "/f1-austrian-grand-prix-red-bull-ring-tickets", highlight: "Alpine scenery + compact circuit" },
    { name: "Las Vegas GP", circuit: "The Strip", date: "Nov 20-22", price: 195, type: "Night Race", rating: 8.9, link: "/f1-las-vegas-grand-prix-tickets", highlight: "F1 on the Las Vegas Strip" },
    { name: "Abu Dhabi GP", circuit: "Yas Marina", date: "Dec 4-6", price: 119, type: "Twilight", rating: 9.1, link: "/f1-abu-dhabi-grand-prix-tickets", highlight: "Season finale - sunset to night" }
  ];

  const bestValue = [
    { label: "Verified Overall", race: "Bahrain GP", price: "€59", link: "/f1-bahrain-grand-prix-tickets" },
    { label: "Best European Value", race: "Monza (Italian GP)", price: "€69", link: "/f1-italian-grand-prix-monza-tickets" },
    { label: "Best Atmosphere", race: "Monza / Spa", price: "€69-85", link: "/f1-italian-grand-prix-monza-tickets" },
    { label: "Most Prestigious", race: "Monaco GP", price: "€195", link: "/f1-monaco-grand-prix-tickets" },
    { label: "Best Night Race", race: "Singapore GP", price: "€129", link: "/f1-singapore-grand-prix-tickets" },
    { label: "Best for First-Timers", race: "Monza or Bahrain", price: "€59-69", link: "/f1-italian-grand-prix-monza-tickets" }
  ];

  const faqs = [
    { question: "What is the cheapest F1 race to attend in 2026?", answer: "The Bahrain Grand Prix is the cheapest at €59 for General Admission. In Europe, the Italian GP at Monza is cheapest at €69. The Hungarian GP (€75) and Spanish GP (€79) are also great budget options." },
    { question: "Which F1 race has the best atmosphere?", answer: "The Italian GP at Monza is legendary for the Tifosi (Ferrari fans) - 350,000+ fans across the weekend. The Belgian GP at Spa and the British GP at Silverstone also have incredible atmospheres." },
    { question: "Is it worth going to an F1 race?", answer: "Absolutely! Nothing compares to the sound, speed, and atmosphere of live F1. The TV experience captures maybe 10% of the real thing. With tickets from €59, it's more affordable than most people think." },
    { question: "When should I buy F1 tickets?", answer: "Buy 6-9 months before the race for the best prices. Early-bird tickets are 20-30% cheaper than race-week prices. Popular races like Monaco and Singapore sell out months in advance." },
    { question: "What do I need to bring to an F1 race?", answer: "Essential items: phone charger (digital tickets!), ear protection, comfortable shoes, sunscreen, rain jacket, and water. Download the F1 app for live timing. Bring cash for some circuits' parking." },
    { question: "How much does an F1 weekend cost in total?", answer: "Budget option: Bahrain/Monza GA ticket (€59-69) + budget flight (€50-100) + hostel (€30-60/night) = total ~€250-350. Mid-range with grandstand: €400-700. VIP experience: €1,500+." }
  ];

  const articleSchema = {
    "@context": "https://schema.org", "@type": "Article",
    "headline": "Ultimate F1 Tickets Guide 2026 - Every Race Compared",
    "author": { "@type": "Organization", "name": "EuroMatchTickets" },
    "publisher": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    "datePublished": "2026-01-15", "dateModified": "2026-03-30",
    "mainEntityOfPage": "https://euromatchtickets.com/ultimate-f1-tickets-guide-2026"
  };

  return (
    <div className="min-h-screen bg-[#0b0d17]" data-testid="ultimate-f1-guide">
      <SEOHead title="Ultimate F1 Tickets Guide 2026 - Every Race!" description="Complete guide to every F1 race in 2026. Compare prices, atmospheres, circuits. From €59. Best seats, travel tips, VIP options. The only F1 ticket guide you need." canonicalUrl="https://euromatchtickets.com/ultimate-f1-tickets-guide-2026" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <BreadcrumbStructuredData items={[{ name: "Home", url: "https://euromatchtickets.com" }, { name: "F1 Tickets", url: "https://euromatchtickets.com/f1-tickets" }, { name: "Ultimate F1 Guide 2026", url: "https://euromatchtickets.com/ultimate-f1-tickets-guide-2026" }]} />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/30 via-[#0b0d17] to-[#0b0d17]" />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/30 bg-[#e10600]/100/10 text-red-400 text-xs font-bold mb-6 backdrop-blur-md"><Flag className="w-4 h-4" /> DEFINITIVE GUIDE</div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter mb-4">
            Ultimate F1 Tickets Guide
            <span className="block bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent text-2xl sm:text-3xl mt-2">2026 Season - Every Race Compared</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-6">15 races. Every circuit rated. Prices compared. Best seats picked. The only F1 ticket guide you'll ever need.</p>
          <p className="text-xs text-slate-500">Updated March 30, 2026 &bull; Prices verified daily</p>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="max-w-5xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[{ label: "Verified Race", val: "€59" }, { label: "Total Races", val: "15+" }, { label: "Avg Saving", val: "35%" }, { label: "Rating", val: "" }].map((s, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-none p-4 text-center"><p className="text-2xl font-black text-white">{s.val}</p><p className="text-xs text-slate-500">{s.label}</p></div>
          ))}
        </div>
      </section>

      {/* Best Value Awards */}
      <section className="max-w-5xl mx-auto px-4 pb-12">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-400" /> Our Picks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {bestValue.map((b, i) => (
            <Link key={i} to={b.link} className="bg-white/5 border border-amber-400/20 rounded-none p-4 hover:bg-white/10 transition-all">
              <p className="text-[10px] text-amber-400 font-bold uppercase">{b.label}</p>
              <p className="font-bold text-white mt-1">{b.race}</p>
              <p className="text-emerald-400 text-sm font-bold">{b.price}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Every Race */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Flag className="w-5 h-5 text-red-500" /> Every 2026 F1 Race - Rated & Priced</h2>
        <div className="space-y-3">
          {races.map((r, i) => (
            <Link key={i} to={r.link} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/5 border border-white/10 rounded-none p-5 hover:bg-white/10 hover:border-red-500/30 transition-all" data-testid={`f1-race-${i}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-white/40 font-bold w-6">#{i + 1}</span>
                  <h3 className="font-bold text-white">{r.name}</h3>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${r.type.includes('Night') ? 'bg-amber-500/100/30 text-amber-300' : r.type === 'Twilight' ? 'bg-purple-500/100/30 text-purple-300' : r.type === 'Street' ? 'bg-blue-500/100/30 text-blue-300' : 'bg-white/10 text-white/40'}`}>{r.type}</span>
                </div>
                <p className="text-sm text-slate-500 ml-8">{r.circuit} &bull; {r.date}</p>
                <p className="text-xs text-slate-400 ml-8 mt-1">{r.highlight}</p>
              </div>
              <div className="flex items-center gap-4 mt-3 sm:mt-0">
                <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /><span className="text-sm font-bold text-white">{r.rating}</span></div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white">&euro;{r.price}</p>
                  <p className="text-[10px] text-slate-500">from</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Buying Tips */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-br from-red-900/30 to-amber-900/10 border border-red-500/20 rounded-none p-8">
          <h2 className="text-2xl font-bold text-white mb-6">F1 Ticket Buying Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-400">
            <div><h3 className="font-bold text-red-300 mb-2">When to Buy</h3><p>Buy 6-9 months before for the best prices. Early-bird tickets are 20-30% cheaper. Race week prices spike by 40%+. Set a price alert and buy when you see a deal.</p></div>
            <div><h3 className="font-bold text-red-300 mb-2">Where to Sit</h3><p>General Admission is great for roaming. Grandstands at Turn 1 offer the best overtaking. The main straight gives start/finish views. VIP includes food, drink, and paddock access.</p></div>
            <div><h3 className="font-bold text-red-300 mb-2">Budget Planning</h3><p>Verified total trip: Bahrain or Monza GA (€59-69) + budget flight + hostel = €250-350. Mid-range: €500-700. VIP weekend: €1,500+. Plan around where you already want to travel.</p></div>
            <div><h3 className="font-bold text-red-300 mb-2">What to Bring</h3><p>Phone charger (digital tickets!), ear protection (130dB!), sunscreen, rain jacket, comfortable shoes. Download the F1 app for live timing. Bring cash for parking at some circuits.</p></div>
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="max-w-4xl mx-auto px-4 pb-16 space-y-8">
        <div>
          <h2 className="text-xl font-bold text-white mb-3">The Complete Guide to Buying F1 Tickets in 2026</h2>
          <p className="text-slate-400 leading-relaxed">Attending a <strong>Formula 1 Grand Prix</strong> is a bucket-list experience for millions of motorsport fans worldwide. With 24 races across 5 continents, the 2026 F1 season offers more opportunities than ever to see the fastest cars on Earth live. EuroMatchTickets offers <strong>verified F1 tickets from just €59</strong> with QR ticket delivery - that's up to 40% cheaper than official channels. Whether you want the glamour of <strong>Monaco</strong>, the raw speed of <strong>Monza</strong>, the desert spectacle of <strong>Bahrain</strong>, or the party atmosphere of <strong>Las Vegas</strong>, this guide covers every race with expert recommendations.</p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-3">Is It Worth Going to an F1 Race?</h2>
          <p className="text-slate-400 leading-relaxed">Absolutely! Television captures perhaps 10% of the real Formula 1 experience. The <strong>sound</strong> of an F1 car at full throttle (130+ decibels) literally vibrates your chest. The <strong>speed</strong> is incomprehensible - 340km/h becomes a blur that your eyes can barely track. And the <strong>atmosphere</strong> of 100,000+ passionate fans cheering their heroes is something no camera can capture. At just <strong>€59 for Bahrain or €69 for Monza</strong>, it's cheaper than a Premier League match and 100x more memorable.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-bold text-white mb-4">FAQ - F1 Tickets 2026</h2>
        <FAQStructuredData faqs={faqs} />
        <div className="space-y-2">{faqs.map((f, i) => (
          <details key={i} className="group rounded-none border border-white/10 bg-white/5 hover:bg-white/10 transition">
            <summary className="p-4 font-bold text-sm text-white cursor-pointer list-none flex items-center justify-between">{f.question}<ChevronRight className="w-4 h-4 text-slate-500 group-open:rotate-90 transition-transform" /></summary>
            <p className="px-4 pb-4 text-slate-400 text-sm leading-relaxed">{f.answer}</p>
          </details>
        ))}</div>
      </section>

      {/* Master Link Wheel */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-lg font-bold text-white mb-4">Deep Dive into Each Race</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { to: "/monza-best-seats-guide", label: "Monza Best Seats", tag: "GUIDE" },
            { to: "/monza-ticket-prices", label: "Monza Prices", tag: "COMPARE" },
            { to: "/how-to-get-to-monza", label: "How to Get to Monza", tag: "TRAVEL" },
            { to: "/monza-f1-travel-tips", label: "Monza Tips", tag: "TIPS" },
            { to: "/monaco-gp-vip-experience", label: "Monaco VIP", tag: "VIP" },
            { to: "/bahrain-f1-night-race-guide", label: "Bahrain Night Race", tag: "NIGHT" },
            { to: "/f1-ticket-prices-guide", label: "F1 Price Guide", tag: "PRICES" },
            { to: "/best-f1-races-europe", label: "Best European Races", tag: "TOP 10" }
          ].map((l, i) => (
            <Link key={i} to={l.to} className="bg-white/5 border border-white/10 rounded-none p-4 hover:border-red-500/30 transition-all">
              <p className="font-bold text-white text-sm">{l.label}</p>
              <span className="text-[9px] text-red-400 font-bold mt-1 inline-block">{l.tag}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default UltimateF1GuidePage;
