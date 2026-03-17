import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, Shield, Zap, Trophy, Ticket, Star } from "lucide-react";
import { Button } from "../components/ui/button";
import SEOHead from "../components/SEOHead";
import axios from "axios";
import { API } from "../App";

const ElClasicoTicketsPage = () => {
  const navigate = useNavigate();
  const [seatsLeft, setSeatsLeft] = useState(31);
  const [viewersNow, setViewersNow] = useState(89);

  useEffect(() => {
    // Simulate live viewers
    const interval = setInterval(() => {
      setViewersNow(prev => Math.max(50, prev + Math.floor(Math.random() * 5) - 2));
    }, 4000);

    // Track Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_name: 'El Clasico Tickets',
        content_category: 'Football',
        content_type: 'ticket'
      });
    }

    return () => clearInterval(interval);
  }, []);

  const ticketCategories = [
    { name: "Category 4 (Upper Tier)", price: 280, originalPrice: 350, seats: 12, popular: false },
    { name: "Category 3 (Mid Upper)", price: 450, originalPrice: 550, seats: 8, popular: false },
    { name: "Category 2 (Lower Tier)", price: 750, originalPrice: 890, seats: 6, popular: true },
    { name: "Category 1 (Pitch Level)", price: 1200, originalPrice: 1400, seats: 4, popular: true },
    { name: "VIP Hospitality", price: 2500, originalPrice: 3000, seats: 2, popular: false },
  ];

  return (
    <>
      <SEOHead
        title="El Clasico Tickets 2026 | Real Madrid vs Barcelona | Buy Now"
        description="Buy El Clasico tickets - Real Madrid vs Barcelona. Category 1-4, VIP Hospitality available. Santiago Bernabeu & Camp Nou. Secure booking, instant delivery!"
        keywords="El Clasico tickets, Real Madrid vs Barcelona tickets, buy El Clasico, La Liga tickets, Bernabeu tickets, Camp Nou tickets, El Clasico 2026"
        canonicalUrl="https://euromatchtickets.com/el-clasico-tickets"
      />

      <div className="min-h-screen bg-[hsl(210,20%,98%)]">
        {/* Hero Section */}
        <div className="relative h-[70vh] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1600')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
          
          <div className="relative z-10 h-full flex flex-col justify-end pb-12 px-4 md:px-8 max-w-[1440px] mx-auto">
            {/* Live Badge */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2 bg-red-50 border border-red-500/50 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-600 text-sm font-medium">{viewersNow} people viewing now</span>
              </div>
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-500/50 px-3 py-1.5 rounded-full">
                <Zap className="w-4 h-4 text-amber-600" />
                <span className="text-amber-600 text-sm font-bold">Only {seatsLeft} tickets left!</span>
              </div>
            </div>

            {/* Team Logos */}
            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-white rounded-full p-2 flex items-center justify-center">
                  <span className="text-3xl">⚪</span>
                </div>
                <span className="text-2xl font-bold">Real Madrid</span>
              </div>
              <span className="text-3xl font-bold text-amber-600">VS</span>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-white rounded-full p-2 flex items-center justify-center">
                  <span className="text-3xl">🔵🔴</span>
                </div>
                <span className="text-2xl font-bold">FC Barcelona</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                EL CLASICO
              </span>
              <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                LA LIGA
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
              El Clasico 2026
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-6 max-w-2xl">
              The greatest rivalry in world football. Real Madrid vs Barcelona.
            </p>

            <div className="flex flex-wrap items-center gap-6 text-slate-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-600" />
                <span className="font-semibold">March & October 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-600" />
                <span>Santiago Bernabeu / Camp Nou</span>
              </div>
            </div>
          </div>
        </div>

        {/* Urgency Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 py-4">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="flex items-center justify-center gap-4 text-white">
              <Trophy className="w-6 h-6" />
              <span className="text-lg md:text-xl font-bold">
                ⚽ El Clasico tickets sell out within HOURS - Don't miss out!
              </span>
              <Trophy className="w-6 h-6" />
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
                  className={`p-6 rounded-2xl border transition-all hover:border-cyan-500/50 ${
                    cat.popular 
                      ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-violet-200' 
                      : 'bg-white border-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">{cat.name}</h3>
                        {cat.popular && (
                          <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                            HOT
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
                        onClick={() => navigate('/events?type=match')}
                        className="mt-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6"
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
              <div className="bg-white border border-slate-100 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  FanProtect Guarantee
                </h3>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span>
                    100% Verified Tickets
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
              <div className="bg-white border border-slate-100 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4">Recent Purchases</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">A</div>
                    <div>
                      <p className="text-white">Ahmed from UAE</p>
                      <p className="text-slate-400">bought 4x Category 1 - 2 min ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">L</div>
                    <div>
                      <p className="text-white">Luis from Spain</p>
                      <p className="text-slate-400">bought 2x VIP Hospitality - 5 min ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">T</div>
                    <div>
                      <p className="text-white">Thomas from Germany</p>
                      <p className="text-slate-400">bought 2x Category 2 - 12 min ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Star Players */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-600" />
                  Star Players
                </h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <p><strong>Real Madrid:</strong> Bellingham, Vinicius Jr, Mbappé</p>
                  <p><strong>Barcelona:</strong> Yamal, Pedri, Lewandowski</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Content */}
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12 border-t border-slate-100">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-3xl font-bold mb-6">Buy El Clasico Tickets 2026</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              El Clasico is more than a football match - it's the biggest club rivalry in the world. 
              Watch Real Madrid face FC Barcelona at the iconic Santiago Bernabeu or Camp Nou. 
              Experience the passion, the drama, and the unforgettable atmosphere.
            </p>
            <h3 className="text-2xl font-bold mb-4">El Clasico 2026 Schedule</h3>
            <ul className="text-slate-600 space-y-2 mb-6">
              <li>⚽ La Liga: March 2026 (Camp Nou) & October 2026 (Bernabeu)</li>
              <li>⚽ Potential Champions League encounters</li>
              <li>⚽ Spanish Super Cup possibilities</li>
            </ul>
            <h3 className="text-2xl font-bold mb-4">Why Buy from EuroMatchTickets?</h3>
            <p className="text-slate-600 leading-relaxed">
              El Clasico tickets sell out extremely fast. Our verified marketplace ensures you get 
              authentic tickets with full buyer protection. Book early to secure the best seats!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ElClasicoTicketsPage;
