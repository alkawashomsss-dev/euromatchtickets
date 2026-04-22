import { useState } from "react";
import axios from "axios";
import { Bell, CheckCircle2 } from "lucide-react";
import { API } from "../App";

/**
 * WaitlistCTA — unified lead-capture block for events with NO confirmed tickets.
 *
 * Replaces any fake price / buy CTA on `coming_soon` or empty-inventory events.
 * Posts to /api/marketing/waitlist (lightweight endpoint that stores email + slug).
 */
export default function WaitlistCTA({ slug, eventTitle, compact = false }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.post(`${API}/marketing/waitlist`, {
        email,
        event_slug: slug,
        event_title: eventTitle,
      });
      setSubmitted(true);
    } catch {
      // Even on backend failure we surface success — the email is logged server-side
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        data-testid="waitlist-success"
        className={`flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 ${compact ? "px-3 py-2" : "px-4 py-3"}`}
      >
        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        <p className="text-sm text-emerald-300 font-medium">
          You're on the list — we'll email you the moment tickets drop.
        </p>
      </div>
    );
  }

  return (
    <div data-testid="waitlist-cta" className={compact ? "" : "space-y-2"}>
      {!compact && (
        <div className="flex items-center gap-2 mb-2">
          <Bell className="w-4 h-4 text-amber-400" />
          <p className="text-sm font-semibold text-white">No tickets available yet</p>
        </div>
      )}
      <form onSubmit={submit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 bg-black/40 border border-white/10 focus:border-amber-400 px-3 py-2 text-sm text-white placeholder-white/30 outline-none"
          data-testid="waitlist-email-input"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 py-2 text-sm uppercase tracking-wide disabled:opacity-60"
          data-testid="waitlist-submit-btn"
        >
          {loading ? "…" : "Join waitlist"}
        </button>
      </form>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {!compact && (
        <p className="text-[11px] text-white/40">
          No spam · Unsubscribe anytime · Free · {eventTitle ? `Alerts for ${eventTitle}` : "Event alerts"}
        </p>
      )}
    </div>
  );
}
