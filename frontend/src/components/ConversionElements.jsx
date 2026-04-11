import { Shield, Star, Globe, Zap, AlertCircle, Users, TrendingUp } from 'lucide-react';

export const ScarcityBadges = ({ ticketsLeft = 847, viewers = 312, priceIncrease = "12%" }) => (
  <div className="flex flex-wrap justify-center gap-3 my-4">
    <span className="inline-flex items-center gap-1.5 bg-red-500/15 border border-red-500/25 rounded-full px-3 py-1.5 text-red-400 text-sm font-medium animate-pulse" data-testid="scarcity-tickets">
      <AlertCircle className="w-3.5 h-3.5" /> Only {ticketsLeft} tickets left
    </span>
    <span className="inline-flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/25 rounded-full px-3 py-1.5 text-amber-400 text-sm font-medium" data-testid="scarcity-viewers">
      <Users className="w-3.5 h-3.5" /> {viewers} people viewing now
    </span>
    <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/25 rounded-full px-3 py-1.5 text-emerald-400 text-sm font-medium" data-testid="scarcity-price">
      <TrendingUp className="w-3.5 h-3.5" /> Prices up {priceIncrease} this week
    </span>
  </div>
);

export const ScarcityBadgesLight = ({ ticketsLeft = 847, viewers = 312, priceIncrease = "12%" }) => (
  <div className="flex flex-wrap justify-center gap-3 my-4">
    <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-full px-3 py-1.5 text-red-600 text-sm font-medium animate-pulse" data-testid="scarcity-tickets">
      <AlertCircle className="w-3.5 h-3.5" /> Only {ticketsLeft} tickets left
    </span>
    <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5 text-amber-600 text-sm font-medium" data-testid="scarcity-viewers">
      <Users className="w-3.5 h-3.5" /> {viewers} people viewing now
    </span>
    <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5 text-emerald-600 text-sm font-medium" data-testid="scarcity-price">
      <TrendingUp className="w-3.5 h-3.5" /> Prices up {priceIncrease} this week
    </span>
  </div>
);

export const TrustBar = () => (
  <section className="py-5 border-y border-white/10 bg-[#1e1e1e]" data-testid="trust-bar">
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex flex-wrap justify-center gap-8 text-sm">
        <div className="flex items-center gap-2 text-emerald-600"><Shield className="w-4 h-4" /><span className="font-medium">500,000+ Tickets Sold</span></div>
        <div className="flex items-center gap-2 text-amber-600"><Star className="w-4 h-4" /><span className="font-medium">4.9/5 from 12,000+ Reviews</span></div>
        <div className="flex items-center gap-2 text-blue-600"><Globe className="w-4 h-4" /><span className="font-medium">Trusted in 25+ Countries</span></div>
        <div className="flex items-center gap-2 text-emerald-600"><Zap className="w-4 h-4" /><span className="font-medium">100% Money Back Guarantee</span></div>
      </div>
    </div>
  </section>
);

export const CompetitorLine = ({ className = "text-emerald-400 text-sm font-medium" }) => (
  <p className={className} data-testid="competitor-line">Up to 40% cheaper than Viagogo &amp; StubHub</p>
);
