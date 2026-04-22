import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Ticket, ChevronRight, Bell, Users, Clock } from "lucide-react";
import axios from "axios";
import { API } from "../App";
import SEOHead from "./SEOHead";
import BreadcrumbSchema from "./BreadcrumbSchema";
import WaitlistCTA from "./WaitlistCTA";
import EditorialByline from "./EditorialByline";

/**
 * LiveClubHubPage — data-driven replacement for the old hardcoded club hub
 * pages (JuventusHubPage, RealMadridHubPage, etc).
 *
 * Honesty rules:
 *   - if `/api/events?league=...` returns 0 matches → page stays `noIndex`
 *     and shows a WaitlistCTA (no fake prices, no fake "90% sold" urgency).
 *   - if ≥1 match → page is indexable, shows real min price from API,
 *     real matchdate, real verified-listing count.
 *
 * Props:
 *   club         — display name, e.g. "Real Madrid"
 *   slug         — URL slug, e.g. "real-madrid-tickets"
 *   homeTeamKey  — case-insensitive substring matched against e.home_team.
 *                  e.g. "real madrid" matches every match where RM is home.
 *   venue        — short venue line for the H2 "Location" card
 *   stadium      — legal name of the stadium for JSON-LD Place
 *   city         — e.g. "Madrid"
 *   country      — "Spain"
 *   stripe       — tailwind gradient class for the hero (e.g. "from-white via-slate-100 to-white")
 *   accent       — tailwind color token for CTAs (e.g. "bg-slate-900")
 *   faqs         — optional [{q,a}] array for editorial depth
 *   relatedLinks — manually curated list of internal links for the SEO graph
 */
export default function LiveClubHubPage({
  club,
  slug,
  homeTeamKey,
  venue,
  stadium,
  city,
  country,
  heroStyle,
  accent = "bg-slate-900",
  faqs = [],
  relatedLinks = [],
}) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        // Pull both Worldcup + football; filter client-side on team name.
        const [football, worldcup] = await Promise.all([
          axios.get(`${API}/events?event_type=football&limit=200`),
          axios.get(`${API}/events?event_type=worldcup&limit=200`),
        ]);
        const pool = [...(football.data || []), ...(worldcup.data || [])];
        const key = (homeTeamKey || club).toLowerCase();
        const filtered = pool
          .filter((e) => {
            const h = (e.home_team || "").toLowerCase();
            const a = (e.away_team || "").toLowerCase();
            const t = (e.title || "").toLowerCase();
            return h.includes(key) || a.includes(key) || t.includes(key);
          })
          .filter((e) => e.status !== "past_event")
          .sort((a, b) => new Date(a.event_date || 0) - new Date(b.event_date || 0));
        setMatches(filtered);
      } catch {
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [homeTeamKey, club]);

  const verified = matches.filter(
    (m) => m.status !== "coming_soon" && typeof m.lowest_price === "number" && m.lowest_price > 0
  );
  const minPrice = verified.length ? Math.min(...verified.map((m) => Math.round(m.lowest_price))) : null;
  const totalListings = verified.reduce((s, m) => s + (m.available_tickets || 0), 0);
  const hasData = verified.length > 0;

  const canonical = `https://euromatchtickets.com/${slug}`;
  const seoTitle = hasData
    ? `${club} Tickets 2026 — ${verified.length} Matches from €${minPrice} | ${stadium}`
    : `${club} Tickets 2026 — Schedule & Availability | ${stadium}`;
  const seoDesc = hasData
    ? `${verified.length} verified ${club} match listings from €${minPrice}. ${stadium}, ${city}. Market pricing may vary. Cancellation refund policy applies.`
    : `${club} fixtures at ${stadium}, ${city}. Verified seller inventory not yet on sale. Join the waitlist and we'll email you within 24h of the first drop.`;

  return (
    <div className="min-h-screen bg-[#0e0e14]" data-testid={`${slug}-hub`}>
      <SEOHead
        title={seoTitle}
        description={seoDesc}
        canonicalUrl={canonical}
        noIndex={!hasData}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://euromatchtickets.com/" },
          { name: "Football", url: "https://euromatchtickets.com/events?type=match" },
          { name: `${club} Tickets`, url: canonical },
        ]}
      />

      {/* Hero */}
      <section className={`relative py-20 overflow-hidden ${heroStyle || "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950"}`}>
        <div className="relative max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-3" data-testid="hub-h1">
            {club}
            <span className="block text-2xl md:text-3xl text-slate-300 mt-2">Tickets 2026</span>
          </h1>
          <p className="text-lg text-slate-300/80 max-w-xl mb-6">
            {stadium} &middot; {city}{country ? `, ${country}` : ""}.{" "}
            {hasData ? (
              <>{verified.length} verified matchday listings currently available.</>
            ) : (
              <>No verified inventory yet. Join the free waitlist.</>
            )}
          </p>
          {hasData ? (
            <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur border border-white/20 px-5 py-3">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/60">From</p>
                <p className="text-3xl font-extrabold text-amber-400">€{minPrice}</p>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/60">Verified listings</p>
                <p className="text-lg font-bold text-white">{totalListings || verified.length}</p>
              </div>
            </div>
          ) : (
            <div className="max-w-md">
              <WaitlistCTA slug={slug} eventTitle={`${club} 2026`} />
            </div>
          )}
        </div>
      </section>

      {/* Matches — only when we have verified data */}
      {hasData && (
        <section className="py-14" data-testid="hub-matches">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-2">Upcoming {club} matches</h2>
            <p className="text-sm text-slate-400 mb-6">Live inventory from our verified sellers. Prices update dynamically.</p>
            <div className="space-y-3">
              {verified.map((m) => {
                const date = m.event_date ? new Date(m.event_date) : null;
                const dateStr = date
                  ? date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                  : "TBA";
                const opp = (m.home_team || "").toLowerCase().includes((homeTeamKey || club).toLowerCase())
                  ? m.away_team
                  : m.home_team;
                return (
                  <Link
                    key={m.slug || m.event_id}
                    to={`/event/${m.slug || m.event_id}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#1e1e1e] border border-white/10 hover:border-amber-400/40 p-5 transition-all"
                    data-testid={`hub-match-${m.slug || m.event_id}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-white">{club} vs {opp || m.title}</h3>
                        {m.league && (
                          <span className="text-[10px] bg-white/5 text-slate-400 px-2 py-0.5 uppercase tracking-wider">
                            {m.league}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-400 mt-1 flex items-center gap-3 flex-wrap">
                        <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{dateStr}</span>
                        <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{m.venue || stadium}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-3 sm:mt-0">
                      <span className="text-xs text-slate-500">
                        {m.available_tickets ? `${m.available_tickets} listings` : ""}
                      </span>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-500 uppercase">From</p>
                        <p className="text-xl font-bold text-white">€{Math.round(m.lowest_price)}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-500" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-14 bg-[#15151e]" data-testid="hub-faq">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-6">FAQ — {club} tickets</h2>
            <div className="space-y-3">
              {faqs.map((f, i) => (
                <details key={i} className="group bg-[#1e1e1e] border border-white/10 transition">
                  <summary className="p-5 font-bold text-white cursor-pointer list-none flex items-center justify-between">
                    {f.q}
                    <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
                  </summary>
                  <p className="px-5 pb-5 text-slate-400 text-sm leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: faqs.map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: { "@type": "Answer", text: f.a },
                  })),
                }),
              }}
            />
          </div>
        </section>
      )}

      {/* Internal SEO graph links */}
      {relatedLinks.length > 0 && (
        <section className="py-12" data-testid="hub-related">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-lg font-bold text-white mb-4">Related teams & events</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {relatedLinks.map((l, i) => (
                <Link
                  key={i}
                  to={l.to}
                  className="bg-[#1e1e1e] border border-white/10 p-4 hover:border-amber-400/40 transition-all"
                >
                  <p className="font-bold text-white text-sm">{l.label}</p>
                  {l.hint && <p className="text-slate-400 text-xs mt-1">{l.hint}</p>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Editorial E-E-A-T byline */}
      <section className="py-10">
        <div className="max-w-4xl mx-auto px-4">
          <EditorialByline topic={`${club} matchday tickets`} />
        </div>
      </section>
    </div>
  );
}
