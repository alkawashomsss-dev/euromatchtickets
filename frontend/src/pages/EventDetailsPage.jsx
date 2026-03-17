import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { 
  Calendar, MapPin, Ticket, Star, Shield, ChevronDown,
  CreditCard, Users, Zap, Award, Flag, Check, ArrowLeft, 
  Globe, Lock, Headphones, TrendingDown, Eye, Heart, Clock
} from "lucide-react";
import axios from "axios";
import { API } from "../App";
import { RelatedEventsSection } from "../components/RelatedEventsSection";
import SEOHead from "../components/SEOHead";
import { BreadcrumbStructuredData, FAQStructuredData, commonTicketFAQs } from "../components/StructuredData";
import EventStructuredData from "../components/StructuredData";
import { RecentlyBoughtPopup } from "../components/SalesAccelerator";
import VenueInfoSection from "../components/VenueInfoSection";
import { PriceAlertButton, ScarcityBadge, HighDemandBadge, SocialProofCounter, UrgencyCountdown, AlertWatchersCount } from "../components/ConversionWidgets";

const FadeIn = ({ children, className = "", delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
};

const TicketTier = ({ name, price, icon: Icon, gradient, features, badge, onBuy }) => {
  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.01 }} 
      className="relative group rounded-2xl overflow-hidden transition-all duration-300 bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/50"
      data-testid={`ticket-${name.toLowerCase().replace(/\s/g,'-')}`}
    >
      {badge && <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10">{badge}</div>}
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{name}</h3>
            <p className="text-xs text-slate-500">{features[0]}</p>
          </div>
        </div>
        <div className="text-center mb-4">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">From</p>
          <p className="text-3xl font-extrabold text-emerald-600">&euro;{price}</p>
        </div>
        <div className="space-y-1.5 mb-4">
          {features.slice(0, 3).map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-[12px] text-slate-600">
              <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />{f}
            </div>
          ))}
        </div>
        <button onClick={onBuy} className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg text-sm" data-testid={`buy-btn-${name.toLowerCase().replace(/\s/g,'-')}`}>
          Buy {name}
        </button>
      </div>
    </motion.div>
  );
};

export default function EventDetailsPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API}/events/${eventId}`)
      .then(res => { setEvent(res.data); setLoading(false); })
      .catch(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [eventId]);

  if (loading) return (
    <div className="min-h-screen bg-[hsl(210,20%,98%)] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!event) return (
    <div className="min-h-screen bg-[hsl(210,20%,98%)] flex items-center justify-center text-center p-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-4">Event Not Found</h1>
        <button onClick={() => navigate('/events')} className="text-emerald-600 hover:underline font-medium">Browse All Events</button>
      </div>
    </div>
  );

  const lowestPrice = Math.round(event.tickets?.length > 0 
    ? event.tickets.reduce((min, t) => t.price < min ? t.price : min, Infinity)
    : Object.values(event.categories || {}).reduce((min, c) => c.lowest_price < min ? c.lowest_price : min, 99));
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
  const savings = Math.round(officialPrice - lowestPrice);

  const ticketTiers = [
    { name: 'General Admission', price: lowestPrice, icon: Ticket, gradient: 'bg-gradient-to-br from-blue-600 to-blue-800', features: ['Entry to the venue', 'Standing / open seating', 'Access to all general areas', 'Instant QR ticket to your phone'], badge: null },
    { name: 'Grandstand', price: Math.round(lowestPrice * 1.8), icon: Eye, gradient: 'bg-gradient-to-br from-violet-600 to-violet-800', features: ['Reserved numbered seat', 'Elevated premium views', 'Covered seating area', 'Priority entrance', 'Instant QR delivery'], badge: 'BEST SELLER' },
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
    <div className="min-h-screen bg-[hsl(210,20%,98%)]" data-testid="event-details-page">
      <SEOHead 
        title={seoTitle}
        description={seoDesc}
        canonicalUrl={pageUrl}
        type="website"
      />
      <EventStructuredData event={event} />
      <BreadcrumbStructuredData items={[
        { name: 'Home', url: 'https://euromatchtickets.com' },
        { name: catLabel, url: `https://euromatchtickets.com/${isF1 ? 'f1-tickets' : isConcert ? 'concerts' : 'events'}` },
        { name: event.title, url: pageUrl }
      ]} />

      {/* ──── HERO ──── */}
      <div ref={heroRef} className="relative">
        <div className="absolute inset-0 h-[520px] md:h-[560px] overflow-hidden">
          <motion.img 
            style={{ y: imgY }} 
            src={event.image_url} 
            alt={event.image_alt || `${event.title} tickets`} 
            className="w-full h-[120%] object-cover" 
            loading="eager" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-900/60 to-slate-900" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 pt-6 pb-8">
          {/* Back */}
          <motion.button 
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
            onClick={() => navigate(-1)} 
            className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition mb-8 backdrop-blur-sm bg-white/10 px-3 py-1.5 rounded-full" 
            data-testid="back-btn"
          >
            <ArrowLeft className="w-4 h-4" /> {catLabel}
          </motion.button>

          {/* Date */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-4"
          >
            <Calendar className="w-4 h-4 text-amber-600" /> {shortDate}
          </motion.div>

          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] text-white mb-3" data-testid="event-h1"
          >
            {event.title} Tickets
          </motion.h1>

          {/* Location */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-wrap items-center gap-4 text-white/80 mb-6"
          >
            <span className="flex items-center gap-1.5"><Flag className="w-4 h-4 text-white/50" />{event.city}{event.country ? `, ${event.country}` : ''}</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-white/50" />{event.venue}</span>
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 mb-8"
          >
            <div className="glass-dark rounded-2xl px-6 py-3">
              <p className="text-[10px] text-white/50 uppercase tracking-widest">Tickets from</p>
              <p className="text-4xl font-extrabold text-amber-600">&euro;{lowestPrice}</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-400/30 rounded-2xl px-5 py-3 backdrop-blur-sm">
              <p className="text-emerald-300 font-bold text-sm flex items-center gap-1"><TrendingDown className="w-4 h-4" /> Save &euro;{savings}</p>
              <p className="text-[11px] text-white/50">vs official sellers</p>
            </div>
            <button 
              onClick={() => document.getElementById('tickets')?.scrollIntoView({ behavior: 'smooth' })} 
              className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-8 py-4 rounded-full text-lg transition-all shadow-[0_4px_20px_rgba(245,158,11,0.4)] hover:shadow-[0_8px_30px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-[0.97]" 
              data-testid="hero-cta"
            >
              Buy Tickets
            </button>
          </motion.div>

          {/* Trust */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-5 text-[13px]"
          >
            {[
              { icon: Shield, text: '100% Buyer Protection', color: 'text-emerald-600' },
              { icon: Zap, text: 'Instant QR Delivery', color: 'text-amber-600' },
              { icon: Star, text: '4.8/5 from 2,847 reviews', color: 'text-amber-600' },
              { icon: Users, text: '50,000+ customers', color: 'text-blue-600' },
            ].map((t, i) => (
              <span key={i} className="flex items-center gap-1.5 text-white/70"><t.icon className={`w-4 h-4 ${t.color}`} />{t.text}</span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ──── TICKETS SECTION - TOP PRIORITY ──── */}
      <div className="max-w-7xl mx-auto px-4 -mt-6 mb-8 relative z-10">
        <FadeIn>
          <div id="tickets">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-5 flex items-center gap-2">
              <Ticket className="w-6 h-6 text-emerald-600" /> Choose Your Tickets
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ticketTiers.map((t, i) => (
                <TicketTier key={i} {...t} onBuy={() => navigate(`/checkout?event=${event.event_id}&category=${t.name}`)} />
              ))}
            </div>
          </div>
        </FadeIn>
      </div>

      {/* ──── MAIN ──── */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">

            {/* Price Comparison */}
            <FadeIn delay={0.1}>
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm" data-testid="price-comparison">
                <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-emerald-600" /> Price Comparison
                </h3>
                <p className="text-sm text-slate-500 mb-5">See how much you save with EuroMatchTickets</p>
                
                <div className="space-y-3 mb-5">
                  {/* Competitors */}
                  {[
                    { name: 'Official Box Office', price: officialPrice, delivery: '2-4 weeks', guarantee: 'Limited' },
                    { name: 'StubHub / Viagogo', price: Math.round(lowestPrice * 1.25), delivery: '1-7 days', guarantee: 'Partial' },
                    { name: 'Other Resellers', price: Math.round(lowestPrice * 1.15), delivery: '3-5 days', guarantee: 'Varies' },
                  ].map((comp, i) => (
                    <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                        <span className="text-sm text-slate-500">{comp.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-slate-400 line-through">&euro;{comp.price}</span>
                        <span className="text-slate-400 text-xs hidden sm:block">{comp.delivery}</span>
                        <span className="text-slate-400 text-xs hidden sm:block">{comp.guarantee}</span>
                      </div>
                    </div>
                  ))}
                  
                  {/* EuroMatchTickets - Highlighted */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 border-2 border-emerald-300 shadow-sm relative">
                    <div className="absolute -top-2.5 left-4 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">BEST DEAL</div>
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-sm font-bold text-slate-900">EuroMatchTickets</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-2xl font-extrabold text-emerald-600">&euro;{lowestPrice}</span>
                      <span className="text-emerald-600 text-xs font-bold hidden sm:block">Instant</span>
                      <span className="text-emerald-600 text-xs font-bold hidden sm:flex items-center gap-1"><Shield className="w-3 h-3" />FanProtect</span>
                    </div>
                  </div>
                </div>

                {/* Savings badge */}
                <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
                  <TrendingDown className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-700">You save up to &euro;{savings} compared to official sellers</span>
                </div>
              </div>
            </FadeIn>

            {/* Why Choose Us */}
            <FadeIn delay={0.15}>
              <div data-testid="why-choose-us">
                <h2 className="text-2xl font-extrabold text-slate-900 mb-5">Why 50,000+ Fans Choose Us</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: Shield, title: '100% Buyer Protection', desc: 'FanProtect covers every purchase. Full refund if cancelled.', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { icon: Zap, title: 'Instant QR Delivery', desc: 'Tickets on your phone in seconds. No waiting, no printing.', color: 'text-amber-600', bg: 'bg-amber-50' },
                    { icon: TrendingDown, title: 'Best Price Guarantee', desc: `Save \u20ac${savings} vs official sellers. We match any lower price.`, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { icon: Headphones, title: 'Real Human Support', desc: 'Fan support before, during & after the event.', color: 'text-violet-600', bg: 'bg-violet-50' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all group">
                      <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-3`}>
                        <item.icon className={`w-6 h-6 ${item.color}`} />
                      </div>
                      <h3 className="font-bold text-slate-900 text-base mb-1">{item.title}</h3>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* SEO Content */}
            <FadeIn delay={0.2}>
              <div className="prose-light" data-testid="seo-content-block">
                <h2>{event.title} &ndash; Your Complete Guide</h2>
                <p>
                  Looking for {event.title} tickets at the cheapest prices? EuroMatchTickets offers verified 
                  {' '}{catLabel.toLowerCase()} tickets for {event.venue} in {event.city} with instant QR delivery 
                  and our exclusive FanProtect buyer guarantee. Prices start from just &euro;{lowestPrice} &mdash; 
                  that's up to &euro;{savings} less than official sellers.
                </p>
                <p>
                  {event.venue} is one of {event.country || 'Europe'}'s most iconic venues, known for its incredible atmosphere.
                  Choose General Admission for the raw fan experience, Grandstand for premium elevated views, 
                  or VIP Hospitality with private lounge access, food, drinks and the best seats available.
                </p>
                <p>
                  Every ticket includes instant QR delivery &mdash; no waiting for postal delivery, no stress about lost tickets.
                  Just show your phone at the gate. Our 50,000+ customers rate us 4.8/5, and our FanProtect guarantee 
                  means you're covered if anything changes.
                </p>
              </div>
            </FadeIn>

            {/* FAQ */}
            <FadeIn delay={0.25}>
              <div data-testid="faq-section">
                <h2 className="text-2xl font-extrabold text-slate-900 mb-5">FAQ &ndash; {event.title}</h2>
                <FAQStructuredData faqs={eventFAQs} />
                <div className="space-y-3">
                  {eventFAQs.map((faq, i) => (
                    <details key={i} className="group rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition" data-testid={`faq-${i}`}>
                      <summary className="p-4 font-bold text-[15px] text-slate-900 cursor-pointer list-none flex items-center justify-between">
                        {faq.question}
                        <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0" />
                      </summary>
                      <p className="px-4 pb-4 text-slate-500 text-sm leading-relaxed">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            <div className="sticky top-24 space-y-6">
              {/* Quick Buy Card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                className="glass-card rounded-2xl p-6 shadow-xl" data-testid="quick-buy-card"
              >
                <div className="text-center mb-5">
                  <p className="text-xs text-slate-400 uppercase tracking-widest">Tickets from</p>
                  <p className="text-5xl font-extrabold text-emerald-600 mt-1">&euro;{lowestPrice}</p>
                  <p className="text-xs text-slate-400 mt-1">per person &middot; all fees included</p>
                </div>

                <button onClick={() => document.getElementById('tickets')?.scrollIntoView({ behavior: 'smooth' })} className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-lg transition-all shadow-md hover:shadow-lg mb-5" data-testid="sidebar-cta">
                  Buy Tickets Now
                </button>

                <div className="space-y-2.5">
                  {['Instant QR delivery', '100% verified tickets', 'FanProtect guarantee', 'Secure Stripe checkout', `Save \u20ac${savings} vs others`].map((t, i) => (
                    <div key={i} className="flex items-center gap-2 text-[13px] text-slate-600"><Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />{t}</div>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200 grid grid-cols-4 gap-2">
                  {[
                    { name: 'VISA', bg: 'bg-blue-600 text-white' },
                    { name: 'MC', bg: 'bg-red-600 text-white' },
                    { name: 'AMEX', bg: 'bg-blue-800 text-white' },
                    { name: 'PAY', bg: 'bg-slate-900 text-white' },
                  ].map(p => (
                    <div key={p.name} className={`text-[10px] ${p.bg} py-1.5 rounded text-center font-bold`}>{p.name}</div>
                  ))}
                </div>
              </motion.div>

              {/* Conversion Widgets */}
              <div className="space-y-3">
                <ScarcityBadge available={event.available_tickets || event.ticket_count} total={event.total_tickets || 200} />
                <HighDemandBadge eventId={event.event_id} />
                <SocialProofCounter eventId={event.event_id} />
              </div>

              {/* Urgency Countdown */}
              <UrgencyCountdown eventDate={event.event_date} />

              {/* Price Alert */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <PriceAlertButton event={event} />
                <div className="mt-3">
                  <AlertWatchersCount eventId={event.event_id} />
                </div>
              </div>

              {/* Event Details */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-sm text-slate-900 mb-3">Event Details</h3>
                <div className="space-y-2.5 text-[13px]">
                  {[
                    { label: 'Date', value: shortDate },
                    { label: 'Venue', value: event.venue },
                    { label: 'City', value: `${event.city}${event.country ? `, ${event.country}` : ''}` },
                    { label: 'Category', value: catLabel },
                    { label: 'Status', value: 'Tickets Available', green: true },
                  ].map((r, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-slate-400">{r.label}</span>
                      <span className={r.green ? 'text-emerald-600 font-bold' : 'text-slate-700'}>{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Venue Info with Map */}
              <VenueInfoSection event={event} />

              {/* Reviews */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 text-amber-600 fill-amber-400" />)}</div>
                  <span className="text-xs text-slate-500">4.8/5</span>
                </div>
                {[
                  { name: 'Marco R.', text: 'Best ticket experience ever. Saved \u20ac60!', flag: 'DE' },
                  { name: 'Sophie M.', text: 'Instant delivery. QR worked perfectly.', flag: 'FR' },
                  { name: 'Thomas K.', text: 'Cheapest prices I found. Real guarantee.', flag: 'UK' },
                ].map((r, i) => (
                  <div key={i} className="py-2.5 border-t border-slate-100 first:border-0">
                    <p className="text-slate-600 text-xs italic leading-relaxed">"{r.text}"</p>
                    <p className="text-slate-400 text-[11px] mt-1">{r.name} &middot; {r.flag}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Events */}
        <RelatedEventsSection slug={event.slug || event.event_id} category={event.event_type === 'match' ? 'football' : event.event_type} city={event.city} />
      </div>

      {/* Mobile Sticky Buy */}
      <div className="mobile-sticky-buy lg:hidden" data-testid="mobile-sticky-buy">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500">From</p>
            <p className="text-2xl font-extrabold text-slate-900">&euro;{lowestPrice}</p>
          </div>
          <button onClick={() => document.getElementById('tickets')?.scrollIntoView({ behavior: 'smooth' })} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-3.5 rounded-full text-base transition-all shadow-md">
            Buy Tickets
          </button>
        </div>
      </div>

      <RecentlyBoughtPopup />
    </div>
  );
}
