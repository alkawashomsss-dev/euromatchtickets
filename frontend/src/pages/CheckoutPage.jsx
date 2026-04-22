import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API, useAuth } from "../App";
import { Shield, Zap, Lock, CreditCard, ChevronLeft, Calendar, MapPin, Ticket, Check, Clock, Hash } from "lucide-react";
import SEOHead from "../components/SEOHead";
import VIPGallery from "../components/VIPGallery";
import { toast } from "sonner";

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const eventId = searchParams.get("event");
  const category = searchParams.get("category") || "General Admission";
  const urlPrice = searchParams.get("price");
  const ticketId = searchParams.get("ticket_id");
  const seatInfo = searchParams.get("seat") || "";
  const rowInfo = searchParams.get("row") || "";
  const sectionInfo = searchParams.get("section") || category;
  const blockInfo = searchParams.get("block") || "";
  const isVIP = /vip|platinum|hospitality|paddock|premium/i.test(category);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!eventId) { navigate("/events"); return; }
    axios.get(`${API}/events/${eventId}`)
      .then(res => { setEvent(res.data); setLoading(false); })
      .catch(() => {
        const prettyName = eventId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/ \d{4} Tickets$/i, '').replace(/ Tickets$/i, '').trim();
        setEvent({
          title: prettyName || 'Event',
          event_date: null,
          venue: 'Venue TBC',
          city: 'Europe',
          slug: eventId,
          event_id: eventId,
          tickets: [],
          categories: {},
        });
        setLoading(false);
      });
  }, [eventId, navigate]);

  const getPrice = () => {
    if (urlPrice) return parseInt(urlPrice);
    if (!event) return 99;
    const base = event.tickets?.length > 0
      ? event.tickets.reduce((min, t) => t.price < min ? t.price : min, Infinity)
      : Object.keys(event.categories || {}).length > 0
        ? Object.values(event.categories).reduce((min, c) => c.lowest_price < min ? c.lowest_price : min, 99)
        : event.price_from || 99;
    return Math.round(base);
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
    <div className="min-h-screen bg-[#0e0e14] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!event) return null;

  const hasDate = event.event_date && !isNaN(new Date(event.event_date).getTime());
  const d = hasDate ? new Date(event.event_date) : null;
  const dateStr = d ? d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Date TBC';
  const timeStr = d ? d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }) : '';
  const venueStr = [event.venue, event.city].filter(Boolean).join(', ') || 'Venue TBC';

  return (
    <div className="min-h-screen bg-[#0e0e14] pt-24 pb-16" data-testid="checkout-page">
      <SEOHead title="Checkout | EuroMatchTickets" description="Complete your ticket purchase" noIndex={true} />
      <div className="max-w-3xl mx-auto px-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-slate-500 hover:text-white mb-6 transition" data-testid="checkout-back-btn">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        <h1 className="text-2xl font-extrabold text-white mb-8" data-testid="checkout-title">Secure Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Order Summary */}
          <div className="md:col-span-3 space-y-4">
            <div className="bg-[#1e1e1e] rounded-none border border-white/10 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[#e10600]" /> Order Summary
              </h2>

              <div className="mb-5">
                <h3 className="font-bold text-white text-lg" data-testid="checkout-event-name">{event.title}</h3>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-400" data-testid="checkout-event-date">
                    <Calendar className="w-4 h-4 text-[#e10600]/70 flex-shrink-0" />
                    <span>{dateStr}</span>
                  </div>
                  {timeStr && (
                    <div className="flex items-center gap-2 text-sm text-slate-400" data-testid="checkout-event-time">
                      <Clock className="w-4 h-4 text-[#e10600]/70 flex-shrink-0" />
                      <span>{timeStr}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-slate-400" data-testid="checkout-event-venue">
                    <MapPin className="w-4 h-4 text-[#e10600]/70 flex-shrink-0" />
                    <span>{venueStr}</span>
                  </div>
                </div>
              </div>

              {/* Ticket Details */}
              <div className="border-t border-white/5 pt-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Ticket Details</p>
                <div className="bg-[#161620] border border-white/5 rounded p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Category</span>
                    <span className="text-white font-semibold" data-testid="checkout-category">{category}</span>
                  </div>
                  {blockInfo && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Block / Stand</span>
                      <span className="text-white font-semibold" data-testid="checkout-block">{blockInfo}</span>
                    </div>
                  )}
                  {sectionInfo && sectionInfo !== category && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Section</span>
                      <span className="text-white font-semibold" data-testid="checkout-section">{sectionInfo}</span>
                    </div>
                  )}
                  {rowInfo && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Row</span>
                      <span className="text-white font-semibold" data-testid="checkout-row">{rowInfo}</span>
                    </div>
                  )}
                  {seatInfo && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Seat</span>
                      <span className="text-white font-semibold" data-testid="checkout-seat">{seatInfo}</span>
                    </div>
                  )}
                  {!seatInfo && !rowInfo && !blockInfo && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Seating</span>
                      <span className="text-white font-semibold">Best Available · Assigned on confirmation</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Quantity</span>
                    <span className="text-white font-semibold">1x Ticket</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Entry Type</span>
                    <span className="text-white font-semibold">Ticket + Entry</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Delivery</span>
                    <span className="text-emerald-500 font-semibold">Instant QR (Email)</span>
                  </div>
                </div>

                {/* VIP PERKS BANNER */}
                {isVIP && (
                  <div className="mt-4 bg-gradient-to-br from-[#facc15]/15 via-[#b45309]/10 to-transparent border border-[#facc15]/40 p-4">
                    <p className="text-[11px] font-black text-[#facc15] uppercase tracking-[0.2em] mb-2">
                      🔥 VIP Experience Included
                    </p>
                    <ul className="space-y-1.5 text-xs text-white/90">
                      <li className="flex gap-2"><Check className="w-3.5 h-3.5 text-[#facc15] flex-shrink-0 mt-0.5"/><span>Premium padded seating in the best sector of the venue</span></li>
                      <li className="flex gap-2"><Check className="w-3.5 h-3.5 text-[#facc15] flex-shrink-0 mt-0.5"/><span>Private VIP lounge access · Gourmet food &amp; open bar</span></li>
                      <li className="flex gap-2"><Check className="w-3.5 h-3.5 text-[#facc15] flex-shrink-0 mt-0.5"/><span>Dedicated fast-track entrance · No queues</span></li>
                      <li className="flex gap-2"><Check className="w-3.5 h-3.5 text-[#facc15] flex-shrink-0 mt-0.5"/><span>Exclusive event programme &amp; welcome gift</span></li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-white/5 pt-4 mt-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Price Breakdown</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Ticket Price</span>
                    <span className="font-medium">&euro;{price}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Service Fee (10%)</span>
                    <span className="font-medium">&euro;{commission}</span>
                  </div>
                  <div className="flex justify-between text-lg font-extrabold text-white border-t border-white/5 pt-3 mt-2">
                    <span>Total</span>
                    <span className="text-emerald-500" data-testid="checkout-total">&euro;{total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Shield, label: "Buyer protection", sub: "Full refund if cancelled" },
                { icon: Zap, label: "QR ticket delivery", sub: "Tickets to your email" },
                { icon: Lock, label: "Secure Payment", sub: "256-bit SSL encryption" },
                { icon: CreditCard, label: "Stripe Powered", sub: "PCI DSS Level 1" },
              ].map((t, i) => (
                <div key={i} className="bg-[#1e1e1e] rounded-none border border-white/10 p-3 flex items-start gap-2.5">
                  <t.icon className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white">{t.label}</p>
                    <p className="text-[10px] text-slate-400">{t.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* VIP fire photos — show the experience buyers are paying for */}
            <VIPGallery eventType={event?.event_type || "match"} />
          </div>

          {/* Pay Button */}
          <div className="md:col-span-2">
            <div className="bg-[#1e1e1e] rounded-none border border-white/10 p-6 shadow-sm sticky top-24">
              <div className="text-center mb-5">
                <p className="text-sm text-slate-500 mb-1">You'll pay</p>
                <p className="text-4xl font-extrabold text-white" data-testid="checkout-pay-amount">&euro;{total}</p>
              </div>

              <button
                onClick={handleCheckout}
                disabled={processing}
                className="w-full py-4 bg-[#e10600] hover:bg-[#c10500] disabled:bg-[#e10600]/50 text-white font-bold rounded-none transition-all shadow-lg hover:shadow-xl text-lg"
                data-testid="checkout-pay-btn"
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Lock className="w-5 h-5" /> Pay &euro;{total} Securely
                  </span>
                )}
              </button>

              <div className="mt-4 space-y-2">
                {["Verified-seller listings", "Instant QR code delivery", "Full refund if event cancelled", "24/7 customer support"].map((t, i) => (
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
