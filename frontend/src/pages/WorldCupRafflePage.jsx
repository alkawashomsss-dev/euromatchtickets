import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Trophy, Plane, Hotel, Users, Calendar, MapPin, 
  Star, Shield, Check, Ticket, Gift, Sparkles, Timer,
  ArrowRight, Zap, Crown
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";

const WorldCupRafflePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "FIFA World Cup 2026 VIP Raffle - Win Trip for 2",
    "description": "Enter the raffle for a chance to win an all-inclusive FIFA World Cup 2026 trip for 2 people. 7 nights hotel + match tickets included.",
    "startDate": "2026-02-24",
    "endDate": "2026-05-01",
    "eventStatus": "https://schema.org/EventScheduled",
    "offers": {
      "@type": "Offer",
      "price": "100",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock"
    }
  };

  const handleBuyEntry = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/raffle/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          raffle_type: 'world_cup_2026',
          price: 100,
          entries: 1
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.checkout_url) {
          window.location.href = data.checkout_url;
        }
      } else {
        alert('Please sign in to enter the raffle');
        navigate('/events');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const prizes = [
    { icon: Plane, title: "Round-trip Flights", desc: "From any European city to USA/Mexico/Canada" },
    { icon: Hotel, title: "7 Nights Hotel", desc: "4-star hotel near the stadium" },
    { icon: Ticket, title: "2 Match Tickets", desc: "Category 1 seats for 2 people" },
    { icon: Users, title: "For 2 People", desc: "Bring your friend or partner" },
  ];

  const howItWorks = [
    { step: 1, title: "Buy Entry", desc: "Purchase your raffle entry for €100" },
    { step: 2, title: "Get Confirmation", desc: "Receive your unique entry number" },
    { step: 3, title: "Wait for Draw", desc: "Live draw on May 1st, 2026" },
    { step: 4, title: "Win & Travel", desc: "Winner gets the complete package!" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <SEOHead 
        title="Win FIFA World Cup 2026 Trip - VIP Raffle €100 Entry"
        description="Enter our World Cup 2026 raffle for just €100! Win an all-inclusive trip for 2: flights, 7 nights hotel, and match tickets. Limited entries available."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/30 via-amber-500/20 to-zinc-950" />
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1920')] opacity-20 bg-cover bg-center" />
        
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 px-4 py-2 text-sm animate-pulse">
              <Trophy className="w-4 h-4 mr-2" />
              OFFICIAL RAFFLE
            </Badge>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 px-4 py-2 text-sm">
              <Timer className="w-4 h-4 mr-2" />
              LIMITED ENTRIES
            </Badge>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="text-yellow-400">WIN</span> a Trip to
            <span className="block mt-2 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
              FIFA World Cup 2026
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-zinc-300 max-w-3xl mx-auto mb-8">
            Enter for just <span className="text-yellow-400 font-bold">€100</span> and win an all-inclusive trip for 
            <span className="text-yellow-400 font-bold"> 2 people</span>!
          </p>

          {/* Prize Value */}
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-2xl px-8 py-4 mb-8">
            <Gift className="w-8 h-8 text-yellow-400" />
            <div className="text-left">
              <p className="text-sm text-zinc-400">Total Prize Value</p>
              <p className="text-3xl font-bold text-yellow-400">€5,000+</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col items-center gap-4">
            <Button 
              onClick={handleBuyEntry}
              disabled={loading}
              className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-bold text-xl px-12 py-8 rounded-2xl shadow-2xl shadow-yellow-500/30 transform hover:scale-105 transition-all"
              data-testid="buy-raffle-entry-btn"
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  <Crown className="w-6 h-6 mr-3" />
                  Enter Raffle - €100
                  <ArrowRight className="w-6 h-6 ml-3" />
                </>
              )}
            </Button>
            <p className="text-sm text-zinc-500">Secure payment via Stripe</p>
          </div>
        </div>
      </section>

      {/* What You Win */}
      <section className="py-20 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              THE PRIZE
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What You Could Win</h2>
            <p className="text-zinc-400 text-lg">An unforgettable World Cup experience for 2</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {prizes.map((prize, idx) => (
              <div 
                key={idx}
                className="bg-zinc-900/80 border border-yellow-500/20 rounded-2xl p-6 text-center hover:border-yellow-500/50 transition-all hover:transform hover:scale-105"
              >
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <prize.icon className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">{prize.title}</h3>
                <p className="text-zinc-400">{prize.desc}</p>
              </div>
            ))}
          </div>

          {/* Package Details */}
          <div className="mt-12 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-3xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Complete Package Includes:</h3>
            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {[
                "Round-trip flights from any European city",
                "7 nights in a 4-star hotel",
                "2 Category 1 match tickets",
                "Airport transfers included",
                "Travel insurance coverage",
                "24/7 support during your trip",
                "Local guide assistance",
                "€500 spending money"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-black" />
                  </div>
                  <span className="text-zinc-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-zinc-400 text-lg">Simple steps to enter the raffle</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {howItWorks.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 text-center h-full">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-black font-bold text-xl">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-zinc-400 text-sm">{step.desc}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-yellow-500/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Draw Date */}
      <section className="py-16 bg-gradient-to-r from-yellow-500/10 to-amber-500/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Calendar className="w-10 h-10 text-yellow-400" />
            <div className="text-left">
              <p className="text-sm text-zinc-400">Live Draw Date</p>
              <p className="text-3xl font-bold text-yellow-400">May 1st, 2026</p>
            </div>
          </div>
          <p className="text-zinc-400 mb-8">
            Winner will be announced live on our social media channels. 
            All participants will be notified via email.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-6 py-4">
              <p className="text-3xl font-bold text-white">500</p>
              <p className="text-sm text-zinc-400">Max Entries</p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-6 py-4">
              <p className="text-3xl font-bold text-yellow-400">1:500</p>
              <p className="text-sm text-zinc-400">Win Odds</p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-6 py-4">
              <p className="text-3xl font-bold text-green-400">€100</p>
              <p className="text-sm text-zinc-400">Entry Price</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <Shield className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="font-bold mb-2">100% Secure</h3>
              <p className="text-sm text-zinc-400">Stripe secure payments</p>
            </div>
            <div className="flex flex-col items-center">
              <Star className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="font-bold mb-2">Guaranteed Prize</h3>
              <p className="text-sm text-zinc-400">Winner will be selected</p>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="font-bold mb-2">Instant Entry</h3>
              <p className="text-sm text-zinc-400">Confirmation within seconds</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-t from-yellow-500/20 to-transparent">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Don't Miss Your Chance!
          </h2>
          <p className="text-xl text-zinc-400 mb-8">
            Limited to 500 entries only. Enter now for your chance to experience the World Cup 2026!
          </p>
          <Button 
            onClick={handleBuyEntry}
            disabled={loading}
            className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-bold text-xl px-12 py-8 rounded-2xl shadow-2xl shadow-yellow-500/30"
            data-testid="buy-raffle-entry-btn-bottom"
          >
            <Trophy className="w-6 h-6 mr-3" />
            Enter Raffle Now - €100
          </Button>
          
          <p className="mt-6 text-sm text-zinc-500">
            By entering, you agree to our <Link to="/terms" className="text-yellow-400 hover:underline">Terms & Conditions</Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default WorldCupRafflePage;
