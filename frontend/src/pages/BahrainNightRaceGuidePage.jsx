import { Link } from "react-router-dom";
import { Moon, Thermometer, Star, ChevronRight, Check, Clock, Shield, Camera, MapPin, Calendar } from "lucide-react";
import { Button } from "../components/ui/button";
import SEOHead from "../components/SEOHead";
import { BreadcrumbStructuredData, FAQStructuredData } from "../components/StructuredData";

const BahrainNightRaceGuidePage = () => {
  const reasons = [
    { title: "Twilight to Starlight", desc: "The race starts at sunset, transforming the sky from orange to deep blue as floodlights ignite. It's arguably the most visually stunning race in F1. Photographers dream of this lighting." },
    { title: "Perfect Temperature", desc: "March in Bahrain means 22-27°C during the day, dropping to a comfortable 18-22°C at night. No sweating in 40°C heat like some Middle East summers. Zero rain. Perfect conditions." },
    { title: "Season Opener Drama", desc: "Bahrain is the first race of 2026. Every team unveils their new car speed here. Nobody knows who's fast. The tension, surprises, and drama are unmatched." },
    { title: "Affordable Luxury", desc: "Despite its Middle East location, Bahrain offers the cheapest F1 tickets globally - from just €59 GA. Combine with excellent local hospitality, and it's incredible value." },
    { title: "Desert Atmosphere", desc: "The contrast of modern F1 technology against ancient desert landscapes is mesmerizing. The circuit sits in the Sakhir desert - barren beauty meets cutting-edge speed." },
    { title: "World-Class Facilities", desc: "The Bahrain International Circuit is one of the most modern in F1. Clean facilities, great food vendors, easy access, and friendly staff make for a stress-free experience." },
  ];

  const schedule = [
    { day: "Thursday", events: "Pit lane walk (special ticket), Fan Zone opens, driver signings", tip: "Best day for selfies with empty track behind you" },
    { day: "Friday", events: "FP1 (14:30 twilight), FP2 (18:00 night), support races", tip: "First glimpse of cars under lights - magical!" },
    { day: "Saturday", events: "FP3 (14:30), Qualifying (18:00 night), desert sunset", tip: "Qualifying under lights is almost as exciting as the race" },
    { day: "Sunday", events: "Race day! Warm-up, support races, F1 Race (18:00)", tip: "LIGHTS OUT at sunset. Arrive by 15:00 minimum." },
  ];

  const faqs = [
    { question: "Is Bahrain GP really a night race?", answer: "It starts at twilight (18:00 local) and finishes under full floodlights. The transition from sunset to night is spectacular. The last 30 laps are under the stars." },
    { question: "What's the weather like at Bahrain GP?", answer: "March: 22-27°C day, 18-22°C night. Almost zero chance of rain. Very comfortable for spectating. Bring sunscreen for daytime sessions and a light layer for after dark." },
    { question: "How much are Bahrain F1 tickets?", answer: "Bahrain GP tickets start from just €59 for General Admission on EuroMatchTickets - the cheapest F1 race globally. Main Grandstand from €119. VIP from €495." },
    { question: "Is Bahrain GP good for first-timers?", answer: "Perfect! The low prices (€59), amazing facilities, friendly atmosphere, comfortable weather, and spectacular night visuals make it ideal for F1 newcomers. Many fans say it's their favourite race." },
    { question: "How do I get to Bahrain International Circuit?", answer: "The circuit is 30km south of Manama. Free shuttle buses operate from major hotels. Taxis are cheap (~€15 from city). Parking at the circuit is available for ~€5." },
  ];

  return (
    <div className="min-h-screen bg-[#0b0d17]" data-testid="bahrain-night-guide">
      <SEOHead title="Bahrain F1 Night Race Guide 2026 - What to Expect" description="Complete guide to Bahrain Grand Prix night race 2026. What makes it special, weather, schedule, best grandstands. The cheapest F1 race from €59. Expert insider tips." canonicalUrl="https://euromatchtickets.com/bahrain-f1-night-race-guide" />
      <BreadcrumbStructuredData items={[{ name: "Home", url: "https://euromatchtickets.com" }, { name: "F1 Tickets", url: "https://euromatchtickets.com/f1-tickets" }, { name: "Bahrain GP", url: "https://euromatchtickets.com/f1-bahrain-grand-prix-tickets" }, { name: "Night Race Guide", url: "https://euromatchtickets.com/bahrain-f1-night-race-guide" }]} />

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-bold mb-6"><Moon className="w-4 h-4" /> NIGHT RACE GUIDE</div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">Bahrain F1 Night Race Guide 2026</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">What makes the desert night race so special? Everything you need to know before you go.</p>
          <p className="text-xs text-slate-500 mt-4">Updated March 2026 &bull; From fans who've attended 5+ Bahrain GPs</p>
        </div>
      </section>

      {/* Why It's Special */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-bold text-white mb-6">6 Reasons Bahrain Night Race Is Unmissable</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reasons.map((r, i) => (
            <div key={i} className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5 hover:bg-amber-500/10 transition-all">
              <h3 className="font-bold text-amber-300 mb-2">{i + 1}. {r.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Weekend Schedule */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-bold text-white mb-6">Bahrain GP Weekend Schedule</h2>
        <div className="space-y-3">
          {schedule.map((d, i) => (
            <div key={i} className={`bg-white/5 border rounded-xl p-5 ${i === 3 ? 'border-amber-500/30' : 'border-white/10'}`}>
              <div className="flex items-start gap-4">
                <span className={`font-black ${i === 3 ? 'text-amber-400' : 'text-slate-500'}`}>{d.day}</span>
                <div><p className="text-sm text-white">{d.events}</p><p className={`text-xs mt-1 ${i === 3 ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>{d.tip}</p></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Practical Tips */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">What to Bring</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {["Sunscreen for daytime (UV is strong!)", "Light jacket for nighttime (drops to 18°C)", "Phone charger - your ticket is digital", "Camera with good low-light capability", "Comfortable shoes (lots of walking)", "Cash for food vendors (some don't take cards)", "Ear plugs or ear defenders (F1 = 130dB)", "Download the F1 app for live timing"].map((t, i) => (
              <p key={i} className="text-sm text-slate-400 flex items-start gap-2"><Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />{t}</p>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Experience the Night Race</h2>
          <p className="text-amber-100 mb-4">Bahrain GP tickets from €59 &bull; Cheapest F1 race in the world</p>
          <Link to="/f1-bahrain-grand-prix-tickets"><Button size="lg" className="bg-white text-amber-700 hover:bg-amber-50 font-bold px-8 rounded-full">Buy Bahrain GP Tickets</Button></Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-bold text-white mb-4">FAQ - Bahrain Night Race</h2>
        <FAQStructuredData faqs={faqs} />
        <div className="space-y-2">{faqs.map((f, i) => (
          <details key={i} className="group rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition">
            <summary className="p-4 font-bold text-sm text-white cursor-pointer list-none flex items-center justify-between">{f.question}<ChevronRight className="w-4 h-4 text-slate-500 group-open:rotate-90 transition-transform" /></summary>
            <p className="px-4 pb-4 text-slate-400 text-sm leading-relaxed">{f.answer}</p>
          </details>
        ))}</div>
      </section>

      {/* Cluster Links */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-lg font-bold text-white mb-4">More F1 Guides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link to="/f1-bahrain-grand-prix-tickets" className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-amber-500/30 transition-all"><p className="font-bold text-white text-sm">Buy Bahrain GP Tickets</p><p className="text-xs text-amber-400">From €59</p></Link>
          <Link to="/ultimate-f1-tickets-guide-2026" className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-amber-500/30 transition-all"><p className="font-bold text-white text-sm">Ultimate F1 Guide 2026</p><p className="text-xs text-slate-500">Every race compared</p></Link>
          <Link to="/monaco-gp-vip-experience" className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-amber-500/30 transition-all"><p className="font-bold text-white text-sm">Monaco GP VIP Guide</p><p className="text-xs text-slate-500">Yacht hospitality</p></Link>
          <Link to="/monza-best-seats-guide" className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-amber-500/30 transition-all"><p className="font-bold text-white text-sm">Monza Best Seats Guide</p><p className="text-xs text-slate-500">Every grandstand rated</p></Link>
        </div>
      </section>
    </div>
  );
};

export default BahrainNightRaceGuidePage;
