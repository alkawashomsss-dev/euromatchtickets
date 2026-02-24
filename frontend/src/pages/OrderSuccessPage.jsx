import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { API } from "../App";
import { Check, Ticket, Calendar, MapPin, Download, Star, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { QRCodeSVG } from "qrcode.react";

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(true);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    const pollStatus = async () => {
      try {
        const response = await axios.get(`${API}/checkout/status/${sessionId}`, {
          withCredentials: true
        });
        
        if (response.data.payment_status === 'paid') {
          setOrder(response.data.order);
          setPolling(false);
          
          // Track Facebook Pixel - Purchase
          if (window.fbq && response.data.order) {
            window.fbq('track', 'Purchase', {
              content_name: response.data.order.event_title || 'Ticket',
              content_ids: [response.data.order.ticket_id],
              value: response.data.order.total_amount,
              currency: 'EUR'
            });
          }
          
          // Track Google Analytics - purchase
          if (window.gtag && response.data.order) {
            window.gtag('event', 'purchase', {
              transaction_id: response.data.order.order_id,
              value: response.data.order.total_amount,
              currency: 'EUR',
              items: [{
                item_id: response.data.order.ticket_id,
                item_name: response.data.order.event_title || 'Ticket',
                price: response.data.order.ticket_price
              }]
            });
          }
        } else if (response.data.status === 'expired') {
          setPolling(false);
        }
      } catch (error) {
        console.error("Error polling status:", error);
      } finally {
        setLoading(false);
      }
    };

    pollStatus();
    
    // Poll every 2 seconds if still processing
    const interval = setInterval(() => {
      if (polling) {
        pollStatus();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [sessionId, polling]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Processing your payment...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">Order not found or payment failed</p>
          <Link to="/events">
            <Button className="btn-secondary">Browse Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  const event = order.event;
  const ticket = order.ticket;
  const qrData = `FANPASS-${order.order_id}-${order.ticket_id}`;

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-zinc-400">Your ticket has been confirmed</p>
        </div>

        {/* Ticket Card */}
        <div className="bg-zinc-900/60 border border-white/5 rounded-3xl overflow-hidden mb-8">
          {/* Event Header */}
          <div className="p-6 border-b border-white/5">
            <h2 className="text-xl font-bold mb-2">{event?.title}</h2>
            {event?.subtitle && (
              <p className="text-zinc-400 text-sm mb-4">{event.subtitle}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-zinc-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{new Date(event?.event_date).toLocaleDateString('en-US', {
                  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>{event?.venue}, {event?.city}</span>
              </div>
            </div>
          </div>

          {/* Ticket Details */}
          <div className="p-6 border-b border-white/5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-zinc-500 text-sm">Category</span>
                <p className="font-semibold capitalize">{ticket?.category}</p>
              </div>
              <div>
                <span className="text-zinc-500 text-sm">Section</span>
                <p className="font-semibold">{ticket?.section}</p>
              </div>
              {ticket?.row && (
                <>
                  <div>
                    <span className="text-zinc-500 text-sm">Row</span>
                    <p className="font-semibold">{ticket.row}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-sm">Seat</span>
                    <p className="font-semibold">{ticket.seat}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* QR Code */}
          <div className="p-8 bg-white text-center">
            {order.qr_code ? (
              <img 
                src={`data:image/png;base64,${order.qr_code}`}
                alt="Ticket QR Code"
                className="w-48 h-48 mx-auto"
              />
            ) : (
              <QRCodeSVG 
                value={qrData}
                size={192}
                className="mx-auto"
              />
            )}
            <p className="text-zinc-600 text-sm mt-4">Order ID: {order.order_id}</p>
          </div>

          {/* Price Summary */}
          <div className="p-6 bg-zinc-900/80">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Total Paid</span>
              <span className="text-2xl font-bold">€{order.total_amount?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/my-tickets">
            <Button className="btn-accent w-full sm:w-auto">
              <Ticket className="w-4 h-4 mr-2" />
              View My Tickets
            </Button>
          </Link>
          <Link to="/events">
            <Button className="btn-secondary w-full sm:w-auto">
              Browse More Events
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Rate Seller */}
        <div className="mt-12 text-center">
          <p className="text-zinc-500 mb-4">Had a good experience? Rate the seller!</p>
          <div className="flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} className="p-1 hover:scale-110 transition-transform">
                <Star className="w-6 h-6 text-zinc-600 hover:text-purple-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
