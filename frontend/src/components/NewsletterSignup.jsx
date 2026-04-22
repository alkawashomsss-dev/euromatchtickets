import { useState } from "react";
import { Mail, ArrowRight, Check, Bell } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";
import { API } from "../App";

export const NewsletterSignup = ({ source = "unknown", variant = "default" }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    try {
      await axios.post(`${API}/newsletter/subscribe`, { email, source });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className={`${variant === "inline" ? "py-6" : "py-10"} text-center`} data-testid="newsletter-success">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500/20 mb-3">
          <Check className="w-6 h-6 text-emerald-400" />
        </div>
        <p className="text-white font-bold">You're in!</p>
        <p className="text-slate-400 text-sm mt-1">We'll notify you when prices drop.</p>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="bg-[#161620] border border-[#e10600]/20 p-6" data-testid="newsletter-inline">
        <div className="flex items-center gap-2 mb-2">
          <Bell className="w-4 h-4 text-[#e10600]" />
          <p className="text-sm font-black text-white uppercase tracking-wider">Price Alerts</p>
        </div>
        <p className="text-slate-400 text-xs mb-3">Get notified before tickets sell out.</p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            data-testid="newsletter-email-inline"
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-[#e10600]/50"
          />
          <Button
            type="submit"
            disabled={status === "loading"}
            data-testid="newsletter-submit-inline"
            className="bg-[#e10600] hover:bg-[#b80500] text-white text-xs font-bold px-4 shrink-0"
          >
            {status === "loading" ? "..." : "Notify Me"}
          </Button>
        </form>
      </div>
    );
  }

  // Default full-width variant
  return (
    <div className="bg-gradient-to-r from-[#e10600]/10 to-[#e10600]/5 border border-[#e10600]/20 p-8 md:p-10" data-testid="newsletter-signup">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-[#e10600]/20 mb-4">
          <Mail className="w-7 h-7 text-[#e10600]" />
        </div>
        <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mb-2">
          Get Ticket Price Alerts
        </h3>
        <p className="text-slate-400 text-sm mb-6">
          Be the first to know when prices drop. Join 12,000+ fans who never miss a deal.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            data-testid="newsletter-email"
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-[#e10600]/50 text-sm"
          />
          <Button
            type="submit"
            disabled={status === "loading"}
            data-testid="newsletter-submit"
            className="bg-[#e10600] hover:bg-[#b80500] text-white font-bold px-6 py-3 shrink-0 flex items-center gap-2"
          >
            {status === "loading" ? "Subscribing..." : (
              <>Notify Me <ArrowRight className="w-4 h-4" /></>
            )}
          </Button>
        </form>
        {status === "error" && (
          <p className="text-red-400 text-xs mt-2">Something went wrong. Try again.</p>
        )}
        <p className="text-slate-600 text-[10px] mt-3 uppercase tracking-wider">No spam. Unsubscribe anytime.</p>
      </div>
    </div>
  );
};

export default NewsletterSignup;
