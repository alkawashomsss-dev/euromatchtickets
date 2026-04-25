import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Flag, Shield, Zap, Star, ChevronRight, Check, MapPin, Ticket } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
import BreadcrumbSchema from "../components/BreadcrumbSchema";

const F1LandingPage = () => {
  // F1 2026 Calendar
  const f1Races = [
    { name: "Bahrain GP", city: "Sakhir", date: "March 1", price: 150, image: "https://images.pexels.com/photos/12801/pexels-photo-12801.jpeg?auto=compress&w=400" },
    { name: "Monaco GP", city: "Monte Carlo", date: "May 24", price: 350, image: "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&w=400", hot: true },
    { name: "British GP", city: "Silverstone", date: "July 5", price: 180, image: "https://images.pexels.com/photos/3800517/pexels-photo-3800517.jpeg?auto=compress&w=400" },
    { name: "Singapore GP", city: "Marina Bay", date: "Sept 20", price: 250, image: "https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg?auto=compress&w=400", hot: true },
    { name: "Las Vegas GP", city: "Las Vegas", date: "Nov 21", price: 300, image: "https://images.pexels.com/photos/415999/pexels-photo-415999.jpeg?auto=compress&w=400", hot: true },
    { name: "Abu Dhabi GP", city: "Yas Marina", date: "Dec 6", price: 220, image: "https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg?auto=compress&w=400" }
  ];

  return (
    <div className="min-h-screen bg-[#0e0e14]">
      <SEOHead 
        title="F1 Tickets 2026 | Buy Formula 1 Tickets Online"
        description="Buy F1 tickets 2026 season. F1 calendar 2026: Monaco, Silverstone, Bahrain, Abu Dhabi & more. From €120. F1 schedule 2026 with instant delivery + guarantee."
        canonicalUrl="https://euromatchtickets.com/f1-tickets-2026"
        image="https://images.unsplash.com/photo-1504707748692-419802cf939d?w=1200&h=630&fit=crop"
      />


      <BreadcrumbSchema items={[{ name: "Home", url: "https://euromatchtickets.com/" }, { name: "F1 Tickets 2026", url: "https://euromatchtickets.com/f1-tickets" }]} />

      {/* Hero Section */}
      <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/12801/pexels-photo-12801.jpeg?auto=compress&w=1920" 
            alt="F1 Racing"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-slate-950" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-3 mb-6">
            <Badge className="bg-[#e10600]/10 text-red-600 border-red-200 px-4 py-2">
              <Flag className="w-4 h-4 mr-2" />
              2026 Full Season
            </Badge>
            <Badge className="bg-amber-500/10 text-amber-600 border-amber-200 px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              24 Races Available
            </Badge>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">Formula 1</span>
            <span className="text-white"> Tickets 2026</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 mb-8 max-w-3xl mx-auto">
            Attend the world's greatest races - Monaco, Silverstone, Las Vegas & more!
            <br />
            <span className="text-red-600 font-bold">Prices starting from €120!</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/events?category=F1">
              <Button size="lg" className="bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-lg px-8 py-6">
                <Ticket className="w-5 h-5 mr-2" />
                Browse All Races
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="flex justify-center gap-6 mt-8 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-red-600" />
              QR delivery
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-red-600" />
              VIP Hospitality
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-red-600" />
              Buyer protection
            </span>
          </div>
        </div>
      </div>

      {/* Races Grid */}
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">F1 2026 Race Calendar</h2>
          <p className="text-slate-500 text-center mb-12">Choose your race and book now</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {f1Races.map((race, idx) => (
              <Link 
                key={idx}
                to="/events?category=F1"
                className="group relative bg-[#1e1e1e] border border-white/10 rounded-none overflow-hidden hover:border-red-500/50 transition-all"
              >
                {race.hot && (
                  <Badge className="absolute top-3 right-3 z-10 bg-[#e10600]/100 text-white">Hot!</Badge>
                )}
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={race.image} 
                    alt={race.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <Badge className="bg-black/60 text-white">
                      <MapPin className="w-3 h-3 mr-1" />
                      {race.city}
                    </Badge>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-red-600 transition-colors">
                    {race.name}
                  </h3>
                  <p className="text-slate-500 text-sm mb-3">{race.date}, 2026</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-red-600">€{race.price}</span>
                      <span className="text-sm text-slate-400 ml-2">from</span>
                    </div>
                    <Button size="sm" variant="outline" className="border-red-500/50 text-red-600 hover:bg-[#e10600]/10">
                      Book Now
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="py-20 bg-[#1e1e1e]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Ticket Categories</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#15151e] border border-white/10 rounded-none p-6">
              <h3 className="text-xl font-bold mb-2 text-slate-400">General Admission</h3>
              <div className="text-3xl font-bold text-emerald-600 mb-4">From €120</div>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Track access</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Multiple zones</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Amazing atmosphere</li>
              </ul>
            </div>

            <div className="bg-gradient-to-b from-amber-900/20 to-zinc-800/50 border-2 border-amber-500/50 rounded-none p-6">
              <Badge className="bg-amber-500/100 text-black mb-2">Most Popular</Badge>
              <h3 className="text-xl font-bold mb-2 text-white">Grandstand</h3>
              <div className="text-3xl font-bold text-amber-600 mb-4">From €250</div>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-600" /> Reserved seat</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-600" /> Excellent view</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-600" /> Big screens</li>
              </ul>
            </div>

            <div className="bg-[#15151e] border border-white/10 rounded-none p-6">
              <h3 className="text-xl font-bold mb-2 text-slate-400">VIP Hospitality</h3>
              <div className="text-3xl font-bold text-violet-600 mb-4">From €800</div>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-600" /> Paddock access</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-600" /> Food & drinks</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-600" /> Driver meet & greet</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose <span className="text-red-600">EuroMatchTickets</span>?
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#e10600]/10 rounded-none flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-bold mb-2">Verified</h3>
              <p className="text-sm text-slate-500">Every ticket authenticated and guaranteed</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500/10 rounded-none flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="font-bold mb-2">QR delivery</h3>
              <p className="text-sm text-slate-500">QR code to your email in minutes</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-none flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="font-bold mb-2">Best Prices</h3>
              <p className="text-sm text-slate-500">Save 25% vs other ticket sites</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-violet-50 rounded-none flex items-center justify-center mx-auto mb-4">
                <Flag className="w-8 h-8 text-violet-600" />
              </div>
              <h3 className="font-bold mb-2">All 24 Races</h3>
              <p className="text-sm text-slate-500">Full 2026 calendar available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 bg-[#1e1e1e]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-red-900/30 to-amber-900/30 border border-red-200 rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Book <span className="text-red-600">F1 2026</span> Tickets Now!
            </h2>
            <p className="text-xl text-slate-500 mb-8">
              Monaco, Las Vegas, Abu Dhabi & more - All races available
            </p>
            <Link to="/events?category=F1">
              <Button size="lg" className="bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-xl px-12 py-6">
                <Ticket className="w-6 h-6 mr-2" />
                Browse All Races
                <ChevronRight className="w-6 h-6 ml-2" />
              </Button>
            </Link>
            <p className="text-sm text-slate-400 mt-4">
              🛡️ Buyer protection™ Guarantee | 🔒 Secure Payment | ⚡ QR delivery
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default F1LandingPage;
