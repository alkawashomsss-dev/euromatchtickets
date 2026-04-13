import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trophy, Shield, Zap, Clock, Star, ChevronRight, Check, Users, Ticket, CreditCard } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
import axios from "axios";
import { API } from "../App";

const WorldCupLandingPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    fetchEvents();
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API}/events?event_type=match&limit=12`);
      const wcEvents = response.data.filter(e => 
        e.title?.toLowerCase().includes('world cup') || 
        e.league?.toLowerCase().includes('world cup')
      );
      setEvents(wcEvents.length > 0 ? wcEvents : response.data.slice(0, 6));
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeLeft = () => {
    const eventDate = new Date('2026-06-11');
    const now = new Date();
    const diff = eventDate - now;
    setTimeLeft({
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60)
    });
  };

  return (
    <div className="min-h-screen bg-[#0e0e14]">
      <SEOHead 
        title="FIFA World Cup 2026 Tickets | Buy Official Online"
        description="Get official FIFA World Cup 2026 tickets. Prices from €150. Instant QR delivery. 100% money-back guarantee. Over 50,000 tickets available."
      />

      {/* Hero Section */}
      <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&w=1920" 
            alt="World Cup Stadium"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-slate-950" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          {/* Trust Badge */}
          <div className="flex justify-center gap-3 mb-6">
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              FanProtect™ 100% Guarantee
            </Badge>
            <Badge className="bg-amber-500/10 text-amber-600 border-amber-200 px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              4.9/5 from 10,000+ Reviews
            </Badge>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">FIFA World Cup 2026</span>
            <br />
            <span className="text-white">Official Tickets</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 mb-8 max-w-3xl mx-auto">
            Book your tickets now for the World Cup in USA, Mexico & Canada
            <br />
            <span className="text-emerald-600 font-bold">Prices starting from €150!</span>
          </p>

          {/* Countdown Timer */}
          <div className="flex justify-center gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-none p-4 min-w-[80px]">
              <div className="text-3xl font-bold text-white">{timeLeft.days}</div>
              <div className="text-xs text-slate-500">Days</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-none p-4 min-w-[80px]">
              <div className="text-3xl font-bold text-white">{timeLeft.hours}</div>
              <div className="text-xs text-slate-500">Hours</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-none p-4 min-w-[80px]">
              <div className="text-3xl font-bold text-white">{timeLeft.minutes}</div>
              <div className="text-xs text-slate-500">Minutes</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/events?category=World Cup">
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-lg px-8 py-6">
                <Ticket className="w-5 h-5 mr-2" />
                Book Your Tickets Now
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/events?category=World Cup">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6">
                <Trophy className="w-5 h-5 mr-2" />
                View All Matches
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex justify-center gap-6 mt-8 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              Instant Delivery
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              Secure Payment
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              100% Guarantee
            </span>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-[#1e1e1e]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Buy from <span className="text-emerald-600">EuroMatchTickets</span>?
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-[#15151e] border border-white/10 rounded-none p-6 text-center">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-none flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="font-bold mb-2">100% Guarantee</h3>
              <p className="text-sm text-slate-500">Every ticket verified. Full refund if match cancelled.</p>
            </div>

            <div className="bg-[#15151e] border border-white/10 rounded-none p-6 text-center">
              <div className="w-14 h-14 bg-cyan-500/20 rounded-none flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="font-bold mb-2">Instant Delivery</h3>
              <p className="text-sm text-slate-500">QR Code to your email within minutes of purchase.</p>
            </div>

            <div className="bg-[#15151e] border border-white/10 rounded-none p-6 text-center">
              <div className="w-14 h-14 bg-amber-500/10 rounded-none flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="font-bold mb-2">Secure Payment</h3>
              <p className="text-sm text-slate-500">Stripe - the world's most secure payment gateway.</p>
            </div>

            <div className="bg-[#15151e] border border-white/10 rounded-none p-6 text-center">
              <div className="w-14 h-14 bg-violet-50 rounded-none flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-violet-600" />
              </div>
              <h3 className="font-bold mb-2">24/7 Support</h3>
              <p className="text-sm text-slate-500">Expert team available around the clock to help you.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">World Cup 2026 Ticket Prices</h2>
          <p className="text-slate-500 text-center mb-12">Save up to 25% compared to other sites</p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Group Stage */}
            <div className="bg-[#1e1e1e] border border-white/10 rounded-none p-6">
              <h3 className="text-xl font-bold mb-2">Group Stage</h3>
              <p className="text-slate-500 text-sm mb-4">48 Matches - June 2026</p>
              <div className="text-4xl font-bold text-emerald-600 mb-4">
                €150
                <span className="text-lg text-slate-400 line-through ml-2">€200</span>
              </div>
              <ul className="space-y-2 text-sm text-slate-500 mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> All group matches</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Multiple seat options</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Instant delivery</li>
              </ul>
              <Link to="/events?category=World Cup">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Book Now</Button>
              </Link>
            </div>

            {/* Knockout */}
            <div className="bg-gradient-to-b from-amber-900/20 to-slate-900 border-2 border-amber-500/50 rounded-none p-6 relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500/100 text-black">Most Popular</Badge>
              <h3 className="text-xl font-bold mb-2">Knockout Rounds</h3>
              <p className="text-slate-500 text-sm mb-4">Round of 16 + Quarter + Semi</p>
              <div className="text-4xl font-bold text-amber-600 mb-4">
                €400
                <span className="text-lg text-slate-400 line-through ml-2">€550</span>
              </div>
              <ul className="space-y-2 text-sm text-slate-500 mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-600" /> Round of 16 + Quarter Finals</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-600" /> Semi Finals</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-600" /> Best seats available</li>
              </ul>
              <Link to="/events?category=World Cup">
                <Button className="w-full bg-amber-500/100 hover:bg-amber-600 text-black">Book Now</Button>
              </Link>
            </div>

            {/* Final */}
            <div className="bg-[#1e1e1e] border border-white/10 rounded-none p-6">
              <h3 className="text-xl font-bold mb-2">Final - New York</h3>
              <p className="text-slate-500 text-sm mb-4">July 19, 2026</p>
              <div className="text-4xl font-bold text-violet-600 mb-4">
                €1,500
                <span className="text-lg text-slate-400 line-through ml-2">€2,000</span>
              </div>
              <ul className="space-y-2 text-sm text-slate-500 mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-600" /> MetLife Stadium</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-600" /> VIP seats available</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-600" /> Only 500 tickets left!</li>
              </ul>
              <Link to="/events?category=World Cup">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">Book Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="py-20 bg-[#1e1e1e]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#15151e] border border-white/10 rounded-none p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-600" />)}
              </div>
              <p className="text-slate-400 mb-4">"Booked World Cup 2022 tickets from EuroMatchTickets - excellent experience! Tickets arrived instantly."</p>
              <p className="text-sm text-slate-400">— James T. | UK</p>
            </div>

            <div className="bg-[#15151e] border border-white/10 rounded-none p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-600" />)}
              </div>
              <p className="text-slate-400 mb-4">"Best prices I found online. Saved over €200 compared to other websites!"</p>
              <p className="text-sm text-slate-400">— Maria S. | Germany</p>
            </div>

            <div className="bg-[#15151e] border border-white/10 rounded-none p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-600" />)}
              </div>
              <p className="text-slate-400 mb-4">"Customer support was amazing. They helped me choose the best seats for the match."</p>
              <p className="text-sm text-slate-400">— Alex K. | USA</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 border border-emerald-200 rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Don't Miss <span className="text-emerald-600">World Cup 2026!</span>
            </h2>
            <p className="text-xl text-slate-500 mb-8">
              Book your tickets now before they sell out. Prices starting from €150!
            </p>
            <Link to="/events?category=World Cup">
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-xl px-12 py-6">
                <Ticket className="w-6 h-6 mr-2" />
                Book Now - Save 25%
                <ChevronRight className="w-6 h-6 ml-2" />
              </Button>
            </Link>
            <p className="text-sm text-slate-400 mt-4">
              🛡️ FanProtect™ Guarantee | 🔒 100% Secure Payment
            </p>
          </div>
        </div>
      </div>

      {/* Schema Markup */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Event",
        "name": "FIFA World Cup 2026",
        "description": "FIFA World Cup 2026 tickets in USA, Mexico, and Canada",
        "image": "https://euromatchtickets.com/logo-192.png",
        "startDate": "2026-06-11",
        "endDate": "2026-07-19",
        "eventStatus": "https://schema.org/EventScheduled",
        "location": {
          "@type": "Place",
          "name": "Multiple Venues - USA, Mexico, Canada"
        },
        "offers": {
          "@type": "AggregateOffer",
          "lowPrice": "150",
          "highPrice": "2000",
          "priceCurrency": "EUR",
          "offerCount": "100",
          "availability": "https://schema.org/InStock",
          "url": "https://euromatchtickets.com/world-cup-2026-tickets",
          "validFrom": "2025-01-01"
        },
        "organizer": {
          "@type": "Organization",
          "name": "EuroMatchTickets",
          "url": "https://euromatchtickets.com"
        },
        "performer": {
          "@type": "Organization",
          "name": "FIFA World Cup 2026"
        }
      })}} />
    </div>
  );
};

export default WorldCupLandingPage;
