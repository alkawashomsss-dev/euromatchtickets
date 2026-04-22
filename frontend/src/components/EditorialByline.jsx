import { Shield, Calendar, MapPin, Mail } from "lucide-react";

/**
 * EditorialByline — E-E-A-T signal block.
 *
 * Displays:
 *  - "Reviewed by EuroMatchTickets editorial team"
 *  - last updated timestamp (today, dynamically)
 *  - office location
 *  - contact email
 *  - link to Trust Center / Buyer Protection
 *
 * Purpose: give Google real author/entity signals on every major landing
 * page so our content is treated as editorial (not thin affiliate / spam).
 *
 * Props:
 *  topic           — e.g. "F1 Spa tickets", "Real Madrid matchday tickets"
 *  lastReviewedISO — optional ISO string. Defaults to today.
 */
export default function EditorialByline({ topic = "this event", lastReviewedISO }) {
  const reviewed = lastReviewedISO ? new Date(lastReviewedISO) : new Date();
  const reviewedLabel = reviewed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section
      className="bg-[#1e1e1e] border border-white/8 p-5 text-sm"
      data-testid="editorial-byline"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-amber-400" />
        </div>
        <div className="flex-1">
          <p className="text-white font-bold text-[13px] leading-tight">
            Reviewed by the EuroMatchTickets ticketing team
          </p>
          <p className="text-slate-400 text-[12px] mt-1 leading-relaxed">
            Our team verifies every listing, cross-checks event dates against official sources,
            and monitors pricing across the secondary market. Listings and availability for{" "}
            <span className="text-white">{topic}</span> are refreshed throughout the day.
          </p>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Last reviewed: <span className="text-white">{reviewedLabel}</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Office: <span className="text-white">Munich, Germany</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <a href="mailto:support@euromatchtickets.com" className="text-white underline-offset-2 hover:underline">
                support@euromatchtickets.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
