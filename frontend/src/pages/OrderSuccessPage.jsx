import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { API } from "../App";
import { Check, Ticket, ArrowRight, PartyPopper, Shield } from "lucide-react";
import { Button } from "../components/ui/button";
import { ProfessionalTicket } from "../components/ProfessionalTicket";

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
          
          if (window.fbq && response.data.order) {
            window.fbq('track', 'Purchase', {
              content_name: response.data.order.event_title || 'Ticket',
              content_ids: [response.data.order.ticket_id],
              value: response.data.order.total_amount,
              currency: 'EUR'
            });
          }
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
    const interval = setInterval(() => {
      if (polling) pollStatus();
    }, 2000);
    return () => clearInterval(interval);
  }, [sessionId, polling]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(210,20%,98%)] pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Processing your payment...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[hsl(210,20%,98%)] pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Order not found or payment failed</p>
          <Link to="/events">
            <Button variant="outline">Browse Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(210,20%,98%)] pt-20" data-testid="order-success-page">
      <div className="max-w-[900px] mx-auto px-4 py-12">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Check className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2" data-testid="success-title">Payment Successful!</h1>
          <p className="text-slate-500">Your ticket has been confirmed and is ready</p>
        </div>

        {/* Professional Ticket */}
        <ProfessionalTicket order={order} />

        {/* Price Summary */}
        <div className="bg-white border border-slate-100 rounded-xl p-6 mt-6 max-w-md mx-auto">
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-500 text-sm">Ticket Price</span>
            <span className="text-white font-medium">{"\u20ac"}{order.ticket_price?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-500 text-sm">Service Fee</span>
            <span className="text-white font-medium">{"\u20ac"}{order.commission?.toFixed(2)}</span>
          </div>
          <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
            <span className="text-white font-semibold">Total Paid</span>
            <span className="text-2xl font-bold text-emerald-600">{"\u20ac"}{order.total_amount?.toFixed(2)}</span>
          </div>
        </div>

        {/* Trust Info */}
        <div className="flex items-center justify-center gap-2 mt-6 text-slate-400 text-sm">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>Protected by FanProtect Guarantee</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link to="/my-tickets">
            <Button className="bg-purple-600 hover:bg-purple-500 w-full sm:w-auto" data-testid="view-my-tickets-btn">
              <Ticket className="w-4 h-4 mr-2" />
              View My Tickets
            </Button>
          </Link>
          <Link to="/events">
            <Button variant="outline" className="border-slate-200 w-full sm:w-auto">
              Browse More Events
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
