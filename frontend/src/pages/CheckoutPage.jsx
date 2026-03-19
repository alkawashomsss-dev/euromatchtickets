import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API, useAuth } from "../App";
import { Shield, Zap, Lock, CreditCard, ChevronLeft, Calendar, MapPin, Ticket, Check } from "lucide-react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const eventId = searchParams.get("event");
  const category = searchParams.get("category") || "General Admission";
  const urlPrice = searchParams.get("price");
  const ticketId = searchParams.get("ticket_id");

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!eventId) { navigate("/events"); return; }
    axios.get(`${API}/events/${eventId}`)
      .then(res => { setEvent(res.data); setLoading(false); })
      .catch(() => { toast.error("Event not found"); navigate("/events"); });
  }, [eventId, navigate]);

  const getPrice = () => {
    if (urlPrice) return parseInt(urlPrice);
    if (!event) return 0;
    const base = event.tickets?.length > 0
      ? event.tickets.reduce((min, t) => t.price < min ? t.price : min, Infinity)
      : Object.values(event.categories || {}).reduce((min, c) => c.lowest_price < min ? c.lowest_price : min, 99);
    const lp = Math.round(base);
    if (category === "Grandstand") return Math.round(lp * 1.8);
    if (category === "VIP Hospitality") return Math.round(lp * 4.5);
    return lp;
  };

  const price = getPrice();
  const commission = Math.round(price * 0.10);
  const total = price + commission;

  const handleCheckout = async () => {
    if (!user) { login(); return; }
    setProcessing(true);
    try {
      const res = await axios.post(`${API}/checkout/create-event`, {
        event_id: eventId,
        category,
        price,
        origin_url: window.location.origin
      }, { withCredentials: true });
      window.location.href = res.data.url;
    } catch (err) {
      toast.error(err.response?.data?.detail || "Checkout failed. Please try again.");
      setProcessing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[hsl(210,20%,98%)] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!event) return null;

  const d = new Date(event.event_date);
  const dateStr = d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-[hsl(210,20%,98%)] pt-24 pb-16" data-testid="checkout-page">
      <div className="max-w-3xl mx-auto px-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-slate-500 hover:text-slate-900 mb-6 transition" data-testid="checkout-back-btn">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        <h1 className="text-2xl font-extrabold text-slate-900 mb-8">Secure Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Order Summary - Left */}
          <div className="md:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-emerald-600" /> Order Summary
              </h2>

              <div className="flex gap-4 mb-5">
                {event.event_image && (
                  <img src={event.event_image} alt={event.title} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
                )}
                <div>
                  <h3 className="font-bold text-slate-900">{event.title}</h3>
                  <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                    <Calendar className="w-3.5 h-3.5" /> {dateStr}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-slate-500 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" /> {event.venue}, {event.city}
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">{category}</span>
                  <span className="text-xs text-slate-400">1x Ticket</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Ticket Price</span>
                    <span className="font-medium">&euro;{price}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Service Fee (10%)</span>
                    <span className="font-medium">&euro;{commission}</span>
                  </div>
                  <div className="flex justify-between text-lg font-extrabold text-slate-900 border-t border-slate-100 pt-3 mt-2">
                    <span>Total</span>
                    <span className="text-emerald-600">&euro;{total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Shield, label: "FanProtect Guarantee", sub: "Full refund if cancelled" },
                { icon: Zap, label: "Instant QR Delivery", sub: "Tickets to your email" },
                { icon: Lock, label: "Secure Payment", sub: "256-bit SSL encryption" },
                { icon: CreditCard, label: "Stripe Powered", sub: "PCI DSS Level 1" },
              ].map((t, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 p-3 flex items-start gap-2.5">
                  <t.icon className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{t.label}</p>
                    <p className="text-[10px] text-slate-400">{t.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pay Button - Right */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
              <div className="text-center mb-5">
                <p className="text-sm text-slate-500 mb-1">You'll pay</p>
                <p className="text-4xl font-extrabold text-slate-900">&euro;{total}</p>
              </div>

              <button
                onClick={handleCheckout}
                disabled={processing}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl text-lg"
                data-testid="checkout-pay-btn"
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Lock className="w-5 h-5" /> Pay Securely
                  </span>
                )}
              </button>

              <div className="mt-4 space-y-2">
                {["100% verified tickets", "Instant QR code delivery", "Full refund if event cancelled", "24/7 customer support"].map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                    <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    {t}
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-center gap-2 opacity-50">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
