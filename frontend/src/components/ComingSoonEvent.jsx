import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, Mail, Check, ArrowRight, Music, MapPin, AlertTriangle, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";

/**
 * ComingSoonEvent
 * ================
 * Honest "no dates confirmed yet" landing page for speculative demand slugs.
 * - No prices, no availability, no Product / Offer schema
 * - <meta robots="noindex, follow">  (also enforced server-side)
 * - Email lead capture → POST /api/leads/capture
 *
 * Use this for ANY artist/event page that does NOT have an officially
 * announced tour date. The moment the artist confirms a date, migrate to
 * a normal event page and remove the slug from UNVERIFIED_DEMAND_PAGES.
 */

const API = process.env.REACT_APP_BACKEND_URL;

export default function ComingSoonEvent({
  artist,
  city,
  venueGuess,
  eventSlug,
  canonical,
  heroImage,
  pastToursSummary,
  faqs = [],
  relatedLinks = [],
}) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [signupCount, setSignupCount] = useState(null);

  useEffect(() => {
    // Lightweight social-proof counter
    fetch(`${API}/api/leads/count?event_slug=${encodeURIComponent(eventSlug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setSignupCount(d.total_signups))
      .catch(() => {});
  }, [eventSlug]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/leads/capture`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          event_slug: eventSlug,
          event_name: `${artist}${city ? ` — ${city}` : ""}`,
          artist,
          city,
          source: "coming_soon",
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setSignupCount(data.total_signups || null);
      setSubmitted(true);
    } catch (err) {
      setError("Could not subscribe. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const faqSchema =
    faqs && faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  const titleStr = `${artist}${city ? ` ${city}` : ""} — No Dates Confirmed Yet | Get Notified`;
  const descStr = `${artist} has not officially announced a ${city ? `${city} ` : ""}tour date. Join the notify list — be first to know when tickets go on sale.`;

  // Force head tags at runtime (React 19 native <title> hoisting is unreliable)
  useEffect(() => {
    document.title = titleStr;
    const setMeta = (sel, attr, val) => {
      let el = document.head.querySelector(sel);
      if (!el) {
        el = document.createElement(sel.startsWith("link") ? "link" : "meta");
        sel.match(/\[(\w+)="([^"]+)"\]/g)?.forEach((m) => {
          const [, k, v] = m.match(/\[(\w+)="([^"]+)"\]/);
          el.setAttribute(k, v);
        });
        document.head.appendChild(el);
      }
      el.setAttribute(attr, val);
    };
    setMeta('meta[name="description"]', "content", descStr);
    setMeta('meta[name="robots"]', "content", "noindex, follow");
    if (canonical) setMeta('link[rel="canonical"]', "href", canonical);
  }, [titleStr, descStr, canonical]);

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      {faqSchema ? (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      ) : null}

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/5">
        {heroImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b0b0b]/60 to-[#0b0b0b]" />
        <div className="relative max-w-4xl mx-auto px-5 pt-16 pb-20 md:pt-24 md:pb-28">
          <Badge
            data-testid="coming-soon-badge"
            className="mb-5 bg-amber-500/10 border border-amber-500/40 text-amber-300 hover:bg-amber-500/10"
          >
            <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
            No Confirmed Dates Yet
          </Badge>
          <h1
            data-testid="coming-soon-title"
            className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] mb-4"
          >
            {artist}
            {city ? (
              <>
                {" "}
                <br />
                <span className="text-slate-400 font-bold text-3xl md:text-5xl">
                  in {city}
                </span>
              </>
            ) : null}
          </h1>
          <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl mb-6">
            {artist} has <strong className="text-white">not officially announced</strong> a
            {city ? ` ${city} ` : " "}2026 tour date
            {venueGuess ? ` at ${venueGuess}` : ""}. We're tracking the rumour mill
            and will notify you the second tickets go on sale — usually{" "}
            <strong className="text-white">24 hours before</strong> the general
            public.
          </p>

          {/* EMAIL CAPTURE */}
          <form
            onSubmit={submit}
            className="mt-6 max-w-xl"
            data-testid="coming-soon-form"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 px-5 py-4 rounded"
                data-testid="coming-soon-success"
              >
                <Check className="w-5 h-5 flex-shrink-0" />
                <div className="text-sm">
                  <strong>You're on the list.</strong> We'll email you the moment{" "}
                  {artist}
                  {city ? ` ${city}` : ""} tickets are officially announced.
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    data-testid="coming-soon-email-input"
                    className="pl-9 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  data-testid="coming-soon-submit-button"
                  className="h-12 bg-[#9c27b0] hover:bg-[#7b1fa2] text-white font-semibold px-6"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  {submitting ? "Subscribing..." : "Notify Me"}
                </Button>
              </div>
            )}
            {error && (
              <p
                className="text-red-400 text-xs mt-2"
                data-testid="coming-soon-error"
              >
                {error}
              </p>
            )}
            <p className="text-xs text-slate-500 mt-3 flex items-center gap-2">
              <Shield className="w-3 h-3" />
              No spam. One email when the tour drops. Unsubscribe anytime.
              {signupCount != null && signupCount > 0 && (
                <span className="text-slate-400 ml-1">
                  · {signupCount.toLocaleString()} already notified
                </span>
              )}
            </p>
          </form>
        </div>
      </section>

      {/* WHY COMING SOON */}
      <section className="max-w-4xl mx-auto px-5 py-14">
        <h2 className="text-2xl font-bold mb-3">Why there's no ticket link yet</h2>
        <p className="text-slate-400 leading-relaxed mb-4">
          We will <strong className="text-white">never</strong> sell tickets for
          an event we can't verify. Until {artist} officially announces a
          {city ? ` ${city} ` : " "}date with a confirmed venue and on-sale
          window, this page stays as a notify list only — no prices, no fake
          availability counters, no pressure.
        </p>
        <ul className="space-y-3 mt-5 text-sm text-slate-300">
          <li className="flex gap-3">
            <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>
              We monitor {artist}'s official channels, promoter announcements, and
              venue schedules daily.
            </span>
          </li>
          <li className="flex gap-3">
            <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>
              Notify list members get access{" "}
              <strong className="text-white">24h before general sale</strong>.
            </span>
          </li>
          <li className="flex gap-3">
            <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>
              100% Money-Back Guarantee applies to every ticket we eventually
              list.
            </span>
          </li>
        </ul>
      </section>

      {/* PAST TOURS / HISTORY */}
      {pastToursSummary && (
        <section className="max-w-4xl mx-auto px-5 pb-14">
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
            <Music className="w-5 h-5 text-[#9c27b0]" />
            About {artist}
          </h2>
          <div className="text-slate-400 leading-relaxed space-y-3">
            {pastToursSummary}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="max-w-4xl mx-auto px-5 pb-16">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <details
                key={i}
                className="group border border-white/10 bg-white/[0.02] rounded"
                data-testid={`coming-soon-faq-${i}`}
              >
                <summary className="flex items-center justify-between cursor-pointer p-4 font-semibold text-sm md:text-base">
                  {f.q}
                  <ArrowRight className="w-4 h-4 text-slate-500 transition-transform group-open:rotate-90" />
                </summary>
                <div className="px-4 pb-4 text-slate-400 text-sm leading-relaxed">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* CONFIRMED ALTERNATIVES */}
      {relatedLinks.length > 0 && (
        <section className="max-w-4xl mx-auto px-5 pb-20">
          <h2 className="text-2xl font-bold mb-4">
            Confirmed tours you can book today
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {relatedLinks.map((l, i) => (
              <Link
                key={i}
                to={l.href}
                data-testid={`coming-soon-related-${i}`}
                className="group flex items-center justify-between p-4 border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] rounded transition-colors"
              >
                <div>
                  <div className="font-semibold text-white group-hover:text-[#9c27b0] transition-colors">
                    {l.title}
                  </div>
                  {l.subtitle && (
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      {l.city && (
                        <>
                          <MapPin className="w-3 h-3" />
                          {l.city}
                        </>
                      )}
                    </div>
                  )}
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#9c27b0] transition-colors" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
