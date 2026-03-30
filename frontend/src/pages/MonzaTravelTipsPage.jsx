import { Link } from "react-router-dom";
import { Sun, Utensils, Camera, Shield, Clock, ChevronRight, Check, Star, Shirt, Luggage, Wifi } from "lucide-react";
import { Button } from "../components/ui/button";
import SEOHead from "../components/SEOHead";
import { BreadcrumbStructuredData, FAQStructuredData } from "../components/StructuredData";

const MonzaTravelTipsPage = () => {
  const tips = [
    { icon: Clock, title: "Timing", items: ["Gates open 08:00 - arrive early for best spots", "Support races start 10:30, F1 qualifying/race ~15:00", "Stay for the track invasion after the race (if you have GA)", "Allow 90 min to exit the park after the race ends"] },
    { icon: Utensils, title: "Food & Drink", items: ["Bring your own food! Monza allows it (unlike most circuits)", "Try the arancini near Gate 1 - legendary among fans", "Italian coffee from vendors is excellent and cheap (€1.50)", "Water bottles are allowed - fill up at free water points"] },
    { icon: Camera, title: "Photography", items: ["Best photos: Parabolica exit, Prima Variante braking", "Bring a 200-300mm lens for great car shots", "Golden hour (~18:00) gives magical lighting in September", "Selfie spots: podium area, Monza banking ruins, Turn 11"] },
    { icon: Sun, title: "Weather & Clothing", items: ["September avg: 22-28°C daytime, can drop to 16°C evening", "Pack sunscreen + sunglasses for daytime sessions", "Bring a light rain jacket - afternoon showers are possible", "Comfortable walking shoes are essential (5-10km walking/day)"] },
    { icon: Shirt, title: "What to Bring", items: ["Portable phone charger (your ticket is on your phone!)", "Ear plugs or ear defenders (F1 cars are 130dB!)", "Small backpack with water, snacks, rain jacket", "Cash for parking (€5) and some food vendors"] },
    { icon: Wifi, title: "Connectivity & Apps", items: ["Download the F1 app for live timing (essential!)", "Circuit WiFi is limited - rely on 4G/5G", "Screenshot your QR ticket before arriving (no signal dead zones)", "Share your location with friends - easy to get separated"] },
  ];

  const weekendSchedule = [
    { day: "Thursday", events: "Pit lane walk (special ticket), Merchandise & fan zone opens", tip: "Great for photos with empty grandstands" },
    { day: "Friday", events: "FP1 (13:30), FP2 (17:00), Support race practices", tip: "Quietest day - best for exploring the full circuit" },
    { day: "Saturday", events: "FP3 (12:30), Qualifying (16:00), Support races", tip: "Qualifying atmosphere is incredible - don't miss it!" },
    { day: "Sunday", events: "Race day! Warm-up, Support races, F1 Race (15:00)", tip: "THE day. Arrive by 09:00. Atmosphere peaks at 14:45." },
  ];

  const faqs = [
    { question: "What should I bring to Monza F1?", answer: "Essential items: phone charger (your ticket is digital!), ear protection, comfortable shoes, sunscreen, light rain jacket, water bottle, and cash for parking. Monza allows you to bring your own food and non-alcoholic drinks." },
    { question: "What time does the F1 race start at Monza?", answer: "The 2026 Italian Grand Prix race starts at 15:00 local time on Sunday. Gates open at 08:00. Support races begin at 10:30. We recommend arriving by 09:00." },
    { question: "Is Monza suitable for first-time F1 fans?", answer: "Absolutely! Monza is one of the best circuits for first-timers. It's affordable (from €69), easy to reach from Milan, the atmosphere is incredible, and the Tifosi fans are welcoming. General Admission lets you explore freely." },
    { question: "Can I do a track invasion at Monza?", answer: "Yes! After the race, General Admission fans can rush onto the main straight for the podium ceremony - a legendary Monza tradition. It happens organically when marshals open the gates. An unforgettable experience!" },
  ];

  return (
    <div className="min-h-screen bg-[hsl(210,20%,98%)]" data-testid="monza-tips-page">
      <SEOHead title="Monza F1 Tips & Travel Guide 2026 - Expert Advice" description="Expert tips for Monza Italian Grand Prix 2026. What to bring, best food spots, photography tips, weather advice, weekend schedule. From fans who've been 10+ times." canonicalUrl="https://euromatchtickets.com/monza-f1-travel-tips" />
      <BreadcrumbStructuredData items={[{ name: "Home", url: "https://euromatchtickets.com" }, { name: "F1 Tickets", url: "https://euromatchtickets.com/f1-tickets" }, { name: "Monza GP", url: "https://euromatchtickets.com/f1-italian-grand-prix-monza-tickets" }, { name: "Travel Tips", url: "https://euromatchtickets.com/monza-f1-travel-tips" }]} />

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm text-slate-500 mb-2">Updated March 2026 &bull; From fans who've attended 10+ Monza GPs</p>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Monza F1 Tips & Travel Guide 2026</h1>
          <p className="text-lg text-slate-600 mb-10">Everything the official guide doesn't tell you. Insider tips from our team who've attended every Monza GP since 2015.</p>

          {/* Tips Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {tips.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6" data-testid={`tip-${i}`}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center"><t.icon className="w-4 h-4 text-red-600" /></div>
                  <h2 className="font-bold text-slate-900">{t.title}</h2>
                </div>
                <ul className="space-y-2">
                  {t.items.map((item, j) => <li key={j} className="text-sm text-slate-600 flex items-start gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />{item}</li>)}
                </ul>
              </div>
            ))}
          </div>

          {/* Weekend Schedule */}
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Monza GP Weekend Schedule</h2>
          <div className="space-y-3 mb-12">
            {weekendSchedule.map((d, i) => (
              <div key={i} className={`bg-white rounded-xl border p-5 ${i === 3 ? 'border-red-300 ring-2 ring-red-50' : 'border-slate-200'}`}>
                <div className="flex items-start gap-4">
                  <div className={`text-lg font-black ${i === 3 ? 'text-red-600' : 'text-slate-400'}`}>{d.day}</div>
                  <div>
                    <p className="text-sm text-slate-700">{d.events}</p>
                    <p className={`text-xs mt-1 ${i === 3 ? 'text-red-600 font-bold' : 'text-slate-400'}`}>{d.tip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-red-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-2">Ready for Monza 2026?</h2>
            <p className="text-red-100 mb-4">Grab your tickets now from &euro;69 &bull; Prices increase closer to race day</p>
            <Link to="/f1-italian-grand-prix-monza-tickets"><Button size="lg" className="bg-white text-red-600 hover:bg-red-50 font-bold px-8 rounded-full">Buy Monza GP Tickets</Button></Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">FAQ - Monza Tips</h2>
          <FAQStructuredData faqs={faqs} />
          <div className="space-y-3">{faqs.map((f, i) => (
            <details key={i} className="group bg-white rounded-xl border border-slate-200">
              <summary className="p-5 font-bold text-slate-900 cursor-pointer list-none flex items-center justify-between">{f.question}<ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" /></summary>
              <p className="px-5 pb-5 text-slate-600 text-sm leading-relaxed">{f.answer}</p>
            </details>
          ))}</div>
        </div>
      </section>

      {/* Content Cluster */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Complete Monza F1 Guide</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/f1-italian-grand-prix-monza-tickets" className="bg-white border border-slate-200 rounded-xl p-4 hover:border-red-300 transition-all"><p className="font-bold text-slate-900 text-sm">Buy Monza Tickets</p><p className="text-xs text-emerald-600">From €69</p></Link>
            <Link to="/monza-best-seats-guide" className="bg-white border border-slate-200 rounded-xl p-4 hover:border-red-300 transition-all"><p className="font-bold text-slate-900 text-sm">Best Seats Guide</p><p className="text-xs text-slate-500">Every grandstand rated</p></Link>
            <Link to="/monza-ticket-prices" className="bg-white border border-slate-200 rounded-xl p-4 hover:border-red-300 transition-all"><p className="font-bold text-slate-900 text-sm">Ticket Prices Compared</p><p className="text-xs text-slate-500">Save up to 40%</p></Link>
            <Link to="/how-to-get-to-monza" className="bg-white border border-slate-200 rounded-xl p-4 hover:border-red-300 transition-all"><p className="font-bold text-slate-900 text-sm">How to Get to Monza</p><p className="text-xs text-slate-500">From Milan in 45 min</p></Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MonzaTravelTipsPage;
