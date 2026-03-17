import { useState, useEffect, useCallback } from 'react';
import { X, Clock, Users, Flame, Zap, MessageCircle, ShoppingCart, AlertTriangle, TrendingDown, Gift, Timer, Eye, Star, BadgePercent, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

// ============== URGENCY COUNTDOWN TIMER ==============
export const UrgencyCountdown = ({ endTime, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const difference = end - now;

      if (difference <= 0) {
        onExpire?.();
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [endTime, onExpire]);

  return (
    <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-xl px-4 py-2">
      <Clock className="w-5 h-5 text-red-400 animate-pulse" />
      <span className="text-red-400 font-bold">
        {String(timeLeft.hours).padStart(2, '0')}:
        {String(timeLeft.minutes).padStart(2, '0')}:
        {String(timeLeft.seconds).padStart(2, '0')}
      </span>
      <span className="text-red-300 text-sm">left at this price!</span>
    </div>
  );
};

// ============== SCARCITY INDICATOR ==============
export const ScarcityIndicator = ({ ticketsLeft = 5, totalTickets = 100 }) => {
  const percentage = (ticketsLeft / totalTickets) * 100;
  const isLow = ticketsLeft <= 10;
  const isCritical = ticketsLeft <= 3;

  return (
    <div className={`rounded-xl p-3 ${isCritical ? 'bg-red-500/20 border border-red-500/40' : isLow ? 'bg-orange-500/20 border border-orange-500/30' : 'bg-zinc-800/50 border border-zinc-700'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isCritical ? (
            <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
          ) : (
            <Flame className="w-5 h-5 text-orange-400" />
          )}
          <span className={`font-bold ${isCritical ? 'text-red-400' : isLow ? 'text-orange-400' : 'text-zinc-300'}`}>
            {isCritical ? 'Almost Sold Out!' : isLow ? 'Selling Fast!' : 'Available'}
          </span>
        </div>
        <Badge className={`${isCritical ? 'bg-red-500' : isLow ? 'bg-orange-500' : 'bg-emerald-500'} text-white`}>
          {ticketsLeft} left
        </Badge>
      </div>
      <div className="w-full bg-zinc-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all ${isCritical ? 'bg-red-500' : isLow ? 'bg-orange-500' : 'bg-emerald-500'}`}
          style={{ width: `${100 - percentage}%` }}
        />
      </div>
    </div>
  );
};

// ============== LIVE VIEWERS ==============
export const LiveViewers = ({ eventId }) => {
  const [viewers, setViewers] = useState(0);

  useEffect(() => {
    // Simulate live viewers (in production, use WebSocket)
    const base = Math.floor(Math.random() * 20) + 10;
    setViewers(base);
    
    const interval = setInterval(() => {
      setViewers(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(5, prev + change);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [eventId]);

  return (
    <div className="flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-xl px-4 py-2">
      <div className="relative">
        <Eye className="w-5 h-5 text-purple-400" />
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
      </div>
      <span className="text-purple-300">
        <strong className="text-purple-400">{viewers}</strong> people viewing now
      </span>
    </div>
  );
};

// ============== PRICE COMPARISON ==============
export const PriceComparison = ({ ourPrice, competitorPrices }) => {
  const savings = competitorPrices.map(c => ({
    ...c,
    saving: c.price - ourPrice,
    savingPercent: Math.round(((c.price - ourPrice) / c.price) * 100)
  })).filter(c => c.saving > 0);

  if (savings.length === 0) return null;

  const maxSaving = Math.max(...savings.map(s => s.saving));

  return (
    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingDown className="w-5 h-5 text-emerald-400" />
        <span className="font-bold text-emerald-400">You Save Up To €{maxSaving}!</span>
      </div>
      <div className="space-y-2">
        {savings.slice(0, 3).map((comp, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">{comp.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 line-through">€{comp.price}</span>
              <Badge className="bg-emerald-500/20 text-emerald-400">-{comp.savingPercent}%</Badge>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-700">
          <span className="font-bold text-white">Our Price</span>
          <span className="text-2xl font-bold text-emerald-400">€{ourPrice}</span>
        </div>
      </div>
    </div>
  );
};

// ============== WHATSAPP DIRECT SALES ==============
export const WhatsAppButton = ({ eventTitle, price }) => {
  const message = encodeURIComponent(
    `Hi! I'm interested in buying tickets for ${eventTitle} (€${price}) from EuroMatchTickets.com. Can you help me?`
  );
  const whatsappUrl = `https://wa.me/491234567890?text=${message}`; // Replace with actual number

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
    >
      <MessageCircle className="w-5 h-5" />
      Buy via WhatsApp
    </a>
  );
};

// ============== FLASH SALE BANNER ==============
export const FlashSaleBanner = ({ discount = 20, endsAt }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endsAt).getTime();
      const difference = end - now;

      if (difference <= 0) return { hours: 0, minutes: 0, seconds: 0 };

      return {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [endsAt]);

  return (
    <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-4 mb-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-50" />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
            <Zap className="w-8 h-8 text-yellow-300" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">FLASH SALE!</h3>
            <p className="text-white/80">Save {discount}% on all tickets</p>
          </div>
        </div>
        <div className="text-center bg-white/20 rounded-xl px-6 py-3">
          <div className="text-3xl font-mono font-bold text-white">
            {String(timeLeft.hours).padStart(2, '0')}:
            {String(timeLeft.minutes).padStart(2, '0')}:
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <div className="text-xs text-white/70">ENDS IN</div>
        </div>
      </div>
    </div>
  );
};

// ============== RECENTLY BOUGHT POPUP ==============
export const RecentlyBoughtPopup = () => {
  const [show, setShow] = useState(false);
  const [purchase, setPurchase] = useState(null);
  const [usedIndices, setUsedIndices] = useState(new Set());

  const firstNames = [
    'Marco', 'Sofia', 'Liam', 'Emma', 'Noah', 'Mia', 'Alexander', 'Isabella',
    'Henrik', 'Chloe', 'Mateo', 'Aria', 'Felix', 'Luna', 'Oscar', 'Elena',
    'Hugo', 'Valentina', 'Leo', 'Amelia', 'Adrian', 'Nora', 'Julian', 'Hanna',
    'Rafael', 'Stella', 'Daniel', 'Leah', 'Tobias', 'Clara', 'Jan', 'Lina',
    'Finn', 'Zoe', 'Erik', 'Maya', 'Thomas', 'Alicia', 'Patrick', 'Sara',
    'Niklas', 'Julia', 'Maximilian', 'Anna', 'Sebastian', 'Laura', 'Lukas', 'Marie'
  ];

  const cities = [
    'London', 'Berlin', 'Munich', 'Paris', 'Madrid', 'Amsterdam', 'Rome',
    'Vienna', 'Stockholm', 'Copenhagen', 'Zurich', 'Brussels', 'Dublin',
    'Oslo', 'Helsinki', 'Prague', 'Warsaw', 'Lisbon', 'Barcelona', 'Milan',
    'Hamburg', 'Frankfurt', 'Dubai', 'Abu Dhabi', 'Doha', 'Istanbul'
  ];

  const events = [
    'Monaco GP', 'Silverstone GP', 'Monza GP', 'Singapore GP',
    'F1 Abu Dhabi', 'MotoGP Mugello', 'Isle of Man TT',
    'Champions League Final', 'El Clasico', 'World Cup 2026',
    'Coldplay Concert', 'The Weeknd Tour', 'Bruno Mars Live',
    'Bayern vs Dortmund', 'PSG vs Marseille', 'Liverpool vs Man City'
  ];

  const times = ['just now', '1 min ago', '2 min ago', '3 min ago', '5 min ago', '8 min ago'];

  useEffect(() => {
    let timeout;
    const showPurchase = () => {
      // Pick unique combo
      let idx;
      do {
        idx = Math.floor(Math.random() * firstNames.length);
      } while (usedIndices.has(idx) && usedIndices.size < firstNames.length);

      setUsedIndices(prev => {
        const next = new Set(prev);
        next.add(idx);
        if (next.size >= firstNames.length - 5) next.clear();
        return next;
      });

      const name = firstNames[idx];
      const initial = name.charAt(0);
      const city = cities[Math.floor(Math.random() * cities.length)];
      const event = events[Math.floor(Math.random() * events.length)];
      const tickets = Math.random() > 0.5 ? 2 : Math.random() > 0.5 ? 4 : 3;
      const time = times[Math.floor(Math.random() * times.length)];

      setPurchase({ name: `${name} ${initial}.`, city, event, tickets, time });
      setShow(true);

      timeout = setTimeout(() => {
        setShow(false);
        // Random delay 15-60 seconds
        timeout = setTimeout(showPurchase, 15000 + Math.random() * 45000);
      }, 5000);
    };

    timeout = setTimeout(showPurchase, 10000 + Math.random() * 10000);
    return () => clearTimeout(timeout);
  }, []);

  if (!show || !purchase) return null;

  return (
    <div className="fixed bottom-24 left-4 bg-zinc-900 rounded-2xl p-4 border border-emerald-500/30 shadow-2xl shadow-emerald-500/10 z-40 animate-in slide-in-from-left max-w-sm">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
          <ShoppingCart className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <p className="font-bold text-white">
            {purchase.name} from {purchase.city}
          </p>
          <p className="text-sm text-zinc-400">
            Just bought <span className="text-emerald-400 font-medium">{purchase.tickets} tickets</span> for
          </p>
          <p className="text-sm text-purple-400 font-medium">{purchase.event}</p>
          <p className="text-xs text-zinc-500 mt-1">{purchase.time}</p>
        </div>
      </div>
    </div>
  );
};

// ============== ONE-CLICK BUY BUTTON ==============
export const OneClickBuyButton = ({ ticketId, price, onBuy, loading }) => {
  return (
    <Button
      onClick={() => onBuy(ticketId)}
      disabled={loading}
      className="w-full h-14 text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02]"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Processing...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <Zap className="w-6 h-6" />
          Buy Now - €{price}
          <Badge className="bg-white/20 ml-2">Instant Delivery</Badge>
        </span>
      )}
    </Button>
  );
};

// ============== TRUST BADGES ==============
export const TrustBadges = () => {
  const badges = [
    { icon: '🔒', text: 'Secure Payment' },
    { icon: '✅', text: '100% Guarantee' },
    { icon: '⚡', text: 'Instant Delivery' },
    { icon: '💳', text: 'Stripe Protected' },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 py-4">
      {badges.map((badge, i) => (
        <div key={i} className="flex items-center gap-2 bg-zinc-800/50 rounded-full px-4 py-2 border border-zinc-700">
          <span className="text-lg">{badge.icon}</span>
          <span className="text-sm text-zinc-300">{badge.text}</span>
        </div>
      ))}
    </div>
  );
};

// ============== LIMITED TIME OFFER ==============
export const LimitedTimeOffer = ({ originalPrice, salePrice, expiresIn = 3600 }) => {
  const [secondsLeft, setSecondsLeft] = useState(expiresIn);
  const discount = Math.round(((originalPrice - salePrice) / originalPrice) * 100);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Timer className="w-5 h-5 text-yellow-400 animate-pulse" />
        <span className="font-bold text-yellow-400">LIMITED TIME OFFER</span>
        <Badge className="bg-red-500 text-white ml-auto animate-pulse">-{discount}%</Badge>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <div className="text-zinc-400 text-sm line-through">Was €{originalPrice}</div>
          <div className="text-3xl font-bold text-white">€{salePrice}</div>
        </div>
        
        <div className="text-center bg-zinc-900/50 rounded-xl px-4 py-2">
          <div className="text-2xl font-mono font-bold text-yellow-400">
            {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <div className="text-xs text-zinc-400">Offer expires</div>
        </div>
      </div>
    </div>
  );
};

// ============== CALL TO ACTION STICKY BAR ==============
export const StickyBuyBar = ({ price, ticketsLeft, onBuy }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-lg border-t border-zinc-800 p-4 z-50 animate-in slide-in-from-bottom">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-2xl font-bold text-white">€{price}</div>
            <div className="text-sm text-zinc-400">Best available</div>
          </div>
          {ticketsLeft <= 10 && (
            <Badge className="bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
              Only {ticketsLeft} left!
            </Badge>
          )}
        </div>
        <Button 
          onClick={onBuy}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-12 px-8 text-lg font-bold"
        >
          <Zap className="w-5 h-5 mr-2" />
          Buy Now
        </Button>
      </div>
    </div>
  );
};

export default {
  UrgencyCountdown,
  ScarcityIndicator,
  LiveViewers,
  PriceComparison,
  WhatsAppButton,
  FlashSaleBanner,
  RecentlyBoughtPopup,
  OneClickBuyButton,
  TrustBadges,
  LimitedTimeOffer,
  StickyBuyBar
};
