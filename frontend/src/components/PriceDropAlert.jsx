import { useState } from "react";
import { Bell, ArrowDown, X, Ticket, Shield, Zap } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";
import { API } from "../App";

/* ── Inline Price Drop Alert (under price section) ── */
export const PriceDropAlert = ({ eventSlug, eventName, currency = "€" }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error | exists
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    try {
      const res = await axios.post(`${API}/alerts/subscribe`, {
        email,
        event_slug: eventSlug,
        event_name: eventName,
      });
      if (res.data.status === "already_subscribed") {
        setStatus("exists");
        setMsg("You're already subscribed to alerts for this event.");
      } else {
        setStatus("success");
        setMsg("You'll be notified when prices drop!");
      }
    } catch {
      setStatus("error");
      setMsg("Something went wrong. Please try again.");
    }
  };

  if (status === "success" || status === "exists") {
    return (
      <div className="flex items-center gap-2 bg-emerald-900/40 border border-emerald-500/20 rounded-lg px-4 py-3 mt-3" data-testid="price-alert-success">
        <Bell className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <p className="text-emerald-300 text-sm">{msg}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3" data-testid="price-alert-inline">
      <div className="flex items-center gap-2 mb-2">
        <ArrowDown className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-amber-400 text-sm font-medium">Get alerted when prices drop</span>
      </div>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
          data-testid="price-alert-email"
          required
        />
        <Button
          type="submit"
          disabled={status === "loading"}
          className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 text-sm rounded-lg whitespace-nowrap"
          data-testid="price-alert-submit"
        >
          <Bell className="w-3.5 h-3.5 mr-1" />
          {status === "loading" ? "..." : "Notify Me"}
        </Button>
      </div>
      {status === "error" && <p className="text-red-400 text-xs mt-1">{msg}</p>}
    </form>
  );
};

/* ── Exit Intent Popup ── */
export const ExitIntentPopup = ({ eventName, eventSlug, currency = "€", priceLow }) => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [dismissed, setDismissed] = useState(false);

  // Exit intent detection
  useState(() => {
    if (dismissed) return;
    const stored = sessionStorage.getItem(`exit_popup_${eventSlug}`);
    if (stored) return;

    const handleMouseLeave = (e) => {
      if (e.clientY <= 5 && !dismissed) {
        setShow(true);
        sessionStorage.setItem(`exit_popup_${eventSlug}`, "1");
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
    // Delay adding listener to avoid triggering immediately
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 5000);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [eventSlug, dismissed]);

  const handleClose = () => {
    setShow(false);
    setDismissed(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    try {
      await axios.post(`${API}/alerts/subscribe`, {
        email,
        event_slug: eventSlug,
        event_name: eventName,
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" data-testid="exit-intent-popup">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl relative">
        {/* Close */}
        <button onClick={handleClose} className="absolute top-3 right-3 text-slate-500 hover:text-white" data-testid="exit-popup-close">
          <X className="w-5 h-5" />
        </button>

        {status === "success" ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">You're all set!</h3>
            <p className="text-slate-400 text-sm">We'll email you when prices drop for {eventName}.</p>
            <Button onClick={handleClose} className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white">
              Continue Browsing
            </Button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-5">
              <div className="inline-flex items-center gap-1.5 bg-amber-900/40 border border-amber-600/30 rounded-full px-3 py-1 text-amber-400 text-xs font-medium mb-3">
                <Zap className="w-3 h-3" /> Prices change daily
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Wait! Don't miss out</h3>
              <p className="text-slate-400 text-sm">
                Get notified instantly when ticket prices drop for this event.
              </p>
            </div>

            {/* Event preview */}
            <div className="bg-slate-800 rounded-lg p-3 flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Ticket className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">{eventName}</p>
                {priceLow && <p className="text-emerald-400 text-xs">Currently from {currency}{priceLow}</p>}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email to get alerts"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white text-sm placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none mb-3"
                data-testid="exit-popup-email"
                required
                autoFocus
              />
              <Button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 text-sm font-semibold rounded-lg"
                data-testid="exit-popup-submit"
              >
                <Bell className="w-4 h-4 mr-2" />
                {status === "loading" ? "Subscribing..." : "Notify Me When Prices Drop"}
              </Button>
              {status === "error" && <p className="text-red-400 text-xs mt-2 text-center">Something went wrong. Please try again.</p>}
            </form>

            {/* Trust */}
            <div className="flex items-center justify-center gap-1.5 mt-3 text-slate-500 text-xs">
              <Shield className="w-3 h-3" />
              <span>No spam. Unsubscribe anytime.</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
