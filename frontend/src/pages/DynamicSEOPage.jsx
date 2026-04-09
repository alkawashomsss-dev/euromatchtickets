import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, Shield, Clock, CreditCard, Star, ChevronRight, Tag, MapPin, Calendar, Ticket, ChevronDown, HelpCircle, AlertCircle, Users, TrendingUp, Globe } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
import { InternalLinks } from "../components/InternalLinks";
import { RelatedEventsSection } from "../components/RelatedEventsSection";
import { PriceDropAlert, ExitIntentPopup } from "../components/PriceDropAlert";
import axios from "axios";
import { API } from "../App";

/* FAQ Accordion Item */
const FAQItem = ({ question, answer, isOpen, onClick, index }) => (
  <div className="border border-slate-200 rounded-lg overflow-hidden" data-testid={`faq-item-${index}`}>
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-slate-50 transition-colors"
      aria-expanded={isOpen}
    >
      <span className="font-semibold text-slate-900 text-sm pr-4">{question}</span>
      <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    {isOpen && (
      <div className="px-5 pb-4 bg-white border-t border-slate-100">
        <p className="text-slate-600 text-sm leading-relaxed pt-3">{answer}</p>
      </div>
    )}
  </div>
);

/* FAQ Section with Schema */
const FAQSection = ({ faqs, title }) => {
  const [openIndex, setOpenIndex] = useState(0);
  if (!faqs || faqs.length === 0) return null;
  return (
    <section className="mt-10" data-testid="faq-section">
      <div className="flex items-center gap-3 mb-5">
        <HelpCircle className="w-5 h-5 text-emerald-500" />
        <h2 className="text-xl font-bold text-slate-900">{title || 'Frequently Asked Questions'}</h2>
      </div>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <FAQItem
            key={i}
            index={i}
            question={faq[0]}
            answer={faq[1]}
            isOpen={openIndex === i}
            onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
          />
        ))}
      </div>
    </section>
  );
};

const categoryStyles = {
  f1: { accent: "#e10600", bg: "from-red-900/40 to-slate-900", badge: "bg-red-600 text-white" },
  football: { accent: "#1e88e5", bg: "from-blue-900/40 to-slate-900", badge: "bg-blue-600 text-white" },
  concert: { accent: "#9c27b0", bg: "from-purple-900/40 to-slate-900", badge: "bg-purple-600 text-white" },
  worldcup: { accent: "#2e7d32", bg: "from-green-900/40 to-slate-900", badge: "bg-green-600 text-white" },
  motogp: { accent: "#ff6d00", bg: "from-orange-900/40 to-slate-900", badge: "bg-orange-600 text-white" },
};

const renderMarkdown = (md) => {
  if (!md) return "";
  let html = md;
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-slate-900 mt-6 mb-2">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-slate-900 mt-8 mb-3 border-b border-slate-200 pb-2">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">$1</h1>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="text-slate-900 font-semibold">$1</strong>');
  html = html.replace(/^\| (.+)/gm, (match) => {
    const cells = match.split("|").filter(c => c.trim());
    if (cells.every(c => c.trim().match(/^[-:]+$/))) return "";
    const row = cells.map(c => `<td class="px-3 py-2 border border-slate-200 text-sm">${c.trim()}</td>`).join("");
    return `<tr class="hover:bg-slate-50">${row}</tr>`;
  });
  html = html.replace(/((<tr[^]*?<\/tr>\s*)+)/g, '<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 rounded-lg">$1</table></div>');
  html = html.replace(/^- (.+)$/gm, '<li class="text-slate-600 ml-4 mb-1 list-disc">$1</li>');
  html = html.replace(/((<li[^]*?<\/li>\s*)+)/g, '<ul class="my-3">$1</ul>');
  html = html.replace(/^(?!<[hultd]|<div|<str)(.+)$/gm, (match) => {
    if (match.trim() === "") return "";
    return `<p class="text-slate-600 mb-3 leading-relaxed">${match}</p>`;
  });
  return html;
};

const LANG_REDIRECTS = {
  de: '/de/tickets-kaufen',
  es: '/es/comprar-entradas',
  fr: '/fr/acheter-billets',
  it: '/it/biglietti',
};

export default function DynamicSEOPage() {
  const { slug } = useParams();

  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [gone, setGone] = useState(false);
  const [buyLink, setBuyLink] = useState("/events");

  // Get pre-hydrated FAQ data from vanilla JS
  const prehydratedFAQ = typeof window !== 'undefined' ? window.__seoFAQ : null;

  const [redirectTo, setRedirectTo] = useState(null);

  // Check if slug is a bare language code
  const isLangRedirect = slug && LANG_REDIRECTS[slug.toLowerCase()];

  useEffect(() => {
    if (isLangRedirect) return; // Skip fetch for language redirects
    const fetchPage = async () => {
      try {
        const res = await axios.get(`${API}/seo/page/${slug}`);
        // Handle 301 redirect (2025→2026)
        if (res.data && res.data.redirect_to) {
          setRedirectTo(`/${res.data.redirect_to}`);
          return;
        }
        setPage(res.data);
        // Find matching event for Buy buttons - try progressively shorter search terms
        const rawKeywords = slug.replace(/-tickets.*$/, '').replace(/-20\d{2}.*$/, '').replace(/-/g, ' ').trim();
        if (rawKeywords.length > 2) {
          let foundEvent = false;
          // Try full keywords first, then progressively remove last word
          const words = rawKeywords.split(' ');
          for (let i = words.length; i >= Math.min(2, words.length) && !foundEvent; i--) {
            const searchTerm = words.slice(0, i).join(' ');
            try {
              const evRes = await axios.get(`${API}/events?search=${encodeURIComponent(searchTerm)}&limit=1`);
              if (evRes.data && evRes.data.length > 0) {
                const ev = evRes.data[0];
                setBuyLink(`/event/${ev.slug || ev.event_id}`);
                foundEvent = true;
              }
            } catch { /* continue to next attempt */ }
          }
          if (!foundEvent) {
            setBuyLink(`/events?search=${encodeURIComponent(words.slice(0, 2).join(' '))}`);
          }
        }
      } catch (err) {
        const status = err?.response?.status;
        if (status === 410) {
          setGone(true);
        }
        setNotFound(true);
        // Still try to find matching event for fallback page
        const rawKw = slug.replace(/-tickets.*$/, '').replace(/-20\d{2}.*$/, '').replace(/-/g, ' ').trim();
        if (rawKw.length > 2) {
          const w = rawKw.split(' ');
          for (let i = w.length; i >= Math.min(2, w.length); i--) {
            try {
              const evRes = await axios.get(`${API}/events?search=${encodeURIComponent(w.slice(0, i).join(' '))}&limit=1`);
              if (evRes.data && evRes.data.length > 0) {
                setBuyLink(`/event/${evRes.data[0].slug || evRes.data[0].event_id}`);
                break;
              }
            } catch { /* continue */ }
          }
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

  // Redirect bare language codes to their landing pages (after all hooks)
  if (isLangRedirect) {
    return <Navigate to={LANG_REDIRECTS[slug.toLowerCase()]} replace />;
  }

  // Handle 301 redirect (e.g., 2025→2026 pages)
  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(210,20%,98%)] flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (gone) {
    // Page was explicitly deactivated - redirect to events to keep user engaged
    return (
      <div className="min-h-screen bg-[hsl(210,20%,98%)] flex flex-col items-center justify-center gap-6 px-4" data-testid="seo-page-not-found">
        <h1 className="text-4xl font-black text-slate-900">Event Ended</h1>
        <p className="text-slate-500 text-center max-w-md">This event has ended. Browse our latest events and find great tickets at the cheapest prices!</p>
        <div className="flex gap-3">
          <Link to={buyLink}><Button className="bg-emerald-600 hover:bg-emerald-500 text-white">Browse Similar Events</Button></Link>
          <Link to="/events"><Button variant="outline">All Events</Button></Link>
        </div>
      </div>
    );
  }

  if (notFound || !page) {
    // API failed but page may be valid - show real content from slug to prevent Soft 404.
    // Vanilla JS already set correct meta tags. Show a real ticket page.
    const prettyName = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const isF1 = slug.includes('f1') || slug.includes('grand-prix') || slug.includes('gp-');
    const isFootball = slug.includes('tickets') && (slug.includes('real-madrid') || slug.includes('barcelona') || slug.includes('liverpool') || slug.includes('arsenal') || slug.includes('bayern') || slug.includes('psg') || slug.includes('juventus') || slug.includes('manchester') || slug.includes('clasico') || slug.includes('champions'));
    const isConcert = slug.includes('tour') || slug.includes('swift') || slug.includes('mars') || slug.includes('weeknd') || slug.includes('coldplay') || slug.includes('bunny');
    const cat = isF1 ? 'f1' : isFootball ? 'football' : isConcert ? 'concert' : 'f1';
    const fallbackStyle = categoryStyles[cat] || categoryStyles.f1;

    return (
      <div className="min-h-screen bg-[hsl(210,20%,98%)]" data-testid="dynamic-seo-page">
        <div className={`relative bg-gradient-to-b ${fallbackStyle.bg} py-16 sm:py-20`}>
          <div className="max-w-5xl mx-auto px-4">
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/events" className="hover:text-white transition">Events</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-600">{prettyName}</span>
            </nav>
            <Badge className={fallbackStyle.badge}>{cat.toUpperCase()}</Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 mt-4">{prettyName}</h1>
            <p className="text-lg text-slate-400 max-w-3xl mb-6">Buy verified {prettyName.toLowerCase()} at Europe's cheapest prices. 100% guaranteed with instant QR delivery and FanProtect buyer protection.</p>
            <div className="flex flex-wrap items-center gap-4">
              <Link to={buyLink}>
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-6 text-lg rounded-xl">
                  <Ticket className="w-5 h-5 mr-2" /> Secure Your Seat Now
                </Button>
              </Link>
              <p className="text-emerald-400 text-sm font-medium mt-2">Up to 40% cheaper than Viagogo &amp; StubHub</p>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-slate-900 mb-4">About {prettyName}</h2>
              <p className="text-slate-600 mb-4 leading-relaxed">Looking for {prettyName.toLowerCase()}? EuroMatchTickets offers the cheapest verified tickets in Europe with instant e-ticket delivery. Every purchase is protected by our FanProtect money-back guarantee.</p>
              <h3 className="text-lg font-bold text-slate-900 mt-6 mb-2">Why Buy From EuroMatchTickets?</h3>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-2"><Shield className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />100% verified tickets with FanProtect guarantee</li>
                <li className="flex items-start gap-2"><Clock className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />Instant e-ticket delivery via QR code</li>
                <li className="flex items-start gap-2"><CreditCard className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />Secure payment with Stripe encryption</li>
                <li className="flex items-start gap-2"><Star className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />4.8/5 rating from 12,000+ verified buyers</li>
              </ul>
              {/* FAQ Section for fallback pages */}
              {prehydratedFAQ && prehydratedFAQ.length > 0 && (
                <FAQSection faqs={prehydratedFAQ} title={`${prettyName} - FAQ`} />
              )}
            </div>
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="font-bold text-slate-900 mb-4">Buyer Protection</h3>
                <div className="space-y-3">
                  {[
                    { icon: Shield, text: "500,000+ Tickets Sold", sub: "100% Money Back Guarantee" },
                    { icon: CreditCard, text: "Secure Payment", sub: "Stripe encrypted checkout" },
                    { icon: Clock, text: "Instant QR Delivery", sub: "E-tickets sent immediately" },
                    { icon: Star, text: "4.9/5 from 12,000+ Reviews", sub: "Trusted in 25+ countries" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <item.icon className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-slate-900 text-sm font-medium">{item.text}</p>
                        <p className="text-slate-400 text-xs">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-emerald-900/30 border border-emerald-800/50 rounded-xl p-6 text-center">
                <p className="text-emerald-600 font-semibold mb-2">Limited Availability</p>
                <p className="text-slate-500 text-sm mb-4">Prices increase as events approach. Book now for the best deals.</p>
                <Link to="/events">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white">View Available Seats</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const style = categoryStyles[page.category] || categoryStyles.concert;

  return (
    <>
      <SEOHead
        title={page.title}
        description={page.meta_description || page.description}
        keywords={page.keywords}
        image={page.image}
        canonicalUrl={`https://euromatchtickets.com/${page.slug}`}
        noIndex={page.noindex || false}
      />

      {/* Category-based image mapping for structured data */}
      {(() => {
        const BASE = "https://euromatchtickets.com";
        const CAT_IMAGES = {
          f1: `${BASE}/images/heroes/f1-red-lg.webp`,
          motorsport: `${BASE}/images/heroes/f1-red-lg.webp`,
          motogp: `${BASE}/images/heroes/motogp-lg.webp`,
          football: `${BASE}/images/heroes/football-stadium-lg.webp`,
          concert: `${BASE}/images/heroes/concert-purple-lg.webp`,
          worldcup: `${BASE}/images/heroes/football-stadium-lg.webp`,
        };
        const eventImage = `/product-images/${page.slug}.jpg`;
        const eventName = page.event_name || page.artist || page.title?.split("|")[0]?.split("–")[0]?.trim();
        const eventDesc = page.meta_description || `${eventName} tickets available now. Verified sellers, instant QR delivery.`;
        const productDesc = page.meta_description || `${eventName} tickets. From EUR ${page.price_low || 49}. Verified sellers, instant QR delivery.`;
        
        // Category-specific organizer and brand
        const orgMap = { 
          f1: { name: "Formula One World Championship", url: "https://www.formula1.com" },
          football: { name: "UEFA", url: "https://www.uefa.com" },
          concert: { name: eventName, url: `https://euromatchtickets.com/${page.slug}` },
          worldcup: { name: "FIFA", url: "https://www.fifa.com" },
          motorsport: { name: "FIM", url: "https://www.fim-moto.com" },
          motogp: { name: "FIM MotoGP", url: "https://www.motogp.com" }
        };
        const brandMap = { f1: "Formula 1", football: "UEFA", concert: page.artist || eventName, worldcup: "FIFA", motorsport: "MotoGP", motogp: "MotoGP" };
        const organizer = orgMap[page.category] || { name: eventName, url: `https://euromatchtickets.com/${page.slug}` };
        const brand = brandMap[page.category] || "EuroMatchTickets";
        
        // Smart date generation
        const eventDate = page.event_date || page.start_date;
        const eventYear = page.year || 2026;
        const monthMap = { f1: "06", football: "05", concert: "07", worldcup: "06", motorsport: "06", motogp: "06" };
        const defaultMonth = monthMap[page.category] || "06";
        const smartStartDate = eventDate || `${eventYear}-${defaultMonth}-15`;
        const smartEndDate = page.end_date || eventDate || `${eventYear}-${defaultMonth}-15`;
        
        // Varied review counts per page (deterministic based on slug)
        const slugHash = page.slug?.split('').reduce((a, c) => a + c.charCodeAt(0), 0) || 100;
        const reviewCount = String(200 + (slugHash % 800));
        const ratingValue = String((4.5 + (slugHash % 5) / 10).toFixed(1));

        return (
          <>
      {/* Structured Data - Event + Product + Review Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": page.category === "concert" ? "MusicEvent" : "SportsEvent",
            "name": eventName,
            "description": eventDesc,
            "image": [`${BASE}/product-images/${page.slug}.jpg`],
            "url": `${BASE}/${page.slug}`,
            "startDate": smartStartDate,
            "endDate": smartEndDate,
            "eventStatus": "https://schema.org/EventScheduled",
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "location": {
              "@type": "Place",
              "name": page.venue || page.city || "Europe",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": page.city || "Europe",
                "addressCountry": page.country || "EU"
              }
            },
            "performer": {
              "@type": page.artist ? "PerformingGroup" : "Organization",
              "name": page.artist || organizer.name
            },
            "offers": {
              "@type": "AggregateOffer",
              "lowPrice": String(page.price_low || 49),
              "highPrice": String(page.price_high || (page.price_low ? page.price_low * 8 : 1500)),
              "priceCurrency": "EUR",
              "offerCount": "100",
              "availability": "https://schema.org/InStock",
              "url": `${BASE}/${page.slug}`,
              "validFrom": "2025-06-01",
              "seller": { "@type": "Organization", "name": "EuroMatchTickets", "url": BASE }
            },
            "organizer": { "@type": "Organization", "name": organizer.name, "url": organizer.url }
          },
          {
            "@type": "Product",
            "name": `${eventName} Tickets`,
            "description": productDesc,
            "image": [`${BASE}/product-images/${page.slug}.jpg`],
            "url": `${BASE}/${page.slug}`,
            "brand": { "@type": "Organization", "name": brand },
            "offers": {
              "@type": "AggregateOffer",
              "lowPrice": String(page.price_low || 49),
              "highPrice": String(page.price_high || (page.price_low ? page.price_low * 8 : 1500)),
              "priceCurrency": "EUR",
              "offerCount": "100",
              "availability": "https://schema.org/InStock",
              "url": `${BASE}/${page.slug}`
            },
            "aggregateRating": { "@type": "AggregateRating", "ratingValue": ratingValue, "reviewCount": reviewCount, "bestRating": "5", "worstRating": "1" },
            "review": [
              { "@type": "Review", "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }, "author": { "@type": "Person", "name": "Marco R." }, "reviewBody": "Tickets arrived instantly via QR code. Smooth process.", "datePublished": "2026-01-15" },
              { "@type": "Review", "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }, "author": { "@type": "Person", "name": "Sophie M." }, "reviewBody": "Great prices and the FanProtect guarantee gave me confidence.", "datePublished": "2026-02-08" }
            ]
          }
        ]
      })}} />

      {/* Breadcrumb Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://euromatchtickets.com" },
          ...(page.category === "f1" ? [{ "@type": "ListItem", "position": 2, "name": "F1 Tickets", "item": "https://euromatchtickets.com/f1-tickets" }] :
             page.category === "football" ? [{ "@type": "ListItem", "position": 2, "name": "Football", "item": "https://euromatchtickets.com/events?type=football" }] :
             page.category === "concert" ? [{ "@type": "ListItem", "position": 2, "name": "Concerts", "item": "https://euromatchtickets.com/events?type=concert" }] :
             page.category === "worldcup" ? [{ "@type": "ListItem", "position": 2, "name": "World Cup 2026", "item": "https://euromatchtickets.com/world-cup-2026" }] : []),
          { "@type": "ListItem", "position": 3, "name": page.title?.split("|")[0]?.trim() }
        ]
      })}} />

      {/* FAQPage Schema - for Google FAQ rich snippets */}
      {/* Use prehydratedFAQ if available, otherwise fall back to page.faq from API */}
      {((prehydratedFAQ && prehydratedFAQ.length > 0) || (page.faq && page.faq.length > 0)) && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": (prehydratedFAQ && prehydratedFAQ.length > 0 ? prehydratedFAQ : page.faq).map(qa => ({
            "@type": "Question",
            "name": qa[0],
            "acceptedAnswer": { "@type": "Answer", "text": qa[1] }
          }))
        })}} />
      )}
          </>
        );
      })()}

      <div className="min-h-screen bg-[hsl(210,20%,98%)]" data-testid="dynamic-seo-page">
        {/* Dynamic urgency: realistic numbers that change every 5 minutes */}
        {(() => {
          const slugHash = (page?.slug || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
          const timeSeed = Math.floor(Date.now() / 300000);
          const ticketsLeft = 3 + ((slugHash + timeSeed) % 19);
          const viewingNow = 12 + ((slugHash + timeSeed * 3) % 85);
          // Store for use in sticky bar
          if (typeof window !== 'undefined') {
            window.__ticketsLeft = ticketsLeft;
            window.__viewingNow = viewingNow;
          }
          return null;
        })()}
        {/* Hero */}
        <div className={`relative bg-gradient-to-b ${style.bg} py-16 sm:py-20`}>
          <div className="max-w-5xl mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6" data-testid="seo-breadcrumb">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <ChevronRight className="w-3 h-3" />
              {page.category === "f1" && <Link to="/f1-tickets" className="hover:text-white transition">F1 Tickets</Link>}
              {page.category === "football" && <Link to="/events?type=football" className="hover:text-white transition">Football</Link>}
              {page.category === "concert" && <Link to="/events?type=concert" className="hover:text-white transition">Concerts</Link>}
              {page.category === "worldcup" && <Link to="/world-cup-2026" className="hover:text-white transition">World Cup 2026</Link>}
              {page.category !== "concerts" && page.category !== "football" && page.category !== "sports" && page.category !== "events" && (
                <>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-slate-600">{page.event_name || page.artist || page.city || page.stage || ""}</span>
                </>
              )}
            </nav>

            {/* Google Merchant Center Required: Resale Marketplace Disclosure */}
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-1.5 rounded-md mb-4" data-testid="resale-disclosure">
              <Shield className="w-3 h-3 flex-shrink-0" />
              <span>Independent resale marketplace. Prices may be above or below face value. All sales are final. <Link to="/buyer-protection" className="underline font-medium">FanProtect Guarantee</Link></span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className={style.badge} data-testid="seo-category-badge">
                {page.category?.toUpperCase()}
              </Badge>
              {page.city && page.city !== "Europe" && (
                <Badge variant="outline" className="text-slate-600 border-slate-300">
                  <MapPin className="w-3 h-3 mr-1" /> {page.city}
                </Badge>
              )}
              {page.year && (
                <Badge variant="outline" className="text-slate-600 border-slate-300">
                  <Calendar className="w-3 h-3 mr-1" /> {page.year}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3" data-testid="seo-page-title">
              {page.title?.split("|")[0]?.trim()}
            </h1>

            {/* Subheadline - Trust + Delivery */}
            <p className="text-base text-slate-300 mb-3 max-w-2xl">
              {page.venue ? `Official resale tickets for ${page.venue}. ` : ''}Instant delivery. 100% money-back guarantee.
            </p>

            {/* Reviews Badge */}
            <div className="flex items-center gap-2 mb-4" data-testid="reviews-badge">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-yellow-400 font-semibold text-sm">4.9/5</span>
              <span className="text-slate-400 text-sm">(12,847 reviews)</span>
            </div>

            <p className="text-lg text-slate-600 max-w-3xl mb-4">{page.description}</p>
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-full px-3 py-1.5 text-red-600 text-sm font-medium animate-pulse" data-testid="scarcity-badge">
                <AlertCircle className="w-3.5 h-3.5" /> Only {Math.max(3, ((page.slug || '').length % 15) + 2)} tickets left at this price
              </span>
              <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5 text-amber-700 text-sm font-medium" data-testid="demand-badge">
                <Users className="w-3.5 h-3.5" /> {50 + ((page.slug || '').length % 80)} people viewing now
              </span>
            </div>

            {/* Price & CTA */}
            {page.price_low && (
              <div className="mb-4" data-testid="seo-price-cta">
                <div className="inline-flex items-center gap-2 bg-emerald-900/60 border border-emerald-500/30 rounded-lg px-4 py-2 mb-4">
                  <span className="text-2xl font-bold text-emerald-400">From {page.category === 'concert' && page.country === 'United Kingdom' ? '\u00a3' : '\u20ac'}{page.price_low}</span>
                  <span className="text-slate-400 text-sm">|</span>
                  <span className="text-orange-400 text-sm font-medium">Limited availability</span>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <Link to={buyLink}>
                    <Button className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-emerald-900/30" data-testid="seo-buy-btn">
                      <Ticket className="w-5 h-5 mr-2" /> View Available Tickets
                    </Button>
                  </Link>
                </div>
                {/* Trust Row */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-emerald-500" /> 100% Verified Tickets</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-emerald-500" /> Instant QR Delivery</span>
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-emerald-500" /> 4.9/5 from 12,000+ buyers</span>
                  <span className="flex items-center gap-1"><CreditCard className="w-3 h-3 text-emerald-500" /> Secure Stripe Checkout</span>
                </div>
                {/* Price Drop Alert - Inline */}
                <PriceDropAlert
                  eventSlug={page.slug}
                  eventName={page.event_name || page.title?.split("|")[0]?.trim() || ""}
                  currency={page.category === 'concert' && page.country === 'United Kingdom' ? '\u00a3' : '\u20ac'}
                />
              </div>
            )}
          </div>

          {/* Image */}
          {page.image && (
            <div className="absolute top-0 right-0 w-1/3 h-full hidden lg:block opacity-20">
              <img loading="lazy" src={page.image} alt={`${page.event_name || page.artist || page.title?.split('|')[0]?.trim()} tickets ${page.venue || ''} ${page.city || ''} ${page.year || 2026}`.trim()} className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2" data-testid="seo-content-body">
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(page.content) }}
              />
              {/* FAQ Section - visible + schema-linked */}
              {/* Use prehydratedFAQ if available, otherwise fall back to page.faq from API */}
              {((prehydratedFAQ && prehydratedFAQ.length > 0) || (page.faq && page.faq.length > 0)) && (
                <FAQSection faqs={prehydratedFAQ && prehydratedFAQ.length > 0 ? prehydratedFAQ : page.faq} title={`${page.title?.split("|")[0]?.split("–")[0]?.trim()} - FAQ`} />
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-6" data-testid="seo-sidebar-info">
                <h3 className="font-bold text-slate-900 mb-4">Quick Info</h3>
                {page.city && (
                  <div className="flex items-center gap-2 text-slate-600 mb-3">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{page.city}{page.country ? `, ${page.country}` : ""}</span>
                  </div>
                )}
                {page.venue && (
                  <div className="flex items-center gap-2 text-slate-600 mb-3">
                    <Tag className="w-4 h-4 text-slate-400" />
                    <span>{page.venue}</span>
                  </div>
                )}
                {page.year && (
                  <div className="flex items-center gap-2 text-slate-600 mb-3">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>{page.year} Season</span>
                  </div>
                )}
              </div>

              {/* Trust Signals */}
              <div className="bg-white border border-slate-200 rounded-xl p-6" data-testid="seo-trust-signals">
                <h3 className="font-bold text-slate-900 mb-4">Buyer Protection</h3>
                <div className="space-y-3">
                  {[
                    { icon: Shield, text: "500,000+ Tickets Sold", sub: "100% Money Back Guarantee" },
                    { icon: CreditCard, text: "Secure Payment", sub: "Stripe encrypted checkout" },
                    { icon: Clock, text: "Instant QR Delivery", sub: "E-tickets sent immediately" },
                    { icon: Star, text: "4.9/5 from 12,000+ Reviews", sub: "Trusted in 25+ countries" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <item.icon className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-slate-900 text-sm font-medium">{item.text}</p>
                        <p className="text-slate-400 text-xs">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-emerald-900/30 border border-emerald-800/50 rounded-xl p-6 text-center">
                <p className="text-emerald-600 font-semibold mb-2">Limited Availability</p>
                <p className="text-slate-500 text-sm mb-4">Prices increase as events approach. Book now for the best deals.</p>
                <Link to={buyLink}>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white" data-testid="seo-sidebar-buy-btn">
                    Browse All Tickets
                  </Button>
                </Link>
              </div>

              {/* Internal Links for SEO */}
              <InternalLinks category={page.category || "f1"} slug={slug} city={page.city || ""} showRelated={true} />
            </div>
          </div>
        </div>

        {/* Related Events Section - Full Width */}
        <div className="max-w-5xl mx-auto px-4 pb-8">
          <RelatedEventsSection slug={slug} category={page.category} city={page.city} />
        </div>

        {/* Back Link */}
        <div className="max-w-5xl mx-auto px-4 pb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        {/* Sticky CTA Bar - appears on scroll */}
        {page.price_low && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur border-t border-slate-700 py-3 px-4 transform transition-transform" data-testid="sticky-cta-bar">
            <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-white font-semibold text-sm truncate max-w-[200px] sm:max-w-none">{page.title?.split("|")[0]?.split("\u2013")[0]?.trim()}</p>
                  <p className="text-emerald-400 text-xs">From {page.category === 'concert' && page.country === 'United Kingdom' ? '\u00a3' : '\u20ac'}{page.price_low} · <span className="text-orange-400">{typeof window !== 'undefined' && window.__ticketsLeft ? window.__ticketsLeft : (3 + ((page.slug || '').length % 19))} tickets left</span> · <span className="text-slate-400">{typeof window !== 'undefined' && window.__viewingNow ? window.__viewingNow : (12 + ((page.slug || '').length % 85))} viewing now</span></p>
                </div>
              </div>
              <Link to={buyLink}>
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 text-sm rounded-lg whitespace-nowrap" data-testid="sticky-buy-btn">
                  <Ticket className="w-4 h-4 mr-1" /> Buy Now
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Exit Intent Popup */}
        <ExitIntentPopup
          eventName={page.event_name || page.title?.split("|")[0]?.trim() || ""}
          eventSlug={page.slug}
          currency={page.category === 'concert' && page.country === 'United Kingdom' ? '\u00a3' : '\u20ac'}
          priceLow={page.price_low}
        />
      </div>
    </>
  );
}
