import { useState, useEffect } from "react";
import { Bell, BellRing, Check, Mail, TrendingDown, Users, AlertTriangle, Timer, Flame, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API, useAuth } from "../App";
import { toast } from "sonner";

/* ─── PRICE ALERT BUTTON ─── */
export const PriceAlertButton = ({ event }) => {
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user]);

  const handleSubscribe = async (e) => {
    e?.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const price = event.lowest_price || event.tickets?.[0]?.price || 0;
      await axios.post(`${API}/alerts/subscribe`, {
        email,
        event_id: event.event_id,
        event_title: event.title,
        current_price: price
      });
      setSubscribed(true);
      setShowForm(false);
      toast.success("Price alert activated! We'll notify you of any changes.");
    } catch {
      toast.error("Something went wrong. Try again.");
    }
    setLoading(false);
  };

  if (subscribed) {
    return (
      <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 border border-emerald-200 rounded-none text-emerald-700 text-sm font-medium" data-testid="alert-subscribed">
        <Check className="w-4 h-4" /> Price Alert Active
      </div>
    );
  }

  return (
    <div data-testid="price-alert-widget">
      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.form
            key="form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubscribe}
            className="space-y-2"
          >
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-3 py-2.5 bg-[#15151e] border border-white/10 rounded-none text-sm text-white placeholder:text-slate-400 focus:border-amber-400 outline-none"
                data-testid="alert-email-input"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-white rounded-none font-bold text-sm transition-colors whitespace-nowrap disabled:opacity-50"
                data-testid="alert-submit-btn"
              >
                {loading ? "..." : "Activate"}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">We'll email you when prices drop or tickets are running low.</p>
          </motion.form>
        ) : (
          <motion.button
            key="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowForm(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-500/10 hover:bg-amber-100 border border-amber-200 rounded-none text-amber-700 font-bold text-sm transition-colors"
            data-testid="alert-trigger-btn"
          >
            <Bell className="w-4 h-4" /> Get Price Alerts
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── SCARCITY BADGE ─── */
export const ScarcityBadge = ({ available, total }) => {
  if (!available || available > 50) return null;
  const pct = total ? Math.round((available / total) * 100) : 0;
  const isUrgent = available <= 10;
  const isMedium = available <= 25;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-none text-sm font-bold ${
        isUrgent 
          ? 'bg-[#e10600]/10 border border-red-200 text-red-700' 
          : isMedium 
            ? 'bg-amber-500/10 border border-amber-200 text-amber-700' 
            : 'bg-blue-50 border border-blue-200 text-blue-700'
      }`}
      data-testid="scarcity-badge"
    >
      {isUrgent ? <Flame className="w-4 h-4 animate-pulse" /> : <AlertTriangle className="w-4 h-4" />}
      <span>Only {available} tickets left!</span>
      {isUrgent && <span className="text-[10px] font-medium opacity-70">. </span>}
    </div>
  );
};

/* ─── HIGH DEMAND BADGE ─── */
export const HighDemandBadge = ({ eventId }) => {
  const [viewers, setViewers] = useState(0);

  useEffect(() => {
    // Simulate realistic viewing numbers
    const base = Math.abs(eventId?.charCodeAt(0) || 0) % 20 + 8;
    setViewers(base);
    const interval = setInterval(() => {
      setViewers(prev => Math.max(5, prev + (Math.random() > 0.5 ? 1 : -1)));
    }, 30000);
    return () => clearInterval(interval);
  }, [eventId]);

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-violet-50 border border-violet-200 rounded-none text-violet-700 text-sm" data-testid="demand-badge">
      <Eye className="w-4 h-4" />
      <span className="font-medium">{viewers} people viewing this now</span>
    </div>
  );
};

/* ─── SOCIAL PROOF COUNTER ─── */
export const SocialProofCounter = ({ eventId }) => {
  const [booked, setBooked] = useState(0);

  useEffect(() => {
    const base = Math.abs((eventId?.charCodeAt(1) || 0) + (eventId?.charCodeAt(2) || 0)) % 30 + 12;
    setBooked(base);
  }, [eventId]);

  if (booked < 5) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-200 rounded-none text-emerald-700 text-sm" data-testid="social-proof">
      <Users className="w-4 h-4" />
      <span className="font-medium">{booked} people booked this today</span>
    </div>
  );
};

/* ─── URGENCY COUNTDOWN ─── */
export const UrgencyCountdown = ({ eventDate, compact = false }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(eventDate) - new Date();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / 864e5),
          hours: Math.floor((diff / 36e5) % 24),
          mins: Math.floor((diff / 6e4) % 60)
        });
      }
    };
    calc();
    const t = setInterval(calc, 60000);
    return () => clearInterval(t);
  }, [eventDate]);

  if (timeLeft.days > 60) return null;

  const isUrgent = timeLeft.days <= 7;
  const isSoon = timeLeft.days <= 14;

  if (compact) {
    return (
      <span className={`flex items-center gap-1 text-xs font-medium ${isUrgent ? 'text-red-600' : isSoon ? 'text-amber-600' : 'text-slate-500'}`}>
        <Timer className="w-3 h-3" />
        {timeLeft.days}d {timeLeft.hours}h
      </span>
    );
  }

  return (
    <div 
      className={`rounded-none border p-3 ${isUrgent ? 'bg-[#e10600]/10 border-red-200' : isSoon ? 'bg-amber-500/10 border-amber-200' : 'bg-[#15151e] border-white/10'}`}
      data-testid="urgency-countdown"
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-bold uppercase tracking-wider ${isUrgent ? 'text-red-600' : isSoon ? 'text-amber-600' : 'text-slate-500'}`}>
          {isUrgent ? 'Event Very Soon!' : isSoon ? 'Event Approaching' : 'Event Countdown'}
        </span>
        <Timer className={`w-4 h-4 ${isUrgent ? 'text-red-500 animate-pulse' : isSoon ? 'text-amber-500' : 'text-slate-400'}`} />
      </div>
      <div className="flex gap-3">
        {[
          { val: timeLeft.days, label: 'Days' },
          { val: timeLeft.hours, label: 'Hours' },
          { val: timeLeft.mins, label: 'Mins' }
        ].map((t) => (
          <div key={t.label} className="text-center flex-1">
            <div className={`text-2xl font-extrabold ${isUrgent ? 'text-red-700' : isSoon ? 'text-amber-700' : 'text-white'}`}>
              {String(t.val).padStart(2, '0')}
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">{t.label}</div>
          </div>
        ))}
      </div>
      {isUrgent && (
        <p className="text-[11px] text-red-600 font-medium mt-2 text-center">
          Prices typically increase {timeLeft.days <= 3 ? '50-100%' : '20-40%'} closer to the event
        </p>
      )}
    </div>
  );
};

/* ─── ALERT WATCHERS COUNT ─── */
export const AlertWatchersCount = ({ eventId }) => {
  const [watchers, setWatchers] = useState(0);

  useEffect(() => {
    axios.get(`${API}/alerts/stats/${eventId}`).then(res => {
      setWatchers(res.data.watching || 0);
    }).catch(() => {});
  }, [eventId]);

  // Add simulated base watchers
  const total = watchers + Math.abs((eventId?.charCodeAt(0) || 0) % 40 + 15);

  return (
    <div className="flex items-center gap-1.5 text-[12px] text-slate-500" data-testid="alert-watchers">
      <BellRing className="w-3 h-3 text-amber-500" />
      <span>{total} fans tracking price alerts</span>
    </div>
  );
};
