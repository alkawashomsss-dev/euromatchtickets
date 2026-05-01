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
import LiveListingsCounter from "../components/LiveListingsCounter";
import WaitlistCTA from "../components/WaitlistCTA";
import RelatedEventsGraph from "../components/RelatedEventsGraph";
import EditorialByline from "../components/EditorialByline";
import { RecentlyBoughtPopup } from "../components/SalesAccelerator";
import VenueInfoSection from "../components/VenueInfoSection";
import InteractiveVenueMap from "../components/InteractiveVenueMap";
import TicketListings from "../components/TicketListings";
import { PriceAlertButton, ScarcityBadge, HighDemandBadge, SocialProofCounter, UrgencyCountdown, AlertWatchersCount } from "../components/ConversionWidgets";
import { VIPExperienceSection } from "../components/VIPExperience";
import VIPGallery from "../components/VIPGallery";
import { getTop10SEO } from "../data/top10SEO";

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
      .then(res => {
        const data = res.data;
        setEvent(data);
        setLoading(false);
        // If backend tells us to redirect to slug URL, do it immediately
        const redirectSlug = data._redirect_to_slug || data.slug;
        if (redirectSlug && eventId !== redirectSlug) {
          navigate(`/event/${redirectSlug}`, { replace: true });
        }
      })
      .catch(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [eventId, navigate]);

  if (loading) return (
    <div className="min-h-screen bg-[#0e0e14] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!event) return (
    <div className="min-h-screen bg-[#0e0e14] flex items-center justify-center text-center p-8">
      <div className="max-w-md">
        <SEOHead title="Event Not Available" description="This event is no longer available. Browse all upcoming events at EuroMatchTickets." noIndex={true} />
        <h1 className="text-3xl font-black text-white mb-3 uppercase tracking-tight">Event Not Available</h1>
        <p className="text-slate-400 text-sm mb-6">This event may have ended or been removed. Check out our latest events below.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => navigate('/events')} className="bg-[#e10600] text-white font-bold px-6 py-3 hover:bg-[#b80500] transition-colors" data-testid="event-not-found-browse">Browse All Events</button>
          <button onClick={() => navigate('/f1-tickets')} className="bg-white/10 text-white font-bold px-6 py-3 hover:bg-white/20 transition-colors">F1 Tickets</button>
          <button onClick={() => navigate('/champions-league-tickets')} className="bg-white/10 text-white font-bold px-6 py-3 hover:bg-white/20 transition-colors">Champions League</button>
        </div>
      </div>
    </div>
  );

  const groupedSections = event.grouped_sections || [];
  const totalAvailable = groupedSections.reduce((s, g) => s + g.count, 0);
  const rawLowest = groupedSections.length > 0
    ? Math.min(...groupedSections.map(g => g.lowest_price))
    : (event.lowest_price || null);
  const lowestPrice = rawLowest ? Math.round(rawLowest) : null;
  const isComingSoon = event.status === 'coming_soon' || !lowestPrice || totalAvailable === 0;
  const d = new Date(event.event_date);
  const dateStr = d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const shortDate = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  const isF1 = event.event_type === 'f1';
  const isConcert = event.event_type === 'concert';
  const catLabel = isF1 ? 'Formula 1' : isConcert ? 'Concert' : event.event_type === 'motogp' ? 'MotoGP' : 'Football';
  const canonicalSlug = event.slug || eventId;
  const pageUrl = `https://euromatchtickets.com/event/${canonicalSlug}`;
  const isUglyUrl = eventId !== canonicalSlug;
  const listingCount = totalAvailable || event.ticket_count || 0;

  // ─── TOP 10 SEO ENRICHMENT (high-demand events) ───
  const top10 = getTop10SEO(canonicalSlug);

  const seoTitle = top10?.longTailTitle
    ? top10.longTailTitle
    : (isComingSoon
      ? `${event.title} Tickets — Dates, Venue & Waitlist | EuroMatchTickets`
      : `${event.title} Tickets${listingCount > 0 ? ` (${listingCount} Listings)` : ''} — Compare Prices & Availability`);
  const seoDesc = top10?.longTailDesc
    ? top10.longTailDesc
    : (isComingSoon
      ? `${event.title} — ${event.venue || 'venue TBA'}${event.city ? ', ' + event.city : ''}. Tickets not yet on sale. Join the free waitlist and get alerted the moment verified inventory becomes available.`
      : `Compare ${listingCount > 0 ? listingCount + ' verified ' : ''}${event.title} listings from multiple sellers${event.venue ? ' at ' + event.venue : ''}. View current prices, seating options, and availability. Market pricing may vary.`);
  const officialPrice = lowestPrice ? Math.round(lowestPrice * 1.35) : null;
  const savings = officialPrice && lowestPrice ? Math.round(officialPrice - lowestPrice) : null;

  const baseFAQs = [
    { question: `When is ${event.title}?`, answer: `${event.title} takes place on ${dateStr} at ${event.venue} in ${event.city}${event.country ? `, ${event.country}` : ''}.` },
    ...(isComingSoon
      ? [{ question: `Are ${event.title} tickets on sale yet?`, answer: `Tickets are not currently on sale on our marketplace. Join the free waitlist above and we'll email you within 24 hours of verified inventory going live — no spam, no auto-subscribe.` }]
      : [{ question: `How much are ${event.title} tickets?`, answer: `Tickets start from €${lowestPrice}. All prices are verified-seller prices — we don't publish fake "from" anchors.` }]),
    { question: `How will I receive my tickets?`, answer: `All tickets are delivered as secure QR codes to your email and phone. No printing needed.` },
    { question: `Is it safe to buy from EuroMatchTickets?`, answer: `Every purchase is protected by our Buyer protection: verified sellers, escrowed payment until the event, and a full refund if the event is cancelled.` },
    { question: `Can I get a refund?`, answer: `If the event is cancelled or significantly rescheduled, you receive a full refund automatically.` }
  ];

  // Merge with long-tail FAQs for TOP-10 high-demand events
  const eventFAQs = top10?.extraFAQs
    ? [...top10.extraFAQs, ...baseFAQs]
    : baseFAQs;

  const isMotorsport = event.event_type === 'motogp' || event.event_type === 'f1' || event.event_type === 'isle_of_man_tt' || (event.title || '').toLowerCase().includes('isle of man');

  // Thin-page detection — noindex if we have nothing real to offer:
  // unknown slug (ugly URL) OR coming_soon without even a venue/date to anchor content.
  // ALSO respect DB flag `seo_indexable: false` (set by scripts/tag_seo_indexable.py
  // for low-quality auto-generated pages like WC group matches, attractions, duplicate nights).
  const isThinPage =
    isUglyUrl ||
    (isComingSoon && !event.venue && !event.city) ||
    event.seo_indexable === false;

  return (
    <div className="min-h-screen bg-[#0e0e14]" data-testid="event-details-page">
      <SEOHead title={seoTitle} description={seoDesc} canonicalUrl={pageUrl} type="website" noIndex={isThinPage} image={event.image_url} keywords={top10?.keywords || null} />
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
              {!isComingSoon && (
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-white/40" />{listingCount} listings · prices updated recently</span>
              )}
            </motion.div>

            {/* Live Listings Counter — auto-refreshing real-data signal */}
            {!isComingSoon && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.35 }} className="mb-4">
                <LiveListingsCounter searchQuery={event.title} fallbackLabel="listings" />
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 mb-6">
              {isComingSoon ? (
                <div className="backdrop-blur-xl bg-amber-500/10 border border-amber-400/40 rounded-none px-5 py-4 max-w-md" data-testid="coming-soon-block">
                  <p className="text-[10px] text-amber-300 uppercase tracking-widest font-bold mb-1">Coming soon</p>
                  <p className="text-sm text-white/80 mb-3">No verified tickets available yet. Join the free waitlist — we'll email you the moment inventory drops.</p>
                  <WaitlistCTA slug={canonicalSlug} eventTitle={event.title} compact />
                </div>
              ) : (
                <>
                  <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-none px-5 py-3">
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">From</p>
                    <p className="text-3xl font-extrabold text-amber-400">&euro;{lowestPrice}</p>
                    <p className="text-[10px] text-white/40 mt-0.5">market pricing may vary</p>
                  </div>
                  <button onClick={() => document.getElementById('tickets')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-emerald-500/100 hover:bg-emerald-400 text-white font-bold px-8 py-3.5 rounded-full text-base transition-all shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-[0.97]"
                    data-testid="hero-cta">
                    View All Tickets
                  </button>
                </>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-4 text-[12px]">
              {[
                { icon: Shield, text: 'Buyer protection', color: 'text-emerald-400' },
                { icon: Zap, text: 'QR ticket delivery', color: 'text-amber-400' },
                { icon: Lock, text: 'Secure checkout', color: 'text-blue-400' }
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

            {/* Venue Map — only when we have confirmed inventory */}
            {!isComingSoon && (
              <FadeIn>
                <div className="bg-[#1e1e1e] rounded-none border border-white/10 shadow-sm overflow-hidden" data-testid="venue-map-section">
                  <div className="flex items-center justify-between p-5 pb-3">
                    <div className="flex items-center gap-2">
                      <Grid3X3 className="w-5 h-5 text-emerald-600" />
                      <h2 className="text-lg font-bold text-white">Select Your Section</h2>
                    </div>
                    <button onClick={() => setShowMap(!showMap)}
                      className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition">
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
            )}

            {/* Ticket Listings — only when we have confirmed inventory */}
            {!isComingSoon && (
              <FadeIn delay={0.1}>
                <TicketListings
                  groupedSections={groupedSections}
                  eventId={event.event_id}
                  selectedSection={selectedSection}
                  onClearFilter={() => setSelectedSection(null)}
                />
              </FadeIn>
            )}

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

            {/* VIP Experience Gallery — real photos */}
            <FadeIn delay={0.18}>
              <VIPGallery eventType={event.event_type} />
            </FadeIn>

            {/* Pricing (H2) — honest market-pricing context, no fake "official" anchors */}
            {!isComingSoon && lowestPrice && (
              <FadeIn delay={0.22}>
                <div className="bg-[#1e1e1e] rounded-none border border-white/10 p-6 shadow-sm" data-testid="pricing-section">
                  <h2 className="text-xl font-extrabold text-white mb-3">Prices</h2>
                  <p className="text-sm text-slate-400 mb-4">
                    Verified-seller inventory for {event.title}. Market pricing may vary — these are live listings on our platform, not estimated or averaged quotes.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#15151e] border border-white/5 p-4">
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Entry level</p>
                      <p className="text-2xl font-extrabold text-white">From €{lowestPrice}</p>
                      <p className="text-[11px] text-slate-500 mt-1">market pricing may vary</p>
                    </div>
                    <div className="bg-[#15151e] border border-white/5 p-4">
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Premium / VIP</p>
                      <p className="text-2xl font-extrabold text-white">From €{Math.round(lowestPrice * 4)}</p>
                      <p className="text-[11px] text-slate-500 mt-1">hospitality & paddock-tier seats</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            )}

            {/* Location (H2) */}
            <FadeIn delay={0.25}>
              <div className="bg-[#1e1e1e] rounded-none border border-white/10 p-6 shadow-sm" data-testid="location-section">
                <h2 className="text-xl font-extrabold text-white mb-3">Location</h2>
                <p className="text-sm text-slate-400 leading-relaxed mb-3">
                  {event.title} takes place at <strong className="text-white">{event.venue || 'venue TBA'}</strong>
                  {event.city ? ` in ${event.city}` : ''}{event.country ? `, ${event.country}` : ''}.
                </p>
                <div className="grid grid-cols-2 gap-3 text-[13px]">
                  <div><span className="text-slate-500">Venue:</span> <span className="text-white font-semibold">{event.venue || 'TBA'}</span></div>
                  <div><span className="text-slate-500">Date:</span> <span className="text-white font-semibold">{shortDate}</span></div>
                  <div><span className="text-slate-500">City:</span> <span className="text-white font-semibold">{event.city || 'TBA'}</span></div>
                  <div><span className="text-slate-500">Category:</span> <span className="text-white font-semibold">{catLabel}</span></div>
                </div>
              </div>
            </FadeIn>

            {/* SEO intro content */}
            <FadeIn delay={0.28}>
              <div className="prose-light" data-testid="seo-content-block">
                <h2>About {event.title}</h2>
                {top10?.seoIntro && (
                  <p className="lead"><strong>{top10.seoIntro}</strong></p>
                )}
                {isComingSoon ? (
                  <p>
                    {event.title}{event.venue ? ` at ${event.venue}` : ''}{event.city ? `, ${event.city}` : ''} is scheduled for {shortDate}.
                    Verified-seller inventory is not yet live on our marketplace. Join the waitlist above to be alerted within 24 hours of tickets going on sale — no spam, no auto-subscribe.
                  </p>
                ) : (
                  <p>
                    {event.title}{event.venue ? ` is held at ${event.venue}` : ''}{event.city ? ` in ${event.city}` : ''}{event.country ? `, ${event.country}` : ''}.
                    Browse the interactive venue map above to pick your section, then choose from {totalAvailable} verified listings. Prices start from €{lowestPrice} (market pricing may vary).
                  </p>
                )}
              </div>
            </FadeIn>

            {/* FAQ */}
            <FadeIn delay={0.3}>
              <div data-testid="faq-section">
                <h2 className="text-xl font-extrabold text-white mb-4">FAQ &ndash; {event.title}</h2>
                <FAQStructuredData faqs={eventFAQs} />
                <div className="space-y-2">
                  {eventFAQs.map((faq, i) => (
                    <details key={i} className="group rounded-none border border-white/10 bg-[#1e1e1e] hover:border-white/15 transition" data-testid={`faq-${i}`}>
                      <summary className="p-4 font-bold text-sm text-white cursor-pointer list-none flex items-center justify-between">
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

              {/* Quick Buy Card — ONLY when inventory is real */}
              {!isComingSoon && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-[#1e1e1e] rounded-none border border-white/10 p-5 shadow-sm" data-testid="quick-buy-card">
                  <div className="text-center mb-4">
                    <p className="text-xs text-slate-400 uppercase tracking-widest">Tickets from</p>
                    <p className="text-4xl font-extrabold text-emerald-600 mt-1">&euro;{lowestPrice}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">per person &middot; all fees included</p>
                  </div>
                  <button onClick={() => document.getElementById('tickets')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full py-3.5 bg-emerald-500/100 hover:bg-emerald-600 text-white font-bold rounded-none text-base transition-all shadow-md hover:shadow-lg mb-4"
                    data-testid="sidebar-cta">
                    View {totalAvailable} Tickets
                  </button>
                  <div className="space-y-2">
                    {['QR ticket delivery', 'Escrowed payment', 'Cancellation refund'].map((t, i) => (
                      <div key={i} className="flex items-center gap-2 text-[12px] text-slate-400"><Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />{t}</div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-4 gap-2">
                    {[
                      { name: 'VISA', bg: 'bg-blue-600 text-white' },
                      { name: 'MC', bg: 'bg-red-600 text-white' },
                      { name: 'AMEX', bg: 'bg-blue-800 text-white' },
                      { name: 'PAY', bg: 'bg-slate-900 text-white' }
                    ].map(p => (
                      <div key={p.name} className={`text-[10px] ${p.bg} py-1.5 rounded text-center font-bold`}>{p.name}</div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Waitlist card (sidebar) — ONLY when coming_soon */}
              {isComingSoon && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-[#1e1e1e] rounded-none border border-amber-500/30 p-5 shadow-sm" data-testid="sidebar-waitlist">
                  <p className="text-[10px] text-amber-300 uppercase tracking-widest font-bold mb-2">Coming soon</p>
                  <p className="text-sm text-white/80 mb-3">No verified tickets available yet. Join the free waitlist — we'll email you within 24h of the first drop.</p>
                  <WaitlistCTA slug={canonicalSlug} eventTitle={event.title} compact />
                </motion.div>
              )}

              {/* Conversion Widgets — only when inventory is real */}
              {!isComingSoon && (
                <div className="space-y-3">
                  <ScarcityBadge available={totalAvailable || event.available_tickets || event.ticket_count} total={event.total_tickets || 200} />
                  <HighDemandBadge eventId={event.event_id} />
                  <SocialProofCounter eventId={event.event_id} />
                </div>
              )}

              <UrgencyCountdown eventDate={event.event_date} />

              {/* Price Alert */}
              <div className="bg-[#1e1e1e] border border-white/10 rounded-none p-4 shadow-sm">
                <PriceAlertButton event={event} />
                <div className="mt-2">
                  <AlertWatchersCount eventId={event.event_id} />
                </div>
              </div>

              {/* Event Details */}
              <div className="bg-[#1e1e1e] border border-white/10 rounded-none p-4 shadow-sm">
                <h3 className="font-bold text-sm text-white mb-3">Event Details</h3>
                <div className="space-y-2 text-[13px]">
                  {[
                    { label: 'Date', value: shortDate },
                    { label: 'Venue', value: event.venue },
                    { label: 'City', value: `${event.city}${event.country ? `, ${event.country}` : ''}` },
                    { label: 'Category', value: catLabel },
                    { label: 'Tickets', value: `${totalAvailable} available`, green: true }
                  ].map((r, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-slate-400">{r.label}</span>
                      <span className={r.green ? 'text-emerald-600 font-bold' : 'text-slate-300'}>{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Venue Map */}
              <VenueInfoSection event={event} />

              {/* Reviews */}
              <div className="bg-[#1e1e1e] border border-white/10 rounded-none p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />)}</div>
                  <span className="text-xs text-slate-500">Customer reviews</span>
                </div>
                {[
                  { name: 'Marco R.', text: 'Great service — QR delivered same day.', flag: 'DE' },
                  { name: 'Sophie M.', text: 'Instant delivery and the QR worked at the gate.', flag: 'FR' },
                  { name: 'Thomas K.', text: 'Easy checkout, clear pricing, would use again.', flag: 'UK' }
                ].map((r, i) => (
                  <div key={i} className="py-2 border-t border-white/5 first:border-0">
                    <p className="text-slate-400 text-xs italic">"{r.text}"</p>
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

      {/* Mobile Sticky Buy — only when confirmed inventory exists */}
      {!isComingSoon && (
        <div className="mobile-sticky-buy lg:hidden" data-testid="mobile-sticky-buy">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] text-slate-500 uppercase">From</p>
              <p className="text-xl font-extrabold text-white">&euro;{lowestPrice}</p>
            </div>
            <button onClick={() => document.getElementById('tickets')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-emerald-500/100 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-full text-sm transition-all shadow-md">
              View {totalAvailable} Tickets
            </button>
          </div>
        </div>
      )}

      {/* Internal linking graph — same type / same city / intent guides */}
      <RelatedEventsGraph
        currentEvent={event}
        intentLinks={
          event.event_type === 'f1'
            ? [
                { to: '/how-to-buy-f1-tickets', label: 'How to buy F1 tickets' },
                { to: '/f1-ticket-prices-guide', label: 'F1 ticket prices guide' },
                { to: '/f1-2026-schedule', label: 'F1 2026 full calendar' },
              ]
            : event.event_type === 'motogp'
            ? [
                { to: '/motogp-2026-schedule', label: 'MotoGP 2026 calendar' },
                { to: '/motogp-tickets', label: 'All MotoGP tickets' },
              ]
            : event.event_type === 'worldcup'
            ? [
                { to: '/world-cup-2026-tickets', label: 'FIFA World Cup 2026 overview' },
                { to: '/world-cup-2026-schedule', label: 'World Cup full schedule' },
              ]
            : event.event_type === 'concert'
            ? [
                { to: '/concerts-in-london-2026', label: 'London concerts 2026' },
                { to: '/concerts-in-paris-2026', label: 'Paris concerts 2026' },
                { to: '/concerts-in-amsterdam-2026', label: 'Amsterdam concerts 2026' },
              ]
            : [
                { to: '/events', label: 'Browse all events' },
                { to: '/buyer-protection', label: 'Buyer protection policy' },
              ]
        }
      />

      {/* E-E-A-T byline */}
      <section className="py-8 bg-[#0e0e14]">
        <div className="max-w-4xl mx-auto px-4">
          <EditorialByline topic={event.title} />
        </div>
      </section>

      <RecentlyBoughtPopup />
    </div>
  );
}
