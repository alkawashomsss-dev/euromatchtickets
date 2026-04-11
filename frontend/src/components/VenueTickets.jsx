import { Link } from "react-router-dom";
import { Ticket, Shield, Star, Zap, Clock, Users, Check, Flame, TrendingUp, Award } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { motion } from "framer-motion";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }) };

export const VenueTickets = ({ tickets, eventName, searchQuery, accentColor = "emerald" }) => {
  const colors = {
    emerald: { bg: "bg-emerald-500", text: "text-emerald-600", border: "border-emerald-200", light: "bg-emerald-50", hover: "hover:border-emerald-300" },
    red: { bg: "bg-red-500", text: "text-red-600", border: "border-red-200", light: "bg-red-50", hover: "hover:border-red-300" },
    pink: { bg: "bg-pink-500", text: "text-pink-600", border: "border-pink-200", light: "bg-pink-50", hover: "hover:border-pink-300" },
    blue: { bg: "bg-blue-500", text: "text-blue-600", border: "border-blue-200", light: "bg-blue-50", hover: "hover:border-blue-300" },
    amber: { bg: "bg-amber-500", text: "text-amber-600", border: "border-amber-200", light: "bg-amber-50", hover: "hover:border-amber-300" },
  };
  const c = colors[accentColor] || colors.emerald;

  return (
    <section id="tickets" className="py-16 bg-[#1e1e1e]" data-testid="venue-tickets">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">{eventName} Tickets</h2>
            <p className="text-slate-500 text-sm mt-1">{tickets.length} ticket categories available</p>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-emerald-500" /> 100% Guaranteed</span>
            <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-500" /> Instant Delivery</span>
          </div>
        </div>

        <div className="grid gap-3">
          {tickets.map((t, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
              className={`flex flex-col md:flex-row md:items-center justify-between bg-[#1e1e1e] border border-slate-100 ${c.hover} rounded-2xl p-5 transition-all group`}>
              <div className="flex items-center gap-4 mb-3 md:mb-0">
                <div className={`w-12 h-12 ${c.light} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Ticket className={`w-6 h-6 ${c.text}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-white">{t.section}</h3>
                    {t.popular && <Badge className="bg-orange-50 text-orange-600 border-orange-200 text-[10px]">POPULAR</Badge>}
                    {t.bestValue && <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 text-[10px]">BEST VALUE</Badge>}
                    {t.vip && <Badge className="bg-violet-50 text-violet-600 border-violet-200 text-[10px]">VIP</Badge>}
                  </div>
                  <p className="text-slate-400 text-xs mt-0.5">{t.desc || eventName}</p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span className={`text-sm font-medium ${t.available < 20 ? 'text-red-500' : c.text}`}>
                    {t.available < 20 ? `Only ${t.available} left!` : `${t.available} available`}
                  </span>
                </div>
                <div className="text-right min-w-[80px]">
                  {t.originalPrice && <div className="text-xs text-slate-400 line-through">&euro;{t.originalPrice.toLocaleString()}</div>}
                  <div className={`text-xl font-bold ${c.text}`}>&euro;{t.price.toLocaleString()}</div>
                </div>
                <Link to={`/events?search=${encodeURIComponent(searchQuery)}`}>
                  <Button className={`${c.bg} hover:opacity-90 text-white px-6`} data-testid={`buy-ticket-${i}`}>
                    Buy Now
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-[#15151e] rounded-xl border border-slate-100 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-emerald-500" /> FanProtect Guarantee</span>
          <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> 100% Verified Tickets</span>
          <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500" /> Instant QR Delivery</span>
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-500" /> Full Refund if Cancelled</span>
        </div>
      </div>
    </section>
  );
};

export const TrustSection = ({ reviewCount = 4850, rating = 4.8 }) => (
  <section className="py-12 bg-[#15151e] border-y border-slate-100" data-testid="trust-section">
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <div className="text-3xl font-black text-white">{rating}</div>
          <div className="flex justify-center gap-0.5 my-1">{[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />)}</div>
          <div className="text-xs text-slate-500">{reviewCount.toLocaleString()}+ Reviews</div>
        </div>
        <div>
          <div className="text-3xl font-black text-white">100%</div>
          <div className="text-xs text-slate-500 mt-1">Verified Tickets</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-0.5">FanProtect Guarantee</div>
        </div>
        <div>
          <div className="text-3xl font-black text-white">500K+</div>
          <div className="text-xs text-slate-500 mt-1">Tickets Sold</div>
          <div className="text-[10px] text-blue-600 font-medium mt-0.5">Trusted Worldwide</div>
        </div>
        <div>
          <div className="text-3xl font-black text-white">24/7</div>
          <div className="text-xs text-slate-500 mt-1">Customer Support</div>
          <div className="text-[10px] text-violet-600 font-medium mt-0.5">Always Here For You</div>
        </div>
      </div>
    </div>
  </section>
);

export const RelatedEvents = ({ events, accentColor = "emerald" }) => {
  if (!events || events.length === 0) return null;
  const colors = { emerald: "text-emerald-600", red: "text-red-600", pink: "text-pink-600", blue: "text-blue-600", amber: "text-amber-600" };
  const c = colors[accentColor] || colors.emerald;

  return (
    <section className="py-12 bg-[#1e1e1e]" data-testid="related-events">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-white mb-6">Available Events</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.slice(0, 6).map((e, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}>
              <Link to={`/events/${e.event_id}`} className="block bg-[#1e1e1e] border border-slate-100 hover:border-white/10 rounded-xl p-5 transition-all hover:shadow-md">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-sm truncate">{e.title}</h3>
                    <p className="text-slate-400 text-xs mt-0.5">{e.venue} &bull; {e.city}</p>
                  </div>
                  {e.featured && <Flame className="w-4 h-4 text-orange-400 flex-shrink-0" />}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    {e.event_date ? new Date(e.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBA'}
                  </div>
                  <div className="flex items-center gap-2">
                    {e.available_tickets > 0 && <span className="text-xs text-slate-400">{e.available_tickets} left</span>}
                    {e.lowest_price > 0 && <span className={`font-bold text-sm ${c}`}>From &euro;{Math.round(e.lowest_price)}</span>}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
