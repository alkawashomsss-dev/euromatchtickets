import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  Calendar, MapPin, Ticket, Star, Shield, ChevronDown,
  CreditCard, Mail, Users, Zap, Award, Flag, Check, ArrowLeft, 
  Globe, Lock, Headphones, TrendingDown, Eye, Heart, Share2, Clock
} from "lucide-react";
import axios from "axios";
import { API } from "../App";
import { RelatedEventsSection } from "../components/RelatedEventsSection";
import { BreadcrumbStructuredData, FAQStructuredData, commonTicketFAQs } from "../components/StructuredData";
import EventStructuredData from "../components/StructuredData";
import { RecentlyBoughtPopup } from "../components/SalesAccelerator";

const TicketTier = ({ name, price, icon: Icon, gradient, features, badge, onBuy }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`relative group rounded-2xl overflow-hidden transition-all duration-300 ${open ? 'ring-2 ring-emerald-400/50' : 'ring-1 ring-white/10 hover:ring-white/20'}`} data-testid={`ticket-${name.toLowerCase().replace(/\s/g,'-')}`}>
      {badge && <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl z-10">{badge}</div>}
      <div className={`absolute inset-0 opacity-[0.07] ${gradient}`} />
      <div className="relative p-5 cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${gradient} flex items-center justify-center shadow-lg`}>
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{name}</h3>
              <p className="text-xs text-zinc-500">{features[0]}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider">From</p>
            <p className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">&euro;{price}</p>
          </div>
        </div>
      </div>
      <div className={`transition-all duration-300 overflow-hidden ${open ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-5 pb-5 border-t border-white/5 pt-4">
          <div className="grid grid-cols-2 gap-2 mb-5">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-2 text-[13px] text-zinc-400">
                <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />{f}
              </div>
            ))}
          </div>
          <button onClick={onBuy} className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20" data-testid={`buy-btn-${name.toLowerCase().replace(/\s/g,'-')}`}>
            Select {name}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function EventDetailsPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API}/events/${eventId}`)
      .then(res => { setEvent(res.data); setLoading(false); })
      .catch(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [eventId]);

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!event) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-center p-8">
      <div><h1 className="text-3xl font-black mb-4">Event Not Found</h1>
        <button onClick={() => navigate('/events')} className="text-emerald-400 hover:underline">Browse All Events</button>
      </div>
    </div>
  );

  const lowestPrice = event.tickets?.length > 0 
    ? event.tickets.reduce((min, t) => t.price < min ? t.price : min, Infinity)
    : Object.values(event.categories || {}).reduce((min, c) => c.lowest_price < min ? c.lowest_price : min, 99);
  const d = new Date(event.event_date);
  const dateStr = d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const shortDate = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  const isF1 = event.event_type === 'f1';
  const isConcert = event.event_type === 'concert';
  const catLabel = isF1 ? 'Formula 1' : isConcert ? 'Concert' : event.event_type === 'motogp' ? 'MotoGP' : 'Football';
  const pageUrl = `https://euromatchtickets.com/event/${event.slug || event.event_id}`;
  const seoTitle = `Buy ${event.title} Tickets ${d.getFullYear()} – Cheapest Prices + Instant Delivery | EuroMatchTickets`;
  const seoDesc = `${event.title} tickets from €${lowestPrice}. ${event.venue}, ${event.city}. Save vs official sellers. Instant QR delivery. 100% FanProtect guarantee.`;
  const officialPrice = Math.round(lowestPrice * 1.35);
  const savings = officialPrice - lowestPrice;

  const ticketTiers = [
    { name: 'General Admission', price: lowestPrice, icon: Ticket, gradient: 'bg-gradient-to-br from-blue-600 to-blue-800', features: ['Entry to the venue', 'Standing / open seating', 'Access to all general areas', 'Instant QR ticket to your phone'], badge: null },
    { name: 'Grandstand', price: Math.round(lowestPrice * 1.8), icon: Eye, gradient: 'bg-gradient-to-br from-purple-600 to-purple-800', features: ['Reserved numbered seat', 'Elevated premium views', 'Covered seating area', 'Priority entrance', 'Instant QR delivery'], badge: 'BEST SELLER' },
    { name: 'VIP Hospitality', price: Math.round(lowestPrice * 4.5), icon: Award, gradient: 'bg-gradient-to-br from-amber-500 to-amber-700', features: ['Best seats in the house', 'Private VIP lounge', 'Premium food & drinks', 'Exclusive merchandise', 'Meet & greet opportunity', 'Dedicated concierge'], badge: 'PREMIUM' },
  ];

  const eventFAQs = [
    { question: `When is ${event.title}?`, answer: `${event.title} takes place on ${dateStr} at ${event.venue} in ${event.city}${event.country ? `, ${event.country}` : ''}.` },
    { question: `How much are ${event.title} tickets?`, answer: `Tickets start from just €${lowestPrice} for General Admission. Grandstand seats from €${Math.round(lowestPrice * 1.8)} and VIP from €${Math.round(lowestPrice * 4.5)}. We offer the cheapest prices with instant delivery.` },
    { question: `How will I receive my tickets?`, answer: `All tickets are delivered instantly as secure QR codes to your email and phone. No printing needed — just show the QR code at the venue entrance.` },
    { question: `Is it safe to buy from EuroMatchTickets?`, answer: `Absolutely. Every purchase is protected by our FanProtect guarantee: 100% verified tickets, instant delivery, and a full refund if the event is cancelled. We've served 50,000+ happy customers.` },
    { question: `Can I get a refund?`, answer: `If the event is cancelled or significantly rescheduled, you receive a full refund automatically. Our FanProtect guarantee has you covered.` },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white" data-testid="event-details-page">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={`${event.title} Tickets – From €${lowestPrice}`} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
      </Helmet>
      <EventStructuredData event={event} />
      <BreadcrumbStructuredData items={[
        { name: 'Home', url: 'https://euromatchtickets.com' },
        { name: catLabel, url: `https://euromatchtickets.com/${isF1 ? 'f1-tickets' : isConcert ? 'concerts' : 'events'}` },
        { name: event.title, url: pageUrl }
      ]} />

      {/* ──── HERO ──── */}
      <div className="relative">
        <div className="absolute inset-0 h-[520px] md:h-[560px]">
          <img src={event.image_url} alt={event.image_alt || `${event.title} tickets`} className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-zinc-950/70 to-zinc-950" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 pt-6 pb-8">
          {/* Back nav */}
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition mb-8" data-testid="back-btn">
            <ArrowLeft className="w-4 h-4" /> {catLabel}
          </button>

          {/* Date badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-bold px-4 py-1.5 rounded-full mb-4 backdrop-blur-sm">
            <Calendar className="w-4 h-4" /> {shortDate}
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] mb-3" data-testid="event-h1">
            {event.title} Tickets
          </h1>

          {/* Location */}
          <div className="flex flex-wrap items-center gap-4 text-zinc-300 mb-6">
            <span className="flex items-center gap-1.5"><Flag className="w-4 h-4 text-zinc-500" />{event.city}{event.country ? `, ${event.country}` : ''}</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-zinc-500" />{event.venue}</span>
          </div>

          {/* Hero CTA row */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Tickets from</p>
              <p className="text-4xl font-black text-emerald-400">&euro;{lowestPrice}</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-3 backdrop-blur-sm">
              <p className="text-red-400 font-bold text-sm flex items-center gap-1"><TrendingDown className="w-4 h-4" /> Save &euro;{savings}</p>
              <p className="text-[11px] text-zinc-500">vs official sellers</p>
            </div>
            <button onClick={() => document.getElementById('tickets')?.scrollIntoView({ behavior: 'smooth' })} className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all shadow-xl shadow-emerald-500/20" data-testid="hero-cta">
              Buy Tickets
            </button>
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap gap-5 text-[13px]">
            {[
              { icon: Shield, text: '100% Buyer Protection', color: 'text-emerald-400' },
              { icon: Zap, text: 'Instant QR Delivery', color: 'text-amber-400' },
              { icon: Star, text: '4.8/5 from 2,847 reviews', color: 'text-yellow-400' },
              { icon: Users, text: '50,000+ customers', color: 'text-blue-400' },
            ].map((t, i) => (
              <span key={i} className="flex items-center gap-1.5 text-zinc-400"><t.icon className={`w-4 h-4 ${t.color}`} />{t.text}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ──── MAIN CONTENT ──── */}
      <div className="max-w-7xl mx-auto px-4 -mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT - Tickets + Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Ticket Tiers */}
            <div id="tickets">
              <h2 className="text-2xl font-black mb-5 flex items-center gap-2">
                <Ticket className="w-6 h-6 text-emerald-400" /> Choose Your Tickets
              </h2>
              <div className="space-y-4">
                {ticketTiers.map((t, i) => (
                  <TicketTier key={i} {...t} onBuy={() => navigate(`/checkout?event=${event.event_id}&category=${t.name}`)} />
                ))}
              </div>
            </div>

            {/* Price Comparison */}
            <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-6" data-testid="price-comparison">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-emerald-400" /> Why EuroMatchTickets is the Smart Choice
              </h3>
              <div className="overflow-hidden rounded-xl border border-white/5">
                <table className="w-full text-sm">
                  <thead><tr className="bg-white/5">
                    <th className="text-left p-3 text-zinc-500 font-medium">Platform</th>
                    <th className="text-center p-3 text-zinc-500 font-medium">Price</th>
                    <th className="text-center p-3 text-zinc-500 font-medium">Delivery</th>
                    <th className="text-center p-3 text-zinc-500 font-medium">Guarantee</th>
                  </tr></thead>
                  <tbody>
                    <tr className="border-t border-white/5">
                      <td className="p-3 text-zinc-400">Official Box Office</td>
                      <td className="p-3 text-center text-zinc-400 line-through">&euro;{officialPrice}</td>
                      <td className="p-3 text-center text-zinc-500">2-4 weeks</td>
                      <td className="p-3 text-center text-zinc-500">Limited</td>
                    </tr>
                    <tr className="border-t border-white/5">
                      <td className="p-3 text-zinc-400">Other Resellers</td>
                      <td className="p-3 text-center text-zinc-400 line-through">&euro;{Math.round(lowestPrice * 1.2)}</td>
                      <td className="p-3 text-center text-zinc-500">1-7 days</td>
                      <td className="p-3 text-center text-zinc-500">Varies</td>
                    </tr>
                    <tr className="border-t border-emerald-500/20 bg-emerald-500/5">
                      <td className="p-3 font-bold text-white">EuroMatchTickets</td>
                      <td className="p-3 text-center font-black text-emerald-400 text-lg">&euro;{lowestPrice}</td>
                      <td className="p-3 text-center text-emerald-400 font-medium">Instant</td>
                      <td className="p-3 text-center text-emerald-400 font-medium">FanProtect</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Why Choose Us */}
            <div data-testid="why-choose-us">
              <h2 className="text-2xl font-black mb-5">Why 50,000+ Fans Choose Us</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: Shield, title: '100% Buyer Protection', desc: 'FanProtect covers every purchase. Full refund if cancelled.', gradient: 'from-emerald-600 to-emerald-800' },
                  { icon: Zap, title: 'Instant QR Delivery', desc: 'Tickets on your phone in seconds. No waiting, no printing.', gradient: 'from-amber-500 to-orange-700' },
                  { icon: TrendingDown, title: 'Best Price Guarantee', desc: `Save €${savings} vs official sellers. We match any lower price.`, gradient: 'from-blue-600 to-blue-800' },
                  { icon: Headphones, title: 'Real Human Support', desc: 'Fan support before, during & after the event. Always available.', gradient: 'from-purple-600 to-purple-800' },
                ].map((item, i) => (
                  <div key={i} className="relative overflow-hidden rounded-2xl border border-white/10 p-5 group hover:border-white/20 transition-all">
                    <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${item.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
                    <item.icon className="w-8 h-8 text-emerald-400 mb-3" />
                    <h3 className="font-bold text-base mb-1">{item.title}</h3>
                    <p className="text-sm text-zinc-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SEO Content */}
            <div className="prose prose-invert max-w-none" data-testid="seo-content-block">
              <h2 className="text-2xl font-black mb-4">{event.title} – Your Complete Guide</h2>
              <div className="text-zinc-400 leading-relaxed space-y-4 text-[15px]">
                <p>
                  Looking for {event.title} tickets at the cheapest prices? EuroMatchTickets offers verified 
                  {' '}{catLabel.toLowerCase()} tickets for {event.venue} in {event.city} with instant QR delivery 
                  and our exclusive FanProtect buyer guarantee. Prices start from just &euro;{lowestPrice} — 
                  that's up to &euro;{savings} less than official sellers.
                </p>
                <p>
                  {event.venue} is one of {event.country || 'Europe'}'s most iconic venues, known for its incredible atmosphere.
                  Choose General Admission for the raw fan experience, Grandstand for premium elevated views, 
                  or VIP Hospitality with private lounge access, food, drinks and the best seats available.
                </p>
                <p>
                  Every ticket includes instant QR delivery — no waiting for postal delivery, no stress about lost tickets.
                  Just show your phone at the gate. Our 50,000+ customers rate us 4.8/5, and our FanProtect guarantee 
                  means you're covered if anything changes. It's the smartest way to buy tickets.
                </p>
              </div>
            </div>

            {/* FAQ */}
            <div data-testid="faq-section">
              <h2 className="text-2xl font-black mb-5">FAQ – {event.title}</h2>
              <FAQStructuredData faqs={eventFAQs} />
              <div className="space-y-3">
                {eventFAQs.map((faq, i) => (
                  <details key={i} className="group rounded-xl border border-white/10 bg-zinc-900/30 hover:border-white/15 transition" data-testid={`faq-${i}`}>
                    <summary className="p-4 font-bold text-[15px] cursor-pointer list-none flex items-center justify-between">
                      {faq.question}
                      <ChevronDown className="w-4 h-4 text-zinc-600 group-open:rotate-180 transition-transform flex-shrink-0" />
                    </summary>
                    <p className="px-4 pb-4 text-zinc-500 text-sm leading-relaxed">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            {/* Sticky Buy Card */}
            <div className="sticky top-4 space-y-6">
              <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl" data-testid="quick-buy-card">
                <div className="text-center mb-5">
                  <p className="text-xs text-zinc-600 uppercase tracking-widest">Tickets from</p>
                  <p className="text-5xl font-black bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent mt-1">&euro;{lowestPrice}</p>
                  <p className="text-xs text-zinc-600 mt-1">per person &middot; all fees included</p>
                </div>

                <button onClick={() => document.getElementById('tickets')?.scrollIntoView({ behavior: 'smooth' })} className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black rounded-xl text-lg transition-all shadow-lg shadow-emerald-500/25 mb-5" data-testid="sidebar-cta">
                  Buy Tickets Now
                </button>

                <div className="space-y-2.5">
                  {['Instant QR delivery', '100% verified tickets', 'FanProtect guarantee', 'Secure Stripe checkout', `Save €${savings} vs others`].map((t, i) => (
                    <div key={i} className="flex items-center gap-2 text-[13px] text-zinc-400"><Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />{t}</div>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-white/5 grid grid-cols-4 gap-2">
                  {['VISA', 'MC', 'AMEX', 'PAY'].map(p => (
                    <div key={p} className="text-[10px] text-zinc-600 bg-zinc-800/80 py-1.5 rounded text-center font-medium">{p}</div>
                  ))}
                </div>
              </div>

              {/* Event Details */}
              <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-5">
                <h3 className="font-bold text-sm mb-3">Event Details</h3>
                <div className="space-y-2.5 text-[13px]">
                  {[
                    { label: 'Date', value: shortDate },
                    { label: 'Venue', value: event.venue },
                    { label: 'City', value: `${event.city}${event.country ? `, ${event.country}` : ''}` },
                    { label: 'Category', value: catLabel },
                    { label: 'Status', value: 'Tickets Available', green: true },
                  ].map((r, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-zinc-600">{r.label}</span>
                      <span className={r.green ? 'text-emerald-400 font-bold' : 'text-zinc-300'}>{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}</div>
                  <span className="text-xs text-zinc-500">4.8/5</span>
                </div>
                {[
                  { name: 'Marco R.', text: 'Best ticket experience ever. Saved €60!', flag: 'DE' },
                  { name: 'Sophie M.', text: 'Instant delivery. QR worked perfectly.', flag: 'FR' },
                  { name: 'Thomas K.', text: 'Cheapest prices I found. Real guarantee.', flag: 'UK' },
                ].map((r, i) => (
                  <div key={i} className="py-2.5 border-t border-white/5 first:border-0">
                    <p className="text-zinc-400 text-xs italic leading-relaxed">"{r.text}"</p>
                    <p className="text-zinc-600 text-[11px] mt-1">{r.name} · {r.flag}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Events */}
        <RelatedEventsSection slug={event.slug || event.event_id} category={event.event_type === 'match' ? 'football' : event.event_type} city={event.city} />
      </div>

      <RecentlyBoughtPopup />
    </div>
  );
}
