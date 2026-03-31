import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { 
  Calendar, MapPin, Ticket, Star, Shield, ChevronDown,
  Users, Zap, Award, Flag, Check, ArrowLeft, 
  Lock, Headphones, TrendingDown, Eye, Clock, Grid3X3
} from "lucide-react";
import axios from "axios";
import { API } from "../App";
import { RelatedEventsSection } from "../components/RelatedEventsSection";
import SEOHead from "../components/SEOHead";
import { BreadcrumbStructuredData, FAQStructuredData } from "../components/StructuredData";
import EventStructuredData from "../components/StructuredData";
import { RecentlyBoughtPopup } from "../components/SalesAccelerator";
import VenueInfoSection from "../components/VenueInfoSection";
import InteractiveVenueMap from "../components/InteractiveVenueMap";
import TicketListings from "../components/TicketListings";
import { PriceAlertButton, ScarcityBadge, HighDemandBadge, SocialProofCounter, UrgencyCountdown, AlertWatchersCount } from "../components/ConversionWidgets";
import { VIPExperienceSection } from "../components/VIPExperience";

const FadeIn = ({ children, className = "", delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
};

export default function EventDetailsPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState(null);
  const [showMap, setShowMap] = useState(true);

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

  const groupedSections = event.grouped_sections || [];
  const totalAvailable = groupedSections.reduce((s, g) => s + g.count, 0);
  const lowestPrice = groupedSections.length > 0
    ? Math.round(Math.min(...groupedSections.map(g => g.lowest_price)))
    : (event.lowest_price ? Math.round(event.lowest_price) : 99);
  const d = new Date(event.event_date);
  const dateStr = d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const shortDate = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  const isF1 = event.event_type === 'f1';
  const isConcert = event.event_type === 'concert';
  const catLabel = isF1 ? 'Formula 1' : isConcert ? 'Concert' : event.event_type === 'motogp' ? 'MotoGP' : 'Football';
  const pageUrl = `https://euromatchtickets.com/event/${event.slug || event.event_id}`;
  const seoTitle = `Buy ${event.title} Tickets ${d.getFullYear()} – Cheapest Prices | EuroMatchTickets`;
  const seoDesc = `${event.title} tickets from €${lowestPrice}. ${event.venue}, ${event.city}. Save vs official sellers. Instant QR delivery. FanProtect guarantee.`;
  const officialPrice = Math.round(lowestPrice * 1.35);
  const savings = Math.round(officialPrice - lowestPrice);

  const eventFAQs = [
    { question: `When is ${event.title}?`, answer: `${event.title} takes place on ${dateStr} at ${event.venue} in ${event.city}${event.country ? `, ${event.country}` : ''}.` },
    { question: `How much are ${event.title} tickets?`, answer: `Tickets start from just €${lowestPrice}. We offer the cheapest prices with instant delivery.` },
    { question: `How will I receive my tickets?`, answer: `All tickets are delivered instantly as secure QR codes to your email and phone. No printing needed.` },
    { question: `Is it safe to buy from EuroMatchTickets?`, answer: `Absolutely. Every purchase is protected by our FanProtect guarantee: 100% verified tickets, instant delivery, and a full refund if the event is cancelled.` },
    { question: `Can I get a refund?`, answer: `If the event is cancelled or significantly rescheduled, you receive a full refund automatically.` },
  ];

  const isMotorsport = event.event_type === 'motogp' || event.event_type === 'f1' || event.event_type === 'isle_of_man_tt' || (event.title || '').toLowerCase().includes('isle of man');

  return (
    <div className="min-h-screen bg-[hsl(210,20%,98%)]" data-testid="event-details-page">
      <SEOHead title={seoTitle} description={seoDesc} canonicalUrl={pageUrl} type="website" noIndex={true} />
      <EventStructuredData event={event} />
      <BreadcrumbStructuredData items={[
        { name: 'Home', url: 'https://euromatchtickets.com' },
        { name: catLabel, url: `https://euromatchtickets.com/${isF1 ? 'f1-tickets' : isConcert ? 'concerts' : 'events'}` },
        { name: event.title, url: pageUrl }
      ]} />

      {/* ──── HERO ──── */}
      <div ref={heroRef} className="relative">
        <div className="absolute inset-0 h-[480px] md:h-[520px] overflow-hidden">
          <motion.img style={{ y: imgY }} src={event.image_url} alt={event.image_alt || `${event.title} tickets`}
            className="w-full h-[120%] object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/70 to-slate-900" />
          {/* Speed lines for motorsport events */}
          {isMotorsport && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-[30%] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent anim-speed-line" />
              <div className="absolute top-[55%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent anim-speed-line-2" />
              <div className="absolute top-[75%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent anim-speed-line-3" />
            </div>
          )}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 pt-6 pb-6">
          <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition mb-6 backdrop-blur-sm bg-white/10 px-3 py-1.5 rounded-full"
            data-testid="back-btn">
            <ArrowLeft className="w-4 h-4" /> {catLabel}
          </motion.button>

          <div className="max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-3">
              <Calendar className="w-4 h-4 text-amber-400" /> {shortDate}
              <span className="text-white/40">|</span>
              <MapPin className="w-3.5 h-3.5 text-white/50" /> {event.venue}
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.08] text-white mb-3" data-testid="event-h1">
              {event.title} Tickets
            </motion.h1>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.25 }}
              className="flex flex-wrap items-center gap-4 text-white/70 text-sm mb-5">
              <span className="flex items-center gap-1.5"><Flag className="w-4 h-4 text-white/40" />{event.city}{event.country ? `, ${event.country}` : ''}</span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-white/40" />{totalAvailable || event.ticket_count || 0} tickets available</span>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 mb-6">
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-5 py-3">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">From</p>
                <p className="text-3xl font-extrabold text-amber-400">&euro;{lowestPrice}</p>
              </div>
              {savings > 10 && (
                <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-2xl px-4 py-3 backdrop-blur-sm">
                  <p className="text-emerald-300 font-bold text-sm flex items-center gap-1"><TrendingDown className="w-4 h-4" /> Save &euro;{savings}</p>
                  <p className="text-[11px] text-white/50">vs official sellers</p>
                </div>
              )}
              <button onClick={() => document.getElementById('tickets')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-3.5 rounded-full text-base transition-all shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-[0.97]"
                data-testid="hero-cta">
                View All Tickets
              </button>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-4 text-[12px]">
              {[
                { icon: Shield, text: 'FanProtect Guarantee', color: 'text-emerald-400' },
                { icon: Zap, text: 'Instant QR Delivery', color: 'text-amber-400' },
                { icon: Star, text: '4.8/5 (2,847 reviews)', color: 'text-amber-400' },
                { icon: Lock, text: 'Secure Checkout', color: 'text-blue-400' },
              ].map((t, i) => (
                <span key={i} className="flex items-center gap-1.5 text-white/60"><t.icon className={`w-3.5 h-3.5 ${t.color}`} />{t.text}</span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ──── MAIN CONTENT ──── */}
      <div className="max-w-7xl mx-auto px-4 -mt-4 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT - Tickets & Map (2 cols) */}
          <div className="lg:col-span-2 space-y-6" id="tickets">

            {/* Venue Map Section */}
            <FadeIn>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" data-testid="venue-map-section">
                <div className="flex items-center justify-between p-5 pb-3">
                  <div className="flex items-center gap-2">
                    <Grid3X3 className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-lg font-bold text-slate-900">Select Your Section</h2>
                  </div>
                  <button onClick={() => setShowMap(!showMap)}
                    className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 transition">
                    {showMap ? 'Hide' : 'Show'} Map <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMap ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                {showMap && (
                  <div className="px-5 pb-5">
                    <InteractiveVenueMap
                      groupedSections={groupedSections}
                      selectedSection={selectedSection}
                      onSectionSelect={setSelectedSection}
                      eventType={event.event_type}
                      eventTitle={event.title || event.name}
                    />
                    <p className="text-[11px] text-slate-400 mt-3 text-center">Click a section on the map to filter tickets</p>
                  </div>
                )}
              </div>
            </FadeIn>

            {/* Ticket Listings */}
            <FadeIn delay={0.1}>
              <TicketListings
                groupedSections={groupedSections}
                eventId={event.event_id}
                selectedSection={selectedSection}
                onClearFilter={() => setSelectedSection(null)}
              />
            </FadeIn>

            {/* VIP Experience Section */}
            {groupedSections.some(g => g.category === 'vip' || g.category === 'platinum') && (
              <FadeIn delay={0.15}>
                <VIPExperienceSection
                  event={event}
                  vipTickets={groupedSections.filter(g => g.category === 'vip' || g.category === 'platinum')}
                  onBuy={(tier) => navigate(`/checkout?event=${event.event_id}&category=${tier.category === 'platinum' ? 'Platinum' : 'VIP'}&price=${Math.round(tier.lowest_price)}`)}
                />
              </FadeIn>
            )}

            {/* Price Comparison */}
            <FadeIn delay={0.15}>
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm" data-testid="price-comparison">
                <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-emerald-600" /> Price Comparison
                </h3>
                <p className="text-sm text-slate-500 mb-4">How we compare to other ticket sellers</p>
                <div className="space-y-2.5">
                  {[
                    { name: 'Official Box Office', price: officialPrice, delivery: '2-4 weeks' },
                    { name: 'StubHub / Viagogo', price: Math.round(lowestPrice * 1.25), delivery: '1-7 days' },
                    { name: 'Other Resellers', price: Math.round(lowestPrice * 1.15), delivery: '3-5 days' },
                  ].map((comp, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                        <span className="text-sm text-slate-500">{comp.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 line-through text-sm">&euro;{comp.price}</span>
                        <span className="text-slate-400 text-xs hidden sm:block">{comp.delivery}</span>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 border-2 border-emerald-300 relative">
                    <div className="absolute -top-2.5 left-4 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">BEST DEAL</div>
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-sm font-bold text-slate-900">EuroMatchTickets</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-extrabold text-emerald-600">&euro;{lowestPrice}</span>
                      <span className="text-emerald-600 text-xs font-bold hidden sm:flex items-center gap-1"><Zap className="w-3 h-3" />Instant</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100">
                  <TrendingDown className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-700">Save up to &euro;{savings} vs official sellers</span>
                </div>
              </div>
            </FadeIn>

            {/* Why Choose Us */}
            <FadeIn delay={0.2}>
              <div data-testid="why-choose-us">
                <h2 className="text-xl font-extrabold text-slate-900 mb-4">Why 50,000+ Fans Choose Us</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: Shield, title: '100% Buyer Protection', desc: 'FanProtect covers every purchase.', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { icon: Zap, title: 'Instant QR Delivery', desc: 'Tickets on your phone in seconds.', color: 'text-amber-600', bg: 'bg-amber-50' },
                    { icon: TrendingDown, title: 'Best Price Guarantee', desc: `Save €${savings} vs official sellers.`, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { icon: Headphones, title: 'Real Human Support', desc: 'Fan support before, during & after.', color: 'text-violet-600', bg: 'bg-violet-50' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all">
                      <div className={`w-10 h-10 ${item.bg} rounded-lg flex items-center justify-center mb-2`}>
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm mb-0.5">{item.title}</h3>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* SEO Content */}
            <FadeIn delay={0.25}>
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
                  Browse our interactive venue map above to find the perfect section, then choose from {totalAvailable} verified tickets.
                  Every ticket includes instant QR delivery and our full FanProtect guarantee.
                </p>
              </div>
            </FadeIn>

            {/* FAQ */}
            <FadeIn delay={0.3}>
              <div data-testid="faq-section">
                <h2 className="text-xl font-extrabold text-slate-900 mb-4">FAQ &ndash; {event.title}</h2>
                <FAQStructuredData faqs={eventFAQs} />
                <div className="space-y-2">
                  {eventFAQs.map((faq, i) => (
                    <details key={i} className="group rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition" data-testid={`faq-${i}`}>
                      <summary className="p-4 font-bold text-sm text-slate-900 cursor-pointer list-none flex items-center justify-between">
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
          <div className="space-y-5">
            <div className="sticky top-24 space-y-5">

              {/* Quick Buy Card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm" data-testid="quick-buy-card">
                <div className="text-center mb-4">
                  <p className="text-xs text-slate-400 uppercase tracking-widest">Tickets from</p>
                  <p className="text-4xl font-extrabold text-emerald-600 mt-1">&euro;{lowestPrice}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">per person &middot; all fees included</p>
                </div>
                <button onClick={() => document.getElementById('tickets')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-base transition-all shadow-md hover:shadow-lg mb-4"
                  data-testid="sidebar-cta">
                  View {totalAvailable} Tickets
                </button>
                <div className="space-y-2">
                  {['Instant QR delivery', '100% verified tickets', 'FanProtect guarantee', 'Secure Stripe checkout', `Save €${savings} vs others`].map((t, i) => (
                    <div key={i} className="flex items-center gap-2 text-[12px] text-slate-600"><Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />{t}</div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-4 gap-2">
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
                <ScarcityBadge available={totalAvailable || event.available_tickets || event.ticket_count} total={event.total_tickets || 200} />
                <HighDemandBadge eventId={event.event_id} />
                <SocialProofCounter eventId={event.event_id} />
              </div>

              <UrgencyCountdown eventDate={event.event_date} />

              {/* Price Alert */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <PriceAlertButton event={event} />
                <div className="mt-2">
                  <AlertWatchersCount eventId={event.event_id} />
                </div>
              </div>

              {/* Event Details */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <h3 className="font-bold text-sm text-slate-900 mb-3">Event Details</h3>
                <div className="space-y-2 text-[13px]">
                  {[
                    { label: 'Date', value: shortDate },
                    { label: 'Venue', value: event.venue },
                    { label: 'City', value: `${event.city}${event.country ? `, ${event.country}` : ''}` },
                    { label: 'Category', value: catLabel },
                    { label: 'Tickets', value: `${totalAvailable} available`, green: true },
                  ].map((r, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-slate-400">{r.label}</span>
                      <span className={r.green ? 'text-emerald-600 font-bold' : 'text-slate-700'}>{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Venue Map */}
              <VenueInfoSection event={event} />

              {/* Reviews */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />)}</div>
                  <span className="text-xs text-slate-500">4.8/5 (2,847)</span>
                </div>
                {[
                  { name: 'Marco R.', text: 'Best ticket experience. Saved €60!', flag: 'DE' },
                  { name: 'Sophie M.', text: 'Instant delivery. QR worked perfectly.', flag: 'FR' },
                  { name: 'Thomas K.', text: 'Cheapest prices. Real guarantee.', flag: 'UK' },
                ].map((r, i) => (
                  <div key={i} className="py-2 border-t border-slate-100 first:border-0">
                    <p className="text-slate-600 text-xs italic">"{r.text}"</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">{r.name} &middot; {r.flag}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Events */}
        <div className="mt-12">
          <RelatedEventsSection slug={event.slug || event.event_id} category={event.event_type === 'match' ? 'football' : event.event_type} city={event.city} />
        </div>
      </div>

      {/* Mobile Sticky Buy */}
      <div className="mobile-sticky-buy lg:hidden" data-testid="mobile-sticky-buy">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] text-slate-500 uppercase">From</p>
            <p className="text-xl font-extrabold text-slate-900">&euro;{lowestPrice}</p>
          </div>
          <button onClick={() => document.getElementById('tickets')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-full text-sm transition-all shadow-md">
            View {totalAvailable} Tickets
          </button>
        </div>
      </div>

      <RecentlyBoughtPopup />
    </div>
  );
}
