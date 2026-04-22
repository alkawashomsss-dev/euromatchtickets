import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Clock, Users, Shield, Zap, Trophy, Star, ChevronRight, Ticket } from "lucide-react";
import { Button } from "../components/ui/button";
import SEOHead from "../components/SEOHead";
import ProductSchema from "../components/ProductSchema";
import BreadcrumbSchema from "../components/BreadcrumbSchema";
import axios from "axios";
import { API } from "../App";

const MonacoGPTicketsPage = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [seatsLeft, setSeatsLeft] = useState(23);
  const [viewersNow, setViewersNow] = useState(47);

  useEffect(() => {
    // Fetch Monaco GP tickets
    const fetchTickets = async () => {
      try {
        const response = await axios.get(`${API}/events?event_type=f1`);
        const monacoEvents = response.data.filter(e => 
          e.title.toLowerCase().includes('monaco')
        );
        if (monacoEvents.length > 0) {
          setTickets(monacoEvents);
          setSeatsLeft(monacoEvents[0]?.available_tickets || 23);
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };
    fetchTickets();

    // Simulate live viewers
    const interval = setInterval(() => {
      setViewersNow(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 5000);

    // Track Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_name: 'Monaco Grand Prix 2026 Tickets',
        content_category: 'F1',
        content_type: 'ticket'
      });
    }

    return () => clearInterval(interval);
  }, []);

  const ticketCategories = [
    { name: "General Admission", price: 450, originalPrice: 520, seats: 15, popular: false },
    { name: "Grandstand K", price: 890, originalPrice: 1050, seats: 8, popular: true },
    { name: "Grandstand T", price: 1250, originalPrice: 1450, seats: 6, popular: false },
    { name: "VIP Hospitality", price: 2400, originalPrice: 2800, seats: 4, popular: true },
    { name: "Paddock Club", price: 4500, originalPrice: 5200, seats: 2, popular: false },
  ];

  return (
    <>
      <SEOHead
        title="Monaco GP 2026 Tickets | Buy F1 Monaco Tickets"
        description="Buy Monaco Grand Prix 2026 tickets. Grandstand, VIP Hospitality & Paddock Club available. Secure booking, instant delivery. Limited availability - Book now!"
        image="https://static.prod-images.emergentagent.com/jobs/775fd9a1-fbbf-459e-af56-55fb2499685c/images/1ad01909b1565e2be44a7b26803868d06378b04d70810a060231d8ef9d1b0c17.png"
      />

      <ProductSchema name="Monaco Grand Prix 2026" price={249} highPrice={8999} url="https://euromatchtickets.com/f1-monaco-grand-prix-tickets" category="f1" venue="Circuit de Monaco" city="Monte Carlo" />
      <BreadcrumbSchema items={[{ name: "Home", url: "https://euromatchtickets.com/" }, { name: "F1 Tickets", url: "https://euromatchtickets.com/f1-tickets" }, { name: "Monaco GP 2026", url: "https://euromatchtickets.com/f1-monaco-grand-prix-tickets" }]} />

      <div className="min-h-screen bg-[#0e0e14]">
        {/* Hero Section */}
        <div className="relative h-[70vh] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://static.prod-images.emergentagent.com/jobs/775fd9a1-fbbf-459e-af56-55fb2499685c/images/1ad01909b1565e2be44a7b26803868d06378b04d70810a060231d8ef9d1b0c17.png')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
          
          <div className="relative z-10 h-full flex flex-col justify-end pb-12 px-4 md:px-8 max-w-[1440px] mx-auto">
            {/* Live Badge */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2 bg-[#e10600]/10 border border-red-500/50 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 bg-[#e10600]/100 rounded-full animate-pulse" />
                <span className="text-red-600 text-sm font-medium">{viewersNow} people viewing now</span>
              </div>
              <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/50 px-3 py-1.5 rounded-full">
                <Zap className="w-4 h-4 text-amber-600" />
                <span className="text-amber-600 text-sm font-bold">Only {seatsLeft} tickets left!</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-4xl">🇲🇨</span>
              <span className="bg-[#e10600]/100 text-white px-3 py-1 rounded-full text-sm font-bold">FORMULA 1</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
              Monaco Grand Prix 2026
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 mb-6 max-w-2xl">
              The most prestigious race in Formula 1. Monte Carlo street circuit.
            </p>

            <div className="flex flex-wrap items-center gap-6 text-slate-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-600" />
                <span className="font-semibold">June 5-7, 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-600" />
                <span>Circuit de Monaco, Monte Carlo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Urgency Banner */}
        <div className="bg-gradient-to-r from-red-600 to-orange-500 py-4">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="flex items-center justify-center gap-4 text-white">
              <Zap className="w-6 h-6 animate-pulse" />
              <span className="text-lg md:text-xl font-bold">
                🔥 SELLING FAST - Only {seatsLeft} tickets remaining for Monaco GP 2026!
              </span>
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Tickets Section */}
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Ticket List */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Ticket className="w-6 h-6 text-cyan-600" />
                Available Tickets
              </h2>

              {ticketCategories.map((cat, idx) => (
                <div 
                  key={idx}
                  className={`p-6 rounded-none border transition-all hover:border-cyan-500/50 ${
                    cat.popular 
                      ? 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30' 
                      : 'bg-[#1e1e1e] border-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">{cat.name}</h3>
                        {cat.popular && (
                          <span className="bg-cyan-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                            POPULAR
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1 text-amber-600">
                          <Users className="w-4 h-4" />
                          Only {cat.seats} left
                        </span>
                        <span className="flex items-center gap-1 text-emerald-600">
                          <Shield className="w-4 h-4" />
                          Verified
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-400 line-through">€{cat.originalPrice}</div>
                      <div className="text-3xl font-bold text-white">€{cat.price}</div>
                      <Button 
                        onClick={() => navigate('/f1-tickets')}
                        className="mt-2 btn-accent px-6"
                      >
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Trust Box */}
              <div className="bg-[#1e1e1e] border border-white/5 rounded-none p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  Buyer protection
                </h3>
                <ul className="space-y-3 text-sm text-slate-400">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span>
                    Verified Tickets
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span>
                    Secure Payment
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span>
                    Instant Digital Delivery
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span>
                    Full Refund if Cancelled
                  </li>
                </ul>
              </div>

              {/* Recent Sales */}
              <div className="bg-[#1e1e1e] border border-white/5 rounded-none p-6">
                <h3 className="text-lg font-bold mb-4">Recent Purchases</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500/100 rounded-full flex items-center justify-center text-white font-bold">J</div>
                    <div>
                      <p className="text-white">James from UK</p>
                      <p className="text-slate-400">bought 2x Grandstand K - 3 min ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500/100 rounded-full flex items-center justify-center text-white font-bold">M</div>
                    <div>
                      <p className="text-white">Michael from Germany</p>
                      <p className="text-slate-400">bought 4x VIP Hospitality - 8 min ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500/100 rounded-full flex items-center justify-center text-white font-bold">S</div>
                    <div>
                      <p className="text-white">Sophie from Netherlands</p>
                      <p className="text-slate-400">bought 2x Paddock Club - 15 min ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Info */}
              <div className="bg-[#1e1e1e] border border-white/5 rounded-none p-6">
                <h3 className="text-lg font-bold mb-4">Event Information</h3>
                <div className="space-y-3 text-sm text-slate-400">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Date</span>
                    <span>June 5-7, 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Location</span>
                    <span>Monte Carlo, Monaco</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Circuit</span>
                    <span>Street Circuit</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Race Length</span>
                    <span>78 Laps</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Content */}
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12 border-t border-white/5">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-3xl font-bold mb-6">Buy Monaco Grand Prix 2026 Tickets</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-6">
              The Monaco Grand Prix is the crown jewel of Formula 1 racing. Experience the thrill of watching 
              the world's best drivers navigate the legendary streets of Monte Carlo. From the famous Casino 
              Square to the iconic tunnel section, Monaco delivers unmatched excitement.
            </p>
            <h3 className="text-2xl font-bold mb-4">Why Buy Monaco F1 Tickets from EuroMatchTickets?</h3>
            <ul className="text-slate-400 space-y-2 mb-6">
              <li>✓ Verified-seller listings with Buyer protection</li>
              <li>✓ Best prices for Grandstand, VIP & Paddock Club</li>
              <li>✓ Instant digital delivery to your email</li>
              <li>✓ Secure payment with full buyer protection</li>
              <li>✓ 24/7 customer support</li>
            </ul>
            <h3 className="text-2xl font-bold mb-4">Monaco Grand Prix 2026 Ticket Prices</h3>
            <p className="text-slate-400 leading-relaxed">
              Monaco GP tickets range from €450 for General Admission to €4,500+ for exclusive Paddock Club 
              access. Grandstand tickets offer excellent views of the action, while VIP Hospitality packages 
              include premium catering and exclusive viewing areas.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MonacoGPTicketsPage;
