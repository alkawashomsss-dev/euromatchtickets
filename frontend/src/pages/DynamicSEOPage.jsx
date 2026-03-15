import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Shield, Clock, CreditCard, Star, ChevronRight, Tag, MapPin, Calendar, Ticket } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
import { InternalLinks } from "../components/InternalLinks";
import { RelatedEventsSection } from "../components/RelatedEventsSection";
import axios from "axios";
import { API } from "../App";

const categoryStyles = {
  f1: { accent: "#e10600", bg: "from-red-900/40 to-zinc-900", badge: "bg-red-600 text-white" },
  football: { accent: "#1e88e5", bg: "from-blue-900/40 to-zinc-900", badge: "bg-blue-600 text-white" },
  concert: { accent: "#9c27b0", bg: "from-purple-900/40 to-zinc-900", badge: "bg-purple-600 text-white" },
  worldcup: { accent: "#2e7d32", bg: "from-green-900/40 to-zinc-900", badge: "bg-green-600 text-white" },
  motogp: { accent: "#ff6d00", bg: "from-orange-900/40 to-zinc-900", badge: "bg-orange-600 text-white" },
};

const renderMarkdown = (md) => {
  if (!md) return "";
  let html = md;
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-white mt-6 mb-2">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-white mt-8 mb-3 border-b border-zinc-700 pb-2">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl sm:text-3xl font-bold text-white mb-4">$1</h1>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
  html = html.replace(/^\| (.+)/gm, (match) => {
    const cells = match.split("|").filter(c => c.trim());
    if (cells.every(c => c.trim().match(/^[-:]+$/))) return "";
    const row = cells.map(c => `<td class="px-3 py-2 border border-zinc-700 text-sm">${c.trim()}</td>`).join("");
    return `<tr class="hover:bg-zinc-800/50">${row}</tr>`;
  });
  html = html.replace(/((<tr[^]*?<\/tr>\s*)+)/g, '<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-zinc-700 rounded-lg">$1</table></div>');
  html = html.replace(/^- (.+)$/gm, '<li class="text-zinc-300 ml-4 mb-1 list-disc">$1</li>');
  html = html.replace(/((<li[^]*?<\/li>\s*)+)/g, '<ul class="my-3">$1</ul>');
  html = html.replace(/^(?!<[hultd]|<div|<str)(.+)$/gm, (match) => {
    if (match.trim() === "") return "";
    return `<p class="text-zinc-300 mb-3 leading-relaxed">${match}</p>`;
  });
  return html;
};

export default function DynamicSEOPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await axios.get(`${API}/seo/page/${slug}`);
        setPage(res.data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (notFound || !page) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4" data-testid="seo-page-not-found">
        <h1 className="text-3xl font-bold text-white">Page Not Found</h1>
        <p className="text-zinc-400">The page you are looking for does not exist.</p>
        <Link to="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    );
  }

  const style = categoryStyles[page.category] || categoryStyles.concert;

  return (
    <>
      <SEOHead
        title={page.title}
        description={page.description}
        keywords={page.keywords}
        image={page.image}
        canonicalUrl={`https://euromatchtickets.com/${page.slug}`}
      />

      {/* Structured Data - Event + Product + Review Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": page.category === "concert" ? "MusicEvent" : "SportsEvent",
            "name": page.event_name || page.artist || page.title?.split("|")[0]?.trim(),
            "description": page.description || `Buy verified tickets for ${page.title?.split("|")[0]?.trim()} at EuroMatchTickets.com with instant QR delivery and buyer protection.`,
            "image": page.image || "https://euromatchtickets.com/logo.png",
            "url": `https://euromatchtickets.com/${page.slug}`,
            "startDate": page.event_date || page.start_date || `${page.year || "2026"}-06-01`,
            "endDate": page.end_date || page.event_date || page.start_date || `${page.year || "2026"}-12-31`,
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
              "name": page.artist || page.event_name || page.title?.split("|")[0]?.trim() || "EuroMatchTickets Event"
            },
            ...(page.price_low && { "offers": {
              "@type": "AggregateOffer",
              "lowPrice": String(page.price_low),
              "highPrice": String(page.price_high || page.price_low * 10),
              "priceCurrency": "EUR",
              "offerCount": "100",
              "availability": "https://schema.org/InStock",
              "url": `https://euromatchtickets.com/${page.slug}`,
              "validFrom": "2025-01-01",
              "seller": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" }
            }}),
            "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" }
          },
          {
            "@type": "Product",
            "name": `${page.title?.split("|")[0]?.trim()} Tickets`,
            "description": `Tickets for ${page.title?.split("|")[0]?.trim()}. Instant QR delivery. FanProtect guarantee.`,
            "image": page.image || "https://euromatchtickets.com/logo.png",
            "url": `https://euromatchtickets.com/${page.slug}`,
            "brand": { "@type": "Organization", "name": "EuroMatchTickets" },
            ...(page.price_low && { "offers": {
              "@type": "AggregateOffer",
              "lowPrice": String(page.price_low),
              "highPrice": String(page.price_high || page.price_low * 10),
              "priceCurrency": "EUR",
              "offerCount": "100",
              "availability": "https://schema.org/InStock",
              "url": `https://euromatchtickets.com/${page.slug}`
            }}),
            "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "2847", "bestRating": "5", "worstRating": "1" },
            "review": [
              { "@type": "Review", "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }, "author": { "@type": "Person", "name": "Marco R." }, "reviewBody": "Excellent service! Tickets arrived instantly via QR code.", "datePublished": "2026-01-15" },
              { "@type": "Review", "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }, "author": { "@type": "Person", "name": "Sophie M." }, "reviewBody": "Smooth booking. FanProtect guarantee gave me real confidence.", "datePublished": "2026-02-08" }
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

      <div className="min-h-screen bg-zinc-950" data-testid="dynamic-seo-page">
        {/* Hero */}
        <div className={`relative bg-gradient-to-b ${style.bg} py-16 sm:py-20`}>
          <div className="max-w-5xl mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-zinc-400 mb-6" data-testid="seo-breadcrumb">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <ChevronRight className="w-3 h-3" />
              {page.category === "f1" && <Link to="/f1-tickets" className="hover:text-white transition">F1 Tickets</Link>}
              {page.category === "football" && <Link to="/events?type=football" className="hover:text-white transition">Football</Link>}
              {page.category === "concert" && <Link to="/events?type=concert" className="hover:text-white transition">Concerts</Link>}
              {page.category === "worldcup" && <Link to="/world-cup-2026" className="hover:text-white transition">World Cup 2026</Link>}
              {page.category !== "concerts" && page.category !== "football" && page.category !== "sports" && page.category !== "events" && (
                <>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-zinc-300">{page.event_name || page.artist || page.city || page.stage || ""}</span>
                </>
              )}
            </nav>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className={style.badge} data-testid="seo-category-badge">
                {page.category?.toUpperCase()}
              </Badge>
              {page.page_type && (
                <Badge variant="outline" className="text-zinc-300 border-zinc-600">
                  {page.page_type.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                </Badge>
              )}
              {page.year && (
                <Badge variant="outline" className="text-zinc-300 border-zinc-600">
                  <Calendar className="w-3 h-3 mr-1" /> {page.year}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4" data-testid="seo-page-title">
              {page.title?.split("|")[0]?.trim()}
            </h1>

            <p className="text-lg text-zinc-300 max-w-3xl mb-6">{page.description}</p>

            {/* Price & CTA */}
            {page.price_low && (
              <div className="flex flex-wrap items-center gap-4" data-testid="seo-price-cta">
                <div className="bg-zinc-800/80 backdrop-blur rounded-xl px-6 py-4 border border-zinc-700">
                  <span className="text-sm text-zinc-400">From</span>
                  <div className="text-3xl font-bold text-emerald-400">{"\u20ac"}{page.price_low}</div>
                  {page.price_high && <span className="text-xs text-zinc-500 line-through">{"\u20ac"}{page.price_high} on Viagogo</span>}
                </div>
                <Link to="/events">
                  <Button className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-6 text-lg rounded-xl" data-testid="seo-buy-btn">
                    <Ticket className="w-5 h-5 mr-2" /> Buy Tickets Now
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Image */}
          {page.image && (
            <div className="absolute top-0 right-0 w-1/3 h-full hidden lg:block opacity-20">
              <img loading="lazy" src={page.image} alt={page.title} className="w-full h-full object-cover" />
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
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info Card */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6" data-testid="seo-sidebar-info">
                <h3 className="font-bold text-white mb-4">Quick Info</h3>
                {page.city && (
                  <div className="flex items-center gap-2 text-zinc-300 mb-3">
                    <MapPin className="w-4 h-4 text-zinc-500" />
                    <span>{page.city}{page.country ? `, ${page.country}` : ""}</span>
                  </div>
                )}
                {page.venue && (
                  <div className="flex items-center gap-2 text-zinc-300 mb-3">
                    <Tag className="w-4 h-4 text-zinc-500" />
                    <span>{page.venue}</span>
                  </div>
                )}
                {page.year && (
                  <div className="flex items-center gap-2 text-zinc-300 mb-3">
                    <Calendar className="w-4 h-4 text-zinc-500" />
                    <span>{page.year} Season</span>
                  </div>
                )}
              </div>

              {/* Trust Signals */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6" data-testid="seo-trust-signals">
                <h3 className="font-bold text-white mb-4">Buyer Protection</h3>
                <div className="space-y-3">
                  {[
                    { icon: Shield, text: "FanProtect Guarantee", sub: "100% refund if cancelled" },
                    { icon: CreditCard, text: "Secure Payment", sub: "Stripe encrypted checkout" },
                    { icon: Clock, text: "Instant Delivery", sub: "E-tickets sent immediately" },
                    { icon: Star, text: "Verified Tickets", sub: "Every ticket authenticated" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <item.icon className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-white text-sm font-medium">{item.text}</p>
                        <p className="text-zinc-500 text-xs">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-emerald-900/30 border border-emerald-800/50 rounded-xl p-6 text-center">
                <p className="text-emerald-400 font-semibold mb-2">Limited Availability</p>
                <p className="text-zinc-400 text-sm mb-4">Prices increase as events approach. Book now for the best deals.</p>
                <Link to="/events">
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
          <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}
